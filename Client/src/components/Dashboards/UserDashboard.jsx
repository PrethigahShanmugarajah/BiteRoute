// BiteRoute / Client / src / components / Dashboards / UserDashboard.jsx
import { useEffect, useRef, useState } from "react";
import { categories } from "../../category";
import CategoryCard from "../CategoryCard";
import Nav from "../Nav";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import FoodCard from "../FoodCard";

const UserDashboard = () => {
  const { currentCity, shopsInMyCity, itemsInMyCity } = useSelector(
    (state) => state.user
  );

  const cateScrollRef = useRef();
  const shopScrollRef = useRef();

  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const [showLeftCateButton, setShowLeftCateButton] = useState(false);

  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);

  const updateButton = (ref, setLeftButton, setLeftRightButton) => {
    const element = ref.current;

    if (element) {
      // console.log(element.scrollLeft);
      setLeftButton(element.scrollLeft > 0);

      // console.log("Client Width:", element.clientWidth);
      // console.log("Scroll Width:", element.scrollWidth);
      // console.log("Scroll Left:", element.scrollLeft);

      setLeftRightButton(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
    }
  };

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (cateScrollRef.current) {
      updateButton(
        cateScrollRef,
        setShowLeftCateButton,
        setShowRightCateButton
      );
      updateButton(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton
      );

      cateScrollRef.current.addEventListener("scroll", () => {
        updateButton(
          cateScrollRef,
          setShowLeftCateButton,
          setShowRightCateButton
        );
      });

      shopScrollRef.current.addEventListener("scroll", () => {
        updateButton(
          shopScrollRef,
          setShowLeftShopButton,
          setShowRightShopButton
        );
      });
    }

    return () => {
      cateScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(
          cateScrollRef,
          setShowLeftCateButton,
          setShowRightCateButton
        );
      });

      shopScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(
          shopScrollRef,
          setShowLeftShopButton,
          setShowRightShopButton
        );
      });
    };
  }, [categories]);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-bg overflow-y-auto">
      <Nav />

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5">
        <h1 className="text-black text-2xl sm:text-3xl">
          Inspiration for your first order.
        </h1>

        <div className="w-full relative">
          {showLeftCateButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-hover z-10"
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
            ref={cateScrollRef}
          >
            {categories.map((cate, index) => (
              <CategoryCard
                name={cate.category}
                image={cate.image}
                key={index}
              />
            ))}
          </div>

          {showRightCateButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-hover z-10"
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5">
        <h1 className="text-black text-2xl sm:text-3xl">
          Best shop in {currentCity}
        </h1>

        <div className="w-full relative">
          {showLeftShopButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-hover z-10"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
            ref={shopScrollRef}
          >
            {shopsInMyCity?.map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image} key={index} />
            ))}
          </div>

          {showRightShopButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-hover z-10"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5">
        <h1 className="text-black text-2xl sm:text-3xl">
          Suggested Food Items
        </h1>
      </div>

      <div className="w-full h-auto flex flex-wrap gap-5 justify-center mb-4">
        {itemsInMyCity?.map((item, index) => (
          <FoodCard key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
