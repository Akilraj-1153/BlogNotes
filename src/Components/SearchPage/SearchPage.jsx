import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import UserCard from "./UserCard";
import RenderSearchBlog from "./RenderSearchBlog";
import { NavHeight, DarkTheme } from "../Configuration/Atoms";
import { filterPaginationData } from "../Home/filterPaginationData";
import { getButtonClass } from "../Common/MiniComponent";
import PageNotFound from "../Common/PageNotFound";

function SearchPage() {
  const { query } = useParams();
  const [displayContent, setDisplayContent] = useState("Blog");
  const [latestBlogs, setLatestBlogs] = useState(null);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [fetchedUserData, setFetchedUserData] = useState(null);
  const [isDarkTheme] = useRecoilState(DarkTheme);
  const [navbarHeight] = useRecoilState(NavHeight);

  const searchBlog = async ({ page = 1, create_new_arr = false }) => {
    const isFirstPage = page === 1;
    if (isFirstPage) setLoadingLatest(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/blog/search_blogs`,
        { query, page }
      );

      const formattedData = await filterPaginationData({
        state: create_new_arr ? [] : latestBlogs,
        data: data.blog,
        page,
        countRoute: "/api/blog/search_blogs_count",
        data_to_send: { query },
        create_new_arr,
      });
        setLatestBlogs(formattedData);
        setLoadingLatest(false);
    } catch (err) {}
  };

  const fetchUser = async () => {
    try {
      const {
        data: { users },
      } = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/search_users`,
        { query }
      );
      setFetchedUserData(users);
    } catch (err) {}
  };

  const UserCardWrapper = () => (
    <div className="w-full p-2">
      <h2 className="text-2xl font-bold mb-4 capitalize w-full truncate">
        User's Matched for - {query}
      </h2>
      <div className="flex flex-col gap-2">
        {fetchedUserData ? (
          fetchedUserData.length > 0 ? (
            fetchedUserData.map((user, i) => <UserCard key={i} user={user} />)
          ) : (
            <PageNotFound
              des="The user you are looking for was not found."
              error="User not found"
              errorType="UserNotFound"
            />
          )
        ) : (
          <PageNotFound
            des="The user you are looking for was not found."
            error="User not found"
            errorType="UserNotFound"
          />
        )}
      </div>
    </div>
  );

  useEffect(() => {
    setLatestBlogs(null);
    setFetchedUserData(null);
    searchBlog({ page: 1, create_new_arr: true });
    fetchUser();
    console.log("useEffect triggered");
  }, [query]);

  return (
    <div
      className="w-full flex flex-col"
      style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}
    >
      <div className="flex gap-2 p-2 md:hidden">
        <button
          className={`${getButtonClass(isDarkTheme)}`}
          onClick={() => setDisplayContent("Blog")}
        >
          Blog
        </button>
        <button
          className={`${getButtonClass(isDarkTheme)}`}
          onClick={() => setDisplayContent("User's Matched")}
        >
          User's Matched
        </button>
      </div>

      <div className="w-full h-full">
        <div className="w-full flex md:hidden">
          {displayContent === "Blog" ? (
            <div className="w-full h-full">
              <RenderSearchBlog
                query={query}
                loadingLatest={loadingLatest}
                latestBlogs={latestBlogs}
                searchBlog={searchBlog}
              />
            </div>
          ) : (
            <div className="w-full h-full">
              <UserCardWrapper />
            </div>
          )}
        </div>

        <div className="w-full hidden md:flex">
          <div className="md:w-3/5 lg:w-4/6">
            <RenderSearchBlog
              query={query}
              loadingLatest={loadingLatest}
              latestBlogs={latestBlogs}
              searchBlog={searchBlog}
            />
          </div>
          <div className="md:w-2/5 lg:w-2/6">
            <UserCardWrapper />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
