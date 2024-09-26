import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsPersonFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { PiPasswordBold } from "react-icons/pi";
import { TbEyeClosed, TbEye } from "react-icons/tb";
import { FaGithub } from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInLocal, getLocal } from "../Configuration/Session";
import { useRecoilState } from "recoil";
import { UserAuthDetails, DarkTheme, NavHeight } from "../Configuration/Atoms";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Configuration/FirebaseConfig";
import Black_logo from "../../assets/Logo/Logo-Black.png";
import White_logo from "../../assets/Logo/Logo-White.png";
import { getButtonClass } from "../Common/MiniComponent";

function UserAuth({ type }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userAuth, setUserAuth] = useRecoilState(UserAuthDetails);
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);
  const [navbarHeight, setNavbarHeight] = useRecoilState(NavHeight);

  useEffect(() => {
    const storedUser = getLocal("user");
    if (storedUser) {
      setUserAuth(JSON.parse(storedUser));
    }
  }, [setUserAuth]);

  useEffect(() => {
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [type, reset]);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(`${import.meta.env.VITE_SERVER_DOMAIN}/api/auth${serverRoute}`, formData)
      .then(({ data }) => {
        storeInLocal("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const provider = new GithubAuthProvider();

  const GitHubAuth = async () => {
    let user = null;
    try {
      const result = await signInWithPopup(auth, provider);
      user = result.user;
    } catch (err) {
      console.error("Error during GitHub authentication:", err);
    }
    return user;
  };

  const handleGitHubAuth = (e) => {
    e.preventDefault();
    GitHubAuth()
      .then((user) => {
        const serverRoute = "/github_auth";
        const formData = { access_token: user.accessToken };
        userAuthThroughServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error("Trouble Using GitHub");
        console.error(err);
      });
  };

  const onSubmit = (formData) => {
    const { fullname, email, password } = formData;
    const serverRoute = type === "signin" ? "/signin" : "/signup";

    if (type === "signup" && fullname && fullname.length < 3) {
      return toast.error("Full name must be at least 3 characters long.");
    }

    if (!email) {
      return toast.error("Email is required.");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Invalid email format. Please provide a valid email address.");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must be 6 to 20 characters long, and include at least one numeric digit, one uppercase letter, and one lowercase letter."
      );
    }

    userAuthThroughServer(serverRoute, formData);
    reset();
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  const renderEmailAndPasswordFields = () => (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center px-4 rounded-lg border border-gray-300 shadow-sm">
          <MdEmail size={25} className="text-gray-600" />
          <input
            type="email"
            placeholder="Email"
            className="p-2 w-full rounded-lg outline-none bg-transparent"
            {...register("email")}
          />
        </div>

        <div className="flex items-center justify-between px-4 rounded-lg border border-gray-300 shadow-sm">
          <PiPasswordBold size={25} className="text-gray-600" />
          <div className="w-full">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="p-2 w-full rounded-lg outline-none bg-transparent"
              {...register("password")}
            />
          </div>
          <div className="flex items-center p-2 cursor-pointer" onClick={togglePasswordVisibility}>
            {!passwordVisible ? <TbEyeClosed size={20} className="text-gray-600" /> : <TbEye size={20} className="text-gray-600" />}
          </div>
        </div>
      </div>
    </>
  );

  return userAuth.access_token ? (
    <Navigate to="/" />
  ) : (
    <div className="w-full p-5 flex flex-col justify-center h-fit items-center" style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}>
      <div className={`w-full max-w-sm p-8 rounded-lg shadow-lg ${isDarkTheme ? "bg-[#282828]" : "bg-white"}`}>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {type === "signin" ? "Welcome Back!" : "Join Us!"}
          </h1>
          <h2 className="text-lg">
            {type === "signin" ? "Log in to continue where you left off." : "Create an account to start exploring and join the community."}
          </h2>
        </div>

        <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit(onSubmit)}>
          {type === "signup" && (
            <div className="flex items-center px-4 w-full rounded-lg border border-gray-300 shadow-sm">
              <BsPersonFill size={25} className="text-gray-600" />
              <input
                placeholder="Full Name"
                className="p-2 w-full rounded-lg outline-none bg-transparent"
                {...register("fullname")}
              />
            </div>
          )}

          {renderEmailAndPasswordFields()}

          <input
            type="submit"
            className={`px-4 py-2 w-fit rounded-full cursor-pointer bg-gray-400 ${getButtonClass(isDarkTheme)}`}
            value={type === "signin" ? "Sign In" : "Sign Up"}
          />
        </form>

        <div className="text-center my-4">Or</div>
        <div className="flex justify-center">
          <button
            className={`flex gap-2 px-4 py-2 w-fit rounded-full cursor-pointer ${getButtonClass(isDarkTheme)}`}
            onClick={handleGitHubAuth}
          >
            <FaGithub size={24} />
            Use GitHub
          </button>
        </div>

        <div className="text-center mt-6">
          {type === "signin" ? (
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 underline" onClick={() => reset()}>
                Create New Account
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 underline" onClick={() => reset()}>
                Log In
              </Link>
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-col items-center gap-2">
          <img src={isDarkTheme ? White_logo : Black_logo} className="max-h-14 w-fit" alt="Logo" />
          <h1>"Explore, Learn, and Share"</h1>
        </div>
      </div>

      <Toaster position="top-center" />
    </div>
  );
}

export default UserAuth;
