import { useRouter } from "next/router";
import useUserType from "../../hooks/useUserType";

export const authAuthGaurd = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();
      const { currentUserType } = useUserType();
      const token = localStorage.getItem("token");

      if (token) {
        Router.push(currentUserType === "vendor" ? "/vendor/dashboard" : "/");
        return false;
      } else {
        return <WrappedComponent {...props} />;
      }
    }
    return null;
  };
};
