import React, { useEffect, useState } from "react";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useDispatch, useSelector } from "react-redux";
import { changeAppliedShopsFilters } from "../../../redux/ducks/shopsFilters";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const ShopByLocation = ({ setShopPageSkip }) => {
  const { areaLists } = useSelector((state) => state.areaLists);

  const [selectedAreaLocation, setSelectedAreaLocation] = useState([]);
  const [allAreaLocationLabel, setAllAreaLocationLabel] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  const [abc, setAbc] = useState(false);

  const dispatch = useDispatch();
  const shopsFiltersReducer = useSelector((state) => state.shopsFiltersReducer);

  useEffect(() => {
    abc &&
      dispatch(
        changeAppliedShopsFilters({
          key: "locations",
          value: {
            selectedValue: selectedData,
          },
        })
      );
  }, [abc, dispatch, selectedData]);

  useEffect(() => {
    shopsFiltersReducer.appliedShopsFilters &&
      setSelectedAreaLocation(
        shopsFiltersReducer.appliedShopsFilters.locations.selectedValue.map(
          (itm) => areaLists.find((i) => i.pin === itm).area
        )
      );
  }, [shopsFiltersReducer.appliedShopsFilters, areaLists]);

  useEffect(() => {
    setAllAreaLocationLabel(areaLists.map((itm) => itm.area));
  }, [areaLists]);

  return (
    <CardInteractive
      cardTitle="Locations"
      bottomComponent={
        <>
          <Autocomplete
            multiple
            options={allAreaLocationLabel}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              setSelectedAreaLocation(newValue);
              setShopPageSkip(0);
              setAbc(true);
              setSelectedData(
                newValue.map(
                  (itm) => areaLists.find((ele) => ele.area === itm)?.pin
                )
              );
            }}
            value={selectedAreaLocation}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Area Location"
                placeholder="Location"
                size="small"
              />
            )}
          />
        </>
      }
    />
  );
};

export default ShopByLocation;
