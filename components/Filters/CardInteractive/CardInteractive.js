import React, { useState } from "react";
import CardWrapper from "../CardWrapper/CardWrapper";
import FilterTitle from "../FilterTitle/FilterTitle";

const CardInteractive = ({ cardTitle = "", bottomComponent }) => {
  const [cardOpen, setCardOpen] = useState(true);
  const handleOpenClick = () => setCardOpen(!cardOpen);

  return (
    <CardWrapper>
      <FilterTitle
        handleOpenClick={handleOpenClick}
        className="flex items-center justify-between"
      >
        <span className="text-base">{cardTitle}</span>
        <button
          type="button"
          className={`w-3 h-2 text-black transition-transform duration-300 ${
            cardOpen ? "" : "rotate-180"
          }`}
        >
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible"
          >
            <path
              d="M7.42958 0.84392L13.4296 6.17724C13.562 6.29403 13.6427 6.4586 13.654 6.63483C13.6652 6.81107 13.6061 6.98456 13.4896 7.11724C13.3728 7.2497 13.2082 7.33041 13.032 7.34166C12.8558 7.35291 12.6823 7.29378 12.5496 7.17724L6.98958 2.23725L1.42958 7.17724C1.2958 7.285 1.12559 7.33695 0.954433 7.32228C0.783282 7.3076 0.624401 7.22742 0.510918 7.09847C0.397435 6.96951 0.338111 6.80172 0.345313 6.63009C0.352516 6.45847 0.42569 6.29624 0.549578 6.17725L6.54958 0.84392C6.67124 0.737041 6.82764 0.678098 6.98958 0.678098C7.15152 0.678098 7.30792 0.737041 7.42958 0.84392Z"
              fill="#131045"
            />
          </svg>
        </button>
      </FilterTitle>
      {cardOpen && (
        <div className={`${cardTitle == "RATINGS" ? "px-6" : "px-4"}`}>
          {bottomComponent}
        </div>
      )}
    </CardWrapper>
  );
};

export default CardInteractive;
