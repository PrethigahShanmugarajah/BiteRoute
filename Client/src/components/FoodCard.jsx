import { useState } from "react";
import {
  FaDrumstickBite,
  FaLeaf,
  FaMinus,
  FaPlus,
  FaRegStar,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";

const FoodCard = ({ data }) => {
  const [quantity, setQuantity] = useState(0);

  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar className="text-yellow-500 text-lg" />
        ) : (
          <FaRegStar className="text-yellow-500 text-lg" />
        ),
      );
    }

    return stars;
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
    }
  };

  return (
    <div className="w-62.5 rounded-2xl border-2 border-gray-300 bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative w-full h-42.5 flex justify-center items-center bg-white">
        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
          {data.foodType == "veg" ? (
            <FaLeaf className="text-green-600" />
          ) : (
            <FaDrumstickBite className="text-red-600" />
          )}
        </div>

        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex-1 flex flex-col p-4">
        <h1 className="font-semibold text-black text-base truncate">
          {data.name}
        </h1>

        <div className="flex items-center gap-1 mt-1">
          {renderStars(data.rating?.average || 0)}
          <span className="text-xs text-gray-500">
            {data.rating?.count || 0}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto p-4">
        <span className="font-bold text-black text-lg"> LKR {data.price}</span>

        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm">
          <button className="px-2 py-1 hover:bg-gray-100 transition">
            <FaMinus size={12} onClick={handleDecrease} />
          </button>

          <span>{quantity}</span>

          <button className="px-2 py-1 hover:bg-gray-100 transition">
            <FaPlus size={12} onClick={handleIncrease} />
          </button>

          <button
            className={`${
              cartItems.some((i) => i.id == data._id)
                ? "bg-gray-500"
                : "bg-primary"
            } text-white px-3 py-2 transition-colors`}
          >
            <FaShoppingCart
              size={16}
              onClick={() => {
                quantity > 0
                  ? dispatch(
                      addToCart({
                        id: data._id,
                        name: data.name,
                        price: data.price,
                        image: data.image,
                        shop: data.shop,
                        quantity,
                        foodType: data.foodType,
                      }),
                    )
                  : null;
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
