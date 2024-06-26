import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Image from "next/image";
import { getShopDetails } from "../../../../../graphql/queries/shopQueries";
import SeeBranchDropDown from "../../../../../components/Filters/CardInteractive/SeeBranchDropDown";
import { useRouter } from "next/router";
import { withoutAuth } from "../../../../../components/core/PrivateRouteForVendor";
import ImageLoadingSkeleton from "../../../../../components/Modal/ImageLoadingSkeleton";
import { Avatar, Box } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";

const Branches = ({ shopDetails, shopId }) => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLogoImage, setIsLogoImage] = useState(false);

  const shopDetailsData = shopDetails?.data?.shop;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  const shopSlug = shopDetailsData?.shop_name
    ?.toLowerCase()
    ?.replaceAll(" ", "-");

  return (
    <>
      <div className="container font-Nova">
        <div className="flex items-center mt-6 mb-6">
          <ArrowBackIcon
            onClick={() => router.push(`/shop/${shopSlug}/${shopId}`)}
            className="cursor-pointer"
          />
          <span className="font-semibold ml-2">Back To Shop</span>
        </div>
        <div className="bg-white shadow-xl rounded-lg pb-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center p-8 pt-6 bg-colorPrimary rounded-t-xl gap-[24px]">
            <Box
              className="flex justify-center relative"
              sx={{
                width: window.innerWidth >= 640 ? 130 : 110,
                height: window.innerWidth >= 640 ? 130 : 110,
              }}
            >
              <Image
                src={shopDetailsData?.shop_logo?.large ?? ""}
                alt="shop logo"
                layout="fixed"
                width={window.innerWidth >= 640 ? 130 : 110}
                height={window.innerWidth >= 640 ? 130 : 110}
                className="rounded-[50%] object-cover object-center"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => {
                  setIsLogoImage(true);
                }}
              />
              {!isImageLoaded && (
                <ImageLoadingSkeleton
                  validClassName={true}
                  variant="circular"
                  className={`!object-cover !absolute !top-0 ${
                    window.innerWidth >= 640
                      ? "!w-[130px] !h-[130px]"
                      : "!w-[110px] !h-[110px]"
                  }`}
                  sx={{
                    backgroundColor: "#ffffffb5",
                  }}
                />
              )}
              {isLogoImage && (
                <Avatar
                  className="!bg-colorGreen border-2 border-white"
                  sx={{
                    fontSize: "72px",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {/* {String(shopDetailsData?.shop_name)
                    ?.split(" ")[0][0]
                    .toUpperCase()} */}
                  <StorefrontIcon className="!text-[64px]" />
                </Avatar>
              )}
            </Box>
            <div className="flex flex-col items-center sm:items-start">
              <span className="sm:text-[32px] text-[30px] font-semibold text-white text-center">
                {shopDetailsData?.shop_name}
              </span>
              {/* <span className="text-white text-base font-normal text-center">
                {
                  "Let's be Effortlessly Cool: Embrace Your Signature Style with Us"
                }
              </span> */}
              <span className="text-colorGreen text-base sm:text-lg font-semibold">
                {shopDetailsData?.branch_info?.length} Branches
              </span>
            </div>
          </div>
          <div className="pt-8">
            {shopDetailsData?.branch_info?.map((item, index) => {
              return (
                <div className="mx-8" key={index}>
                  <SeeBranchDropDown
                    cardTitle={`Branch ${index + 1}`}
                    bottomComponent={
                      <div className="">
                        <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 m-[18px]">
                          <div
                            style={{
                              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)",
                            }}
                            className="flex flex-col bg-[#FFFFFF] rounded-xl p-4"
                          >
                            <span className="text-[gray] text-[16px] font-semibold">
                              Address
                            </span>
                            <span className="text-[#151827] text-[16px] font-semibold">
                              {item?.branch_address}
                            </span>
                          </div>
                          <div
                            style={{
                              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)",
                            }}
                            className="flex flex-col bg-[#FFFFFF] rounded-xl p-4"
                          >
                            <span className="text-[gray] text-[16px] font-semibold">
                              City
                            </span>
                            <span className="text-[#151827] text-[16px] font-semibold">
                              {item?.branch_city}
                            </span>
                          </div>
                          <div
                            style={{
                              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)",
                            }}
                            className="flex flex-col bg-[#FFFFFF] rounded-xl p-4"
                          >
                            <span className="text-[gray] text-[16px] font-semibold">
                              Pincode
                            </span>
                            <span className="text-[#151827] text-[16px] font-semibold">
                              {item?.branch_pinCode}
                            </span>
                          </div>
                          <div
                            style={{
                              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)",
                            }}
                            className="flex flex-col bg-[#FFFFFF] rounded-xl p-4"
                          >
                            <span className="text-[gray] text-[16px] font-semibold">
                              Manager Name
                            </span>
                            <span className="text-[#151827] text-[16px] font-semibold">
                              {item?.manager_name}
                            </span>
                          </div>
                          <div
                            style={{
                              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)",
                            }}
                            className="flex flex-col bg-[#FFFFFF] rounded-xl p-4"
                          >
                            <span className="text-[gray] text-[16px] font-semibold">
                              Manager Email
                            </span>
                            <span className="text-[#151827] text-[16px] font-semibold">
                              {item?.manager_email}
                            </span>
                          </div>
                          <div
                            style={{
                              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)",
                            }}
                            className="flex flex-col bg-[#FFFFFF] rounded-xl p-4"
                          >
                            <span className="text-[gray] text-[16px] font-semibold">
                              Manager Phone Number
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
        </div>
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
