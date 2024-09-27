import React, { useEffect, useState } from "react";
import axios from "axios";
import FetchingLoader from "../Common/FetchingLoader";
import PageNotFound from "../Common/PageNotFound";
import { getDay } from "../Common/Date";
import { useRecoilState } from "recoil";
import { DarkTheme } from "../Configuration/Atoms";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";

function TrendingBlog() {
  const [Blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);

  const fetchTrendingBlogs = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/blog/trending_blog`
      );
      console.log(data);
        setLoading(false);
        setBlog(data);
    } catch (error) {
      console.error("Error fetching blogs by category:", error);
    }
  };

  useEffect(() => {
    fetchTrendingBlogs();
  }, []);

  return (
    <div className="flex justify-center">
      {loading ? (
        <FetchingLoader des="Fetching Trending blogs ... Please wait." />
      ) : Blog && Blog.blog.length ? (
        <div className="flex flex-col gap-6 w-full p-4 md:max-w-4xl">
          {Blog.blog.map((blog, i) => (
            <Link
              to={`/blog/${blog.blog_id}`}
              key={i}
              className={`flex flex-col md:flex-row gap-6 p-4  rounded-lg shadow-lg ${
                isDarkTheme ? "bg-[#3f3f3f]" : "bg-white"
              }`}
            >
              <div className="flex flex-col justify-between w-full">
                <div className="flex gap-3 items-center mb-4">
                  <img
                    src={blog.author.personal_info.profile_img}
                    className="h-10 w-10 rounded-full"
                    alt={blog.author.personal_info.fullname}
                  />
                  <div className="flex flex-col w-full">
                    <p className="text-md font-semibold  w-[80%] truncate">
                      {blog.author.personal_info.fullname}
                    </p>
                    <p className="text-xs  w-[80%] truncate">
                      @{blog.author.personal_info.username}
                    </p>
                    <p className="text-xs ">{getDay(blog.publishedAt)}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mb-4 w-full">
                  <p className="font-bold text-lg underline w-full  break-words">
                    {blog.title}
                  </p>
                  <p className="text-sm w-full break-words">{blog.des}</p>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <p
                        key={index}
                        className="text-sm capitalize  px-2 py-1 truncate max-w-[100px] rounded-full"
                      >
                        #{tag}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaHeart className="text-red-600 text-lg"></FaHeart>
                    <p className="text-sm">{blog.activity.total_likes}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <PageNotFound
          des="Currently, there are no blogs available in the Trending blogs"
          error="No blogs found for the Trending blogs"
          errorType="BlogNotFound"
        />
      )}
    </div>
  );
}

export default TrendingBlog;
