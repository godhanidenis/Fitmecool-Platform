import React, { useEffect, useState } from "react";
import HomePage from "../../components/sections/HomePage";
import { customerPublicGaurd } from "../../components/core/CustomerAuthGaurd";

const HomePagDetail = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }
  return <HomePage />;
};

export default customerPublicGaurd(HomePagDetail);
