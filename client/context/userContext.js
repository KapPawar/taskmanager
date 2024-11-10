import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

const UserContext = React.createContext();

// Set axios to include credentials with every request
axios.defaults.withCredentials = true;

export const UserContextProvider = ({ children }) => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const router = useRouter();

  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [userState, setUserState] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  // Register User
  const registerUser = async (e) => {
    e.preventDefault();
    if (
      !userState.email.includes("@") ||
      !userState.password ||
      userState.password.length < 6
    ) {
      toast.error("Please enter a valid email and password (min 6 characters)");
      return;
    }

    try {
      const res = await axios.post(`${serverUrl}/api/v1/register`, userState);
      toast.success("User registered successfully");
      setUserState({ name: "", email: "", password: "" });
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error registering user");
    }
  };

  // Login User
  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${serverUrl}/api/v1/login`, userState);
      toast.success("User logged in successfully");
      setUserState({ email: "", password: "" });
      await getUser();
      router.push("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging in user");
    }
  };

  // Get User Details
  const getUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/v1/user`);
      setUser(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Error getting user details"
      );
    }
  };

  // Logout User
  const logoutUser = async () => {
    try {
      await axios.get(`${serverUrl}/api/v1/logout`);
      toast.success("User logged out successfully");
      setUser({});
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging out user");
    }
  };

  // Check User Login Status
  const userLoginStatus = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/login-status`);
      if (!res.data) {
        router.push("/login");
      }
    } catch (error) {
      toast.error("Error getting user login status");
    }
  };

  // Update User Details
  const updateUser = async (e, data) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.patch(`${serverUrl}/api/v1/user`, data);
      setUser((prev) => ({ ...prev, ...res.data }));
      toast.success("User updated successfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Error updating user details"
      );
    }
  };

  // ... other methods for email verification, forgot password, etc.

  useEffect(() => {
    const loginStatusGetUser = async () => {
      await userLoginStatus();
      await getUser();
    };
    loginStatusGetUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        registerUser,
        userState,
        loginUser,
        logoutUser,
        userLoginStatus,
        user,
        updateUser,
        // other functions here
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
