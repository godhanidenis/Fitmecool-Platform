import React from "react";
import Router from "next/router";
import { useDispatch } from "react-redux";
import { changeByShopFilters } from "../../../redux/ducks/shopsFilters";

const Errors = ({ error, item }) => {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col justify-center bg-[#F5F5F5] my-10 w-[95%] mx-auto gap-5 h-[calc(100vh-150px)] items-center">
      <h1 className="font-bold animate__animated animate__slideInUp text-3xl">
        {error}
      </h1>
      <p className="text-center">
        Apologies, the requested {item} could not be found. <br /> Please
        navigate to the homepage for more options.
      </p>
      <button
        className="text-colorWhite text-base px-4 py-2 w-60 bg-black rounded-md  whitespace-nowrap"
        onClick={() => {
          item === "shop" && dispatch(changeByShopFilters(true));
          Router.push("/home");
        }}
      >
        Explore Now
      </button>
    </div>
  );
};

export default Errors;
