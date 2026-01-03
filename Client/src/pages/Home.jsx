// BiteRoute / Client / src / pages / Home.jsx
import { useSelector } from "react-redux";
import UserDashboard from "../components/Dashboards/UserDashboard";
import OwnerDashboard from "../components/Dashboards/OwnerDashboard";
import DeliveryPerson from "../components/Dashboards/DeliveryPerson";

const Home = () => {
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="w-screen min-h-screen pt-25 flex flex-col items-center bg-bg">
      {userData.role == "user" && <UserDashboard />}
      {userData.role == "owner" && <OwnerDashboard />}
      {userData.role == "deliveryBoy" && <DeliveryPerson />}
    </div>
  );
};

export default Home;
