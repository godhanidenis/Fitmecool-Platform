import React, { useState } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { SiHandshake } from "react-icons/si";
import Router from "next/router";

const UserType = () => {
  const [selectedOption, setSelectedOption] = useState("Customer");
  const handleDivClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="bg-background py-2 w-full flex justify-center items-center h-screen">
      <div className="bg-white flex w-full p-10 gap-10 h-screen overflow-hidden">
        <div className="md:w-[50%] sm:w-full relative">
          <div className="text-3xl font-bold max-[600px]:text-xl text-colorPrimary">
            Rentbless
          </div>
          <div className="text-4xl font-semibold mt-8 max-[600px]:text-3xl text-colorPrimary">
            Join Over Business
          </div>
          <p className="text-xl mt-4 text-[#15182766] max-[600px]:text-sm font-semibold">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
          <div className="flex  my-8 gap-6 max-[380px]:flex-col">
            <div
              className={`py-2 px-4 w-[250px] h-[160px] max-[600px]:w-[200px] max-[600px]:h-[140px] cursor-pointer max-[480px]:w-[150px] max-[480px]:h-[120px] ${
                selectedOption === "Customer" &&
                "border-2 border-colorGreen rounded-2xl"
              }`}
              onClick={() => handleDivClick("Customer")}
            >
              <div className="flex justify-between">
                <GroupsIcon
                  className={`${
                    selectedOption === "Customer"
                      ? "text-colorGreen"
                      : "text-colorPrimary"
                  }`}
                  fontSize="large"
                />

                {selectedOption === "Customer" && (
                  <CheckCircleIcon className="text-colorGreen" />
                )}
              </div>
              <div className="font-semibold mt-8 text-xl text-colorPrimary max-[600px]:text-lg max-[480px]:text-sm max-[480px]:mt-5">
                Customer
              </div>
              <div className="text-sm text-[#15182766] my-1 max-[480px]:text-[10px]">
                Sign up As a Customer!
              </div>
            </div>
            <div
              className={`py-2 px-4 w-[250px] h-[160px] max-[600px]:w-[200px] max-[600px]:h-[140px] cursor-pointer max-[480px]:w-[150px] max-[480px]:h-[120px] ${
                selectedOption === "Business" &&
                "border-2 border-colorGreen rounded-2xl"
              }`}
              onClick={() => handleDivClick("Business")}
            >
              <div className="flex justify-between">
                <SiHandshake
                  className={`${
                    selectedOption === "Business"
                      ? "text-colorGreen"
                      : "text-colorPrimary"
                  }`}
                  fontSize="25px"
                />
                {selectedOption === "Business" && (
                  <CheckCircleIcon className="text-colorGreen" />
                )}
              </div>
              <div className="font-semibold mt-10 text-xl text-colorPrimary max-[600px]:text-lg max-[480px]:text-sm  max-[480px]:mt-5">
                Business
              </div>
              <div className="text-sm text-[#15182766] my-1 max-[480px]:text-[10px]">
                Sign up As a Business!
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 w-full">
            <button
              className=" h-14 text-white w-full bg-colorPrimary rounded-xl text-xl max-[480px]:h-10 max-[480px]:text-sm"
              onClick={() => {
                localStorage.setItem(
                  "user_type",
                  selectedOption === "Business" ? "vendor" : "customer"
                );

                Router.push("/auth/signup");
              }}
            >
              Create Account
            </button>
            <p className="text-base max-[480px]:text-xs text-[#15182766] mt-2 flex justify-center">
              Aleady have an account?
              <span
                className="text-base max-[480px]:text-xs text-black font-semibold ml-2 cursor-pointer"
                onClick={() => {
                  localStorage.setItem(
                    "user_type",
                    selectedOption === "Business" ? "vendor" : "customer"
                  );
                  Router.push("/auth/signin");
                }}
              >
                Login
              </span>
            </p>
          </div>
        </div>
        <div className="bg-neutral-300 md:w-[50%]  rounded-3xl sm:w-0"></div>
      </div>
    </div>
  );
};

export default UserType;
