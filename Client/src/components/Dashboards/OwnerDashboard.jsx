import { useSelector } from "react-redux";
import Nav from "../Nav";
import { FaPen, FaUtensils } from "react-icons/fa6";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import OwnerItemCard from "../ownerItemCard";

const OwnerDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-bg overflow-y-auto">
      <Nav />
      {!myShopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-300 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-primary w-16 h-16 sm:w-20 sm:h-20 mb-4" />

              <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">
                Add Your Restaurant
              </h2>

              <p className="text-gray-500 mb-4 text-sm sm:text-base">
                Join our food delivery platform and reach thousands of hungry
                customers every day.
              </p>

              <Button
                className="bg-primary text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-hover transition-colors duration-200"
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}

      {myShopData && (
        <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl text-black flex items-center gap-3 mt-8 text-center">
            <FaUtensils className="text-primary w-14 h-14" />
            Welcome to {myShopData.name}
          </h1>

          <div className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden border border-gray-300 hover:shadow-2xl transition-all duration-300 relative">
            <div className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full shadow-md hover:bg-hover transition-colors cursor-pointer">
              <FaPen size={20} onClick={() => navigate("/create-edit-shop")} />
            </div>

            <img
              src={myShopData.image}
              alt={myShopData.name}
              className="w-full h-48 sm:h-64 object-cover"
            />

            <div className="p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-black mb-2">
                {myShopData.name}
              </h1>

              <p className="text-gray-500">
                {myShopData.city},{myShopData.state}
              </p>

              <p className="text-gray-500 mb-4">{myShopData.address}</p>
            </div>
          </div>

          {(myShopData?.items || []).length === 0 && (
            <div className="flex justify-center items-center p-4 sm:p-6">
              <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-300 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex flex-col items-center text-center">
                  <FaUtensils className="text-primary w-16 h-16 sm:w-20 sm:h-20 mb-4" />

                  <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">
                    Add Your Food Items
                  </h2>

                  <p className="text-gray-500 mb-4 text-sm sm:text-base">
                    Share your delicious creations with our customers by adding
                    them to the menu.
                  </p>

                  <Button
                    className="bg-primary text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-hover transition-colors duration-200"
                    onClick={() => navigate("/add-item")}
                  >
                    Add Food
                  </Button>
                </div>
              </div>
            </div>
          )}

          {myShopData.items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-col items-center w-full max-w-3xl">
              {myShopData.items.map((item, index) => (
                <OwnerItemCard data={item} key={index} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
