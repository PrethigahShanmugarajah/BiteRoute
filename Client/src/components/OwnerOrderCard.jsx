// BiteRoute / Client / src / components / OwnerOrderCard.jsx
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { SelectInput } from "./FormInputs";
import { capitalizeFirstLetter, capitalizeWords } from "../utils/helper";
import { MdPhone } from "react-icons/md";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";

const OwnerOrderCard = ({ data }) => {
  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Preparing", value: "preparing" },
    { label: "Out of Delivery", value: "out of delivery" },
  ];

  const isFirstRender = useRef(true);

  const { control, watch } = useForm({
    defaultValues: {
      status: data.shopOrders.status,
    },
  });

  const selectedStatus = watch("status");

  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const data = await api.post(
        API_ROUTES.ORDER.ORDER_UPDATE_STATUS(orderId, shopId),
        { status },
        { withCredentials: true }
      );

      console.log("Order Update Status API Response:", data.data);

      if (data.data.success) {
        toast.success(data.data.message);
        console.log("Order Update Status Success:", data.data.message);
      } else {
        toast.warn(data.data.message);
        console.log("Order Update Status Data Error:", data.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Order Update Status Error:", error);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (selectedStatus !== data.shopOrders.status) {
      handleUpdateStatus(data._id, data.shopOrders.shop._id, selectedStatus);
    }
  }, [selectedStatus]);

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-black">
          {capitalizeWords(data.user.fullName)}
        </h2>

        <p className="text-sm text-gray-500">{data.user.email}</p>
        <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <MdPhone /> <span>{data.user.mobile}</span>
        </p>
      </div>

      <div className="flex items-start gap-2 text-gray-500 text-sm">
        <p>{data?.deliveryAddress?.text}</p>

        <p>
          lat: {data?.deliveryAddress.latitude}, lon:{" "}
          {data?.deliveryAddress.longitude}
        </p>
      </div>

      <div className="flex space-x-4 overflow-x-auto mb-2">
        {data.shopOrders?.shopOrderItems?.map((item, index) => (
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
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-300">
        <span className="text-sm">
          Status:{" "}
          <span className="font-semibold text-primary">
            {capitalizeFirstLetter(data.shopOrders.status)}
          </span>
        </span>

        <SelectInput
          label="Status"
          name="status"
          control={control}
          options={statusOptions}
          className="mb-0 w-48"
        />
      </div>

      <div className="text-right font-bold text-black text-sm">
        Total: LKR {data.shopOrders.subtotal}
      </div>
    </div>
  );
};

export default OwnerOrderCard;
