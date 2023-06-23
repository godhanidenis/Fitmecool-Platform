import React, { useEffect, useState } from "react";
import { withAuthWithoutShop } from "../../../components/core/PrivateRouteForVendor";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  FormControlLabel,
  Modal,
  Switch,
  styled,
  Radio,
  RadioGroup,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { TbPhotoPlus } from "react-icons/tb";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";

const ShopPage = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  const [selectedOption, setSelectedOption] = useState("Shop");
  const [currentStep, setCurrentStep] = useState(3);
  const [ownerDetails, setOwnerDetails] = useState("Show");
  const [shopDetails, setShopDetails] = useState("Show");
  const [shopTimeDetails, setShopTimeDetails] = useState("Show");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dragging, setDragging] = useState(false);
  const [media, setMedia] = useState(new Array(6).fill(null));
  const [mainBranch, setMainBranch] = useState("Show");
  const [managerDetails, setManagerDetails] = useState("Show");

  const [shopLogo, setShopLogo] = useState("");
  const [uploadShopLogo, setUploadShopLogo] = useState("");

  const [shopBackground, setShopBackground] = useState("");
  const [uploadShopBackground, setUploadShopBackground] = useState("");

  const [shopImages, setShopImages] = useState([]);
  const [uploadShopImages, setUploadShopImages] = useState([]);
  const ShopImgError = shopImages?.filter((item) => item !== undefined);

  const [shopVideo, setShopVideo] = useState("");
  const [uploadShopVideo, setUploadShopVideo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setValue,
    reset,
    watch,
    getValues,
    setError,
    control,
  } = useForm();

  const IOSSwitchMax = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 70,
    height: 35,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 3,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(35px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#2ECA45" : "#29977E",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 28,
      height: 28,
    },
    "& .MuiSwitch-track": {
      borderRadius: 35,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));
  const IOSSwitchMin = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 21,
    height: 13,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 1,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(8px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#2ECA45" : "#29977E",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 11,
      height: 11,
    },
    "& .MuiSwitch-track": {
      borderRadius: 13 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
    outline: "none",
    width: "80%",
  };

  const onShopLogoPreviewImage = (e) => {
    const reader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      setUploadShopLogo(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
      reader.addEventListener("load", (e) => {
        setShopLogo(reader.result);
      });
    }
  };

  const onShopBackgroundPreviewImage = (e) => {
    const reader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      setUploadShopBackground(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
      reader.addEventListener("load", (e) => {
        setShopBackground(reader.result);
      });
    }
  };

  const [SelectImgIndex, setSelectImgIndex] = useState();

  const handleBrowseClickShopImages = (boxId, index) => {
    setSelectImgIndex(index);
    document.getElementById(boxId).click();
  };

  const createShopImagesChange = (e) => {
    const files = Array.from(e.target.files);
    let resImgIndex = SelectImgIndex;

    let uploadShopImagesData = uploadShopImages;
    let shopImagesData = shopImages;

    uploadShopImagesData[resImgIndex] = files[0];
    setUploadShopImages(() => [...uploadShopImagesData]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        shopImagesData[resImgIndex] = reader.result;
        setShopImages(() => [...shopImagesData]);
      };
    });
  };

  const onShopVideoPreview = (e) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      setUploadShopVideo(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
      reader.addEventListener("load", (e) => {
        setShopVideo(reader.result);
      });
    }
  };

  const handleOwnerDetails = (option) => {
    setOwnerDetails(option);
  };

  const handleShopDetails = (option) => {
    setShopDetails(option);
  };

  const handleShopTimeDetails = (option) => {
    setShopTimeDetails(option);
  };

  const handleClick = (option) => {
    setSelectedOption(option);
  };

  //   const handleDragEnter = (e) => {
  //     e.preventDefault();
  //     setDragging(true);
  //   };

  //   const handleDragLeave = (e) => {
  //     e.preventDefault();
  //     setDragging(false);
  //   };

  //   const handleDragOver = (e) => {
  //     e.preventDefault();
  //   };

  //   const handleDrop = (e, boxIndex) => {
  //     e.preventDefault();
  //     setDragging(false);
  //     const file = e.dataTransfer.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         const updatedMedia = [...media];
  //         updatedMedia[boxIndex] = reader.result;
  //         setMedia(updatedMedia);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  const handleBrowseClick = (boxIndex) => {
    document.getElementById(`file-input-${boxIndex}`).click();
  };

  //   const handleFileChange = (e, boxIndex) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         const updatedMedia = [...media];
  //         updatedMedia[boxIndex] = reader.result;
  //         setMedia(updatedMedia);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  const handleMainBranchDetails = (option) => {
    setMainBranch(option);
  };
  const handleManagerDetails = (option) => {
    setManagerDetails(option);
  };

  const onSubmit = (data) => {
    if (currentStep !== 3) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Data To be Submitted !!", data);
    }
  };

  const onError = (errors) => console.log("Errors Occurred !! :", errors);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <div className="w-full">
        <div className="sm:h-[683px] h-[452px] relative">
          <img
            src="https://thumbs.dreamstime.com/b/clothes-hangers-colorful-clothes-women-shop-summer-sale-73852501.jpg"
            className="w-full h-full"
            alt=""
          />
          <div class="absolute inset-0 bg-black mix-blend-darken opacity-80"></div>
        </div>
        <div className="relative -mt-[37rem] container">
          <div className="text-gray-400 sm:text-5xl text-3xl flex  items-center flex-col gap-4">
            <div>
              <span className="text-white font-semibold">Selling</span> Only The
            </div>
            <div>
              Best Things{" "}
              <span className="text-white font-semibold">Online</span>
            </div>
          </div>
          <div className="flex justify-center mt-16 gap-3">
            <button
              className={`text-gray-400 sm:text-2xl sm:py-3  sm:px-14  py-2 text-lg px-8 ${
                selectedOption === "Shop" &&
                "bg-colorGreen rounded-md text-white"
              }`}
              onClick={() => handleClick("Shop")}
            >
              Shop
            </button>
            <button
              className={`text-gray-400 sm:text-2xl sm:py-3  sm:px-14  py-2 text-lg px-8 ${
                selectedOption === "Individual" &&
                "bg-colorGreen rounded-md text-white"
              }`}
              onClick={() => handleClick("Individual")}
            >
              Individual
            </button>
          </div>
          <div className="w-[90%] bg-white mx-auto my-16 p-5 sm:p-10 rounded-md">
            <div className="">
              <div className="flex justify-evenly sm:mb-10 mb-3">
                <div className="font-semibold sm:text-2xl text-sm">Details</div>
                <div
                  className={`sm:text-2xl text-sm ${
                    currentStep >= 2 ? "font-semibold" : "text-gray-400"
                  }`}
                >
                  Photos
                </div>
                <div
                  className={`sm:text-2xl text-sm ${
                    currentStep >= 3 ? "font-semibold" : "text-gray-400"
                  }`}
                >
                  Branches
                </div>
              </div>

              <div className="flex items-center">
                <hr className="sm:h-1 h-[3px] bg-colorGreen w-1/4" />
                {currentStep > 1 ? (
                  <span className="sm:h-8 sm:w-8 h-4 w-4 rounded-full bg-white text-center border-[3px] sm:border-[6px] border-colorGreen">
                    <span className="hidden sm:inline">
                      <DoneIcon
                        className="text-colorGreen mb-2"
                        fontSize="small"
                      />
                    </span>
                    <span className="sm:hidden">
                      <DoneIcon
                        className="text-colorGreen sm:mb-2 mb-10"
                        sx={{ fontSize: 10 }}
                      />
                    </span>
                  </span>
                ) : (
                  <span className="sm:h-8 sm:w-8 h-4 w-4 rounded-full bg-white text-center border-[3px] sm:border-[6px]  border-colorGreen"></span>
                )}

                {currentStep === 2 ? (
                  <>
                    <hr className="sm:h-1 h-[3px] bg-colorGreen w-1/4" />
                    <span className="sm:h-8 sm:w-8 h-4 w-4  rounded-full bg-white text-center border-[3px] sm:border-[6px] border-colorGreen"></span>
                  </>
                ) : currentStep > 2 ? (
                  <>
                    <hr className="sm:h-1 h-[3px] bg-colorGreen w-1/4" />
                    <span className="sm:h-8 sm:w-8 h-4 w-4 rounded-full bg-white text-center border-[3px] sm:border-[6px] border-colorGreen">
                      <span className="hidden sm:inline">
                        <DoneIcon
                          className="text-colorGreen mb-2"
                          fontSize="small"
                        />
                      </span>
                      <span className="sm:hidden">
                        <DoneIcon
                          className="text-colorGreen sm:mb-2 mb-10"
                          sx={{ fontSize: 10 }}
                        />
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <hr className="sm:h-1 h-[3px] bg-gray-200 w-1/4" />
                    <span className="sm:h-8 sm:w-8 h-4 w-4 rounded-full bg-gray-200 text-center sm:pt-1 sm:text-sm text-[10px]">
                      2
                    </span>
                  </>
                )}
                {currentStep === 3 ? (
                  <>
                    <hr className="sm:h-1 h-[3px] bg-colorGreen w-1/4" />
                    <span className="sm:h-8 sm:w-8 h-4 w-4  rounded-full bg-white text-center border-[3px] sm:border-[6px] border-colorGreen"></span>
                  </>
                ) : (
                  <>
                    <hr className="sm:h-1 h-[3px] bg-gray-200 w-1/4" />
                    <span className="sm:h-8 sm:w-8 h-4 w-4 rounded-full bg-gray-200 text-center sm:pt-1  sm:text-sm text-[10px]">
                      3
                    </span>
                  </>
                )}
                <hr className="sm:h-1 h-[3px] bg-gray-200 w-1/4" />
              </div>
            </div>

            {currentStep === 1 && (
              <>
                <div className="sm:mx-10 mx-3">
                  <div className="flex my-10">
                    {ownerDetails === "Show" ? (
                      <KeyboardArrowUpIcon
                        onClick={() => handleOwnerDetails("Hide")}
                        className="cursor-pointer"
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        onClick={() => handleOwnerDetails("Show")}
                        className="cursor-pointer"
                      />
                    )}
                    <div className="uppercase font-semibold sm:text-lg text-sm">
                      Owner Details
                    </div>
                  </div>
                  <div
                    className={`space-y-10 ${
                      ownerDetails === "Hide" && "hidden"
                    }`}
                  >
                    <div className="w-full flex sm:flex-row sm:gap-4 flex-col gap-8">
                      <div className="sm:w-1/2 relative w-full">
                        <label
                          htmlFor="fName"
                          className="absolute -top-4 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          First Name
                          <span className="required text-red-500 pl-2 sm:text-2xl text-lg">
                            *
                          </span>
                        </label>
                        <input
                          type="text"
                          id="fName"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="Your first name"
                          {...register("first_name", {
                            required: "First name is required",
                          })}
                        />
                        {errors.first_name && (
                          <div className="mt-2">
                            <span style={{ color: "red" }}>
                              {errors.first_name?.message}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="sm:w-1/2 relative w-full">
                        <label
                          htmlFor="lName"
                          className="absolute -top-4 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          Last Name
                          <span className="required text-red-500 pl-2 sm:text-2xl text-lg">
                            *
                          </span>
                        </label>
                        <input
                          type="text"
                          id="lName"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="Your last name"
                          {...register("last_name", {
                            required: "Last name is required",
                          })}
                        />
                        {errors.last_name && (
                          <div className="mt-2">
                            <span style={{ color: "red" }}>
                              {errors.last_name?.message}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full relative">
                      <label
                        htmlFor="email"
                        className="absolute -top-4 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                      >
                        E-Mail
                        <span className="required text-red-500 pl-2 sm:text-2xl text-lg">
                          *
                        </span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                        placeholder="yourmail@gmail.com"
                        {...register("user_email", {
                          required: "Email is required",

                          pattern: {
                            value:
                              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Please enter a valid email",
                          },
                        })}
                      />
                      {errors.user_email && (
                        <div className="mt-2">
                          <span style={{ color: "red" }}>
                            {errors.user_email?.message}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="w-full relative">
                      <label
                        htmlFor="phone"
                        className="absolute -top-4 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                      >
                        Phone Number
                        <span className="required text-red-500 pl-2 sm:text-2xl text-lg">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        id=""
                        className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                        placeholder="Your phone number"
                        {...register("user_contact", {
                          required: "Contact number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Please enter a valid mobile number",
                          },
                        })}
                      />
                      {errors.user_contact && (
                        <div className="mt-2">
                          <span style={{ color: "red" }}>
                            {errors.user_contact?.message}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex my-10">
                    {shopDetails === "Show" ? (
                      <KeyboardArrowUpIcon
                        onClick={() => handleShopDetails("Hide")}
                        className="cursor-pointer"
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        onClick={() => handleShopDetails("Show")}
                        className="cursor-pointer"
                      />
                    )}
                    <div className="uppercase font-semibold sm:text-lg text-sm">
                      Shop info
                    </div>
                  </div>
                  <div
                    className={`space-y-10 ${
                      shopDetails === "Hide" && "hidden"
                    }`}
                  >
                    <div className="w-full relative">
                      <label
                        htmlFor="shopName"
                        className="absolute -top-4 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                      >
                        Shop Name
                        <span className="required text-red-500 pl-2 sm:text-2xl text-lg">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        id="shopName"
                        className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                        placeholder="Your shop name"
                        {...register("shop_name", {
                          required: "Shop name is required",
                        })}
                      />
                      {errors.shop_name && (
                        <div className="mt-2">
                          <span style={{ color: "red" }}>
                            {errors.shop_name?.message}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="w-full relative">
                      <label
                        htmlFor="shopEmail"
                        className="absolute -top-4 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                      >
                        Shop Email
                        <span className="required text-red-500 pl-2 sm:text-2xl text-lg">
                          *
                        </span>
                      </label>
                      <input
                        type="email"
                        id="shopEmail"
                        className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                        placeholder="Your shop email"
                        {...register("shop_email", {
                          required: "Shop email is required",

                          pattern: {
                            value:
                              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Please enter a valid email",
                          },
                        })}
                      />
                      {errors.shop_email && (
                        <div className="mt-2">
                          <span style={{ color: "red" }}>
                            {errors.shop_email?.message}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="w-full relative">
                      <label
                        htmlFor="personalWebLink1"
                        className="absolute sm:-top-4 -top-3 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                      >
                        Personal Website Link
                      </label>
                      <input
                        type="text"
                        id="personalWebLink1"
                        className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                        placeholder="Personal Website Link"
                        {...register("personal_website", {
                          // required: "Personal Website is required",
                        })}
                      />
                      {errors.personal_website && (
                        <div className="mt-2">
                          <span style={{ color: "red" }}>
                            {errors.personal_website?.message}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="w-full flex gap-4 max-md:flex-col max-md:gap-8">
                      <div className="w-1/2 relative max-md:w-full">
                        <label
                          htmlFor="fbLink"
                          className="absolute sm:-top-4 -top-3 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          Fackbook Link
                        </label>
                        <input
                          type="text"
                          id="fbLink"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="Your facebook link"
                          {...register("facebook_link", {
                            // required: "Facebook Link is required",
                          })}
                        />
                        {errors.facebook_link && (
                          <div className="mt-2">
                            <span style={{ color: "red" }}>
                              {errors.facebook_link?.message}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="w-1/2 relative max-md:w-full">
                        <label
                          htmlFor="igLink"
                          className="absolute sm:-top-4 -top-3 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          Instagram Link
                        </label>
                        <input
                          type="text"
                          id="igLink"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="Your instagram link"
                          {...register("instagram_link", {
                            // required: "Instagram Link is required",
                          })}
                        />
                        {errors.instagram_link && (
                          <div className="mt-2">
                            <span style={{ color: "red" }}>
                              {errors.instagram_link?.message}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center my-10">
                    <div className="flex">
                      {shopTimeDetails === "Show" ? (
                        <KeyboardArrowUpIcon
                          onClick={() => handleShopTimeDetails("Hide")}
                          className="cursor-pointer"
                        />
                      ) : (
                        <KeyboardArrowDownIcon
                          onClick={() => handleShopTimeDetails("Show")}
                          className="cursor-pointer"
                        />
                      )}
                      <div className="uppercase font-semibold sm:text-lg text-sm">
                        Shop Open/Close Time
                      </div>
                    </div>
                    <div
                      className="flex gap-2 mr-4 items-center cursor-pointer"
                      onClick={handleOpen}
                    >
                      <EditIcon fontSize="small" className="text-gray-400" />
                      <div className="text-gray-400 sm:text-lg text-sm">
                        Edit
                      </div>
                    </div>
                  </div>
                  <div
                    className={`space-y-10 ${
                      shopTimeDetails === "Hide" && "hidden"
                    }`}
                  >
                    <div className="w-full grid sm:grid-cols-3 gap-y-8 gap-4 grid-cols-2">
                      <div className="relative">
                        <label
                          htmlFor="sunday"
                          className="absolute sm:-top-4 -top-3 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          Sunday
                        </label>
                        <input
                          type="text"
                          id="sunday"
                          value="09:00 AM - 08:00 PM"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="09:00 AM - 08:00 PM"
                          readOnly
                        />
                      </div>
                      <div className="relative ">
                        <label
                          htmlFor="monday"
                          className="absolute sm:-top-4 -top-3 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          Monday
                        </label>
                        <input
                          type="text"
                          id="monday"
                          value="09:00 AM - 08:00 PM"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="09:00 AM - 08:00 PM"
                          readOnly
                        />
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="tuesday"
                          className="absolute sm:-top-4 -top-3 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          Tuesday
                        </label>
                        <input
                          type="text"
                          id="tuesday"
                          value="09:00 AM - 08:00 PM"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="09:00 AM - 08:00 PM"
                          readOnly
                        />
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="wednesday"
                          className="absolute sm:-top-4 -top-3 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          Wednesday
                        </label>
                        <input
                          type="text"
                          id="wednesday"
                          value="09:00 AM - 08:00 PM"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="09:00 AM - 08:00 PM"
                          readOnly
                        />
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="thursday"
                          className="absolute sm:-top-4 -top-3 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          Thursday
                        </label>
                        <input
                          type="text"
                          id="thursday"
                          value="09:00 AM - 08:00 PM"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="09:00 AM - 08:00 PM"
                          readOnly
                        />
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="friday"
                          className="absolute sm:-top-4 -top-3 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          Friday
                        </label>
                        <input
                          type="text"
                          id="friday"
                          value="09:00 AM - 08:00 PM"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="09:00 AM - 08:00 PM"
                          readOnly
                        />
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="saturday"
                          className="absolute sm:-top-4 -top-3 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          Saturday
                        </label>
                        <input
                          type="text"
                          id="saturday"
                          value="09:00 AM - 08:00 PM"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="09:00 AM - 08:00 PM"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <ActionButtons
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    onError={onError}
                  />
                </div>
                <Modal
                  open={open}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style} className="max-h-[80vh] overflow-y-auto">
                    <div className="sm:p-5 lg:p-5 xl:p-10 p-1">
                      <div className="flex justify-between items-center">
                        <div className="sm:text-2xl lg:text-3xl xl:text-5xl text-[16px] font-bold">
                          Hours
                        </div>
                        <span className="hidden sm:block">
                          <CloseIcon
                            className="text-gray-500"
                            fontSize="large"
                            onClick={handleClose}
                          />
                        </span>
                        <span className="sm:hidden">
                          <CloseIcon
                            className="text-gray-500"
                            fontSize="small"
                            onClick={handleClose}
                          />
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-y-5 my-5 xl:my-14 lg:my-10 sm:my-7">
                        <div className="flex sm:items-center items-start w-full lg:gap-5 xl:gap-10 sm:gap-16 gap-2">
                          <div className="xl:w-[45%] lg:w-[40%] w-[50%] flex  xl:gap-32  items-center">
                            <div className="xl:text-3xl w-[60%] max-[400px]:w-[65%] lg:text-2xl sm:text-lg text-xs font-semibold">
                              Sunday
                            </div>
                            <div className="flex items-center  w-[40%] max-[400px]:w-[35%]">
                              <span className="hidden md:block">
                                <FormControlLabel
                                  control={
                                    <IOSSwitchMax
                                      sx={{ m: 0 }}
                                      defaultChecked
                                    />
                                  }
                                />
                              </span>
                              <span className="md:hidden">
                                <FormControlLabel
                                  control={
                                    <IOSSwitchMin
                                      sx={{ m: 0 }}
                                      defaultChecked
                                    />
                                  }
                                />
                              </span>

                              <span className="xl:text-2xl lg:text-xl sm:text-lg text-xs -ml-2 sm:ml-0 font-semibold">
                                Open
                              </span>
                            </div>
                          </div>
                          <div className="xl:w-[55%] lg:w-[60%] w-[50%] flex gap-4 sm:items-center items-start">
                            <div className="flex lg:gap-4 gap-2 lg:flex-row flex-col">
                              <div className="relative">
                                <span className="absolute top-1 sm:text-xs text-[6px] font-semibold sm:left-10 left-5">
                                  Start with
                                </span>
                                <input
                                  type="time"
                                  id="saturday"
                                  className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3  text-xs  xl:text-2xl sm:text-xl font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                                />
                              </div>
                              <div className="relative">
                                <span className="absolute top-1 sm:text-xs text-[6px] font-semibold sm:left-10 left-5">
                                  End with
                                </span>
                                <input
                                  type="time"
                                  id="saturday"
                                  className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3  text-xs  xl:text-2xl sm:text-xl font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                                />
                              </div>
                            </div>
                            <span className="border border-gray-200 rounded-full text-gray-400 hidden sm:block hover:text-white xl:ml-10  hover:bg-colorGreen hover:border-colorGreen">
                              <EditIcon className="m-3" />
                            </span>
                            <span className="border border-gray-200 rounded-full sm:hidden text-gray-400  hover:text-white hover:bg-colorGreen hover:border-colorGreen">
                              <EditIcon fontSize="small" className="m-1" />
                            </span>
                          </div>
                        </div>
                        <div className="flex sm:items-center items-start w-full lg:gap-5 xl:gap-10 sm:gap-16 gap-2">
                          <div className="xl:w-[45%] lg:w-[40%] w-[50%] flex  xl:gap-32  items-center">
                            <div className="xl:text-3xl w-[60%] max-[400px]:w-[65%] lg:text-2xl sm:text-lg text-xs font-semibold">
                              Monday
                            </div>
                            <div className="flex items-center  w-[40%] max-[400px]:w-[35%]">
                              <span className="hidden md:block">
                                <FormControlLabel
                                  control={
                                    <IOSSwitchMax
                                      sx={{ m: 0 }}
                                      defaultChecked
                                    />
                                  }
                                />
                              </span>
                              <span className="md:hidden">
                                <FormControlLabel
                                  control={
                                    <IOSSwitchMin
                                      sx={{ m: 0 }}
                                      defaultChecked
                                    />
                                  }
                                />
                              </span>

                              <span className="xl:text-2xl lg:text-xl sm:text-lg text-xs -ml-2 sm:ml-0 font-semibold">
                                Open
                              </span>
                            </div>
                          </div>
                          <div className="xl:w-[55%] lg:w-[60%] w-[50%] flex gap-4 sm:items-center items-start">
                            <div className="flex lg:gap-4 gap-2 lg:flex-row flex-col">
                              <div className="relative">
                                <span className="absolute top-1 sm:text-xs text-[6px] font-semibold sm:left-10 left-5">
                                  Start with
                                </span>
                                <input
                                  type="time"
                                  id="saturday"
                                  className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3  text-xs  xl:text-2xl sm:text-xl font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                                />
                              </div>
                              <div className="relative">
                                <span className="absolute top-1 sm:text-xs text-[6px] font-semibold sm:left-10 left-5">
                                  End with
                                </span>
                                <input
                                  type="time"
                                  id="saturday"
                                  className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3  text-xs  xl:text-2xl sm:text-xl font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                                />
                              </div>
                            </div>
                            <span className="border border-gray-200 rounded-full text-gray-400 hidden sm:block hover:text-white xl:ml-10  hover:bg-colorGreen hover:border-colorGreen">
                              <EditIcon className="m-3" />
                            </span>
                            <span className="border border-gray-200 rounded-full sm:hidden text-gray-400  hover:text-white hover:bg-colorGreen hover:border-colorGreen">
                              <EditIcon fontSize="small" className="m-1" />
                            </span>
                          </div>
                        </div>
                        <div className="flex sm:items-center items-start w-full lg:gap-5 xl:gap-10 sm:gap-16 gap-2">
                          <div className="xl:w-[45%] lg:w-[40%] w-[50%] flex  xl:gap-32  items-center">
                            <div className="xl:text-3xl w-[60%] max-[400px]:w-[65%] lg:text-2xl sm:text-lg text-xs font-semibold">
                              Tuesday
                            </div>
                            <div className="flex items-center  w-[40%] max-[400px]:w-[35%]">
                              <span className="hidden md:block">
                                <FormControlLabel
                                  control={
                                    <IOSSwitchMax
                                      sx={{ m: 0 }}
                                      defaultChecked
                                    />
                                  }
                                />
                              </span>
                              <span className="md:hidden">
                                <FormControlLabel
                                  control={
                                    <IOSSwitchMin
                                      sx={{ m: 0 }}
                                      defaultChecked
                                    />
                                  }
                                />
                              </span>

                              <span className="xl:text-2xl lg:text-xl sm:text-lg text-xs -ml-2 sm:ml-0 font-semibold">
                                Open
                              </span>
                            </div>
                          </div>
                          <div className="xl:w-[55%] lg:w-[60%] w-[50%] flex gap-4 sm:items-center items-start">
                            <div className="flex lg:gap-4 gap-2 lg:flex-row flex-col">
                              <div className="relative">
                                <span className="absolute top-1 sm:text-xs text-[6px] font-semibold sm:left-10 left-5">
                                  Start with
                                </span>
                                <input
                                  type="time"
                                  id="saturday"
                                  className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3  text-xs  xl:text-2xl sm:text-xl font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                                />
                              </div>
                              <div className="relative">
                                <span className="absolute top-1 sm:text-xs text-[6px] font-semibold sm:left-10 left-5">
                                  End with
                                </span>
                                <input
                                  type="time"
                                  id="saturday"
                                  className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3  text-xs  xl:text-2xl sm:text-xl font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                                />
                              </div>
                            </div>
                            <span className="border border-gray-200 rounded-full text-gray-400 hidden sm:block hover:text-white xl:ml-10  hover:bg-colorGreen hover:border-colorGreen">
                              <EditIcon className="m-3" />
                            </span>
                            <span className="border border-gray-200 rounded-full sm:hidden text-gray-400  hover:text-white hover:bg-colorGreen hover:border-colorGreen">
                              <EditIcon fontSize="small" className="m-1" />
                            </span>
                          </div>
                        </div>
                        <div className="flex sm:items-center items-start w-full lg:gap-5 xl:gap-10 sm:gap-16 gap-2">
                          <div className="xl:w-[45%] lg:w-[40%] w-[50%] flex  xl:gap-32  items-center">
                            <div className="xl:text-3xl w-[60%] max-[400px]:w-[65%] lg:text-2xl sm:text-lg text-xs font-semibold">
                              Wednesday
                            </div>
                            <div className="flex items-center  w-[40%] max-[400px]:w-[35%]">
                              <span className="hidden md:block">
                                <FormControlLabel
                                  control={
                                    <IOSSwitchMax
                                      sx={{ m: 0 }}
                                      defaultChecked
                                    />
                                  }
                                />
                              </span>
                              <span className="md:hidden">
                                <FormControlLabel
                                  control={
                                    <IOSSwitchMin
                                      sx={{ m: 0 }}
                                      defaultChecked
                                    />
                                  }
                                />
                              </span>

                              <span className="xl:text-2xl lg:text-xl sm:text-lg text-xs -ml-2 sm:ml-0 font-semibold">
                                Open
                              </span>
                            </div>
                          </div>
                          <div className="xl:w-[55%] lg:w-[60%] w-[50%] flex gap-4 sm:items-center items-start">
                            <div className="flex lg:gap-4 gap-2 lg:flex-row flex-col">
                              <div className="relative">
                                <span className="absolute top-1 sm:text-xs text-[6px] font-semibold sm:left-10 left-5">
                                  Start with
                                </span>
                                <input
                                  type="time"
                                  id="saturday"
                                  className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3  text-xs  xl:text-2xl sm:text-xl font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                                />
                              </div>
                              <div className="relative">
                                <span className="absolute top-1 sm:text-xs text-[6px] font-semibold sm:left-10 left-5">
                                  End with
                                </span>
                                <input
                                  type="time"
                                  id="saturday"
                                  className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3  text-xs  xl:text-2xl sm:text-xl font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                                />
                              </div>
                            </div>
                            <span className="border border-gray-200 rounded-full text-gray-400 hidden sm:block hover:text-white xl:ml-10  hover:bg-colorGreen hover:border-colorGreen">
                              <EditIcon className="m-3" />
                            </span>
                            <span className="border border-gray-200 rounded-full sm:hidden text-gray-400  hover:text-white hover:bg-colorGreen hover:border-colorGreen">
                              <EditIcon fontSize="small" className="m-1" />
                            </span>
                          </div>
                        </div>
                        <div className="flex sm:items-center items-start w-full lg:gap-5 xl:gap-10 sm:gap-16 gap-2">
                          <div className="xl:w-[45%] lg:w-[40%] w-[50%] flex  xl:gap-32  items-center">
                            <div className="xl:text-3xl w-[60%] max-[400px]:w-[65%] lg:text-2xl sm:text-lg text-xs font-semibold">
                              Thursday
                            </div>
                            <div className="flex items-center  w-[40%] max-[400px]:w-[35%]">
                              <span className="hidden md:block">
                                <FormControlLabel
                                  control={
                                    <IOSSwitchMax
                                      sx={{ m: 0 }}
                                      defaultChecked
                                    />
                                  }
                                />
                              </span>
                              <span className="md:hidden">
                                <FormControlLabel
                                  control={
                                    <IOSSwitchMin
                                      sx={{ m: 0 }}
                                      defaultChecked
                                    />
                                  }
                                />
                              </span>

                              <span className="xl:text-2xl lg:text-xl sm:text-lg text-xs -ml-2 sm:ml-0 font-semibold">
                                Open
                              </span>
                            </div>
                          </div>
                          <div className="xl:w-[55%] lg:w-[60%] w-[50%] flex gap-4 sm:items-center items-start">
                            <div className="flex lg:gap-4 gap-2 lg:flex-row flex-col">
                              <div className="relative">
                                <span className="absolute top-1 sm:text-xs text-[6px] font-semibold sm:left-10 left-5">
                                  Start with
                                </span>
                                <input
                                  type="time"
                                  id="saturday"
                                  className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3  text-xs  xl:text-2xl sm:text-xl font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                                />
                              </div>
                              <div className="relative">
                                <span className="absolute top-1 sm:text-xs text-[6px] font-semibold sm:left-10 left-5">
                                  End with
                                </span>
                                <input
                                  type="time"
                                  id="saturday"
                                  className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3  text-xs  xl:text-2xl sm:text-xl font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                                />
                              </div>
                            </div>
                            <span className="border border-gray-200 rounded-full text-gray-400 hidden sm:block hover:text-white xl:ml-10  hover:bg-colorGreen hover:border-colorGreen">
                              <EditIcon className="m-3" />
                            </span>
                            <span className="border border-gray-200 rounded-full sm:hidden text-gray-400  hover:text-white hover:bg-colorGreen hover:border-colorGreen">
                              <EditIcon fontSize="small" className="m-1" />
                            </span>
                          </div>
                        </div>
                        <div className="flex sm:items-center items-start w-full lg:gap-5 xl:gap-10 sm:gap-16 gap-2">
                          <div className="xl:w-[45%] lg:w-[40%] w-[50%] flex  xl:gap-32  items-center">
                            <div className="xl:text-3xl w-[60%] max-[400px]:w-[65%] lg:text-2xl sm:text-lg text-xs font-semibold">
                              Friday
                            </div>
                            <div className="flex items-center  w-[40%] max-[400px]:w-[35%]">
                              <span className="hidden md:block">
                                <FormControlLabel
                                  control={
                                    <IOSSwitchMax
                                      sx={{ m: 0 }}
                                      defaultChecked
                                    />
                                  }
                                />
                              </span>
                              <span className="md:hidden">
                                <FormControlLabel
                                  control={
                                    <IOSSwitchMin
                                      sx={{ m: 0 }}
                                      defaultChecked
                                    />
                                  }
                                />
                              </span>

                              <span className="xl:text-2xl lg:text-xl sm:text-lg text-xs -ml-2 sm:ml-0 font-semibold">
                                Open
                              </span>
                            </div>
                          </div>
                          <div className="xl:w-[55%] lg:w-[60%] w-[50%] flex gap-4 sm:items-center items-start">
                            <div className="flex lg:gap-4 gap-2 lg:flex-row flex-col">
                              <div className="relative">
                                <span className="absolute top-1 sm:text-xs text-[6px] font-semibold sm:left-10 left-5">
                                  Start with
                                </span>
                                <input
                                  type="time"
                                  id="saturday"
                                  className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3  text-xs  xl:text-2xl sm:text-xl font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                                />
                              </div>
                              <div className="relative">
                                <span className="absolute top-1 sm:text-xs text-[6px] font-semibold sm:left-10 left-5">
                                  End with
                                </span>
                                <input
                                  type="time"
                                  id="saturday"
                                  className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3  text-xs  xl:text-2xl sm:text-xl font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                                />
                              </div>
                            </div>
                            <span className="border border-gray-200 rounded-full text-gray-400 hidden sm:block hover:text-white xl:ml-10  hover:bg-colorGreen hover:border-colorGreen">
                              <EditIcon className="m-3" />
                            </span>
                            <span className="border border-gray-200 rounded-full sm:hidden text-gray-400  hover:text-white hover:bg-colorGreen hover:border-colorGreen">
                              <EditIcon fontSize="small" className="m-1" />
                            </span>
                          </div>
                        </div>
                        <div className="flex sm:items-center items-start w-full lg:gap-5 xl:gap-10 sm:gap-16 gap-2">
                          <div className="xl:w-[45%] lg:w-[40%] w-[50%] flex  xl:gap-32  items-center">
                            <div className="xl:text-3xl w-[60%] max-[400px]:w-[65%] lg:text-2xl sm:text-lg text-xs font-semibold">
                              Saturday
                            </div>
                            <div className="flex items-center  w-[40%] max-[400px]:w-[35%]">
                              <span className="hidden md:block">
                                <FormControlLabel
                                  control={
                                    <IOSSwitchMax
                                      sx={{ m: 0 }}
                                      defaultChecked
                                    />
                                  }
                                />
                              </span>
                              <span className="md:hidden">
                                <FormControlLabel
                                  control={
                                    <IOSSwitchMin
                                      sx={{ m: 0 }}
                                      defaultChecked
                                    />
                                  }
                                />
                              </span>

                              <span className="xl:text-2xl lg:text-xl sm:text-lg text-xs -ml-2 sm:ml-0 font-semibold">
                                Open
                              </span>
                            </div>
                          </div>
                          <div className="xl:w-[55%] lg:w-[60%] w-[50%] flex gap-4 sm:items-center items-start">
                            <div className="flex lg:gap-4 gap-2 lg:flex-row flex-col">
                              <div className="relative">
                                <span className="absolute top-1 sm:text-xs text-[6px] font-semibold sm:left-10 left-5">
                                  Start with
                                </span>
                                <input
                                  type="time"
                                  id="saturday"
                                  className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3  text-xs  xl:text-2xl sm:text-xl font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                                />
                              </div>
                              <div className="relative">
                                <span className="absolute top-1 sm:text-xs text-[6px] font-semibold sm:left-10 left-5">
                                  End with
                                </span>
                                <input
                                  type="time"
                                  id="saturday"
                                  className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3  text-xs  xl:text-2xl sm:text-xl font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                                />
                              </div>
                            </div>
                            <span className="border border-gray-200 rounded-full text-gray-400 hidden sm:block hover:text-white xl:ml-10  hover:bg-colorGreen hover:border-colorGreen">
                              <EditIcon className="m-3" />
                            </span>
                            <span className="border border-gray-200 rounded-full sm:hidden text-gray-400  hover:text-white hover:bg-colorGreen hover:border-colorGreen">
                              <EditIcon fontSize="small" className="m-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex lg:gap-4 gap-1 lg:mt-20 mt-10">
                        <button className="uppercase sm:flex sm:items-center border-2 border-gray-400 lg:px-8 lg:py-3 lg:text-xl sm:px-5 sm:py-2 sm:text-sm max-[400px]:text-[7px] text-[9px] px-1 py-1 rounded-[4px] lg:rounded-md text-gray-400 font-semibold hover:border-colorGreen hover:text-colorGreen">
                          <span className="hidden sm:block">
                            <EditIcon className="lg:mx-4 lg:-ml-6 mx-2 -ml-2" />
                          </span>
                          <span className="sm:hidden">
                            <EditIcon className="-ml-1" fontSize="small" />
                          </span>
                          Edit all hours
                        </button>
                        <button className="uppercase sm:flex sm:items-center border-2 border-gray-400 lg:px-8 lg:py-3 lg:text-xl sm:px-5 sm:py-2 sm:text-sm max-[400px]:text-[7px] text-[9px] px-1 py-1 rounded-[4px] lg:rounded-md text-gray-400 font-semibold hover:border-colorGreen hover:text-colorGreen">
                          <span className="hidden sm:block">
                            <EditIcon className="lg:mx-4 lg:-ml-6 mx-2 -ml-2" />
                          </span>
                          <span className="sm:hidden">
                            <EditIcon className="-ml-1" fontSize="small" />
                          </span>
                          Edit Mon to Sat
                        </button>
                        <button className="uppercase sm:flex sm:items-center border-2 border-gray-400 lg:px-8 lg:py-3 lg:text-xl sm:px-5 sm:py-2 sm:text-sm max-[400px]:text-[7px] text-[9px] px-1 py-1 rounded-[4px] lg:rounded-md text-gray-400 font-semibold hover:border-colorGreen hover:text-colorGreen">
                          <span className="hidden sm:block">
                            <EditIcon className="lg:mx-4 lg:-ml-6 mx-2 -ml-2" />
                          </span>
                          <span className="sm:hidden">
                            <EditIcon className="-ml-1" fontSize="small" />
                          </span>
                          Edit Sunday
                        </button>
                      </div>
                      <div className="flex justify-end lg:mt-32 lg:gap-6 mt-20 gap-4">
                        <button className="uppercase lg:text-xl font-semibold text-colorGreen lg:py-3 lg:px-8 sm:py-2 sm:px-5 sm:text-sm py-1 px-3 text-xs rounded-[4px] lg:rounded-md border-2 border-colorGreen">
                          Cancel
                        </button>
                        <button className="uppercase lg:text-xl font-semibold text-white lg:py-3 lg:px-8 sm:py-2 sm:px-5 sm:text-sm px-3 py-1 text-xs rounded-[4px] lg:rounded-md bg-colorGreen">
                          Save
                        </button>
                      </div>
                    </div>
                  </Box>
                </Modal>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="sm:mx-10 mx-3">
                  <div className="grid grid-cols-3 gap-10 my-10">
                    <div className="flex justify-center col-span-3">
                      <div
                        className="sm:w-[300px]  sm:h-[300px] h-[250px] w-[250px] border border-gray-200 hover:border-4 cursor-pointer hover:border-colorGreen rounded-full flex items-center justify-center"
                        //   onDragEnter={handleDragEnter}
                        //   onDragLeave={handleDragLeave}
                        //   onDragOver={handleDragOver}
                        //   onDrop={(e) => handleDrop(e, 0)}
                        onClick={() => handleBrowseClick(0)}
                      >
                        {shopLogo !== "" ? (
                          <div className="sm:w-[300px]  sm:h-[300px] h-[250px] w-[250px]">
                            <img
                              src={shopLogo}
                              alt="Uploaded Image"
                              className="object-cover h-full w-full rounded-full"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                            <span className="flex justify-center">
                              <TbPhotoPlus className="w-14 h-14 text-gray-400 hover:text-colorGreen" />
                            </span>
                            <div className="flex flex-col gap-1">
                              <p className="sm:text-2xl text-sm font-bold text-gray-400">
                                Click to upload{" "}
                                <span className="text-colorGreen">logo</span>
                              </p>
                              <p className="sm:text-sm text-xs text-gray-400 text-center">
                                No Size Limit
                              </p>
                            </div>
                          </div>
                        )}
                        <input
                          id="file-input-0"
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          // onChange={(e) => handleFileChange(e, 0)}
                          {...register("shopLogo", {
                            required:
                              shopLogo === "" ? "shopLogo is required" : false,
                            onChange: (e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                onShopLogoPreviewImage(e);
                              }
                            },
                          })}
                        />
                      </div>
                    </div>
                    {errors.shopLogo && (
                      <div className="">
                        <span style={{ color: "red" }}>
                          {errors.shopLogo?.message}
                        </span>
                      </div>
                    )}

                    <div
                      className="w-full cursor-pointer sm:h-[350px] h-[200px] col-span-3 border border-gray-200 hover:border-4 hover:border-colorGreen rounded-3xl flex items-center justify-center"
                      //   onDragEnter={handleDragEnter}
                      //   onDragLeave={handleDragLeave}
                      //   onDragOver={handleDragOver}
                      //   onDrop={(e) => handleDrop(e, 1)}
                      onClick={() => handleBrowseClick(1)}
                    >
                      {shopBackground !== "" ? (
                        <div className="w-full sm:h-[350px]  h-[200px]">
                          <img
                            src={shopBackground}
                            alt="Uploaded Image"
                            className="object-cover h-full w-full rounded-3xl"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <span className="flex justify-center">
                            <TbPhotoPlus className="w-14 h-14 text-gray-400 hover:text-colorGreen" />
                          </span>
                          <div className="flex flex-col gap-1">
                            <p className="sm:text-2xl text-sm font-bold text-gray-400">
                              <span className="text-colorGreen">
                                Click to Upload
                              </span>{" "}
                              Cover Image
                            </p>
                            <p className="sm:text-sm text-xs text-gray-400 text-center">
                              We Support JPG, PNG & No Size Limit
                            </p>
                          </div>
                        </div>
                      )}
                      <input
                        id="file-input-1"
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        // onChange={(e) => handleFileChange(e, 1)}
                        {...register("shopBackground", {
                          required:
                            shopBackground === ""
                              ? "shopBackground is required"
                              : false,
                          onChange: (e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              onShopBackgroundPreviewImage(e);
                            }
                          },
                        })}
                      />
                    </div>
                    {errors.shopBackground && (
                      <div className="">
                        <span style={{ color: "red" }}>
                          {errors.shopBackground?.message}
                        </span>
                      </div>
                    )}

                    <div className="col-span-3">
                      <div className="sm:text-2xl text-lg font-semibold  mb-10 mx-2">
                        Shop Images
                      </div>
                      <div className="flex xl:gap-8 xl:flex-row flex-col gap-4">
                        {["One", "Two", "Three"]?.map((item, index) => {
                          return (
                            <>
                              <div
                                className="w-full cursor-pointer sm:h-[400px] h-[300px] border border-gray-200 hover:border-4 hover:border-colorGreen rounded-3xl flex items-center justify-center"
                                onClick={() =>
                                  handleBrowseClickShopImages(
                                    `shopImage${item}`,
                                    index
                                  )
                                }
                              >
                                {shopImages[index] ? (
                                  <div className="w-full sm:h-[400px]  h-[300px]">
                                    <img
                                      src={shopImages[index] ?? ""}
                                      alt="Uploaded Image"
                                      className="object-cover h-full w-full rounded-3xl"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-4">
                                    <span className="flex justify-center">
                                      <TbPhotoPlus className="w-14 h-14 text-gray-400 hover:text-colorGreen" />
                                    </span>
                                    <div className="flex flex-col gap-1">
                                      <p className="sm:text-lg text-sm font-bold text-gray-400">
                                        <span className="text-colorGreen">
                                          Click to Upload{" "}
                                        </span>
                                        Front Image
                                      </p>
                                      <p className="text-xs text-gray-400 text-center">
                                        We Support JPG, PNG & No Size Limit
                                      </p>
                                    </div>
                                  </div>
                                )}
                                <input
                                  id={`shopImage${item}`}
                                  type="file"
                                  accept="image/*,video/*"
                                  className="hidden"
                                  //   onChange={(e) => handleFileChange(e, 2)}
                                  {...register("shopImages", {
                                    required: !ShopImgError[index]
                                      ? "Shop All Image is required"
                                      : false,
                                    onChange: (e) => {
                                      createShopImagesChange(e, index);
                                    },
                                  })}
                                />
                              </div>
                            </>
                          );
                        })}
                      </div>
                      {errors.shopImages && (
                        <div className="">
                          <span style={{ color: "red" }}>
                            {errors.shopImages?.message}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="w-full col-span-3">
                      <div className="sm:text-2xl text-lg font-semibold  mb-10 mx-2">
                        Shop Video
                      </div>
                      <div
                        className="w-full cursor-pointer sm:h-[350px] h-[200px]  border border-gray-200 hover:border-4 hover:border-colorGreen rounded-3xl flex items-center justify-center"
                        // onDragEnter={handleDragEnter}
                        // onDragLeave={handleDragLeave}
                        // onDragOver={handleDragOver}
                        // onDrop={(e) => handleDrop(e, 5)}
                        onClick={() => handleBrowseClick(5)}
                      >
                        {shopVideo !== "" ? (
                          <div className="w-full sm:h-[350px]  h-[200px]">
                            <video
                              className="object-cover h-full w-full rounded-3xl"
                              controls
                            >
                              <source src={shopVideo}></source>
                            </video>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                            <span className="flex justify-center">
                              <TbPhotoPlus className="w-14 h-14 text-gray-400 hover:text-colorGreen" />
                            </span>
                            <div className="flex flex-col gap-1">
                              <p className="sm:text-2xl text-sm font-bold text-gray-400">
                                <span className="text-colorGreen">
                                  Click to Upload
                                </span>{" "}
                                Shop Video
                              </p>
                              <p className="sm:text-sm text-xs text-gray-400 text-center">
                                No Size Limit
                              </p>
                            </div>
                          </div>
                        )}
                        <input
                          id="file-input-5"
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          controls
                          //   onChange={(e) => handleFileChange(e, 5)}
                          onClick={(e) => (e.target.value = null)}
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              onShopVideoPreview(e);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <ActionButtons
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    onError={onError}
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="sm:mx-10 mx-3">
                  <div className="flex my-10">
                    {mainBranch === "Show" ? (
                      <KeyboardArrowUpIcon
                        onClick={() => handleMainBranchDetails("Hide")}
                        className="cursor-pointer"
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        onClick={() => handleMainBranchDetails("Show")}
                        className="cursor-pointer"
                      />
                    )}
                    <div className="font-semibold sm:text-lg text-sm">
                      Main Branch
                    </div>
                  </div>
                  <div
                    className={`space-y-10 ${
                      mainBranch === "Hide" && "hidden"
                    }`}
                  >
                    <div className="w-full relative">
                      <label
                        htmlFor="address"
                        className="absolute -top-4 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                      >
                        Address
                        <span className="required text-red-500 pl-2 sm:text-2xl text-lg">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        id="address"
                        className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                        placeholder="Your address"
                      />
                    </div>
                    <div className="w-full flex sm:flex-row sm:gap-4 flex-col gap-8">
                      <div className="sm:w-1/2 relative w-full">
                        <label
                          htmlFor="city"
                          className="absolute -top-4 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          City
                          <span className="required text-red-500 pl-2 sm:text-2xl text-lg">
                            *
                          </span>
                        </label>
                        <input
                          type="text"
                          id="city"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="Your city"
                        />
                      </div>
                      <div className="sm:w-1/2 relative w-full">
                        <label
                          htmlFor="pincode"
                          className="absolute -top-4 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          Pincode
                          <span className="required text-red-500 pl-2 sm:text-2xl text-lg">
                            *
                          </span>
                        </label>
                        <input
                          type="text"
                          id="pincode"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="Your pincode"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex my-10">
                    {managerDetails === "Show" ? (
                      <KeyboardArrowUpIcon
                        onClick={() => handleManagerDetails("Hide")}
                        className="cursor-pointer"
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        onClick={() => handleManagerDetails("Show")}
                        className="cursor-pointer"
                      />
                    )}
                    <div className="font-semibold sm:text-lg text-sm">
                      Manager : Save As Owner
                    </div>
                  </div>
                  <div
                    className={`space-y-10 ${
                      managerDetails === "Hide" && "hidden"
                    }`}
                  >
                    <RadioGroup
                      row
                      name="row-radio-buttons-group"
                      defaultValue="yes"
                    >
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <span className="hidden sm:inline">
                            <Radio
                              name="saveAsOwner"
                              id="yes"
                              value="yes"
                              sx={{
                                color: "rgba(21, 24, 39, 0.1)",
                                "& .MuiSvgIcon-root": {
                                  fontSize: 30,
                                },
                                "&.Mui-checked": {
                                  color: "#29977E",
                                },
                              }}
                            />
                          </span>
                          <span className="sm:hidden">
                            <Radio
                              name="saveAsOwner"
                              id="yes"
                              value="yes"
                              sx={{
                                color: "rgba(21, 24, 39, 0.1)",
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                                "&.Mui-checked": {
                                  color: "#29977E",
                                },
                              }}
                            />
                          </span>
                          <label
                            htmlFor="yes"
                            className="sm:text-xl text-sm text-gray-400 font-semibold"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center">
                          <span className="hidden sm:inline">
                            <Radio
                              name="saveAsOwner"
                              id="no"
                              value="no"
                              sx={{
                                color: "rgba(21, 24, 39, 0.1)",
                                "& .MuiSvgIcon-root": {
                                  fontSize: 30,
                                },
                                "&.Mui-checked": {
                                  color: "#29977E",
                                },
                              }}
                            />
                          </span>
                          <span className="sm:hidden">
                            <Radio
                              name="saveAsOwner"
                              id="no"
                              value="no"
                              sx={{
                                color: "rgba(21, 24, 39, 0.1)",
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                                "&.Mui-checked": {
                                  color: "#29977E",
                                },
                              }}
                            />
                          </span>
                          <label
                            htmlFor="no"
                            className="sm:text-xl text-sm text-gray-400 font-semibold"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </RadioGroup>

                    <div className="w-full flex sm:flex-row sm:gap-4 flex-col gap-8">
                      <div className="sm:w-1/2 relative w-full">
                        <label
                          htmlFor="managerfName"
                          className="absolute -top-4 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          First Name
                          <span className="required text-red-500 pl-2 sm:text-2xl text-lg">
                            *
                          </span>
                        </label>
                        <input
                          type="text"
                          id="managerfName"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="Manager first name"
                        />
                      </div>
                      <div className="sm:w-1/2 relative w-full">
                        <label
                          htmlFor="mangerlName"
                          className="absolute -top-4 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                        >
                          Last Name
                          <span className="required text-red-500 pl-2 sm:text-2xl text-lg">
                            *
                          </span>
                        </label>
                        <input
                          type="text"
                          id="mangerlName"
                          className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                          placeholder="Manager last name"
                        />
                      </div>
                    </div>
                    <div className="w-full relative">
                      <label
                        htmlFor="managerEmail"
                        className="absolute -top-4 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                      >
                        E-Mail
                        <span className="required text-red-500 pl-2 sm:text-2xl text-lg">
                          *
                        </span>
                      </label>
                      <input
                        type="email"
                        id="managerEmail"
                        className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                        placeholder="Manager email address"
                      />
                    </div>
                    <div className="w-full relative">
                      <label
                        htmlFor="managerPhone"
                        className="absolute -top-4 left-5 px-2 bg-white font-semibold sm:text-xl text-sm"
                      >
                        Phone Number
                        <span className="required text-red-500 pl-2 sm:text-2xl text-lg">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        id="managerPhone"
                        className="w-full px-7 sm:py-5 py-3 text-sm sm:text-xl rounded-xl border border-gray-200 focus:border-black outline-none"
                        placeholder="Manager phone number"
                      />
                    </div>
                  </div>
                  <div className="my-10">
                    <button className="uppercase border-2  sm:px-8 sm:py-3 sm:text-xl px-3 py-2 text-sm rounded-md font-semibold border-colorGreen text-colorGreen">
                      Sub Branch
                      <span className="hidden sm:inline">
                        <AddIcon fontSize="large" className="ml-2" />
                      </span>
                      <span className="sm:hidden">
                        <AddIcon fontSize="small" className="ml-2" />
                      </span>
                    </button>
                  </div>
                  <ActionButtons
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    onError={onError}
                  />
                </div>
              </>
            )}

            {/* {currentStep === 1 ? (
              <SignUpBusinessDetails
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            ) : currentStep === 2 ? (
              <SignUpBusinessPhotos
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            ) : (
              <SignUpBusinessBranches
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuthWithoutShop(ShopPage);

const ActionButtons = ({
  currentStep,
  setCurrentStep,
  handleSubmit,
  onSubmit,
  onError,
}) => {
  return (
    <div className="flex justify-end sm:gap-4 gap-2 mt-10">
      <button
        onClick={() => {
          currentStep > 1 && setCurrentStep(currentStep - 1);
        }}
        className="sm:py-3 sm:px-12 font-semibold sm:text-2xl text-sm px-8 py-2"
      >
        Back
      </button>
      <button
        className="sm:py-3 sm:px-12 bg-colorGreen sm:rounded-md text-white sm:text-2xl rounded-[4px] text-sm px-8 py-2"
        onClick={handleSubmit(onSubmit, onError)}
      >
        {currentStep === 3 ? "Submit" : "Next"}
      </button>
    </div>
  );
};
