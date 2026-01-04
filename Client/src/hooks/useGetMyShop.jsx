// BiteRoute / Client / src / hooks / useGetMyShop.jsx
import { useEffect } from "react";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

function useGetMyShop() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const { data } = await api.get(API_ROUTES.SHOP.SHOP_GET_MY, {
          withCredentials: true,
        });

        console.log("Fetch Shop API Response:", data);

        if (data.success) {
          console.log("Fetch Shop Success:", data.message);
          dispatch(setMyShopData(data.shop));

          console.log("Dispatch Shop:", data.shop);
        } else {
          toast.error(data.message);
          console.log("Fetch Shop Data Error:", error.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
        console.log("Fetch Shop Error:", error);
      }
    };
    fetchShop();
  }, [dispatch]);
}

export default useGetMyShop;
