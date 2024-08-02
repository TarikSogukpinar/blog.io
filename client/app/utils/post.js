import axios from "axios";

export const fetchPost = async (token) => {
  try {
    const response = await axios.get(`https://blog.tariksogukpinar.dev/api/blog/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching posts:",
      error.response ? error.response.data : error
    );
    return {
      error:
        error.response?.data?.message ||
        "An error occurred while fetching posts.",
    };
  }
};

export const addPost = async (token, bookData) => {
  try {
    const response = await axios.post(
      `https://blog.tariksogukpinar.dev/api/blog/posts`,
      bookData,
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
      "Error adding posts:",
      error.response ? error.response.data : error
    );
    return {
      error:
        error.response?.data?.message ||
        "An error occurred while adding posts.",
    };
  }
};
