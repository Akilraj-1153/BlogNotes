import React, { useState, useEffect } from "react";
import defaultBanner from "../../assets/Images/BlogNotes Banner.png";
import { useRecoilState } from "recoil";
import {
  blogStructure,
  CurrentEditorPage,
  DarkTheme,
  texteditor,
  UserAuthDetails,
} from "../Configuration/Atoms";
import Editor from "./Editor";
import { storage } from "../Configuration/FirebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getButtonClass } from "../Common/MiniComponent";
import { handleEditorSave } from "./Editor";
import axios from "axios";

const BlogEditor = () => {
  const [blog, setBlog] = useRecoilState(blogStructure);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [Editorpage, SetEditor] = useRecoilState(CurrentEditorPage);
  const [isDarkTheme] = useRecoilState(DarkTheme);
  const [isEditorReady] = useRecoilState(texteditor);
  const [userAuth] = useRecoilState(UserAuthDetails);
  let { blog_id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    SetEditor("Editor");
  }, [SetEditor, blog_id]);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadImage(file);
  };

  const uploadImage = (file) => {
    const uniqueFileName = `${nanoid()}-${file.name}`;
    const storageRef = ref(storage, `banners/${uniqueFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    const loadingToastId = toast.loading("Uploading banner image...");

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload the banner image. Please try again.", {
          id: loadingToastId,
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadProgress(0);
          setBlog((prev) => ({ ...prev, banner: downloadURL }));
          setIsUploadComplete(true);
          toast.success("Banner image uploaded successfully!", {
            id: loadingToastId,
          });
        });
      }
    );
  };

  const handleTitleChange = (e) => {
    const input = e.target;
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
    setBlog((prev) => ({ ...prev, title: input.value }));
  };

  const handlePublishEvent = async () => {
    if (!blog.banner && !isUploadComplete) {
      return toast.error("Please upload a banner image before publishing.");
    }
    if (!blog.title) {
      return toast.error("Please enter a blog title before publishing.");
    }

    if (isEditorReady) {
      try {
        const editorData = await handleEditorSave();
        if (editorData.blocks.length) {
          setBlog((prev) => ({ ...prev, content: editorData }));
          SetEditor("Publish");
        } else {
          toast.error("Please write something in your blog before publishing.");
        }
      } catch (error) {
        console.error("Error saving editor data:", error);
        toast.error("Failed to save editor data. Please try again.");
      }
    }
  };

  const handleSaveDraft = async (e) => {
    if (e.target.className.includes("disable")) return;

    if (!blog.title) {
      return toast.error("Please provide a title before saving the draft.");
    }

    const loadingToast = toast.loading("Saving draft...");
    e.target.classList.add("disable");

    try {
      let updatedContent = blog.content;

      if (isEditorReady) {
        const editorData = await handleEditorSave();
        if (editorData.blocks.length) {
          updatedContent = editorData;
        } else {
          toast.error("Editor content is empty.");
          e.target.classList.remove("disable");
          toast.dismiss(loadingToast);
          return;
        }
      }

      const blogObj = {
        title: blog.title,
        banner: blog.banner,
        des: blog.des,
        content: updatedContent,
        tags: blog.tags,
        draft: true,
      };

      await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/blog/create_blog`,
        { ...blogObj, id: blog.blog_id },
        {
          headers: {
            Authorization: `Bearer ${userAuth.access_token}`,
          },
        }
      );

      setTimeout(() => {
        toast.dismiss(loadingToast);
      }, 500);

      setTimeout(() => {
        toast.success("Draft saved successfully!");
      }, 600);

      setBlog({
        title: "",
        banner: "",
        content: [],
        tags: [],
        des: "",
        author: { personal_info: {} },
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      e.target.classList.remove("disable");
      toast.dismiss(loadingToast);
      toast.error(
        error.response?.data?.error ||
          "An error occurred while saving the draft."
      );
      console.error(error);
    }
  };

  return (
    <div className="h-fit w-full p-2">
      <div
        className={`blogeditor overflow-y-auto flex justify-center p-2 rounded-xl`}
      >
        <div
          className={`h-fit w-full md:max-w-3xl rounded-xl shadow-xl ${
            isDarkTheme ? "bg-[#282828]" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-2 p-2 justify-between w-full ">
            <button
              onClick={handlePublishEvent}
              className={`px-4 py-2 w-fit rounded-full transition-colors duration-300 cursor-pointer ${getButtonClass(
                isDarkTheme
              )}`}
            >
              Publish
            </button>
            <button
              onClick={handleSaveDraft}
              className={`px-4 py-2 w-fit rounded-full transition-colors duration-300 cursor-pointer ${getButtonClass(
                isDarkTheme
              )}`}
            >
              Save Draft
            </button>
          </div>
          <div className="p-2 Banner aspect-video">
            <label htmlFor="uploadbanner">
              <img
                className="w-full h-auto aspect-video object-cover rounded-lg"
                src={blog.banner || defaultBanner}
                alt="Banner"
              />
              <input
                id="uploadbanner"
                type="file"
                accept=".png, .jpg, .jpeg"
                hidden
                onChange={handleBannerChange}
              />
            </label>
          </div>
          <div className="titletextArea mt-5 p-2">
            <textarea
              value={blog.title}
              onChange={handleTitleChange}
              className="w-full resize-none h-fit outline-none rounded-lg px-2 text-3xl leading-tight bg-transparent"
              placeholder="Blog Title"
            />
          </div>
          <div className="w-full p-2 rounded-lg">
            <div id="editorjs" className="p-2 w-full selection:bg-purple-500">
              <Editor />
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default BlogEditor;
