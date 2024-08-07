"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";

type Exp = {
  role: string;
  date: string;
  companyName: string;
  bio: string;
};
export interface User {
  id: string;
  email: string;
  name: string;
  skills: string[];
  preferredLocations: string[];
  preferredRoles: string[];
  exp: Exp[];
  createdAt: string;
  updatedAt: string;
  savedJobs: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve user data from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/api/v1/users/login", {
        email,
        password,
      });
      setUser(response.data);
      // Store user data and token in local storage
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error: any) {
      console.log(error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/api/v1/users/signup", {
        name,
        email,
        password,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      //await axiosInstance.post("/api/v1/users/logout");
      setUser(null);
      // Remove user data and token from local storage
      localStorage.removeItem("user");
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
