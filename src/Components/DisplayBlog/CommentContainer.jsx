import React, { useEffect, useContext } from "react";
import { RxCross2 } from "react-icons/rx";
import { BlogContext } from "./BlogPost";
import CommentField from "./CommentField";
import axios from "axios";
import CommentCard from "./CommentCard";
import { useRecoilState } from "recoil";
import { DarkTheme } from "../Configuration/Atoms";

export const fetchComments = async ({
  skip = 0,
  blog_id,
  setParentCommentCountFun,
  comment_array = null,
}) => {
  let res;
  await axios
    .post(
      import.meta.env.VITE_SERVER_DOMAIN +
        "/api/comment_Like/get_blog_comments",
      { blog_id, skip }
    )
    .then(({ data }) => {
      data.map((comment) => {
        comment.childrenLevel = 0;
      });
      setParentCommentCountFun((prevVal) => prevVal + data.length);
      if (comment_array == null) {
        res = { results: data };
      } else {
        res = { results: [...comment_array, ...data] };
      }
    });
  console.log(res);

  return res;
};

function CommentContainer({ action }) {
  const {
    blog,
    blog: {
      _id,
      title,
      des,
      comments: { results: commentArr },
      activity: { total_parent_comments },
    },
    setBlog,
    SetDisplaycomment,
    displayComment,
    totalParentcommentsLoaded,
    setTotalParentcommentsLoaded,
  } = useContext(BlogContext);
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);

  const loadMore = async () => {
    let newCommentArr = await fetchComments({
      skip: totalParentcommentsLoaded,
      blog_id: _id,
      setParentCommentCountFun: setTotalParentcommentsLoaded,
      comment_array: commentArr,
    });
    setBlog({ ...blog, comments: newCommentArr });
  };

  const handleClose = () => {
    SetDisplaycomment(!displayComment);
  };

  return (
    <div
      className={`h-full w-full  rounded-lg shadow-lg overflow-hidden mt-4  ${
        isDarkTheme ? "bg-[#282828]" : "bg-white"
      }`}
    >
      <div className="w-full  p-4 flex items-center justify-between border-b border-gray-300">
        <div className="flex flex-col w-full">
          <span className="font-bold text-lg flex gap-2 items-center">
            <h1>Comments</h1>

            <div className="hover:cursor-pointer" onClick={handleClose}>
              <RxCross2 className="text-2xl text-gray-700 hover:text-red-600 transition duration-300"></RxCross2>
            </div>
          </span>
          <p className="text-sm h-fit w-full break-words ">{title}</p>
        </div>
      </div>
      <CommentField action={action} />
      <div className="w-full h-[60vh] flex flex-col gap-2 overflow-y-auto p-4">
        {commentArr && commentArr.length ? (
          commentArr.map((comment, i) => (
            <CommentCard key={i} index={i} commentData={comment} />
          ))
        ) : (
          <h1 className="text-center text-gray-500">No Comments!</h1>
        )}
        {total_parent_comments > totalParentcommentsLoaded && (
          <div className="flex justify-center mt-4">
            <button
              className="p-2 bg-black rounded-lg text-white text-md hover:bg-gray-800 transition duration-300"
              onClick={loadMore}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentContainer;
