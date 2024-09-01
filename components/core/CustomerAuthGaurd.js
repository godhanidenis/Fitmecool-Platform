import { useRouter } from "next/router";
import useUserType from "../../hooks/useUserType";

export const customerPublicGaurd = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();
      const { currentUserType } = useUserType();

      const token = localStorage.getItem("token");

      if (token) {
        if (currentUserType === "vendor") {
          Router.push("/vendor/dashboard");
          return false;
        } else {
          return <WrappedComponent {...props} />;
        }
      } else {
        return <WrappedComponent {...props} />;
      }
    }
    return null;
  };
};

export const customerPrivateGaurd = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();
      const { currentUserType } = useUserType();

      const token = localStorage.getItem("token");

      if (token) {
        if (currentUserType === "vendor") {
          Router.push("/");
          return false;
        } else {
          return <WrappedComponent {...props} />;
        }
      } else {
        Router.push("/");
        return false;
      }
    }
    return null;
  };
};
