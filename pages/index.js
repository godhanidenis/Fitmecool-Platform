import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loadCategoriesStart } from "../redux/ducks/categories";
import { loadAreaListsStart } from "../redux/ducks/areaLists";
import { withoutAuth } from "../components/core/PrivateRouteForVendor";
import { loadAllShopsListsStart } from "../redux/ducks/shop";
import LandingPage from "../components/sections/LandingPage";

const Home = () => {
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
  return <LandingPage />;
};

export default withoutAuth(Home);
