import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Image from "next/image";
import { getShopDetails } from "../../../../graphql/queries/shopQueries";
import SeeBranchDropDown from "../../../../components/Filters/CardInteractive/SeeBranchDropDown";
import { useRouter } from "next/router";
import { withoutAuth } from "../../../../components/core/PrivateRouteForVendor";
import ImageLoadingSkeleton from "../../../../components/Modal/ImageLoadingSkeleton";
import { Avatar } from "@mui/material";

const Branches = ({ shopDetails, shopId }) => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLogoImage, setIsLogoImage] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <div className="container font-Nova">
        <div className="flex items-center mt-6 mb-6">
          <ArrowBackIcon
            onClick={() => router.push(`/shop/${shopId}`)}
            className="cursor-pointer"
          />
          <span className="font-semibold ml-2">Back To Shop</span>
        </div>
        <div className="bg-white shadow-xl rounded-lg pb-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center p-8 pt-6 bg-colorPrimary rounded-t-xl gap-[24px]">
            <div className="flex justify-center relative w-[150px] h-[150px]">
              <Image
                src={shopDetails?.data?.shop?.shop_logo ?? ""}
                alt="shop logo"
                layout="fixed"
                width={150}
                height={150}
                className="rounded-[50%] object-cover object-center"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => {
                  setIsLogoImage(true);
                }}
              />
              {!isImageLoaded && (
                <ImageLoadingSkeleton
                  className="rounded-[50%] absolute"
                  variant="circular"
                  width="100%"
                  height="100%"
                  sx={{
                    backgroundColor: "dimgray",
                  }}
                />
              )}
              {isLogoImage && (
                <Avatar
                  className="!bg-colorGreen"
                  sx={{
                    fontSize: "72px",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {String(shopDetails?.data?.shop?.shop_name)
                    ?.split(" ")[0][0]
                    .toUpperCase()}
                  {/* {String(shopDetails?.data?.shop?.shop_name)?.split(" ")[0][0].toUpperCase() +
                      String(shopDetails?.data?.shop?.shop_name)?.split(" ")[1][0].toUpperCase()} */}
                </Avatar>
              )}
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="sm:text-[32px] text-[30px] font-semibold text-white text-center">
                {shopDetails?.data?.shop?.shop_name}
              </span>
              <span className="text-white text-base font-normal text-center">
                {
                  "Let's be Effortlessly Cool: Embrace Your Signature Style with Us"
                }
              </span>
              <span className="text-colorGreen text-base sm:text-lg font-semibold">
                {shopDetails?.data?.shop?.branch_info?.length} Branches
              </span>
            </div>
          </div>
          <div className="pt-8">
            {shopDetails?.data?.shop?.branch_info?.map((item, index) => {
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
