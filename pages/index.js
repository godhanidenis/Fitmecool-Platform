import React, { useEffect, useState } from "react";
import LandingPage from "../components/sections/LandingPage";
import SubHeader from "../components/Layout/SubHeader";
import { useDispatch } from "react-redux";
import { loadCategoriesStart } from "../redux/ducks/categories";
import { loadAreaListsStart } from "../redux/ducks/areaLists";
import { withoutAuth } from "../components/core/PrivateRouteForVendor";

const Home = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    dispatch(loadCategoriesStart());
    dispatch(loadAreaListsStart());
  }, [dispatch]);

  if (!isHydrated) {
    return null;
  }
  return (
    <>
      <SubHeader />
      <LandingPage />
    </>
  );
};

export default withoutAuth(Home);
