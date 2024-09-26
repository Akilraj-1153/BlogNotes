import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  blogStructure,
  UserAuthDetails,
  CurrentEditorPage,
  DarkTheme,
} from "../Configuration/Atoms";
import defaultBanner from "../../assets/Images/BlogNotes Banner.png";
import Tags from "./Tags";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { BsArrowReturnLeft } from "react-icons/bs";
import { getButtonClass } from "../Common/MiniComponent";

function PublishForm() {
  const [Editorpage, SetEditor] = useRecoilState(CurrentEditorPage);
  const [blog, setBlog] = useRecoilState(blogStructure);
  const [charCount, setCharCount] = useState(blog.des.length);
  const [userAuth] = useRecoilState(UserAuthDetails);
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);

  useEffect(() => {
    SetEditor("Publish");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [SetEditor]);

  const navigate = useNavigate();
  let { blog_id } = useParams();

  const buttonClass = isDarkTheme
    ? "bg-gray-400 text-black hover:bg-white"
    : "bg-gray-400 hover:bg-black hover:text-white";

  const handleTitleChange = (e) => {
    setBlog((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleDescriptionChange = (e) => {
    setBlog((prev) => ({ ...prev, des: e.target.value }));
    setCharCount(e.target.value.length);
  };

  const handleTopicKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (blog.tags.length < 10 && newTag) {
        setBlog((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
        e.target.value = "";
      } else if (blog.tags.length >= 10) {
        toast.error("Reached max tag limit of 10");
      }
    }
  };

  const handlePublishBlog = async (e) => {
    if (!blog.title.length) {
      return toast.error("Please provide a title");
    }
    if (!blog.des.length || blog.des.length > 500) {
      return toast.error("Please provide a description under 200 characters");
    }
    if (!blog.tags.length) {
      return toast.error("Please provide tags");
    }

    const loadingToast = toast.loading("Publishing...");
    e.target.disabled = true;

    const blogObj = {
      title: blog.title,
      banner: blog.banner,
      des: blog.des,
      content: blog.content,
      tags: blog.tags,
      draft: false,
    };

    if (blog_id === "create-new-blog") {
      blog_id = undefined;
    }

    await axios
      .post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/blog/create_blog`,
        { ...blogObj, id: blog_id },
        {
          headers: { Authorization: `Bearer ${userAuth.access_token}` },
        }
      )
      .then(() => {
        e.target.disabled = false;
        setTimeout(() => {
          toast.dismiss(loadingToast);
        }, 500);
        setTimeout(() => {
          toast.success("Blog Published");
        }, 600);
        setTimeout(() => {
          setBlog({
            title: "",
            banner: "",
            content: [],
            tags: [],
            des: "",
            author: { personal_info: {} },
          });
          navigate("/");
          SetEditor("Editor");
        }, 1000);
      })
      .catch(({ response }) => {
        e.target.disabled = false;
        toast.dismiss(loadingToast);
        toast.error(response.data.error);
      });
  };

  return (
    <div
      className={`flex items-center justify-center py-10 px-2 sm:px-6 lg:px-8`}
    >
      <div
        className={`max-w-3xl w-full shadow-lg rounded-lg p-8 space-y-6 ${
          isDarkTheme ? "bg-[#282828]" : "bg-white"
        }`}
      >
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="md:w-1/2 space-y-4">
            <div className="w-full aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={blog.banner || defaultBanner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              value={blog.title}
              onChange={handleTitleChange}
              className="w-full p-4 text-lg font-bold bg-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-hidden text-ellipsis"
              placeholder="Enter your blog title"
            />
            <textarea
              value={blog.des}
              maxLength={250}
              onChange={handleDescriptionChange}
              className="w-full p-4 text-base border bg-transparent rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write a brief description (max 250 characters)"
            />
            <div className="text-right">
              {250 - charCount} characters remaining
            </div>
          </div>
          <div className="md:w-1/2 space-y-4">
            <input
              className="w-full p-4 text-base border bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter tags and press Enter"
              onKeyDown={handleTopicKeyDown}
            />
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <Tags key={index} tag={tag} tagKey={index} />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handlePublishBlog}
                className={`px-4 py-2 w-fit rounded-full transition-colors duration-300 cursor-pointer ${getButtonClass(
                  isDarkTheme
                )}`}
              >
                Publish Blog
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => SetEditor("Editor")}
                  className={`flex px-4 py-2 w-fit rounded-full transition-colors duration-300 cursor-pointer ${getButtonClass(
                    isDarkTheme
                  )}`}
                >
                  Return
                  <BsArrowReturnLeft className="ml-2" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default PublishForm;
