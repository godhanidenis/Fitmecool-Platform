import React, { useState, useEffect } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { SiHandshake } from "react-icons/si";
import Router from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { withoutAuthForUserType } from "../../components/core/PrivateRouteForAuth";
import AuthCoverHero from "../../components/DirectoryHero/AuthCoverHero";

const UserType = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  const [selectedUserType, setSelectedUserType] = useState(
    typeof window !== "undefined" &&
      (localStorage.getItem("user_type_for_auth") ?? "customer")
  );

  const handleUserType = (option) => {
    setSelectedUserType(option);
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="bg-background w-full">
      <div className="bg-white flex w-full min-h-[100vh] overflow-auto gap-10">
        <div className="md:w-[50%] sm:w-full flex flex-col p-6 sm:p-10">
          <div className="sm:text-3xl font-bold text-xl text-colorPrimary flex items-center gap-2">
            <ArrowBackIcon
              onClick={() => Router.push("/")}
              className="cursor-pointer text-3xl"
            />
            <div className="">
              <h2 className="text-2xl sm:text-3xl font-bold  text-colorPrimary uppercase">
                <span className="sm:text-4xl text-[24px]">R</span>entbless
              </h2>
            </div>
          </div>
          <div className="text-2xl font-semibold mt-8 max-[600px]:text-3xl text-colorPrimary">
            How you would like to join us ?
          </div>
          <p className="text-xl mt-4 text-gray-400 max-[600px]:text-sm">
            Unlock Fashion Possibilities – Where Customers and Shop Owners
            Connect, on StyleSwap, Your Trusted Clothing Rental Platform!
          </p>
          <div className="flex my-8 gap-6 max-[380px]:flex-col">
            <div
              className={`py-2 px-4 w-[250px] h-[160px] max-[600px]:w-[200px] max-[600px]:h-[140px] cursor-pointer max-[480px]:w-[150px] max-[480px]:h-[120px] ${
                selectedUserType === "customer" &&
                "border-2 border-colorGreen rounded-2xl"
              }`}
              onClick={() => handleUserType("customer")}
            >
              <div className="flex justify-between">
                <GroupsIcon
                  className={`${
                    selectedUserType === "customer"
                      ? "text-colorGreen"
                      : "text-colorPrimary"
                  }`}
                  fontSize="large"
                />

                {selectedUserType === "customer" && (
                  <CheckCircleIcon className="text-colorGreen" />
                )}
              </div>
              <div className="font-semibold mt-8 text-xl text-colorPrimary max-[600px]:text-lg max-[480px]:text-sm max-[480px]:mt-5">
                Customer
              </div>
              <div className="text-sm text-[#15182766] my-1 max-[480px]:text-[10px]">
                Continue As a Customer
              </div>
            </div>
            <div
              className={`py-2 px-4 w-[250px] h-[160px] max-[600px]:w-[200px] max-[600px]:h-[140px] cursor-pointer max-[480px]:w-[150px] max-[480px]:h-[120px] ${
                selectedUserType === "vendor" &&
                "border-2 border-colorGreen rounded-2xl"
              }`}
              onClick={() => handleUserType("vendor")}
            >
              <div className="flex justify-between">
                <SiHandshake
                  className={`${
                    selectedUserType === "vendor"
                      ? "text-colorGreen"
                      : "text-colorPrimary"
                  }`}
                  fontSize="25px"
                />
                {selectedUserType === "vendor" && (
                  <CheckCircleIcon className="text-colorGreen" />
                )}
              </div>
              <div className="font-semibold mt-10 text-xl text-colorPrimary max-[600px]:text-lg max-[480px]:text-sm max-[480px]:mt-5">
                Vendor
              </div>
              <div className="text-sm text-[#15182766] my-1 max-[480px]:text-[10px]">
                Continue As a Vendor
              </div>
            </div>
          </div>

          <div className="flex-grow"></div>

          <div className="w-full">
            <button
              className="h-14 text-white w-full bg-colorPrimary rounded-xl text-xl max-[480px]:h-10 max-[480px]:text-sm capitalize"
              onClick={() => {
                localStorage.setItem("user_type_for_auth", selectedUserType);

                Router.push("/auth/signin");
              }}
            >
              continue as {selectedUserType}
            </button>
          </div>
        </div>
        <AuthCoverHero />
      </div>
    </div>
  );
};

export default withoutAuthForUserType(UserType);
