import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { DarkTheme } from "../Configuration/Atoms";
import { useRecoilState } from "recoil";
import { Link } from "react-router-dom";

function Footer() {
  const [isDarkTheme] = useRecoilState(DarkTheme);

  return (
    <footer
      className={`w-full py-10 mt-5 shadow-t-xl border-t ${
        isDarkTheme ? "bg-[#1E1E1E] text-gray-300" : "bg-white text-gray-700"
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-2xl font-bold">BlogNotes</p>
        <p className="text-sm italic mt-2">
          Notes from the Mind, Ideas for the Blog
        </p>

        <div className="flex justify-center space-x-8 mt-8 text-sm font-medium">
          <Link to="/"> Home</Link>
          <Link to="/About"> About</Link>
          <Link to="/Contact"> Contact</Link>
        </div>

        <div className="flex justify-center mt-8 space-x-6">
          <a href="#" className=" ">
            <FaFacebookF className="w-6 h-6" />
          </a>
          <a href="#" className=" ">
            <FaTwitter className="w-6 h-6" />
          </a>
          <a href="#" className=" ">
            <FaLinkedinIn className="w-6 h-6" />
          </a>
          <a href="#" className=" ">
            <FaInstagram className="w-6 h-6" />
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-8">
          © 2024 BlogNotes. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
