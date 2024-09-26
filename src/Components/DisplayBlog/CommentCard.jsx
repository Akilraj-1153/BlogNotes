import React, { useContext, useState } from "react";
import { getDay } from "../Common/Date";
import { useRecoilState } from "recoil";
import { UserAuthDetails } from "../Configuration/Atoms";
import toast from "react-hot-toast";
import CommentField from "./CommentField";
import { BlogContext } from "./BlogPost";
import axios from "axios";
import { MdOutlineDeleteForever } from "react-icons/md";
import { DarkTheme } from "../Configuration/Atoms";
import { getButtonClass } from "../Common/MiniComponent";

function CommentCard({ index, commentData }) {
  const [userAuth, setUserAuth] = useRecoilState(UserAuthDetails);
  const {
    blog,
    blog: {
      comments,
      comments: { results: commentArr },
    },
    setBlog,
    setTotalParentcommentsLoaded,
  } = useContext(BlogContext);
  const [isReplying, setIsReplying] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);

  const {
    commented_by: {
      personal_info: { username: commented_by_username, profile_img },
    },
    commentedAt,
    comment,
    _id,
    children,
  } = commentData;

  const handleReply = () => {
    if (!userAuth.access_token) {
      return toast.error("Login before replying to a comment");
    }
    setIsReplying((prev) => !prev);
  };

  const getParentIndex = () => {
    let startingPoint = index - 1;
    try {
      while (
        commentArr[startingPoint].childrenLevel >= commentData.childrenLevel
      ) {
        startingPoint--;
      }
    } catch {
      startingPoint = undefined;
    }
    return startingPoint;
  };

  const removeCommentCard = (startingPoint, isDelete = false) => {
    if (commentArr[startingPoint]) {
      while (
        commentArr[startingPoint].childrenLevel > commentData.childrenLevel
      ) {
        commentArr.splice(startingPoint, 1);
        if (!commentArr[startingPoint]) {
          break;
        }
      }
    }

    if (isDelete) {
      let parentIndex = getParentIndex();
      if (parentIndex !== undefined) {
        commentArr[parentIndex].children = commentArr[
          parentIndex
        ].children.filter((child) => child !== _id);
        if (!commentArr[parentIndex].children.length) {
          commentArr[parentIndex].isReplyLoaded = false;
        }
      }
      commentArr.splice(index, 1);
    }

    if (commentData.childrenLevel === 0 && isDelete) {
      setTotalParentcommentsLoaded((prev) => prev - 1);
    }

    setBlog({
      ...blog,
      comments: { results: commentArr },
      activity: {
        ...blog.activity,
        total_parent_comments:
          blog.activity.total_parent_comments -
          (commentData.childrenLevel === 0 && isDelete ? 1 : 0),
      },
    });
  };

  const hideReplies = () => {
    commentData.isReplyLoaded = false;
    removeCommentCard(index + 1);
  };

  const loadReplies = ({ skip = 0, currentIndex = index }) => {
    if (commentArr[currentIndex].children.length) {
      hideReplies();

      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/api/comment_Like/get_replies",
          { _id: commentArr[currentIndex]._id, skip }
        )
        .then(({ data: { replies } }) => {
          console.log(replies);
          commentArr[currentIndex].isReplyLoaded = true;

          for (let i = 0; i < replies.length; i++) {
            replies[i].childrenLevel =
              commentArr[currentIndex].childrenLevel + 1;
            commentArr.splice(currentIndex + 1 + i + skip, 0, replies[i]);
          }

          setBlog({ ...blog, comments: { ...comments, results: commentArr } });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("no data");
    }
  };

  const handleDeleteComments = (e) => {
    e.target.setAttribute("disabled", true);
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/comment_Like/delete_comment",
        { _id },
        {
          headers: {
            Authorization: `Bearer ${userAuth.access_token}`,
          },
        }
      )
      .then(() => {
        console.log("deleted");
        e.target.removeAttribute("disabled");
        removeCommentCard(index + 1, true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const LoadMoreReplies = () => {
    let parentIndex = getParentIndex();
    let button = (
      <button
        className={`${getButtonClass(isDarkTheme)}`}
        onClick={() =>
          loadReplies({ skip: index - parentIndex, currentIndex: parentIndex })
        }
      >
        Load More Replies
      </button>
    );

    if (commentArr[index + 1]) {
      if (
        commentArr[index + 1].childrenLevel < commentArr[index].childrenLevel
      ) {
        if (index - parentIndex < commentArr[parentIndex].children.length) {
          return button;
        }
      }
    } else {
      if (parentIndex) {
        if (index - parentIndex < commentArr[parentIndex].children.length) {
          return button;
        }
      }
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 p-2  rounded-lg shadow-sm ${
        commentData.childrenLevel === 0
          ? isDarkTheme
            ? "bg-[#3f3f3f]"
            : "bg-white"
          : ""
      }`}
    >
      <div>
        <div className="flex gap-1 items-center justify-between">
          <div className="flex gap-1 items-center">
            <img
              src={profile_img}
              className="h-8 w-8 rounded-full"
              alt={`${commented_by_username}'s profile`}
            />
            <div className="flex flex-col w-[90%]">
              <h1 className="text-sm font-medium break-all">
                @{commented_by_username}
              </h1>
              <h1 className="text-xs ">{getDay(commentedAt)}</h1>
            </div>
          </div>
        </div>
        <div className="mt-1 break-all  text-md">{comment}</div>
        <div className="flex justify-between items-center">
          <div className="flex gap-1 mt-1">
            {commentData.isReplyLoaded ? (
              <button
                className={`${getButtonClass(isDarkTheme)}`}
                onClick={hideReplies}
              >
                Hide Reply
              </button>
            ) : children.length ? (
              <button
                className={`${getButtonClass(isDarkTheme)}`}
                onClick={loadReplies}
              >
                Load Reply
              </button>
            ) : null}

            <button
              className={`${getButtonClass(isDarkTheme)}`}
              onClick={handleReply}
            >
              Reply
            </button>
          </div>

          {(userAuth.username === commented_by_username ||
            userAuth.username === blog.author.personal_info.username) && (
            <button
              className={`${getButtonClass(isDarkTheme)}`}
              onClick={handleDeleteComments}
            >
              <MdOutlineDeleteForever className="text-lg"></MdOutlineDeleteForever>
            </button>
          )}
        </div>
        {isReplying && (
          <CommentField
            action="Reply"
            index={index}
            replying_to={_id}
            setReplying={setIsReplying}
          />
        )}
      </div>
      <LoadMoreReplies />
    </div>
  );
}

export default CommentCard;
