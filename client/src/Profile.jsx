import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Mail, Bell, Lock, Save, Camera } from "lucide-react";
import axios from "./api/axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "", avatar: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Please log in to view your profile");
          setLoading(false);
          navigate("/login");
          return;
        }

        console.log("Fetching user profile data...");
        
        // Try to get user data using the /user endpoint directly
        try {
          const response = await axios.get("/user", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          
          console.log("Fetched user data:", response.data);

          if (response.data) {
            setUser(response.data);
            setFormData({
              username: response.data.username || "",
              email: response.data.email || "",
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn("Error fetching from /user, trying /api/user:", error);
          
          // If the first attempt fails, try with /api/user
          try {
            const apiResponse = await axios.get("/api/user", {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            
            console.log("Fetched user data from /api/user:", apiResponse.data);
  
            if (apiResponse.data) {
              setUser(apiResponse.data);
              setFormData({
                username: apiResponse.data.username || "",
                email: apiResponse.data.email || "",
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
              setLoading(false);
              return;
            }
          } catch (apiError) {
            console.error("Error fetching from /api/user:", apiError);
            throw apiError; // Let the outer catch handle this
          }
        }
        
        // If we get here, both attempts failed
        throw new Error("Could not fetch user data from any endpoint");
      } catch (err) {
        console.error("Error fetching user data:", err);
        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
        }
        
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch user data. Please log in again."
        );
        
        setLoading(false);
        
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
          navigate("/login");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile update form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Please log in to update your profile");
        navigate("/login");
        return;
      }

      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError("New passwords do not match");
          return;
        }
        if (!formData.currentPassword) {
          setError("Current password is required to change password");
          return;
        }
      }

      const userId = localStorage.getItem("userId") || user.id;
      console.log("Updating profile for user ID:", userId);
      
      // Try updating with /user endpoint
      try {
        const response = await axios.put(`/user/${userId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        console.log("Profile update response:", response.data);
  
        if (response.data) {
          // Update user object with the returned data or with form data
          setUser({
            ...user,
            username: response.data.username || formData.username,
            email: response.data.email || formData.email,
            id: response.data.id || user.id
          });
          
          setSuccess("Profile updated successfully!");
          setIsEditing(false);
        }
      } catch (error) {
        console.warn("Error updating with /user endpoint, trying with /api/user:", error);
        
        // If the first attempt fails, try with /api/user
        const apiResponse = await axios.put(`/api/user/${userId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        console.log("Profile update response from /api/user:", apiResponse.data);

        if (apiResponse.data) {
          // Update user object with the returned data or with form data
          setUser({
            ...user,
            username: apiResponse.data.username || formData.username,
            email: apiResponse.data.email || formData.email,
            id: apiResponse.data.id || user.id
          });
          
          setSuccess("Profile updated successfully!");
          setIsEditing(false);
        }
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }
      
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        err.message ||
        "Failed to update profile"
      );
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        navigate("/login");
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // Handle delete chat history
  const handleDeleteChatHistory = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all chat history? This action cannot be undone."
      )
    ) {
      try {
        const token = localStorage.getItem("authToken");
        
        // Try deleting with /chat endpoint
        try {
          await axios.delete("/chat/latest-chat", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          alert("Chat history deleted successfully.");
        } catch (error) {
          console.warn("Error deleting with /chat endpoint, trying with /api/chat:", error);
          
          // If the first attempt fails, try with /api/chat
          await axios.delete("/api/chat/latest-chat", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          alert("Chat history deleted successfully.");
        }
      } catch (err) {
        console.error("Error deleting chat history:", err);
        setError(
          err.response?.data?.message || 
          err.message || 
          "Failed to delete chat history"
        );
      }
    }
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin h-10 w-10 border-t-4 border-green-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center text-green-400 hover:text-green-300 transition"
          >
            <ArrowLeft className="mr-2" />
            Home
          </button>
          <h2 className="text-2xl font-semibold">Profile Settings</h2>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${user.username}&background=random`
              }
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-green-500 shadow-md"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-green-600 p-1 rounded-full hover:bg-green-700 transition">
                <Camera size={18} />
              </button>
            )}
          </div>
          <h3 className="text-lg font-bold">{user.username}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {success && <div className="text-green-400 text-sm">{success}</div>}

          <div>
            <label className="block text-sm mb-1 flex items-center gap-1">
              <User size={16} /> Username
            </label>
            <input
              type="text"
              name="username"
              className="w-full p-2 bg-gray-700 rounded-lg text-white"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 flex items-center gap-1">
              <Mail size={16} /> Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full p-2 bg-gray-700 rounded-lg text-white"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <>
              <div>
                <label className="block text-sm mb-1 flex items-center gap-1">
                  <Lock size={16} /> Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  className="w-full p-2 bg-gray-700 rounded-lg text-white"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required={formData.newPassword !== ""}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 flex items-center gap-1">
                  <Lock size={16} /> New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  className="w-full p-2 bg-gray-700 rounded-lg text-white"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 flex items-center gap-1">
                  <Lock size={16} /> Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full p-2 bg-gray-700 rounded-lg text-white"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="flex justify-between">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="flex items-center bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                >
                  <Save className="mr-2" size={18} />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      username: user.username,
                      email: user.email,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="text-red-400 hover:text-red-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>

        <hr className="border-gray-700" />

        <div className="flex justify-between items-center">
          <button
            onClick={handleDeleteChatHistory}
            className="flex items-center text-yellow-400 hover:text-yellow-300 transition"
          >
            <Bell className="mr-2" size={18} />
            Delete Chat History
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
