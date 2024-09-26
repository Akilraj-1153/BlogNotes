import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  UserAuthDetails,
  CurrentEditorPage,
  blogStructure,
  NavHeight,
} from "../Configuration/Atoms";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "./BlogEditor";
import PublishForm from "./PublishForm";
import FetchingLoader from "../Common/FetchingLoader";
import axios from "axios";

function EditorPage() {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useRecoilState(blogStructure);
  const { blog_id } = useParams();
  const [navbarHeight, setNavbarHeight] = useRecoilState(NavHeight);
  const [userAuth] = useRecoilState(UserAuthDetails);
  const [editorPage, setEditorPage] = useRecoilState(CurrentEditorPage);

  const fetchBlogById = () => {
    axios
      .post(`${import.meta.env.VITE_SERVER_DOMAIN}/api/blog/get_blog`, {
        blog_id: blog_id,
        draft: true,
        mode: "edit",
      })
      .then(({ data }) => {
        setTimeout(() => {
          setBlog(data.blog);
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        setBlog(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    if (blog_id === "create-new-blog") {
      setBlog({
        title: "",
        banner: "",
        content: [],
        tags: [],
        des: "",
        author: { personal_info: {} },
      });
      setLoading(false);
    } else {
      fetchBlogById();
    }
  }, [blog_id]);

  return (
    <div style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}>
      {!userAuth?.access_token ? (
        <Navigate to="/login" />
      ) : loading ? (
        <FetchingLoader des={"Fetching Blog data..."} />
      ) : editorPage === "Publish" ? (
        <PublishForm />
      ) : (
        <BlogEditor />
      )}
    </div>
  );
}

export default EditorPage;
