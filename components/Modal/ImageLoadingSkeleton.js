import React from "react";
import { Skeleton } from "@mui/material";

const ImageLoadingSkeleton = ({ className, variant, height }) => {
  return (
    <Skeleton
      animation="wave"
      variant={variant ?? "rectangular"}
      className={`object-cover h-full w-full ${className}`}
      height={height}
    />
  );
};

export default ImageLoadingSkeleton;
