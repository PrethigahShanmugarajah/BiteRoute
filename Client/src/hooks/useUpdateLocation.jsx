import { useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";

function useUpdateLocation() {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      if (lat == null || lon == null) return;

      try {
        const { data } = await api.post(
          API_ROUTES.USER.USER_UPDATE_LOCATION,
          { lat, lon },
          { withCredentials: true },
        );

        console.log("Update Location API Response:", data);

        if (data.success) {
          console.log("Update Location Success:", data.message);
        } else {
          toast.error(data.message);
          console.log("Update Location Data Error:", data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
        console.log("Update Location Error:", error);
      }
    };

    const watchId = navigator.geolocation.watchPosition((pos) => {
      updateLocation(pos.coords.latitude, pos.coords.longitude);
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userData]);
}

export default useUpdateLocation;
