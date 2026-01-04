// BiteRoute / Client / src / components / Nav.jsx
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";
import { capitalizeFirstLetter, capitalizeWords } from "../utils/helper";
import { setUserData } from "../redux/userSlice";
import { TbReceipt2 } from "react-icons/tb";

const Nav = () => {
  const { userData, currentCity } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);

  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const { data } = await api.get(API_ROUTES.AUTH.AUTH_SIGNOUT, {
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message);
        console.log("Sign Out Success:", data.message);

        dispatch(setUserData(null));
      } else {
        toast.warn(data.message);
        console.log("Sign Out Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Sign Out Error:", error);
    }
  };

  return (
    <div className="w-full h-45 flex items-center justify-between md:justify-center gap-7.5 px-5 fixed top-0 z-9999 bg-bg overflow-visible">
      {showSearch && userData.role == "user" && (
        <div className="w-[90%] h-12 bg-white shadow-xl rounded-lg items-center gap-5 flex fixed top-30 left-[5%]">
          <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-300">
            <FaLocationDot size={25} className="text-primary" />
            <div className="w-[80%] truncate text-gray-500">{currentCity}</div>
          </div>

          <div className="w-[80%] flex items-center gap-2.5">
            <IoIosSearch size={25} className="text-primary" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="px-2.5 placeholder-gray-400 outline-0 w-full"
            />
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2 text-primary">BiteRoute</h1>

      {userData.role == "user" && (
        <div className="md-w-[60%] lg:w-[40%] h-12 bg-white shadow-xl rounded-lg items-center gap-5 hidden md:flex">
          <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-300">
            <FaLocationDot size={25} className="text-primary" />
            <div className="w-[80%] truncate text-gray-500">{currentCity}</div>
          </div>

          <div className="w-[80%] flex items-center gap-2.5">
            <IoIosSearch size={25} className="text-primary" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="px-2.5 placeholder-gray-400 outline-0 w-full"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        {userData.role == "user" &&
          (showSearch ? (
            <RxCross2
              size={25}
              className="text-primary md:hidden cursor-pointer"
              onClick={() => setShowSearch(false)}
            />
          ) : (
            <IoIosSearch
              size={25}
              className="text-primary md:hidden cursor-pointer"
              onClick={() => setShowSearch(true)}
            />
          ))}

        {userData.role == "owner" ? (
          <>
            {myShopData && (
              <>
                <Button
                  className="hidden md:flex items-center bg-primary/20 text-primary hover:bg-primary/30 p-2!"
                  variant="custom"
                >
                  <FaPlus size={20} />
                  <span>Add Food Item</span>
                </Button>

                <Button
                  className="md:hidden flex items-center p-2! bg-primary/20 text-primary hover:bg-primary/30"
                  variant="custom"
                >
                  <FaPlus size={20} />
                </Button>
              </>
            )}

            <div className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium">
              <TbReceipt2 size={20} />
              <span>My Orders</span>
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-primary rounded-full px-1.5 py-px">
                0
              </span>
            </div>
            <div className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium">
              <TbReceipt2 size={20} />
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-primary rounded-full px-1.5 py-px">
                0
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="relative cursor-pointer">
              <FiShoppingCart size={25} className="text-primary" />
              <span className="absolute -right-2.25 -top-3 text-primary">
                0
              </span>
            </div>

            <Button
              className="hidden md:block px-3! py-1! bg-primary/20 text-primary hover:bg-primary/30"
              variant="custom"
            >
              My Orders
            </Button>
          </>
        )}

        <div
          className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white text-4.5 shadow-xl font-semibold cursor-pointer"
          onClick={() => setShowInfo((prev) => !prev)}
        >
          {capitalizeFirstLetter(userData?.fullName.slice(0, 1))}
        </div>

        {showInfo && (
          <div className="fixed top-28 right-2.5 md:right-[10%] lg:right-[10%] w-45 bg-white shadow-2xl rounded-xl p-5 flex flex-col gap-2.5 z-9999">
            <div className="text-[17px]">
              {capitalizeWords(userData?.fullName)}
            </div>

            <div className="md:hidden text-primary cursor-pointer">
              My Orders
            </div>

            <div className="text-primary cursor-pointer" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
