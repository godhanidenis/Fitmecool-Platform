import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loadCategoriesStart } from "../../redux/ducks/categories";
import { loadAreaListsStart } from "../../redux/ducks/areaLists";
import { loadAllShopsListsStart } from "../../redux/ducks/shop";
import HomePage from "../../components/sections/HomePage";
import { withoutAuth } from "../../components/core/PrivateRouteForVendor";

const HomePagDetail = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    dispatch(loadCategoriesStart());
    dispatch(loadAreaListsStart());
    dispatch(loadAllShopsListsStart());
  }, [dispatch]);

  if (!isHydrated) {
    return null;
  }
  return <HomePage />;
};

export default withoutAuth(HomePagDetail);
