import Link from "next/link";
import Image from "next/image";
import Logo from "../../assets/HeaderLogo.png";
import Button from "@mui/material/Button";
import backIcon from "../../assets/svg/backIcon.svg";
import Box from "@mui/material/Box";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { CustomTextField } from "../../components/core/CustomMUIComponents";
import CircularProgress from "@mui/material/CircularProgress";
import Router from "next/router";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Alert } from "@mui/material";
// import withAuth from './../../components/core/PrivateRoute';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alertMsg, setAlertMsg] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    getValues,
  } = useForm();
  const onSubmit = async (data) => {
    console.log("data", data);
    
  };
  const onError = (errors) => console.log("Errors Occurred !! :", errors);

  return (
    <div
      className="grid grid-cols-12 justify-center items-center"
      style={{ height: "100vh" }}
    >
      <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-4"></div>

      <div className="block p-4 rounded-lg shadow-lg bg-white text-center col-span-10 sm:col-span-8 md:col-span-8 lg:col-span-6 xl:col-span-4">
        <div className="grid grid-cols-3">
          <div className="text-start">
            <Link href="/">
              <button className="text-white  focus:ring-0 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center border">
                <Image src={backIcon ?? "" } alt="back" />
              </button>
            </Link>
          </div>
          <div className="col-span-2.5 flex items-center justify-center">
            {/* <Image src={Logo} alt="LoginImage" /> */}

            <h2 className="text-2xl font-normal uppercase cursor-pointer text-colorPrimary">
              <span className="text-4xl">W</span>edding
              <span className="text-4xl">B</span>ell
            </h2>
          </div>
        </div>

        <div className="p-6">
          <h1 className="text-gray-900 text-xl font-bold mb-2">
            Forgot Password
          </h1>
          {(invalid || success) && (
            <Alert severity={success ? "success" : "error"} className="mb-4">
              {alertMsg}
            </Alert>
          )}
          <p className="text-gray-700 text-base mb-4">
            Enter the email address you used when you joined and we’ll send you
            instructions to reset your password.
          </p>
          <p className="text-gray-700 text-base mb-4">
            For security reasons, we do NOT store your password. So rest assured
            that we will never send your password via email.
          </p>
          <form onSubmit={handleSubmit(onSubmit, onError)} onReset={reset}>
            <div className="flex  sm:block flex-col mb-6 ">
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <EmailIcon sx={{ mr: 2, my: 0.5 }} className="!text-black" />
                <CustomTextField
                  id="input-with-sx"
                  label="Email Address"
                  variant="standard"
                  className="w-full"
                  {...register("email", {
                    required: "Email is required",
                    onChange: (e) => {
                      setInvalid(false);
                      setSuccess(false);
                    },
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
              </Box>
              <div className="ml-9 mt-2 text-start">
                {errors.email && (
                  <span style={{ color: "red" }} className="-mb-6">
                    {errors.email?.message}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="bg-colorPrimary hover:bg-colorPrimary text-gray-100 p-3 w-full rounded-xl tracking-wide
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
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
// export default withAuth(ForgotPassword);
