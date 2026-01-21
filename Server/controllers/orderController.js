// BiteRoute / Server / controllers / orderController.js
import DeliveryAssignment from "../models/deliveryAssignmentModel.js";
import Order from "../models/orderModel.js";
import Shop from "../models/shopModel.js";
import User from "../models/userModel.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* -------- Place Order -------- */
export const placeOrder = async (req, res) => {
  try {
    // const { cartItems, paymentMethod, deliveryAddress } = req.body;
    const { cartItems, paymentMethod, deliveryAddress, deliveryFee } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a complete delivery address",
      });
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
          0,
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
      }),
    );

    // const totalAmount = shopOrders.reduce(
    //   (sum, order) => sum + order.subtotal,
    //   0,
    // );

    const itemsTotal = shopOrders.reduce(
      (sum, order) => sum + order.subtotal,
      0,
    );

    const finalAmount = itemsTotal + Number(deliveryFee || 0);

    if (paymentMethod == "online") {
      const razorOrder = await instance.orders.create({
        // amount: Math.round(totalAmount * 100),
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      const newOrder = await Order.create({
        user: req.userId,
        paymentMethod,
        deliveryAddress,
        // totalAmount,
        totalAmount: finalAmount,
        shopOrders,
        razorpayOrderId: razorOrder.id,
        payment: false,
      });

      return res.status(200).json({
        success: true,
        message: "Order created successfully. Please complete the payment.",
        razorOrder,
        orderId: newOrder._id,
      });
    }

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      // totalAmount,
      totalAmount: finalAmount,
      deliveryFee: Number(deliveryFee || 0),
      shopOrders,
    });

    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "name image price",
    );
    await newOrder.populate("shopOrders.shop", "name");
    await newOrder.populate("shopOrders.shop", "name socketId");
    await newOrder.populate("user", "name email");

    const io = req.app.get("io");

    if (io) {
      newOrder.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner.socketId;

        if (ownerSocketId) {
          io.io(ownerSocketId).emit("newOrder", {
            _id: newOrder._id,
            paymentMethod: newOrder.paymentMethod,
            user: newOrder.user,
            shopOrders: shopOrder,
            createdAt: newOrder.createdAt,
            deliveryAddress: newOrder.deliveryAddress,
            payment: newOrder.payment,
          });
        }
      });
    }

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

/* -------- Verify Payment -------- */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, orderId } = req.body;
    const payment = await instance.payments.fetch(razorpay_payment_id);

    // if (!payment || payment.status != "captured") {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Payment not captured." });
    // }

    if (!payment) {
      return res
        .status(400)
        .json({ success: false, message: "Payment not found." });
    }

    if (payment.status !== "captured") {
      return res
        .status(400)
        .json({ success: false, message: "Payment not captured." });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.payment = true;
    order.razorPaymentId = razorpay_payment_id;
    await order.save();

    await order.populate("shopOrders.shopOrderItems.item", "name image price");
    await newOrder.populate("shopOrders.shop", "name");
    await newOrder.populate("shopOrders.shop", "name socketId");
    await newOrder.populate("user", "name email");

    const io = req.app.get("io");

    if (io) {
      newOrder.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner.socketId;

        if (ownerSocketId) {
          io.io(ownerSocketId).emit("newOrder", {
            _id: order._id,
            paymentMethod: order.paymentMethod,
            user: order.user,
            shopOrders: shopOrder,
            createdAt: order.createdAt,
            deliveryAddress: order.deliveryAddress,
            payment: order.payment,
          });
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully!",
      order,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: `Verify Payment Error: ${error.message}`,
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
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("shopOrders.assignedDeliveryPerson", "fullName mobile");

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders: order.shopOrders.find((o) => o.owner._id == req.userId),
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
        payment: order.payment,
        totalAmount: order.totalAmount || 0,
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
        (b) => !busyIdSet.has(String(b._id)),
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

      shopOrder.assignedDeliveryPerson =
        deliveryAssignment.assignedTo[0] || null;
      shopOrder.assignment = deliveryAssignment._id;

      deliveryPersonsPayload = availablePersons.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }));

      await deliveryAssignment.populate("order");
      await deliveryAssignment.populate("shop");

      const io = req.app.get("io");
      if (io) {
        availablePersons.forEach((person) => {
          const personSocketId = person.socketId;
          if (personSocketId) {
            io.to(personSocketId).emit("newAssignment", {
              sendTo: person._id,
              assignmentId: deliveryAssignment._id,
              status: deliveryAssignment.status,
              orderId: deliveryAssignment.order._id,
              shopName: deliveryAssignment.shop.name,
              deliveryAddress: deliveryAssignment.order.deliveryAddress,
              items:
                deliveryAssignment.order.shopOrders.find((so) =>
                  so._id.equals(deliveryAssignment.shopOrderId),
                )?.shopOrderItems || [],
              subtotal:
                deliveryAssignment.order.shopOrders.find((so) =>
                  so._id.equals(deliveryAssignment.shopOrderId),
                )?.subtotal || [],
            });
          }
        });
      }
    }

    await shopOrder.save();
    await order.save();

    const updatedShopOrder = order.shopOrders.find((o) => o.shop == shopId);

    await order.populate("shopOrders.shop", "name");
    await order.populate(
      "shopOrders.assignedDeliveryPerson",
      "fullName email mobile",
    );
    await order.populate("user", "socketId");

    const io = req.app.get("io");
    if (io) {
      const userSocketId = order.user.socketId;
      if (userSocketId) {
        io.to(userSocketId).emit("update-status", {
          orderId: order._id,
          shopId: updatedShopOrder.shop._id,
          status: updatedShopOrder.status,
          userId: order.user._id,
        });
      }
    }

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
      status: a.status,
      orderId: a.order._id,
      shopName: a.shop.name,
      deliveryAddress: a.order.deliveryAddress,
      items:
        a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId))
          ?.shopOrderItems || [],
      subtotal:
        a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId))
          ?.subtotal || [],
      totalAmount: a.order.totalAmount || 0,
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

