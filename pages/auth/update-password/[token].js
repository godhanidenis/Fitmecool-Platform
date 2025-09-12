import Link from "next/link";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import InputAdornment from "@mui/material/InputAdornment";
import { CustomTextField } from "../../../components/core/CustomMUIComponents";
import { useForm } from "react-hook-form";
import { Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { resetPassword } from "../../../graphql/mutations/authMutations";
import { authAuthGaurd } from "../../../components/core/AuthAuthGaurd";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Image from "next/image";
import { assets } from "../../../constants";

const UpdatePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alertMsg, setAlertMsg] = useState(false);

  const [isHydrated, setIsHydrated] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },

    reset,
    getValues,
  } = useForm();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    resetPassword({
      token: router.query.token,
      userInfo: { user_password: data.password },
    }).then(
      (res) => {
        setLoading(false);
        setAlertMsg(res?.data?.resetPassword);
        setSuccess(true);
      },
      (err) => {
        setLoading(false);
        setAlertMsg(err?.message);
        setInvalid(true);
      }
    );
  };
  const onError = (errors) => console.log("Errors Occurred !! :", errors);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="grid grid-cols-12 justify-center items-center h-screen">
      <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-4"></div>

      <div className="block p-4 rounded-lg shadow-lg bg-white text-center col-span-10 sm:col-span-8 md:col-span-8 lg:col-span-6 xl:col-span-4">
        <div className="grid grid-cols-3">
          <div className="col-span-3 flex items-center justify-center">
            <Link href="/">
              <div className="cursor-pointer flex items-center relative">
                <Image
                  src={assets.appBlackLogo}
                  alt="AppLogo"
                  width={160}
                  height={32}
                />
              </div>
            </Link>
          </div>
        </div>

        <div className="p-6">
          <h1 className="text-gray-900 text-xl font-bold mb-2">
            Update Password
          </h1>
          <p className="text-gray-700 text-sm mb-12">
            Experience the next level of security and peace of mind by renewing
            your password – your gateway to a safer and more empowered online
            journey awaits!
          </p>

          <form onSubmit={handleSubmit(onSubmit, onError)} onReset={reset}>
            {(invalid || success) && (
              <Alert
                severity={success ? "success" : "error"}
                className="mb-4 -mt-4"
              >
                {alertMsg}
                {success && (
                  <span
                    className="cursor-pointer text-[rgb(95, 33, 32)] ml-1 font-bold underline"
                    onClick={() => router.push("/auth/signin")}
                  >
                    Login
                  </span>
                )}
              </Alert>
            )}
            <div className="flex  sm:block flex-col mb-6 ">
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <LockIcon sx={{ mr: 2, my: 0.5 }} className="!text-black" />
                <CustomTextField
                  type={showPassword ? "text" : "password"}
                  id="input-with-sx"
                  label="Password"
                  variant="standard"
                  className="w-full"
                  {...register("password", {
                    required: "Password is required",
                    onChange: (e) => {
                      setInvalid(false);
                    },
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
              <div className="ml-9 mt-2 text-start">
                {errors.password && (
                  <span style={{ color: "red" }} className="-mb-6">
                    {errors.password?.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex  sm:block flex-col mb-6 ">
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <LockIcon sx={{ mr: 2, my: 0.5 }} className="!text-black" />
                <CustomTextField
                  type={showConfirmPassword ? "text" : "password"}
                  id="input-with-sx"
                  label="Confirm Password"
                  variant="standard"
                  className="w-full"
                  {...register("confirm_password", {
                    onChange: (e) => {
                      setInvalid(false);
                    },
                    validate: (value) => {
                      const { password } = getValues();
                      return password === value || "Passwords does not match!";
                    },
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="start"
                        className="cursor-pointer"
                        onClick={() => setShowConfirmPassword((show) => !show)}
                      >
                        {!showConfirmPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <RemoveRedEyeIcon />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <div className="ml-9 mt-2 text-start">
                {errors.confirm_password && (
                  <span style={{ color: "red" }}>
                    {errors.confirm_password?.message}
                  </span>
                )}{" "}
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
                Update
              </button>
            </div>
          </form>
          <div className="flex justify-center mt-4">
            Back To&nbsp;
            <Link href="/auth/signin">
              <span className="text-colorGreen font-semibold underline cursor-pointer">
                Login
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default authAuthGaurd(UpdatePassword);
