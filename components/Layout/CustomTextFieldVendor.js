import { TextField } from "@mui/material";
import React from "react";

const CustomTextFieldVendor = ({
  label,
  type,
  id,
  placeholder,
  isRequired,
  formValue,
  fieldValue,
  fieldError,
  ...rest
}) => {
  return (
    <>
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
        // size="small"
      />
    </>
  );
};

export default CustomTextFieldVendor;
