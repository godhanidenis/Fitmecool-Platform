import React, { useEffect, useState } from "react";
import { Checkbox, FormControl, FormGroup } from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";
import { useDispatch, useSelector } from "react-redux";
import { changeAppliedShopsFilters } from "../../../redux/ducks/shopsFilters";
import { StyledFormLabelCheckBox } from "../../core/CustomMUIComponents";
import CommonSearchField from "../CommonSearchField";

const ShopByLocation = ({ setShopPageSkip }) => {
  const { areaLists } = useSelector((state) => state.areaLists);

  const [selectedData, setSelectedData] = useState([]);

  const [abc, setAbc] = useState(false);

  const [locationSearchValue, setLocationSearchValue] = useState("");

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
      setSelectedData(
        shopsFiltersReducer.appliedShopsFilters.locations.selectedValue
      );
  }, [shopsFiltersReducer.appliedShopsFilters, areaLists]);

  return (
    <CardInteractive
      cardTitle="LOCATIONS"
      bottomComponent={
        <>
          <FormControl fullWidth>
            <FormGroup>
              <CommonSearchField
                value={locationSearchValue}
                onChange={(e) => setLocationSearchValue(e.target.value)}
              />
              {(locationSearchValue !== ""
                ? areaLists?.filter((i) =>
                    i?.area
                      .toLowerCase()
                      .includes(locationSearchValue.toLowerCase())
                  )
                : areaLists
              )?.map((itm) => (
                <StyledFormLabelCheckBox
                  key={itm.shop_name}
                  value={itm.shop_name}
                  control={
                    <Checkbox
                      checked={selectedData.includes(itm.id)}
                      onChange={(event) => {
                        const updatedSelection = selectedData.includes(itm.id)
                          ? selectedData.filter((id) => id !== itm.id)
                          : [...selectedData, itm.id];
                        setSelectedData(updatedSelection);
                        setShopPageSkip(0);
                        setAbc(true);
                      }}
                    />
                  }
                  label={itm.area}
                />
              ))}
            </FormGroup>
          </FormControl>
        </>
      }
    />
  );
};

export default ShopByLocation;
