import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { UserAuthDetails, DarkTheme, NavHeight } from "../Configuration/Atoms";
import {
  FaFacebookSquare,
  FaLinkedin,
  FaInstagram,
  FaTwitterSquare,
  FaGithub,
} from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { TfiWorld } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { getButtonClass } from "../Common/MiniComponent";
import { joinedAtFunc } from "../Common/Date";
import FetchingLoader from "../Common/FetchingLoader";
import PageNotFound from "../Common/PageNotFound";

export const ProfileDataSchema = {
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
};

function ProfilePage() {
  const { id: profileId } = useParams();
  const [profile, setProfile] = useState(ProfileDataSchema);
  const [isDarkTheme] = useRecoilState(DarkTheme);
  const [loading, setLoading] = useState(true);
  const [userAuth] = useRecoilState(UserAuthDetails);
  const navigate = useNavigate();
  const [navbarHeight] = useRecoilState(NavHeight);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/get_profile`,
        { username: profileId }
      );
      console.log(response.data);
      setTimeout(() => {
        setProfile(response.data);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setProfile(ProfileDataSchema);
    fetchUserProfile();
  }, [profileId]);

  return (
    <div
      className="w-full break-words"
      style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}
    >
      {loading ? (
        <FetchingLoader des={`Fetching User Details`} />
      ) : profile && profile.personal_info.username ? (
        <div
          className={`flex flex-col items-center px-2 break-words shadow-lg rounded-lg max-w-2xl mx-auto ${
            isDarkTheme ? "bg-[#282828]" : "bg-white"
          }`}
        >
          <div className="mt-2">
            <img
              src={profile.personal_info.profile_img || "/default-profile.png"}
              alt={profile.personal_info.fullname}
              className="w-auto h-64 rounded-lg object-cover mb-4"
            />
          </div>
          <div className="flex flex-col items-center text-center break-words w-full">
            <div className="flex items-center gap-2 w-full">
              <h1 className="text-3xl font-bold mb-1 w-full break-words">
                {profile.personal_info.fullname}
              </h1>
            </div>
            <p className="text-xl mb-3 w-full break-words">
              @{profile.personal_info.username}
            </p>
            <div className="text-center w-full break-words mb-4">
              {userAuth.username === profile.personal_info.username && (
                <Link
                  to="/settings/Edit-Profile"
                  className={`${getButtonClass(isDarkTheme)} !py-2`}
                >
                  Edit Profile
                </Link>
              )}
            </div>
            <p className="mb-6 px-4 text-center w-full break-words">
              {profile.personal_info.bio || "This user hasn't added a bio yet."}
            </p>
            <div className="flex space-x-6 mb-6 w-full items-center justify-center">
              {profile.social_links.facebook && (
                <a
                  href={profile.social_links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookSquare
                    size="2em"
                    className={`hover:text-blue-700 transition duration-300 ${
                      isDarkTheme ? "text-blue-500" : "text-blue-600"
                    }`}
                  />
                </a>
              )}
              {profile.social_links.twitter && (
                <a
                  href={profile.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitterSquare
                    size="2em"
                    className={`hover:text-blue-500 transition duration-300 ${
                      isDarkTheme ? "text-blue-400" : "text-blue-400"
                    }`}
                  />
                </a>
              )}
              {profile.social_links.instagram && (
                <a
                  href={profile.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram
                    size="2em"
                    className={`hover:text-pink-600 transition duration-300 ${
                      isDarkTheme ? "text-pink-400" : "text-pink-500"
                    }`}
                  />
                </a>
              )}
              {profile.social_links.linkedin && (
                <a
                  href={profile.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin
                    size="2em"
                    className={`hover:text-blue-800 transition duration-300 ${
                      isDarkTheme ? "text-blue-600" : "text-blue-700"
                    }`}
                  />
                </a>
              )}
              {profile.social_links.youtube && (
                <a
                  href={profile.social_links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoLogoYoutube
                    size="2em"
                    className={`hover:text-red-700 transition duration-300 ${
                      isDarkTheme ? "text-red-500" : "text-red-600"
                    }`}
                  />
                </a>
              )}
              {profile.social_links.github && (
                <a
                  href={profile.social_links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition duration-300"
                >
                  <FaGithub
                    size="2em"
                    className={`transition-colors duration-300 ${
                      isDarkTheme
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-800 hover:text-gray-600"
                    }`}
                  />
                </a>
              )}
              {profile.social_links.website && (
                <a
                  href={profile.social_links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition duration-300"
                >
                  <TfiWorld
                    size="2em"
                    className={`transition-colors duration-300 ${
                      isDarkTheme
                        ? "text-teal-400 hover:text-teal-200"
                        : "text-indigo-600 hover:text-indigo-400"
                    }`}
                  />
                </a>
              )}
            </div>
          </div>
          <div className="mb-4 p-2 text-center rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-2">Account Info</h2>
            <p>
              Total Posts:{" "}
              <span className="font-semibold">
                {profile.account_info.total_posts}
              </span>
            </p>
            <p>
              Total Reads:{" "}
              <span className="font-semibold">
                {profile.account_info.total_reads}
              </span>
            </p>
            <p>
              Joined:{" "}
              <span className="font-semibold">
                {joinedAtFunc(profile.joinedAt)}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <PageNotFound
          des="The user you are looking for was not found."
          error="User not found"
          errorType="UserNotFound"
        />
      )}
    </div>
  );
}

export default ProfilePage;
