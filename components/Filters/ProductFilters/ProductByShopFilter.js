import React, { useEffect, useState } from "react";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useDispatch, useSelector } from "react-redux";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const ProductByShopFilter = ({ setProductPageSkip }) => {
  const { shopsLimit, shopsCount, numOfPages, shopsData, loading, error } =
    useSelector((state) => state.shops);

  const [selectShopName, setSelectedShopName] = useState([]);
  const [allShopLabel, setAllShopLabel] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  const [abc, setAbc] = useState(false);
  const dispatch = useDispatch();
  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );

  useEffect(() => {
    abc &&
      dispatch(
        changeAppliedProductsFilters({
          key: "shopId",
          value: {
            selectedValue: selectedData,
          },
        })
      );
  }, [abc, dispatch, selectedData]);

  useEffect(() => {
    productsFiltersReducer.appliedProductsFilters &&
      setSelectedShopName(
        productsFiltersReducer.appliedProductsFilters.shopId.selectedValue.map(
          (itm) => shopsData.find((i) => i.id === itm)?.shop_name
        )
      );
  }, [productsFiltersReducer.appliedProductsFilters, shopsData]);

  useEffect(() => {
    setAllShopLabel(shopsData?.map((itm) => itm.shop_name));
  }, [shopsData]);

  return (
    <CardInteractive
      cardTitle="Shops"
      bottomComponent={
        <>
          <Autocomplete
            multiple
            options={allShopLabel}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              setSelectedShopName(newValue);
              setProductPageSkip(0);
              setAbc(true);
              setSelectedData(
                newValue.map(
                  (itm) => shopsData.find((ele) => ele.shop_name === itm)?.id
                )
              );
            }}
            value={selectShopName}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Shops" size="small" placeholder="Shop Name" />
            )}
          />
        </>
      }
    />
  );
};

export default ProductByShopFilter;
