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

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
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
    try {
      const { data } = await api.post(
        API_ROUTES.AUTH.AUTH_SIGNUP,
        {
          ...formData,
          role,
        },
        { withCredentials: true }
      );

      console.log("Sign Up API Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Sign Up Success:", data.message);
        reset();
        setRole("user");
      } else {
        toast.warn(data.message);
        console.log("Sign Up Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Signup Error:", error);
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
        {/* <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-black font-medium mb-1"
          >
            Full Name
          </label>

          <input
            type="text"
            className="w-full border border-solid rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
          />
        </div> */}

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

        {/* -------- Mobile -------- */}
        {/* <div className="mb-4">
          <label htmlFor="mobile" className="block text-black font-medium mb-1">
            Mobile
          </label>

          <input
            type="number"
            className="w-full border border-solid rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
            placeholder="0 12 345 6789"
            onChange={(e) => setMobile(e.target.value)}
            value={mobile}
          />
        </div> */}

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

        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-500 font-medium mb-1"
          >
            Role
          </label>

          {/* <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors ${
                  role === r
                    ? "ring-1 ring-hover bg-primary text-white"
                    : "text-primary"
                }`}
              >
                {capitalizeFirstLetter(r)}
              </button>
            ))}
          </div> */}

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

        {/* <button
          className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-primary text-white hover:bg-hover"
          onClick={handleSignUp}
        >
          Sign Up
        </button> */}

        <Button
          className="w-full font-semibold"
          onClick={() => handleSubmit(handleSignUp)()}
        >
          Sign Up
        </Button>

        {/* <button className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-300 hover:bg-gray-100">
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button> */}

        <Button className="w-full mt-4" variant="secondary">
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
