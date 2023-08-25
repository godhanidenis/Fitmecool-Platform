import React, { useState, useEffect } from "react";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Popover,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAppliedProductsFilters,
  changeProductsLayout,
  changeSortProductsFilters,
} from "../../../redux/ducks/productsFilters";
import {
  changeAppliedShopsFilters,
  changeShopsLayout,
  changeSortShopsFilters,
} from "../../../redux/ducks/shopsFilters";
import DrawerFilters from "../DrawerFilters";
import SegmentOutlinedIcon from "@mui/icons-material/SegmentOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const UpperFilter = ({
  byShop,
  setByShop,
  setProductPageSkip,
  setShopPageSkip,
  showOnlyShopDetailPage,
  hideGridAndLine,
}) => {
  const [selectedProductFilters, setSelectedProductFilters] = useState([]);
  const [selectedShopFilters, setSelectedShopFilters] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedShops, setSelectedShops] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  const [sortByAnchor, setSortByAnchor] = useState(null);
  const openSortByAnchor = Boolean(sortByAnchor);

  const dispatch = useDispatch();
  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );
  const shopsFiltersReducer = useSelector((state) => state.shopsFiltersReducer);

  const { productsCount } = useSelector((state) => state.products);
  const { shopsData, shopsCount } = useSelector((state) => state.shops);
  const { categories } = useSelector((state) => state.categories);
  const { areaLists } = useSelector((state) => state.areaLists);

  useEffect(() => {
    setSelectedProductFilters([
      ...selectedCategories,
      ...selectedShops,
      ...selectedColors,
    ]);
  }, [selectedCategories, selectedColors, selectedShops]);

  useEffect(() => {
    setSelectedShopFilters([...selectedLocations, ...selectedRatings]);
  }, [selectedLocations, selectedRatings]);

  useEffect(() => {
    const selectedCategoryIds =
      productsFiltersReducer.appliedProductsFilters.categoryId.selectedValue;

    const selectedCategories = categories.filter((category) =>
      selectedCategoryIds.includes(category.id)
    );

    const mappedCategories = selectedCategories.map((category) => ({
      type: "categoryId",
      label: category.category_name,
      value: category.id,
    }));

    setSelectedCategories(mappedCategories);
  }, [
    categories,
    productsFiltersReducer.appliedProductsFilters.categoryId.selectedValue,
  ]);

  useEffect(() => {
    const selectedShopIds =
      productsFiltersReducer.appliedProductsFilters.shopId.selectedValue;

    const selectedShopsData = shopsData.filter((shop) =>
      selectedShopIds.includes(shop.id)
    );

    const mappedShops = selectedShopsData.map((shop) => ({
      type: "shopId",
      label: shop.shop_name,
      value: shop.id,
    }));

    setSelectedShops(mappedShops);
  }, [
    productsFiltersReducer.appliedProductsFilters.shopId.selectedValue,
    shopsData,
  ]);

  useEffect(() => {
    setSelectedColors(
      productsFiltersReducer.appliedProductsFilters.productColor.selectedValue.map(
        (color) => ({
          type: "productColor",
          label: color,
          value: color,
        })
      )
    );
  }, [
    productsFiltersReducer.appliedProductsFilters.productColor.selectedValue,
  ]);

  useEffect(() => {
    const selectedLocationPins =
      shopsFiltersReducer.appliedShopsFilters.locations.selectedValue;

    const selectedLocations = areaLists.filter((area) =>
      selectedLocationPins.includes(area.pin)
    );

    const mappedLocations = selectedLocations.map((location) => ({
      type: "locations",
      label: location.area,
      value: location.pin,
    }));

    setSelectedLocations(mappedLocations);
  }, [
    areaLists,
    shopsFiltersReducer.appliedShopsFilters.locations.selectedValue,
  ]);

  useEffect(() => {
    shopsFiltersReducer.appliedShopsFilters.stars.selectedValue &&
    shopsFiltersReducer.appliedShopsFilters.stars.selectedValue !== "0"
      ? setSelectedRatings([
          {
            type: "stars",
            label: shopsFiltersReducer.appliedShopsFilters.stars.selectedValue,
            value: shopsFiltersReducer.appliedShopsFilters.stars.selectedValue,
          },
        ])
      : setSelectedRatings([]);
  }, [shopsFiltersReducer.appliedShopsFilters.stars.selectedValue]);

  const handleChangeSortType = (event, newValue) => {
    setProductPageSkip(0);
    setSortByAnchor(null);
    !byShop
      ? dispatch(
          changeSortProductsFilters({
            key: "sortType",
            value: {
              selectedValue: newValue,
            },
          })
        )
      : dispatch(
          changeSortShopsFilters({
            key: "sortType",
            value: {
              selectedValue: newValue,
            },
          })
        );
  };

  const GetSortByName = (value) => {
    if (value === "new") {
      return "Latest";
    } else if (value === "old") {
      return "Oldest";
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-[#979ca0] text-base">
            <span className="text-black font-bold text-[16px]">
              {byShop ? "Shops" : "Products"}&nbsp;
            </span>
            ({byShop ? shopsCount : productsCount})
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex items-center">
            <Button
              onClick={(event) => {
                setSortByAnchor(event.currentTarget);
              }}
              disableElevation
              disableRipple
              endIcon={
                !openSortByAnchor ? (
                  <KeyboardArrowDownIcon className="text-[#979ca0]" />
                ) : (
                  <KeyboardArrowUpIcon className="text-[#979ca0]" />
                )
              }
            >
              <span className="text-[#979ca0] capitalize text-base">
                {byShop
                  ? GetSortByName(
                      shopsFiltersReducer.sortFilters.sortType.selectedValue
                    )
                  : GetSortByName(
                      productsFiltersReducer.sortFilters.sortType.selectedValue
                    )}
              </span>
            </Button>
            <Popover
              anchorEl={sortByAnchor}
              open={openSortByAnchor}
              add={openSortByAnchor ? "simple-popover" : undefined}
              onClose={() => {
                setSortByAnchor(null);
              }}
              transformOrigin={{
                horizontal: "left",
                vertical: "top",
              }}
              anchorOrigin={{
                horizontal: "left",
                vertical: "bottom",
              }}
            >
              <Box>
                <FormControl sx={{ padding: "10px" }}>
                  <RadioGroup
                    aria-labelledby="sort-selector-label"
                    name="sort-selector"
                    value={
                      byShop
                        ? shopsFiltersReducer.sortFilters.sortType.selectedValue
                        : productsFiltersReducer.sortFilters.sortType
                            .selectedValue
                    }
                    onChange={handleChangeSortType}
                  >
                    {[
                      { label: "Latest", value: "new" },
                      { label: "Oldest", value: "old" },
                    ]?.map((item, index) => (
                      <FormControlLabel
                        key={index}
                        value={item.value}
                        control={<Radio className="text-colorPrimary" />}
                        label={
                          <Typography
                            sx={{ fontWeight: 500, fontSize: "16px" }}
                          >
                            {item.label}
                          </Typography>
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
                <Divider />
              </Box>
            </Popover>
          </div>

          <DrawerFilters
            byShop={byShop}
            setByShop={setByShop}
            setShopPageSkip={setShopPageSkip}
            setProductPageSkip={setProductPageSkip}
            showOnlyShopDetailPage={showOnlyShopDetailPage}
          />

          {!hideGridAndLine && (
            <div className="flex">
              <div
                className={`${
                  !byShop && productsFiltersReducer.productLayout === "grid"
                    ? "!text-colorGreen"
                    : "text-[#878A99]"
                } ${
                  byShop && shopsFiltersReducer.shopLayout === "grid"
                    ? "!text-colorGreen"
                    : "text-[#878A99]"
                } cursor-pointer`}
                onClick={() =>
                  !byShop
                    ? dispatch(
                        changeProductsLayout({
                          key: "productLayout",
                          value: "grid",
                        })
                      )
                    : dispatch(
                        changeShopsLayout({
                          key: "shopLayout",
                          value: "grid",
                        })
                      )
                }
              >
                <GridViewOutlinedIcon fontSize="medium" />
              </div>

              <div
                className={`${
                  !byShop && productsFiltersReducer.productLayout === "list"
                    ? "!text-colorGreen"
                    : "text-[#878A99]"
                } ${
                  byShop && shopsFiltersReducer.shopLayout === "list"
                    ? "!text-colorGreen"
                    : "text-[#878A99]"
                } cursor-pointer ml-1`}
                onClick={() =>
                  !byShop
                    ? dispatch(
                        changeProductsLayout({
                          key: "productLayout",
                          value: "list",
                        })
                      )
                    : dispatch(
                        changeShopsLayout({
                          key: "shopLayout",
                          value: "list",
                        })
                      )
                }
              >
                <SegmentOutlinedIcon fontSize="medium" />
              </div>
            </div>
          )}
        </div>
      </div>
      {(byShop ? selectedShopFilters : selectedProductFilters).length > 0 && (
        <div className="w-full flex gap-10 my-2 capitalize justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {(byShop ? selectedShopFilters : selectedProductFilters).map(
              (itm, index) => (
                <SelectedFilterBadge
                  key={index}
                  itm={itm}
                  byShop={byShop}
                  productsFiltersReducer={productsFiltersReducer}
                  shopsFiltersReducer={shopsFiltersReducer}
                  dispatch={dispatch}
                />
              )
            )}
          </div>
          <span
            className="underline cursor-pointer text-colorGreen whitespace-nowrap"
            onClick={() => {
              if (byShop) {
                ["locations", "stars"].map((itm) =>
                  dispatch(
                    changeAppliedShopsFilters({
                      key: itm,
                      value: {
                        selectedValue: itm === "stars" ? "0" : [],
                      },
                    })
                  )
                );
              } else {
                ["categoryId", "productColor", "shopId"].map((itm) =>
                  dispatch(
                    changeAppliedProductsFilters({
                      key: itm,
                      value: {
                        selectedValue: [],
                      },
                    })
                  )
                );
              }
            }}
          >
            Clear All
          </span>
        </div>
      )}
    </div>
  );
};

export default UpperFilter;

const SelectedFilterBadge = ({
  itm,
  byShop,
  productsFiltersReducer,
  shopsFiltersReducer,
  dispatch,
}) => {
  console.log("itm", itm);
  const handleDeleteFilterBadge = () => {
    if (byShop) {
      dispatch(
        changeAppliedShopsFilters({
          key: itm.type,
          value: {
            selectedValue:
              itm.type === "stars"
                ? "0"
                : shopsFiltersReducer.appliedShopsFilters[
                    itm.type
                  ].selectedValue.filter((item) => item !== itm.value),
          },
        })
      );
    } else {
      dispatch(
        changeAppliedProductsFilters({
          key: itm.type,
          value: {
            selectedValue: productsFiltersReducer.appliedProductsFilters[
              itm.type
            ].selectedValue.filter((item) => item !== itm.value),
          },
        })
      );
    }
  };

  return (
    <Chip
      color="secondary"
      label={itm.label}
      onDelete={handleDeleteFilterBadge}
    />
  );
};
