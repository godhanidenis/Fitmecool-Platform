import React, { useEffect, useState } from "react";
import { Autocomplete, capitalize, Checkbox, TextField } from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";
import { useDispatch, useSelector } from "react-redux";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const colorsList = [
  "red",
  "pink",
  "yellow",
  "wine",
  "purple",
  "blue",
  "orange",
  "green",
  "white",
  "black",
];

const ProductColorFilter = ({ setProductPageSkip }) => {
  const dispatch = useDispatch();
  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );

  return (
    <CardInteractive
      cardTitle="Colors"
      bottomComponent={
        <>
          <Autocomplete
            multiple
            options={colorsList}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              setProductPageSkip(0);
              dispatch(
                changeAppliedProductsFilters({
                  key: "productColor",
                  value: {
                    selectedValue: newValue,
                  },
                })
              );
            }}
            value={
              productsFiltersReducer.appliedProductsFilters.productColor
                .selectedValue
            }
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {capitalize(option)}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Colors" size="small" placeholder="color" />
            )}
          />
        </>
      }
    />
  );
};

export default ProductColorFilter;