/* -------- Accept Order -------- */
export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssignment.findById(assignmentId);

    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    if (assignment.status !== "brodcasted") {
      return res
        .status(409)
        .json({ success: false, message: "Assignment has expired" });
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: { $in: ["assigned"] },
    });

    if (alreadyAssigned) {
      return res.status(409).json({
        success: false,
        message: "You are already assigned to another order",
      });
    }

    assignment.assignedTo = req.userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    let shopOrder = order.shopOrders.id(assignment.shopOrderId);
    shopOrder.assignedDeliveryPerson = req.userId;
    await order.save();

    return res
      .status(200)
      .json({ success: true, message: "Order accepted successfully!", order });
  } catch (error) {
    console.error("Accept Order Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to accept order",
      error: `Accept Order Error: ${error.message}`,
    });
  }
};

/* -------- Get Current Order -------- */
export const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: "assigned",
    })
      .populate("shop", "name")
      .populate("assignedTo", "fullName email mobile location")
      .populate({
        path: "order",
        populate: [{ path: "user", select: "fullName email location mobile" }],
      });

    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery assignment not found" });
    }

    if (!assignment.order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const shopOrder = assignment.order.shopOrders.find(
      (so) => String(so._id) == String(assignment.shopOrderId),
    );

    if (!shopOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Shop order not found" });
    }

    let deliveryPersonLocation = { lat: null, lon: null };

    // if (assignment.assignedTo?.location?.coordinates?.length === 2) {
    //   deliveryPersonLocation.lat =
    //     assignment.assignedTo.location.coordinates[1];
    //   deliveryPersonLocation.lon =
    //     assignment.assignedTo.location.coordinates[0];
    // }

    if (assignment.assignedTo?.[0]?.location?.coordinates?.length === 2) {
      deliveryPersonLocation.lat =
        assignment.assignedTo[0].location.coordinates[1];
      deliveryPersonLocation.lon =
        assignment.assignedTo[0].location.coordinates[0];
    }

    let customerLocation = { lat: null, lon: null };
    if (assignment.order.deliveryAddress) {
      customerLocation.lat = assignment.order.deliveryAddress.latitude;
      customerLocation.lon = assignment.order.deliveryAddress.longitude;
    }

    return res.status(200).json({
      success: true,
      message: "Current order fetched successfully!",
      _id: assignment.order._id,
      user: assignment.order.user,
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
      totalAmount: assignment.order.totalAmount || 0,
      deliveryPersonLocation,
      customerLocation,
    });
  } catch (error) {
    console.error("Get Current Order Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get current order",
      error: `Get Current Order Error: ${error.message}`,
    });
  }
};

/* -------- Get Order By Id -------- */
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({ path: "shopOrders.shop", model: "Shop" })
      .populate({ path: "shopOrders.assignedDeliveryPerson", model: "User" })
      .populate({ path: "shopOrders.shopOrderItems.item", model: "Item" })
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Order fetched successfully!", order });
  } catch (error) {
    console.error("Get Order By Id Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: `Get Order By Id Error: ${error.message}`,
    });
  }
};

/* -------- Send Delivery OTP -------- */
export const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.body;
    const order = await Order.findById(orderId).populate("user");
    const shopOrder = order.shopOrders.id(shopOrderId);

    if (!order || !shopOrder) {
      return res.status(400).json({
        success: false,
        message: "Enter valid order ID or shop order ID",
      });
    }

    if (!order.user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found for this order" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = Date.now() + 5 * 60 * 1000;

    await order.save();
    await sendDeliveryOtpMail(order.user, otp);

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${order?.user.fullName}`,
      otp,
    });
  } catch (error) {
    console.error("Send Delivery OTP Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send delivery OTP",
      error: `Send Delivery OTP Error: ${error.message}`,
    });
  }
};

/* -------- Verify Delivery OTP -------- */
export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;
    const order = await Order.findById(orderId)
      .populate("user")
      .populate("shopOrders.assignedDeliveryPerson");

    const shopOrder = order.shopOrders.id(shopOrderId);

    if (!order || !shopOrder) {
      return res
        .status(400)
        .json({ success: false, message: "Enter valid order / shopOrder ID" });
    }

    if (!shopOrder.deliveryOtp) {
      return res
        .status(400)
        .json({ success: false, message: "OTP not generated yet." });
    }

    if (shopOrder.deliveryOtp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect OTP." });
    }

    if (!shopOrder.otpExpires || shopOrder.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired." });
    }

    shopOrder.status = "delivered";
    shopOrder.deliveredAt = Date.now();
    await order.save();

    await DeliveryAssignment.deleteOne({
      shopOrderId: shopOrder._id,
      order: order._id,
      assignedTo: shopOrder.assignedDeliveryPerson,
    });

    return res.status(200).json({
      success: true,
      message: "Order delivered successfully!",
      deliveryDetails: {
        deliveryPerson: {
          name: shopOrder.assignedDeliveryPerson.fullName,
          mobile: shopOrder.assignedDeliveryPerson.mobile,
        },
        customer: {
          name: order.user.fullName,
          mobile: order.user.mobile,
        },
        deliveryAddress: order.deliveryAddress.text,
      },
      orderId: order._id,
      shopOrderId: shopOrder._id,
      deliveredAt: shopOrder.deliveredAt,
    });
  } catch (error) {
    console.error("Verify Delivery OTP Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to verify delivery OTP",
      error: `Verify Delivery OTP Error: ${error.message}`,
    });
  }
};
