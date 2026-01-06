// BiteRoute / Client / src / components / Dashboards / UserDashboard.jsx
import { useEffect, useRef, useState } from "react";
import { categories } from "../../category";
import CategoryCard from "../CategoryCard";
import Nav from "../Nav";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  const { currentCity } = useSelector((state) => state.user);

  const cateScrollRef = useRef();

  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const [showLeftCateButton, setShowLeftCateButton] = useState(false);

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

      cateScrollRef.current.addEventListener("scroll", () => {
        updateButton(
          cateScrollRef,
          setShowLeftCateButton,
          setShowRightCateButton
        );
      });
    }

    return () =>
      cateScrollRef.current.remeveEventListener("scroll", () => {
        updateButton(
          cateScrollRef,
          setShowLeftCateButton,
          setShowRightCateButton
        );
      });
  }, [cateScrollRef]);

  return (
    <div className="w-full min-h-screen bg-bg flex flex-col items-center">
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
              <CategoryCard data={cate} key={index} />
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
      </div>
    </div>
  );
};

export default UserDashboard;
