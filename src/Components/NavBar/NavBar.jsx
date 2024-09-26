import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { DarkTheme, UserAuthDetails } from "../Configuration/Atoms";
import Black_logo from "../../assets/Logo/Logo-Black.png";
import White_logo from "../../assets/Logo/Logo-White.png";
import MoonIcon from "../../assets/Icons/moon.png";
import SunIcon from "../../assets/Icons/sun.png";
import { useNavigate, Link } from "react-router-dom";
import { IoNotificationsSharp } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { getButtonClass } from "../Common/MiniComponent";
import { removeFromLocal } from "../Configuration/Session";
import UserNavBarPanel from "./UserNavBarPanal";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { LuFileEdit } from "react-icons/lu";

function NavBar({ onHeightChange }) {
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);
  const [showSearch, setShowSearch] = useState(false);
  const [userAuth, setUserAuth] = useRecoilState(UserAuthDetails);
  const navigate = useNavigate(); // Initialize the navigate hook
  const [userNavPanel, setUserNavPanel] = useState(false);
  const navbarRef = useRef(null);

  const handleSearch = (e) => {
    const query = e.target.value;
    if (e.key === "Enter" && query.length) {
      navigate(`/search/${query}`);
      setShowSearch(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setUserNavPanel(false), 500);
  };

  const handleThemeToggle = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem("darkTheme", JSON.stringify(newTheme));
  };

  useEffect(() => {
    if (navbarRef.current) {
      onHeightChange(navbarRef.current.offsetHeight);
    }
  }, [onHeightChange]);

  useEffect(() => {
    if (userAuth.access_token) {
      axios
        .get(
          `${
            import.meta.env.VITE_SERVER_DOMAIN
          }/api/notification/new_notification`,
          {
            headers: {
              Authorization: `Bearer ${userAuth.access_token}`,
            },
          }
        )
        .then(({ data }) => {
          setUserAuth({ ...userAuth, ...data });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [userAuth.access_token]);

  return (
    <div ref={navbarRef} className="flex flex-col">
      <div className="flex justify-between px-3 py-2 items-center">
        <div className="flex gap-2">
          <Link to="/" className="flex gap-2">
            <img
              src={isDarkTheme ? White_logo : Black_logo}
              alt="Logo"
              className="max-h-10"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex w-fit px-3 hidden sm:flex items-center rounded-full gap-2 border`}
            onKeyDown={handleSearch}
          >
            <input
              className={`p-2 rounded-full outline-none bg-transparent`}
              placeholder="Search"
            />
            <FaSearch />
          </div>
          <button onClick={handleThemeToggle}>
            <img
              src={isDarkTheme ? SunIcon : MoonIcon}
              alt="themeicon"
              className="max-h-10"
            />
          </button>

          {userAuth.access_token ? (
            <>
              <Link
                to="/editor/create-new-blog"
                className={`flex gap-2 items-center rounded-full ${getButtonClass(
                  isDarkTheme
                )}`}
                aria-label="Write"
              >
                Write
                <LuFileEdit className="text-xl"></LuFileEdit>

              </Link>
              <button
                className={`p-1 rounded-full sm:hidden !p-2 ${getButtonClass(
                  isDarkTheme
                )}`}
                onClick={() => setShowSearch(!showSearch)}
              >
                <CiSearch className="text-2xl" />
              </button>
              <Link
                to="/dashboard/notifications"
                className={`p-1 rounded-full !p-2 ${getButtonClass(
                  isDarkTheme
                )} relative`}
              >
                <IoNotificationsSharp className="text-2xl" />
                {userAuth.new_notification_available && (
                  <span className=" absolute h-2 top-2.5 right-2.5 w-2 bg-red-500 rounded-full"></span>
                )}
              </Link>
              <div
                className={`rounded-full flex justify-center items-center cursor-pointer ${
                  isDarkTheme ? "bg-gray-300" : "bg-stone-800"
                }`}
                onBlur={handleBlur}
                tabIndex={0}
                onClick={() => setUserNavPanel(!userNavPanel)}
              >
                <img
                  loading="lazy"
                  src={userAuth.profile_img}
                  className="h-10 w-10 overflow-hidden rounded-full"
                  alt="User Profile"
                />
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className={getButtonClass(isDarkTheme)}>
                Log In
              </Link>
              <Link to="register" className={getButtonClass(isDarkTheme)}>
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
      {showSearch && (
        <div className="w-full p-2 sm:hidden">
          <input
            type="search"
            onKeyDown={handleSearch}
            placeholder="Search Blog"
            className={`p-2 w-full rounded-lg outline-none bg-transparent border`}
          />
        </div>
      )}
      {userNavPanel && (
        <div className="absolute top-10 right-0 mt-2 mr-2">
          <UserNavBarPanel setUserNavPanel={setUserNavPanel} />
        </div>
      )}
    </div>
  );
}

export default NavBar;
