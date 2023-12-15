import React from "react";
import { Skeleton } from "@mui/material";

const ImageLoadingSkeleton = ({
  className,
  variant,
  validClassName,
  ...otherProps
}) => {
  return (
    <Skeleton
      animation="wave"
      variant={variant ?? "rectangular"}
      className={`!object-cover ${
        !validClassName && "!h-full !w-full"
      } !${className}`}
      {...otherProps}
    />
  );
};

export default ImageLoadingSkeleton;
