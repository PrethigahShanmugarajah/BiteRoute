// BiteRoute / Client / src / hooks / useUpdateLocation.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";

function useUpdateLocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      try {
        const { data } = await api.get(
          API_ROUTES.USER.USER_UPDATE_LOCATION,
          { lat, lon },
          { withCredentials: true }
        );

        console.log("Update Location API Response:", data);

        navigator.geolocation.watchPosition((pos) => {
          updateLocation(pos.coords.latitude, pos.coords.longitude);
        });

        if (data.success) {
          toast.success(data.message);
          console.log("Update Location Success:", data.message);
        } else {
          toast.error(data.message);
          console.log("Update Location Data Error:", data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
        console.log("Update Locationr Error:", error);
      }
    };
  }, [userData]);
}

export default useUpdateLocation;
