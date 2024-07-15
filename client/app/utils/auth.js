import axios from "axios";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/auth/login`,
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

export const logoutUser = async () => {
  return await axios.get(`http://localhost:5000/api/auth/logout`, {
    credentials: "include",
    withCredentials: true,
  });
};

export const registerUser = async (name, email, password) => {
  return await axios.post(
    `http://localhost:5000/api/auth/register`,
    {
      name,
      email,
      password,
    },
    { withCredentials: true }
  );
};

export default { loginUser, registerUser, logoutUser };
