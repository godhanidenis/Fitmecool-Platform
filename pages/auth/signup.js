import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Router from "next/router";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { signUp } from "../../graphql/mutations/authMutations";
import { loginUserId } from "../../redux/ducks/userProfile";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Signup = () => {
  const [asVendor, setAsVendor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    getValues,
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
    signUp(
      asVendor
        ? {
            first_name: data.first_name,
            last_name: data.last_name,
            user_contact: data.user_contact,
            user_password: data.user_password,
            user_type: "vendor",
            user_email: data.user_email,
          }
        : {
            first_name: data.first_name,
            last_name: data.last_name,
            user_contact: data.user_contact,
            user_password: data.user_password,
            user_type: "customer",
          }
    ).then(
      (res) => {
        dispatch(loginUserId(res.data.signUp.user));
        localStorage.setItem("token", res.data.signUp.token);
        localStorage.setItem("userId", res.data.signUp.user);
        toast.success(res.data.signUp.message, { theme: "colored" });
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
          <div className="text-3xl  font-bold max-[600px]:text-xl text-colorPrimary flex items-center gap-4">
            <ArrowBackIcon
              onClick={() => Router.push("/auth/user-type")}
              className="cursor-pointer"
            />
            <div className="">
              <h2 className="text-3xl font-bold max-[600px]:text-xl text-colorPrimary uppercase">
                <span className="sm:text-4xl text-[24px]">R</span>entbless
              </h2>
            </div>
          </div>
          <div className="text-4xl font-semibold mt-8 max-[600px]:text-3xl text-colorPrimary">
            Create an account
          </div>
          <p className="text-xl mt-4 text-gray-400 max-[600px]:text-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
          <button className="xl:text-lg sm:text-sm h-10 border w-full border-black text-colorPrimary rounded-xl mt-6 flex items-center justify-center gap-2 font-medium">
            <FcGoogle />
            Continue to Google
          </button>{" "}
          <button className="xl:text-lg sm:text-sm h-10 border w-full  border-black text-colorPrimary rounded-xl mt-2 flex items-center justify-center gap-2 font-medium">
            <FaFacebook className="text-sky-700" />
            Continue to Facebook
          </button>
          <p className="my-2 flex justify-center font-semibold text-colorPrimary">
            Or
          </p>
          <form onReset={reset}>
            <div className="space-y-3 max-h-[400px] min-h-[200px] h-auto overflow-auto">
              <div className="flex flex-col sm:flex-row w-full gap-2">
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="First Name"
                    {...register("first_name", {
                      required: "FirstName is required",
                    })}
                    className="border focus:border-colorGreen focus:outline-none rounded-xl w-full focus:placeholder:text-colorGreen p-3"
                  />
                  {errors.first_name && (
                    <div className="mt-1 ml-1">
                      <span style={{ color: "red" }}>
                        {errors.first_name?.message}
                      </span>
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Last Name"
                    {...register("last_name", {
                      required: "LastName is required",
                    })}
                    className="border focus:border-colorGreen focus:outline-none rounded-xl w-full focus:placeholder:text-colorGreen p-3"
                  />
                  {errors.last_name && (
                    <div className="mt-1 ml-1">
                      <span style={{ color: "red" }}>
                        {errors.last_name?.message}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <input
                type="text"
                placeholder="Connect Mobile Number"
                {...register("user_contact", {
                  required: "Contact Number is required",
                  minLength: {
                    value: 10,
                    message: "Contact Number must be 10 numbers",
                  },
                  maxLength: {
                    value: 10,
                    message: "Contact Number must be 10 numbers",
                  },
                })}
                className="rounded-xl p-3 w-full border focus:border focus:border-colorGreen focus:outline-none focus:placeholder:text-colorGreen "
              />
              {errors.user_contact && (
                <div className="mt-1 ml-1">
                  <span style={{ color: "red" }}>
                    {errors.user_contact?.message}
                  </span>
                </div>
              )}
              {asVendor && (
                <>
                  <input
                    type="text"
                    placeholder="Email Address"
                    {...register("user_email", {
                      required: "Email is required",

                      pattern: {
                        value:
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Please enter a valid email",
                      },
                    })}
                    className="rounded-xl p-3 w-full border focus:border focus:border-colorGreen focus:outline-none focus:placeholder:text-colorGreen "
                  />

                  {errors.user_email && (
                    <div className="mt-1 ml-1">
                      <span style={{ color: "red" }}>
                        {errors.user_email?.message}
                      </span>
                    </div>
                  )}
                </>
              )}
              <div className="flex flex-col sm:flex-row  w-full gap-2">
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("user_password", {
                      required: "Password is required",
                    })}
                    className="rounded-xl p-3 w-full border  focus:border focus:border-colorGreen focus:outline-none focus:placeholder:text-colorGreen "
                  />

                  {showPassword ? (
                    <VisibilityOutlinedIcon
                      className="absolute top-4 right-5 text-gray-400 cursor-pointer"
                      onClick={() => setShowPassword((show) => !show)}
                    />
                  ) : (
                    <VisibilityOffOutlinedIcon
                      className="absolute top-4 right-5 text-gray-400 cursor-pointer"
                      onClick={() => setShowPassword((show) => !show)}
                    />
                  )}

                  {errors.user_password && (
                    <div className="mt-1 ml-1">
                      <span style={{ color: "red" }}>
                        {errors.user_password?.message}
                      </span>
                    </div>
                  )}
                </div>
                <div className="relative w-full">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmed Password"
                    {...register("confirm_password", {
                      validate: (value) => {
                        const { user_password } = getValues();
                        return (
                          user_password === value || "Passwords does not match!"
                        );
                      },
                    })}
                    className="rounded-xl p-3 w-full border  focus:border focus:border-colorGreen focus:outline-none focus:placeholder:text-colorGreen "
                  />
                  {showConfirmPassword ? (
                    <VisibilityOutlinedIcon
                      className="absolute top-4 right-5 text-gray-400 cursor-pointer"
                      onClick={() => setShowConfirmPassword((show) => !show)}
                    />
                  ) : (
                    <VisibilityOffOutlinedIcon
                      className="absolute top-4 right-5 text-gray-400 cursor-pointer"
                      onClick={() => setShowConfirmPassword((show) => !show)}
                    />
                  )}
                  {errors.confirm_password && (
                    <div className="mt-1 ml-1">
                      <span style={{ color: "red" }}>
                        {errors.confirm_password?.message}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
          <div className="flex-grow"></div>
          <div className="mt-5 w-full">
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
              Sign Up
            </button>
            <p className="text-base max-[480px]:text-xs text-gray-400  mt-2 flex justify-center">
              Already have an account?
              <span
                className="text-base max-[480px]:text-xs text-black font-semibold ml-2 cursor-pointer"
                onClick={() => Router.push("/auth/signin")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
        <div className="hidden md:block md:w-[50%] auth-cover rounded-3xl"></div>
      </div>
    </div>
  );
};

export default Signup;
