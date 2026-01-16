// BiteRoute / Client / src / pages / MyOrders.jsx
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";

const MyOrders = () => {
  const { userData, myOrders } = useSelector((state) => state.user);
  const navigate = useNavigate();

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
