import {
  capitalize,
  Divider,
  FormControl,
  FormGroup,
  Radio,
} from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";
import { useDispatch, useSelector } from "react-redux";
import { StyledFormLabelRadio } from "../../core/CustomMUIComponents";
import { changeProductPage } from "../../../redux/ducks/product";

const productListingTypeFilterData = [
  {
    label: "Rent",
    value: "rent",
  },
  {
    label: "Sell",
    value: "sell",
  },
];

const ProductTypeFilter = () => {
  const dispatch = useDispatch();
  const { appliedProductsFilters } = useSelector(
    (state) => state.productsFiltersReducer
  );

  const handleCheckboxChange = (value) => {
    dispatch(changeProductPage(0));
    dispatch(
      changeAppliedProductsFilters({
        key: "productListingType",
        value: {
          selectedValue: value,
        },
      })
    );
  };

  return (
    <>
      <CardInteractive
        cardTitle="TYPES"
        bottomComponent={
          <>
            <FormControl fullWidth>
              <FormGroup>
                <div className="flex flex-col overflow-auto">
                  {productListingTypeFilterData?.map((item, index) => (
                    <div
                      className="flex items-center justify-between"
                      key={index}
                    >
                      <StyledFormLabelRadio
                        value={item.value}
                        label={capitalize(item.label)}
                        control={
                          <Radio
                            checked={
                              appliedProductsFilters.productListingType
                                .selectedValue === item.value
                            }
                            onChange={() => handleCheckboxChange(item.value)}
                          />
                        }
                      />
                      {appliedProductsFilters.productListingType
                        .selectedValue === item.value && (
                        <span
                          className="underline cursor-pointer text-colorGreen"
                          onClick={() =>
                            dispatch(
                              changeAppliedProductsFilters({
                                key: "productListingType",
                                value: {
                                  selectedValue: "",
                                },
                              })
                            )
                          }
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
      <Divider sx={{ margin: "12px" }} />
    </>
  );
};

export default ProductTypeFilter;
