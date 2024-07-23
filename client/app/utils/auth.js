import axios from "axios";
import Cookies from "js-cookie";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `https://blog.tariksogukpinar.dev/api/auth/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    console.log("API response:", response.data);
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
      `https://blog.tariksogukpinar.dev/api/auth/logout`,
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
    `https://blog.tariksogukpinar.dev/api/auth/register`,
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

      window.location.href = "/en/home"; // Kullanıcıyı oturum açılmış sayfaya yönlendirin
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

      window.location.href = "/en/home"; // Kullanıcıyı oturum açılmış sayfaya yönlendirin
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
