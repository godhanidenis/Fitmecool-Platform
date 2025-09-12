import React, { createContext, useState, useEffect } from "react";

// Create the context
export const UserTypeContext = createContext();

// Export the provider component
export const UserTypeProvider = ({ children }) => {
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const savedUserType = localStorage.getItem("user_type") ?? "";
    setUserType(savedUserType);
  }, []);

  useEffect(() => {
    if (userType) {
      localStorage.setItem("user_type", userType);
    }
  }, [userType]);

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
};
