import { useContext } from "react";
import { UserTypeContext } from "../contexts/usertypecontext";

const useUserType = () => {
  const context = useContext(UserTypeContext);
  if (!context) {
    throw new Error("useUserType must be used within a UserTypeProvider");
  }

  const { userType: currentUserType, setUserType } = context;

  const getUserType = () => currentUserType;

  const switchUserType = () => {
    setUserType(currentUserType === "vendor" ? "customer" : "vendor");
    localStorage.setItem(
      "user_type",
      currentUserType === "vendor" ? "customer" : "vendor"
    );
  };

  return {
    currentUserType,
    setUserType,
    getUserType,
    switchUserType,
  };
};

export default useUserType;
