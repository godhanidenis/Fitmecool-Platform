import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useState } from "react";
import Filter from "./index";
import CloseIcon from "@mui/icons-material/Close";

const DrawerFilters = ({ setProductPageSkip }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const toggleFilterMenu = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <>
      <button
        onClick={toggleFilterMenu}
        className="flex items-center p-3 text-colorBlack"
      >
        <FilterAltIcon />
      </button>
      <div
        className={`p-4 py-10 w-1/3 fixed top-0 right-0 z-[1035] h-screen overflow-hidden shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] transition-transform duration-300 bg-colorWhite border-l ${
          !filterOpen ? "translate-x-full" : "-translate-x-0"
        }`}
      >
        <div className="mb-10 flex justify-end">
          <button onClick={toggleFilterMenu}>
            <CloseIcon className="text-black" />
          </button>
        </div>
        <div className="h-[90%] pb-10 overflow-y-scroll">
          <div className=" max-w-md mx-auto">
            <Filter
              productByShop={true}
              setProductPageSkip={setProductPageSkip}
            />
          </div>
        </div>
      </div>
      {filterOpen && (
        <div
          onClick={toggleFilterMenu}
          className="fixed w-screen h-screen left-0 top-0 z-40 bg-colorPrimary opacity-20 lg:hidden"
        ></div>
      )}
    </>
  );
};

export default DrawerFilters;
