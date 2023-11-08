import React, { useEffect, useState } from "react";
import HomePage from "../../components/sections/HomePage";
import { withoutAuth } from "../../components/core/PrivateRouteForVendor";

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

export default withoutAuth(HomePagDetail);
