// BiteRoute / Client / src / components / OwnerItemCard.jsx
import { useState } from "react";
import { FaPen } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../utils/helper";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";
import { toast } from "react-toastify";
import DeletePopup from "./DeletePopup";

const OwnerItemCard = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteItem = async (itemId) => {
    try {
      setLoading(true);

      const response = await api.delete(API_ROUTES.ITEM.ITEM_DELETE(itemId), {
        withCredentials: true,
      });

      const data = response.data;

      console.log("Delete Item API Response:", data);

      if (data?.success) {
        toast.success(data.message);
        console.log("Delete Item Success:", data.message);

        dispatch(setMyShopData(data.shop));
        console.log("Delete ItemDispatch:", data.shop);

        setShowDelete(false);
      } else {
        toast.warn(data?.message);
        console.log("Delete Item Data Error:", data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Delete Item Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden border border-gray-300 w-full max-w-2xl hover:shadow-2xl">
      <div className="w-36 shrink-0 bg-gray-50">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-between p-3 flex-1">
        <div>
          <h2 className="text-base font-semibold text-primary">{data.name}</h2>

          <p>
            <span className="font-medium text-gray-500">Category:</span>
            {data.category}
          </p>

          <p>
            <span className="font-medium text-gray-500">Food Type:</span>
            {capitalizeFirstLetter(data.foodType)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-primary font-bold">{data.price}</div>

          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-full hover:bg-primary/10 text-hover cursor-pointer"
              onClick={() => navigate(`/update-item/${data._id}`)}
            >
              <FaPen size={16} />
            </div>

            <div
              className="p-2 rounded-full hover:bg-primary/10 text-hover cursor-pointer"
              // onClick={() => handleDeleteItem(data._id)}
              onClick={() => setShowDelete(true)}
            >
              <FaTrashAlt size={16} />
            </div>
          </div>

          {showDelete && (
            <DeletePopup
              onClose={() => setShowDelete(false)}
              onDelete={() => handleDeleteItem(data._id)}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;
