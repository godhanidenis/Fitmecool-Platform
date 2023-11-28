import { useState } from "react";
import {
  capitalize,
  Checkbox,
  Divider,
  FormControl,
  FormGroup,
} from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";
import { useDispatch, useSelector } from "react-redux";
import { StyledFormLabelCheckBox } from "../../core/CustomMUIComponents";
import CommonSearchField from "../CommonSearchField";
import ShowMoreLessFilter from "../ShowMoreLessFilter";
import { changeProductPage } from "../../../redux/ducks/product";
import { colorsList } from "../../../constants";
import { scrollToTitleName } from "../../../utils/common";
import { changeAppliedShopProductsFilters } from "../../../redux/ducks/shopProductsFilters";
import { changeShopProductPage } from "../../../redux/ducks/shopProduct";

const ProductColorFilter = ({ productByShop }) => {
  const dispatch = useDispatch();
  const { appliedProductsFilters } = useSelector(
    (state) => state.productsFiltersReducer
  );

  const { appliedShopProductsFilters } = useSelector(
    (state) => state.shopProductsFiltersReducer
  );

  const [colorSearchValue, setColorSearchValue] = useState("");

  const [colorShowMore, setColorShowMore] = useState(true);

  const selectedColors = (value) => {
    const updatedSelection = selectedFilter.includes(value);

    const filters = productByShop
      ? appliedShopProductsFilters.productColor
      : appliedProductsFilters.productColor;

    const selectedValue = updatedSelection
      ? filters.selectedValue.filter((item) => item !== value)
      : [...filters.selectedValue, value];

    return selectedValue;
  };

  const handleCheckboxChange = (item) => {
    productByShop
      ? dispatch(changeShopProductPage(0))
      : dispatch(changeProductPage(0));

    const changeFiltersAction = productByShop
      ? changeAppliedShopProductsFilters
      : changeAppliedProductsFilters;

    dispatch(
      changeFiltersAction({
        key: "productColor",
        value: {
          selectedValue: selectedColors(item),
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
        key: "productColor",
        value: {
          selectedValue: [],
        },
      })
    );

    scrollToTitleName();
  };

  const selectedFilter = productByShop
    ? appliedShopProductsFilters.productColor.selectedValue
    : appliedProductsFilters.productColor.selectedValue;

  return (
    <>
      <CardInteractive
        cardTitle="COLORS"
        bottomComponent={
          <>
            <FormControl fullWidth>
              <FormGroup>
                <CommonSearchField
                  value={colorSearchValue}
                  onChange={(e) => setColorSearchValue(e.target.value)}
                  selectedFilterLength={selectedFilter.length}
                  clearDispatched={handleClearFilter}
                />
                <div
                  className={`flex flex-col overflow-auto ${
                    !colorShowMore && "max-h-[252px]"
                  }`}
                >
                  {(colorSearchValue
                    ? colorShowMore
                      ? colorsList
                          ?.filter((i) =>
                            i
                              .toLowerCase()
                              .includes(colorSearchValue.toLowerCase())
                          )
                          .slice(0, 3)
                      : colorsList?.filter((i) =>
                          i
                            .toLowerCase()
                            .includes(colorSearchValue.toLowerCase())
                        )
                    : colorShowMore
                    ? colorsList.slice(0, 3)
                    : colorsList
                  )?.map((item, index) => (
                    <StyledFormLabelCheckBox
                      className="flex items-center"
                      key={index}
                      value={item}
                      label={capitalize(item)}
                      control={
                        <div className="flex items-center">
                          <Checkbox
                            checked={selectedFilter.includes(item)}
                            onChange={() => handleCheckboxChange(item)}
                          />
                          <div className="flex items-center">
                            <span
                              className={`rounded-[50%] w-4 h-4 me-2 border `}
                              style={{
                                backgroundColor: item,
                              }}
                            />
                          </div>
                        </div>
                      }
                    />
                  ))}
                </div>

                {colorsList?.filter((i) =>
                  i.toLowerCase().includes(colorSearchValue.toLowerCase())
                ).length > 3 && (
                  <ShowMoreLessFilter
                    value={colorShowMore}
                    onClick={() => setColorShowMore(!colorShowMore)}
                  />
                )}
              </FormGroup>
            </FormControl>
          </>
        }
      />
      <Divider sx={{ margin: "12px" }} />
    </>
  );
};

export default ProductColorFilter;
