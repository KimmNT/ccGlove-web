import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Testing() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle login
  const loginUser = () => {
    // For example purposes, assume token is '12345abcde'
    const token = "12345abcde";
    Cookies.set("urs_login_token_key", token, { expires: 1, path: "/" });
  };

  // Function to handle logout
  const logoutUser = () => {
    Cookies.remove("urs_login_token_key");
  };

  // Check if user is authenticated when component mounts
  useEffect(() => {
    const token = Cookies.get("urs_login_token_key");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div>
      <h1>{isAuthenticated ? "Welcome, User!" : "Please log in"}</h1>
      {!isAuthenticated ? (
        <button onClick={loginUser}>Login</button>
      ) : (
        <button onClick={logoutUser}>Logout</button>
      )}
    </div>
  );
}
