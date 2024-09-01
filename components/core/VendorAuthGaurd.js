import React from "react";
import { useRouter } from "next/router";
import useUserType from "../../hooks/useUserType";

export const vendorPrivateGaurd = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();
      const { currentUserType } = useUserType();

      const currentRoute = Router.pathname;

      const accessToken = localStorage.getItem("token");
      const userHaveAnyShop = localStorage.getItem("userHaveAnyShop");

      console.log("currentRoute :-", currentRoute);

      if (accessToken) {
        if (currentUserType === "vendor") {
          if (userHaveAnyShop === "true") {
            return <WrappedComponent {...props} />;
          } else {
            if (currentRoute.includes("/vendor/shop-setup")) {
              return <WrappedComponent {...props} />;
            } else {
              Router.push("/vendor/shop-setup");
              return false;
            }
          }
        } else {
          Router.push("/");
          return false;
        }
      } else {
        Router.push("/");
        return false;
      }
    }
    return null;
  };
};
