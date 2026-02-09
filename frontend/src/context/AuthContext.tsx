"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getUser,
  getToken,
} from "../api/auth.api";
import type { LoginData, RegisterData } from "../api/auth.api";

interface User {
  id: string;
  email: string;
  role: string;
  tenantId: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = getUser();
    const storedToken = getToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await apiLogin(data);

      const { user: userData, token: userToken } = response.data;

      // Save to state
      setUser(userData);
      setToken(userToken);

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userToken);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await apiRegister(data);

      const { user: userData, token: userToken } = response.data;

      // Save to state
      setUser(userData);
      setToken(userToken);

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userToken);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);

    // Clear localStorage
    apiLogout();
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
