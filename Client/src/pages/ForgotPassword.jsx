// BiteRoute / Client / src / pages / ForgotPassword.jsx
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Input } from "../components/FormInputs";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const handleSendOtp = async (formData) => {
    try {
      const { data } = await api.post(
        API_ROUTES.AUTH.AUTH_SEND_OTP,
        { email: formData.email },
        { withCredentials: true }
      );

      console.log("Send OTP API Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Send OTP Success:", data.message);
        setStep(2);
      } else {
        toast.warn(data.message);
        console.log("Send OTP Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Send OTP Error:", error);
    }
  };

  const handleVerifyOtp = async (formData) => {
    try {
      const { data } = await api.post(
        API_ROUTES.AUTH.AUTH_VERIFY_OTP,
        { email: formData.email, otp: formData.otp },
        { withCredentials: true }
      );

      console.log("Verify OTP API Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Verify OTP Success:", data.message);
        setStep(3);
      } else {
        toast.warn(data.message);
        console.log("Verify OTP Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Verify OTP Error:", error);
    }
  };

  const handleResetPassword = async (formData) => {
    if (newPassword != confirmPassword) {
      return null;
    }

    try {
      const { data } = await api.post(
        API_ROUTES.AUTH.AUTH_RESET_PASSWORD,
        { email: formData.email, newPassword: formData.newPassword },
        { withCredentials: true }
      );

      console.log("Reset Password API Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Reset Password Success:", data.message);
        navigate("/signin");
      } else {
        toast.warn(data.message);
        console.log("Reset Password Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Reset Password Error:", error);
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-bg">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="text-primary hover:text-hover cursor-pointer"
            onClick={() => navigate("/signin")}
          />

          <h1 className="text-3xl font-bold text-center text-primary">
            ForgotPassword
          </h1>
        </div>

        {step == 1 && (
          /* -------- Email -------- */
          <div>
            {/* <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-black font-medium mb-1"
              >
                Email
              </label>

              <input
                type="email"
                className="w-full border border-solid rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                placeholder="example@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div> */}

            <div>
              <Input
                name="email"
                type="email"
                label="Email"
                placeholder="example@example.com"
                control={control}
                errors={errors}
                required
              />
            </div>

            {/* <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-primary text-white hover:bg-hover"
              onClick={handleSendOtp}
            >
              Send Otp
            </button> */}

            <Button
              className="w-full font-semibold"
              onClick={() => handleSubmit(handleSendOtp)()}
            >
              Send Otp
            </Button>
          </div>
        )}

        {step == 2 && (
          /* -------- Email -------- */
          <div>
            {/* <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-black font-medium mb-1"
              >
                Otp
              </label>

              <input
                type="text"
                className="w-full border border-solid rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                placeholder="Enter your Otp"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            </div> */}

            <div>
              <Input
                name="otp"
                type="text"
                label="Otp"
                placeholder="Enter your Otp"
                control={control}
                errors={errors}
                required
              />
            </div>

            {/* <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-primary text-white hover:bg-hover"
              onClick={handleVerifyOtp}
            >
              Verify
            </button> */}

            <Button
              className="w-full font-semibold"
              onClick={() => handleSubmit(handleVerifyOtp)()}
            >
              Verify
            </Button>
          </div>
        )}

        {step == 3 && (
          /* -------- Password -------- */
          <div>
            {/* <div className="mb-6">
              <label
                htmlFor="newPassword"
                className="block text-black font-medium mb-1"
              >
                New Password
              </label>

              <div className="relative">
                <input
                  type={`${showNewPassword ? "text" : "password"}`}
                  className="w-full border border-solid rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />

                <button
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {!showNewPassword ? (
                    <FaEye size={20} />
                  ) : (
                    <FaEyeSlash size={20} />
                  )}
                </button>
              </div>
            </div> */}

            <div>
              <div className="relative">
                <Input
                  name="newPassword"
                  type={`${showNewPassword ? "text" : "password"}`}
                  label="New Password"
                  placeholder="New Password"
                  control={control}
                  errors={errors}
                  required
                />

                <button
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {!showNewPassword ? (
                    <FaEye size={20} />
                  ) : (
                    <FaEyeSlash size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-black font-medium mb-1"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={`${showConfirmPassword ? "text" : "password"}`}
                  className="w-full border border-solid rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />

                <button
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setConfirmPassword((prev) => !prev)}
                >
                  {!showConfirmPassword ? (
                    <FaEye size={20} />
                  ) : (
                    <FaEyeSlash size={20} />
                  )}
                </button>
              </div>
            </div> */}

            <div>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={`${showConfirmPassword ? "text" : "password"}`}
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  control={control}
                  errors={errors}
                  required
                />

                <button
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {!showConfirmPassword ? (
                    <FaEye size={20} />
                  ) : (
                    <FaEyeSlash size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-primary text-white hover:bg-hover"
              onClick={handleResetPassword}
            >
              Reset Password
            </button> */}

            <Button
              className="w-full font-semibold"
              onClick={() => handleSubmit(handleResetPassword)()}
            >
              Reset Password
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
