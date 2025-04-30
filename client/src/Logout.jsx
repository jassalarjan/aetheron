import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Frontend-only logout
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");

    delete axios.defaults.headers.common["Authorization"];

    // Redirect to login
    navigate("/login");
  }, [navigate]);

  return (
    <div className="logout-page text-center mt-10">
      <p className="text-lg text-gray-500">Logging out...</p>
    </div>
  );
};

export default Logout;
