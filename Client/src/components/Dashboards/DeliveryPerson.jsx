// BiteRoute / Client / src / components / Dashboards / DeliveryPerson.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Nav from "../Nav";
import api from "../../api/axios";
import API_ROUTES from "../../api/api_route";
import Button from "../Button";
import { capitalizeWords } from "../../utils/helper";
import { toast } from "react-toastify";
import DeliveryPersonTracking from "../DeliveryPersonTracking";
import { FiPackage } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { Input } from "../FormInputs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClipLoader } from "react-spinners";

const DeliveryPerson = () => {
  const { userData, socket } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState(null);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [deliveryPersonLocation, setDeliveryPersonLocation] = useState(null);
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!socket || userData.role !== "deliveryPerson") return;

    let watchId;

    if (navigator.geolocation) {
      ((watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setDeliveryPersonLocation({ lat: latitude, lon: longitude });
        socket.emit("updateLocation", {
          latitude,
          longitude,
          userId: userData._id,
        });
      })),
        (error) => {
          console.log(":", error);
        },
        { enableHighAccuracy: true });
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userData]);

  const ratePerDelivery = 50;
  const totalEaring = todayDeliveries?.reduce(
    (sum, d) => sum + d.count * ratePerDelivery,
    0,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const getAssignments = async () => {
    try {
      const { data } = await api.get(
        API_ROUTES.ORDER.ORDER_GET_DELIVERYPERSON_ASSIGNMENTS,
        { withCredentials: true },
      );

      console.log("Fetch Assignments API Response:", data);

      if (data.success) {
        setAvailableAssignments(data.formated);
        console.log("Fetch Assignments Success:", data.message);
      } else {
        toast.error(data.message);
        console.log("Fetch Assignments Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Fetch Assignments Error:", error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const { data } = await api.get(API_ROUTES.ORDER.ORDER_GET_CURRENT, {
        withCredentials: true,
      });

      console.log("Fetch Current Order API Response:", data);

      if (data.success) {
        console.log("Fetch Current Order Success:", data.message);

        setCurrentOrder(data);
      } else {
        toast.error(data.message);
        console.log("Fetch Current Order Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Fetch Current Order Error:", error);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const { data } = await api.post(
        API_ROUTES.ORDER.ORDER_ACCEPT(assignmentId),
        {},
        { withCredentials: true },
      );

      console.log("Accept Order API Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Accept Order Success:", data.message);

        getCurrentOrder();
      } else {
        toast.error(data.message);
        console.log("Accept Order Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Accept Order Error:", error);
    }
  };

  const sendOtp = async () => {
    setLoading(true);

    console.log("Sending OTP for order:", currentOrder);

    try {
      const { data } = await api.post(
        API_ROUTES.ORDER.ORDER_SEND_DELIVERY_OTP,
        { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id },
        { withCredentials: true },
      );

      console.log("Send OTP API Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Send OTP Success:", data.message);

        setShowOtpBox(true);
        setLoading(false);
      } else {
        toast.error(data.message);
        console.log("Send OTP Data Error:", data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Send OTP Error:", error);
      setLoading(false);
    }
  };

  const verifyOtp = async (formData) => {
    setMessage("");

    try {
      const { data } = await api.post(
        API_ROUTES.ORDER.ORDER_VERIFY_DELIVERY_OTP,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp: formData.otp,
        },
        { withCredentials: true },
      );

      console.log("Verify OTP API Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Verify OTP Success:", data.message);

        setMessage(data.message);
        location.reload();
      } else {
        toast.error(data.message);
        console.log("Verify OTP Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Verify OTP Error:", error);
    }
  };

  const handleTodayDeliveries = async () => {
    try {
      const { data } = await api.get(
        API_ROUTES.ORDER.ORDER_GET_TODAY_DELIVERIES,
        { withCredentials: true },
      );

      console.log("Get Today Deliveries API Response:", data);

      if (data.success) {
        console.log("Get Today Deliveries Success:", data.message);
        setTodayDeliveries(data.formattedStats || []);
      } else {
        toast.error(data.message);
        console.log("Get Today Deliveries Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Get Today Deliveries Error:", error);
    }
  };

  useEffect(() => {
    socket.on("newAssognment", (data) => {
      if (data.sendTo == userData._id) {
        setAvailableAssignments((prev) => [...prev, data]);
      }
    });

    return () => {
      socket?.off("newAssignment");
    };
  }, [socket]);

  useEffect(() => {
    getAssignments();
    getCurrentOrder();
    handleTodayDeliveries();
  }, [userData]);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-bg overflow-y-auto">
      <Nav />
      <div className="w-full max-w-200 flex flex-col gap-5 items-center">
        <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-gray-300 text-center gap-4">
          <h1 className="text-xl font-bold text-primary">
            Welcome, {capitalizeWords(userData?.fullName)}
          </h1>

          <p className="text-gray-500">
            <span className="font-semibold text-black">Latitude:</span>
            {deliveryPersonLocation?.lat},{" "}
            <span className="font-semibold text-black">Longitude:</span>
            {deliveryPersonLocation?.lon}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-gray-300">
          <h1 className="text-lg font-bold mb-3 text-primary">
            Today Deliveries
          </h1>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={todayDeliveries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis dataKey="count" allowDecimals={false} />
              <Tooltip
                formatter={(value) => [value, "orders"]}
                labelFormatter={(label) => `${label}:00`}
              />
              <Bar dataKey="count" fill="#5b21b6" />
            </BarChart>
          </ResponsiveContainer>

          <div className="max-w-sm mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg text-center">
            <h1 className="text-xl font-semibold text-black mb-2">
              Today's Earning
            </h1>

            <span className="text-3xl font-bold text-green-600">
              LKR {totalEaring}
            </span>
          </div>
        </div>

        {!currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-gray-300">
            <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
              Available Orders
            </h1>

            <div className="space-y-4">
              {availableAssignments?.length > 0 ? (
                availableAssignments?.map((a, index) => (
                  <div
                    className="border border-gray-300 rounded-lg p-4 flex justify-between items-center"
                    key={index}
                  >
                    <div>
                      <p className="text-sm font-semibold">{a?.shopName}</p>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Delivery Address:</span>{" "}
                        {a?.deliveryAddress.text}
                      </p>
                      <p className="text-xs text-gray-500">
                        {a?.items?.length} items
                      </p>

                      <div className="mt-2 text-xs border-t border-gray-200 pt-2">
                        <p className="text-gray-500">
                          Subtotal:{" "}
                          <span className="font-semibold">
                            LKR {a?.subtotal}
                          </span>
                        </p>

                        <p className="text-black font-bold">
                          Total:{" "}
                          <span className="text-primary">
                            LKR {a?.totalAmount || 0}
                          </span>
                        </p>
                      </div>
                    </div>

                    <Button
                      className="px-4! py-1! text-sm"
                      onClick={() => acceptOrder(a.assignmentId)}
                    >
                      Accept
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No Available Orders</p>
              )}
            </div>
          </div>
        )}

        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-gray-300">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <FiPackage className="text-2xl" />
              Current Orders
            </h2>

            <div className="border border-gray-300 rounded-lg p-4 mb-3">
              <p className="font-semibold text-sm">
                {currentOrder?.shopOrder.shop.name}
              </p>

              <p className="text-sm text-gray-500">
                {currentOrder?.deliveryAddress.text}
              </p>

              <p className="text-xs text-gray-500">
                {currentOrder.shopOrder.shopOrderItems.length} items |{" "}
                {currentOrder.shopOrder.subtotal}
              </p>

              <div className="mt-2 text-xs border-t border-gray-200 pt-2">
                <p className="text-gray-500">
                  Subtotal:{" "}
                  <span className="font-semibold">
                    LKR {currentOrder?.shopOrder?.subtotal}
                  </span>
                </p>

                <p className="text-black font-bold">
                  Total:{" "}
                  <span className="text-primary">
                    LKR {currentOrder?.totalAmount || 0}
                  </span>
                </p>
              </div>
            </div>

            <DeliveryPersonTracking
              data={{
                deliveryPersonLocation: deliveryPersonLocation || {
                  lat: userData.location?.coordinates[1],
                  lon: userData.location?.coordinates[0],
                },

                customerLocation: {
                  lat: currentOrder?.deliveryAddress?.latitude,
                  lon: currentOrder?.deliveryAddress?.longitude,
                },
              }}
            />

            {!showOtpBox ? (
              <Button
                className="mt-4 w-full bg-green-500 text-white  hover:bg-green-600"
                variant="custom"
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader size={20} color="#FFFFFF" />
                ) : (
                  "Mark As Delivered"
                )}
              </Button>
            ) : (
              <div className="mt-4 p-4 border border-gray-300 rounded-xl">
                <p className="text-sm font-semibold mb-2">
                  Enter OTP send to{" "}
                  <span className="text-primary">
                    {capitalizeWords(currentOrder?.user?.fullName)}
                  </span>
                </p>

                <Input
                  label="OTP"
                  name="otp"
                  type="text"
                  control={control}
                  placeholder="Enter OTP"
                  required
                  errors={errors}
                />

                {message && (
                  <p className="text-center text-green-400">{message}</p>
                )}

                <Button className="w-full" onClick={handleSubmit(verifyOtp)}>
                  Submit OTP
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryPerson;
