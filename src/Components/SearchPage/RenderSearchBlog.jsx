import React from "react";
import BlogPostCard from "../Common/BlogPostCard";
import PageNotFound from "../Common/PageNotFound";
import { getButtonClass } from "../Common/MiniComponent";
import { useRecoilState } from "recoil";
import { UserAuthDetails, DarkTheme } from "../Configuration/Atoms";
import FetchingLoader from "../Common/FetchingLoader";

const RenderSearchBlog = ({
  query,
  loadingLatest,
  latestBlogs,
  searchBlog,
}) => {
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);

  const handleNextPage = () => {
    if (latestBlogs && latestBlogs.totalDocs > latestBlogs.results.length) {
      const nextPage = latestBlogs.page + 1;
      searchBlog({ page: nextPage });
    }
  };

  const isLastPage =
    latestBlogs && latestBlogs.totalDocs > latestBlogs.results.length;

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4 capitalize w-full truncate">
        Search result for - {query}
      </h2>

      {loadingLatest ? (
        <FetchingLoader des={`Fetching blogs for ${query}`} />
      ) : latestBlogs?.results?.length === 0 ? (
        <PageNotFound
          des={`Currently, there are no blogs available for ${query}`}
          error={`No blogs found for ${query}`}
          errorType="BlogNotFound"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {latestBlogs.results.map((blog, i) => (
            <BlogPostCard key={i} blog={blog} />
          ))}
        </div>
      )}

      {!loadingLatest && latestBlogs && latestBlogs.results.length !== 0 && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handleNextPage}
            className={`${getButtonClass(
              isDarkTheme
            )} disabled:cursor-not-allowed`}
            disabled={!isLastPage}
          >
            {isLastPage ? "Load More" : "End Of Page"}
          </button>
        </div>
      )}
    </section>
  );
};

export default RenderSearchBlog;
