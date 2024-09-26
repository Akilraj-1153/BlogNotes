import React from "react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { UserAuthDetails } from "../Configuration/Atoms";
import { Toaster, toast } from "react-hot-toast";
import { useContext } from "react";
import { BlogContext } from "./BlogPost";
import axios from "axios";
import { fetchComments } from "./CommentContainer";
import { getButtonClass } from "../Common/MiniComponent";
import { DarkTheme } from "../Configuration/Atoms";

function CommentField({
  action,
  index = undefined,
  replying_to = undefined,
  setReplying,
}) {
  const [comment, setComment] = useState("");
  const [userAuth, setUserAuth] = useRecoilState(UserAuthDetails);
  let {
    blog,
    blog: {
      _id,
      author: { _id: blog_author },
      comments,
      comments: { results: commentArr },
      activity,
      activity: { total_comments, total_parent_comments },
    },
    setBlog,
    setTotalParentcommentsLoaded,
    totalParentcommentsLoaded,
  } = useContext(BlogContext);
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);

  const handleComment = () => {
    if (!userAuth.access_token) {
      return toast.error("Please Login to leave the comment");
    }
    if (!comment.length) {
      return toast.error("Write Some comment befor submitting");
    }

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/comment_Like/add_comment",
        { _id, blog_author, comment, replying_to: replying_to },
        {
          headers: {
            Authorization: `Bearer ${userAuth.access_token}`,
          },
        }
      )
      .then(({ data }) => {
        setComment("");
        data.commented_by = {
          personal_info: {
            username: userAuth.username,
            fullname: userAuth.fullname,
            profile_img: userAuth.profile_img,
          },
        };

        let newcommentArr;

        if (replying_to) {
          commentArr[index].children.push(data._id);
          data.childrenLevel = commentArr[index].childrenLevel + 1;
          data.parentIndex = index;
          commentArr[index].isReplyLoaded = true;
          commentArr.splice(index + 1, 0, data);
          newcommentArr = commentArr;

          setReplying(false);
        } else {
          data.childrenLevel = 0;
          newcommentArr = [data, ...commentArr];
        }

        let parentcommentIncValue = replying_to ? 0 : 1;

        setBlog({
          ...blog,
          comments: { ...comments, results: newcommentArr },
          activity: {
            ...activity,
            total_comments: total_comments + 1,
            total_parent_comments:
              total_parent_comments + parentcommentIncValue,
          },
        });

        setTotalParentcommentsLoaded(
          (preVal) => preVal + parentcommentIncValue
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-full p-2  ">
      <textarea
        autoFocus
        className="w-full min-h-24 rounded bg-transparent border p-1 resize-none outline-none "
        value={comment}
        placeholder="Write a Comment"
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <div className="flex gap-2">
        <button
          className={` ${getButtonClass(isDarkTheme)}`}
          onClick={handleComment}
        >
          {action}
        </button>
      </div>
      <Toaster></Toaster>
    </div>
  );
}

export default CommentField;
