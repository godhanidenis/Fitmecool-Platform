import React from "react";
import { TextField, styled } from "@mui/material";

const TimeCustomTextField = ({ type, id, label, value }) => {
  const CustomTextField = styled(TextField)(({ theme }) => ({
    "& .MuiInputBase-input": {
      color:
        value === "Closed" ? "red" : value === "Open 24 hours" ? "green" : "",
    },
  }));

  return (
    <CustomTextField
      type={type}
      id={id}
      fullWidth
      variant="outlined"
      label={label}
      value={value}
    />
  );
};

export default TimeCustomTextField;
