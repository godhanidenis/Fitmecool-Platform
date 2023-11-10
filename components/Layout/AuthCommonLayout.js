import React from "react";
import AuthCoverHero from "../DirectoryHero/AuthCoverHero";

const AuthCommonLayout = ({ children }) => {
  return (
    <div className="bg-background w-full">
      <div className="bg-white flex w-full sm:gap-10 min-h-[100vh] overflow-auto">
        <div className="md:w-[50%] w-full flex flex-col p-6 sm:p-10 justify-center sm:justify-start">
          {children}
        </div>
        <AuthCoverHero />
      </div>
    </div>
  );
};

export default AuthCommonLayout;
