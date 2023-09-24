import { TextField } from "@mui/material";
import React from "react";

const CustomSwitchComponent = ({ checked, onChange }) => {
  return (
    <>
      <div className="bg-black">
        <div className="switch-button">
          <input
            className="switch-button-checkbox"
            type="checkbox"
            checked={checked}
            onChange={onChange}
          ></input>
          <label className="switch-button-label" for="">
            <span className="switch-button-label-span">Product</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default CustomSwitchComponent;
