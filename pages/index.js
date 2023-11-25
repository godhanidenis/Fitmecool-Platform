import React, { useEffect, useState } from "react";
import { withoutAuth } from "../components/core/PrivateRouteForVendor";
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

export default withoutAuth(Home);
