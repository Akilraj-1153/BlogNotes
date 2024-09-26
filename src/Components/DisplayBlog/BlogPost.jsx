import axios from "axios";
import React, { useEffect, useState, createContext } from "react";
import { useParams } from "react-router-dom";
import { NavHeight } from "../Configuration/Atoms";
import { useRecoilState } from "recoil";
import CommentContainer, { fetchComments } from "./CommentContainer";
import BlogContentDisplay from "./BlogContentDisplay";
import FetchingLoader from "../Common/FetchingLoader";

let BlogStructure = {
  title: "",
  content: "",
  tags: "",
  banner: "",
  author: { personal_info: {} },
  publishedAt: "",
};

export const BlogContext = createContext();

function BlogPost() {
  let { blog_id } = useParams();
  let [loading, setLoading] = useState(true);
  let [blog, setBlog] = useState(BlogStructure);
  let [similarBlog, setSimilarBlog] = useState(null);
  const [isLikedByUser, setisLikedByUser] = useState(false);
  const [navbarHeight, setNavbarHeight] = useRecoilState(NavHeight);
  const [displayComment, SetDisplaycomment] = useState(false);
  const [totalParentcommentsLoaded, setTotalParentcommentsLoaded] = useState(0);

  let {
    title,
    content,
    tags,
    banner,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    publishedAt,
  } = blog;

  const fetchBlog = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/api/blog/get_blog", {
        blog_id,
      })
      .then(async ({ data: { blog } }) => {
        blog.comments = await fetchComments({
          blog_id: blog._id,
          setParentCommentCountFun: setTotalParentcommentsLoaded,
        });
        console.log(blog);
        setBlog(blog);

        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/api/blog/search_blogs", {
            tag: blog.tags[0],
            limit: 6,
            eliminate_blog: blog_id,
          })
          .then(({ data }) => {
            setSimilarBlog(data.blog);
          })
          .catch((err) => {
            console.log(err);
          });

        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    resetState();
    fetchBlog();
  }, [blog_id]);

  const resetState = () => {
    setBlog(BlogStructure);
    setSimilarBlog(null);
    setLoading(true);
    setisLikedByUser(false);
    SetDisplaycomment(false);
    setTotalParentcommentsLoaded(0);
    window.scrollTo(top, 0);
  };

  return (
    <div
      className="w-full p-2 "
      style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}
    >
      {loading ? (
        <FetchingLoader des={"Fetching Blog data..."} />
      ) : (
        <BlogContext.Provider
          value={{
            blog,
            setBlog,
            isLikedByUser,
            setisLikedByUser,
            displayComment,
            SetDisplaycomment,
            totalParentcommentsLoaded,
            setTotalParentcommentsLoaded,
          }}
        >
          <div className="mobile sm:hidden ">
            {!displayComment ? (
              <BlogContentDisplay
                banner={banner}
                title={title}
                username={username}
                fullname={fullname}
                profile_img={profile_img}
                publishedAt={publishedAt}
                content={content}
                similarBlog={similarBlog}
              />
            ) : (
              <div className="w-full">
                <CommentContainer title={title} action="Comment" />
              </div>
            )}
          </div>

          <div className="largerscreen hidden h-full w-full sm:flex items-start justify-center">
            <div
              className={`flex items-start justify-center ${
                !displayComment ? "w-full" : "w-1/2"
              }`}
            >
              <BlogContentDisplay
                banner={banner}
                title={title}
                username={username}
                fullname={fullname}
                profile_img={profile_img}
                publishedAt={publishedAt}
                content={content}
                similarBlog={similarBlog}
              />
            </div>

            {displayComment && (
              <div className="h-fit w-1/2 md:w-2/4 lg:w-1/4 ">
                <div className="w-full ">
                  <CommentContainer title={title} action="Comment" />
                </div>
              </div>
            )}
          </div>
        </BlogContext.Provider>
      )}
    </div>
  );
}

export default BlogPost;
