import React from "react";
const FilterTitle = ({ className = "", children, handleOpenClick }) => {
  return (
    <div
      className={`p-2 cursor-pointer`}
      onClick={handleOpenClick}
    >
      <h4 className={`font-semibold text-xl xl:text-2xl mb-2 ${className}`}>
        {children}
      </h4>
    </div>
  );
};

export default FilterTitle;
