import React from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { UserAuthDetails, DarkTheme } from "../Configuration/Atoms";
import axios from "axios";
import { getButtonClass } from "../Common/MiniComponent";

function BlogManageCard({ blog, index, BlogData }) {
  const [userAuth, setUserAuth] = useRecoilState(UserAuthDetails);
  const [isDarkTheme] = useRecoilState(DarkTheme);

  const {
    title,
    banner,
    blog_id: id,
    activity: { total_likes, total_comments, total_reads },
  } = blog;

  const handleBlogDelete = (e, index, BlogData) => {
    let { blog, setBlog } = BlogData;
    e.target.setAttribute("disabled", true);

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/blog/delete_blog",
        { blog_id: id },
        {
          headers: {
            Authorization: `Bearer ${userAuth.access_token}`,
          },
        }
      )
      .then(({ data }) => {
        console.log(data);
        e.target.removeAttribute("disabled");
        setBlog((preVal) => {
          let { deletedDocCount, totalDocs, results } = preVal;
          results.splice(index, 1);

          if (!deletedDocCount) {
            deletedDocCount = 0;
          }

          if (!results.length && totalDocs - 1 > 0) {
            return null;
          }
          return {
            ...preVal,
            totalDocs: totalDocs - 1,
            deletedDocCount: deletedDocCount + 1,
          };
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className={` ${
        isDarkTheme ? "bg-[#282828]" : "bg-white"
      }   flex flex-col justify-between rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full md:max-w-sm mx-auto `}
    >
      <div className="w-full">
        <div className="relative rounded-lg">
          <img
            loading="lazy"
            src={banner}
            className="w-full h-36 object-cover rounded-t-lg"
            alt="Blog banner"
            width="640"
            height="360"
          />

          <div className="flex w-full items-center backdrop-blur-md bg-black/50 rounded-t-lg  absolute bottom-0 left-0 right-0 p-2 text-white">
            <h1 className="text-xl mb-2 line-clamp-3 w-full break-words ">
              {title}
            </h1>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 flex flex-col gap-2">
        <div className=" flex gap-2 justify-between">
          <Link
            to={`/editor/${id}`}
            className={`${getButtonClass(isDarkTheme)}`}
          >
            Edit
          </Link>
          <button
            onClick={(e) => handleBlogDelete(e, index, BlogData)}
            className={`${getButtonClass(isDarkTheme)}`}
          >
            Delete
          </button>
        </div>
        <div className="flex gap-3 items-center justify-between">
          <h1 className="flex  gap-2 items-cneter">
            <i className="fi fi-sr-heart mt-1"></i>
            <p>{total_likes}</p>
          </h1>
          <h1 className="flex  gap-2 items-cneter">
            <i className="fi fi-rr-comment"></i>
            <p>{total_comments}</p>
          </h1>
          <h1 className="flex  gap-2 items-cneter">
            <i className="fi fi-sr-book-alt"></i>
            <p>{total_reads}</p>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default BlogManageCard;
