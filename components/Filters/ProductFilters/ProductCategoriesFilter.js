import React, { useEffect, useState } from "react";
import { Checkbox, Divider, FormControl, FormGroup } from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";

import { useDispatch, useSelector } from "react-redux";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";
import { StyledFormLabelCheckBox } from "../../core/CustomMUIComponents";
import CommonSearchField from "../CommonSearchField";
import ShowMoreLessFilter from "../ShowMoreLessFilter";
import { changeProductPage } from "../../../redux/ducks/product";

const ProductCategoriesFilter = () => {
  const { categories } = useSelector((state) => state.categories);

  const [menCategoryLabel, setMenCategoryLabel] = useState([]);
  const [womenCategoryLabel, setWomenCategoryLabel] = useState([]);

  const [selectedMenCat, setSelectedMenCat] = useState([]);
  const [selectedWomenCat, setSelectedWomenCat] = useState([]);

  const [menSelectedData, setMenSelectedData] = useState([]);
  const [womenSelectedData, setWomenSelectedData] = useState([]);

  const [categoryId, setCategoryId] = useState([]);

  const [abc, setAbc] = useState(false);

  const [menSearchValue, setMenSearchValue] = useState("");
  const [womenSearchValue, setWomenSearchValue] = useState("");

  const [menCatShowMore, setMenCatShowMore] = useState(true);
  const [womenCatShowMore, setWomenCatShowMore] = useState(true);

  const dispatch = useDispatch();
  const { appliedProductsFilters } = useSelector(
    (state) => state.productsFiltersReducer
  );

  useEffect(() => {
    setCategoryId([...menSelectedData, ...womenSelectedData]);
  }, [menSelectedData, setCategoryId, womenSelectedData]);

  useEffect(() => {
    abc &&
      dispatch(
        changeAppliedProductsFilters({
          key: "categoryId",
          value: {
            selectedValue: categoryId,
          },
        })
      );
  }, [abc, categoryId, dispatch]);

  useEffect(() => {
    appliedProductsFilters &&
      setSelectedMenCat(
        appliedProductsFilters.categoryId.selectedValue
          .map((itm) => categories.find((i) => i.id === itm))
          .filter((ele) => ele.category_type === "Men")
          .map((i) => i.category_name)
      );

    setSelectedWomenCat(
      appliedProductsFilters.categoryId.selectedValue
        .map((itm) => categories.find((i) => i.id === itm))
        .filter((ele) => ele.category_type === "Women")
        .map((i) => i.category_name)
    );
  }, [categories, appliedProductsFilters]);

  useEffect(() => {
    setMenCategoryLabel(
      categories
        .filter((itm) => itm.category_type === "Men")
        .map((i) => i.category_name)
    );
    setWomenCategoryLabel(
      categories
        .filter((itm) => itm.category_type === "Women")
        .map((i) => i.category_name)
    );
  }, [categories]);

  return (
    <>
      <CardInteractive
        cardTitle="MEN"
        bottomComponent={
          <>
            <FormControl fullWidth>
              <FormGroup>
                <CommonSearchField
                  value={menSearchValue}
                  onChange={(e) => setMenSearchValue(e.target.value)}
                  selectedFilterLength={
                    appliedProductsFilters.categoryId.selectedValue
                      .map((itm) => categories.find((i) => i.id === itm))
                      .filter((ele) => ele.category_type === "Men").length
                  }
                  clearDispatched={() => setMenSelectedData([])}
                />
                <div
                  className={`flex flex-col overflow-auto ${
                    !menCatShowMore && !menSearchValue && "max-h-[252px]"
                  }`}
                >
                  {(menSearchValue
                    ? menCatShowMore
                      ? menCategoryLabel
                          ?.filter((i) =>
                            i
                              .toLowerCase()
                              .includes(menSearchValue.toLowerCase())
                          )
                          .slice(0, 3)
                      : menCategoryLabel?.filter((i) =>
                          i.toLowerCase().includes(menSearchValue.toLowerCase())
                        )
                    : menCatShowMore
                    ? menCategoryLabel.slice(0, 3)
                    : menCategoryLabel
                  ).map((itm) => (
                    <StyledFormLabelCheckBox
                      key={itm}
                      value={itm}
                      control={
                        <Checkbox
                          checked={selectedMenCat.includes(itm)}
                          onChange={(event) => {
                            const updatedSelection = selectedMenCat.includes(
                              itm
                            )
                              ? selectedMenCat.filter((cat) => cat !== itm)
                              : [...selectedMenCat, itm];
                            setSelectedMenCat(updatedSelection);
                            dispatch(changeProductPage(0));
                            setAbc(true);
                            setMenSelectedData(
                              updatedSelection.map(
                                (item) =>
                                  categories.find(
                                    (ele) => ele.category_name === item
                                  )?.id
                              )
                            );
                          }}
                        />
                      }
                      label={itm}
                    />
                  ))}
                </div>
                {menCategoryLabel?.filter((i) =>
                  i.toLowerCase().includes(menSearchValue.toLowerCase())
                ).length > 3 && (
                  <ShowMoreLessFilter
                    value={menCatShowMore}
                    onClick={() => setMenCatShowMore(!menCatShowMore)}
                  />
                )}
              </FormGroup>
            </FormControl>
          </>
        }
      />

      <Divider sx={{ margin: "12px" }} />

      <CardInteractive
        cardTitle="WOMEN"
        bottomComponent={
          <>
            <FormControl fullWidth>
              <FormGroup>
                <CommonSearchField
                  value={womenSearchValue}
                  onChange={(e) => setWomenSearchValue(e.target.value)}
                  selectedFilterLength={
                    appliedProductsFilters.categoryId.selectedValue
                      .map((itm) => categories.find((i) => i.id === itm))
                      .filter((ele) => ele.category_type === "Women").length
                  }
                  clearDispatched={() => setWomenSelectedData([])}
                />
                <div
                  className={`flex flex-col overflow-auto ${
                    !womenCatShowMore && !womenSearchValue && "max-h-[252px]"
                  }`}
                >
                  {(womenSearchValue
                    ? womenCatShowMore
                      ? womenCategoryLabel
                          ?.filter((i) =>
                            i
                              .toLowerCase()
                              .includes(womenSearchValue.toLowerCase())
                          )
                          .slice(0, 3)
                      : womenCategoryLabel?.filter((i) =>
                          i
                            .toLowerCase()
                            .includes(womenSearchValue.toLowerCase())
                        )
                    : womenCatShowMore
                    ? womenCategoryLabel.slice(0, 3)
                    : womenCategoryLabel
                  ).map((itm) => (
                    <StyledFormLabelCheckBox
                      key={itm}
                      value={itm}
                      control={
                        <Checkbox
                          checked={selectedWomenCat.includes(itm)}
                          onChange={(event) => {
                            const updatedSelection = selectedWomenCat.includes(
                              itm
                            )
                              ? selectedWomenCat.filter((cat) => cat !== itm)
                              : [...selectedWomenCat, itm];
                            setSelectedWomenCat(updatedSelection);
                            dispatch(changeProductPage(0));
                            setAbc(true);
                            setWomenSelectedData(
                              updatedSelection.map(
                                (item) =>
                                  categories.find(
                                    (ele) => ele.category_name === item
                                  )?.id
                              )
                            );
                          }}
                        />
                      }
                      label={itm}
                    />
                  ))}
                </div>
                {womenCategoryLabel?.filter((i) =>
                  i.toLowerCase().includes(womenSearchValue.toLowerCase())
                ).length > 3 && (
                  <ShowMoreLessFilter
                    value={womenCatShowMore}
                    onClick={() => setWomenCatShowMore(!womenCatShowMore)}
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

export default ProductCategoriesFilter;
