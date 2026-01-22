import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const OrderPlaced = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center items-center px-4 text-center relative overflow-hidden">
      <FaCircleCheck className="text-green-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-black mb-2">Order Placed</h1>
      <p className="text-gray-500 max-w-md mb-6">
        Thank you for your purchase. Your order is being prepared. You can track
        your order status in the "My Orders" section.
      </p>

      <Button className="text-lg" onClick={() => navigate("/my-orders")}>
        Back to my orders
      </Button>
    </div>
  );
};

export default OrderPlaced;
