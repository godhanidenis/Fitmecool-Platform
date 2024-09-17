import React from "react";
import { useRouter } from "next/router";
import useUserType from "../../hooks/useUserType";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

export const vendorPrivateGaurd = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();
      const currentRoute = Router.pathname;

      const accessToken = localStorage.getItem("token");

      const { currentUserType } = useUserType();
      const { userProfile, loading } = useSelector(
        (state) => state.userProfile
      );

      if (accessToken) {
        if (!loading && userProfile) {
          if (currentUserType === "vendor") {
            if (userProfile?.userHaveAnyShop) {
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
          return (
            <div className="flex justify-center items-center h-[100vh] w-full">
              <CircularProgress color="secondary" />
            </div>
          );
        }
      } else {
        Router.push("/");
        return false;
      }
    }
    return null;
  };
};
