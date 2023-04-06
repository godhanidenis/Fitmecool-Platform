import React, { useState, useEffect } from "react";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

import {
  Avatar,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAppliedProductsFilters,
  changeProductsSearchBarData,
} from "../../../redux/ducks/productsFilters";
import SidebarCategoryFilter from "./SidebarCategoryFilter";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Router from "next/router";
import VendorSidebar from "../../sections/vendor-section/VendorSidebar";
import { userLogout } from "../../../redux/ducks/userProfile";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { toast } from "react-toastify";
import Image from "next/image";
import ProfileIcon from "../../../assets/profile.png";

const Sidebar = ({
  className = "",
  handleMobileSidebarClick,
  accessToken,
  setAccessToken,
  sidebarOpen,
}) => {
  const [searchBarValue, setSearchBarValue] = useState("");

  const [menCategory, setMenCategory] = useState([]);
  const [womenCategory, setWomenCategory] = useState([]);
  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );
  const { categories } = useSelector((state) => state.categories);
  const { userProfile } = useSelector((state) => state.userProfile);
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

  const dispatch = useDispatch();

  useEffect(() => {
    setMenCategory(categories.filter((itm) => itm.category_type === "Men"));
    setWomenCategory(categories.filter((itm) => itm.category_type === "Women"));
  }, [categories]);

  useEffect(() => {
    setSearchBarValue(productsFiltersReducer.searchBarData);
  }, [productsFiltersReducer.searchBarData]);
  const setActiveLink = (id) => {
    return productsFiltersReducer.appliedProductsFilters.categoryId.selectedValue.map(
      (itm) => (itm === id ? "!font-semibold" : "")
    );
  };

  const equalsCheck = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={handleMobileSidebarClick}
          className="fixed w-screen h-screen left-0 top-0 z-40 bg-colorPrimary opacity-20 lg:hidden"
        ></div>
      )}
      <div
        className={`lg:hidden flex flex-col pt-2.5 w-10/12 fixed z-[9999] overflow-auto left-0 top-0 h-screen overflow-y-scroll transition-transform duration-300 bg-colorWhite border-l ${className}`}
      >
        <div className="px-8 py-5 flex items-center gap-2.5 border-b">
          {!accessToken ? (
            <>
              <PersonAddAltIcon sx={{ color: "black" }} fontSize="medium" />
              <div className="text-base flex items-center font-semibold text-[#4a4a4a]">
                SingIn / SignUp
              </div>
            </>
          ) : (
            <div className="flex gap-5 cursor-pointer">
              <Avatar sx={{ width: 56, height: 56 }}>
                <Image src={ProfileIcon ?? "" } alt="ProfileIcon" layout="fill" />
              </Avatar>
              <div className="flex flex-col justify-center">
                <b>{userProfile?.first_name + " " + userProfile?.last_name}</b>
                <span className="font-medium text-base">
                  {userProfile?.user_email?.substring(0, 17) + "..."}
                </span>
              </div>
            </div>
          )}
        </div>

        {userProfile.user_type !== "vendor" && (
          <ul className="flex flex-col pb-5">
            <li className="px-8 py-4 border-b">
              <FormControl
                sx={{
                  background: "white",
                  borderRadius: "5px",
                  width: "100%",
                }}
                variant="outlined"
                size="small"
              >
                <OutlinedInput
                  placeholder="What are you looking for?"
                  value={searchBarValue}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      dispatch(
                        changeProductsSearchBarData({
                          key: "searchBarData",
                          value: searchBarValue,
                        })
                      );
                      handleMobileSidebarClick();
                    }
                  }}
                  onChange={(e) => {
                    setSearchBarValue(e.currentTarget.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => {
                          dispatch(
                            changeProductsSearchBarData({
                              key: "searchBarData",
                              value: searchBarValue,
                            })
                          );
                          handleMobileSidebarClick();
                        }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </li>
            <li className="px-8 py-4 border-b">
              <p
                className="text-[#4a4a4a]"
                onClick={() => {
                  Router.push("/productLike");
                  handleMobileSidebarClick();
                }}
              >
                <FavoriteBorderOutlinedIcon />
                <span className="ml-4">
                  {`Wishlist (${userProfile?.product_like_list?.length || 0})`}
                </span>
              </p>
            </li>
            <li className="px-8 py-4">
              <p className="text-lg text-[#4a4a4a] font-semibold">
                Products Categories
              </p>

              <SidebarCategoryFilter
                title="Men's Category"
                bottomComponent={
                  <>
                    {menCategory?.map((itm, index) => (
                      <p
                        key={itm.id}
                        className={`text-colorBlack p-1 hover:font-semibold ${setActiveLink(
                          itm.id
                        )}`}
                        onClick={() => {
                          dispatch(
                            changeAppliedProductsFilters({
                              key: "categoryId",
                              value: {
                                selectedValue: equalsCheck(
                                  productsFiltersReducer.appliedProductsFilters
                                    .categoryId.selectedValue,
                                  [itm.id]
                                )
                                  ? []
                                  : [itm.id],
                              },
                            })
                          );
                          handleMobileSidebarClick();
                        }}
                      >
                        {itm.category_name}
                      </p>
                    ))}
                  </>
                }
              />

              <SidebarCategoryFilter
                title="Women's Category"
                bottomComponent={
                  <>
                    {womenCategory?.map((itm, index) => (
                      <p
                        key={itm.id}
                        className={`text-colorBlack p-1 hover:font-semibold ${setActiveLink(
                          itm.id
                        )}`}
                        onClick={() => {
                          dispatch(
                            changeAppliedProductsFilters({
                              key: "categoryId",
                              value: {
                                selectedValue: equalsCheck(
                                  productsFiltersReducer.appliedProductsFilters
                                    .categoryId.selectedValue,
                                  [itm.id]
                                )
                                  ? []
                                  : [itm.id],
                              },
                            })
                          );
                          handleMobileSidebarClick();
                        }}
                      >
                        {itm.category_name}
                      </p>
                    ))}
                  </>
                }
              />
            </li>
          </ul>
        )}

        {userProfile.user_type === "vendor" &&
          Router.pathname !== "/vendor/shop-setup" && (
            <VendorSidebar
              vendorShopDetails={vendorShopDetails}
              handleMobileSidebarClick={handleMobileSidebarClick}
            />
          )}

        {accessToken && (
          <div className="fixed bottom-0 w-10/12 left-0 border-t py-4 px-8 bg-colorWhite">
            <p
              className="text-[#4a4a4a]"
              onClick={() => {
                localStorage.clear();
                dispatch(userLogout());
                setAccessToken("");
                Router.push("/");
                handleMobileSidebarClick();

                toast.success("Logout Successfully", {
                  theme: "colored",
                });
              }}
            >
              <ExitToAppIcon /> <span className="ml-4"> Logout</span>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
