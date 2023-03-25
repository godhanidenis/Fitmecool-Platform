import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { withAuth } from "../../../components/core/PrivateRouteForVendor";
import { getShopDetails } from "../../../graphql/queries/shopQueries";

const ShopDashboard = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const [shopData, setShopData] = useState({});
  const { userProfile } = useSelector((state) => state.userProfile);

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
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    var count = 0;
    shopData?.branch_info?.map((itm) =>
      setTotalProducts((count += itm.product_info?.length))
    );
  }, [shopData.branch_info]);

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
          <p>{shopData?.shopFollowerCount}</p>
        </div>
        <div className="cursor-pointer text-center w-40 py-5 font-semibold text-black rounded-xl flex flex-col items-center justify-center bg-white shadow-xl">
          <p>Reviews</p>
          <p>{shopData?.shopReviewCount}</p>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ShopDashboard);
