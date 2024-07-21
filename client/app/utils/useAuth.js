import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { logoutUser } from "../utils/auth";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const locale = useRouter().pathname;

  useEffect(() => {
    const token = Cookies.get("JWT");
    setIsAuthenticated(!!token);
  }, []);

  const handleUserLogout = async () => {
    try {
      await logoutUser();
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
