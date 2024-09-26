import React, { useContext, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";
import { storage } from "../Configuration/FirebaseConfig";
import axios from "axios";
import { useRecoilState } from "recoil";
import {
  UserAuthDetails,
  UserProfile,
  DarkTheme,
} from "../Configuration/Atoms";
import { useForm } from "react-hook-form";
import { getButtonClass } from "../Common/MiniComponent";

function EditProfile() {
  const bioLimit = 500;
  const ProfileImageRef = useRef();
  const [profile, setProfile] = useRecoilState(UserProfile);
  const [isDarkTheme, setIsDarkTheme] = useRecoilState(DarkTheme);

  const [charCount, setCharCount] = useState(
    bioLimit - (profile?.personal_info?.bio?.length || 0)
  );
  const [updatedProfileImg, setUpdatedProfileImg] = useState(null);
  const [userAuth, setUserAuth] = useRecoilState(UserAuthDetails);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: profile?.personal_info?.username || "",
      bio: profile?.personal_info?.bio || "",
      facebook: profile?.social_links?.facebook || "",
      github: profile?.social_links?.github || "",
      instagram: profile?.social_links?.instagram || "",
      twitter: profile?.social_links?.twitter || "",
      website: profile?.social_links?.website || "",
      youtube: profile?.social_links?.youtube || "",
    },
  });
  console.log(profile);

  const {
    personal_info: { fullname, email, profile_img, bio },
    social_links: { facebook, github, instagram, twitter, website, youtube },
  } = profile;

  const handleBioChange = (e) => {
    const inputLength = e.target.value.length;
    setCharCount(bioLimit - inputLength);
  };

  const handleImagePreview = (e) => {
    const previewImage = e.target.files[0];
    ProfileImageRef.current.src = URL.createObjectURL(previewImage);
    setUpdatedProfileImg(previewImage);
  };

  const handleUploadProfileImg = (e) => {
    e.preventDefault();
    if (!updatedProfileImg) {
      return toast.error("Select New Profile Image");
    } else {
      uploadImage(updatedProfileImg);
    }
  };

  const uploadImage = (file) => {
    const uniqueFileName = `${profile.personal_info.username}-${nanoid()}`;
    const storageRef = ref(storage, `UserProfile/${uniqueFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const loadingToastId = toast.loading("Uploading profile image...");

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${progress}%`);
      },
      (error) => {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload profile image. Please try again.", {
          id: loadingToastId,
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            const { data } = await axios.post(
              `${
                import.meta.env.VITE_SERVER_DOMAIN
              }/api/user/update_Profile_Image`,
              { url: downloadURL },
              {
                headers: {
                  Authorization: `Bearer ${userAuth.access_token}`,
                },
              }
            );

            let newUserAuth = { ...userAuth, profile_img: data.profile_img };
            localStorage.setItem("user", JSON.stringify(newUserAuth));
            setUserAuth(newUserAuth);
            setUpdatedProfileImg(null);
            toast.dismiss(loadingToastId);
            toast.success("Profile image uploaded successfully!", {
              id: loadingToastId,
            });
          } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error("Failed to update profile image");
          }
        });
      }
    );
  };

  const onSubmit = async (formData, e) => {
    console.log(formData);

    e.target.setAttribute("disabled", true);
    let {
      bio,
      username,
      facebook,
      youtube,
      instagram,
      website,
      twitter,
      github,
    } = formData;

    if (username.length < 3) {
      return toast.error("Username should be at least more than 3 characters");
    }

    if (bio.length > bioLimit) {
      return toast.error(`Bio exceeds ${bioLimit} characters`);
    }

    let loadingToast = toast.loading("Updating Profile");

    axios
      .post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/update_profile`,
        {
          bio,
          username,
          social_links: {
            facebook,
            youtube,
            instagram,
            website,
            twitter,
            github,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userAuth.access_token}`,
          },
        }
      )
      .then(({ data }) => {
        if (userAuth.username !== data.username) {
          let newUserAuth = { ...userAuth, username: data.username };
          localStorage.setItem("user", JSON.stringify(newUserAuth));
          setUserAuth(newUserAuth);
        }
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        toast.success("Profile Updated");
      })
      .catch(({ response }) => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        toast.error(response.data.error);
      });
  };

  useEffect(() => {
    if (profile) {
      reset({
        username: profile?.personal_info?.username || "",
        bio: profile?.personal_info?.bio || "",
        facebook: profile?.social_links?.facebook || "",
        github: profile?.social_links?.github || "",
        instagram: profile?.social_links?.instagram || "",
        twitter: profile?.social_links?.twitter || "",
        website: profile?.social_links?.website || "",
        youtube: profile?.social_links?.youtube || "",
      });
    }
  }, [profile, reset]);

  return (
    <div className="w-full h-fit px-2 ">
      <div className="mb-2 hidden sm:flex">
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
      </div>

      <form
        className="w-full lg:flex gap-2 justify-center"
        onSubmit={(e) => handleSubmit((formData) => onSubmit(formData, e))(e)}
      >
        <div
          className={`w-full lg:w-1/2 rounded-lg p-6 space-y-6 shadow-lg  ${
            isDarkTheme ? "bg-[#282828]" : "bg-white"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <label
              className="relative block overflow-hidden h-36 w-36 rounded-lg"
              htmlFor="uploadingImg"
            >
              <div
                className={`w-full h-full  absolute top-0 left-0 flex items-center justify-center   cursor-pointer
                 ${
                   isDarkTheme
                     ? "hover:bg-white/50 opacity-0 hover:opacity-100  text-black"
                     : "bg-[#282828]/50 opacity-0 hover:opacity-100 text-white"
                 }`}
              >
                Upload Image
              </div>
              <img
                ref={ProfileImageRef}
                src={profile_img}
                className="h-36 w-36 rounded-lg object-cover z-30 "
                alt="Profile"
              />
            </label>
            <input
              onChange={handleImagePreview}
              type="file"
              id="uploadingImg"
              hidden
            />
            <button
              onClick={handleUploadProfileImg}
              className={`${getButtonClass(isDarkTheme)}`}
            >
              Upload
            </button>
          </div>

          <div className={`flex flex-col gap-2 w-full `}>
            <div className="w-full flex gap-2 flex-col">
              <div className="flex items-center gap-2 rounded-lg">
                <label className="font-medium flex items-center">
                  <i className="fi fi-rr-user text-2xl h-fit pt-2"></i>
                </label>
                <input
                  className={`px-3 py-2 w-full rounded-lg cursor-not-allowed outline-none boder-white border-2  ${
                    isDarkTheme
                      ? "bg-[#282828] text-white border-gray-500"
                      : "bg-white text-black border-gray-500"
                  }`}
                  type="text"
                  value={fullname}
                  disabled
                />
              </div>

              <div className="flex items-center gap-2 rounded-lg">
                <label className="font-medium flex items-center">
                  <i className="fi fi-rr-envelope text-2xl h-fit pt-2"></i>
                </label>
                <input
                  className={`px-3 py-2 w-full rounded-lg cursor-not-allowed outline-none  boder-white border-2 ${
                    isDarkTheme
                      ? "bg-[#282828] text-white border-gray-500"
                      : "bg-white text-black border-gray-500"
                  }`}
                  type="text"
                  value={email}
                  disabled
                />
              </div>
            </div>

            <div className="w-full">
              <div className="flex flex-col items-start gap-2 w-full">
                <div className="flex gap-2 w-full items-center">
                  <label className="font-medium flex items-center gap-2">
                    <i className="fi fi-rs-at text-2xl h-fit pt-2"></i>
                  </label>
                  <input
                    className={`px-3 py-2 w-full rounded-lg outline-none  boder-white border-2 ${
                      isDarkTheme
                        ? "bg-[#282828] text-white border-gray-500"
                        : "bg-white text-black border-gray-500"
                    }`}
                    type="text"
                    {...register("username")}
                  />
                </div>
                <h1 className="text-sm mt-2 ml-5 md:mt-0">
                  Give any Professional Name
                </h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-medium">
              Bio -{" "}
              <span className="text-sm"> {charCount} Characters Left</span>
            </label>
            <textarea
              onInput={handleBioChange}
              maxLength={bioLimit}
              rows={5}
              className={`px-3 py-2 w-full rounded-lg  outline-none  boder-white border-2 ${
                isDarkTheme
                  ? "bg-[#282828] text-white border-gray-500"
                  : "bg-white text-black border-gray-500"
              }`}
              placeholder="Add Bio"
              {...register("bio")}
            />
          </div>
        </div>

        <div
          className={`w-full lg:w-1/2 lg:max-w-fit rounded-lg p-6 space-y-6 shadow-lg mt-2 lg:mt-0 ${
            isDarkTheme ? "bg-[#282828]" : "bg-white"
          }`}
        >
          <label className="font-medium">Social Handles</label>
          <div className="w-full">
            <div className="w-full flex items-center gap-2">
              <i className="fi fi-brands-facebook text-xl"></i>
              <input
                className={`px-3 py-2 w-full  rounded-lg outline-none  boder-white border-2 ${
                  isDarkTheme
                    ? "bg-[#282828] text-white border-gray-500"
                    : "bg-white text-black border-gray-500"
                }`}
                type="text"
                {...register("facebook")}
                placeholder="Facebook Link"
              />
            </div>
          </div>

          <div className="w-full">
            <div className="w-full flex items-center gap-2">
              <i className="fi fi-brands-twitter text-xl"></i>
              <input
                className={`px-3 py-2 w-full   rounded-lg outline-none  boder-white border-2 ${
                  isDarkTheme
                    ? "bg-[#282828] text-white border-gray-500"
                    : "bg-white text-black border-gray-500"
                }`}
                type="text"
                {...register("twitter")}
                placeholder="Twitter Link"
              />
            </div>
          </div>

          <div className="w-full">
            <div className="w-full flex items-center gap-2">
              <i className="fi fi-brands-instagram text-xl"></i>
              <input
                className={`px-3 py-2 w-full   rounded-lg outline-none  boder-white border-2 ${
                  isDarkTheme
                    ? "bg-[#282828] text-white border-gray-500"
                    : "bg-white text-black border-gray-500"
                }`}
                type="text"
                {...register("instagram")}
                placeholder="Instagram Link"
              />
            </div>
          </div>

          <div className="w-full">
            <div className="w-full flex items-center gap-2">
              <i className="fi fi-brands-github text-xl"></i>
              <input
                className={`px-3 py-2 w-full   rounded-lg outline-none  boder-white border-2 ${
                  isDarkTheme
                    ? "bg-[#282828] text-white border-gray-500"
                    : "bg-white text-black border-gray-500"
                }`}
                type="text"
                {...register("github")}
                placeholder="GitHub Link"
              />
            </div>
          </div>

          <div className="w-full">
            <div className="w-full flex items-center gap-2">
              <i className="fi fi-brands-youtube text-xl"></i>
              <input
                className={`px-3 py-2 w-full   rounded-lg outline-none  boder-white border-2 ${
                  isDarkTheme
                    ? "bg-[#282828] text-white border-gray-500"
                    : "bg-white text-black border-gray-500"
                }`}
                type="text"
                {...register("youtube")}
                placeholder="YouTube Link"
              />
            </div>
          </div>

          <div className="w-full">
            <div className="w-full flex items-center gap-2">
              <i className="fi fi-rr-globe text-xl"></i>
              <input
                className={`px-3 py-2 w-full   rounded-lg outline-none  boder-white border-2 ${
                  isDarkTheme
                    ? "bg-[#282828] text-white border-gray-500"
                    : "bg-white text-black border-gray-500"
                }`}
                type="text"
                {...register("website")}
                placeholder="Personal Website Link"
              />
            </div>
          </div>
          <div className="w-full flex justify-center ">
            <button
              className={`  ${getButtonClass(isDarkTheme)}`}
              type="submit"
            >
              Update Profile
            </button>
          </div>
        </div>
      </form>

      <Toaster />
    </div>
  );
}

export default EditProfile;
