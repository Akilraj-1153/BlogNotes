import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { filterPaginationData } from "../Home/filterPaginationData";
import { getButtonClass } from "../Common/MiniComponent";
import { useRecoilState } from "recoil";
import { DarkTheme } from "../Configuration/Atoms";
import PageNotFound from "../Common/PageNotFound";
import FetchingLoader from "../Common/FetchingLoader";
import BlogPostCard from '../Common/BlogPostCard';

function CategoryPage() {
  const { categoryfromsearchbar } = useParams();
  const categoryname = categoryfromsearchbar?.toLowerCase() || "";
  const [isDarkMode] = useRecoilState(DarkTheme);
  const [Blog, setBlog] = useState(null);
  const [pageno, setPageno] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBlogsByCategory = async (page) => {
    if (page > 1) {
      setLoading(false);
    }
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/blog/search_blogs`,
        { tag: categoryname, page }
      );

      const formattedData = await filterPaginationData({
        state: page === 1 ? null : Blog,
        data: data.blog,
        page,
        countRoute: "/api/blog/search_blogs_count",
        data_to_send: { tag: categoryname },
      });

        setLoading(false);
        setBlog(formattedData);
        setIsLastPage(formattedData.results.length >= formattedData.totalDocs);
    } catch (error) {
      console.error("Error fetching blogs by category:", error);
    }
  };

  const fetchLatestBlogs = async (page) => {
    if (page > 1) {
      setLoading(false);
    }
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/blog/latest_blog`,
        { page }
      );

      const formattedData = await filterPaginationData({
        state: page === 1 ? null : Blog,
        data: data.blog,
        page,
        countRoute: "/api/blog/all_latest_blogs_count",
      });

        setLoading(false);
        setBlog(formattedData);
        setIsLastPage(formattedData.results.length >= formattedData.totalDocs);
    } catch (error) {
      console.error("Error fetching latest blogs:", error);
    }
  };

  const handleLoadMore = () => {
    const nextPage = pageno + 1;
    setPageno(nextPage);
    if (categoryfromsearchbar === "All Blogs") {
      fetchLatestBlogs(nextPage);
    } else {
      fetchBlogsByCategory(nextPage);
    }
  };

  useEffect(() => {
    if (categoryname) {
      setLoading(true);
      setPageno(1);
      if (categoryfromsearchbar === "All Blogs") {
        fetchLatestBlogs(1);
      } else {
        fetchBlogsByCategory(1);
      }
    }
  }, [categoryname]);

  return (
    <div className="mb-4">
      {loading ? (
        <FetchingLoader
          des={`Fetching blogs in the "${categoryfromsearchbar}" category... Please wait.`}
        />
      ) : (
        <div>
          {!loading && Blog && Blog.results.length ? (
            <div>
              <div
                className={`mb-2 z-30 hidden sm:flex sticky top-0 ${isDarkMode ? "bg-[#121212]" : "bg-[#f9fafb]"}`}
              >
                <h1 className="text-2xl font-semibold capitalize">
                  Latest Blog - {categoryname}
                </h1>
              </div>
              <div className="z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {Blog.results.map((blog, i) => (
                  <BlogPostCard key={i} blog={blog} />
                ))}
              </div>
              {!isLastPage && (
                <div>
                  <button
                    className={`${getButtonClass(isDarkMode)} mt-3 mb-3`}
                    onClick={handleLoadMore}
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          ) : (
            <PageNotFound
              des={`Currently, there are no blogs available in the ${categoryfromsearchbar} category.`}
              error={`No blogs found for the ${categoryfromsearchbar} category.`}
              errorType="CategoryBlogNotFound"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
