import React from "react";
import { assets } from "../../constants";

const AuthCoverHero = () => {
  return (
    <div
      className="hidden md:block md:w-[50%] bg-cover bg-repeat-round"
      style={{
        backgroundImage: `url(${assets.authCover})`,
      }}
    />
  );
};

export default AuthCoverHero;
