import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SettingsNavBar from "./SettingsNavBar";
import { useRecoilState } from "recoil";
import { NavHeight, DarkTheme, UserAuthDetails, UserProfile } from "../Configuration/Atoms";
import axios from "axios";

function SettingsHome() {
  const [userAuth] = useRecoilState(UserAuthDetails);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [profile, setProfile] = useRecoilState(UserProfile);
  const [loadingPage, setLoadingPage] = useState(true);
  const [navbarHeight, setNavbarHeight] = useRecoilState(NavHeight);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/get_profile`,
        { username: userAuth.username }
      );

      if (response.data) {
        setProfile(response.data);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProfile({
      personal_info: {
        fullname: "",
        email: "",
        username: "",
        profile_img: "",
        bio: "",
      },
      social_links: {
        facebook: "",
        github: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        website: "",
        youtube: "",
      },
      account_info: {
        total_posts: 0,
        total_reads: 0,
      },
      joinedAt: "",
      github_auth: null,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (userAuth.username) {
      fetchUserProfile();
    }
    setLoadingPage(false);
  }, [userAuth]);

  return (
    <div
      className="w-full flex flex-col sm:flex-row overflow-hidden"
      style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}
    >
      <div className="w-full sm:w-2/5 md:w-2/6 lg:w-1/5">
        <SettingsNavBar />
      </div>

      <div className="flex-1 overflow-x-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default SettingsHome;
