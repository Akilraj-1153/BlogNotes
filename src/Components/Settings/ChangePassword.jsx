import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PiPasswordBold } from "react-icons/pi";
import { TbEyeClosed, TbEye } from "react-icons/tb";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useRecoilState } from "recoil";
import {
  UserAuthDetails,
  DarkTheme,
  UserProfile,
} from "../Configuration/Atoms";
import { getButtonClass } from "../Common/MiniComponent";

function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  const [userAuth, setUserAuth] = useRecoilState(UserAuthDetails);
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);
  const [profile, setProfile] = useRecoilState(UserProfile);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onSubmit = (formData, e) => {
    const { currentPassword, newPassword } = formData;

    if (!currentPassword.length || !newPassword.length) {
      return toast.error("Fill the password fields");
    }

    if (
      !passwordRegex.test(currentPassword) ||
      !passwordRegex.test(newPassword)
    ) {
      return toast.error(
        "Password must be 6 to 20 characters long, and include at least one numeric digit, one uppercase letter, and one lowercase letter."
      );
    }

    e.target.setAttribute("disabled", true);
    const loadingToast = toast.loading("Updating Password....");

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/auth/change_password",
        formData,
        {
          headers: {
            Authorization: `Bearer ${userAuth.access_token}`,
          },
        }
      )
      .then(() => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        reset();
        toast.success("Password Changed");
      })
      .catch(({ response }) => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        reset();
        toast.error(response.data.error || "An error occurred");
      });
  };

  return (
    <div className={` w-full h-fit px-2 items-center justify-center `}>
      <div className="mb-4 hidden sm:flex">
        <h1 className="text-2xl font-semibold">Change Password</h1>
      </div>
      <div
        className={`mt-10 py-10 rounded-lg w-full flex flex-col shadow-lg flex items-center justify-center ${
          isDarkTheme ? "bg-[#282828]" : "bg-white"
        }`}
      >
        <form
          className={`flex flex-col gap-4 max-w-xs ${
            profile.github_auth ? "disabled" : ""
          }`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex items-center justify-between px-4 rounded-full border border-gray-300 shadow-sm">
            <div className="w-full flex items-center">
              <PiPasswordBold size={25} className="text-gray-500" />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Current Password"
                className={`p-2 w-full outline-none bg-transparent ${
                  isDarkTheme ? "bg-black text-white" : "bg-white text-black"
                }`}
                {...register("currentPassword", {
                  required: "Current password is required",
                })}
                disabled={profile.github_auth}
              />
              <div
                className="inset-y-0 right-0 flex items-center p-2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <TbEyeClosed size={20} className="text-gray-500" />
                ) : (
                  <TbEye size={20} className="text-gray-500" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 rounded-full border border-gray-300 shadow-sm">
            <div className="w-full flex items-center">
              <PiPasswordBold size={25} className="text-gray-500" />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="New Password"
                className={`p-2 w-full rounded-lg outline-none bg-transparent ${
                  isDarkTheme ? "bg-black text-white" : "bg-white text-black"
                }`}
                {...register("newPassword", {
                  required: "New password is required",
                })}
                disabled={profile.github_auth}
              />
              <div
                className="inset-y-0 right-0 flex items-center p-2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <TbEyeClosed size={20} className="text-gray-500" />
                ) : (
                  <TbEye size={20} className="text-gray-500" />
                )}
              </div>
            </div>
          </div>

          <input
            type="submit"
            className={`${getButtonClass(
              isDarkTheme
            )} !py-2 !px-6 w-fit mx-auto cursor-pointer`}
            disabled={profile.github_auth}
          />
        </form>

        {profile && profile.github_auth ? (
          <p className="text-2xl text-red-500 mt-2">Sorry, you cannot change the password since you are using your GitHub account.</p>
        ) : null}
      </div>
      <Toaster />
    </div>
  );
}

export default ChangePassword;
