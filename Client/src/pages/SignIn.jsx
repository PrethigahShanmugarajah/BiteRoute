// BiteRoute / Client / src / pages / SignIn.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../components/FormInputs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (formData) => {
    try {
      const { data } = await api.post(
        API_ROUTES.AUTH.AUTH_SIGNIN,
        {
          ...formData,
        },
        { withCredentials: true }
      );

      console.log("Signin API Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Signin Success:", data.message);
        reset();
      } else {
        toast.warn(data.message);
        console.log("Signin Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Signin Error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-bg">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-solid border-border">
        <h1 className="text-3xl font-bold mb-2 text-primary">BiteRoute</h1>
        <p className="text-gray-500 mb-4">
          Sign In to your account to get started with delicious food deliveries.
        </p>

        {/* -------- Email -------- */}
        {/* <div className="mb-4">
          <label htmlFor="email" className="block text-black font-medium mb-1">
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

        {/* -------- Password -------- */}
        {/* <div className="mb-4">
          <label htmlFor="mobile" className="block text-black font-medium mb-1">
            Password
          </label>

          <div className="relative">
            <input
              type="password"
              className="w-full border border-solid rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <button
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
            </button>
          </div>
        </div> */}

        <div>
          <div className="relative">
            <Input
              name="password"
              type={`${showPassword ? "text" : "password"}`}
              label="Password"
              placeholder="Password"
              control={control}
              errors={errors}
              required
            />

            <button
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
            </button>
          </div>
        </div>

        <div
          className="text-right mb-4 text-primary font-medium cursor-pointer"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password
        </div>

        {/* <button
          className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-primary text-white hover:bg-hover"
          onClick={handleSignIn}
        >
          Sign Up
        </button> */}

        <Button
          className="w-full font-semibold"
          onClick={() => handleSubmit(handleSignIn)()}
        >
          Sign In
        </Button>

        {/* <button className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-300 hover:bg-gray-100">
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button> */}

        <Button className="w-full mt-4" variant="secondary">
          <FcGoogle size={20} />
          <span>Sign in with Google</span>
        </Button>

        <p
          className="text-center mt-2 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Want to create a new account?{" "}
          <span className="text-primary">Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
