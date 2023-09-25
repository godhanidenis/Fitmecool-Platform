/* eslint-disable react-hooks/rules-of-hooks */
// resizes the screen size hook

import React from "react";

export function useResizeScreenLayout() {
  const [isScreenWide, setIsScreenWide] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1023) {
        // 1023 is the lg breakpoint in Tailwind
        setIsScreenWide(true);
      } else {
        setIsScreenWide(false);
      }
    };

    handleResize(); // Check on component mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isScreenWide;
}

export function screeResizeForViewMoreItems() {
  const [isScreenWide, setIsScreenWide] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1441) {
        // 1023 is the lg breakpoint in Tailwind
        setIsScreenWide(true);
      } else {
        setIsScreenWide(false);
      }
    };

    handleResize(); // Check on component mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isScreenWide;
}
