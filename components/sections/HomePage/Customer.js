import Image from "next/image";
import React from "react";
import Store1 from "../../../assets/store 1.png";
import Store2 from "../../../assets/store 2.png";

const Customer = () => {
  return (
    <div className="p-10 pb-16 flex flex-col sm:flex-row lg:flex-row md:flex-row xl:flex-row 2xl:flex-row items-center justify-center gap-20 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-md">
      <div className="flex flex-col items-center gap-5 w-[60%] sm:w-[60%] lg:w-[40%] md:w-[20%] xl:w-[20%]">
        <Image src={Store1} alt="Store 1" />
        <div className="text-center">
          <p className="text-[24px] text-[#181725] font-semibold">
            Choose Cloth For Rent
          </p>
          <p className="text-[16px] text-[#31333e93] font-semibold">
            Choose your rental outfit from different collection
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-5 w-[80%] sm:w-[80%] lg:w-[60%] md:w-[30%] xl:w-[30%]">
        <Image src={Store2} alt="Store 2" />
        <div className="text-center">
          <p className="text-[24px] text-[#181725] font-semibold">
            Connect With Vendors
          </p>
          <p className="text-[16px] text-[#31333e93] font-semibold">
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
  );
};

export default Customer;
