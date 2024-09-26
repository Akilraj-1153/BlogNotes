import React from "react";
import { DarkTheme,NavHeight } from "../Configuration/Atoms";
import { useRecoilState } from "recoil";
import Black_logo from "../../assets/Logo/Logo-Black.png";
import White_logo from "../../assets/Logo/Logo-White.png";
import { useNavigate } from "react-router-dom";


function FetchingLoader({ des }) {
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);
  const [navbarHeight, setNavbarHeight] = useRecoilState(NavHeight);


  let navigation = useNavigate();
  const buttonClass = isDarkTheme
    ? "bg-gray-400 text-black hover:bg-white"
    : "bg-gray-400 hover:bg-black hover:text-white";

  return (
    <div
      className={`flex  flex-col items-center justify-center  w-full`}
    >
      <div className="text-center">
        <div className="mt-5 flex flex-col items-center gap-2">
          <img
            src={!isDarkTheme ? Black_logo : White_logo}
            className="max-h-14 w-fit"
            alt="Logo"
          />
          <h1>"Explore, Learn, and Share"</h1>
        </div>

        <h1 className="text-5xl font-semibold mb-2">Loading... Please Wait!</h1>
        <h1 className="text-3xl font-semibold mb-2">{des}</h1>
      </div>
    </div>
  );
}

export default FetchingLoader;
