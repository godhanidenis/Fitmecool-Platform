import React from "react";
import { Skeleton } from "@mui/material";

const ImageLoadingSkeleton = ({ className, variant, ...otherProps }) => {
  return (
    <Skeleton
      animation="wave"
      variant={variant ?? "rectangular"}
      className={`!object-cover h-full w-full !${className}`}
      {...otherProps}
    />
  );
};

export default ImageLoadingSkeleton;
