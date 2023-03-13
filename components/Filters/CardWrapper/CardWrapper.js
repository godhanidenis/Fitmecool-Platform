import React from "react";

const CardWrapper = ({ children }) => {
  return (
    <div className={`bg-colorWhite border-colorGrey rounded-md`}>
      {children}
    </div>
  );
};

export default CardWrapper;
