// utils/auth.js
export const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

export const login = () => {
  return localStorage.setItem("isLoggedIn", "true")
}