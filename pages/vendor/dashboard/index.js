import React, { useEffect, useState } from "react";
import { withAuth } from "../../../components/core/PrivateRouteForVendor";
import VendorShopSubHeader from "../../../components/Layout/VendorShopSubHeader";

const ShopDashboard = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <VendorShopSubHeader />
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
      <p>bbiub</p>
    </>
  );
};

export default withAuth(ShopDashboard);
