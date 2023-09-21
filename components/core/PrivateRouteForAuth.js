import { useRouter } from "next/router";

export const withoutAuthAndUserType = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();

      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("user_type");
      const selectedUserType = localStorage.getItem("user_type_for_auth");

      if (token) {
        Router.push(userType === "vendor" ? "/vendor/dashboard" : "/");
        return false;
      } else if (!selectedUserType) {
        Router.push("/auth/user-type");
        return false;
      } else {
        return <WrappedComponent {...props} />;
      }
    }
    return null;
  };
};

export const withoutAuthForUserType = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();

      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("user_type");

      if (token) {
        Router.push(userType === "vendor" ? "/vendor/dashboard" : "/");
        return false;
      } else {
        return <WrappedComponent {...props} />;
      }
    }
    return null;
  };
};
