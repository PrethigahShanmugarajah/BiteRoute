// BiteRoute / Server / controllers / orderController.js
import DeliveryAssignment from "../models/deliveryAssignmentModel.js";
import Order from "../models/orderModel.js";
import Shop from "../models/shopModel.js";
import User from "../models/userModel.js";

/* -------- Place Order -------- */
export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Send complete delivery address" });
    }

    const groupItemsByShop = {};

    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          return res
            .status(400)
            .json({ success: false, message: "Shop not found" });
        }

        const items = groupItemsByShop[shopId];
        const subtotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopOrderItems: items.map((i) => ({
            item: i.id,
            price: i.price,
            quantity: i.quantity,
            name: i.name,
          })),
        };
      })
    );

    const totalAmount = shopOrders.reduce(
      (sum, order) => sum + order.subtotal,
      0
    );

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "name image price"
    );

    await newOrder.populate("shopOrders.shop", "name");

    return res
      .status(201)
      .json({ success: true, message: "Order placed successfully!", newOrder });
  } catch (error) {
    console.error("Place Order Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: `Place Order Error: ${error.message}`,
    });
  }
};

/* -------- Get My Orders -------- */
export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role == "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      return res.status(200).json({
        success: true,
        message: "User orders fetched successfully!",
        orders,
      });
    } else if (user.role == "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders: order.shopOrders.find((o) => o.owner._id == req.userId),
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
      }));

      return res.status(200).json({
        success: true,
        message: "Owner orders fetched successfully!",
        orders: filteredOrders,
      });
    }
  } catch (error) {
    let logMessage = "Get Orders Error";
    let responseMessage = "Failed to fetch orders";

    if (req.userRole === "user") {
      logMessage = "Get User Orders Error";
      responseMessage = "Failed to fetch user orders";
    } else if (req.userRole === "owner") {
      logMessage = "Get Owner Orders Error";
      responseMessage = "Failed to fetch owner orders";
    }

    console.error(`${logMessage}:`, error.message);

    return res.status(500).json({
      success: false,
      message: responseMessage,
      error: `${logMessage}: ${error.message}`,
    });
  }
};

/* -------- Update Order Status -------- */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);

    const shopOrder = order.shopOrders.find((o) => o.shop == shopId);
    if (!shopOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Shop order not found" });
    }

    shopOrder.status = status;
    let deliveryPersonsPayload = [];

    if (status == "out of delivery" || !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;
      const nearByDeliveryPersons = await User.find({
        role: "deliveryPerson",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 5000,
          },
        },
      });

      const nearByIds = nearByDeliveryPersons.map((b) => b._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $in: ["brodcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((id) => String(id)));

      const availablePersons = nearByDeliveryPersons.filter(
        (b) => !busyIdSet.has(String(b._id))
      );
      const candidates = availablePersons.map((b) => b._id);

      if (candidates.length == 0) {
        await order.save();
        return res.status(200).json({
          success: false,
          message:
            "Order status updated, but there are no available delivery persons!",
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        brodcastedTo: candidates,
        status: "brodcasted",
      });

      shopOrder.assignedDeliveryPerson = deliveryAssignment.assignedTo;
      shopOrder.assignment = deliveryAssignment._id;

      deliveryPersonsPayload = availablePersons.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }));
    }

    await shopOrder.save();
    await order.save();

    const updatedShopOrder = order.shopOrders.find((o) => o.shop == shopId);

    await order.populate("shopOrders.shop", "name");
    await order.populate(
      "shopOrders.assignedDeliveryPerson",
      "fullName email mobile"
    );

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      shopOrder: updatedShopOrder,
      assignedDeliveryPerson: updatedShopOrder?.assignedDeliveryPerson,
      availablePersons: deliveryPersonsPayload,
      assignment: updatedShopOrder?.assignment._id,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: `Update Order Status Error: ${error.message}`,
    });
  }
};

/* -------- Get Delivery Person Assignment -------- */
export const getDeliveryPersonAssignment = async (req, res) => {
  try {
    const deliveryPersonId = req.userId;
    const assignments = await DeliveryAssignment.find({
      brodcastedTo: deliveryPersonId,
      status: "brodcasted",
    })
      .populate("order")
      .populate("shop");

    if (!assignments || assignments.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders assigned",
      });
    }

    const formated = assignments.map((a) => ({
      assignmentId: a._id,
      orderId: a.order._id,
      shopName: a.shop.name,
      deliveryAddress: a.order.deliveryAddress,
      items:
        a.order.shopOrders.find((so) => so._id == a.shopOrderId)
          .shopOrderItems || [],
      subtotal:
        a.order.shopOrders.find((so) => so._id == a.shopOrderId).subtotal || [],
    }));

    return res.status(200).json({
      success: true,
      message: "Assignments fetched successfully!",
      formated,
    });
  } catch (error) {
    console.error("Get Delivery Person Assignment Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get delivery person assignment",
      error: `Get Delivery Person Assignment Error: ${error.message}`,
    });
  }
};
