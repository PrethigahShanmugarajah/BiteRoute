// BiteRoute / Client / src / hooks / useGetMyOrders.jsx
import { useEffect } from "react";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/userSlice";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;
    if (userData.role === "deliveryPerson") return;

    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get(API_ROUTES.ORDER.ORDER_MY_GET, {
          withCredentials: true,
        });

        console.log("Fetch Order API Response:", data);

        if (data.success) {
          console.log("Fetch Order Success:", data.message);
          dispatch(setMyOrders(data.orders));

          console.log("Dispatch Orders:", data.orders);
        } else {
          toast.error(data.message);
          console.log("Fetch Order Data Error:", data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
        console.log("Fetch Order Error:", error);
      }
    };
    fetchMyOrders();
  }, [dispatch, userData]);
}

export default useGetMyOrders;
