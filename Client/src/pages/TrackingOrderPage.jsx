// BiteRoute / Client / src / pages / TrackingOrderPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_ROUTES from "../api/api_route";
import api from "../api/axios";
import { IoIosArrowRoundBack } from "react-icons/io";
import { capitalizeWords } from "../utils/helper";
import DeliveryPersonTracking from "../components/DeliveryPersonTracking";
import { toast } from "react-toastify";

const TrackingOrderPage = () => {
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState();
  const navigate = useNavigate();

  const handleGetOrder = async () => {
    try {
      const { data } = await api.get(
        API_ROUTES.ORDER.ORDER_GET_BY_ID(orderId),
        { withCredentials: true }
      );

      console.log("Fetch Order API Response:", data);

      if (data.success) {
        console.log("Fetch Order Success:", data.message);

        setCurrentOrder(data.order);
      } else {
        toast.error(data.message);
        console.log("Fetch Order Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Fetch Order Error:", error);
    }
  };

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div
        className="relative flex items-center gap-4 top-5 left-2 z-10 mb-2.5"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack
          size={35}
          className="text-primary cursor-pointer"
        />

        <h1 className="text-2xl font-bold md:text-center">Track Order</h1>
      </div>

      {currentOrder?.shopOrders?.map((shopOrder, index) => (
        <div className="bg-white p-4 rounded-2xl shadow-md border border-purple-100 space-y-4">
          <div>
            <p className="text-lg font-bold mb-2 text-primary">
              {shopOrder.shop.name}
            </p>

            <p className="font-semibold">
              <span>Items:</span>
              {shopOrder?.shopOrderItems?.map((i) => i.name).join(",")}
            </p>

            <p>
              <span className="font-semibold">Subtotals:</span>
              {shopOrder?.subtotal}
            </p>

            <p className="mt-6">
              <spa>Delivery address:</spa>
              {currentOrder?.deliveryAddress?.text}
            </p>
          </div>

          {shopOrder.status != "delivered" ? (
            <>
              {shopOrder.assignedDeliveryPerson ? (
                <div className="text-sm text-black">
                  <p className="font-semibold">
                    <span>Delivery Person Name:</span>{" "}
                    {capitalizeWords(shopOrder.assignedDeliveryPerson.fullName)}
                  </p>

                  <p className="font-semibold">
                    <span>Delivery Person Contact No:</span>{" "}
                    {shopOrder.assignedDeliveryPerson.mobile}
                  </p>
                </div>
              ) : (
                <p className="font-semibold">
                  Delivery Person is not assigned yet.
                </p>
              )}
            </>
          ) : (
            <p className="text-green-600 font-semibold text-lg">Delivered</p>
          )}

          {shopOrder?.assignedDeliveryPerson &&
            shopOrder?.status !== "delivered" && (
              <div className="h-100 w-full rounded-2xl overflow-hidden shadow-md">
                <DeliveryPersonTracking
                  data={{
                    deliveryPersonLocation: {
                      lat: shopOrder?.assignedDeliveryPerson?.location
                        ?.coordinates[1],
                      lon: shopOrder?.assignedDeliveryPerson?.location
                        ?.coordinates[0],
                    },

                    customerLocation: {
                      lat: currentOrder?.deliveryAddress?.latitude,
                      lon: currentOrder?.deliveryAddress?.longitude,
                    },
                  }}
                />
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default TrackingOrderPage;
