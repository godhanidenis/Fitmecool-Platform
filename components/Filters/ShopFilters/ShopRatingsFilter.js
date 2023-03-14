import React, { useEffect, useState } from "react";
import { Slider } from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";
import { useDispatch } from "react-redux";
import { changeAppliedShopsFilters } from "../../../redux/ducks/shopsFilters";

const ShopRatingsFilter = ({ setShopPageSkip }) => {
  const [selectedData, setSelectedData] = useState(0);
  const [abc, setAbc] = useState(false);

  const dispatch = useDispatch();
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

  return (
    <CardInteractive
      cardTitle="Ratings"
      bottomComponent={
        <Slider
          // defaultValue={3}
          value={selectedData}
          onChange={(e, newRating) => {
            setShopPageSkip(0);
            setAbc(true);
            setSelectedData(newRating);
          }}
          aria-labelledby="continuous-slider"
          valueLabelDisplay="auto"
          min={0}
          max={5}
        />
      }
    />
  );
};

export default ShopRatingsFilter;
