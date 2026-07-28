import apiClient from "./client";
import { firebaseAuth, firebaseConfigured, googleProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

const saveUser = (data) => {
  const user = { ...data.user, token: data.token };
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

const register = async (userData) => saveUser((await apiClient.post("/api/user/register", userData)).data.data);
const login = async (userData) => saveUser((await apiClient.post("/api/user/login", userData)).data.data);
const loginWithGoogle = async () => {
  if (!firebaseConfigured || !firebaseAuth) throw new Error("Google sign-in is not configured.");
  const credential = await signInWithPopup(firebaseAuth, googleProvider);
  const idToken = await credential.user.getIdToken();
  return saveUser((await apiClient.post("/api/user/firebase-login", { idToken })).data.data);
};
const logout = () => localStorage.removeItem("user");
const getProfile = async () => (await apiClient.get("/api/user/profile")).data.data.user;
const updateProfile = async (userData) => {
  const user = (await apiClient.put("/api/user/profile", userData)).data.data.user;
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const updatedUser = { ...user, token: storedUser.token };
  localStorage.setItem("user", JSON.stringify(updatedUser));
  return updatedUser;
};
const updatePassword = async (passwords) => (await apiClient.put("/api/user/password", passwords)).data;

export default { register, login, loginWithGoogle, logout, getProfile, updateProfile, updatePassword };
