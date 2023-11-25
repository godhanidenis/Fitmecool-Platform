import React, { useEffect, useState } from "react";
import { withoutAuth } from "../components/core/PrivateRouteForVendor";
import LandingPage from "../components/sections/LandingPage";
import SEO from "../components/SEO";
import { assets } from "../constants";

const Home = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const title = "Fitmecool";
  const description =
    "Choose Your Clothes For Rent/Buy Choose Your Outfit From Different Collection";
  const image = assets.whiteLogoSmall;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }
  return (
    <>
      <SEO title={title} description={description} image={image} />
      <LandingPage />;
    </>
  );
};

export default withoutAuth(Home);
