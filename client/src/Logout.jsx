import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/axios";

const Logout = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Clear all auth data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("email");

        // Remove auth header
        delete api.defaults.headers.common["Authorization"];

        // Update auth state
        if (setIsAuthenticated) {
          setIsAuthenticated(false);
        }

        // Immediately redirect to login
        navigate("/login", { replace: true });
      } catch (error) {
        console.error("Logout error:", error);
        // Still redirect to login even if there's an error
        navigate("/login", { replace: true });
      }
    };

    handleLogout();
  }, [navigate, setIsAuthenticated]);

  return null; // Don't render anything during logout
};

export default Logout;
