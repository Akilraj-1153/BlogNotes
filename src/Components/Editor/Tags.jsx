import React from "react";
import { RxCross2 } from "react-icons/rx";
import { blogStructure, DarkTheme } from "../Configuration/Atoms";
import { useRecoilState } from "recoil";
import { getButtonClass } from "../Common/MiniComponent";

function Tags({ tag, tagKey }) {
  const [blog, setBlog] = useRecoilState(blogStructure);
  const [isDarkTheme] = useRecoilState(DarkTheme);

  const handleTagDelete = () => {
    const updatedTags = blog.tags.filter((_, index) => index !== tagKey);
    setBlog((prev) => ({
      ...prev,
      tags: updatedTags,
    }));
  };

  return (
    <div
      className={`${getButtonClass(
        isDarkTheme
      )} flex gap-2 items-center overflow-hidden`}
    >
      <div className="flex-grow truncate whitespace-nowrap overflow-ellipsis">
        <h1>{tag}</h1>
      </div>
      <RxCross2
        onClick={handleTagDelete}
        className="cursor-pointer flex-shrink-0"
        size={20}
      />
    </div>
  );
}

export default Tags;
