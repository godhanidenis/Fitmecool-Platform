import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useEffect, useState } from "react";
import Filter from "./index";
import CloseIcon from "@mui/icons-material/Close";
import { Fab } from "@mui/material";
import { useSelector } from "react-redux";
import useUserType from "../../hooks/useUserType";

const DrawerFilters = ({ showOnlyShopDetailPage }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const { currentUserType } = useUserType();

  const toggleFilterMenu = () => {
    setFilterOpen(!filterOpen);
  };

  const { themeLayout } = useSelector((state) => state.themeLayout);

  return (
    <>
      {((currentUserType === "vendor" && !filterOpen) ||
        (themeLayout === "mobileScreen" && !filterOpen)) && (
        <Fab
          color="primary"
          aria-label="add"
          className="!bottom-6 !right-6 !fixed !bg-colorPrimary !lg:hidden"
          onClick={toggleFilterMenu}
        >
          <FilterAltIcon />
        </Fab>
      )}

      <div
        className={`p-4 py-4 lg:w-3/12 w-10/12 lg:${
          currentUserType === "vendor" ? "block" : "hidden"
        } fixed top-0 right-0 z-[1035] h-screen overflow-hidden shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] transition-transform duration-300 bg-colorWhite border-l ${
          !filterOpen ? "translate-x-full" : "-translate-x-0"
        }`}
      >
        <div className="mb-2 flex justify-end">
          <button onClick={toggleFilterMenu}>
            <CloseIcon className="!text-black" />
          </button>
        </div>
        <div className="h-[90%] pb-10 overflow-y-scroll">
          <div className="max-w-md mx-auto">
            <Filter
              productByShop={showOnlyShopDetailPage}
              userType={currentUserType}
            />
          </div>
        </div>
      </div>
      {filterOpen && (
        <div
          onClick={toggleFilterMenu}
          className="fixed w-screen h-screen left-0 top-0 z-40 bg-colorPrimary opacity-20"
        ></div>
      )}
    </>
  );
};

export default DrawerFilters;
