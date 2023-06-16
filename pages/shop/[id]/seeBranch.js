import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShopLogo from "../../../assets/login-cover.png";
import Image from "next/image";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { useRouter } from "next/router";
import { getShopDetails } from "../../../graphql/queries/shopQueries";
import { useEffect } from "react";
import CardInteractive from "../../../components/Filters/CardInteractive/CardInteractive";

const seeBranch = () => {
  const router = useRouter();

  const [openDropDownMenu, setOpenDropDownMenu] = useState(false);
  const [openDropDownMenuIndex, setOpenDropDownMenuIndex] = useState(0);

  const [parsedData, setParsedData] = useState({});

  const HandleOpenMenu = (ID, index) => {
    setOpenDropDownMenu(!openDropDownMenu);
    setOpenDropDownMenuIndex(index);
  };

  const GetShopDetail = async () => {
    const shopId = router?.query?.id;
    const shopDetails = await getShopDetails({ id: shopId });
    setParsedData(shopDetails?.data?.shop);
  };

  useEffect(() => {
    if (router?.query?.id) {
      GetShopDetail();
    }
  }, [router]);

  const BackToGo = () => {
    router.push(`/shop/${router?.query?.id}`);
  };

  return (
    <>
      <div className="sm:mt-[97px] mt-[43px] sm:ml-[85px] font-Nova">
        <div className="flex items-center mb-[64px]">
          <div className="w-[44px] h-[39px]">
            <ArrowBackIcon onClick={() => BackToGo()} className="w-[44px] h-[39px] mr-[30px] cursor-pointer" />
          </div>
          <div className="w-[80px] sm:w-[166px] h-[80px] sm:h-[166px]">
            <Image className="rounded-[50%]" width={166} height={166} src={parsedData?.shop_logo} alt="" />
          </div>
          <div className="ml-[24px]">
            <p className="sm:text-[32px] text-[30px] font-semibold text-[#151827]">{parsedData?.shop_name}</p>
            <p className="text-[#878A99] text-[18px] sm:text-[24px] font-normal">
              {parsedData?.branch_info?.length} Branches
            </p>
          </div>
        </div>
        {parsedData?.branch_info?.map((item, index) => {
            return(
                <>
                <CardInteractive
        cardTitle="Branch"
        bottomComponent={
          <>
            <p>Hello</p>
          </>
        }
      />
                </>
            )
          {/* if (openDropDownMenuIndex === index) {
            return (
              <>
                <div className="mb-[72px]">
                  <div
                    className="flex items-center cursor-pointer  bg-[#F3F6F6] py-[24px] pl-[24px] rounded-[16px]"
                    onClick={() => HandleOpenMenu(item?.id, index)}
                  >
                    <KeyboardArrowUpIcon
                      className={`mr-[24px] transition-transform duration-300 ${openDropDownMenu ? "rotate-180" : ""}`}
                    />
                    <p className="text-[#151827] text-[16px] font-semibold">Branches {index + 1}</p>
                  </div>
                  {openDropDownMenu ? (
                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 ml-[50px]">
                      <div>
                        <p className="text-[gray] text-[16px] font-semibold">Branch Address</p>
                        <p className="text-[#151827] text-[16px] font-semibold">{item?.branch_address}</p>
                      </div>
                      <div>
                        <p className="text-[gray] text-[16px] font-semibold">Branch City</p>
                        <p className="text-[#151827] text-[16px] font-semibold">{item?.branch_city}</p>
                      </div>
                      <div>
                        <p className="text-[gray] text-[16px] font-semibold">Branch Pincode</p>
                        <p className="text-[#151827] text-[16px] font-semibold">{item?.branch_pinCode}</p>
                      </div>
                      <div>
                        <p className="text-[gray] text-[16px] font-semibold">Branch Manager Name</p>
                        <p className="text-[#151827] text-[16px] font-semibold">{item?.manager_name}</p>
                      </div>
                      <div>
                        <p className="text-[gray] text-[16px] font-semibold">Branch Manager Email</p>
                        <p className="text-[#151827] text-[16px] font-semibold">{item?.manager_email}</p>
                      </div>
                      <div>
                        <p className="text-[gray] text-[16px] font-semibold">Branch Manager Phone Number</p>
                        <p className="text-[#151827] text-[16px] font-semibold">{item?.manager_contact}</p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </>
            );
          } else {
            return (
              <>
                <div className="mb-[72px]">
                  <div
                    className="flex items-center cursor-pointer  bg-[#F3F6F6] py-[24px] pl-[24px] rounded-[16px]"
                    onClick={() => HandleOpenMenu(item?.id, index)}
                  >
                    <KeyboardArrowUpIcon
                      className={`mr-[24px] transition-transform duration-300 ${openDropDownMenu ? "" : "rotate-180"}`}
                    />
                    <p className="text-[#151827] text-[16px] font-semibold">Branches {index + 1}</p>
                  </div>
                  <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 ml-[50px]">
                    <div>
                      <p className="text-[gray] text-[16px] font-semibold">Branch Address</p>
                      <p className="text-[#151827] text-[16px] font-semibold">{item?.branch_address}</p>
                    </div>
                    <div>
                      <p className="text-[gray] text-[16px] font-semibold">Branch City</p>
                      <p className="text-[#151827] text-[16px] font-semibold">{item?.branch_city}</p>
                    </div>
                    <div>
                      <p className="text-[gray] text-[16px] font-semibold">Branch Pincode</p>
                      <p className="text-[#151827] text-[16px] font-semibold">{item?.branch_pinCode}</p>
                    </div>
                    <div>
                      <p className="text-[gray] text-[16px] font-semibold">Branch Manager Name</p>
                      <p className="text-[#151827] text-[16px] font-semibold">{item?.manager_name}</p>
                    </div>
                    <div>
                      <p className="text-[gray] text-[16px] font-semibold">Branch Manager Email</p>
                      <p className="text-[#151827] text-[16px] font-semibold">{item?.manager_email}</p>
                    </div>
                    <div>
                      <p className="text-[gray] text-[16px] font-semibold">Branch Manager Phone Number</p>
                      <p className="text-[#151827] text-[16px] font-semibold">{item?.manager_contact}</p>
                    </div>
                  </div>
                </div>
              </>
            );
          } */}
        })}
      </div>
    </>
  );
};

export default seeBranch;

// export async function getServerSideProps(context) {
//     try {
//       const shopId = context.params.id;

//       const shopDetails = await getShopDetails({ id: shopId });

//       return { props: { shopDetails } };
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   }
