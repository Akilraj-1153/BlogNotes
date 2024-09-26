import React, { useState, useContext } from "react";
import { useRecoilState } from "recoil";
import { CiMenuKebab } from "react-icons/ci";
import { AiOutlineMenu } from "react-icons/ai";
import { DarkTheme } from "../Configuration/Atoms";
import { BlogButtons } from "../Common/MiniComponent";
import { useNavigate } from "react-router-dom";
import { HomeCategoryContext } from "./CategoryHome";

function CategoryNavBar() {
  const [showNav, setShowNav] = useState(false);
  const [isDarkMode] = useRecoilState(DarkTheme);

  const { selectedCategory, setSelectedCategory } =
    useContext(HomeCategoryContext);
  const navigation = useNavigate();

  const blogCategories = [
    "Technology",
    "Information Technology",
    "Artificial Intelligence",
    "Cybersecurity",
    "Blockchain",
    "ReactJS",
    "Web Development",
    "Mobile Development",
    "Cloud Computing",
    "Travel",
    "Adventure Travel",
    "Cultural Travel",
    "Luxury Travel",
    "Budget Travel",
    "Travel Tips",
    "Health",
    "Nutrition",
    "Mental Health",
    "Fitness",
    "Wellness",
    "Healthcare Technology",
    "Cooking",
    "Quick Recipes",
    "Healthy Cooking",
    "Baking",
    "Vegetarian Recipes",
    "International Cuisine",
    "Lifestyle",
    "Minimalism",
    "Fashion",
    "Personal Development",
    "Home Decor",
    "Sustainability",
    "Finance",
    "Personal Finance",
    "Investing",
    "Cryptocurrency",
    "Budgeting",
    "Retirement Planning",
    "Sustainability",
    "Eco-Friendly Living",
    "Renewable Energy",
    "Sustainable Fashion",
    "Zero Waste",
    "Green Technology",
    "Education",
    "Online Learning",
    "STEM Education",
    "Teaching Resources",
    "Educational Technology",
    "Lifelong Learning",
    "Parenting",
    "Newborn Care",
    "Parenting Tips",
    "Education for Kids",
    "Work-Life Balance",
    "Parenting Styles",
  ];

  const handleCategoryClick = (category) => {
    setShowNav(false);
    setSelectedCategory(category);
    navigation(`/category/selectedcategory/${category}`);
  };

  return (
    <div className={`h-full w-full p-2 rounded-lg `}>
      {/* Mobile Navbar */}
      <div className="sm:hidden flex items-center justify-between">
        <h1
          className={`text-2xl font-semibold ${
            showNav || selectedCategory === "Home" ? "opacity-0" : "opacity-100"
          }`}
        >
          Latest Blog - {selectedCategory}
        </h1>

        <button type="button" onClick={() => setShowNav(!showNav)}>
          {showNav ? <AiOutlineMenu /> : <CiMenuKebab />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {showNav && (
        <div className="sm:hidden flex flex-col w-full gap-2 p-4">
          <div className="w-full">
            <h1
              className={`${BlogButtons(
                isDarkMode,
                "All Blogs",
                selectedCategory
              )} cursor-pointer text-xl`}
              onClick={() => handleCategoryClick("All Blogs")}
            >
              All Blogs
            </h1>
          </div>

          <div className="flex flex-col items-start justify-start gap-2">
            <h1 className="text-xl font-bold px-3 py-2">Category</h1>
            {blogCategories.map((category, i) => (
              <button
                key={i}
                onClick={() => handleCategoryClick(category)}
                className={`${BlogButtons(
                  isDarkMode,
                  category,
                  selectedCategory
                )}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Navbar */}
      <div className="hidden sm:flex flex-col gap-2 p-4">
        <div className="flex flex-col items-start justify-start gap-2">
          <div className="w-full">
            <h1
              className={`${BlogButtons(
                isDarkMode,
                "All Blogs",
                selectedCategory
              )} cursor-pointer text-xl`}
              onClick={() => handleCategoryClick("All Blogs")}
            >
              All Blogs
            </h1>
          </div>

          <h1 className="text-xl font-bold px-3 py-2 cursor-disabled">
            Category
          </h1>
          {blogCategories.map((category, i) => (
            <button
              key={i}
              onClick={() => handleCategoryClick(category)}
              className={`${BlogButtons(
                isDarkMode,
                category,
                selectedCategory
              )}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryNavBar;
