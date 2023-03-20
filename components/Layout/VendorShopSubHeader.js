import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const VendorShopSubHeader = () => {
  const { userProfile } = useSelector((state) => state.userProfile);
  const [isTop, setIsTop] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const setActiveLink = (path) => {
    const withoutLastChunk = router.pathname.slice(
      0,
      router.pathname.lastIndexOf("/")
    );

    return router.pathname === path || withoutLastChunk === path
      ? "text-colorPrimary hover:text-colorPrimary"
      : "text-[#544E5D] hover:opacity-50";
  };
  return (
    <div
      className={`w-full ${
        isTop
          ? "sticky top-0 left-0  transition-all duration-500 transform origin-top"
          : ""
      }bg-[#F5F5F5] z-10 shadow-md`}
    >
      <div className="container flex items-center">
        <ul className="flex items-center gap-10 p-5">
          <li
            className={`${setActiveLink(
              "/vendor/dashboard"
            )} text-base xl:text-lg`}
          >
            <Link href="/vendor/dashboard">Dashboard</Link>
          </li>
          <li
            className={`${setActiveLink(
              "/vendor/shopEdit"
            )}  text-base xl:text-lg`}
          >
            <Link href={`/vendor/shopEdit/${userProfile.userCreatedShopId}`}>
              Shop
            </Link>
          </li>
          <li
            className={`${setActiveLink("/vendor/shop")} text-base xl:text-lg`}
          >
            <Link href={`/vendor/shop/${userProfile.userCreatedShopId}`}>
              Products
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VendorShopSubHeader;
