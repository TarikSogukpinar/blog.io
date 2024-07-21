import axios from "axios";

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

export default { loginUser, registerUser, logoutUser };
