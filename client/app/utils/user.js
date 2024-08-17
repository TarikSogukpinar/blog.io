import axios from "axios";
import Cookies from "js-cookie";

export const getUserInformation = async () => {
  try {
    const token = Cookies.get("JWT");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`http://localhost:5000/api/v1/user/me`, {
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
