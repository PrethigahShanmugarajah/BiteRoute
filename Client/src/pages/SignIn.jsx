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
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

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
    setLoading(true);
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

        dispatch(setUserData(data.user));
        console.log("SignIn Dispatch:", data.user);

        reset();
        setLoading(false);
      } else {
        toast.warn(data.message);
        console.log("Signin Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Signin Error:", error);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const googleData = await signInWithPopup(auth, provider);
      console.log("Google Auth popup result:", googleData);

      const { data } = await api.post(
        API_ROUTES.AUTH.AUTH_GOOGLE_AUTH,
        {
          email: googleData.user.email,
        },
        { withCredentials: true }
      );

      console.log("Google Auth Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Google Auth Success:", data.message);

        reset();

        dispatch(setUserData(data.user));
        console.log("Google SignIn Dispatch:", data);
      } else {
        toast.warn(data.message);
        console.log("Google Auth Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Google Auth Error:", error);
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

        <Button
          className="w-full font-semibold"
          onClick={() => handleSubmit(handleSignIn)()}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="#FFFFFF" /> : "Sign In"}
        </Button>

        <Button
          className="w-full mt-4"
          variant="secondary"
          onClick={handleGoogleAuth}
        >
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
