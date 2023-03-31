import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginLogo from "../../../assets/LoginLogo.svg";
import googleIcon from "../../../assets/googleIcon.svg";
import fbIcon from "../../../assets/fbIcon.svg";
import Box from "@mui/material/Box";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import InputAdornment from "@mui/material/InputAdornment";
import { CustomTextField } from "../../core/CustomMUIComponents";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { AuthTypeModal } from "../../core/Enum";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { signIn } from "../../../graphql/mutations/authMutations";
import { loginUserId } from "../../../redux/ducks/userProfile";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import { useResizeScreenLayout } from "../../core/useScreenResize";

export default function SignIn({ changeAuthModalType, handleClose }) {
  const [asVendor, setAsVendor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { themeLayout } = useSelector((state) => state.themeLayout);

  const isScreenWide = useResizeScreenLayout();

  useEffect(() => {
    if (
      themeLayout === "webScreen" &&
      isScreenWide &&
      Router.pathname === "/auth/signin"
    ) {
      window.history.pushState(AuthTypeModal.Signin, "", "/"), Router.push("/");
    }
  }, [isScreenWide, themeLayout]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    setLoading(true);
    signIn({
      username: data.username,
      password: data.password,
      type: asVendor ? "vendor" : "customer",
    }).then(
      (res) => {
        dispatch(loginUserId(res.data.signIn.user));
        localStorage.setItem("token", res.data.signIn.token);
        localStorage.setItem("userId", res.data.signIn.user);
        toast.success(res.data.signIn.message, { theme: "colored" });
        localStorage.setItem("user_type", asVendor ? "vendor" : "customer");
        themeLayout === "webScreen" && handleClose();
        asVendor && Router.push("/vendor/dashboard");
      },
      (error) => {
        setLoading(false);
        toast.error(error.message, { theme: "colored" });
      }
    );
  };

  const onError = (errors) => console.log("Errors Occurred !! :", errors);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
        <div className="p-4 hidden lg:block h-full">
          <div className="auth-cover !bg-cover w-full h-full text-center">
            {/* <Image src={LoginLogo} alt="CoverImage" /> */}
          </div>
        </div>
        <div className="p-4 mt-3 lg:mt-0 ml-0 lg:ml-4 md:ml-4">
          {themeLayout === "webScreen" && (
            <div className="flex">
              <CloseIcon
                className="!text-black !ml-auto !cursor-pointer"
                onClick={handleClose}
              />
            </div>
          )}
          <label className="inline-flex border-2 cursor-pointer dark:bg-white-300 dark:text-white-800">
            <input
              id="Toggle4"
              type="checkbox"
              className="hidden peer"
              onChange={(e) => {
                setAsVendor(e.target.checked);
              }}
            />
            <span className="px-4 py-1 bg-colorPrimary peer-checked:text-black peer-checked:bg-white text-white">
              Customer
            </span>
            <span className="px-4 py-1 dark:bg-white-300 peer-checked:bg-colorPrimary peer-checked:text-white ">
              Business
            </span>
          </label>
          <h3 className="pb-2 mt-3 lg:mt-4 font-semibold text-xl lg:text-2xl text-colorPrimary flex justify-center lg:block">
            {asVendor ? "Login As a Vendor!" : "Login to your account!"}
          </h3>

          <div className="mt-4 lg:mt-5">
            <form onSubmit={handleSubmit(onSubmit, onError)} onReset={reset}>
              <div className="flex flex-col">
                <div className="flex lg:block justify-center">
                  <div className="flex lg:block flex-col mb-9 w-[90%] md:w-5/6 lg:w-3/4">
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <EmailIcon
                        sx={{ mr: 2, my: 0.5 }}
                        className="!text-black"
                      />
                      <CustomTextField
                        id="input-with-sx"
                        label={
                          asVendor
                            ? "Email Address or Contact Number"
                            : "Contact Number"
                        }
                        variant="standard"
                        className="w-full"
                        {...register("username", {
                          required: "Username is required",
                        })}
                      />
                    </Box>
                    <div className="mt-2 ml-9">
                      {errors.username && (
                        <span style={{ color: "red" }} className="-mb-9">
                          {errors.username?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex lg:block justify-center">
                  <div className="flex lg:block flex-col mb-3 lg:mb-3 w-[90%] md:w-5/6 lg:w-3/4">
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <LockIcon
                        sx={{ mr: 2, my: 0.5 }}
                        className="!text-black"
                      />
                      <CustomTextField
                        type={showPassword ? "text" : "password"}
                        id="input-with-sx"
                        label="Password"
                        variant="standard"
                        className="w-full"
                        {...register("password", {
                          required: "Password is required",
                        })}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment
                              position="start"
                              className="cursor-pointer"
                              onClick={() => setShowPassword((show) => !show)}
                            >
                              {!showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <RemoveRedEyeIcon />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <div className="mt-2 ml-9">
                      {errors.password && (
                        <span style={{ color: "red" }} className="-mb-9">
                          {errors.password?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center lg:block">
                  <div className="flex justify-end mb-9 lg:mb-9 w-[90%] md:w-5/6 lg:w-3/4">
                    <Link href="/auth/forgot-password">
                      <span
                        className="text-[#544E5D] ml-auto opacity-50 cursor-pointer"
                        onClick={() =>
                          themeLayout === "webScreen" && handleClose()
                        }
                      >
                        Forgot Password?
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="flex justify-center lg:block">
                  <button
                    type="submit"
                    className="bg-colorPrimary hover:bg-colorPrimary text-gray-100 p-4 w-[90%] md:w-5/6 lg:w-3/4 rounded-xl tracking-wide
                  font-semibold font-display focus:outline-none focus:shadow-outline 
                  shadow-lg flex items-center justify-center"
                  >
                    {loading && (
                      <CircularProgress
                        size={20}
                        color="primary"
                        sx={{ color: "white", mr: 1 }}
                      />
                    )}
                    Login to Continue
                  </button>
                </div>
              </div>
            </form>
            <div className="flex justify-center lg:block">
              <div className="mt-6 lg:mt-12 gap-6 justify-between items-center flex-row  w-[90%] md:w-5/6 lg:w-3/4 block xl:flex">
                <button className="pt-3 pb-3 social-icon pr-2 pl-2  w-full focus:ring-0 focus:outline-none font-medium rounded-xl text-lg text-center inline-flex items-center justify-center border">
                  <div className="flex justify-center items-center mr-3">
                    <Image
                      src={googleIcon}
                      alt="back"
                      width={20}
                      height={20}
                      layout="fixed"
                    />
                  </div>
                  <span className="text-black whitespace-nowrap">
                    Login with Google
                  </span>
                </button>

                <button className="pt-3 pb-3 pr-2 pl-2  social-icon w-full focus:ring-0 focus:outline-none font-medium rounded-xl text-lg text-center inline-flex items-center justify-center border mt-4 xl:mt-0">
                  <div className="flex justify-center items-center mr-3">
                    <Image
                      src={fbIcon}
                      alt="back"
                      width={20}
                      height={20}
                      layout="fixed"
                    />
                  </div>
                  <span className="text-black whitespace-nowrap">
                    Login with Facebook
                  </span>
                </button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-between items-center mb-9 w-full md:w-5/6 lg:w-3/4 mt-6 lg:mt-8 text-center">
              <div
                style={{ marginTop: "12px", marginBottom: "32px" }}
                className="ml-0 lg:ml-auto"
              >
                <span className="text-black">{`Don't`} have an account ?</span>
                <span
                  className="cursor-pointer text-colorPrimary ml-1 font-bold"
                  onClick={() => {
                    themeLayout === "webScreen" &&
                      changeAuthModalType(AuthTypeModal.Signup);
                    themeLayout === "mobileScreen" &&
                      Router.push("/auth/signup");
                  }}
                >
                  Sign up
                </span>
              </div>
            </div>

            {/* <div className="border-2 border-dashed rounded py-2 px-1 flex justify-center items-center mb-9 w-full md:w-5/6 lg:w-3/4 mt-4 lg:mt-5 text-center">
              <span className="text-black">
                {asVendor ? "Are you a customer ?" : "Are you a vendor ?"}
              </span>
              <button
                className="cursor-pointer text-colorWhite bg-colorPrimary py-2 px-3 rounded ml-2"
                onClick={(e) => setAsVendor(!asVendor)}
              >
                {asVendor ? "Customer" : "Business"} Sign In
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
