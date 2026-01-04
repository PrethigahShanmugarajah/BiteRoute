// BiteRoute / Client / src / hooks / useGetCity.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "../redux/userSlice";

function useGetCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      console.log(position);
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const { data } = await api.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
      );

      console.log("Get City:", data);

      dispatch(setCurrentCity(data.results[0].city));
      console.log("Dispatch City:", data.results[0].city);

      dispatch(setCurrentState(data.results[0].state));
      console.log("Dispatch State:", data.results[0].state);

      dispatch(
        setCurrentAddress(
          data.results[0].address_line2 || data.results[0].address_line1
        )
      );
      console.log(
        "Dispatch Address:",
        data.results[0].address_line2 || data.results[0].address_line1
      );
    });
  }, [userData]);
}

export default useGetCity;
