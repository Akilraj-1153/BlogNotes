import React, { useEffect, useState, createContext } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import CategoryNavBar from "./CategoryNavBar";
import { NavHeight } from "../Configuration/Atoms";

export const HomeCategoryContext = createContext();

function CategoryHome() {
  const { categoryfromsearchbar } = useParams();
  const [navbarHeight] = useRecoilState(NavHeight);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setSelectedCategory(categoryfromsearchbar);
    window.scrollTo({ top: 0, behavior: "smooth" });

  }, [categoryfromsearchbar]);

  return (
    <HomeCategoryContext.Provider
      value={{ selectedCategory, setSelectedCategory }}
    >
      <div
        className="w-full flex flex-col gap-2 sm:flex-row overflow-hidden"
        style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}
      >
        <div
          className={` categoryscrollbar w-full h-full  sm:w-2/5 md:w-2/6 lg:w-1/5 p-2 overflow-y-scroll `}
          style={{ height: `calc(100vh - ${navbarHeight}px)` }}
        >
          <CategoryNavBar />
        </div>

        <div className="flex-1 overflow-x-auto">
          <Outlet />
        </div>
      </div>
    </HomeCategoryContext.Provider>
  );
}

export default CategoryHome;
