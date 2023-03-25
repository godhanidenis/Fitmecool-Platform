import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { withAuth } from "../../../components/core/PrivateRouteForVendor";

const ShopDashboard = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    var count = 0;
    vendorShopDetails?.branch_info?.map((itm) =>
      setTotalProducts((count += itm.product_info?.length))
    );
  }, [vendorShopDetails.branch_info]);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="bg-[#f5f5f5] p-10">
      <div className="flex gap-8 flex-wrap">
        <div className="cursor-pointer text-center w-40 py-5 font-semibold text-black rounded-xl flex flex-col items-center justify-center bg-white shadow-xl">
          <p>Total Products</p>
          <p>{totalProducts}</p>
        </div>
        <div className="cursor-pointer text-center w-40 py-5 font-semibold text-black rounded-xl flex flex-col items-center justify-center bg-white shadow-xl">
          <p>Followers</p>
          <p>{vendorShopDetails?.shopFollowerCount}</p>
        </div>
        <div className="cursor-pointer text-center w-40 py-5 font-semibold text-black rounded-xl flex flex-col items-center justify-center bg-white shadow-xl">
          <p>Reviews</p>
          <p>{vendorShopDetails?.shopReviewCount}</p>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ShopDashboard);
