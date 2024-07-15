// src/auth.js
export const getToken = () => {
  return localStorage.getItem("library-app-token");
};

export const setToken = (token) => {
  localStorage.setItem("library-app-token", token);
};

export const clearToken = () => {
  localStorage.removeItem("library-app-token");
};

export const isLoggedIn = () => {
  return !!getToken();
};
