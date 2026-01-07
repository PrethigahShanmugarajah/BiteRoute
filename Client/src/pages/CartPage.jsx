// BiteRoute / Client / src / pages / CartPage.jsx
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-bg flex justify-center p-6">
      <div className="w-full max-w-200">
        <div className="flex items-center gap-5 mb-6">
          <div className="z-10" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack
              size={35}
              className="text-primary cursor-pointer"
            />
          </div>

          <h1 className="text-2xl font-bold text-start">Cart Page</h1>
        </div>

        {cartItems?.length == 0 ? (
          <p className="text-gray-500 text-lg text-center">
            Your Cart is Empty
          </p>
        ) : (
          <>
            {/* <div className="space-y-4 "> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cartItems?.map((item, index) => (
                <CartItemCard data={item} key={index} />
              ))}
            </div>

            <div className="mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border border-gray-300">
              <h1 className="text-lg font-semibold">Total Amount</h1>
              <span className="text-xl font-bold text-primary">
                LKR {totalAmount}
              </span>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-hover transition">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
