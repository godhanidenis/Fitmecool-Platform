import React, { useEffect, useState } from "react";
import { Checkbox, Divider, FormControl, FormGroup } from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";
import { useDispatch, useSelector } from "react-redux";
import { changeAppliedShopsFilters } from "../../../redux/ducks/shopsFilters";
import { StyledFormLabelCheckBox } from "../../core/CustomMUIComponents";
import CommonSearchField from "../CommonSearchField";
import ShowMoreLessFilter from "../ShowMoreLessFilter";

const ShopByLocation = ({ setShopPageSkip }) => {
  const { areaLists } = useSelector((state) => state.areaLists);

  const [selectedData, setSelectedData] = useState([]);

  const [abc, setAbc] = useState(false);

  const [locationSearchValue, setLocationSearchValue] = useState("");

  const [locationShowMore, setLocationShowMore] = useState(true);

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
    <>
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
                ? locationShowMore
                  ? areaLists
                      ?.filter((i) =>
                        i?.area
                          .toLowerCase()
                          .includes(locationSearchValue.toLowerCase())
                      )
                      .slice(0, 3)
                  : areaLists?.filter((i) =>
                      i?.area
                        .toLowerCase()
                        .includes(locationSearchValue.toLowerCase())
                    )
                : locationShowMore
                ? areaLists.slice(0, 3)
                : areaLists
              )?.map((itm) => (
                <StyledFormLabelCheckBox
                  key={itm.shop_name}
                  value={itm.shop_name}
                  control={
                    <Checkbox
                      checked={selectedData.includes(itm.pin)}
                      onChange={(event) => {
                        const updatedSelection = selectedData.includes(itm.pin)
                          ? selectedData.filter((id) => id !== itm.pin)
                          : [...selectedData, itm.pin];

                        setSelectedData(updatedSelection);
                        setShopPageSkip(0);
                        setAbc(true);
                      }}
                    />
                  }
                  label={itm.area}
                />
              ))}

              {areaLists?.filter((i) =>
                i?.area
                  .toLowerCase()
                  .includes(locationSearchValue.toLowerCase())
              ).length > 3 && (
                <ShowMoreLessFilter
                  value={locationShowMore}
                  onClick={() => setLocationShowMore(!locationShowMore)}
                />
              )}
            </FormGroup>
          </FormControl>
        </>
      }
    />
    <Divider sx={{margin:"12px"}}/>
    </>
    
  );
};

export default ShopByLocation;
