import { useContext } from "react";
import { UserTypeContext } from "../contexts/usertypecontext";
import { useRouter } from "next/router";

const useUserType = () => {
  const router = useRouter();
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
    getUserType,
    switchUserType,
  };
};

export default useUserType;
