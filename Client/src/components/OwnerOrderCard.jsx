// BiteRoute / Client / src / components / OwnerOrderCard.jsx
import { capitalizeFirstLetter, capitalizeWords } from "../utils/helper";
import { MdPhone } from "react-icons/md";
import { useForm } from "react-hook-form";
import { SelectInput } from "./FormInputs";

const OwnerOrderCard = ({ data }) => {
  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Preparing", value: "preparing" },
    { label: "Out of Delivery", value: "out of delivery" },
  ];

  const { control } = useForm({
    defaultValues: {
      status: data.shopOrders.status,
    },
  });

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

        {/* <select
          value={data.shopOrders.status}
          className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 text-primary"
        >
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out of delivery">Out of Delivery</option>
        </select> */}

        <SelectInput
          label="Status"
          name="status"
          control={control}
          options={statusOptions}
          className="w-40"
        />
      </div>

      <div className="text-right font-bold text-black text-sm">
        Total: LKR {data.shopOrders.subtotal}
      </div>
    </div>
  );
};

export default OwnerOrderCard;
