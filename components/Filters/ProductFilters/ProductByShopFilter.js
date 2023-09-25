import React, { useEffect, useState } from "react";
import { Checkbox, Divider, FormControl, FormGroup } from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";
import { useDispatch, useSelector } from "react-redux";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";
import { StyledFormLabelCheckBox } from "../../core/CustomMUIComponents";
import CommonSearchField from "../CommonSearchField";
import ShowMoreLessFilter from "../ShowMoreLessFilter";
import { changeProductPage } from "../../../redux/ducks/product";

const ProductByShopFilter = () => {
  const { allShopsLists } = useSelector((state) => state.shops);

  const [selectedData, setSelectedData] = useState([]);

  const [abc, setAbc] = useState(false);

  const [shopSearchValue, setShopSearchValue] = useState("");

  const [shopShowMore, setShopShowMore] = useState(true);

  const dispatch = useDispatch();
  const { appliedProductsFilters } = useSelector(
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
    appliedProductsFilters &&
      setSelectedData(appliedProductsFilters.shopId.selectedValue);
  }, [appliedProductsFilters]);

  return (
    <>
      <CardInteractive
        cardTitle="SHOPS"
        bottomComponent={
          <>
            <FormControl fullWidth>
              <CommonSearchField
                value={shopSearchValue}
                onChange={(e) => setShopSearchValue(e.target.value)}
                selectedFilterLength={
                  appliedProductsFilters.shopId.selectedValue.length
                }
                clearDispatched={() =>
                  dispatch(
                    changeAppliedProductsFilters({
                      key: "shopId",
                      value: {
                        selectedValue: [],
                      },
                    })
                  )
                }
              />
              <FormGroup>
                <div
                  className={`flex flex-col overflow-auto ${
                    !shopShowMore && !shopSearchValue && "max-h-[252px]"
                  }`}
                >
                  {(shopSearchValue
                    ? shopShowMore
                      ? allShopsLists?.data
                          ?.filter((i) =>
                            i?.shop_name
                              .toLowerCase()
                              .includes(shopSearchValue.toLowerCase())
                          )
                          .slice(0, 3)
                      : allShopsLists?.data?.filter((i) =>
                          i?.shop_name
                            .toLowerCase()
                            .includes(shopSearchValue.toLowerCase())
                        )
                    : shopShowMore
                    ? allShopsLists?.data.slice(0, 3)
                    : allShopsLists?.data
                  )?.map((itm) => (
                    <StyledFormLabelCheckBox
                      key={itm.shop_name}
                      value={itm.shop_name}
                      control={
                        <Checkbox
                          checked={selectedData.includes(itm.id)}
                          onChange={(event) => {
                            const updatedSelection = selectedData.includes(
                              itm.id
                            )
                              ? selectedData.filter((id) => id !== itm.id)
                              : [...selectedData, itm.id];
                            setSelectedData(updatedSelection);
                            dispatch(changeProductPage(0));
                            setAbc(true);
                          }}
                        />
                      }
                      label={itm.shop_name}
                    />
                  ))}
                </div>
                {allShopsLists?.data?.filter((i) =>
                  i?.shop_name
                    .toLowerCase()
                    .includes(shopSearchValue.toLowerCase())
                ).length > 3 && (
                  <ShowMoreLessFilter
                    value={shopShowMore}
                    onClick={() => setShopShowMore(!shopShowMore)}
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

export default ProductByShopFilter;
