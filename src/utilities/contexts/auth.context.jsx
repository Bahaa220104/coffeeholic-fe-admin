import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loginApi = useApi({ method: "post", url: "/auth/login" });
  const userApi = useApi({ method: "get", url: "/users/me" });

  const signIn = async (credentials) => {
    setLoading(true);
    const response = await loginApi.call({ data: credentials });
    if (response.ok) {
      localStorage.setItem("token", response.data.token);
      await fetchUser();
      navigate("/");
      console.log("Navigating to /");
    }
    setLoading(false);
    return response;
  };

  const signOut = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const fetchUser = async () => {
    setLoading(true);
    const response = await userApi.call();
    if (response.ok) {
      setUser(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
