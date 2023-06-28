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
            return <WrappedComponent {...props} />;
          } else {
            Router.push("/vendor/shop-setup");
          }
        } else {
          Router.push("/");
        }
      } else;
      {
        Router.push("/");
      }
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
          } else {
            Router.push("/vendor/dashboard");
          }
        } else {
          Router.push("/");
        }
      } else {
        Router.push("/");
      }
    }
    return null;
  };
};

export const withoutAuth = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();

      const userType = localStorage.getItem("user_type");

      if (userType !== "vendor") {
        return <WrappedComponent {...props} />;
      } else {
        Router.push("/vendor/dashboard");
      }
    }
    return null;
  };
};
