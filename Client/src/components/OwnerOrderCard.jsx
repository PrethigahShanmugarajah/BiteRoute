// BiteRoute / Client / src / components / OwnerOrderCard.jsx
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { SelectInput } from "./FormInputs";
import {
  capitalizeAll,
  capitalizeFirstLetter,
  capitalizeWords,
} from "../utils/helper";
import { MdPhone } from "react-icons/md";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";

const OwnerOrderCard = ({ data }) => {
  const [availablePersons, setAvailablePersons] = useState([]);

  const dispatch = useDispatch();

  const statusOptions = [
    { label: "Change", value: "" },
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
      const response = await api.post(
        API_ROUTES.ORDER.ORDER_UPDATE_STATUS(orderId, shopId),
        { status },
        { withCredentials: true },
      );

      console.log("Order Update Status API Response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        console.log("Order Update Status Success:", response.data.message);
        dispatch(updateOrderStatus({ orderId, shopId, status }));
        console.log("Order Update Status Dispatch:", {
          orderId,
          shopId,
          status,
        });
        setAvailablePersons(response.data.availablePersons);
      } else {
        toast.warn(data.data.message);
        console.log("Order Update Status Data Error:", response.data.message);
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

  console.log("Payment:", data);

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

        {data.paymentMethod == "online" ? (
          <p className="text-sm text-black font-semibold">
            Payment:{" "}
            <span className={data?.payment ? "text-green-500" : "text-red-500"}>
              {capitalizeAll(data?.payment ? "true" : "false")}
            </span>
          </p>
        ) : (
          <p gap-2 text-sm text-gray-500>
            Payment Method: {capitalizeAll(data.paymentMethod)}
          </p>
        )}
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
            {capitalizeWords(data.shopOrders.status)}
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

      {/* {data.shopOrders.status == "out of delivery" && (
        <div className="mt-3 p-2 border border-gray-300 rounded-lg text-sm bg-purple-50">
          {data.shopOrders.assignedDeliveryPerson ? (
            <p>Assigned Delivery Person:</p>
          ) : (
            <p>Available Delivery Persons:</p>
          )}
          {availablePersons?.length > 0 ? (
            availablePersons?.map((b, index) => {
              <div className="text-gray-300">
                {capitalizeFirstLetter(b.fullName)} - {b.mobile}
              </div>;
            })
          ) : data.shopOrders.assignedDeliveryPerson ? (
            <div>
              {capitalizeWords(data.shopOrders.assignedDeliveryPerson.fullName)}{" "}
              - {data.shopOrders.assignedDeliveryPerson.mobile}
            </div>
          ) : (
            <div>Waiting for delivery person to accept</div>
          )}
        </div>
      )} */}

      {data.shopOrders.status == "out of delivery" && (
        <div className="mt-3 p-2 border border-gray-300 rounded-lg text-sm bg-purple-50">
          {data.shopOrders.assignedDeliveryPerson ? (
            <p>Assigned Delivery Person:</p>
          ) : (
            <p>Available Delivery Persons:</p>
          )}
          {availablePersons?.length > 0 ? (
            availablePersons?.map((b, index) => (
              <div
                key={index}
                className="text-black py-2 border-b border-gray-300 last:border-b-0"
              >
                <p className="font-semibold">
                  {capitalizeWords(b.fullName)} - {b.mobile}
                </p>
              </div>
            ))
          ) : data.shopOrders.assignedDeliveryPerson ? (
            <div className="text-black py-2">
              <p className="font-semibold">
                {capitalizeWords(
                  data.shopOrders.assignedDeliveryPerson.fullName,
                )}{" "}
                - {data.shopOrders.assignedDeliveryPerson.mobile}
              </p>
            </div>
          ) : (
            <div className="text-gray-500">
              Waiting for delivery person to accept
            </div>
          )}
        </div>
      )}

      {/* <div className="text-right font-bold text-black text-sm">
        Total: LKR {data.shopOrders.subtotal}
      </div> */}

      <div className="text-right font-bold text-black text-sm">
        <div className="text-xs text-gray-600 font-normal mb-1">
          Subtotal: LKR {data.shopOrders.subtotal}
        </div>

        <div className="border-t border-gray-300 mt-2 pt-2">
          Total: LKR {data.totalAmount || 0}
        </div>
      </div>
    </div>
  );
};

export default OwnerOrderCard;
