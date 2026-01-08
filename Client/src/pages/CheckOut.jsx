// BiteRoute / Client / src / pages / CheckOut.jsx
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoLocationSharp, IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice";
import api from "../api/axios";
import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard, FaMobileScreenButton } from "react-icons/fa6";
import Button from "../components/Button";

function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap();
    map.setView([location.lat, location.lon], 16, { animate: true });
  }
  return null;
}

const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const AmountWithDeliveryFee = totalAmount + deliveryFee;

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    getAddressByLatLng(lat, lng);
    console.log(e.target._latlng);
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      getAddressByLatLng(latitude, longitude);
    });
  };

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const { data } = await api.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
      );

      dispatch(setAddress(data?.results[0]?.address_line2));
      console.log(
        "Get Address By Latitude Longitude:",
        data?.results[0]?.address_line2
      );
    } catch (error) {
      console.log("Get Current Address Error:", error);
    }
  };

  const getLatLngByAddress = async () => {
    try {
      const { data } = await api.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressInput
        )}&apiKey=${apiKey}`
      );

      const { lat, lon } = data?.features[0]?.properties || {};

      if (lat && lon) {
        dispatch(setLocation({ lat, lon }));
      }

      console.log(
        "Get Latitude, Longitude By Address:",
        data.features[0].properties
      );
    } catch (error) {
      console.log("Get Current Address Error:", error);
    }
  };

  useEffect(() => {
    setAddressInput(address);
  }, []);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="absolute top-5 left-2 z-10" onClick={() => navigate("/")}>
        <IoIosArrowRoundBack
          size={35}
          className="text-primary cursor-pointer"
        />
      </div>

      <div className="w-full max-w-225 bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-black">Checkout</h1>

        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-black">
            <IoLocationSharp className="text-primary" />
            Delivery Location
          </h2>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter Your Delivery Address..."
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />

            <button
              className="bg-primary hover:bg-hover text-white px-2 py-2 rounded-lg flex items-center justify-center"
              onClick={getLatLngByAddress}
            >
              <IoSearchOutline size={17} />
            </button>

            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded-lg flex items-center justify-center"
              onClick={getCurrentLocation}
            >
              <TbCurrentLocation size={17} />
            </button>
          </div>

          <div className="rounded-xl border border-gray-300 overflow-hidden">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                className={"w-full h-full"}
                center={[location?.lat, location?.lon]}
                zoom={16}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterMap location={location} />

                <Marker
                  position={[location?.lat, location?.lon]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                />
              </MapContainer>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-black">
            Payment Method
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                paymentMethod === "cod"
                  ? "border-primary bg-bg shadow"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MdDeliveryDining className="text-green-600 text-xl" />
              </span>

              <div>
                <p className="font-medium text-black">Cash On Delivery</p>

                <p className="text-xs text-gray-500">
                  Pay when your food arrives
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                paymentMethod === "online"
                  ? "border-primary bg-bg shadow"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setPaymentMethod("online")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <FaMobileScreenButton className="text-purple-700 text-lg" />
              </span>

              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <FaCreditCard className="text-blue-700 text-lg" />
              </span>

              <div>
                <p className="font-medium text-black">
                  UPI / Credit / Debit Card
                </p>

                <p className="text-xs text-gray-500">Pay Securely Online</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-black">
            Order Summary
          </h2>

          <div className="rounded-xl border border-gray-300 bg-bg p-4 space-y-2">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-black"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>

                <span>LKR {item.price * item.quantity}</span>
              </div>
            ))}

            <hr className="border border-gray-300 my-2" />

            <div className="flex justify-between font-medium text-black">
              <span>Subtotal</span>
              <span>LKR {totalAmount}</span>
            </div>

            <div className="flex justify-between font-medium text-gray-500">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "Free" : `LKR ${deliveryFee}`}</span>
            </div>

            <div className="flex justify-between text-lg font-bold text-primary pt-2">
              <span>Total</span>
              <span>LKR {AmountWithDeliveryFee}</span>
            </div>
          </div>
        </section>

        <Button className="w-full py-3 font-semibold">
          {paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}
        </Button>
      </div>
    </div>
  );
};

export default CheckOut;
