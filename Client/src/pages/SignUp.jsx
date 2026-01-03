// BiteRoute / Client / src / pages / SignUp.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../components/FormInputs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../components/Button";
import { capitalizeFirstLetter } from "../utils/helper";
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

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      password: "",
    },
  });

  const handleSignUp = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post(
        API_ROUTES.AUTH.AUTH_SIGNUP,
        { ...formData, role },
        { withCredentials: true }
      );

      console.log("Sign Up API Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Sign Up Success:", data.message);

        reset();
        dispatch(setUserData(data.user));

        dispatch(setUserData(data.user));
        localStorage.setItem("userData", JSON.stringify(data.user));
        console.log("SignUp Dispatch:", data.user);
      } else {
        toast.warn(data.message);
        console.log("Sign Up Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Signup Error:", error);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const mobile = getValues("mobile");

    if (!mobile) {
      toast.warn("Mobile No is required");
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const googleData = await signInWithPopup(auth, provider);
      console.log("Google Auth popup result:", googleData);

      const { data } = await api.post(
        API_ROUTES.AUTH.AUTH_GOOGLE_AUTH,
        {
          fullName: googleData.user.displayName,
          email: googleData.user.email,
          role,
          mobile,
        },
        { withCredentials: true }
      );

      console.log("Google Auth Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Google Auth Success:", data.message);

        dispatch(setUserData(data.user));
        localStorage.setItem("userData", JSON.stringify(data.user));
        console.log("Google SignUp Dispatch:", data.user);
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
          Create your account to get started with delicious food deliveries.
        </p>

        {/* -------- Full Name -------- */}
        <div>
          <Input
            name="fullName"
            label="Full Name"
            placeholder="Full Name"
            control={control}
            errors={errors}
            required
          />
        </div>

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

        {/* -------- Mobile -------- */}
        <div className="mb-4">
          <Input
            name="mobile"
            type="number"
            label="Mobile"
            placeholder="0 12 345 6789"
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

        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-500 font-medium mb-1"
          >
            Role
          </label>

          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <Button
                key={r}
                onClick={() => setRole(r)}
                variant={role === r ? "primary" : "secondary"}
                className={`flex-1 ${
                  role === r ? "ring-1 ring-hover" : "text-primary"
                }`}
              >
                {capitalizeFirstLetter(r)}
              </Button>
            ))}
          </div>
        </div>

        <Button
          className="w-full font-semibold"
          onClick={() => handleSubmit(handleSignUp)()}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="#FFFFFF" /> : "Sign Up"}
        </Button>

        <Button
          className="w-full mt-4"
          variant="secondary"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </Button>

        <p
          className="text-center mt-2 cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account ?{" "}
          <span className="text-primary">Sign In</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
