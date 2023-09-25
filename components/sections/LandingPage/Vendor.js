import Image from "next/image";
import React from "react";
import { assets } from "../../../constants";

const Vendor = () => {
  return (
    <div className="grid grid-cols-12 gap-3 sm:gap-8  py-3 sm:p-3 md:p-8 2xl:p-10 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-md">
      <div className="sm:col-start-3 col-span-4 sm:col-span-3">
        <div className="flex flex-col items-center gap-3 sm:gap-5 2xl:gap-5">
          <Image src={assets.storeImage3} alt="Store3" width={64} height={64} />
          <div className="text-center">
            <p className="text-[14px] sm:text-[18px]  md:text-[18px]  2xl:text-[24px]  text-[#181725] font-semibold">
              Create Your Own Shop
            </p>
            <p className="text-[12px] sm:text-[14px]  md:text-[15px]  2xl:text-[16px] text-[#31333e93]">
              Create your personalized experience by setting up your own shop
            </p>
          </div>
        </div>
      </div>
      <div className="col-span-4 sm:col-span-3">
        <div className="flex flex-col items-center gap-3 sm:gap-5 2xl:gap-5">
          <Image src={assets.storeImage4} alt="Store4" width={64} height={64} />
          <div className="text-center">
            <p className="text-[14px] sm:text-[18px]  md:text-[18px]  2xl:text-[24px]  text-[#181725] font-semibold">
              Upload Products
            </p>
            <p className="text-[12px] sm:text-[14px]  md:text-[15px]  2xl:text-[16px] text-[#31333e93]">
              Upload list of rental products
            </p>
          </div>
        </div>
      </div>
      <div className="col-span-4 sm:col-span-3 justify-center">
        <div className="flex flex-col items-center gap-3 sm:gap-5 2xl:gap-5">
          <Image src={assets.storeImage5} alt="Store5" width={64} height={64} />
          <div className="text-center">
            <p className="text-[14px] sm:text-[18px]  md:text-[18px]  2xl:text-[24px]  text-[#181725] font-semibold">
              Get Inquiries
            </p>
            <p className="text-[12px] sm:text-[14px]  md:text-[15px]  2xl:text-[16px] text-[#31333e93]">
              Wait patiently for inquires to arrive via whatsapp or phone calls
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vendor;
