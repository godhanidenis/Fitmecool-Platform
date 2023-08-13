import React, { useState, useEffect } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { SiHandshake } from "react-icons/si";
import Router from "next/router";

const UserType = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  const [selectedOption, setSelectedOption] = useState(
    typeof window !== "undefined" &&
      (localStorage.getItem("user_type_for_auth")
        ? localStorage.getItem("user_type_for_auth")
        : "customer")
  );
  const handleDivClick = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      Router.push(
        localStorage.getItem("user_type") ? "/vendor/dashboard" : "/"
      );
    }
  }, []);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="bg-background w-full">
      <div className="bg-white flex w-full min-h-[100vh] overflow-auto gap-10">
        <div className="md:w-[50%] sm:w-full flex flex-col p-10">
          <div onClick={() => Router.push("/")} className="cursor-pointer">
            <h2 className="text-3xl font-bold text-colorPrimary uppercase cursor-pointer">
              <span className="text-4xl">R</span>entbless
            </h2>
          </div>
          <div className="text-2xl font-semibold mt-8 max-[600px]:text-3xl text-colorPrimary">
            How you would like to join us ?
          </div>
          <p className="text-base mt-2 text-[#15182766] max-[600px]:text-sm font-semibold">
          Unlock Fashion Possibilities – Where Customers and Shop Owners Connect, on StyleSwap, Your Trusted Clothing Rental Platform!
          </p>
          <div className="flex my-8 gap-6 max-[380px]:flex-col">
            <div
              className={`py-2 px-4 w-[250px] h-[160px] max-[600px]:w-[200px] max-[600px]:h-[140px] cursor-pointer max-[480px]:w-[150px] max-[480px]:h-[120px] ${
                selectedOption === "customer" &&
                "border-2 border-colorGreen rounded-2xl"
              }`}
              onClick={() => handleDivClick("customer")}
            >
              <div className="flex justify-between">
                <GroupsIcon
                  className={`${
                    selectedOption === "customer"
                      ? "text-colorGreen"
                      : "text-colorPrimary"
                  }`}
                  fontSize="large"
                />

                {selectedOption === "customer" && (
                  <CheckCircleIcon className="text-colorGreen" />
                )}
              </div>
              <div className="font-semibold mt-8 text-xl text-colorPrimary max-[600px]:text-lg max-[480px]:text-sm max-[480px]:mt-5">
                Customer
              </div>
              <div className="text-sm text-[#15182766] my-1 max-[480px]:text-[10px]">
                Sign up As a Customer
              </div>
            </div>
            <div
              className={`py-2 px-4 w-[250px] h-[160px] max-[600px]:w-[200px] max-[600px]:h-[140px] cursor-pointer max-[480px]:w-[150px] max-[480px]:h-[120px] ${
                selectedOption === "vendor" &&
                "border-2 border-colorGreen rounded-2xl"
              }`}
              onClick={() => handleDivClick("vendor")}
            >
              <div className="flex justify-between">
                <SiHandshake
                  className={`${
                    selectedOption === "vendor"
                      ? "text-colorGreen"
                      : "text-colorPrimary"
                  }`}
                  fontSize="25px"
                />
                {selectedOption === "vendor" && (
                  <CheckCircleIcon className="text-colorGreen" />
                )}
              </div>
              <div className="font-semibold mt-10 text-xl text-colorPrimary max-[600px]:text-lg max-[480px]:text-sm  max-[480px]:mt-5">
                Business
              </div>
              <div className="text-sm text-[#15182766] my-1 max-[480px]:text-[10px]">
                Sign up As a Business
              </div>
            </div>
          </div>

          <div className="flex-grow"></div>

          <div className="w-full">
            <button
              className="h-14 text-white w-full bg-colorPrimary rounded-xl text-xl max-[480px]:h-10 max-[480px]:text-sm"
              onClick={() => {
                localStorage.setItem(
                  "user_type_for_auth",
                  selectedOption === "vendor" ? "vendor" : "customer"
                );

                Router.push("/auth/signup");
              }}
            >
              Create Account
            </button>
            <p className="text-base max-[480px]:text-xs text-[#15182766] mt-2 flex justify-center">
              Already have an account?
              <span
                className="text-base max-[480px]:text-xs text-black font-semibold ml-2 cursor-pointer"
                onClick={() => {
                  localStorage.setItem(
                    "user_type_for_auth",
                    selectedOption === "vendor" ? "vendor" : "customer"
                  );
                  Router.push("/auth/signin");
                }}
              >
                Login
              </span>
            </p>
          </div>
        </div>
        <div className="hidden md:block md:w-[50%] auth-cover"></div>
      </div>
    </div>
  );
};

export default UserType;
