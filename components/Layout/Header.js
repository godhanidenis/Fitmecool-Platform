import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CloseIcon from "@mui/icons-material/Close";
// import ProfileIcon from "../../assets/profile.png";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Badge,
  ClickAwayListener,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  Grow,
  IconButton,
  InputAdornment,
  InputLabel,
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
import { useResizeScreenLayout } from "../core/useScreenResize";
import SubHeader from "./SubHeader";
import LocationIcon from "../../assets/LocationIcon.svg";
import { loadAreaListsStart } from "../../redux/ducks/areaLists";
import { loadCategoriesStart } from "../../redux/ducks/categories";
import { CustomDialog, LocationSelect } from "../core/CustomMUIComponents";
import { changeByShopFilters } from "../../redux/ducks/shopsFilters";
import { changeProductPage } from "../../redux/ducks/product";
import AppLogo from "../../assets/logo2.png";

const Header = () => {
  const [accessToken, setAccessToken] = useState();
  const [searchBarValue, setSearchBarValue] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState("");

  const dispatch = useDispatch();

  const isScreenWide = useResizeScreenLayout();
  const router = useRouter();

  const { areaLists } = useSelector((state) => state.areaLists);
  const { userProfile } = useSelector((state) => state.userProfile);
  const { byShop } = useSelector((state) => state.shopsFiltersReducer);

  const [openSearchDialog, setOpenSearchDialog] = useState(false);

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
    dispatch(loadCategoriesStart());
    dispatch(loadAreaListsStart());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const getAccessToken = localStorage.getItem("token");
    setAccessToken(getAccessToken);

    localStorage.getItem("userId") &&
      dispatch(loadUserProfileStart({ id: localStorage.getItem("userId") }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeof window !== "undefined" && localStorage.getItem("token")]);

  const handleSearchDialogClose = () => {
    setSearchBarValue("");
    setOpenSearchDialog(false);
  };

  const handleSearch = (searchData) => {
    ["productColor", "shopId", "categoryId", "searchBarData"].map((itm) =>
      dispatch(
        changeAppliedProductsFilters({
          key: itm,
          value: {
            selectedValue:
              itm === "searchBarData"
                ? searchData
                  ? searchData
                  : searchBarValue
                : [],
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
          userProfile.user_type === "vendor" ? "py-0" : "py-4 sm:py-0"
        } w-full bg-colorPrimary shadow-sm z-30 left-0 sticky font-Nova ${
          scrollDirection === "down" ? "-top-32" : "top-0"
        } transition-all duration-500`}
      >
        <div className="container flex items-center justify-between gap-2">
          <div className="flex items-center justify-start gap-3">
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
            <Link
              href={`${
                userProfile.user_type === "vendor" ? "/vendor/dashboard" : "/"
              }`}
            >
              <div className="cursor-pointer my-2">
                <Image src={AppLogo} alt="logo2.png" width={150} height={50} />
              </div>
            </Link>
            {userProfile.user_type !== "vendor" && (
              <div className="headerLocationDiv ml-2 sm:ml-6">
                <FormControl
                  variant="standard"
                  sx={{ minWidth: 110, borderBottom: "1px solid gray" }}
                >
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    className="!flex !items-center !gap-1"
                  >
                    <Image width={20} height={20} src={LocationIcon} alt="" />
                    <span className="text-[#878A99] text-[14px] font-normal">
                      Location
                    </span>
                  </InputLabel>
                  <LocationSelect
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selectedLocation}
                    onChange={(event) =>
                      setSelectedLocation(event.target.value)
                    }
                    label="Location"
                  >
                    {areaLists?.map((location, index) => (
                      <MenuItem value={location?.pin} key={index}>
                        {location?.area}
                      </MenuItem>
                    ))}
                  </LocationSelect>
                </FormControl>
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
                        router.push(
                          accessToken ? "/productLike" : "/auth/user-type"
                        )
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
                      onClick={() => Router.push("/auth/user-type")}
                      className="hidden lg:block text-white px-3 py-1 sm:px-5 lg:px-3 sm:py-2 lg:py-1 sm:text-lg text-sm rounded-[4px] lg:rounded-md bg-colorGreen"
                    >
                      Login / Register
                    </button>

                    <PersonAddAltIcon
                      sx={{ color: "white" }}
                      fontSize="large"
                      className="lg:!hidden"
                      onClick={() => Router.push("/auth/user-type")}
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
            <DialogTitle m={0} p={2} display="flex">
              <div className="w-full flex items-center justify-center cursor-pointer">
                <h2 className="text-2xl font-normal uppercase cursor-pointer text-colorPrimary">
                  <span className="text-4xl">R</span>entbless
                </h2>
              </div>

              <IconButton onClick={handleSearchDialogClose}>
                <CloseIcon />
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
    </>
  );
};

export default Header;

export const UserProfile = ({ setAccessToken }) => {
  const [anchorElUser, setAnchorElUser] = useState(false);
  const anchorRef = useRef(null);
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.userProfile);

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
    localStorage.clear();
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
    <>
      <div
        ref={anchorRef}
        onClick={handleProfileToggle}
        className="flex items-center justify-between gap-4 cursor-pointer"
      >
        <Avatar>
          {userProfile?.first_name?.charAt(0) +
            userProfile?.last_name?.charAt(0)}
          {/* <Image src={ProfileIcon ?? ""} alt="ProfileIcon" layout="fill" /> */}
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
                    <Avatar className="!mb-2 !w-14 !h-14">
                      {userProfile?.first_name?.charAt(0) +
                        userProfile?.last_name?.charAt(0)}
                      {/* <Image src={ProfileIcon ?? ""} alt="ProfileIcon" /> */}
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
    </>
  );
};
