import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Router from "next/router";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { signIn } from "../../graphql/mutations/authMutations";
import { toast } from "react-toastify";
import { loginUserId } from "../../redux/ducks/userProfile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [asVendor, setAsVendor] = useState(false);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (localStorage.getItem("user_type_for_auth") === "vendor") {
      setAsVendor(true);
    } else {
      setAsVendor(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      Router.push(
        localStorage.getItem("user_type") ? "/vendor/dashboard" : "/"
      );
    }
  }, []);

  const onSubmit = (data) => {
    setLoading(true);
    signIn({
      username: data.username,
      password: data.password,
      type: asVendor ? "vendor" : "customer",
    }).then(
      (res) => {
        setLoading(false);
        dispatch(loginUserId(res.data.signIn.user));
        localStorage.setItem("token", res.data.signIn.token);
        localStorage.setItem("userId", res.data.signIn.user);
        toast.success(res.data.signIn.message, { theme: "colored" });
        localStorage.removeItem("user_type_for_auth");
        localStorage.setItem("user_type", asVendor ? "vendor" : "customer");
        Router.push(asVendor ? "/vendor/dashboard" : "/");
      },
      (error) => {
        setLoading(false);
        toast.error(error.message, { theme: "colored" });
      }
    );
  };

  const onError = (errors) => console.log("Errors Occurred !! :", errors);

  return (
    <div className="bg-background w-full">
      <div className="bg-white flex w-full p-5 sm:p-10 sm:gap-10 min-h-[100vh] overflow-auto">
        <div className="md:w-[50%] sm:w-full flex flex-col">
          <div className="text-3xl font-bold max-[600px]:text-xl text-colorPrimary flex items-center gap-4">
            <ArrowBackIcon
              onClick={() => Router.push("/auth/user-type")}
              className="cursor-pointer"
            />
            Rentbless
          </div>
          <div className="text-4xl font-semibold mt-8 max-[600px]:text-3xl text-colorPrimary">
            Login As a Customer!
          </div>
          <p className="text-xl mt-4 text-gray-400 max-[600px]:text-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
          <button className="xl:text-lg sm:text-sm h-10 border border-black text-colorPrimary w-full rounded-xl mt-6 flex items-center justify-center gap-2 font-medium">
            <FcGoogle />
            Continue to Google
          </button>{" "}
          <button className="xl:text-lg sm:text-sm h-10 border border-black text-colorPrimary w-full rounded-xl mt-2 flex items-center justify-center gap-2 font-medium">
            <FaFacebook className="text-sky-700" />
            Continue to Facebook
          </button>
          <p className="my-2 flex justify-center font-semibold text-colorPrimary">
            Or
          </p>
          <form onReset={reset}>
            <input
              type="text"
              placeholder={
                asVendor ? "Email Address or Contact Number" : "Contact Number"
              }
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
                placeholder="Password"
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
                  <span style={{ color: "red" }}>
                    {errors.password?.message}
                  </span>
                </div>
              )}
            </div>
            <Link href="/auth/forgot-password">
              <p className="flex justify-end text-gray-400 cursor-pointer">
                Forgot Password?
              </p>
            </Link>
          </form>
          <div className="flex-grow"></div>
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
              )}{" "}
              Sign In
            </button>
            <p className="text-base max-[480px]:text-xs text-gray-400 mt-2 flex justify-center">
              Don&apos;t have an account?
              <span
                className="text-base max-[480px]:text-xs text-black font-semibold ml-2 cursor-pointer"
                onClick={() => Router.push("/auth/signup")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
        <div className="hidden md:block md:w-[50%] auth-cover rounded-3xl"></div>
      </div>
    </div>
  );
};

export default Login;
