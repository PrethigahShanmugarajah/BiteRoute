// BiteRoute / Client / src / pages / Shop.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { FaArrowLeft, FaStore, FaUtensils } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import FoodCard from "../components/FoodCard";
import Button from "../components/Button";

const Shop = () => {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState([]);

  const navigate = useNavigate();

  const handleShop = async () => {
    try {
      const { data } = await api.get(API_ROUTES.ITEM.ITEM_GET_BY_SHOP(shopId), {
        withCredentials: true,
      });

      console.log("Fetch Item By Shop API Response:", data);

      if (data.success) {
        console.log("Fetch Item By Shop Success:", data.message);
        setShop(data.shop);
        setItems(data.items);
      } else {
        toast.error(data.message);
        console.log("Fetch Item By Shop Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Fetch Item By Shop Error:", error);
    }
  };

  useEffect(() => {
    handleShop();
  }, [shopId]);

  return (
    <div className="min-h-screen bg-bg">
      <Button
        className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-3!"
        onClick={() => navigate("/")}
        variant="custom"
      >
        <FaArrowLeft /> <span>Back</span>
      </Button>

      {shop && (
        <div className="relative w-full h-64 md:h-80 lg:h-96">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4">
            <FaStore className="text-white text-4xl mb-3 drop-shadow-md" />

            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              {shop.name}
            </h1>

            <div className="flex items-center gap-2.5">
              <FaLocationDot size={22} color="red" />

              <p className="text-lg font-medium text-white mt-2.5">
                {shop.address}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-10 text-black">
          <FaUtensils className="text-primary" /> Our Menu
        </h2>

        {items.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {items.map((item) => (
              <FoodCard data={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No Items Available
          </p>
        )}
      </div>
    </div>
  );
};

export default Shop;
