import { useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { setMyOrders, updateRealtimeOrderStatus } from "../redux/userSlice";

const MyOrders = () => {
  const { userData, myOrders, socket } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on("newOrder", (data) => {
      if (data.shopOrder?.owner._id == userData._id) {
        dispatch(setMyOrders([data, ...myOrders]));
        console.log("My Orders:", setMyOrders([data, ...myOrders]));
      }
    });

    socket?.on("update-status", ({ orderId, shopId, status, userId }) => {
      if (userId == userData._id) {
        dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }));
      }
    });

    return () => {
      socket?.off("newOrder");
      socket?.off("update-status");
    };
  }, [socket]);

  return (
    <div className="w-full min-h-screen bg-bg flex justify-center px-4">
      <div className="w-full max-w-200 p-4">
        <div className="flex items-center gap-5 mb-6">
          <div className="z-10" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack
              size={35}
              className="text-primary cursor-pointer"
            />
          </div>

          <h1 className="text-2xl font-bold text-start">My Orders</h1>
        </div>

        <div className="space-y-6">
          {myOrders?.map((order, index) => {
            if (userData.role === "user") {
              return <UserOrderCard data={order} key={index} />;
            } else if (userData.role === "owner") {
              return <OwnerOrderCard data={order} key={index} />;
            } else {
              return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
