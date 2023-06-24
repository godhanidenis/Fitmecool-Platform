import React, { useEffect, useState } from "react";
import { Divider, Paper, Popper, Tab } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { CustomTab, TabPanel } from "../core/CustomMUIComponents";
import { changeAppliedProductsFilters } from "../../redux/ducks/productsFilters";
import { useScrollDirection } from "../core/useScrollDirection";

const Venderheader = () => {
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
      (itm) => (itm === id ? "!text-colorGreen" : "")
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
            {["Dashboard", "Shop", "Products"].map((item, index) => (
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
        </div>
      </div>
    </div>
  );
};

export default Venderheader;
