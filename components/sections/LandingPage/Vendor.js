import Image from "next/image";
import React from "react";
import Store1 from "../../../assets/store 3.png";
import Store2 from "../../../assets/store 4.png";
import Store3 from "../../../assets/store 5.png";

const Vendor = () => {
  return (
    <div className="p-3 md:p-8 2xl:p-10 pb-5 md:pb-16 2xl:pb-16 flex flex-col sm:flex-row lg:flex-row md:flex-row xl:flex-row 2xl:flex-row items-start  justify-center gap-5 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 2xl:gap-20 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-md">
      <div className="flex flex-col items-center gap-3 sm:gap-5 2xl:gap-5 w-full md:w-[50%] xl:w-[20%]">
        <Image src={Store1} alt="Store 1" />
        <div className="text-center">
          <p className="text-[13px] sm:text-[18px]  md:text-[18px]  2xl:text-[24px]  text-[#181725] font-semibold">
            Create Your Own Shop
          </p>
          <p className="text-[10px] sm:text-[14px]  md:text-[15px]  2xl:text-[16px] text-[#31333e93] font-semibold">
            Create your personalized experience by setting up your own shop
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3 sm:gap-5 2xl:gap-5 w-full md:w-[50%] xl:w-[30%]">
        <Image src={Store2} alt="Store 2" />
        <div className="text-center">
          <p className="text-[13px] sm:text-[18px]  md:text-[18px]  2xl:text-[24px]  text-[#181725] font-semibold">
            Upload Products
          </p>
          <p className="text-[10px] sm:text-[14px]  md:text-[15px]  2xl:text-[16px] text-[#31333e93] font-semibold">
            Upload list of rental products
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3 sm:gap-5 2xl:gap-5 w-full md:w-[50%] xl:w-[20%]">
        <Image src={Store3} alt="Store 3" />
        <div className="text-center">
          <p className="text-[13px] sm:text-[18px]  md:text-[18px]  2xl:text-[24px]  text-[#181725] font-semibold">
            Get Inquiries
          </p>
          <p className="text-[10px] sm:text-[14px]  md:text-[15px]  2xl:text-[16px] text-[#31333e93] font-semibold">
            Wait patiently for inquires to arrive via whatsapp or phone calls
          </p>
        </div>
      </div>
    </div>
  );
};

export default Vendor;
