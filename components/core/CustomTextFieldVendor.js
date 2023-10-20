import React from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PercentIcon from "@mui/icons-material/Percent";

const CustomTextFieldVendor = ({
  formValue,
  fieldValue,
  fieldError,
  price,
  discount,
  ...rest
}) => {
  return (
    <TextField
      fullWidth
      {...formValue}
      {...rest}
      variant="outlined"
      InputLabelProps={{
        shrink: !!fieldValue || fieldError,
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end">
              {price && <CurrencyRupeeIcon />}
              {discount && <PercentIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CustomTextFieldVendor;
