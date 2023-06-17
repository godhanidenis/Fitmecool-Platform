import React, { useEffect, useState } from "react";
import { Slider } from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";
import { useDispatch, useSelector } from "react-redux";
import { changeAppliedShopsFilters } from "../../../redux/ducks/shopsFilters";

const ShopRatingsFilter = ({ setShopPageSkip }) => {
  const [selectedData, setSelectedData] = useState(0);
  const [abc, setAbc] = useState(false);

  const dispatch = useDispatch();

  const shopsFiltersReducer = useSelector((state) => state.shopsFiltersReducer);

  useEffect(() => {
    abc &&
      dispatch(
        changeAppliedShopsFilters({
          key: "stars",
          value: {
            selectedValue: selectedData.toString(),
          },
        })
      );
  }, [abc, dispatch, selectedData]);

  useEffect(() => {
    shopsFiltersReducer.appliedShopsFilters &&
      setSelectedData(
        Number(shopsFiltersReducer.appliedShopsFilters.stars.selectedValue)
      );
  }, [shopsFiltersReducer.appliedShopsFilters]);

  return (
    <CardInteractive
      cardTitle="RATINGS"
      bottomComponent={
        <Slider
          value={selectedData}
          onChange={(e, newRating) => {
            setShopPageSkip(0);
            setAbc(true);
            setSelectedData(newRating);
          }}
          aria-labelledby="continuous-slider"
          valueLabelDisplay="auto" 
          className="!text-[#29977E]"
          min={0}
          max={5}
        />
      }
    />
  );
};

export default ShopRatingsFilter;
