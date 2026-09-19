import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && token !== "undefined" && userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);

        // Refresh role/xp/level from the server so a role change (e.g. a teacher
        // being made admin) applies without logging out and back in.
        authService
          .getProfile()
          .then(({ data }) => {
            setUser((prev) => {
              const merged = {
                ...(prev || userData),
                role: data.role,
                xp: data.xp,
                level: data.level,
              };
              localStorage.setItem("user", JSON.stringify(merged));
              return merged;
            });
          })
          .catch(() => {});
      } else {
        logout(false); // silent logout
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };

  // allow optional redirect
  const logout = (redirect = true) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);

    if (redirect) {
      window.location.href = "/";
    }
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };

    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
