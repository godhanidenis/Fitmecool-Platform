import React, { useEffect, useState } from "react";
import { Divider, Paper, Popper, Tab } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { CustomTab, TabPanel } from "../core/CustomMUIComponents";
import { changeAppliedProductsFilters } from "../../redux/ducks/productsFilters";
import { useScrollDirection } from "../core/useScrollDirection";

const SubHeader = () => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [menCategory, setMenCategory] = useState([]);
  const [womenCategory, setWomenCategory] = useState([]);

  const { categories } = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );

  useEffect(() => {
    setMenCategory(categories.filter((itm) => itm.category_type === "Men"));
    setWomenCategory(categories.filter((itm) => itm.category_type === "Women"));
  }, [categories]);

  const setActiveLink = (id) => {
    return productsFiltersReducer.appliedProductsFilters.categoryId.selectedValue.map(
      (itm) => (itm === id ? "!font-semibold !text-colorGreen" : "")
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

  const equalsCheck = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const scrollDirection = useScrollDirection();

  return (
    <div
      className={`shadow-md z-20 left-0 sticky ${
        scrollDirection === "down" ? "-top-32" : "top-[72px] lg:top-[83px]"
      } transition-all duration-500 hidden lg:flex`}
    >
      <div className="flex items-center">
        <div
          className=""
          onMouseLeave={handleMenuClose.bind(this)}
          onClick={() => setOpen(!open)}
        >
          <CustomTab value={value}>
            {["MEN’S", "WOMEN’S"].map((item, index) => (
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
                <div
                  className="flex justify-between gap-5"
                  onMouseLeave={handleMenuClose.bind(this)}
                >
                  <div>
                    <div className="grid grid-cols-9 gap-10">
                      <div className="col-span-4 p-1">
                        {menCategory.map((itm, index) => {
                          if (index <= menCategory.length / 2 - (0.5 || 1)) {
                            return (
                              <p
                                key={itm.id}
                                className={`p-1 font-semibold text-[#1518278f] hover:text-colorGreen hover:font-semibold cursor-pointer ${setActiveLink(
                                  itm.id
                                )}`}
                                onClick={() => {
                                  dispatch(
                                    changeAppliedProductsFilters({
                                      key: "categoryId",
                                      value: {
                                        selectedValue: equalsCheck(
                                          productsFiltersReducer
                                            .appliedProductsFilters.categoryId
                                            .selectedValue,
                                          [itm.id]
                                        )
                                          ? []
                                          : [itm.id],
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
                                className={`p-1 font-semibold text-[#1518278f] hover:text-colorGreen hover:font-semibold cursor-pointer ${setActiveLink(
                                  itm.id
                                )}`}
                                onClick={() => {
                                  dispatch(
                                    changeAppliedProductsFilters({
                                      key: "categoryId",
                                      value: {
                                        selectedValue: equalsCheck(
                                          productsFiltersReducer
                                            .appliedProductsFilters.categoryId
                                            .selectedValue,
                                          [itm.id]
                                        )
                                          ? []
                                          : [itm.id],
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
                <div
                  className="flex justify-between gap-5"
                  onMouseLeave={handleMenuClose.bind(this)}
                >
                  <div>
                    <div className="grid grid-cols-9 gap-10">
                      <div className="col-span-4 p-1">
                        {womenCategory.map((itm, index) => {
                          if (index <= womenCategory.length / 2 - (0.5 || 1)) {
                            return (
                              <p
                                key={itm.id}
                                className={`p-1 font-semibold text-[#1518278f] hover:text-colorGreen hover:font-semibold cursor-pointer ${setActiveLink(
                                  itm.id
                                )}`}
                                onClick={() => {
                                  dispatch(
                                    changeAppliedProductsFilters({
                                      key: "categoryId",
                                      value: {
                                        selectedValue: equalsCheck(
                                          productsFiltersReducer
                                            .appliedProductsFilters.categoryId
                                            .selectedValue,
                                          [itm.id]
                                        )
                                          ? []
                                          : [itm.id],
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
                                className={`p-1 font-semibold text-[#1518278f] hover:text-colorGreen hover:font-semibold cursor-pointer ${setActiveLink(
                                  itm.id
                                )}`}
                                onClick={() => {
                                  dispatch(
                                    changeAppliedProductsFilters({
                                      key: "categoryId",
                                      value: {
                                        selectedValue: equalsCheck(
                                          productsFiltersReducer
                                            .appliedProductsFilters.categoryId
                                            .selectedValue,
                                          [itm.id]
                                        )
                                          ? []
                                          : [itm.id],
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
