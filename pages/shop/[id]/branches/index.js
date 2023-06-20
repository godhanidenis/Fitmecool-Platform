import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShopLogo from "../../../../assets/login-cover.png";
import Image from "next/image";
import { getShopDetails } from "../../../../graphql/queries/shopQueries";
import SeeBranchDropDown from "../../../../components/Filters/CardInteractive/SeeBranchDropDown";
import { useRouter } from "next/router";
import { withoutAuth } from "../../../../components/core/PrivateRouteForVendor";

const Branches = ({ shopDetails, shopId }) => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  const BackToGo = () => {
    router.push(`/shop/${shopId}`);
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <div className="sm:mt-[97px] mt-[43px] sm:mx-[80px] font-Nova">
        <div className="flex items-center mb-[64px]">
          <div className="w-[44px] h-[39px] sm:mr-[30px]">
            <ArrowBackIcon
              onClick={() => BackToGo()}
              className="w-[44px] h-[39px] mr-[30px] cursor-pointer"
            />
          </div>
          <div className="w-[80px] sm:w-[166px] h-[80px] sm:h-[166px]">
            <Image
              className="rounded-[50%]"
              width={166}
              height={166}
              src={shopDetails?.data?.shop?.shop_logo}
              alt=""
            />
          </div>
          <div className="ml-[24px] flex flex-col">
            <span className="sm:text-[32px] text-[30px] font-semibold text-[#151827]">
              {shopDetails?.data?.shop?.shop_name}
            </span>
            <span className="text-[#878A99] text-[18px] sm:text-[24px] font-normal">
              {shopDetails?.data?.shop?.branch_info?.length} Branches
            </span>
          </div>
        </div>
        {shopDetails?.data?.shop?.branch_info?.map((item, index) => {
          return (
            <div className="sm:ml-[30px] mx-[10px]" key={index}>
              <SeeBranchDropDown
                cardTitle={`Branch ${index + 1}`}
                bottomComponent={
                  <div className="mb-[16px]">
                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 ml-[18px]">
                      <div
                        style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)" }}
                        className="flex flex-col bg-[#FFFFFF] rounded-2xl p-4"
                      >
                        <span className="text-[gray] text-[16px] font-semibold">
                          Branch Address
                        </span>
                        <span className="text-[#151827] text-[16px] font-semibold">
                          {item?.branch_address}
                        </span>
                      </div>
                      <div
                        style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)" }}
                        className="flex flex-col bg-[#FFFFFF] rounded-2xl p-4"
                      >
                        <span className="text-[gray] text-[16px] font-semibold">
                          Branch City
                        </span>
                        <span className="text-[#151827] text-[16px] font-semibold">
                          {item?.branch_city}
                        </span>
                      </div>
                      <div
                        style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)" }}
                        className="flex flex-col bg-[#FFFFFF] rounded-2xl p-4"
                      >
                        <span className="text-[gray] text-[16px] font-semibold">
                          Branch Pincode
                        </span>
                        <span className="text-[#151827] text-[16px] font-semibold">
                          {item?.branch_pinCode}
                        </span>
                      </div>
                      <div
                        style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)" }}
                        className="flex flex-col bg-[#FFFFFF] rounded-2xl p-4"
                      >
                        <span className="text-[gray] text-[16px] font-semibold">
                          Branch Manager Name
                        </span>
                        <span className="text-[#151827] text-[16px] font-semibold">
                          {item?.manager_name}
                        </span>
                      </div>
                      <div
                        style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)" }}
                        className="flex flex-col bg-[#FFFFFF] rounded-2xl p-4"
                      >
                        <span className="text-[gray] text-[16px] font-semibold">
                          Branch Manager Email
                        </span>
                        <span className="text-[#151827] text-[16px] font-semibold">
                          {item?.manager_email}
                        </span>
                      </div>
                      <div
                        style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)" }}
                        className="flex flex-col bg-[#FFFFFF] rounded-2xl p-4"
                      >
                        <span className="text-[gray] text-[16px] font-semibold">
                          Branch Manager Phone Number
                        </span>
                        <span className="text-[#151827] text-[16px] font-semibold">
                          {item?.manager_contact}
                        </span>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default withoutAuth(Branches);

export async function getServerSideProps(context) {
  try {
    const shopId = context.params.id;

    const shopDetails = await getShopDetails({ id: shopId });

    return { props: { shopDetails, shopId } };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
