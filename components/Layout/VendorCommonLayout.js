import React, { useEffect, useState } from "react";
import Image from "next/image";
import VendorSidebar from "../sections/vendor-section/VendorSidebar";
import img1 from "../../assets/shopCoverImage.png";
import { useSelector } from "react-redux";
import { getShopDetails } from "../../graphql/queries/shopQueries";

const VendorCommonLayout = ({ children }) => {
  const { userProfile } = useSelector((state) => state.userProfile);

  const [shopData, setShopData] = useState({});

  const getShopDetailsData = async () => {
    const shopDetails = await getShopDetails({
      id: userProfile?.userCreatedShopId,
    });
    setShopData(shopDetails?.data?.shop);
  };

  useEffect(() => {
    if (userProfile?.userCreatedShopId) {
      getShopDetailsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.userCreatedShopId]);

  return (
    <div className="container grid grid-cols-4">
      <div className="col-span-1">
        <VendorSidebar shopData={shopData} />
      </div>
      <div className="col-span-3">
        <div className="w-full">
          <Image
            src={shopData?.shop_cover_image}
            alt="shop logo"
            width={1400}
            height={280}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default VendorCommonLayout;
