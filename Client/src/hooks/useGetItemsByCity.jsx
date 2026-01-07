// BiteRoute / Client / src / hooks / useGetItemsByCity.jsx
import { useEffect } from "react";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";
import { setItemsInMyCity } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

function useGetItemsByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentCity) return;

    const fetchItems = async () => {
      try {
        const { data } = await api.get(
          API_ROUTES.ITEM.ITEM_GET_BY_CITY(currentCity),
          {
            withCredentials: true,
          }
        );

        console.log("Fetch Item get by City API Response:", data);

        if (data.success) {
          console.log("Fetch Item get by City Success:", data.message);

          dispatch(setItemsInMyCity(data.items));
          console.log("Dispatch Item get by City:", data.items);
        } else {
          toast.error(data.message);
          console.log("Fetch Item get by City Data Error:", data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
        console.log("Fetch Item get by City Error:", error);
      }
    };

    fetchItems();
  }, [currentCity]);
}

export default useGetItemsByCity;
