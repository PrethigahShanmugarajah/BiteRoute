// BiteRoute / Client / src / pages / UpdateItem.jsx
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import Button from "../components/Button";
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";
import { setMyShopData } from "../redux/ownerSlice";
import { useForm } from "react-hook-form";
import { FileInput, Input, SelectInput } from "../components/FormInputs";
import { ClipLoader } from "react-spinners";

const UpdateItem = () => {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const { itemId } = useParams();

  const [currentItem, setCurrentItem] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("");
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Short Eats",
    "Kottu",
    "Noodles",
    "Pizza",
    "Seafood",
    "Desserts & Sweets",
    "Burgers",
    "Sandwiches",
    "Others",
  ];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      category: "",
      foodType: "",
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
      formData.append("category", formDataValues.category);
      formData.append("foodType", formDataValues.foodType);
      formData.append("price", formDataValues.price);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const response = await api.put(
        API_ROUTES.ITEM.ITEM_UPDATE(itemId),
        formData,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      console.log("Update Item API Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Update Item Success:", data.message);

        dispatch(setMyShopData(data.shop));
        console.log("Update Item Dispatch:", data.shop);

        navigate("/");

        setLoading(false);
      } else {
        toast.warn(data.message);
        console.log("Update Item Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Update Item Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGetItemById = async () => {
      try {
        const response = await api.get(API_ROUTES.ITEM.ITEM_GET_BY_ID(itemId), {
          withCredentials: true,
        });

        const data = response.data;

        console.log("Get Item By Id API Response:", data);

        if (data.success) {
          console.log("Get Item By Id Success:", data.message);

          dispatch(setMyShopData(data.shop));
          console.log("Get Item By Id Dispatch:", data.shop);

          setCurrentItem(data.item);

          setValue("name", data.item.name);
          setValue("price", data.item.price);
          setValue("category", data.item.category);
          setValue("foodType", data.item.foodType);

          setFrontendImage(data.item.image);
        } else {
          toast.warn(data.message);
          console.log("Get Item By Id Data Error:", data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
        console.log("Get Item By Id Error:", error);
      }
    };

    handleGetItemById();
  }, [itemId]);

  useEffect(() => {
    setName(currentItem?.name || "");
    setPrice(currentItem?.price || "");
    setCategory(currentItem?.category || "");
    setFoodType(currentItem?.foodType || "");
    setFrontendImage(currentItem?.image || "");
  }, [currentItem]);

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

      <div className="max-w-lg w-full bg-white shadow-2xl rounded-2xl p-8 border border-gray-300">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <FaUtensils className="text-primary w-16 h-16" />
          </div>

          <div className="text-3xl font-extrabold text-black">
            Edit Food Item
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Food Name"
            name="name"
            control={control}
            placeholder="Food Name"
            errors={errors}
            required
          />

          <FileInput
            label="Food Image"
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

          <Input
            label="Price"
            type="number"
            name="price"
            control={control}
            placeholder="LKR 100"
            errors={errors}
            required
          />

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <SelectInput
              label="Category"
              name="category"
              control={control}
              options={categories.map((cate) => ({ label: cate, value: cate }))}
              required={true}
              errors={errors}
            />

            <SelectInput
              label="Food Type"
              name="foodType"
              control={control}
              options={[
                { label: "Veg", value: "veg" },
                { label: "Non Veg", value: "non veg" },
              ]}
              required={true}
              errors={errors}
            />
          </div>

          <Button
            className="w-full py-3 font-semibold shadow-md hover:shadow-lg duration-200"
            type="submit"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#FFFFFF" /> : "Update"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateItem;
