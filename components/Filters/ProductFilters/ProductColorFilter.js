import { useState } from "react";
import { capitalize, Checkbox, FormControl, FormGroup } from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";
import { useDispatch, useSelector } from "react-redux";
import { StyledFormLabelCheckBox } from "../../core/CustomMUIComponents";
import CommonSearchField from "../CommonSearchField";

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
  const [colorSearchValue, setColorSearchValue] = useState("");

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setProductPageSkip(0);
    dispatch(
      changeAppliedProductsFilters({
        key: "productColor",
        value: {
          selectedValue: checked
            ? [
                ...productsFiltersReducer.appliedProductsFilters.productColor
                  .selectedValue,
                value,
              ]
            : productsFiltersReducer.appliedProductsFilters.productColor.selectedValue.filter(
                (item) => item !== value
              ),
        },
      })
    );
  };

  return (
    <CardInteractive
      cardTitle="COLORS"
      bottomComponent={
        <>
          <FormControl fullWidth>
            <FormGroup>
              <CommonSearchField
                value={colorSearchValue}
                onChange={(e) => setColorSearchValue(e.target.value)}
              />
              {(colorSearchValue !== ""
                ? colorsList?.filter((i) =>
                    i.toLowerCase().includes(colorSearchValue.toLowerCase())
                  )
                : colorsList
              )?.map((item) => (
                <StyledFormLabelCheckBox
                  key={item}
                  value={item}
                  label={capitalize(item)}
                  control={
                    <Checkbox
                      checked={productsFiltersReducer.appliedProductsFilters.productColor.selectedValue.includes(
                        item
                      )}
                      onChange={handleCheckboxChange}
                    />
                  }
                />
              ))}
            </FormGroup>
          </FormControl>
        </>
      }
    />
  );
};

export default ProductColorFilter;
