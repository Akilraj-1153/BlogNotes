import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import NavBar from "./Components/NavBar/NavBar";
import { DarkTheme, UserAuthDetails, NavHeight } from "./Components/Configuration/Atoms";
import { useNetworkState } from "react-use";
import PageNotFound from "./Components/Common/PageNotFound.jsx";
import OfflinePage from "./Components/Common/OfflinePage.jsx";
import FetchingLoader from "./Components/Common/FetchingLoader.jsx";
import UserAuth from "./Components/Auth/UserAuth.jsx";
import EditorPage from "./Components/Editor/EditorPage.jsx";
import ProfilePage from "./Components/Profile/ProfilePage.jsx";
import ChangePassword from "./Components/Settings/ChangePassword.jsx";
import SettingsHome from "./Components/Settings/SettingsHome.jsx";
import EditProfile from "./Components/Settings/EditProfile.jsx";
import BlogManagement from "./Components/Settings/BlogManagement.jsx";
import Notifications from "./Components/Settings/Notifications.jsx";
import Home from "./Components/Home/Home.jsx";
import CategoryPage from "./Components/CategoryPages/CategoryPage.jsx";
import BlogPost from "./Components/DisplayBlog/BlogPost.jsx";
import CategoryHome from "./Components/CategoryPages/CategoryHome.jsx";
import Footer from "./Components/Common/Footer.jsx";
import Contact from "./Components/Common/Contact.jsx";
import About from "./Components/Common/About.jsx";
import SearchPage from "./Components/SearchPage/SearchPage.jsx";

function App() {
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);
  const [userAuth, setUserAuth] = useRecoilState(UserAuthDetails);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [navbarHeight, setNavbarHeight] = useRecoilState(NavHeight);
  const networkState = useNetworkState();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserAuth(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, [setUserAuth]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("darkTheme");
    if (storedTheme) {
      setIsDarkTheme(JSON.parse(storedTheme));
    }
  }, [setIsDarkTheme]);

  useEffect(() => {
    document.body.style.backgroundColor = isDarkTheme ? "#121212" : "#f9fafb";
  }, [isDarkTheme]);

  if (isLoading) {
    return <FetchingLoader des={"Intializing BlogNotes"} />;
  }

  return (
    <>
      {networkState.online ? (
        <div className={`${isDarkTheme ? "text-white" : "text-black"} transition-all duration-100 font-mate w-screen`}>
          <div className={`sticky top-0 z-40 ${isDarkTheme ? "bg-[#121212]" : "bg-[#f9fafb]"}`}>
            <NavBar onHeightChange={setNavbarHeight} />
          </div>
          <div style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="category" element={<CategoryHome />}>
                <Route path="selectedcategory/:categoryfromsearchbar" element={<CategoryPage />} />
              </Route>
              <Route path="/login" element={<UserAuth type="signin" />} />
              <Route path="/register" element={<UserAuth type="signup" />} />
              <Route path="/editor/:blog_id" element={<EditorPage />} />
              <Route path="/search/:query" element={<SearchPage />} />
              <Route path="/blog/:blog_id" element={<BlogPost />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/About" element={<About />} />
              <Route path="/user/:id" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsHome />}>
                <Route path="Edit-Profile" element={<EditProfile />} />
                <Route path="Change-Password" element={<ChangePassword />} />
              </Route>
              <Route path="dashboard" element={<SettingsHome />}>
                <Route path="blog" element={<BlogManagement />} />
                <Route path="notifications" element={<Notifications />} />
              </Route>
              <Route
                path="*"
                element={
                  <PageNotFound
                    des="The page you're looking for doesn't exist. Please check the URL or return to the homepage."
                    error="404 Page Not Found"
                    errorType="PageNotFound"
                  />
                }
              />
            </Routes>
            <Footer />
          </div>
        </div>
      ) : (
        <OfflinePage />
      )}
    </>
  );
}

export default App;
