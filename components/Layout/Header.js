import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

import SearchIcon from "@mui/icons-material/Search";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Badge from "@mui/material/Badge";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import ProfileIcon from "../../assets/profile.png";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  ClickAwayListener,
  Divider,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Select,
} from "@mui/material";
import {
  loadUserProfileStart,
  userLogout,
} from "../../redux/ducks/userProfile";
import { changeProductsSearchBarData } from "../../redux/ducks/productsFilters";
import { toast } from "react-toastify";
import Router, { useRouter } from "next/router";
import { useScrollDirection } from "../core/useScrollDirection";
import Sidebar from "./MobileMenu/Sidebar";
import { changeThemeLayout } from "../../redux/ducks/theme";
import { useResizeScreenLayout } from "../core/useScreenResize";
import SubHeader from "./SubHeader";
import InputLabel from "@mui/material/InputLabel";
import LocationIcon from "../../assets/LocationIcon.svg";
import { loadAreaListsStart } from "../../redux/ducks/areaLists";
import { loadCategoriesStart } from "../../redux/ducks/categories";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialog-backdrop": {
    backgroundColor: "#CAA9CD !important",
  },
  "& .MuiDialog-paper": {
    top: "0",
    position: "absolute",
    maxHeight: "50vh",
    height: "50vh",
    width: "100vw",
    maxWidth: "100%",
    margin: "0px",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const Header = () => {
  const [accessToken, setAccessToken] = useState();
  const [searchBarValue, setSearchBarValue] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useDispatch();

  const isScreenWide = useResizeScreenLayout();
  const router = useRouter();

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
  const [selectedLocation, setSelectedLocation] = useState("");

  const { areaLists } = useSelector((state) => state.areaLists);
  const { userProfile } = useSelector((state) => state.userProfile);
  const [openModel, setOpenModel] = React.useState(false);
  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );

  const handleChangeLocation = (event) => {
    setSelectedLocation(event.target.value);
  };

  useEffect(() => {
    dispatch(loadCategoriesStart());
    dispatch(loadAreaListsStart());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    setSearchBarValue(productsFiltersReducer.searchBarData);
  }, [productsFiltersReducer.searchBarData]);

  useEffect(() => {
    const getAccessToken = localStorage.getItem("token");
    setAccessToken(getAccessToken);

    localStorage.getItem("userId") &&
      dispatch(loadUserProfileStart({ id: localStorage.getItem("userId") }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeof window !== "undefined" && localStorage.getItem("token")]);

  const handleClickOpen = () => {
    setOpenModel(true);
  };

  const handleClose = () => {
    setOpenModel(false);
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
          router.pathname === "/vendor/shop-setup" ? "lg:py-4" : "lg:py-0"
        } py-4 w-full bg-colorPrimary shadow-sm z-30 left-0 sticky font-Nova ${
          scrollDirection === "down" ? "-top-32" : "top-0"
        }  transition-all duration-500`}
      >
        <div className="container flex items-center justify-between gap-2">
          <div className="flex items-center justify-start gap-3">
            <MenuIcon
              sx={{ color: "white" }}
              fontSize="large"
              className="lg:!hidden"
              onClick={handleMobileSidebarClick}
            />

            <Link
              href={`${
                userProfile.user_type === "vendor" ? "/vendor/dashboard" : "/"
              }`}
            >
              <div className="cursor-pointer">
                <h2 className="sm:text-2xl text-[18px] font-semibold uppercase cursor-pointer text-colorWhite">
                  <span className="sm:text-4xl text-[24px]">R</span>entbless
                </h2>
              </div>
            </Link>
            {userProfile.user_type !== "vendor" && (
              <div className="headerLocationDiv ml-[24px]">
                <FormControl variant="standard" sx={{ minWidth: 110 }}>
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    className="flex items-center gap-1"
                  >
                    <Image width={20} height={20} src={LocationIcon} alt="" />
                    <span className="text-[#878A99] text-[14px] font-normal">
                      Location
                    </span>
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selectedLocation}
                    onChange={handleChangeLocation}
                    label="Location"
                  >
                    {areaLists?.map((location, index) => (
                      <MenuItem value={location?.pin} key={index}>
                        {location?.area}
                      </MenuItem>
                    ))}
                  </Select>
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
                      onClick={handleClickOpen}
                    />
                  </li>
                  <li className="hidden lg:block">
                    <Link href={`/productLike`} passHref>
                      <IconButton color="inherit">
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
                    </Link>
                  </li>
                </>
              )}
              <li>
                {!accessToken && (
                  <div className="flex text-colorWhite cursor-pointer">
                    <p
                      onClick={() => Router.push("/auth/user-type")}
                      className="underline hover:scale-105 hidden lg:block"
                    >
                      SingIn / SignUp
                    </p>

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

      {openModel && (
        <div
          style={{
            background: "#95539B",
            position: "fixed",
            display: "block",
            width: "100%",
            height: "100%",
            opacity: ".4",
            zIndex: 2,
            cursor: "pointer",
          }}
        >
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openModel}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              <div className="flex justify-center cursor-pointer">
                <h2 className="text-2xl font-normal uppercase cursor-pointer text-[#95539B]">
                  <span className="text-4xl">R</span>entbless
                </h2>
              </div>
            </BootstrapDialogTitle>

            <DialogContent dividers className="flex justify-center p-0">
              <Grid
                container
                direction="column"
                justifyContent="start"
                alignItems="center"
              >
                <Grid item xs={6}>
                  <FormControl
                    sx={{
                      width: 500,
                      background: "white",
                      borderRadius: "5px",
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
                        }
                      }}
                      onChange={(e) => {
                        setSearchBarValue(e.currentTarget.value);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() =>
                              dispatch(
                                changeProductsSearchBarData({
                                  key: "searchBarData",
                                  value: searchBarValue,
                                })
                              )
                            }
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
          </BootstrapDialog>
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
          <Image src={ProfileIcon ?? ""} alt="ProfileIcon" layout="fill" />
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
                    <Avatar className="mb-2 !w-14 !h-14">
                      <Image src={ProfileIcon ?? ""} alt="ProfileIcon" />
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
                    <MenuItem key={itm.name} onClick={handleProfileClose}>
                      <p
                        className="flex items-center w-full text-center"
                        onClick={itm.func}
                      >
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
