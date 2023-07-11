import { TextField, styled } from "@mui/material";
import React from "react";

const TimeCustomTextField = ({ type, id, label, value }) => {
  const CustomTextField = styled(TextField)(({ theme }) => ({
    "& .MuiInputBase-input": {
      color:
        value === "Closed" ? "red" : value === "Open 24 hours" ? "green" : "",
      fontWeight:
        value === "Closed" ? 600 : value === "Open 24 hours" ? 600 : "",
    },
    "& .MuiOutlinedInput-root": {
      // Custom styles for the TextField root
      //   borderRadius: '8px',
    },
  }));

  return (
    <>
      <CustomTextField
        type={type}
        id={id}
        fullWidth
        variant="outlined"
        label={label}
        value={value}
      />
    </>
  );
};

export default TimeCustomTextField;
