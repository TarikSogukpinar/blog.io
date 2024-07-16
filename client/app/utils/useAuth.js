import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { logoutUser } from "../utils/auth"; // Adjust the import path as needed

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const locale = useRouter().pathname;

  useEffect(() => {
    const token = Cookies.get("JWT");
    setIsAuthenticated(!!token); // Set authentication state based on token existence
  }, []);

  const handleUserLogout = async () => {
    try {
      await logoutUser(); // Use the imported logout function
      Cookies.remove("JWT");
      setIsAuthenticated(false);
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return { isAuthenticated, handleUserLogout };
};

export default useAuth;
