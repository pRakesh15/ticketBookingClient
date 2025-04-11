"use client";
//for making it a clint component.
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Use context api for create a context and it is from react..
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in after the page load..
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  // Login the user i can directly make it in side the login component but i prefer  this type of folder structure for maintain the code
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "/api/v1/user/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response)

      //check if login failed ...
      if (!response?.data?.success) {
        // const error = await response;
        throw new Error(response?.error?.message || "Login failed");
      }

      const data = await response.data;

      //here i can make the tost like print the error...

      console.log(data?.message);

      // Save token and user data to local storage bcz in login from backend the data is like token with user info.
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Register the user
  const register = async (username, email, password) => {
    try {
      const response = await axios.post(
        "/api/v1/user/register",
        { username, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(response)

      if (!response?.data?.success) {
        throw new Error(response?.error?.message || "Registration failed");

      }

      const data = await response.data;

      // Save token and user data to local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = () => {
    //this is done manually no need to do it in backend ..
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  // Get token
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  return (
    //wrap all the application with context provider.
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        getToken,
        isAuthenticated: !!user,
      }}
      //we can access all this field in whole application by context api
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
