import React, { useState } from "react";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
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
import { changeProductsLayout, changeSortProductsFilters } from "../../../redux/ducks/productsFilters";
import { changeShopsLayout, changeSortShopsFilters } from "../../../redux/ducks/shopsFilters";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DrawerFilters from "../DrawerFilters";
import SegmentOutlinedIcon from "@mui/icons-material/SegmentOutlined";

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
  const productsFiltersReducer = useSelector((state) => state.productsFiltersReducer);
  const shopsFiltersReducer = useSelector((state) => state.shopsFiltersReducer);
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
    <div className={`justify-between grid grid-cols-8`}>
      <div className="flex items-center col-span-2">
        <p className="text-[#565f66] text-base font-bold pl-1">{`${
          byShop ? "Shops (10 items)" : "Products (30 items)"
        }`}</p>
      </div>

      <div className="flex w-full justify-between items-center gap-2 col-span-6">
        <div>
          <div className="flex items-center">
            <p className="text-[gray] text-[16px] font-semibold">Sort by : </p>
            <Button
              onClick={(event) => {
                setSortByAnchor(event.currentTarget);
              }}
              disableElevation
              disableRipple
              // variant="contained"
              sx={{ backgroundColor: "rgba(149, 83, 155, 0.04) !important" }}
              endIcon={
                !openSortByAnchor ? (
                  <ArrowDropDownIcon className="text-black" />
                ) : (
                  <ArrowDropUpIcon className="text-black" />
                )
              }
              // className="capitalize"
            >
              <span className="text-black capitalize font-semibold text-sm">
                {byShop
                  ? GetSortByName(shopsFiltersReducer.sortFilters.sortType.selectedValue)
                  : GetSortByName(productsFiltersReducer.sortFilters.sortType.selectedValue)}
              </span>
            </Button>
          </div>
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
                      : productsFiltersReducer.sortFilters.sortType.selectedValue
                  }
                  onChange={handleChangeSortType}
                >
                  <FormControlLabel
                    value=""
                    control={<Radio className="text-colorPrimary" />}
                    label={<Typography sx={{ fontWeight: 500, fontSize: "16px" }}>Default</Typography>}
                  />
                  <FormControlLabel
                    value="new"
                    control={<Radio className="text-colorPrimary" />}
                    label={<Typography sx={{ fontWeight: 500, fontSize: "16px" }}>Latest</Typography>}
                  />
                  <FormControlLabel
                    value="old"
                    control={<Radio className="text-colorPrimary" />}
                    label={<Typography sx={{ fontWeight: 500, fontSize: "16px" }}>Oldest</Typography>}
                  />
                </RadioGroup>
              </FormControl>
              <Divider />
            </Box>
          </Popover>
        </div>
        <div>
          {showDrawerFilter && (
            <DrawerFilters
              byShop={byShop}
              setByShop={setByShop}
              setShopPageSkip={setShopPageSkip}
              setProductPageSkip={setProductPageSkip}
              showOnlyShopDetailPage={showOnlyShopDetailPage}
            />
          )}
          <GridViewOutlinedIcon
            fontSize="medium"
            className={`${
              !byShop && productsFiltersReducer.productLayout === "grid" ? "!text-[#29977E]" : "text-[#878A99] "
            } ${byShop && shopsFiltersReducer.shopLayout === "grid" ? "!text-[#29977E]" : "text-[#878A99]"} cursor-pointer`}
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
          />

          <SegmentOutlinedIcon
            fontSize="medium"
            className={`${
              !byShop && productsFiltersReducer.productLayout === "list" ? "!text-[#29977E]" : "text-[#878A99]"
            } ${byShop && shopsFiltersReducer.shopLayout === "list" ? "!text-[#29977E]" : "text-[#878A99]"} cursor-pointer`}
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
          />
        </div>
      </div>
    </div>
  );
};

export default UpperFilter;
