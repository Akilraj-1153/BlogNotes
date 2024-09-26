import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CiMenuKebab, CiFileOn } from "react-icons/ci";
import { AiOutlineMenu } from "react-icons/ai";
import { useRecoilState } from "recoil";
import { DarkTheme, UserAuthDetails } from "../Configuration/Atoms";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { PiPasswordBold } from "react-icons/pi";
import { BlogButtons } from "../Common/MiniComponent";

function SettingsNavBar() {
  const location = useLocation();
  const page = location.pathname.split("/")[2] || "";

  const [showNav, setShowNav] = useState(false);
  const [userAuth] = useRecoilState(UserAuthDetails);
  const [currentSettingsPage, setCurrentSettingsPage] = useState(page.replace("-", " "));
  const [isDarkTheme] = useRecoilState(DarkTheme);

  const SidebarLink = ({ to, icon: Icon, label, page }) => (
    <Link
      to={to}
      className={`${BlogButtons(isDarkTheme, page, currentSettingsPage)} flex gap-2`}
      onClick={() => {
        setCurrentSettingsPage(page);
        setShowNav(false);
      }}
    >
      <Icon className="text-2xl" />
      {label}
      {label === "Notifications" && userAuth.new_notification_available && (
        <span className="h-2 w-2 bg-red-500 rounded-full ml-2"></span>
      )}
    </Link>
  );

  return (
    <div>
      <div className="sm:hidden flex items-center justify-between p-3">
        <h1 className={`text-2xl font-semibold capitalize ${showNav ? "opacity-0" : "opacity-100"}`}>
          {currentSettingsPage}
        </h1>
        <button type="button" onClick={() => setShowNav(!showNav)}>
          {showNav ? <AiOutlineMenu /> : <CiMenuKebab />}
        </button>
      </div>

      <div>
        {showNav && (
          <div className="sm:hidden flex p-4 flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl">Dashboard</h1>
              <div className="ml-5">
                <SidebarLink to="/dashboard/blog" icon={CiFileOn} label="Blog" page="blog" />
                <SidebarLink to="/dashboard/notifications" icon={IoMdNotificationsOutline} label="Notifications" page="notifications" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl">Settings</h1>
              <div className="ml-5">
                <SidebarLink to="/settings/Edit-Profile" icon={FaRegUser} label="Edit Profile" page="Edit Profile" />
                <SidebarLink to="/settings/Change-Password" icon={PiPasswordBold} label="Change Password" page="Change Password" />
              </div>
            </div>
          </div>
        )}

        <div className="hidden sm:flex p-4 flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl">Dashboard</h1>
            <div className="ml-5">
              <SidebarLink to="/dashboard/blog" icon={CiFileOn} label="Blog" page="blog" />
              <SidebarLink to="/dashboard/notifications" icon={IoMdNotificationsOutline} label="Notifications" page="notifications" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl">Settings</h1>
            <div className="ml-5">
              <SidebarLink to="/settings/Edit-Profile" icon={FaRegUser} label="Edit Profile" page="Edit Profile" />
              <SidebarLink to="/settings/Change-Password" icon={PiPasswordBold} label="Change Password" page="Change Password" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsNavBar;
