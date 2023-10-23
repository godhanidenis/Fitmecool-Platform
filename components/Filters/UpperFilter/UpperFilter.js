import React, { useState, useEffect } from "react";
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
  changeSortProductsFilters,
} from "../../../redux/ducks/productsFilters";
import {
  changeAppliedShopsFilters,
  changeSortShopsFilters,
} from "../../../redux/ducks/shopsFilters";
import DrawerFilters from "../DrawerFilters";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { changeProductPage } from "../../../redux/ducks/product";
import { changeShopPage } from "../../../redux/ducks/shop";

const UpperFilter = ({ showOnlyShopDetailPage }) => {
  const [selectedProductFilters, setSelectedProductFilters] = useState([]);
  const [selectedShopFilters, setSelectedShopFilters] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedShops, setSelectedShops] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedProductListingType, setSelectedProductListingType] = useState(
    []
  );
  const [searchProducts, setSearchProducts] = useState([]);

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  const [sortByAnchor, setSortByAnchor] = useState(null);
  const openSortByAnchor = Boolean(sortByAnchor);

  const dispatch = useDispatch();
  const { appliedProductsFilters, sortFilters } = useSelector(
    (state) => state.productsFiltersReducer
  );
  const {
    appliedShopsFilters,
    sortFilters: shopSortFilters,
    byShop,
  } = useSelector((state) => state.shopsFiltersReducer);

  const { productsCount } = useSelector((state) => state.products);
  const { allShopsLists, shopsCount } = useSelector((state) => state.shops);
  const { categories } = useSelector((state) => state.categories);
  const { areaLists } = useSelector((state) => state.areaLists);

  const { themeLayout } = useSelector((state) => state.themeLayout);

  useEffect(() => {
    setSelectedProductFilters([
      ...selectedCategories,
      ...(showOnlyShopDetailPage ? [] : selectedShops),
      ...selectedColors,
      ...selectedPrices,
      ...selectedProductListingType,
      ...searchProducts,
    ]);
  }, [
    searchProducts,
    selectedCategories,
    selectedPrices,
    selectedProductListingType,
    selectedColors,
    selectedShops,
    showOnlyShopDetailPage,
  ]);

  useEffect(() => {
    setSelectedShopFilters([...selectedLocations, ...selectedRatings]);
  }, [selectedLocations, selectedRatings]);

  useEffect(() => {
    const selectedCategoryIds = appliedProductsFilters.categoryId.selectedValue;

    const selectedCategories = categories.filter((category) =>
      selectedCategoryIds.includes(category.id)
    );

    const mappedCategories = selectedCategories.map((category) => ({
      type: "categoryId",
      label: category.category_name,
      value: category.id,
    }));

    setSelectedCategories(mappedCategories);
  }, [categories, appliedProductsFilters.categoryId.selectedValue]);

  useEffect(() => {
    const selectedShopIds = appliedProductsFilters.shopId.selectedValue;

    const selectedShopsData = allShopsLists?.data.filter((shop) =>
      selectedShopIds.includes(shop.id)
    );

    const mappedShops = selectedShopsData.map((shop) => ({
      type: "shopId",
      label: shop.shop_name,
      value: shop.id,
    }));

    setSelectedShops(mappedShops);
  }, [appliedProductsFilters.shopId.selectedValue, allShopsLists?.data]);

  useEffect(() => {
    setSelectedColors(
      appliedProductsFilters.productColor.selectedValue.map((color) => ({
        type: "productColor",
        label: color,
        value: color,
      }))
    );
  }, [appliedProductsFilters.productColor.selectedValue]);

  const priceFilterLabel = (price) => {
    if (price.min > 0 && price.max === 0) {
      return `Price: Over ${price.min}`;
    } else {
      return `Price: ${price.min} - ${price.max}`;
    }
  };

  useEffect(() => {
    appliedProductsFilters.productPrice.selectedValue.min === 0 &&
    appliedProductsFilters.productPrice.selectedValue.max === 0
      ? setSelectedPrices([])
      : setSelectedPrices([
          {
            type: "productPrice",
            label: priceFilterLabel(
              appliedProductsFilters.productPrice.selectedValue
            ),
            value: appliedProductsFilters.productPrice.selectedValue,
          },
        ]);
  }, [appliedProductsFilters.productPrice.selectedValue]);

  useEffect(() => {
    appliedProductsFilters.productListingType.selectedValue === ""
      ? setSelectedProductListingType([])
      : setSelectedProductListingType([
          {
            type: "productListingType",
            label: `Type: ${appliedProductsFilters.productListingType.selectedValue}`,
            value: appliedProductsFilters.productListingType.selectedValue,
          },
        ]);
  }, [appliedProductsFilters.productListingType.selectedValue]);

  useEffect(() => {
    appliedProductsFilters.searchBarData.selectedValue &&
    appliedProductsFilters.searchBarData.selectedValue !== ""
      ? setSearchProducts([
          {
            type: "searchBarData",
            label: appliedProductsFilters.searchBarData.selectedValue,
            value: appliedProductsFilters.searchBarData.selectedValue,
          },
        ])
      : setSearchProducts([]);
  }, [appliedProductsFilters.searchBarData.selectedValue]);

  useEffect(() => {
    const selectedLocationPins = appliedShopsFilters.locations.selectedValue;

    const selectedLocations = areaLists.filter((area) =>
      selectedLocationPins.includes(area.pin)
    );

    const mappedLocations = selectedLocations.map((location) => ({
      type: "locations",
      label: location.area,
      value: location.pin,
    }));

    setSelectedLocations(mappedLocations);
  }, [areaLists, appliedShopsFilters.locations.selectedValue]);

  useEffect(() => {
    appliedShopsFilters.stars.selectedValue &&
    appliedShopsFilters.stars.selectedValue !== "0"
      ? setSelectedRatings([
          {
            type: "stars",
            label: `Rating: ${appliedShopsFilters.stars.selectedValue}`,
            value: appliedShopsFilters.stars.selectedValue,
          },
        ])
      : setSelectedRatings([]);
  }, [appliedShopsFilters.stars.selectedValue]);

  const handleChangeSortType = (event, newValue) => {
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

  const options = byShop
    ? [
        { label: "Default", value: "" },
        { label: "Rating: high to low", value: "rating" },
        { label: "Follower: high to low", value: "follower" },
      ]
    : [
        { label: "Default", value: "" },
        { label: "Price: high to low", value: "high-low" },
        { label: "Price: low to high", value: "low-high" },
      ];

  const GetSortByName = (value) => {
    if (value === "high-low") {
      return "Price: high to low";
    } else if (value === "low-high") {
      return "Price: low to high";
    } else {
      return "Sort by";
    }
  };

  const GetSortByNameForShop = (value) => {
    if (value === "rating") {
      return "Rating: high to low";
    } else if (value === "follower") {
      return "Follower: high to low";
    } else {
      return "Sort by";
    }
  };

  return (
    <div className="w-full border-b" id="titleName">
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
          <div className="flex items-center mb-1">
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
              <span className="text-[#979ca0] normal-case text-base">
                {byShop
                  ? GetSortByNameForShop(shopSortFilters.sortType.selectedValue)
                  : GetSortByName(sortFilters.sortType.selectedValue)}
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
                        ? shopSortFilters.sortType.selectedValue
                        : sortFilters.sortType.selectedValue
                    }
                    onChange={handleChangeSortType}
                  >
                    {options?.map((item, index) => (
                      <FormControlLabel
                        key={index}
                        value={item.value}
                        control={<Radio className="!text-colorPrimary" />}
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

          <DrawerFilters showOnlyShopDetailPage={showOnlyShopDetailPage} />
        </div>
      </div>
      {(byShop ? selectedShopFilters : selectedProductFilters).length > 0 && (
        <div
          className={`w-full flex gap-5 sm:gap-10 my-2 capitalize justify-between ${
            themeLayout === "mobileScreen" && "items-center"
          }`}
        >
          <div
            className={`flex items-center gap-2 ${
              themeLayout === "mobileScreen"
                ? "overflow-x-auto hide-scrollbar"
                : "flex-wrap"
            }`}
          >
            {(byShop ? selectedShopFilters : selectedProductFilters).map(
              (itm, index) => (
                <SelectedFilterBadge
                  key={index}
                  itm={itm}
                  byShop={byShop}
                  appliedProductsFilters={appliedProductsFilters}
                  appliedShopsFilters={appliedShopsFilters}
                  dispatch={dispatch}
                />
              )
            )}
          </div>
          <span
            className="underline cursor-pointer text-colorGreen whitespace-nowrap mr-2"
            onClick={() => {
              const passValueForProduct = (itm) => {
                if (itm === "searchBarData" || itm === "productListingType") {
                  return "";
                } else if (itm === "productPrice") {
                  return { min: 0, max: 0 };
                } else {
                  return [];
                }
              };
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
                dispatch(changeShopPage(0));
              } else {
                [
                  "categoryId",
                  "productColor",
                  "productPrice",
                  "productListingType",
                  ...(showOnlyShopDetailPage ? [] : ["shopId"]),
                  "searchBarData",
                ].map((itm) =>
                  dispatch(
                    changeAppliedProductsFilters({
                      key: itm,
                      value: {
                        selectedValue: passValueForProduct(itm),
                      },
                    })
                  )
                );
                dispatch(changeProductPage(0));
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
  appliedProductsFilters,
  appliedShopsFilters,
  dispatch,
}) => {
  const passValueForProduct = () => {
    if (itm.type === "searchBarData" || itm.type === "productListingType") {
      return "";
    } else if (itm.type === "productPrice") {
      return { min: 0, max: 0 };
    } else {
      return appliedProductsFilters[itm.type].selectedValue.filter(
        (item) => item !== itm.value
      );
    }
  };

  const handleDeleteFilterBadge = () => {
    if (byShop) {
      dispatch(
        changeAppliedShopsFilters({
          key: itm.type,
          value: {
            selectedValue:
              itm.type === "stars"
                ? "0"
                : appliedShopsFilters[itm.type].selectedValue.filter(
                    (item) => item !== itm.value
                  ),
          },
        })
      );
      dispatch(changeShopPage(0));
    } else {
      dispatch(
        changeAppliedProductsFilters({
          key: itm.type,
          value: {
            selectedValue: passValueForProduct(),
          },
        })
      );
      dispatch(changeProductPage(0));
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
