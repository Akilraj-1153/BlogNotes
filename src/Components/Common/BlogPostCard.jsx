import React from "react";
import { getDay } from "./Date";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { DarkTheme } from "../Configuration/Atoms";
import { FaHeart } from "react-icons/fa6";

function BlogPostCard({ blog }) {
  const [isDarkTheme] = useRecoilState(DarkTheme);

  const {
    publishedAt,
    tags,
    des,
    title,
    banner,
    blog_id: id,
    activity: { total_likes },
    author: {
      personal_info: { fullname, profile_img, username },
    },
  } = blog;

  return (
    <Link
      to={`/blog/${id}`}
      className={`flex flex-col justify-between gap-4 p-4 rounded-lg shadow-lg ${isDarkTheme ? "bg-[#282828]" : "bg-white"}`}
    >
      <div className="flex flex-col gap-2">
        <img
          src={banner}
          className="h-48 w-full object-cover rounded-lg hover:scale-105 transition-all"
          alt="Banner"
        />
        <div className="flex gap-2">
          <img
            src={profile_img}
            className="h-10 w-10 rounded-full"
            alt="Profile"
          />
          <div className="flex flex-col w-full">
            <p className="text-md font-bold w-[80%] line-clamp-3 overflow-hidden break-words">
              {fullname}
            </p>
            <p className="text-xs text-gray-500 line-clamp-3 w-[80%] break-words">
              @{username}
            </p>
            <p className="text-xs text-gray-400">{getDay(publishedAt)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-bold underline break-words line-clamp-5">{title}</h1>
          <p className="break-words line-clamp-3">{des}</p>
        </div>
      </div>
      <div className="flex justify-between items-center break-words gap-2">
        <div className="flex flex-wrap gap-2 w-[70%]">
          {tags.map((tag, i) => (
            <p key={i} className="text-sm capitalize w-full break-words line-clamp-1">
              #{tag}
            </p>
          ))}
        </div>
        <span className="flex items-center gap-2">
          <FaHeart className="text-red-600 text-lg"></FaHeart>
          <p className="text-sm">{total_likes}</p>
        </span>
      </div>
    </Link>
  );
}

export default BlogPostCard;
