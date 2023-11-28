import React, { useEffect, useState, useRef } from "react";
import {
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormGroup,
} from "@mui/material";
import CardInteractive from "../CardInteractive/CardInteractive";
import { useDispatch, useSelector } from "react-redux";
import { changeAppliedShopsFilters } from "../../../redux/ducks/shopsFilters";
import { StyledFormLabelCheckBox } from "../../core/CustomMUIComponents";
import CommonSearchField from "../CommonSearchField";
import ShowMoreLessFilter from "../ShowMoreLessFilter";
import { changeShopPage } from "../../../redux/ducks/shop";
import { scrollToTitleName } from "../../../utils/common";

const ShopByLocation = () => {
  const { areaLists } = useSelector((state) => state.areaLists);

  const [selectedData, setSelectedData] = useState([]);

  const [abc, setAbc] = useState(false);

  const [locationSearchValue, setLocationSearchValue] = useState("");

  const [locationShowMore, setLocationShowMore] = useState(true);

  const dispatch = useDispatch();

  const containerRef = useRef(null);

  const { appliedShopsFilters } = useSelector(
    (state) => state.shopsFiltersReducer
  );

  const [displayedItems, setDisplayedItems] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(10);
  const [fetching, setFetching] = useState(false);

  const fetchMoreItems = () => {
    setFetching(true);
    setTimeout(() => {
      setDisplayLimit((prevLimit) => prevLimit + 10);
      setFetching(false);
    }, 1000);
  };

  useEffect(() => {
    setDisplayedItems(areaLists.slice(0, displayLimit));
  }, [areaLists, displayLimit]);

  useEffect(() => {
    const currentContainerRef = containerRef.current;
    const handleScroll = () => {
      if (
        currentContainerRef &&
        currentContainerRef?.scrollTop + currentContainerRef?.clientHeight >=
          currentContainerRef?.scrollHeight - 20 &&
        !fetching
      ) {
        fetchMoreItems();
      }
    };

    currentContainerRef?.addEventListener("scroll", handleScroll);
    return () => {
      currentContainerRef?.removeEventListener("scroll", handleScroll);
    };
  }, [fetching]);

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
    appliedShopsFilters &&
      setSelectedData(appliedShopsFilters.locations.selectedValue);
  }, [appliedShopsFilters, areaLists]);

  useEffect(() => {
    !locationShowMore && setDisplayLimit(10);
  }, [locationShowMore]);

  const filterData = areaLists?.filter((i) =>
    i?.area.toLowerCase().includes(locationSearchValue.toLowerCase())
  );

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
                  selectedFilterLength={
                    appliedShopsFilters.locations.selectedValue.length
                  }
                  clearDispatched={() => {
                    dispatch(
                      changeAppliedShopsFilters({
                        key: "locations",
                        value: {
                          selectedValue: [],
                        },
                      })
                    );
                    scrollToTitleName();
                  }}
                />
                <div
                  ref={containerRef}
                  className={`flex flex-col overflow-auto ${
                    !locationShowMore && !locationSearchValue && "max-h-[252px]"
                  }`}
                >
                  {(locationSearchValue !== ""
                    ? locationShowMore
                      ? filterData.slice(0, 3)
                      : filterData.slice(0, displayLimit)
                    : locationShowMore
                    ? areaLists.slice(0, 3)
                    : displayedItems
                  )?.map((itm, index) => (
                    <StyledFormLabelCheckBox
                      key={index}
                      value={itm}
                      control={
                        <Checkbox
                          checked={selectedData.some(
                            (item) =>
                              item.area === itm.area && item.pin === itm.pin
                          )}
                          onChange={(event) => {
                            const updatedSelection = selectedData.some(
                              (item) =>
                                item.area === itm.area && item.pin === itm.pin
                            )
                              ? selectedData.filter(
                                  (val) => val.pin !== itm.pin
                                )
                              : [
                                  ...selectedData,
                                  { area: itm.area, pin: itm.pin },
                                ];

                            setSelectedData(updatedSelection);
                            dispatch(changeShopPage(0));
                            setAbc(true);
                            scrollToTitleName();
                          }}
                        />
                      }
                      label={itm.area}
                    />
                  ))}
                  {locationShowMore ||
                    (fetching && (
                      <p className="flex justify-center">
                        <CircularProgress
                          color="secondary"
                          className="!h-5 !w-5"
                        />
                      </p>
                    ))}
                </div>
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
      <Divider sx={{ margin: "12px" }} />
    </>
  );
};

export default ShopByLocation;
