import React, { useEffect, useState } from "react";
import { Checkbox, Divider, FormControl, FormGroup } from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";
import { useDispatch, useSelector } from "react-redux";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";
import { StyledFormLabelCheckBox } from "../../core/CustomMUIComponents";
import CommonSearchField from "../CommonSearchField";
import ShowMoreLessFilter from "../ShowMoreLessFilter";

const ProductByShopFilter = ({ setProductPageSkip }) => {
  const { shopsData } = useSelector((state) => state.shops);

  const [selectedData, setSelectedData] = useState([]);

  const [abc, setAbc] = useState(false);

  const [shopSearchValue, setShopSearchValue] = useState("");

  const [shopShowMore, setShopShowMore] = useState(true);

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
      setSelectedData(
        productsFiltersReducer.appliedProductsFilters.shopId.selectedValue
      );
  }, [productsFiltersReducer.appliedProductsFilters]);

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
                  productsFiltersReducer.appliedProductsFilters.shopId
                    .selectedValue.length
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
                      ? shopsData
                          ?.filter((i) =>
                            i?.shop_name
                              .toLowerCase()
                              .includes(shopSearchValue.toLowerCase())
                          )
                          .slice(0, 3)
                      : shopsData?.filter((i) =>
                          i?.shop_name
                            .toLowerCase()
                            .includes(shopSearchValue.toLowerCase())
                        )
                    : shopShowMore
                    ? shopsData.slice(0, 3)
                    : shopsData
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
                            setProductPageSkip(0);
                            setAbc(true);
                          }}
                        />
                      }
                      label={itm.shop_name}
                    />
                  ))}
                </div>
                {shopsData?.filter((i) =>
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
