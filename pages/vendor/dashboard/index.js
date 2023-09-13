import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { withAuth } from "../../../components/core/PrivateRouteForVendor";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import BookIcon from "@mui/icons-material/Book";

const iconStyles = {
  fontSize: 24,
  "@media (max-width: 1024px)": {
    fontSize: 24,
  },
  "@media (max-width: 768px)": {
    fontSize: 20,
  },
  "@media (max-width: 648px)": {
    fontSize: 24,
  },
};

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

  const dashboardCards = [
    {
      label: "Total Products",
      totalNumber: totalProducts,
      icon: <ShoppingCartIcon sx={iconStyles} />,
    },
    {
      label: "Followers",
      totalNumber: vendorShopDetails?.shopFollowerCount,
      icon: <PersonIcon sx={iconStyles} />,
    },
    {
      label: "Reviews",
      totalNumber: vendorShopDetails?.shopReviewCount,
      icon: <BookIcon sx={iconStyles} />,
    },
  ];

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="min-h-screen font-Nova">
      <div className="flex sm:flex-row flex-col flex-wrap items-center lg:gap-8 gap-4 mt-8">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="cursor-pointer h-max w-[300px] flex items-center justify-between px-6 font-semibold text-black rounded-3xl bg-white"
          >
            <div className="py-7">
              <p className="text-base text-[#31333e8f] font-semibold pb-2">
                {card.label}
              </p>
              <p className="text-2xl text-[#151827] font-semibold">
                {card.totalNumber ?? 0}
              </p>
            </div>
            <span className="bg-[#F3F6F6]  rounded-full p-3">{card.icon}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(ShopDashboard);
