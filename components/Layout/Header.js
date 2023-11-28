import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Badge,
  CircularProgress,
  ClickAwayListener,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Grow,
  IconButton,
  InputAdornment,
  MenuItem,
  MenuList,
  OutlinedInput,
  Paper,
  Popper,
} from "@mui/material";
import {
  loadUserProfileStart,
  userLogout,
} from "../../redux/ducks/userProfile";
import { changeAppliedProductsFilters } from "../../redux/ducks/productsFilters";
import { toast } from "react-toastify";
import Router, { useRouter } from "next/router";
import { useScrollDirection } from "../core/useScrollDirection";
import Sidebar from "./MobileMenu/Sidebar";
import { changeThemeLayout } from "../../redux/ducks/theme";
import { UseResizeScreenLayout } from "../core/useScreenResize";
import SubHeader from "./SubHeader";
import { CustomDialog } from "../core/CustomMUIComponents";
import {
  changeAppliedShopsFilters,
  changeByShopFilters,
} from "../../redux/ducks/shopsFilters";
import { changeProductPage } from "../../redux/ducks/product";
import AppLogo from "./AppLogo";
import { changeAppliedCityFilters } from "../../redux/ducks/cityFilter";
import { changeShopPage } from "../../redux/ducks/shop";
import FmdGoodIcon from "@mui/icons-material/FmdGood";

