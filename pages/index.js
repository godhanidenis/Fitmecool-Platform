import React, { useEffect, useState } from "react";
import { customerPublicGaurd } from "../components/core/CustomerAuthGaurd";
import LandingPage from "../components/sections/LandingPage";

const Home = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }
  return <LandingPage />;
};

export default customerPublicGaurd(Home);
