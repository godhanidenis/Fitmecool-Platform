import React, { useEffect, useState } from "react";
import LandingPage from "../components/sections/LandingPage";
import { useDispatch } from "react-redux";
import { loadCategoriesStart } from "../redux/ducks/categories";
import { loadAreaListsStart } from "../redux/ducks/areaLists";
import { withoutAuth } from "../components/core/PrivateRouteForVendor";
import { loadAllShopsListsStart } from "../redux/ducks/shop";
import HomePage from "../components/sections/HomePage";

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
  return (
    <>
      <LandingPage />
      {/* <HomePage /> */}
    </>
  );
};

export default withoutAuth(Home);
