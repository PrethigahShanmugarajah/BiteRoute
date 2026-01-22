import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { capitalizeAll, capitalizeWords, formatDate } from "../utils/helper";
import Button from "./Button";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

const UserOrderCard = ({ data }) => {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState({});

  const handleRating = async (itemId, rating) => {
    try {
      const { data } = await api.post(
        API_ROUTES.ITEM.ITEM_ADD_RATING,
        { itemId, rating },
        {
          withCredentials: true,
        },
      );

      console.log("Add Rating API Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Add Rating Success:", data.message);

        setSelectedRating((prev) => ({ ...prev, [itemId]: rating }));
      } else {
        toast.warn(data.message);
        console.log("Add Rating Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Add Rating Error:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex justify-between border-b pb-2 border-gray-300">
        <div>
          <p className="font-semibold">Order #{data._id.slice(-6)}</p>
          <p className="text-sm text-gray-500">
            Date: {formatDate(data.createdAt)}
          </p>
        </div>

        <div className="text-right">
          {data.paymentMethod == "cod" ? (
            <p className="text-sm text-gray-500">
              {capitalizeAll(data?.paymentMethod)}
            </p>
          ) : (
            <p className="text-sm text-black font-semibold">
              Payment:{" "}
              <span
                className={data?.payment ? "text-green-500" : "text-red-500"}
              >
                {capitalizeAll(data?.payment ? "true" : "false")}
              </span>
            </p>
          )}

          <p
            className={`font-medium ${
              data.shopOrders?.[0].status?.toLowerCase() === "delivered"
                ? "text-green-600"
                : "text-blue-600"
            }`}
          >
            {capitalizeWords(data.shopOrders?.[0].status)}
          </p>
        </div>
      </div>

      {data.shopOrders.map((shopOrder, index) => (
        <div
          className="border border-gray-300 rounded-lg p-3 bg-bg space-y-3"
          key={index}
        >
          <p>{shopOrder.shop.name}</p>

          <div className="flex space-x-4 overflow-x-auto mb-2">
            {shopOrder.shopOrderItems.map((item, index) => (
              <div
                key={index}
                className="shrink-0 w-40 border border-gray-300 rounded-lg p-2 bg-white"
              >
                <img
                  src={item.item.image}
                  alt=""
                  className="w-full h-24 object-cover rounded"
                />

                <p className="text-sm font-semibold mt-1">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity}x LKR {item.price}
                </p>

                {shopOrder.status == "delivered" && (
                  <div className="flex space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        className={`${selectedRating[item.item._id] >= star ? "text-yellow-400" : "text-gray-400"}`}
                        onClick={() => handleRating(item.item._id, star)}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t border-gray-300 pt-2">
            <p className="font-semibold">Subtotal: LKR {shopOrder.subtotal}</p>

            <span
              className={`text-sm font-medium ${
                shopOrder.status.toLowerCase() === "delivered"
                  ? "text-green-600"
                  : "text-blue-600"
              }`}
            >
              {capitalizeWords(shopOrder.status)}
            </span>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center border-t border-gray-300 pt-2">
        <p className="font-semibold">Total: {data.totalAmount}</p>
        <Button
          className="px-4! text-sm"
          onClick={() => navigate(`/track-order/${data._id}`)}
        >
          Track Order
        </Button>
      </div>
    </div>
  );
};

export default UserOrderCard;
