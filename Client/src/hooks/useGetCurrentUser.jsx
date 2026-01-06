// BiteRoute / Client / src / hooks / useGetCurrentUser.jsx
import { useEffect } from "react";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";
import { setUserData } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

function useGetCurrentUser() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) return;

    const fetchUser = async () => {
      try {
        const { data } = await api.get(API_ROUTES.USER.USER_GET, {
          withCredentials: true,
        });

        console.log("Fetch User API Response:", data);

        if (data.success) {
          console.log("Fetch User Success:", data.message);

          dispatch(setUserData(data.user));
          console.log("Dispatch User:", data.user);
        } else {
          toast.error(data.message);
          console.log("Fetch User Data Error:", data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
        console.log("Fetch User Error:", error);
      }
    };
    fetchUser();
  }, [dispatch]);
}

export default useGetCurrentUser;
