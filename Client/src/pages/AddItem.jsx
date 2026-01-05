// BiteRoute / Client / src / pages / AddItem.jsx
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
import { FileInput, Input, SelectInput } from "../components/FormInputs";

const AddItem = () => {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");

  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const categories = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast Food",
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

  // const handleImage = (e) => {
  //   const file = e.target.files[0];
  //   setBackendImage(file);
  //   setFrontendImage(URL.createObjectURL(file));
  // };

  const handleImage = (file) => {
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    setValue("image", file);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const formData = new FormData();
  //     formData.append("name", name);
  //     formData.append("category", category);
  //     formData.append("foodType", foodType);
  //     formData.append("price", price);

  //     if (backendImage) {
  //       formData.append("image", backendImage);
  //     }

  //     const { data } = await api.post(API_ROUTES.ITEM.ITEM_ADD, formData, {
  //       withCredentials: true,
  //     });

  //     console.log("Shop Create or Edit API Response:", data);

  //     if (data.success) {
  //       toast.success(data.message);
  //       console.log("Shop Create or Edit Success:", data.message);

  //       dispatch(setMyShopData(data.shop));
  //       console.log("Shop Create or Edit Dispatch:", data.shop);
  //     } else {
  //       toast.warn(data.message);
  //       console.log("Shop Create or Edit Data Error:", data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || error?.message);
  //     console.log("Shop Create or Edit Error:", error);
  //   }
  // };

  const onSubmit = async (formDataValues) => {
    try {
      const formData = new FormData();
      formData.append("name", formDataValues.name);
      formData.append("category", formDataValues.category);
      formData.append("foodType", formDataValues.foodType);
      formData.append("price", formDataValues.price);

      if (backendImage) formData.append("image", backendImage);

      const response = await api.post(API_ROUTES.ITEM.ITEM_ADD, formData, {
        withCredentials: true,
      });

      const data = response.data;

      console.log("Add Item API Response:", data);

      if (data.success) {
        toast.success(data.message);
        console.log("Add Item Success:", data.message);

        dispatch(setMyShopData(data.shop));
        console.log("Add Item Dispatch:", data.shop);

        navigate("/");
      } else {
        toast.warn(data.message);
        console.log("Add Item Data Error:", data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log("Add Item Error:", error);
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

      <div className="max-w-lg w-full bg-white shadow-2xl rounded-2xl p-8 border border-gray-300">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <FaUtensils className="text-primary w-16 h-16" />
          </div>

          <div className="text-3xl font-extrabold text-black">
            Add Food Item
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* <div>
            <label className="block text-sm font-medium text-black mb-1.5">
              Food Name
            </label>

            <input
              type="text"
              placeholder="Food Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-hover placeholder:text-gray-400 text-black"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div> */}

          <Input
            label="Food Name"
            name="name"
            control={control}
            placeholder="Food Name"
            errors={errors}
            required
          />

          {/* <div>
            <label className="block text-sm font-medium text-black mb-1.5">
              Food Image
            </label>

            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-hover"
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
          </div> */}

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

          {/* <div>
            <label className="block text-sm font-medium text-black mb-1.5">
              Price
            </label>

            <input
              type="number"
              placeholder="Price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-hover placeholder:text-gray-400 text-black"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div> */}

          <Input
            label="Price"
            type="number"
            name="price"
            control={control}
            placeholder="LKR 100"
            errors={errors}
            required
          />

          {/* <div>
            <label className="block text-sm font-medium text-black mb-1.5">
              Select Category
            </label>

            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="">Select Category</option>
              {categories.map((cate, index) => (
                <option value={cate} key={index}>
                  {cate}
                </option>
              ))}
            </select>
          </div> */}

          <SelectInput
            label="Category"
            name="category"
            control={control}
            options={categories.map((cate) => ({ label: cate, value: cate }))}
            required={true}
            errors={errors}
          />

          {/* <div>
            <label className="block text-sm font-medium text-black mb-1.5">
              Select Food Type
            </label>

            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              onChange={(e) => setFoodType(e.target.value)}
              value={foodType}
            >
              <option value="veg">Veg</option>
              <option value="non veg">Non Veg</option>
            </select>
          </div> */}

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

          <Button
            className="w-full py-3 font-semibold shadow-md hover:shadow-lg duration-200"
            type="submit"
          >
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
