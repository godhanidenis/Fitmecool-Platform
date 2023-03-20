import React, { useEffect, useState } from "react";
import { Divider, Paper, Popper, Tab } from "@mui/material";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import HamburgerIcon from "../../assets/hamburger-icon.svg";
import { CustomTab, TabPanel } from "../core/CustomMUIComponents";
import { changeAppliedProductsFilters } from "../../redux/ducks/productsFilters";

const SubHeader = () => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [menCategory, setMenCategory] = useState([]);
  const [womenCategory, setWomenCategory] = useState([]);
  const [isTop, setIsTop] = useState(true);

  const { categories } = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    setMenCategory(categories.filter((itm) => itm.category_type === "Men"));
    setWomenCategory(categories.filter((itm) => itm.category_type === "Women"));
  }, [categories]);

  const setActiveLink = (id) => {
    return productsFiltersReducer.appliedProductsFilters.categoryId.selectedValue.map(
      (itm) => (itm === id ? "font-semibold" : "")
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
  return (
    <div
      className={`w-full ${
        isTop
          ? "sticky top-0 left-0  transition-all duration-500 transform origin-top"
          : ""
      } bg-colorWhite z-10 shadow-md`}
    >
      <div className="container flex gap-48 items-center">
        <button type="button" className=" h-5 relative"></button>
        <div className="pl-2" onMouseLeave={handleMenuClose.bind(this)}>
          <CustomTab value={value}>
            {["Men's", "Women's"].map((item, index) => (
              <Tab
                key={index}
                onMouseEnter={handleMenuOpen.bind(this, index)}
                data-key={index}
                label={item}
                aria-owns={open ? "menu-list-grow" : undefined}
                aria-haspopup={"true"}
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
                <div className="flex justify-between gap-5">
                  <div>
                    <p className="font-semibold text-colorPrimary mb-4">
                      By Categories
                    </p>
                    <div className="grid grid-cols-9 gap-10">
                      <div className="col-span-4 p-1">
                        {menCategory.map((itm, index) => {
                          if (index <= menCategory.length / 2 - (0.5 || 1)) {
                            return (
                              <p
                                key={itm.id}
                                className={`text-colorBlack p-1 font-normal hover:font-semibold  ${setActiveLink(
                                  itm.id
                                )}`}
                                onClick={() => {
                                  dispatch(
                                    changeAppliedProductsFilters({
                                      key: "categoryId",
                                      value: {
                                        selectedValue: [itm.id],
                                      },
                                    })
                                  );
                                  handleMenuClose();
                                }}
                              >
                                {itm.category_name}
                              </p>
                            );
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
                        {menCategory.map((itm, index) => {
                          if (index > menCategory.length / 2 - (0.5 || 1)) {
                            return (
                              <p
                                key={itm.id}
                                className={`text-colorBlack p-1 font-normal hover:font-semibold  ${setActiveLink(
                                  itm.id
                                )}`}
                                onClick={() => {
                                  dispatch(
                                    changeAppliedProductsFilters({
                                      key: "categoryId",
                                      value: {
                                        selectedValue: [itm.id],
                                      },
                                    })
                                  );
                                  handleMenuClose();
                                }}
                              >
                                {itm.category_name}
                              </p>
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
                <div className="flex justify-between gap-5">
                  <div>
                    <p className="font-semibold text-colorPrimary mb-4">
                      By Categories
                    </p>
                    <div className="grid grid-cols-9 gap-10">
                      <div className="col-span-4 p-1">
                        {womenCategory.map((itm, index) => {
                          if (index <= womenCategory.length / 2 - (0.5 || 1)) {
                            return (
                              <p
                                key={itm.id}
                                className={`text-colorBlack p-1 font-normal hover:font-semibold  ${setActiveLink(
                                  itm.id
                                )}`}
                                onClick={() => {
                                  dispatch(
                                    changeAppliedProductsFilters({
                                      key: "categoryId",
                                      value: {
                                        selectedValue: [itm.id],
                                      },
                                    })
                                  );
                                  handleMenuClose();
                                }}
                              >
                                {itm.category_name}
                              </p>
                            );
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
                        {womenCategory.map((itm, index) => {
                          if (index > womenCategory.length / 2 - (0.5 || 1)) {
                            return (
                              <p
                                key={itm.id}
                                className={`text-colorBlack p-1 font-normal hover:font-semibold  ${setActiveLink(
                                  itm.id
                                )}`}
                                onClick={() => {
                                  dispatch(
                                    changeAppliedProductsFilters({
                                      key: "categoryId",
                                      value: {
                                        selectedValue: [itm.id],
                                      },
                                    })
                                  );
                                  handleMenuClose();
                                }}
                              >
                                {itm.category_name}
                              </p>
                            );
                          }
                          return "";
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </Paper>
          </Popper>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
