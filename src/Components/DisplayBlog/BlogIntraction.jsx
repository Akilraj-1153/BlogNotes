import React, { useEffect, useContext } from "react";
import { BlogContext } from "./BlogPost";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { TfiComments } from "react-icons/tfi";
import { useRecoilState } from "recoil";
import { UserAuthDetails, DarkTheme } from "../Configuration/Atoms";
import { FiShare2 } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import axios from "axios";
import { getButtonClass } from "../Common/MiniComponent";

function BlogIntraction() {
  const {
    blog,
    blog: {
      _id,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    isLikedByUser,
    setisLikedByUser,
    SetDisplaycomment,
    displayComment,
  } = useContext(BlogContext);

  const [userAuth] = useRecoilState(UserAuthDetails);
  const [isDarkTheme] = useRecoilState(DarkTheme);

  const handleCopyLink = () => {
    const blogUrl = `${window.location.origin}/blog/${blog_id}`;
    navigator.clipboard
      .writeText(blogUrl)
      .then(() => {
        toast.success("Link Copied");
      })
      .catch((error) => {
        toast.error("Failed to copy link");
        console.error("Copy failed", error);
      });
  };

  const handleLike = () => {
    if (userAuth.access_token) {
      setisLikedByUser((prevVal) => !prevVal);
      const updatedLikes = isLikedByUser ? total_likes - 1 : total_likes + 1;
      setBlog({
        ...blog,
        activity: { ...activity, total_likes: updatedLikes },
      });

      axios
        .post(
          `${import.meta.env.VITE_SERVER_DOMAIN}/api/comment_Like/like_blog`,
          { _id, isLikedByUser },
          {
            headers: {
              Authorization: `Bearer ${userAuth.access_token}`,
            },
          }
        )
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("Please log in to like this post");
    }
  };

  const handleComments = () => {
    SetDisplaycomment(!displayComment);
  };

  useEffect(() => {
    axios
      .post(
        `${
          import.meta.env.VITE_SERVER_DOMAIN
        }/api/comment_Like/isLiked_by_user`,
        { _id },
        {
          headers: {
            Authorization: `Bearer ${userAuth.access_token}`,
          },
        }
      )
      .then(({ data: { result } }) => {
        setisLikedByUser(Boolean(result));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="w-full flex justify-between gap-2">
      <div className="flex gap-2">
        <div
          className="flex items-center gap-2 hover:cursor-pointer p-2"
          onClick={handleLike}
        >
          <div
            className={`flex items-center gap-2 hover:cursor-pointer p-2 rounded-full ${
              isLikedByUser ? "bg-red-500/50" : ""
            }`}
          >
            {isLikedByUser ? (
              <GoHeartFill className="text-xl text-red-500" />
            ) : (
              <GoHeart className="text-xl" />
            )}
          </div>
          <p>{total_likes}</p>
        </div>
        <div
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={handleComments}
        >
          <FaRegCommentDots className="text-xl" />
          <p>{total_comments}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {userAuth.username === author_username && (
          <Link
            to={`/editor/${blog_id}`}
            className={`${getButtonClass(isDarkTheme)} !px-4`}
          >
            Edit
          </Link>
        )}
        <div
          className="relative group hover:cursor-pointer"
          onClick={handleCopyLink}
        >
          <FiShare2 className="text-xl" />
          <h1 className="absolute hidden group-hover:block left-10 -top-2 bg-black/50 p-2 rounded-lg w-fit whitespace-nowrap">
            Copy Link
          </h1>
        </div>
      </div>
      <Toaster position="bottom" />
    </div>
  );
}

export default BlogIntraction;
