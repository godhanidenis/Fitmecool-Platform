import React from "react";
import CardInteractive from "../CardInteractive/CardInteractive";
import { FormControl, FormGroup, Radio, capitalize } from "@mui/material";
import { StyledFormLabelRadio } from "../../core/CustomMUIComponents";
import { useDispatch, useSelector } from "react-redux";
import { changeProductPage } from "../../../redux/ducks/product";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";

const priceFilterData = [
  {
    label: "Any Price",
    value: {
      min: 0,
      max: 0,
    },
  },
  {
    label: "Under ₹1000",
    value: {
      min: 0,
      max: 1000,
    },
  },
  {
    label: "₹1,001 - ₹5,000",
    value: {
      min: 1001,
      max: 5000,
    },
  },
  {
    label: "₹5,001 - ₹10,000",
    value: {
      min: 5001,
      max: 10000,
    },
  },
  {
    label: "₹10,001 - ₹20,000",
    value: {
      min: 10001,
      max: 20000,
    },
  },
  {
    label: "Over ₹20,000",
    value: {
      min: 20001,
      max: 0,
    },
  },
];

const ProductPriceFilter = () => {
  const dispatch = useDispatch();
  const { appliedProductsFilters } = useSelector(
    (state) => state.productsFiltersReducer
  );

  const handleCheckboxChange = (value) => {
    dispatch(changeProductPage(0));
    dispatch(
      changeAppliedProductsFilters({
        key: "productPrice",
        value: {
          selectedValue: value,
        },
      })
    );
  };

  return (
    <CardInteractive
      cardTitle="PRICES"
      bottomComponent={
        <>
          <FormControl fullWidth>
            <FormGroup>
              <div className={`flex flex-col overflow-auto`}>
                {priceFilterData?.map((item, index) => (
                  <StyledFormLabelRadio
                    key={index}
                    value={item.value}
                    label={capitalize(item.label)}
                    control={
                      <Radio
                        checked={
                          appliedProductsFilters.productPrice.selectedValue
                            .min === item.value.min &&
                          appliedProductsFilters.productPrice.selectedValue
                            .max === item.value.max
                        }
                        onChange={() => handleCheckboxChange(item.value)}
                      />
                    }
                  />
                ))}
              </div>
            </FormGroup>
          </FormControl>
        </>
      }
    />
  );
};

export default ProductPriceFilter;