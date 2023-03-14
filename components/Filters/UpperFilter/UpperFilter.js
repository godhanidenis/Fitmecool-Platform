import React, { useState } from "react";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import {
  Box,
  Button,
  ButtonGroup,
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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const UpperFilter = ({ byShop, setProductPageSkip, isbg }) => {
  const [sortByAnchor, setSortByAnchor] = useState(null);
  const openSortByAnchor = Boolean(sortByAnchor);

  const dispatch = useDispatch();
  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );
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

  return (
    <div
      className={` ${
        isbg ? "bg-[#F5F5F5] pt-3" : "bg-[#FFFFFF] mb-3"
      }  flex justify-between`}
    >
      <div className="flex items-center">
        <p className="font-bold text-2xl text-colorBlack">{`${
          byShop ? "Shops" : "Products"
        } `}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* <ButtonGroup size="large" aria-label="large button group">
          <Button
            className={`${
              !byShop &&
              productsFiltersReducer.productLayout === "list" &&
              "bg-colorPrimary"
            } ${
              byShop &&
              shopsFiltersReducer.shopLayout === "list" &&
              "bg-colorPrimary"
            }`}
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
          > */}
        <ListOutlinedIcon
          // className="text-black"
          fontSize="large"
          className={`${
            !byShop && productsFiltersReducer.productLayout === "list"
              ? "text-[#95539B]"
              : "text-black"
          } ${
            byShop && shopsFiltersReducer.shopLayout === "list"
              ? "text-[#95539B]"
              : "text-black"
          }`}
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
        {/* </Button> */}
        {/* <Button
          className={`${
            !byShop &&
            productsFiltersReducer.productLayout === "grid" &&
            "bg-colorPrimary"
          } ${
            byShop &&
            shopsFiltersReducer.shopLayout === "grid" &&
            "bg-colorPrimary"
          }`}
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
        ></Button> */}
        <GridViewOutlinedIcon
          className={`${
            !byShop && productsFiltersReducer.productLayout === "grid"
              ? "text-[#95539B]"
              : "text-black"
          } ${
            byShop && shopsFiltersReducer.shopLayout === "grid"
              ? "text-[#95539B]"
              : "text-black"
          }`}
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
        {/* </ButtonGroup> */}
        <Button
          onClick={(event) => {
            setSortByAnchor(event.currentTarget);
          }}
          disableElevation
          disableRipple
          endIcon={
            !openSortByAnchor ? (
              <ArrowDropDownIcon className="text-black" />
            ) : (
              <ArrowDropUpIcon className="text-black" />
            )
          }
          className="capitalize"
        >
          <p className="text-black font-semibold text-base">Sort By:</p>
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
                    : productsFiltersReducer.sortFilters.sortType.selectedValue
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
    </div>
  );
};

export default UpperFilter;
