import React from "react";
import { DarkTheme, NavHeight } from "../Configuration/Atoms";
import { useRecoilState } from "recoil";
import Black_logo from "../../assets/Logo/Logo-Black.png";
import White_logo from "../../assets/Logo/Logo-White.png";
import { useNavigate } from "react-router-dom";

function PageNotFound({ des, error, errorType }) {
  const [isDarkTheme] = useRecoilState(DarkTheme);
  const [navbarHeight] = useRecoilState(NavHeight);

  let navigation = useNavigate();
  const buttonClass = isDarkTheme
    ? "bg-gray-400 text-black hover:bg-white"
    : "bg-gray-400 hover:bg-black hover:text-white";

  return (
    <div
      className={`flex  flex-col    justify-center  w-full  
        ${isDarkTheme ? "bg-[#121212] " : "bg-[#f9fafb]"}
      `}
    >
      <div className="text-center w-full">
        <div className="mt-5 flex flex-col  items-center gap-2 w-full">
          <img
            src={!isDarkTheme ? Black_logo : White_logo}
            className="max-h-14 w-fit"
            alt="Logo"
          />
          <h1>"Explore, Learn, and Share"</h1>
        </div>

        <h1 className="text-5xl font-semibold mb-2">Oops!</h1>
        <h1 className="text-4xl font-semibold mb-2 truncate">{error}</h1>
        <p
          className={`text-lg  text-center  truncate ${
            isDarkTheme ? "text-gray-400" : "text-gray-600"
          } mb-6`}
        >
          <span className="truncate ">{des}</span>
        </p>
        <div className="flex w-full justify-center gap-2">
          {(errorType === "BlogNotFound" || errorType === "DraftNotFound" || errorType === "CategoryBlogNotFound") && (
            <button
              className={`px-4 py-2 w-fit rounded-full transition-colors duration-300 cursor-pointer ${buttonClass}`}
              onClick={() => navigation("/editor")}
            >
              Write Blog
            </button>
          )}

          {(errorType === "PageNotFound" || errorType === "UserNotFound") && (
            <button
              className={`px-4 py-2 w-fit rounded-full transition-colors duration-300 cursor-pointer ${buttonClass}`}
              onClick={() => navigation("/")}
            >
              Go to Home Page
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
