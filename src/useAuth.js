// useAuth.js
import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("urs_login_token_key");
    setIsAuthenticated(!!token);
  }, []);

  // Define a logout function to clear the auth token and update the state
  const logout = useCallback(() => {
    Cookies.remove("urs_login_token_key");
  }, []);

  return { isAuthenticated, logout };
};

export default useAuth;
