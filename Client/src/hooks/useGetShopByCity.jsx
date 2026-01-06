// BiteRoute / Client / src / hooks / useGetShopByCity.jsx
import { useEffect } from "react";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";
import { setShopsInMyCity } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

function useGetShopByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentCity) return;

    const fetchShops = async () => {
      try {
        const { data } = await api.get(
          API_ROUTES.SHOP.SHOP_GET_BY_CITY(currentCity),
          {
            withCredentials: true,
          }
        );

        console.log("Fetch Shop get by City API Response:", data);

        if (data.success) {
          console.log("Fetch Shop get by City Success:", data.message);

          dispatch(setShopsInMyCity(data.shops));
          console.log("Dispatch Shop get by City:", data.shops);
        } else {
          toast.error(data.message);
          console.log("Fetch Shop get by City Data Error:", data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
        console.log("Fetch Shop get by City Error:", error);
      }
    };

    fetchShops();
  }, [currentCity]);
}

export default useGetShopByCity;
