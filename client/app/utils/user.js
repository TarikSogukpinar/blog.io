import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";

export const getUserInformation = async () => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/v1/auth/login`,
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
