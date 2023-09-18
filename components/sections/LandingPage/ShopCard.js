import React from "react";
import IMG from "../../../assets/IMG.png";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import Image from "next/image";
import phone from "../../../assets/iPhone 12 View.png";

const ShopCard = () => {
  return (
    <div className="rounded-md shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] w-[296px] cursor-pointer">
      <div className="product-parent-div">
        <Image src={IMG} alt="IMG" objectFit="cover" className="w-full" />
      </div>
      <div className="w-[296px] ">
        <div className="flex -mt-12 justify-center">
          <Image
            src={phone}
            alt="IMG"
            objectFit="cover"
            width={90}
            height={90}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col gap-1 justify-center items-center p-5">
          <p className="text-[16px] text-[#151827] font-semibold">
            Fashion Bazar
          </p>
          <p className="text-[#878A99] text-[12px] font-light flex items-center">
            <LocationOnIcon className="!mr-1 !w-4" /> Yogi Chowk
          </p>
          <div className="flex justify-between gap-3">
            <p className="text-[#151827] text-[14px] flex items-center">
              <span className="rounded-full flex items-center">
                <PersonIcon className="!w-4" />
              </span>
              30K
            </p>
            <p className="text-[#151827] text-[14px] flex items-center">
              <StarIcon className="!text-yellow-400 !w-4" />
              4.0 <span className="text-[#15182766]">(10)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
