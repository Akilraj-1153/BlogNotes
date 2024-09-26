export const getButtonClass = (isDarkTheme) => {
  return `px-3.5 py-1.5 bg-gray-400 rounded-full ${
    isDarkTheme ? "hover:bg-white hover:text-black" : "hover:bg-[#282828] hover:text-white"
  }`;
};

export const getCardButtonClass = (isDarkTheme) => {
  return `px-3 py-2 rounded-full ${
    isDarkTheme ? "hover:bg-white hover:text-black" : "hover:bg-[#282828] hover:text-white"
  }`;
};

export const BlogButtons = (isDarkTheme, category, selectedCategory) => {
  return `px-3 py-2 rounded-lg w-full flex items-start hover:px-10 ${
    category === selectedCategory 
      ? isDarkTheme 
        ? "bg-white text-black" 
        : "bg-[#282828] text-white" 
      : ""
  }`;
};

export const NotificationButtons = (isDarkTheme, category, selectedCategory) => {
  return `px-3 py-2 rounded-lg w-full flex items-start ${
    category === selectedCategory 
      ? isDarkTheme 
        ? "bg-white text-black" 
        : "bg-[#282828] text-white" 
      : ""
  }`;
};
