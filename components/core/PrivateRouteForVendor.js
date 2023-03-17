import React from "react";
import { useRouter } from "next/router";

export const withAuth = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();
      const accessToken = localStorage.getItem("token");
      const userHaveAnyShop = localStorage.getItem("userHaveAnyShop");
      const userType = localStorage.getItem("user_type");
      if (accessToken) {
        if (userType === "vendor") {
          if (userHaveAnyShop === "true") {
            console.log("first--------->>>>>>>");
            return <WrappedComponent {...props} />;
          }
          Router.push("/vendor/shop-setup");
          return null;
        }
        Router.push("/");
        return null;
      }
      Router.push("/");
      return null;
    }
    return null;
  };
};

export const withAuthWithoutShop = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();
      const accessToken = localStorage.getItem("token");
      const userHaveAnyShop = localStorage.getItem("userHaveAnyShop");
      const userType = localStorage.getItem("user_type");

      if (accessToken) {
        if (userType === "vendor") {
          if (userHaveAnyShop === "false") {
            return <WrappedComponent {...props} />;
          }
          Router.push("/vendor/dashboard");
          return null;
        }
        Router.push("/");
        return null;
      }
      Router.push("/");
      return null;
    }
    return null;
  };
};
