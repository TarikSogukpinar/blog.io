import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response ? error.response.data : error);
    return {
      error: error.response?.data?.message || "An error occurred during login.",
    };
  }
};

export const logoutUser = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Logout error:",
      error.response ? error.response.data : error
    );
    return {
      error:
        error.response?.data?.message || "An error occurred during logout.",
    };
  }
};

export const registerUser = async (name, email, password) => {
  return await axios.post(
    `${API_URL}/auth/register`,
    {
      name,
      email,
      password,
    },
    { withCredentials: true }
  );
};

export const handleGithubCallback = () => {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("JWT");

    if (token) {
      Cookies.set("JWT", token, {
        path: "/",
        secure: false,
        sameSite: "strict",
      });

      window.location.href = "/en/home";
    }
  }
};

export const handleOAuthCallback = () => {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("JWT");

    if (token) {
      Cookies.set("JWT", token, {
        path: "/",
        secure: false,
        sameSite: "strict",
      });

      window.location.href = "/en/home";
    }
  }
};

export default {
  loginUser,
  registerUser,
  logoutUser,
  handleGithubCallback,
  handleOAuthCallback,
};
