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

const DeliveryPerson = () => {
  const { userData } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState(null);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);

  const {
    control,
    formState: { errors },
  } = useForm();

  const getAssignments = async () => {
    try {
      const { data } = await api.get(
        API_ROUTES.ORDER.ORDER_GET_DELIVERYPERSON_ASSIGNMENTS,
        { withCredentials: true }
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

  const handleSendOtp = (e) => {
    setShowOtpBox(true);
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const { data } = await api.post(
        API_ROUTES.ORDER.ORDER_ACCEPT(assignmentId),
        {},
        { withCredentials: true }
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

  useEffect(() => {
    getAssignments();
    getCurrentOrder();
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
            {userData?.location?.coordinates[1]},{" "}
            <span className="font-semibold text-black">Longitude:</span>
            {userData?.location?.coordinates[0]}
          </p>
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
                        {a?.items?.length} items | {a?.subtotal}
                      </p>
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
            </div>

            <DeliveryPersonTracking data={currentOrder} />

            {!showOtpBox ? (
              <Button
                className="mt-4 w-full bg-green-500 text-white  hover:bg-green-600"
                variant="custom"
                onClick={handleSendOtp}
              >
                Mark As Delivered
              </Button>
            ) : (
              <div className="mt-4 p-4 border border-gray-300 rounded-xl">
                <p className="text-sm font-semibold mb-2">
                  Enter OTP send to{" "}
                  <span className="text-primary">
                    {capitalizeWords(currentOrder?.user?.fullName)}
                  </span>
                </p>

                {/* <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Enter OTP"
                /> */}

                <Input
                  label="OTP"
                  name="otp"
                  type="text"
                  control={control}
                  placeholder="Enter OTP"
                  required
                  errors={errors}
                />

                <Button className="w-full">Submit OTP</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryPerson;
