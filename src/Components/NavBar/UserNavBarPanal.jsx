import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { removeFromLocal } from "../Configuration/Session";
import { UserAuthDetails, DarkTheme } from "../Configuration/Atoms";
import { getCardButtonClass } from "../Common/MiniComponent";

function UserNavBarPanel({ setUserNavPanel }) {
  const [userAuth, setUserAuth] = useRecoilState(UserAuthDetails);
  const [isDarkTheme] = useRecoilState(DarkTheme);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeFromLocal("user");
    setUserNavPanel(false);
    setUserAuth({ access_token: null });
    navigate("/");
  };

  return (
    <div
      className={`z-50 mt-[2vh] backdrop-blur-3xl h-fit w-fit rounded-lg flex flex-col gap-2 p-2 shadow-xl ${
        isDarkTheme ? "bg-white text-black" : "bg-[#282828] text-white"
      }`}
    >
      <Link
        to={`/`}
        className={`flex w-full pl-2 pr-8 py-2 gap-2 items-center rounded-lg ${getCardButtonClass(
          !isDarkTheme
        )}`}
        aria-label="Home"
      >
        Home
      </Link>

      <Link
        to={`/category/selectedcategory/All Blogs`}
        className={`flex w-full pl-2 pr-8 py-2 gap-2 items-center rounded-lg ${getCardButtonClass(
          !isDarkTheme
        )}`}
        aria-label="Category"
      >
        Category
      </Link>

      <Link
        to={`/user/${userAuth.username}`}
        className={`flex w-full pl-2 pr-8 py-2 gap-2 items-center rounded-lg ${getCardButtonClass(
          !isDarkTheme
        )}`}
        aria-label="Profile"
      >
        Profile
      </Link>

      <Link
        to="/dashboard/notifications"
        className={`flex w-full pl-2 pr-8 py-2 gap-2 items-center rounded-lg ${getCardButtonClass(
          !isDarkTheme
        )}`}
        aria-label="Dashboard"
      >
        Dashboard
      </Link>

      <Link
        to="/settings/Edit-Profile"
        className={`flex w-full pl-2 pr-8 py-2 gap-2 items-center rounded-lg ${getCardButtonClass(
          !isDarkTheme
        )}`}
        aria-label="Settings"
      >
        Settings
      </Link>

      {userAuth.access_token && (
        <div
          onClick={handleLogout}
          className={`cursor-pointer flex flex-col w-full pl-2 pr-8 py-2 gap-2 items-center rounded-lg ${getCardButtonClass(
            !isDarkTheme
          )}`}
          aria-label="Sign Out"
        >
          <button className="font-bold w-full text-start">Sign Out</button>
          <p className="break-words max-w-[150px] line-clamp-2">
            @{userAuth.username}
          </p>
        </div>
      )}
    </div>
  );
}

export default UserNavBarPanel;
