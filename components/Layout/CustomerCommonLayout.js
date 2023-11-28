import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCategoriesStart } from "../../redux/ducks/categories";
import { loadAreaListsStart } from "../../redux/ducks/areaLists";
import { loadAllShopsListsStart } from "../../redux/ducks/shop";
import { loadCityListsStart } from "../../redux/ducks/cityLists";
import { changeAppliedCityFilters } from "../../redux/ducks/cityFilter";

const CustomerCommonLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { appliedCityFilter } = useSelector(
    (state) => state.cityFiltersReducer
  );

  useEffect(() => {
    dispatch(loadCategoriesStart());
    dispatch(loadCityListsStart());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      loadAllShopsListsStart({ city: appliedCityFilter.city.selectedValue })
    );
  }, [appliedCityFilter.city.selectedValue, dispatch]);

  useEffect(() => {
    const storedLocation = localStorage.getItem("selected_city");

    if (storedLocation) {
      if (storedLocation !== appliedCityFilter?.city?.selectedValue) {
        dispatch(
          changeAppliedCityFilters({
            key: "city",
            value: {
              selectedValue: storedLocation,
            },
          })
        );
      }
      dispatch(loadAreaListsStart(storedLocation));
    } else {
      dispatch(loadAreaListsStart());
    }
  }, [appliedCityFilter?.city?.selectedValue, dispatch]);

  return children;
};

export default CustomerCommonLayout;
