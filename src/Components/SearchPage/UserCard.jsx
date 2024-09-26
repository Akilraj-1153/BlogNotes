import React from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { DarkTheme } from "../Configuration/Atoms";

function UserCard({ user }) {
  // Destructuring the user object
  const {
    personal_info: { fullname, username, profile_img },
    joinedAt,
  } = user;

  const [isDarkTheme] = useRecoilState(DarkTheme);

  return (
    <Link
      to={`/user/${username}`}
      className={`flex gap-4 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        isDarkTheme
          ? "bg-[#282828] text-white hover:bg-[#1f1f1f]"
          : "bg-white text-gray-900 hover:bg-gray-100"
      }`}
    >
      <img
        src={profile_img}
        alt={`${fullname}'s profile`}
        className="w-12 h-12 rounded-full object-cover mr-4"
      />
      <div className="flex flex-col w-full">
        <p className="text-md font-bold w-[80%] break-words line-clamp-3">
          {fullname}
        </p>
        <p className="text-xs text-gray-500 w-[80%] break-words line-clamp-3">
          @{username}
        </p>
        <p className="text-xs text-gray-400">
          {`Joined on ${new Date(joinedAt).toLocaleDateString()}`}
        </p>
      </div>
    </Link>
  );
}

export default UserCard;
