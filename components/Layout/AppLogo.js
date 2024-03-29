import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { assets } from "../../constants";

const AppLogo = ({ onHeader }) => {
  const { userProfile } = useSelector((state) => state.userProfile);

  return (
    <>
      <Link
        href={`${
          userProfile.user_type === "vendor" ? "/vendor/dashboard" : "/"
        }`}
      >
        <div
          className={
            onHeader
              ? "cursor-pointer hidden sm:visible sm:flex items-center"
              : "cursor-pointer flex items-center pt-3"
          }
        >
          <Image src={assets.appLogo} alt="AppLogo" width={160} height={32} />
        </div>
      </Link>
      {onHeader && (
        <Link
          href={`${
            userProfile.user_type === "vendor" ? "/vendor/dashboard" : "/"
          }`}
        >
          <div className="cursor-pointer sm:hidden flex items-center">
            <Image
              src={assets.whiteLogoSmall}
              alt="AppLogo"
              width={70}
              height={40}
            />
          </div>
        </Link>
      )}
    </>
  );
};

export default AppLogo;
