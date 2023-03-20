import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import Logout from "@mui/icons-material/Logout";

import SearchIcon from "@mui/icons-material/Search";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Badge from "@mui/material/Badge";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import AuthModal from "../core/AuthModal";
import ProfileIcon from "../../assets/profile.png";
import { AuthTypeModal } from "../core/Enum";

import {
  Avatar,
  Checkbox,
  ClickAwayListener,
  Divider,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  loadUserProfileStart,
  userLogout,
} from "../../redux/ducks/userProfile";
import { changeProductsSearchBarData } from "../../redux/ducks/productsFilters";
import { toast } from "react-toastify";
import Router from "next/router";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialog-backdrop": {
    backgroundColor: "#CAA9CD !important",
  },
  "& .MuiDialog-paper": {
    // background:"#95539B",
    // opacity:".5",
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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Header = () => {
  const [open, setOpen] = useState(false);
  const [authTypeModal, setAuthTypeModal] = useState();
  const [accessToken, setAccessToken] = useState();
  const [searchBarValue, setSearchBarValue] = useState("");

  const dispatch = useDispatch();
  const { areaLists } = useSelector((state) => state.areaLists);
  const { userProfile } = useSelector((state) => state.userProfile);
  const [openModel, setOpenModel] = React.useState(false);
  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );
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

  return (
    <>
      <header className="py-4 w-full left-0 top-0 z-20 bg-colorPrimary sticky shadow-sm">
        <div className="container flex items-center justify-between">
          <div className="flex items-center justify-start gap-4">
            <Link href="/">
              <div className="cursor-pointer">
                <h2 className="text-2xl font-normal uppercase cursor-pointer text-colorWhite">
                  <span className="text-4xl">R</span>entbless
                  {/* <span className="text-4xl">B</span>ell */}
                </h2>
                {/* <Image src={HeaderLogo} alt="Rent bless Logo" layout="fill" /> */}
              </div>
            </Link>
            <Autocomplete
              size="small"
              options={areaLists}
              disableCloseOnSelect
              getOptionLabel={(option) => option.area}
              sx={{
                width: 175,
                background: "white",
                borderRadius: "5px",
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.area}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Location"
                />
              )}
            />
          </div>

          <div className="flex items-center gap-5 xl:gap-12">
            <ul className="flex"></ul>

            <ul className="flex items-center gap-3">
              <li className="cursor-pointer">
                <SearchIcon
                  sx={{ color: "white" }}
                  fontSize="large"
                  onClick={handleClickOpen}
                />
              </li>
              <li>
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
              <li>
                {!accessToken && (
                  <div
                    className="flex text-colorWhite cursor-pointer"
                    onClick={() => {
                      setOpen(true), setAuthTypeModal(AuthTypeModal.Signin);
                    }}
                  >
                    <p className="underline hover:scale-105">SingIn / SignUp</p>
                  </div>
                )}
                {accessToken && (
                  <>
                    <UserProfile setAccessToken={setAccessToken} />
                  </>
                )}
              </li>
            </ul>
            <AuthModal
              open={open}
              handleClose={() => {
                setOpen(false);
              }}
              authTypeModal={authTypeModal}
              setAuthTypeModal={setAuthTypeModal}
            />
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
                  <span className="text-4xl">W</span>edding
                  <span className="text-4xl">B</span>ell
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

const UserProfile = ({ setAccessToken }) => {
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
    {
      icon: <FavoriteBorderOutlinedIcon />,
      name: `wishList (${userProfile?.product_like_list?.length})`,

      func: wishList,
    },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];
  if (userProfile.user_type === "vendor") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
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
          <Image src={ProfileIcon} alt="ProfileIcon" layout="fill" />
        </Avatar>
        <span className="font-semibold hidden sm:flex text-colorWhite">
          {userProfile?.first_name + " " + userProfile?.last_name}
        </span>

        <KeyboardArrowDownIcon className="hidden sm:flex text-colorWhite" />
      </div>
      <Popper
        open={anchorElUser}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-end"
        transition
        disablePortal
        className="z-20"
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
                      <Image src={ProfileIcon} alt="ProfileIcon" />
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
