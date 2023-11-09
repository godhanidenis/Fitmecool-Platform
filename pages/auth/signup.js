import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Router, { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { googleSignUp, signUp } from "../../graphql/mutations/authMutations";
import {
  loadUserProfileStart,
  loginUserId,
} from "../../redux/ducks/userProfile";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGoogleLogin } from "@react-oauth/google";
import { getGoogleUserInfo } from "../../services/googleUserInfo";
import { withoutAuthAndUserType } from "../../components/core/PrivateRouteForAuth";

const Signup = () => {
  const [asVendor, setAsVendor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const { redirectPath } = router.query;

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
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    localStorage.getItem("user_type_for_auth") === "vendor"
      ? setAsVendor(true)
      : setAsVendor(false);
  }, []);

  const handleAfterSignUpResponse = (userId, token, message) => {
    setLoading(false);
    dispatch(loginUserId(userId));
    dispatch(loadUserProfileStart({ id: userId }));
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    toast.success(message, { theme: "colored" });
    localStorage.removeItem("user_type_for_auth");
    localStorage.setItem("user_type", asVendor ? "vendor" : "customer");
    setTimeout(() => {
      Router.push(asVendor ? "/vendor/dashboard" : redirectPath ?? "/");
    }, 1500);
  };

  const handleAfterSignUpError = (message) => {
    setLoading(false);
    toast.error(message, { theme: "colored" });
  };

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
      (res) =>
        handleAfterSignUpResponse(
          res.data.signUp.user,
          res.data.signUp.token,
          res.data.signUp.message
        ),
      (error) => handleAfterSignUpError(error.message)
    );
  };
  const onError = (errors) => console.log("Errors Occurred !! :", errors);

  const handleGoogleSignUp = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const { token_type, access_token } = codeResponse;
        const { given_name, family_name, email } = await getGoogleUserInfo(
          token_type,
          access_token
        );

        googleSignUp({
          first_name: given_name || "",
          last_name: family_name || "",
          user_type: asVendor ? "vendor" : "customer",
          user_email: email,
        }).then(
          (res) =>
            handleAfterSignUpResponse(
              res.data.googleSignUp.user,
              res.data.googleSignUp.token,
              res.data.googleSignUp.message
            ),
          (error) => handleAfterSignUpError(error.message)
        );
      } catch (error) {
        console.log("Error fetching user info:", error);
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
          className="cursor-pointer text-3xl"
        />
        <div className="">
          <h2 className="text-2xl sm:text-3xl font-bold  text-colorPrimary uppercase">
            <span className="sm:text-4xl text-[24px]">R</span>entbless
          </h2>
        </div>
      </div>
      <div className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 text-colorPrimary">
        Create an account{" "}
        <span className="text-colorGreen">
          As {asVendor ? "Vendor" : "Customer"}
        </span>
      </div>
      {/* <p className="sm:text-xl mt-2 text-gray-400 text-sm">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p> */}
      <button
        onClick={handleGoogleSignUp}
        className="xl:text-lg sm:text-sm h-10 border w-full border-black text-colorPrimary rounded-xl mt-6 flex items-center justify-center gap-2 font-medium"
      >
        <FcGoogle />
        Continue to Google
      </button>
      <button className="xl:text-lg sm:text-sm h-10 border w-full border-black text-colorPrimary rounded-xl mt-2 flex items-center justify-center gap-2 font-medium">
        <FaFacebook className="text-sky-700" />
        Continue to Facebook
      </button>
      <p className="my-2 flex justify-center font-semibold text-colorPrimary">
        OR
      </p>
      <form onReset={reset}>
        <div className="space-y-3 max-h-[400px] min-h-[200px] h-auto overflow-auto">
          <div className="flex flex-col sm:flex-row w-full gap-2">
            <div className="w-full">
              <input
                type="text"
                placeholder="First Name *"
                {...register("first_name", {
                  required: "First name is required",
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
                placeholder="Last Name *"
                {...register("last_name", {
                  required: "Last name is required",
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
            placeholder="Connect Mobile Number *"
            {...register("user_contact", {
              required: "Contact number is required",
              minLength: {
                value: 10,
                message: "Contact number must be 10 numbers",
              },
              maxLength: {
                value: 10,
                message: "Contact number must be 10 numbers",
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
                placeholder="Email Address *"
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
                placeholder="Password *"
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
                placeholder="Confirmed Password *"
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
      <div className="sm:flex-grow"></div>
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
            onClick={() =>
              router.push({
                pathname: "/auth/signin",
                query: { redirectPath: redirectPath },
              })
            }
          >
            Login
          </span>
        </p>
      </div>
    </>
  );
};

export default withoutAuthAndUserType(Signup);
