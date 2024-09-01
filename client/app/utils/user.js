import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserInformation = async () => {
  try {
    const token = Cookies.get("JWT");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

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

export const deactivateAccount = async () => {
  try {
    const token = Cookies.get("JWT");

    const response = await axios.patch(`${API_URL}/user/deactivate-account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    if (!response.ok) {
      throw new Error("Failed to deactivate account.");
    }

    return true;
  } catch (error) {
    console.error("Error deactivating account:", error);
    return {
      error: error.message || "An error occurred while fetching sessions.",
    };
  }
};

export const getUserSessions = async () => {
  try {
    const token = Cookies.get("JWT");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/sessions`, {
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
      `${API_URL}/user/${userId}/password`,
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

export async function uploadUserProfileImage(formData) {
  const token = Cookies.get("JWT");
  const response = await axios.post("${API_URL}/user/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
