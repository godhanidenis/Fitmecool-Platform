import React, { useEffect, useState } from "react";
import { Slider } from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";
import { useDispatch, useSelector } from "react-redux";
import { changeAppliedShopsFilters } from "../../../redux/ducks/shopsFilters";
import { changeShopPage } from "../../../redux/ducks/shop";

const ShopRatingsFilter = () => {
  const [selectedData, setSelectedData] = useState(0);
  const [abc, setAbc] = useState(false);

  const dispatch = useDispatch();

  const { appliedShopsFilters } = useSelector(
    (state) => state.shopsFiltersReducer
  );

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
    appliedShopsFilters &&
      setSelectedData(Number(appliedShopsFilters.stars.selectedValue));
  }, [appliedShopsFilters]);

  return (
    <CardInteractive
      cardTitle="RATINGS"
      bottomComponent={
        <Slider
          value={selectedData}
          onChange={(e, newRating) => {
            dispatch(changeShopPage(0));
            setAbc(true);
            setSelectedData(newRating);
          }}
          aria-labelledby="continuous-slider"
          valueLabelDisplay="auto"
          className="!text-colorGreen"
          min={0}
          max={5}
        />
      }
    />
  );
};

export default ShopRatingsFilter;
