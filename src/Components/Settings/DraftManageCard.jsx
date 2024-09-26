import React from "react";
import { getDay } from "../Common/Date";
import { Link } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import { UserAuthDetails } from "../Configuration/Atoms";
import { getButtonClass } from "../Common/MiniComponent";
import { DarkTheme } from "../Configuration/Atoms";

function DraftManageCard({ draft, value, DraftData, index }) {
  const { publishedAt, title, blog_id: id } = draft;

  const [userAuth, setUserAuth] = useRecoilState(UserAuthDetails);
  const [isDarkTheme] = useRecoilState(DarkTheme);

  const handleBlogDelete = (e, index, DraftData) => {
    let { draftBlog, setDraftBlog } = DraftData;
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
        setDraftBlog((preVal) => {
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
    <div>
      <div className={` ${isDarkTheme ? "bg-[#282828]" : "bg-white"}  p-2 rounded-lg gap-2 flex flex-col min-h-44  justify-between   `}>
        <div className="w-full h-full">
          <div className=" flex items-center gap-2 bg-red-90">
            <h1 className=" font-bold text-3xl ">
              {value + 1 < 10 ? "0" + (value + 1) : value + 1}
            </h1>
            <p className="border-l-2 pl-2">{getDay(publishedAt)}</p>
          </div>
          <div>
            <p className="w-full break-words line-clamp-3">{title}</p>
          </div>
        </div>

        <div className=" flex gap-2 justify-between">
          <Link to={`/editor/${id}`} className={`${getButtonClass(isDarkTheme)}`}>
            Edit
          </Link>
          <button onClick={(e) => handleBlogDelete(e, index, DraftData)} className={`${getButtonClass(isDarkTheme)}`}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DraftManageCard;
