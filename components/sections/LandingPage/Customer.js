import Image from "next/image";
import React from "react";
import Store1 from "../../../assets/img/store 1.png";
import Store2 from "../../../assets/img/store 2.png";

const Customer = () => {
  return (
    <div className="grid grid-cols-12 gap-8 p-3 md:p-8 2xl:p-10 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-md">
      <div className="col-start-1 sm:col-start-2 lg:col-start-3 col-span-5 sm:col-span-5 lg:col-span-4">
        <div className="flex flex-col items-center gap-3 sm:gap-5 2xl:gap-5">
          <Image src={Store1} alt="Store 1" />
          <div className="text-center">
            <p className="text-[14px] sm:text-[18px]  md:text-[18px]  2xl:text-[24px]  text-[#181725] font-semibold">
              Choose Cloth For Rent
            </p>
            <p className="text-[12px] sm:text-[14px]  md:text-[15px]  2xl:text-[16px] text-[#31333e93]">
              Choose your rental outfit from different collection
            </p>
          </div>
        </div>
      </div>
      <div className="col-span-6 sm:col-span-5 lg:col-span-4">
        <div className="flex flex-col items-center gap-3 sm:gap-5 2xl:gap-5">
          <Image src={Store2} alt="Store 2" />
          <div className="text-center">
            <p className="text-[14px] sm:text-[18px]  md:text-[18px]  2xl:text-[24px] text-[#181725] font-semibold">
              Connect With Vendors
            </p>
            <p className="text-[12px] sm:text-[14px]  md:text-[15px]  2xl:text-[16px] text-[#31333e93]">
              After choosing your desired clothing reach out to the vendor
              directly through{" "}
              <span className="text-[#181725]">
                whatsapp or a direct phone call
              </span>{" "}
              to inquire about pricing, availibity and other T&C.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;
