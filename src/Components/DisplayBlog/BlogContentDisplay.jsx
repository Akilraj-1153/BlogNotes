import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import BlogIntraction from "./BlogIntraction";
import BlogContent from "./BlogContent";
import SimilarBlog from "./SimilarBlog";
import { getDay } from "../Common/Date";
import { useRecoilState } from "recoil";
import { DarkTheme } from "../Configuration/Atoms";

function BlogContentDisplay({
  banner,
  title,
  username,
  fullname,
  profile_img,
  publishedAt,
  content,
  similarBlog,
}) {
  const [isDarkTheme] = useRecoilState(DarkTheme);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="h-fit w-full p-2">
      <div className="overflow-y-auto flex justify-center p-2 rounded-xl">
        <div
          className={`h-fit w-full md:max-w-3xl rounded-xl shadow-xl ${
            isDarkTheme ? "bg-[#282828]" : "bg-white"
          }`}
        >
          <div className="p-2 Banner aspect-video">
            <img
              className="w-full h-auto aspect-video object-cover rounded-lg"
              src={banner}
              alt="Banner"
            />
          </div>
          <div className="flex gap-2 p-4 w-full">
            <img
              src={profile_img}
              className="h-10 w-10 rounded-full"
              alt="Profile"
            />
            <div className="flex flex-col w-full">
              <p className="text-md font-bold w-[80%] break-words">
                {fullname}
              </p>
              <p className="text-xs text-gray-500  w-[80%] break-words">
                @{username}
              </p>
              <p className="text-xs text-gray-400">{getDay(publishedAt)}</p>
            </div>
          </div>
          <div className="p-2">
            <h1 className="w-full break-words resize-none h-fit outline-none rounded-lg px-2 text-3xl leading-tight bg-transparent">
              {title}
            </h1>
          </div>
          <div className="w-full p-2 rounded-lg">
            <BlogIntraction />
            <div className="p-2 w-full">
              <div className="p-3 h-fit w-full break-words gap-2 flex flex-col">
                {content[0].blocks.map((block, i) => (
                  <div key={i}>
                    <BlogContent block={block} />
                  </div>
                ))}
              </div>
              <hr className="border-1 border-gray-500 mt-2 rounded-full" />
              {similarBlog && similarBlog.length > 0 && (
                <>
                  <h1 className="text-2xl py-4">Similar Blogs</h1>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {similarBlog.map((blog, i) => (
                      <SimilarBlog
                        key={i}
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogContentDisplay;
