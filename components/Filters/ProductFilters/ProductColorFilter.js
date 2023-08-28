import { useState } from "react";
import { capitalize, Checkbox, FormControl, FormGroup } from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";
import { useDispatch, useSelector } from "react-redux";
import { StyledFormLabelCheckBox } from "../../core/CustomMUIComponents";
import CommonSearchField from "../CommonSearchField";
import ShowMoreLessFilter from "../ShowMoreLessFilter";
import { colorsList } from "../../../utils/common";

const ProductColorFilter = ({ setProductPageSkip }) => {
  const dispatch = useDispatch();
  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );
  const [colorSearchValue, setColorSearchValue] = useState("");

  const [colorShowMore, setColorShowMore] = useState(true);

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
                selectedFilterLength={
                  productsFiltersReducer.appliedProductsFilters.productColor
                    .selectedValue.length
                }
                clearDispatched={() =>
                  dispatch(
                    changeAppliedProductsFilters({
                      key: "productColor",
                      value: {
                        selectedValue: [],
                      },
                    })
                  )
                }
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
                        i.toLowerCase().includes(colorSearchValue.toLowerCase())
                      )
                  : colorShowMore
                  ? colorsList.slice(0, 3)
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
  );
};

export default ProductColorFilter;
