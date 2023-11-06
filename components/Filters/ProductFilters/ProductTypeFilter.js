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
import { changeAppliedShopProductsFilters } from "../../../redux/ducks/shopProductsFilters";
import { scrollToTitleName } from "../../../utils/common";

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

const ProductTypeFilter = ({ productByShop }) => {
  const dispatch = useDispatch();
  const { appliedProductsFilters } = useSelector(
    (state) => state.productsFiltersReducer
  );

  const { appliedShopProductsFilters } = useSelector(
    (state) => state.shopProductsFiltersReducer
  );

  const handleCheckboxChange = (value) => {
    dispatch(changeProductPage(0));

    const changeFiltersAction = productByShop
      ? changeAppliedShopProductsFilters
      : changeAppliedProductsFilters;

    dispatch(
      changeFiltersAction({
        key: "productListingType",
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
        key: "productListingType",
        value: {
          selectedValue: "",
        },
      })
    );

    scrollToTitleName();
  };

  const selectedFilter = productByShop
    ? appliedShopProductsFilters.productListingType.selectedValue
    : appliedProductsFilters.productListingType.selectedValue;

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
                            checked={selectedFilter === item.value}
                            onChange={() => handleCheckboxChange(item.value)}
                          />
                        }
                      />
                      {selectedFilter === item.value && (
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
      <Divider sx={{ margin: "12px" }} />
    </>
  );
};

export default ProductTypeFilter;
