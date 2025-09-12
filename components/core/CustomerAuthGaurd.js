import { useRouter } from "next/router";
import useUserType from "../../hooks/useUserType";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

export const customerPublicGaurd = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();
      const { currentUserType } = useUserType();
      const { userProfile, loading } = useSelector(
        (state) => state.userProfile
      );

      const currentRoute = Router.pathname;
      const token = localStorage.getItem("token");

      if (token) {
        if (!loading && userProfile) {
          if (currentUserType === "vendor") {
            if (userProfile?.userHaveAnyShop) {
              if (currentRoute.includes("/vendor/dashboard")) {
                return <WrappedComponent {...props} />;
              } else {
                Router.push("/vendor/dashboard");
                return false;
              }
            } else {
              if (currentRoute.includes("/vendor/shop-setup")) {
                return <WrappedComponent {...props} />;
              } else {
                Router.push("/vendor/shop-setup");
                return false;
              }
            }
          } else {
            return <WrappedComponent {...props} />;
          }
        } else {
          return (
            <div className="flex justify-center items-center h-[100vh] w-full">
              <CircularProgress color="secondary" />
            </div>
          );
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
