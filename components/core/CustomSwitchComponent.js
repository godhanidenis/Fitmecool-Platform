import React from "react";
import Image from "next/image";
import { assets } from "../../constants";

const CustomSwitchComponent = ({ checked, onChange }) => {
  return (
    <div className="flex justify-end items-center">
      <div className="flex items-center">
        <label className="flex items-center cursor-pointer">
          <input type="checkbox" className="hidden peer" onChange={onChange} />
          <span className="px-4 py-1 bg-colorGreen peer-checked:text-black peer-checked:bg-colorGrey text-white flex items-center">
            <Image
              src={assets?.cloth}
              alt="cloth"
              height={30}
              width={30}
              className={`${
                checked
                  ? "peer-checked:filter grayscale"
                  : "peer-checked:filter invert grayscale"
              }`}
            />
          </span>
          <span className="px-4 py-1 peer-checked:bg-colorGreen bg-colorGrey peer-checked:text-white text-black flex items-center">
            <Image
              src={assets?.store_Icon}
              alt="stor"
              height={30}
              width={30}
              className={`${
                checked
                  ? "peer-checked:filter invert grayscale"
                  : "peer-checked:filter  grayscale"
              }`}
            />
          </span>
        </label>
      </div>
    </div>
  );
};

export default CustomSwitchComponent;
