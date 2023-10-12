import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { assets } from "../../constants";

const AppLogo = () => {
  const { userProfile } = useSelector((state) => state.userProfile);

  return (
    <Link
      href={`${userProfile.user_type === "vendor" ? "/vendor/dashboard" : "/"}`}
    >
      <div className="cursor-pointer pt-[7px]">
        <Image src={assets.appLogo} alt="AppLogo" width={150} height={50} />
      </div>
    </Link>
  );
};

export default AppLogo;
