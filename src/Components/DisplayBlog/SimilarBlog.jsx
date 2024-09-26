import React from "react";
import { getDay } from "../Common/Date";
import { AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { DarkTheme } from "../Configuration/Atoms";
import { FaHeart } from "react-icons/fa6";

function SimilarBlog({ content, author }) {
  const {
    publishedAt,
    tags,
    title,
    blog_id: id,
    activity: { total_likes },
  } = content;

  const { fullname, username, profile_img } = author;
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);

  return (
    <Link
      to={`/blog/${id}`}
      className={`block ${
        isDarkTheme ? "bg-[#3f3f3f]" : "bg-white"
      } rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 `}
    >
      <div className="p-4">
        <div className="flex gap-2  ">
          <img
            src={profile_img}
            className="h-10 w-10 rounded-full"
            alt="Profile"
          />
          <div className="flex flex-col w-full">
            <p className="text-md font-bold w-[80%] break-words line-clamp-3">
              {fullname}
            </p>
            <p className="text-xs text-gray-500  w-[80%] break-words line-clamp-3">
              @{username}
            </p>
            <p className="text-xs text-gray-400">{getDay(publishedAt)}</p>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <p key={i} className="text-sm capitalize">
                #{tag}
              </p>
            ))}
          </div>

          <span className="flex items-center gap-2">
            <FaHeart className="text-red-600 text-lg"></FaHeart>
            <p className="text-sm">{total_likes}</p>
          </span>
        </div>
        <h1 className="text-lg font-bold  break-words mt-2">{title}</h1>
      </div>
    </Link>
  );
}

export default SimilarBlog;
