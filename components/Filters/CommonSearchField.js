import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const CommonSearchField = ({
  value,
  onChange,
  clearDispatched,
  selectedFilterLength,
}) => {
  return (
    <div className="flex items-center justify-between gap-5 w-full">
      <div className="relative flex items-center h-10 border-none rounded bg-[#F0F3F4] p-3 w-full">
        <SearchIcon className="!absolute !left-2 !text-[#31333e66]" />
        <input
          type="text"
          placeholder="Search..."
          value={value}
          onChange={onChange}
          className="text-[#31333e66] pl-6 pr-6 flex-grow border-none outline-none bg-transparent text-sm"
        />
      </div>

      {selectedFilterLength > 0 && (
        <span
          className="underline cursor-pointer text-colorGreen"
          onClick={clearDispatched}
        >
          Clear
        </span>
      )}
    </div>
  );
};

export default CommonSearchField;
