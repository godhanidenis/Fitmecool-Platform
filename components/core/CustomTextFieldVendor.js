import { TextField } from "@mui/material";
import React from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PercentIcon from "@mui/icons-material/Percent";
import styled from "@emotion/styled";

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
  const CustomTextField = styled(TextField)(({ theme }) => ({
    [`& .MuiOutlinedInput-input`]: {
      width: `calc(100% - ${price || discount ? 50 : 0}px)`,
    },
  }));

  const renderIcon = (icon) => (
    <span
      style={{
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      {icon}
    </span>
  );

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <CustomTextField
        type={type}
        id={id}
        {...formValue}
        {...rest}
        variant="outlined"
        label={label}
        InputLabelProps={{
          shrink: !!fieldValue || fieldError,
        }}
        fullWidth
      />
      {price && renderIcon(<CurrencyRupeeIcon />)}
      {discount && renderIcon(<PercentIcon />)}
    </div>
  );
};

export default CustomTextFieldVendor;
