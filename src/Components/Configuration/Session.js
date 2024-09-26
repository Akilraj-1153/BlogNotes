// Session.js
export const storeInLocal = (key, value) => {
  localStorage.setItem(key, value);
};

export const lookInLocal = (key) => {
  return localStorage.getItem(key);
};

export const removeFromLocal = (key) => {
  localStorage.removeItem(key);
};

export const logoutUser = () => {
  localStorage.clear();
};

export const getLocal = (key) => {
  return localStorage.getItem(key);
};
