import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Router, { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { googleSignIn, signIn } from "../../graphql/mutations/authMutations";
import { toast } from "react-toastify";
import {
  loadUserProfileStart,
  loginUserId,
} from "../../redux/ducks/userProfile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGoogleLogin } from "@react-oauth/google";
import { getGoogleUserInfo } from "../../services/googleUserInfo";
import { withoutAuthAndUserType } from "../../components/core/PrivateRouteForAuth";
import { changeByShopFilters } from "../../redux/ducks/shopsFilters";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [asVendor, setAsVendor] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const dispatch = useDispatch();

  const router = useRouter();
  const { redirectPath } = router.query;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    localStorage.getItem("user_type_for_auth") === "vendor"
      ? setAsVendor(true)
      : setAsVendor(false);
  }, []);

  const handleAfterSignInResponse = (userId, token, message) => {
    setLoading(false);
    dispatch(loginUserId(userId));
    dispatch(loadUserProfileStart({ id: userId }));
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    toast.success(message, { theme: "colored" });
    localStorage.removeItem("user_type_for_auth");
    localStorage.setItem("user_type", asVendor ? "vendor" : "customer");
    asVendor && dispatch(changeByShopFilters(false));
    setTimeout(() => {
      Router.push(asVendor ? "/vendor/dashboard" : redirectPath ?? "/");
    }, 1500);
  };

  const handleAfterSignInError = (message) => {
    setLoading(false);
    toast.error(message, { theme: "colored" });
  };

  const onSubmit = (data) => {
    setLoading(true);
    signIn({
      username: data.username,
      password: data.password,
      type: asVendor ? "vendor" : "customer",
    }).then(
      (res) =>
        handleAfterSignInResponse(
          res.data.signIn.user,
          res.data.signIn.token,
          res.data.signIn.message
        ),
      (error) => handleAfterSignInError(error.message)
    );
  };

  const onError = (errors) => console.log("Errors Occurred !! :", errors);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const { token_type, access_token } = codeResponse;
        const { email } = await getGoogleUserInfo(token_type, access_token);

        googleSignIn({
          username: email,
          type: asVendor ? "vendor" : "customer",
        }).then(
          (res) =>
            handleAfterSignInResponse(
              res.data.googleSignIn.user,
              res.data.googleSignIn.token,
              res.data.googleSignIn.message
            ),
          (error) => handleAfterSignInError(error.message)
        );
      } catch (error) {
        console.log("Error fetching user info:", error);
        toast.error(error?.response?.data?.error?.message, {
          theme: "colored",
        });
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <div className="sm:text-3xl font-bold text-xl text-colorPrimary flex items-center gap-2">
        <ArrowBackIcon
          onClick={() =>
            router.push({
              pathname: "/auth/user-type",
              query: { redirectPath: redirectPath },
            })
          }
          className="cursor-pointer !text-3xl"
        />
        <div className="">
          <h2 className="text-2xl sm:text-3xl font-bold  text-colorPrimary uppercase">
            <span className="sm:text-4xl text-[30px]">F</span>itmecool
          </h2>
        </div>
      </div>
      <div className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 text-colorPrimary">
        Login{" "}
        <span className="text-colorGreen">
          As {asVendor ? "Seller" : "Customer"}
        </span>
      </div>
      <button
        onClick={handleGoogleLogin}
        className="xl:text-lg sm:text-sm h-10 border border-black text-colorPrimary w-full rounded-xl mt-6 flex items-center justify-center gap-2 font-medium"
      >
        <FcGoogle />
        Continue to Google
      </button>
      <button className="xl:text-lg sm:text-sm h-10 border border-black text-colorPrimary w-full rounded-xl mt-2 flex items-center justify-center gap-2 font-medium">
        <FaFacebook className="text-sky-700" />
        Continue to Facebook
      </button>
      <p className="my-2 flex justify-center font-semibold text-colorPrimary">
        OR
      </p>
      <form onReset={reset}>
        <input
          type="text"
          placeholder="Email Address or Contact Number *"
          {...register("username", {
            required: "Username is required",
          })}
          className="rounded-xl p-3 border w-full my-2 focus:border focus:border-colorGreen focus:outline-none focus:placeholder:text-colorGreen xl:p-3 sm:p-2"
        />
        {errors.username && (
          <div className="mt-1 ml-1">
            <span style={{ color: "red" }}>{errors.username?.message}</span>
          </div>
        )}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password *"
            {...register("password", {
              required: "Password is required",
            })}
            className="rounded-xl p-3 border w-full my-2 focus:border focus:border-colorGreen focus:outline-none focus:placeholder:text-colorGreen xl:p-3 sm:p-2"
          />

          {showPassword ? (
            <VisibilityOutlinedIcon
              className="absolute top-5 right-5 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword((show) => !show)}
            />
          ) : (
            <VisibilityOffOutlinedIcon
              className="absolute top-5 right-5 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword((show) => !show)}
            />
          )}

          {errors.password && (
            <div className="mt-1 ml-1">
              <span style={{ color: "red" }}>{errors.password?.message}</span>
            </div>
          )}
        </div>
        <Link href="/auth/forgot-password">
          <p className="flex justify-end text-gray-400 hover:opacity-50 cursor-pointer">
            Forgot Password?
          </p>
        </Link>
      </form>
      <div className="sm:flex-grow"></div>
      <div className="w-full mt-5">
        <button
          type="submit"
          onClick={handleSubmit(onSubmit, onError)}
          className="h-14 flex items-center justify-center text-white w-full bg-colorPrimary rounded-xl text-xl max-[480px]:h-10 max-[480px]:text-sm"
        >
          {loading && (
            <CircularProgress
              size={20}
              color="primary"
              sx={{ color: "white", mr: 1 }}
            />
          )}
          Sign In
        </button>
        <p className="text-base max-[480px]:text-xs text-gray-400 mt-2 flex justify-center">
          Don&apos;t have an account?
          <span
            className="text-base max-[480px]:text-xs text-black font-semibold ml-2 cursor-pointer"
            onClick={() =>
              router.push({
                pathname: "/auth/signup",
                query: { redirectPath: redirectPath },
              })
            }
          >
            Sign Up
          </span>
        </p>
      </div>
    </>
  );
};

export default withoutAuthAndUserType(Login);
