import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { Link } from "react-router-dom";
import { DarkTheme, NavHeight } from "../Configuration/Atoms";
import { useState, useRef } from "react";
import { FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { ExternalLink } from "react-external-link";
import { toast, Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../Configuration/FirebaseConfig";
import { getButtonClass } from "./MiniComponent";

function Contact() {
  const [isDarkTheme] = useRecoilState(DarkTheme);
  const [navbarHeight, setNavbarHeight] = useRecoilState(NavHeight);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useRef();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const sendEmail = async (data, e) => {
    setIsSubmitting(true);

    let fileUrl = "";

    if (data.image && data.image[0]) {
      const file = data.image[0];
      const storageRef = ref(
        storage,
        `/images/${data.user_email}/${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      fileUrl = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Progress monitoring
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Upload error:", error);
            toast.error("Error uploading image.");
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    try {
      const result = await emailjs.send(
        "service_sc5g06r", // replace with your service ID
        "template_ta4bq8o", // replace with your template ID
        {
          user_name: data.user_name,
          user_email: data.user_email,
          message: data.message,
          file_url: fileUrl, // Send the file URL instead of the file itself
        },
        "9ZIOB5GrK4KOMXko2" // replace with your public key
      );
      toast.success("Message sent!");
      console.log(result.text);
    } catch (error) {
      toast.error("Something went wrong, please try again later.");
      console.error(error.text);
    }

    setIsSubmitting(false);
    e.target.reset();
    reset();
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div
      className="flex items-center flex-col "
      style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}
    >
      <h1 className="text-center p-5 text-2xl font-bold">Contact</h1>
      <div
        className={` ${
          isDarkTheme ? "bg-[#1E1E1E] " : "bg-white "
        } shadow-lg rounded-lg max-w-2xl py-10 md:px-10 `}
      >
        <div className="w-full">
          <div className=" h-full w-full justify-start items-center flex flex-col">
            <div className="flex flex-row gap-10">
              <button className="contacticon">
                <ExternalLink href="https://www.linkedin.com/in/akilrajn1153">
                  <FaLinkedinIn size={35} className="icon" />
                </ExternalLink>
              </button>
              <button className="contacticon">
                <ExternalLink href="https://github.com/Akilraj-1153">
                  <FaGithub size={35} className="icon" />
                </ExternalLink>
              </button>
              <button className="contacticon">
                <ExternalLink href="https://x.com/Akilraj1153?t=nclAtn7CQGL7vEhqIDB3pA&s=08">
                  <FaTwitter size={35} className="icon" />
                </ExternalLink>
              </button>
            </div>

            <div className="form  w-full p-5 m-5 rounded-xl  ">
              <form
                ref={form}
                onSubmit={handleSubmit(sendEmail)}
                className="flex flex-col gap-2"
              >
                <label className="namelabel">Name</label>
                <input
                  className="p-2 nameip rounded-full bg-transparent border font-sans outline-none"
                  type="text"
                  {...register("user_name")}
                />

                <label className="emaillabel">Email</label>
                <input
                  className="p-2 emailip bg-transparent border rounded-full font-sans  outline-none"
                  type="email"
                  {...register("user_email", { required: true })}
                />
                {errors.user_email && (
                  <span className="error">Email is required</span>
                )}

                <label className="textlabel">Message</label>
                <textarea
                  className="p-2 textip bg-transparent border rounded-lg font-sans h-20  outline-none resize-none"
                  {...register("message", { required: true })}
                ></textarea>
                {errors.message && (
                  <span className="error">Message is required</span>
                )}

                <label className="filelabel">Attach an Image</label>
                <input type="file" {...register("image")} />

                <input
                  className={`${getButtonClass(isDarkTheme)} cursor-pointer`}
                  type="submit"
                  value="Send"
                  disabled={isSubmitting}
                />
              </form>
            </div>
          </div>
          <Toaster />
        </div>
      </div>
    </div>
  );
}

export default Contact;
