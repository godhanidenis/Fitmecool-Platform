import React, { useEffect, useState } from "react";
import { Divider, Paper, Popper, Tab } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { CustomTab, TabPanel } from "../core/CustomMUIComponents";
import { changeAppliedProductsFilters } from "../../redux/ducks/productsFilters";
import { useRouter } from "next/router";
import { changeByShopFilters } from "../../redux/ducks/shopsFilters";
import { changeProductPage } from "../../redux/ducks/product";
import { loadAllShopsListsStart } from "../../redux/ducks/shop";

const SubHeader = () => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [menCategory, setMenCategory] = useState([]);
  const [womenCategory, setWomenCategory] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const { byShop } = useSelector((state) => state.shopsFiltersReducer);

  const { allShopsLists } = useSelector((state) => state.shops);
  const { categories } = useSelector((state) => state.categories);
  const { appliedProductsFilters } = useSelector(
    (state) => state.productsFiltersReducer
  );

  useEffect(() => {
    setMenCategory(categories.filter((itm) => itm.category_type === "Men"));
    setWomenCategory(categories.filter((itm) => itm.category_type === "Women"));
  }, [categories]);

  const setActiveLink = (filterType, id) => {
    return appliedProductsFilters[filterType].selectedValue.map((itm) =>
      itm === id ? "!text-colorGreen" : ""
    );
  };

  const handleMenuOpen = (index, event) => {
    const { currentTarget } = event;
    setOpen(true);
    setAnchorEl(currentTarget);
    setValue(index);
  };

  const handleMenuClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  useEffect(() => {
    dispatch(loadAllShopsListsStart());
  }, [dispatch]);

  const equalsCheck = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const generateQuickFilterComponent = (filterType, item) => (
    <p
      key={item.id}
      className={`p-1 font-semibold text-[#1518278f] hover:text-colorGreen cursor-pointer ${setActiveLink(
        filterType,
        item.id
      )}`}
      onClick={() => {
        if (filterType === "shopId") {
          window.open(`/shop/${item.id}`, "_blank");
        } else {
          ["productColor", "shopId", "categoryId", "searchBarData"].map((itm) =>
            dispatch(
              changeAppliedProductsFilters({
                key: itm,
                value: {
                  selectedValue:
                    itm === filterType
                      ? equalsCheck(
                          appliedProductsFilters[filterType].selectedValue,
                          [item.id]
                        )
                        ? []
                        : [item.id]
                      : itm === "searchBarData"
                      ? ""
                      : [],
                },
              })
            )
          );
          dispatch(changeProductPage(0));
          byShop && dispatch(changeByShopFilters(false));
          if (router.pathname === "/home") {
            handleMenuClose();
          } else {
            router.push("/home");
          }
        }
      }}
    >
      {filterType === "shopId" ? item.shop_name : item.category_name}
    </p>
  );

  return (
    <div className="lg:flex hidden items-center">
      <div
        className=""
        onMouseLeave={handleMenuClose.bind(this)}
        onClick={() => setOpen(!open)}
      >
        <CustomTab value={value} subheader="true">
          {["men's", "women's", "shops"].map((item, index) => (
            <Tab
              key={index}
              onMouseEnter={handleMenuOpen.bind(this, index)}
              data-key={index}
              label={item}
              aria-owns={open ? "menu-list-grow" : undefined}
              aria-haspopup={"true"}
              className="!uppercase"
            />
          ))}
        </CustomTab>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="top-start"
          id="menu-list-grow"
        >
          <Paper>
            <TabPanel value={value} index={0} className="p-6">
              <div
                className="flex justify-between gap-5"
                onMouseLeave={handleMenuClose.bind(this)}
              >
                <div>
                  <div className="grid grid-cols-9 gap-10">
                    <div className="col-span-4 p-1">
                      {menCategory.map((itm, index) => {
                        if (index <= menCategory.length / 2 - (0.5 || 1)) {
                          return generateQuickFilterComponent(
                            "categoryId",
                            itm
                          );
                        }
                        return "";
                      })}
                    </div>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <div className="col-span-4 p-1">
                      {menCategory.map((itm, index) => {
                        if (index > menCategory.length / 2 - (0.5 || 1)) {
                          return generateQuickFilterComponent(
                            "categoryId",
                            itm
                          );
                        }
                        return "";
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel value={value} index={1} className="p-6">
              <div
                className="flex justify-between gap-5"
                onMouseLeave={handleMenuClose.bind(this)}
              >
                <div>
                  <div className="grid grid-cols-9 gap-10">
                    <div className="col-span-4 p-1">
                      {womenCategory.map((itm, index) => {
                        if (index <= womenCategory.length / 2 - (0.5 || 1)) {
                          return generateQuickFilterComponent(
                            "categoryId",
                            itm
                          );
                        }
                        return "";
                      })}
                    </div>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <div className="col-span-4 p-1">
                      {womenCategory.map((itm, index) => {
                        if (index > womenCategory.length / 2 - (0.5 || 1)) {
                          return generateQuickFilterComponent(
                            "categoryId",
                            itm
                          );
                        }
                        return "";
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel value={value} index={2} className="p-6">
              <div
                className="flex justify-between gap-5"
                onMouseLeave={handleMenuClose.bind(this)}
              >
                <div>
                  {allShopsLists?.data?.length === 0 ? (
                    "No Shops Available"
                  ) : (
                    <div className="grid grid-cols-9 gap-10">
                      <div className="col-span-4 p-1">
                        {allShopsLists?.data?.map((itm, index) => {
                          if (
                            index <=
                            allShopsLists?.data?.length / 2 - (0.5 || 1)
                          ) {
                            return generateQuickFilterComponent("shopId", itm);
                          }
                          return "";
                        })}
                      </div>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                      />
                      <div className="col-span-4 p-1">
                        {allShopsLists?.data?.map((itm, index) => {
                          if (
                            index >
                            allShopsLists?.data?.length / 2 - (0.5 || 1)
                          ) {
                            return generateQuickFilterComponent("shopId", itm);
                          }
                          return "";
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabPanel>
          </Paper>
        </Popper>
      </div>
    </div>
  );
};

export default SubHeader;
