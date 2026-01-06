// BiteRoute / Client / src / pages / CreateEditShop.jsx
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import Button from "../components/Button";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";
import { setMyShopData } from "../redux/ownerSlice";
import { useForm } from "react-hook-form";
import { FileInput, Input } from "../components/FormInputs";
import { ClipLoader } from "react-spinners";

const CreateEditShop = () => {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user
  );

  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: myShopData?.name || "",
      address: myShopData?.address || currentAddress,
      city: myShopData?.city || currentCity,
      state: myShopData?.state || currentState,
      image: null,
    },
  });

  const dispatch = useDispatch();

  const handleImage = (file) => {
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    setValue("image", file);
  };

  const onSubmit = async (formDataValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", formDataValues.name);
      formData.append("address", formDataValues.address);
      formData.append("city", formDataValues.city);
      formData.append("state", formDataValues.state);

      if (backendImage) formData.append("image", backendImage);

      const response = await api.post(
        API_ROUTES.SHOP.SHOP_CREATE_EDIT,
        formData,
        { withCredentials: true }
      );

      const data = response.data;

      console.log("Shop Create or Edit API Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Shop Create or Edit Success:", data.message);

        dispatch(setMyShopData(data.shop));
        console.log("Shop Create or Edit Dispatch:", data.shop);

        navigate("/");

        setLoading(false);
      } else {
        toast.warn(data.message);
        console.log("Shop Create or Edit Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Signup Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-linear-to-br from-primary/5 relative to-white min-h-screen">
      <div
        className="absolute top-5 left-5 z-10 mb-2.5"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack
          size={35}
          className="text-primary cursor-pointer"
        />
      </div>

      <div className="max-w-lg w-full bg-white shadow-2xl rounded-2xl p-8 border border-gray-300 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <FaUtensils className="text-primary w-16 h-16" />
          </div>

          <div className="text-3xl font-extrabold text-black">
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Shop Name"
            name="name"
            control={control}
            placeholder="Shop Name"
            errors={errors}
            required
          />

          <FileInput
            label="Shop Image"
            name="image"
            control={control}
            errors={errors}
            required={!myShopData}
            onChange={handleImage}
          />

          {frontendImage && (
            <div className="mt-4">
              <img
                src={frontendImage}
                alt=""
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              control={control}
              placeholder="City"
              errors={errors}
              required
            />

            <Input
              label="State"
              name="state"
              control={control}
              placeholder="State"
              errors={errors}
              required
            />
          </div>

          <Input
            label="Address"
            name="address"
            control={control}
            placeholder="Shop Address"
            errors={errors}
            required
          />

          <Button
            className="w-full py-3 font-semibold shadow-md hover:shadow-lg duration-200"
            type="submit"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#FFFFFF" /> : "Save"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShop;
