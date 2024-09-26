import React from "react";
import { DarkTheme } from "../Configuration/Atoms";
import { useRecoilState } from "recoil";
import Black_logo from "../../assets/Logo/Logo-Black.png";
import White_logo from "../../assets/Logo/Logo-White.png";

function OfflinePage() {
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);
  const buttonClass = isDarkTheme
    ? "bg-gray-400 text-black hover:bg-white"
    : "bg-gray-400 hover:bg-black hover:text-white";

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen 
        ${isDarkTheme ? "bg-[#121212] " : "bg-[#f9fafb]"}
       `}
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

        <h1 className="text-5xl font-semibold mb-2">Oops!</h1>
        <h1 className="text-5xl font-semibold mb-2">You are offline!</h1>
        <p
          className={`text-lg ${
            isDarkTheme ? "text-gray-400" : "text-gray-600"
          } mb-6`}
        >
          It looks like you're not connected to the internet. Please check your
          connection.
        </p>
        <button
          className={`px-4 py-2 w-fit rounded-full transition-colors duration-300 cursor-pointer ${buttonClass}`}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default OfflinePage;