const Header = () => {
  const [accessToken, setAccessToken] = useState();
  const [searchBarValue, setSearchBarValue] = useState("");
  const [searchCityValue, setSearchCityValue] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const isScreenWide = UseResizeScreenLayout();
  const router = useRouter();

  const { cityLists } = useSelector((state) => state.cityLists);
  const { userProfile } = useSelector((state) => state.userProfile);
  const { byShop } = useSelector((state) => state.shopsFiltersReducer);

  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [openCityDialog, setOpenCityDialog] = useState(false);

  const { appliedCityFilter } = useSelector(
    (state) => state.cityFiltersReducer
  );

  const handleSearchLocation = (location) => {
    setSelectedLocation(location);
    localStorage.setItem("selected_city", location);
    dispatch(changeProductPage(0));
    dispatch(changeShopPage(0));
    dispatch(
      changeAppliedShopsFilters({
        key: "locations",
        value: { selectedValue: [] },
      })
    );
    dispatch(
      changeAppliedCityFilters({
        key: "city",
        value: {
          selectedValue: location,
        },
      })
    );
    handleCityDialogClose();
  };

  useEffect(() => {
    appliedCityFilter &&
      setSelectedLocation(appliedCityFilter.city.selectedValue);
  }, [appliedCityFilter]);

  useEffect(() => {
    if (!isScreenWide) {
      dispatch(changeThemeLayout("mobileScreen"));
    } else {
      dispatch(changeThemeLayout("webScreen"));
    }
  }, [dispatch, isScreenWide]);

  const handleMobileSidebarClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const getAccessToken = localStorage.getItem("token");
    setAccessToken(getAccessToken);
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(loadUserProfileStart({ id: userId }));
    }
  }, [dispatch]);

  const handleAuthButtonClick = () => {
    setLoading(true);

    router.push({
      pathname: "/auth/user-type",
      query: { redirectPath: new URL(window.location.href).pathname },
    });
  };
  const handleSearchDialogClose = () => {
    setSearchBarValue("");
    setOpenSearchDialog(false);
  };

  const handleCityDialogClose = () => {
    setSearchCityValue("");
    setOpenCityDialog(false);
  };

  const passValueForProduct = (itm, searchBarData) => {
    if (itm === "searchBarData") {
      return searchBarData;
    } else if (itm === "productPrice") {
      return { min: 0, max: 0 };
    } else if (itm === "productListingType") {
      return "";
    } else {
      return [];
    }
  };

  const handleSearch = (searchData) => {
    [
      "productColor",
      "shopId",
      "categoryId",
      "searchBarData",
      "productPrice",
      "productListingType",
    ].map((itm) =>
      dispatch(
        changeAppliedProductsFilters({
          key: itm,
          value: {
            selectedValue: passValueForProduct(
              itm,
              searchData ? searchData : searchBarValue
            ),
          },
        })
      )
    );

    dispatch(changeProductPage(0));
    byShop && dispatch(changeByShopFilters(false));

    handleSearchDialogClose();

    router.pathname !== "/home" && router.push("/home");
  };

  const scrollDirection = useScrollDirection();
  const mobileSidebarStyle = sidebarOpen ? "" : "-translate-x-full";

  return (
    <>
      <Sidebar
        className={`${mobileSidebarStyle}`}
        handleMobileSidebarClick={handleMobileSidebarClick}
        sidebarOpen={sidebarOpen}
        accessToken={accessToken}
        setAccessToken={setAccessToken}
      />
      <header
        className={`${
          userProfile.user_type === "vendor" ? "py-3" : "py-1 sm:py-0"
        } w-full bg-colorPrimary shadow-sm z-30 left-0 sticky font-Nova ${
          scrollDirection === "down" ? "-top-32" : "top-0"
        } transition-all duration-500`}
      >
        <div className="container flex items-center justify-between gap-2">
          <div className="flex items-center justify-start gap-0 sm:gap-3">
            {userProfile.user_type !== "vendor" && (
              <MenuIcon
                sx={{ color: "white" }}
                fontSize="large"
                className="lg:!hidden"
                onClick={handleMobileSidebarClick}
              />
            )}
            {userProfile.user_type === "vendor" &&
              router.pathname !== "/vendor/shop-setup" && (
                <MenuIcon
                  sx={{ color: "white" }}
                  fontSize="large"
                  className="lg:!hidden"
                  onClick={handleMobileSidebarClick}
                />
              )}
            <AppLogo onHeader={true} />
            {userProfile.user_type !== "vendor" && (
              <div className="headerLocationDiv sm:ml-6">
                <div
                  onClick={() => setOpenCityDialog(true)}
                  className="flex gap-1 sm:gap-2 items-center cursor-pointer  p-1 sm:p-2 rounded-md"
                >
                  <FmdGoodIcon className="!text-white !text-[16px]" />
                  <span className="text-white text-[14px] sm:text-[16px] line-clamp-1">
                    {selectedLocation ? selectedLocation : "All Cities"}
                  </span>
                  <button
                    type="button"
                    className={`w-2 sm:w-3 h-2 text-white transition-transform duration-300 ${
                      openCityDialog ? "" : "rotate-180"
                    }`}
                  >
                    <svg
                      width="14"
                      height="8"
                      viewBox="0 0 14 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full overflow-visible"
                    >
                      <path
                        d="M7.42958 0.84392L13.4296 6.17724C13.562 6.29403 13.6427 6.4586 13.654 6.63483C13.6652 6.81107 13.6061 6.98456 13.4896 7.11724C13.3728 7.2497 13.2082 7.33041 13.032 7.34166C12.8558 7.35291 12.6823 7.29378 12.5496 7.17724L6.98958 2.23725L1.42958 7.17724C1.2958 7.285 1.12559 7.33695 0.954433 7.32228C0.783282 7.3076 0.624401 7.22742 0.510918 7.09847C0.397435 6.96951 0.338111 6.80172 0.345313 6.63009C0.352516 6.45847 0.42569 6.29624 0.549578 6.17725L6.54958 0.84392C6.67124 0.737041 6.82764 0.678098 6.98958 0.678098C7.15152 0.678098 7.30792 0.737041 7.42958 0.84392Z"
                        fill="#ffffff"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          {userProfile.user_type !== "vendor" && (
            <div className="font-Nova">
              <SubHeader />
            </div>
          )}
          <div className="flex items-center">
            <ul className="flex items-center gap-2">
              {userProfile.user_type !== "vendor" && (
                <>
                  <li className="cursor-pointer hidden lg:block">
                    <SearchIcon
                      sx={{ color: "white" }}
                      fontSize="large"
                      onClick={() => setOpenSearchDialog(true)}
                    />
                  </li>
                  <li className="hidden lg:block">
                    <IconButton
                      color="inherit"
                      onClick={() =>
                        accessToken
                          ? router.push("/productLike")
                          : router.push({
                              pathname: "/auth/user-type",
                              query: {
                                redirectPath: new URL(window.location.href)
                                  .pathname,
                              },
                            })
                      }
                    >
                      <Badge
                        badgeContent={userProfile?.product_like_list?.length}
                        color="error"
                      >
                        <FavoriteBorderOutlinedIcon
                          sx={{ color: "white" }}
                          fontSize="large"
                        />
                      </Badge>
                    </IconButton>
                  </li>
                </>
              )}
              <li>
                {!accessToken && (
                  <div className="flex text-colorWhite cursor-pointer">
                    <button
                      onClick={handleAuthButtonClick}
                      className="hidden lg:block text-white px-3 py-1 sm:px-5 lg:px-3 sm:py-2 lg:py-1 sm:text-lg text-sm rounded-[4px] lg:rounded-md bg-colorGreen"
                    >
                      <span className="flex items-center gap-2 justify-center">
                        {loading && (
                          <span className="flex items-center">
                            <CircularProgress
                              size={20}
                              color="primary"
                              sx={{ color: "white" }}
                            />
                          </span>
                        )}
                        <span className="flex items-center">
                          Login / Register
                        </span>
                      </span>
                    </button>

                    <PersonAddAltIcon
                      sx={{ color: "white" }}
                      fontSize="large"
                      className="lg:!hidden"
                      onClick={handleAuthButtonClick}
                    />
                  </div>
                )}
                {accessToken && (
                  <>
                    <UserProfile setAccessToken={setAccessToken} />
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      </header>

      {openSearchDialog && (
        <div className="bg-colorPrimary fixed block w-full h-full opacity-50 z-[2] cursor-pointer">
          <CustomDialog
            open={openSearchDialog}
            onClose={handleSearchDialogClose}
          >
            <DialogTitle
              m={0}
              p={2}
              height={72}
              display="flex"
              className="!bg-colorPrimary"
            >
              <div className="w-full flex items-center justify-center cursor-pointer">
                <AppLogo />
              </div>

              <IconButton onClick={handleSearchDialogClose}>
                <CloseIcon className="!text-white" />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers className="flex justify-center p-0">
              <Grid container justifyContent="center">
                <Grid item lg={4} xs={5}>
                  <OutlinedInput
                    placeholder="What are you looking for?"
                    size="small"
                    fullWidth
                    value={searchBarValue}
                    onKeyDown={(e) =>
                      searchBarValue !== "" &&
                      e.key === "Enter" &&
                      handleSearch()
                    }
                    onChange={(e) => setSearchBarValue(e.currentTarget.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            searchBarValue !== "" && handleSearch()
                          }
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <div className="mt-10">
                    <p className="text-lg text-colorPrimary font-Nova font-medium">
                      Popular Searches
                    </p>

                    <div className="flex items-center flex-wrap gap-4 my-5">
                      {[
                        "kurta",
                        "choli",
                        "sherwani",
                        "suit",
                        "sider's choli",
                        "jodhpuri",
                        "black art",
                        "Pretty Marsidise",
                      ].map((itm, index) => (
                        <p
                          className="px-5 py-2 border rounded-3xl cursor-pointer capitalize text-colorPrimary hover:text-colorGreen hover:border-colorGreen"
                          key={index}
                          onClick={() => handleSearch(itm)}
                        >
                          {itm}
                        </p>
                      ))}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </DialogContent>
          </CustomDialog>
        </div>
      )}

      {openCityDialog && (
        <div className="bg-colorPrimary fixed block w-full h-full opacity-50 z-[2] cursor-pointer">
          <CustomDialog
            top={75}
            width="60vw"
            marginX="auto"
            borderRadius={12}
            open={openCityDialog}
            onClose={handleCityDialogClose}
          >
            <DialogContent dividers className="flex justify-center p-0">
              <Grid container justifyContent="center">
                <Grid item xs={12}>
                  <div className="flex gap-2 items-center">
                    <OutlinedInput
                      placeholder="Search city....."
                      size="small"
                      fullWidth
                      value={searchCityValue}
                      onChange={(e) =>
                        setSearchCityValue(e.currentTarget.value)
                      }
                      startAdornment={
                        <InputAdornment position="start">
                          <IconButton edge="start">
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <div>
                      <CloseIcon
                        className="!cursor-pointer"
                        onClick={() => setOpenCityDialog(false)}
                      />
                    </div>
                  </div>
                  <div className="mt-10 flex items-center justify-between flex-wrap">
                    <div className="container flex flex-wrap justify-between">
                      {searchCityValue === "" && (
                        <div
                          className={`${
                            selectedLocation === "" ? "bg-[#00000027]" : ""
                          } w-[125px] lg:w-[180px] xl:w-[200px] 2xl:w-[250px] p-2 mt-1 hover:bg-[#00000027] rounded-md cursor-pointer flex items-center`}
                          onClick={() => handleSearchLocation("")}
                        >
                          <span className="text-[14px] sm:text-[16px] ms-2  font-bold ">
                            All Cities
                          </span>
                        </div>
                      )}
                      {(searchCityValue !== ""
                        ? cityLists?.filter((i) =>
                            i?.city
                              .toLowerCase()
                              .includes(searchCityValue.toLowerCase())
                          )
                        : cityLists.slice(0, 31)
                      )?.map((city, index) => (
                        <div
                          className={`${
                            selectedLocation === city?.city
                              ? "bg-[#00000027]"
                              : ""
                          } w-[125px] lg:w-[180px] xl:w-[200px] 2xl:w-[250px] p-2 mt-1 hover:bg-[#00000027] rounded-md cursor-pointer flex items-center`}
                          key={index}
                          onClick={() => handleSearchLocation(city?.city)}
                        >
                          <span className="text-[14px] sm:text-[16px] ms-2  line-clamp-1">
                            {city?.city}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </DialogContent>
          </CustomDialog>
        </div>
      )}
    </>
  );
};

export default Header;

export const UserProfile = ({ setAccessToken }) => {
  const [anchorElUser, setAnchorElUser] = useState(false);
  const anchorRef = useRef(null);
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.userProfile);
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

  const handleProfileToggle = () => {
    setAnchorElUser((prevOpen) => !prevOpen);
  };

  const handleProfileClose = () => {
    setAnchorElUser(false);
  };

  const options = [
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  if (userProfile.user_type === "vendor" && userProfile.userHaveAnyShop) {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  if (userProfile.user_type !== "vendor") {
    options.unshift({
      icon: <FavoriteBorderOutlinedIcon />,
      name: `wishList (${userProfile?.product_like_list?.length})`,

      func: wishList,
    });
  }

  function dashboard() {
    Router.push("/vendor/dashboard");
  }

  function wishList() {
    Router.push("/productLike");
  }
  function logoutUser() {
    for (let key in localStorage) {
      if (key !== "selected_city") {
        localStorage.removeItem(key);
      }
    }

    dispatch(userLogout());
    setAccessToken("");
    handleProfileClose();
    userProfile.user_type === "vendor" &&
      dispatch(
        changeAppliedProductsFilters({
          key: "shopId",
          value: {
            selectedValue: [],
          },
        })
      );
    Router.push("/");

    toast.success("Logout Successfully", {
      theme: "colored",
    });
  }

  return (
    <div className="flex items-center gap-5">
      {userProfile?.userCreatedShopId && vendorShopDetails && (
        <span className="font-semibold text-yellow-400 text-[12px] sm:text-[16px]">
          Available Products :{" "}
          <span>
            {vendorShopDetails.productLimit -
              vendorShopDetails.balanceProduct || 0}
          </span>
        </span>
      )}
      <div
        ref={anchorRef}
        onClick={handleProfileToggle}
        className="flex items-center justify-between gap-4 cursor-pointer"
      >
        <Avatar
          className="!bg-colorGreen"
          sx={{
            fontSize: "14px",
          }}
        >
          {String(userProfile?.first_name)?.charAt(0).toUpperCase() +
            String(userProfile?.last_name?.charAt(0).toUpperCase())}
        </Avatar>
        <span className="font-semibold hidden text-colorWhite sm:flex">
          {userProfile?.first_name + " " + userProfile?.last_name}
        </span>

        <KeyboardArrowDownIcon className="!hidden !text-colorWhite sm:!flex" />
      </div>
      <Popper
        open={anchorElUser}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-end"
        transition
        disablePortal
        className="z-40"
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-end" ? "left top" : "left bottom",
            }}
          >
            <Paper
              sx={{
                boxShadow: "none",
                overflow: "visible",
                mt: "5px !important",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              }}
            >
              <ClickAwayListener onClickAway={handleProfileClose}>
                <MenuList autoFocusItem={anchorElUser}>
                  <div className="flex flex-col mx-4 my-2 items-center">
                    <Avatar className="!mb-2 !w-14 !h-14 !bg-colorGreen">
                      {String(userProfile?.first_name)
                        ?.charAt(0)
                        .toUpperCase() +
                        String(userProfile?.last_name?.charAt(0).toUpperCase())}
                    </Avatar>
                    <b>
                      {userProfile?.first_name + " " + userProfile?.last_name}
                    </b>
                    <span className="font-medium text-base">
                      {userProfile?.user_email}
                    </span>
                  </div>

                  <Divider />

                  {options.map((itm) => (
                    <MenuItem
                      key={itm.name}
                      onClick={() => {
                        handleProfileClose();
                        itm.func();
                      }}
                    >
                      <p className="flex items-center w-full text-center">
                        {itm.icon} <span className="ml-4"> {itm.name}</span>
                      </p>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};
