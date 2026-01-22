import { FaMinus, FaPlus } from "react-icons/fa";
import { TbTrash } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { removeCartItem, updateQuantity } from "../redux/userSlice";

const CartItemCard = ({ data }) => {
  const dispatch = useDispatch();

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow border border-gray-300">
      <div className="flex items-center gap-4">
        <img
          src={data.image}
          alt=""
          className="w-20 h-20 object-cover rounded-lg border border-gray-300"
        />

        <div>
          <h1 className="font-medium text-black">{data.name}</h1>
          <p className="text-sm text-gray-500">
            LKR {data.price}x{data.quantity}
          </p>

          <p className="font-bold text-black">
            LKR {data.price * data.quantity}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          onClick={() => handleDecrease(data.id, data.quantity)}
        >
          <FaMinus size={12} />
        </button>

        <span>{data.quantity}</span>

        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <FaPlus
            size={12}
            onClick={() => handleIncrease(data.id, data.quantity)}
          />
        </button>

        <button
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
          onClick={() => dispatch(removeCartItem(data.id))}
        >
          <TbTrash size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
