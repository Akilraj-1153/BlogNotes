import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { UserAuthDetails, DarkTheme } from "../Configuration/Atoms";
import { filterPaginationData } from "../Home/filterPaginationData";
import BlogManageCard from "./BlogManageCard";
import DraftManageCard from "./DraftManageCard";
import { FaSearch } from "react-icons/fa";
import PageNotFound from "../Common/PageNotFound";
import { getButtonClass } from "../Common/MiniComponent";
import FetchingLoader from "../Common/FetchingLoader";

function BlogManagement() {
  const [blog, setBlog] = useState(null);
  const [draftBlog, setDraftBlog] = useState(null);
  const [displayedContent, setDisplayedContent] = useState("published");
  const [query, setQuery] = useState("");
  const [userAuth] = useRecoilState(UserAuthDetails);
  const [isDarkTheme] = useRecoilState(DarkTheme);
  const [loading, setLoading] = useState(true); // Maintain the loading state

  // Fetch blogs with loading management
  const fetchBlogs = async ({ page, draft, deletedDocCount = 0 }) => {
    setLoading(true); // Set loading true when the API request is initiated
    if (page > 1) {
      setLoading(false);
    }
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/blog/user_written_blogs`,
        { page, draft, query, deletedDocCount },
        {
          headers: {
            Authorization: `Bearer ${userAuth.access_token}`,
          },
        }
      );

      const formattedData = await filterPaginationData({
        state: page === 1 ? null : draft ? draftBlog : blog,
        data: data.blogs,
        page,
        countRoute: "/api/blog/user_written_blogs_count",
        data_to_send: { draft, query },
        user: userAuth.access_token,
      });
      console.log(formattedData);
      setTimeout(() => {
        draft ? setDraftBlog(formattedData) : setBlog(formattedData);
        setLoading(false); // Always set loading to false after the fetch is done
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!blog && displayedContent === "published")
      fetchBlogs({ page: 1, draft: false });
    if (!draftBlog && displayedContent === "draft")
      fetchBlogs({ page: 1, draft: true });
  }, [userAuth.access_token, blog, query, draftBlog, displayedContent]);

  const handleSearch = (e) => {
    if (e.keyCode === 13 && query.length) {
      setBlog(null);
      setDraftBlog(null);
      fetchBlogs({ page: 1, draft: displayedContent === "draft" });
    }
  };

  const handleSearchChange = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (!searchQuery.length) {
      setBlog(null);
      setDraftBlog(null);
      fetchBlogs({ page: 1, draft: displayedContent === "draft" });
    }
  };

  const handleToggleContent = (content) => {
    setDisplayedContent(content);
    setBlog(null);
    setDraftBlog(null);
    fetchBlogs({ page: 1, draft: content === "draft" });
  };

  const handleNextBlogPage = (blogData, draft) => {
    if (blogData && blogData.totalDocs > blogData.results.length) {
      const nextPage = blogData.page + 1;
      fetchBlogs({ page: nextPage, draft });
    }
  };

  return (
    <div className="w-full px-2 ">
      <div
        className={`sticky top-0 z-30 ${
          isDarkTheme ? "bg-[#121212]" : "bg-[#f9fafb]"
        }`}
      >
        <div className="mb-4 hidden sm:flex">
          <h1 className="text-2xl font-semibold">Blog</h1>
        </div>

        <div
          className={`flex w-fit px-3 items-center rounded-full gap-2 border-2 border-gray-500`}
          onKeyDown={handleSearch}
        >
          <input
            className={`p-2 rounded-full outline-none bg-transparent`}
            placeholder="Search"
            onChange={handleSearchChange}
          />
          <FaSearch />
        </div>

        <div className="flex gap-4 mt-4 pb-2">
          <button
            className={
              displayedContent === "published"
                ? isDarkTheme
                  ? "border-b-2 border-white"
                  : "border-b-2 border-black"
                : ""
            }
            onClick={() => handleToggleContent("published")}
          >
            Published
          </button>
          <button
            className={
              displayedContent === "draft"
                ? isDarkTheme
                  ? "border-b-2 border-white"
                  : "border-b-2 border-black"
                : ""
            }
            onClick={() => handleToggleContent("draft")}
          >
            Draft
          </button>
        </div>
      </div>

      <div className={`  p-4 rounded-lg mt-4 overflow-x-auto mb-10`}>
        {loading ? ( // Show loader while fetching
          <FetchingLoader des={"Fetching Your Blog Data..."}></FetchingLoader>
        ) : displayedContent === "published" ? (
          blog && blog.results && blog.results.length ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blog.results.map((blogItem, i) => (
                  <BlogManageCard
                    key={i}
                    blog={blogItem}
                    index={i}
                    BlogData={{ blog, setBlog }}
                  />
                ))}
              </div>
              {blog && blog.totalDocs > blog.results.length && (
                <button
                  className={`${getButtonClass(isDarkTheme)} mt-2`}
                  onClick={() => handleNextBlogPage(blog, false)}
                >
                  Load More
                </button>
              )}
            </div>
          ) : (
            <PageNotFound
              des="It looks like you don't have any published blogs yet. Start writing your first blog to share your thoughts with the world!"
              error="No published blogs found"
              errorType="BlogNotFound"
            />
          )
        ) : draftBlog && draftBlog.results && draftBlog.results.length ? (
          <div className="flex flex-col ">
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-fit"
              style={{ gridAutoFlow: "dense" }}
            >
              {draftBlog.results.map((draftItem, i) => (
                <DraftManageCard
                  key={i}
                  draft={draftItem}
                  value={i}
                  DraftData={{ draftBlog, setDraftBlog }}
                  index={i}
                />
              ))}
            </div>
            {draftBlog && draftBlog.totalDocs > draftBlog.results.length && (
              <button
                onClick={() => handleNextBlogPage(draftBlog, true)}
                className={`${getButtonClass(isDarkTheme)}`}
              >
                Load More
              </button>
            )}
          </div>
        ) : (
          <PageNotFound
            des="It looks like you don't have any saved draft blogs yet. Start writing your first blog to share your thoughts with the world!"
            error="No saved drafts blogs found"
            errorType="DraftNotFound"
          />
        )}
      </div>
    </div>
  );
}

export default BlogManagement;
