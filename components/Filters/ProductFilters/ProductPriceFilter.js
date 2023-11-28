import React from "react";
import CardInteractive from "../CardInteractive/CardInteractive";
import { FormControl, FormGroup, Radio, capitalize } from "@mui/material";
import { StyledFormLabelRadio } from "../../core/CustomMUIComponents";
import { useDispatch, useSelector } from "react-redux";
import { changeProductPage } from "../../../redux/ducks/product";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";
import { scrollToTitleName } from "../../../utils/common";
import { changeAppliedShopProductsFilters } from "../../../redux/ducks/shopProductsFilters";
import { changeShopProductPage } from "../../../redux/ducks/shopProduct";

const priceFilterData = [
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

const ProductPriceFilter = ({ productByShop }) => {
  const dispatch = useDispatch();
  const { appliedProductsFilters } = useSelector(
    (state) => state.productsFiltersReducer
  );
  const { appliedShopProductsFilters } = useSelector(
    (state) => state.shopProductsFiltersReducer
  );

  const handleCheckboxChange = (value) => {
    productByShop
      ? dispatch(changeShopProductPage(0))
      : dispatch(changeProductPage(0));

    const changeFiltersAction = productByShop
      ? changeAppliedShopProductsFilters
      : changeAppliedProductsFilters;

    dispatch(
      changeFiltersAction({
        key: "productPrice",
        value: {
          selectedValue: value,
        },
      })
    );

    scrollToTitleName();
  };

  const handleClearFilter = () => {
    const changeFiltersAction = productByShop
      ? changeAppliedShopProductsFilters
      : changeAppliedProductsFilters;

    dispatch(
      changeFiltersAction({
        key: "productPrice",
        value: {
          selectedValue: { min: 0, max: 0 },
        },
      })
    );

    scrollToTitleName();
  };

  const selectedFilter = productByShop
    ? appliedShopProductsFilters.productPrice.selectedValue
    : appliedProductsFilters.productPrice.selectedValue;

  return (
    <CardInteractive
      cardTitle="PRICES"
      bottomComponent={
        <>
          <FormControl fullWidth>
            <FormGroup>
              <div className="flex flex-col overflow-auto">
                {priceFilterData?.map((item, index) => (
                  <div
                    className="flex items-center justify-between"
                    key={index}
                  >
                    <StyledFormLabelRadio
                      value={item.value}
                      label={capitalize(item.label)}
                      className="line-clamp-1"
                      control={
                        <Radio
                          checked={
                            selectedFilter.min === item.value.min &&
                            selectedFilter.max === item.value.max
                          }
                          onChange={() => handleCheckboxChange(item.value)}
                        />
                      }
                    />
                    {selectedFilter.min === item.value.min &&
                      selectedFilter.max === item.value.max && (
                        <span
                          className="underline cursor-pointer text-colorGreen"
                          onClick={handleClearFilter}
                        >
                          Clear
                        </span>
                      )}
                  </div>
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
