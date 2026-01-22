// BiteRoute / Client / src / components / Nav.jsx
import { useEffect, useState } from "react";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";
import { capitalizeFirstLetter, capitalizeWords } from "../utils/helper";
import { setSearchItems, setUserData } from "../redux/userSlice";
import { TbReceipt2 } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { Input } from "./FormInputs";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const { userData, currentCity, cartItems } = useSelector(
    (state) => state.user,
  );

  const { myShopData } = useSelector((state) => state.owner);

  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

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

  const handleSearchItems = async (value) => {
    try {
      const { data } = await api.get(
        API_ROUTES.ITEM.ITEM_SEARCH(value, currentCity),
        { withCredentials: true },
      );

      console.log("Fetch Search Items API Response:", data);

      if (data.success) {
        console.log("Fetch Search Items Success:", data.message);
        dispatch(setSearchItems(data.items));
        console.log("Dispatch Search Items:", data.items);
      } else {
        toast.error(data.message);
        console.log("Fetch Search Items Data Error:", data.message);
        dispatch(setSearchItems(null));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Fetch Search Items Error:", error);
    }
  };

  const searchValue = watch("search");
  console.log("Live Search Value:", searchValue);

  useEffect(() => {
    if (!searchValue || searchValue.trim() === "") {
      dispatch(setSearchItems(null));
      return;
    }

    const timeout = setTimeout(() => {
      handleSearchItems(searchValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchValue, currentCity, dispatch]);

  return (
    <div className="w-full h-20 flex items-center justify-between md:justify-center gap-7.5 px-5 fixed top-0 z-9999 bg-bg overflow-visible">
      {showSearch && userData.role == "user" && (
        <div className="w-[90%] h-12 bg-white shadow-xl rounded-lg items-center gap-5 flex fixed top-30 left-[5%] -mt-5">
          <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-300">
            <FaLocationDot size={25} className="text-primary" />
            <div className="w-[80%] truncate text-gray-500">{currentCity}</div>
          </div>

          <div className="w-[80%] flex items-center gap-2.5">
            <IoIosSearch size={25} className="text-primary" />

            <Input
              name="search"
              control={control}
              placeholder="Search delicious food..."
              errors={{}}
              className="mt-4 border-none focus:outline-none"
              noFocusRing={true}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  console.log("Search Query on Enter:", e.target.value);
                }
              }}
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

            <Input
              name="search"
              control={control}
              placeholder="Search delicious food..."
              errors={{}}
              className="mt-4 border-none focus:outline-none"
              noFocusRing={true}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  console.log("Search Query on Enter:", e.target.value);
                }
              }}
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
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus size={20} />
                  <span>Add Food Item</span>
                </Button>

                <Button
                  className="md:hidden flex items-center p-2! bg-primary/20 text-primary hover:bg-primary/30"
                  variant="custom"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus size={20} />
                </Button>
              </>
            )}

            <div
              className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium"
              onClick={() => navigate("/my-orders")}
            >
              <TbReceipt2 size={20} />
              <span>My Orders</span>
            </div>

            <div
              className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium"
              onClick={() => navigate("/my-orders")}
            >
              <TbReceipt2 size={20} />
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-primary rounded-full px-1.5 py-px">
                0
              </span>
            </div>
          </>
        ) : (
          <>
            {userData.role == "user" && (
              <div className="relative cursor-pointer">
                <FiShoppingCart
                  size={25}
                  className="text-primary"
                  onClick={() => navigate("/cart")}
                />
                <span className="absolute -right-2.25 -top-3 text-primary">
                  {cartItems.length}
                </span>
              </div>
            )}

            <div
              className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium"
              onClick={() => navigate("/my-orders")}
            >
              <TbReceipt2 size={20} />
              <span>My Orders</span>
            </div>

            <div
              className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium"
              onClick={() => navigate("/my-orders")}
            >
              <TbReceipt2 size={20} />
            </div>
          </>
        )}

        <div
          className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white text-4.5 shadow-xl font-semibold cursor-pointer"
          onClick={() => setShowInfo((prev) => !prev)}
        >
          {capitalizeFirstLetter(userData?.fullName.slice(0, 1))}
        </div>

        {showInfo && (
          <div
            className={`fixed top-28 right-2.5 md:right-[10%] ${
              userData?.role === "user"
                ? "lg:right-[10%]"
                : userData?.role === "owner"
                  ? "lg:right-[24%]"
                  : "lg:right-[30%]"
            } w-45 bg-white shadow-2xl rounded-xl p-5 flex flex-col gap-2.5 z-9999 -mt-12`}
          >
            <div className="text-[17px]">
              {capitalizeWords(userData?.fullName)}
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
