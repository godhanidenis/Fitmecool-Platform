import { TextField } from "@mui/material";
import React from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PercentIcon from "@mui/icons-material/Percent";

const CustomTextFieldVendor = ({
  label,
  type,
  id,
  placeholder,
  isRequired,
  formValue,
  fieldValue,
  fieldError,
  price,
  discount,
  ...rest
}) => {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <TextField
        type={type}
        id={id}
        fullWidth
        {...formValue}
        {...rest}
        variant="outlined"
        label={label}
        InputLabelProps={{
          shrink: !!fieldValue || fieldError,
        }}
      />
      {price && (
        <span
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <CurrencyRupeeIcon />
        </span>
      )}
      {discount && (
        <span
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <PercentIcon />
        </span>
      )}
    </div>
  );
};

export default CustomTextFieldVendor;
