import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { withAuth } from "../../../components/core/PrivateRouteForVendor";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import { GiNotebook } from "react-icons/gi";

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
    <div className="bg-white min-h-screen">
      <div className="flex sm:flex-row flex-col lg:gap-8 gap-4">
        <div className="cursor-pointer xl:h-[274px] lg:h-[200px] sm:h-[150px] h-[256px] sm:w-1/3 w-full lg:p-5 sm:p-2 p-5 font-semibold text-black rounded-3xl relative gap-2 flex flex-col bg-white">
          <p className="xl:text-2xl lg:text-lg sm:text-sm text-2xl font-semibold">
            Total Products
          </p>
          <p className="xl:text-3xl lg:text-xl sm:text-lg text-[32px] font-semibold">
            {totalProducts}
          </p>
          <span className="absolute bottom-6 right-6  rounded-full p-4">
            <ShoppingCartIcon
              sx={{
                fontSize: 40,
                "@media (max-width: 1024px)": {
                  fontSize: 24,
                },
                "@media (max-width: 768px)": {
                  fontSize: 20,
                },
                "@media (max-width: 648px)": {
                  fontSize: 40,
                },
              }}
            />
          </span>
        </div>
        <div className="cursor-pointer xl:h-[274px] lg:h-[200px] sm:h-[150px] h-[256px] sm:w-1/3 w-full lg:p-5 sm:p-2 p-5 font-semibold text-black rounded-3xl relative gap-2 flex flex-col bg-white">
          <p className="xl:text-2xl lg:text-lg sm:text-sm text-2xl font-semibold">
            Followers
          </p>
          <p className="xl:text-3xl lg:text-xl sm:text-lg text-[32px] font-semibold">
            {vendorShopDetails?.shopFollowerCount}
          </p>
          <span className="absolute bottom-6 right-6  rounded-full p-4">
            <PersonIcon
              sx={{
                fontSize: 40,
                "@media (max-width:1024px)": {
                  fontSize: 24,
                },
                "@media (max-width: 768px)": {
                  fontSize: 20,
                },
                "@media (max-width: 648px)": {
                  fontSize: 40,
                },
              }}
            />
          </span>
        </div>
        <div className="cursor-pointer xl:h-[274px] lg:h-[200px] sm:h-[150px] h-[256px] sm:w-1/3 w-full lg:p-5 sm:p-2 p-5 font-semibold text-black rounded-3xl relative gap-2 flex flex-col bg-white">
          <p className="xl:text-2xl lg:text-lg sm:text-sm text-2xl font-semibold">
            Reviews
          </p>
          <p className="xl:text-3xl lg:text-xl sm:text-lg text-[32px] font-semibold">
            {vendorShopDetails?.shopReviewCount}
          </p>
          <span className="absolute bottom-6 right-6  rounded-full p-4">
            <GiNotebook className="xl:text-[40px] lg:text-2xl sm:text-xl text-[40px]" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ShopDashboard);
