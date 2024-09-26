import React, { useEffect } from "react";
import Black_logo from "../../assets/Logo/Logo-Black.png";
import White_logo from "../../assets/Logo/Logo-White.png";
import { useRecoilState } from "recoil";
import { DarkTheme, NavHeight } from "../Configuration/Atoms";
import HomeBg from "../../assets/Images/HomeBg.png";
import { getButtonClass } from "../Common/MiniComponent";
import { Link, useNavigate } from "react-router-dom";
import TrendingBlog from "./TrendingBlog";


function Home() {
  const [isDarkTheme] = useRecoilState(DarkTheme);
  const [navbarHeight, setNavbarHeight] = useRecoilState(NavHeight);
  let navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div
      className={` ${isDarkTheme ? "bg-[#121212]" : "bg-[#f9fafb]"} text-${
        isDarkTheme ? "white" : "black"
      }`}
    >
      <div
        className="w-full relative"
        style={{ height: `calc(100vh - ${navbarHeight}px)` }}
      >
        <img
          src={HomeBg}
          className={`w-full h-full object-cover  ${
            isDarkTheme ? "opacity-10" : " opacity-30"
          }`}
          alt="Home Background"
        />
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-opacity-80 p-8 rounded-lg  ">
            <img
              src={isDarkTheme ? White_logo : Black_logo}
              alt="Logo"
              className="max-h-16 mb-4 mx-auto"
            />
            <div className="text-center ">
              <h1 className="text-4xl font-bold">Welcome to BlogNotes</h1>
              <p className="mt-2 text-lg font-semibold">
                "Notes from the Mind, Ideas for the Blog."
              </p>
              <p className="mt-4 max-w-lg mx-auto text-base">
                Your go-to space for insightful articles and ideas that inspire.
              </p>
              <div className="flex gap-2 justify-center mt-3">
                <button
                  onClick={() => navigate("/editor/create-new-blog")}
                  className={`${getButtonClass(isDarkTheme)}`}
                >
                  Write Blog
                </button>
                <button
                  onClick={() =>
                    navigate("/category/selectedcategory/All Blogs")
                  }
                  className={`${getButtonClass(isDarkTheme)}`}
                >
                  Explore Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="w-full bg-transparent p-5"
        style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}
      >
        <h1 className="flex justify-center text-3xl font-bold">
          Trending Blogs
        </h1>
        <TrendingBlog></TrendingBlog>
      </div>

      <div
        className="w-full bg-transparent p-5 flex flex-col items-center"
        style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}
      >
        <div className="max-w-3xl p-3 mx-auto">
          <h1 className="text-center text-3xl font-bold mb-6">
            Small Intro About BlogNotes
          </h1>
          <div className="text-center">
            <p className="text-2xl">Welcome to BlogNotes</p>
            <em className="text-xl">Notes from the Mind, Ideas for the Blog</em>
          </div>
          <p className="mt-6 text-center text-md">
            BlogNotes is a place where ideas evolve. Whether it’s a passing
            thought, a deep insight, or a creative spark, BlogNotes gives these
            ideas a home. The purpose is simple: to transform abstract concepts
            into discussions that inspire, inform, and challenge our way of
            thinking.
          </p>
          <h2 className="text-2xl font-semibold mt-8 text-center">
            Why BlogNotes?
          </h2>
          <p className="mt-4 text-center">
            BlogNotes curates meaningful content, serving as both a personal
            knowledge base and a platform for sharing lessons, experiences, and
            curiosities. Topics range from lifestyle hacks and tech insights to
            broader discussions on philosophy and culture.
          </p>
          <h2 className="text-2xl font-semibold mt-8 text-center">
            Join the Conversation
          </h2>
          <p className="mt-4 text-center">
            BlogNotes thrives on community engagement. Your thoughts, ideas, and
            feedback enrich the blog and foster collaborative growth. Thank you
            for visiting, and I hope BlogNotes inspires you as much as it
            inspires me to write.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
