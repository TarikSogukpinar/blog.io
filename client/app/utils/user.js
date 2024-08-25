import axios from "axios";
import Cookies from "js-cookie";

export const getUserInformation = async () => {
  try {
    const token = Cookies.get("JWT");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(
      `https://blog.tariksogukpinar.dev/api/v1/user/me`,
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
      "Get user information error:",
      error.response ? error.response.data : error
    );
    return {
      error:
        error.response?.data?.message ||
        "An error occurred while fetching user information.",
    };
  }
};

export const getUserSessions = async () => {
  try {
    const token = Cookies.get("JWT");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`http://localhost:5000/api/v1/sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return {
      error: error.message || "An error occurred while fetching sessions.",
    };
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const token = Cookies.get("JWT");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.put(
      `http://localhost:5000/api/v1/user/${userId}/password`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error changing password:", error.response || error);
    return {
      error:
        error.response?.data?.message ||
        "An error occurred while changing the password.",
    };
  }
};
