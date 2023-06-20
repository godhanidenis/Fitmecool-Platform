import React, { useState } from "react";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import {
  Box,
  Button,
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
  changeProductsLayout,
  changeSortProductsFilters,
} from "../../../redux/ducks/productsFilters";
import {
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
  showDrawerFilter,
  setShopPageSkip,
  showOnlyShopDetailPage,
}) => {
  const [sortByAnchor, setSortByAnchor] = useState(null);
  const openSortByAnchor = Boolean(sortByAnchor);

  const dispatch = useDispatch();
  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );
  const shopsFiltersReducer = useSelector((state) => state.shopsFiltersReducer);

  const { productsCount } = useSelector((state) => state.products);
  const { shopsCount } = useSelector((state) => state.shops);

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
    if (value === "") {
      return "Default";
    } else if (value === "new") {
      return "Latest";
    } else if (value === "old") {
      return "Oldest";
    }
  };

  return (
    <div
      className={`justify-between flex sm:grid flex-col-reverse grid-cols-8`}
    >
      <div className="flex items-center sm:col-span-2 mt-5 sm:mt-0">
        <span className="text-[#979ca0] text-base font-bold">
          <span className="text-black">
            {byShop ? "Shops" : "Products"}&nbsp;
          </span>
          ({byShop ? shopsCount : productsCount} items)
        </span>
      </div>

      <div className="flex w-full justify-between items-center gap-2 sm:col-span-6">
        <div className="flex items-center sm:px-6">
          <p className="text-[gray] text-[16px] font-semibold">Sort by : </p>
          <Button
            onClick={(event) => {
              setSortByAnchor(event.currentTarget);
            }}
            disableElevation
            disableRipple
            endIcon={
              !openSortByAnchor ? (
                <KeyboardArrowDownIcon className="text-black" />
              ) : (
                <KeyboardArrowUpIcon className="text-black" />
              )
            }
          >
            <span className="text-black capitalize font-semibold text-sm">
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
                  <FormControlLabel
                    value=""
                    control={<Radio className="text-colorPrimary" />}
                    label={
                      <Typography sx={{ fontWeight: 500, fontSize: "16px" }}>
                        Default
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="new"
                    control={<Radio className="text-colorPrimary" />}
                    label={
                      <Typography sx={{ fontWeight: 500, fontSize: "16px" }}>
                        Latest
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="old"
                    control={<Radio className="text-colorPrimary" />}
                    label={
                      <Typography sx={{ fontWeight: 500, fontSize: "16px" }}>
                        Oldest
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
              <Divider />
            </Box>
          </Popover>
        </div>
        <div
          className={`flex gap-5 ${showOnlyShopDetailPage ? "pr-0" : "pr-6"} `}
        >
          {showDrawerFilter && (
            <DrawerFilters
              byShop={byShop}
              setByShop={setByShop}
              setShopPageSkip={setShopPageSkip}
              setProductPageSkip={setProductPageSkip}
              showOnlyShopDetailPage={showOnlyShopDetailPage}
            />
          )}

          <div className="flex">
            <div
              className={`${
                !byShop && productsFiltersReducer.productLayout === "grid"
                  ? "!text-colorGreen bg-white"
                  : "text-[#878A99] bg-[#E8EBEA]"
              } ${
                byShop && shopsFiltersReducer.shopLayout === "grid"
                  ? "!text-colorGreen bg-white"
                  : "text-[#878A99] bg-[#E8EBEA]"
              } cursor-pointer px-2 py-1 rounded-l`}
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
              style={{
                boxShadow:
                  ((!byShop &&
                    productsFiltersReducer.productLayout === "grid") ||
                    (byShop && shopsFiltersReducer.shopLayout === "grid")) &&
                  "0px 0.735294px 1.47059px rgba(37, 123, 106, 0.08), 0px 1.47059px 2.94118px rgba(37, 123, 106, 0.16)",
              }}
            >
              <GridViewOutlinedIcon fontSize="medium" />
            </div>

            <div
              className={`${
                !byShop && productsFiltersReducer.productLayout === "list"
                  ? "!text-colorGreen bg-white"
                  : "text-[#878A99] bg-[#E8EBEA]"
              } ${
                byShop && shopsFiltersReducer.shopLayout === "list"
                  ? "!text-colorGreen bg-white"
                  : "text-[#878A99] bg-[#E8EBEA]"
              } cursor-pointer px-2 py-1 rounded-r`}
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
              style={{
                boxShadow:
                  ((!byShop &&
                    productsFiltersReducer.productLayout === "list") ||
                    (byShop && shopsFiltersReducer.shopLayout === "list")) &&
                  "0px 0.735294px 1.47059px rgba(37, 123, 106, 0.08), 0px 1.47059px 2.94118px rgba(37, 123, 106, 0.16)",
              }}
            >
              <SegmentOutlinedIcon fontSize="medium" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpperFilter;
