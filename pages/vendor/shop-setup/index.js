import React, { useEffect, useState } from "react";
import { withAuthWithoutShop } from "../../../components/core/PrivateRouteForVendor";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  MenuItem,
  Divider,
  Button,
  Checkbox,
  TextField,
  CircularProgress,
  FormControl,
  IconButton,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { TbPhotoPlus } from "react-icons/tb";
import { Controller, useForm } from "react-hook-form";
import { CustomAuthModal } from "../../../components/core/CustomMUIComponents";
import { shopRegistration } from "../../../graphql/mutations/shops";
import { setShopRegisterId } from "../../../redux/ducks/userProfile";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import TimeCustomTextField from "../../../components/Layout/TimeCustomTextField";
import Carousel from "react-multi-carousel";
import Image from "next/image";
import CustomTextFieldVendor from "../../../components/core/CustomTextFieldVendor";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { BsShop } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { fileUpload } from "../../../services/wasabi";
import CustomAutoCompleteTextField from "../../../components/core/CustomAutoCompleteTextField";
import {
  getAreaByCityLists,
  getCityByStateLists,
  getStateLists,
} from "../../../graphql/queries/areaListsQueries";
import { useCallback } from "react";
import { handleUploadImage } from "../../../services/imageApis";
import { generateRandomNumberString } from "../../../utils/common";

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

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 2,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 2,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const TrendingCustomLeftArrow = ({ onClick }) => {
  return (
    <div
      style={{
        background: "black",
        color: "white",
        left: 0,
        position: "absolute",
        cursor: "pointer",
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        marginLeft: "16px",
        marginBottom: "9.5%",
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => onClick()}
    >
      <i
        style={{
          border: "solid",
          width: "10px",
          height: "10px",
          borderWidth: "0px 2px 2px 0px",
          display: "inline-block",
          transform: "rotate(135deg)",
          cursor: "pointer",
          position: "relative",
          right: "-2px",
        }}
      />
    </div>
  );
};

const TrendingCustomRightArrow = ({ onClick }) => {
  return (
    <div
      style={{
        background: "black",
        color: "white",
        right: 0,
        position: "absolute",
        cursor: "pointer",
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        marginRight: "16px",
        marginBottom: "9.5%",
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => onClick()}
    >
      <i
        style={{
          border: "solid",
          width: "10px",
          height: "10px",
          borderWidth: "0px 2px 2px 0px",
          display: "inline-block",
          transform: "rotate(-45deg)",
          cursor: "pointer",
          position: "relative",
          left: "-2px",
        }}
      />
    </div>
  );
};

const ShopPage = () => {
  const { userProfile } = useSelector((state) => state.userProfile);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Shop");
  const [currentStep, setCurrentStep] = useState(1);
  const [ownerDetails, setOwnerDetails] = useState("Show");
  const [shopDetails, setShopDetails] = useState("Show");
  const [shopTimeDetails, setShopTimeDetails] = useState("Show");

  const [mainBranch, setMainBranch] = useState("Show");
  const [subBranchSec, setSubBranchSec] = useState("Show");
  const [managerDetails, setManagerDetails] = useState("Show");

  const [shopLogo, setShopLogo] = useState("");
  const [uploadShopLogo, setUploadShopLogo] = useState("");

  const [shopBackground, setShopBackground] = useState("");
  const [uploadShopBackground, setUploadShopBackground] = useState("");

  const [shopImages, setShopImages] = useState([]);
  const [uploadShopImages, setUploadShopImages] = useState([]);

  const [shopVideo, setShopVideo] = useState("");
  const [uploadShopVideo, setUploadShopVideo] = useState("");

  const [sameAsOwner, setSameAsOwner] = useState("False");
  const [individual, setIndividual] = useState(false);
  const [subBranch, setSubBranch] = useState([]);
  const [subBranchEdit, setSubBranchEdit] = useState();

  const [hoursModalOpen, setHoursModalOpen] = useState(false);
  const [daysTimeModalOpen, setDaysTimeModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedWeek, setSelectedWeek] = useState();
  const [selectedAllHours, setSelectedAllHours] = useState();
  const [loading, setLoading] = useState(false);

  const [hours, setHours] = useState([
    { key: "Sunday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Monday", value: ["09:00 AM - 10:00 PM"] },
    { key: "Tuesday", value: ["07:00 AM - 08:00 PM"] },
    { key: "Wednesday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Thursday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Friday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Saturday", value: ["09:00 AM - 08:00 PM"] },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setValue,
    getValues,
    control,
  } = useForm();

  const [stateDataLists, setStateDataLists] = useState([]);
  const [getCityData, setGetCityData] = useState([]);
  const [getAreaData, setGetAreaData] = useState([]);

  const getApiState = async () => {
    await getStateLists()
      .then((res) => setStateDataLists(res?.data?.stateList))
      .catch((error) => console.log("ee", error));
  };

  const onChangeState = async (data) => {
    await getCityByStateLists(data)
      .then((res) => setGetCityData(res?.data?.cityByState))
      .catch((err) => console.log("error", err));
    setValue("city", "");
  };
  const onChangeCity = async (data) => {
    await getAreaByCityLists(data)
      .then((res) => setGetAreaData(res?.data?.areaByCity))
      .catch((err) => console.log("error", err));
    setValue("pin_code", "");
  };
  const onChangePinCode = (data) => {
    console.log("pincode", data);
  };

  const handleInput = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length > 10) {
      e.target.value = inputValue.slice(0, 10);
    } else if (inputValue < 0) {
      e.target.value = 0;
    }

    let inputValue1 = e.target.value.replace(/[^\d-]/g, "");

    if (inputValue1.startsWith("-")) {
      inputValue1 = "-" + inputValue1.replace(/-/g, "");
    }

    e.target.value = inputValue1;
  };

  useEffect(() => {
    getApiState();
  }, []);

  useEffect(() => {
    if (sameAsOwner === "True") {
      setValue("manager_first_name", getValues("first_name"));
      setValue("manager_last_name", getValues("last_name"));
      setValue("manager_user_email", getValues("user_email"));
      setValue("manager_user_contact", getValues("user_contact"));
    } else {
      setValue("manager_first_name", "");
      setValue("manager_last_name", "");
      setValue("manager_user_email", "");
      setValue("manager_user_contact", "");
    }
  }, [getValues, sameAsOwner, setValue, currentStep]);

  const [subBranchButtonShow, setSubBranchButtonShow] = useState(false);

  const getAllValues = useCallback(() => {
    if (
      getValues("manager_first_name") === "" ||
      getValues("manager_last_name") === "" ||
      getValues("manager_user_email") === "" ||
      getValues("manager_user_contact") === ""
    ) {
      setSubBranchButtonShow(false);
    } else {
      setSubBranchButtonShow(true);
    }
  }, [getValues, setSubBranchButtonShow]);

  useEffect(() => {
    getAllValues();
  }, [getValues, sameAsOwner, setValue, currentStep, getAllValues]);

  const onShopLogoPreviewImage = (e) => {
    setUploadShopLogo(e.target.files[0]);
    setShopLogo(URL.createObjectURL(e.target.files[0]));
  };

  const onShopBackgroundPreviewImage = (e) => {
    setUploadShopBackground(e.target.files[0]);
    setShopBackground(URL.createObjectURL(e.target.files[0]));
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
      shopImagesData[resImgIndex] = URL.createObjectURL(file);
      setShopImages(() => [...shopImagesData]);
    });
  };

  const onShopVideoPreview = (e) => {
    setUploadShopVideo(e.target.files[0]);
    setShopVideo(URL.createObjectURL(e.target.files[0]));
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

  const handleClickIndividual = (option, active) => {
    setSelectedOption(option);
    setIndividual(active);
  };

  const handleBrowseClick = (boxIndex) => {
    document.getElementById(`file-input-${boxIndex}`).click();
  };

  const handleMainBranchDetails = (option) => {
    setMainBranch(option);
  };
  const handleManagerDetails = (option) => {
    setManagerDetails(option);
  };
  const handleSubBranchDetails = (option) => {
    setSubBranchSec(option);
  };

  const returnSubBranchData = (val) => {
    return {
      branch_address: val.subManagerAddress,
      branch_pinCode: val.subManagerPinCode,
      branch_state: val.subManagerState,
      branch_city: val.subManagerCity,
      manager_name: val.subManagerFirstName + " " + val.subManagerLastName,
      manager_contact: val.subManagerPhone,
      manager_email: val.subManagerEmail,
      branch_type: "sub",
      same_as:
        (val.managerValue === "Same as owner" && "owner") ||
        (val.managerValue === "same as main branch manager" &&
          "main_branch_manager") ||
        "none",
    };
  };

  const multipleImageUploadFile = async (uploadShopImages) => {
    const uploadPromises = uploadShopImages?.map((uploadShopImg) => {
      const folderStructure = `user_${userProfile.id}/shop/shop_img/${
        new Date().getTime().toString() + generateRandomNumberString(5)
      }`;
      return handleUploadImage(uploadShopImg, "shop-image", folderStructure);
    });

    try {
      const uploadShopImgs = await Promise.all(uploadPromises);
      return uploadShopImgs;
    } catch (error) {
      console.error("Error during file upload:", error);
      return [];
    }
  };

  const onSubmit = async (data) => {
    if (currentStep !== 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setLoading(true);

      let logoResponse = "";
      let backgroundResponse = "";
      let imagesResponse = [];
      let videoResponse = null;

      if (uploadShopLogo) {
        const folderStructure = `user_${userProfile.id}/shop/logo`;
        await handleUploadImage(uploadShopLogo, "shop-logo", folderStructure)
          .then((res) => (logoResponse = res))
          .catch((error) => {
            console.error("Error during file upload:", error);
          });
      }

      if (uploadShopBackground) {
        const folderStructure = `user_${userProfile.id}/shop/cover `;
        await handleUploadImage(
          uploadShopBackground,
          "shop-cover",
          folderStructure
        )
          .then((res) => (backgroundResponse = res))
          .catch((error) => {
            console.error("Error during file upload:", error);
          });
      }

      if (uploadShopImages.filter((item) => item !== undefined).length > 0) {
        await multipleImageUploadFile(
          uploadShopImages.filter((item) => item !== undefined)
        ).then((res) => (imagesResponse = res));
      }

      if (uploadShopVideo) {
        const folderStructure = `user_${userProfile.id}/shop/video`;
        await fileUpload(uploadShopVideo, folderStructure)
          .then((res) => (videoResponse = res))
          .catch((error) => {
            console.error("Error during file upload:", error);
          });
      }

      await shopRegistration({
        userId: userProfile.id,
        ownerInfo: {
          owner_firstName: data.first_name,
          owner_lastName: data.last_name,
          owner_email: data.user_email,
          owner_contact: data.user_contact,
          user_id: userProfile.id,
        },
        shopInfo: {
          shop_logo: logoResponse || {},
          shop_cover_image: backgroundResponse || {},
          shop_images:
            imagesResponse?.map((itm) => {
              return { links: itm };
            }) || [],
          shop_video: videoResponse || "",
          shop_social_link: {
            facebook: individual ? "" : data.facebook_link,
            instagram: individual ? "" : data.instagram_link,
            website: individual ? "" : data.personal_website,
          },
          shop_name: data.shop_name,
          shop_email: data.shop_email,
          shop_type: individual ? "individual" : "shop",
          shop_time: hours?.map((day) => {
            return {
              week: day["key"],
              open_time:
                day["value"][0] === "Closed" ||
                day["value"][0] === "Open 24 hours"
                  ? "-"
                  : day["value"][0].split(" - ")[0],
              close_time:
                day["value"][0] === "Closed" ||
                day["value"][0] === "Open 24 hours"
                  ? "-"
                  : day["value"][0].split(" - ")[1],
              is_close: day["value"][0] === "Closed" ? true : false,
              is_24Hours_open:
                day["value"][0] === "Open 24 hours" ? true : false,
            };
          }),
        },
        branchInfo: [
          {
            branch_address: data.address,
            branch_state: data.state,
            branch_city: data.city,
            branch_pinCode: data.pin_code,
            manager_name:
              data.manager_first_name + " " + data.manager_last_name,
            manager_contact: data.manager_user_contact,
            manager_email: data.manager_user_email,
            branch_type: "main",
            same_as: sameAsOwner === "True" ? "owner" : "none",
          },
          ...(subBranch.length > 0 ? subBranch?.map(returnSubBranchData) : []),
        ],
      }).then(
        (res) => {
          dispatch(setShopRegisterId(res.data.createShop.shopInfo.id));
          toast.success(res.data.createShop.message, {
            theme: "colored",
          });
          setLoading(false);
          localStorage.setItem("userHaveAnyShop", "true");
          router.push("/vendor/dashboard");
        },
        (error) => {
          setLoading(false);
          toast.error(error.message, { theme: "colored" });
        }
      );
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
        <div className="h-[452px] sm:h-[50vh] relative">
          <div className="absolute inset-0  mix-blend-darken bg-cover bg-repeat-round">
            <div className="absolute w-full h-full  bg-[#000000a9]" />
          </div>
        </div>
        <div className="relative -mt-[calc(50vh-25px)] container">
          <div className="text-white sm:text-5xl text-3xl flex items-center flex-col gap-4">
            <div>
              <span className="text-colorGreen font-semibold">Join</span> Us
            </div>
            <div>
              As <span className="text-colorGreen font-semibold">?</span>
            </div>
          </div>

          <div className="w-[95%] sm:w-[90%] lg:w-[85%] bg-white mx-auto mt-8 mb-16 p-5 sm:p-10 sm:pt-5 rounded-md">
            <div className="flex justify-center mb-5">
              <div className="flex gap-2 bg-colorPrimary rounded-2xl p-2">
                {["Shop", "Single Person"].map((userType, index) => (
                  <div
                    key={index}
                    className={`py-2 px-4 cursor-pointer rounded-2xl ${
                      selectedOption === userType
                        ? "border-2 border-yellow-500"
                        : "border"
                    }`}
                    onClick={() =>
                      handleClickIndividual(
                        userType,
                        userType === "Single Person" ? true : false
                      )
                    }
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        {userType === "Shop" && (
                          <BsShop
                            fontSize="25px"
                            className={`${
                              selectedOption === userType
                                ? "text-yellow-500"
                                : "text-white"
                            }`}
                          />
                        )}
                        {userType === "Single Person" && (
                          <FaUser
                            className={`${
                              selectedOption === userType
                                ? "text-yellow-500"
                                : "text-white"
                            }`}
                            fontSize="25px"
                          />
                        )}
                        <div
                          className={`${
                            selectedOption === userType
                              ? "text-yellow-500"
                              : "text-white"
                          } ml-1 mr-4 font-semibold text-xl max-[600px]:text-lg max-[480px]:text-sm`}
                        >
                          {userType}
                        </div>
                      </div>
                      <div>
                        {selectedOption === userType && (
                          <CheckCircleIcon className="text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:mx-10">
              <div className="flex justify-evenly mb-3 sm:mb-5">
                <div className="uppercase font-semibold text-sm sm:text-xl">
                  Details
                </div>
                <div
                  className={`uppercase text-sm sm:text-xl ${
                    currentStep >= 2 ? "font-semibold" : "text-gray-400"
                  }`}
                >
                  Photos
                </div>
                <div
                  className={`uppercase text-sm sm:text-xl ${
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

                {currentStep === 3 ? (
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
                    <span className="flex justify-center items-center sm:h-8 sm:w-8 h-6 w-6 font-semibold rounded-full bg-gray-200 text-center sm:text-sm text-[10px]">
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
                    <span className="flex justify-center items-center  sm:h-8 sm:w-8 h-6 w-6 font-semibold rounded-full bg-gray-200 text-center sm:text-sm text-[10px]">
                      3
                    </span>
                  </>
                )}
                <hr className="sm:h-1 h-[3px] bg-gray-200 w-1/4" />
              </div>
            </div>

            {currentStep === 1 && (
              <>
                <div className="md:mx-10 mt-8">
                  <div className="border mt-5">
                    <div className="flex px-3 md:px-5 py-2 bg-colorPrimary justify-between">
                      <div className="uppercase font-semibold sm:text-lg text-sm text-white">
                        Owner Details
                      </div>
                      {ownerDetails === "Show" ? (
                        <KeyboardArrowUpIcon
                          className="text-white cursor-pointer"
                          onClick={() => handleOwnerDetails("Hide")}
                        />
                      ) : (
                        <KeyboardArrowDownIcon
                          className="text-white cursor-pointer"
                          onClick={() => handleOwnerDetails("Show")}
                        />
                      )}
                    </div>
                    <div
                      className={`space-y-5 p-4 md:p-10 ${
                        ownerDetails === "Hide" && "hidden"
                      }`}
                    >
                      <div className="w-full flex sm:flex-row sm:gap-2 flex-col gap-4">
                        <div className="sm:w-1/2 relative w-full">
                          <CustomTextFieldVendor
                            label="First Name*"
                            type="text"
                            id="fName"
                            name="first_name"
                            isRequired={true}
                            placeholder="Your first name"
                            fieldValue={getValues("first_name")}
                            fieldError={errors?.first_name}
                            formValue={{
                              ...register("first_name", {
                                required: "*First name is required",
                              }),
                            }}
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
                          <CustomTextFieldVendor
                            label="Last Name*"
                            type="text"
                            id="lName"
                            name="last_name"
                            isRequired={true}
                            placeholder="Your last name"
                            fieldValue={getValues("last_name")}
                            fieldError={errors?.last_name}
                            formValue={{
                              ...register("last_name", {
                                required: "*Last name is required",
                              }),
                            }}
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
                        <CustomTextFieldVendor
                          label="Email Address*"
                          type="email"
                          id="email"
                          name="user_email"
                          isRequired={true}
                          placeholder="yourmail@gmail.com"
                          fieldValue={getValues("user_email")}
                          fieldError={errors?.user_email}
                          formValue={{
                            ...register("user_email", {
                              required: "*User email is required",
                              pattern: {
                                value:
                                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "*Please enter a valid email",
                              },
                            }),
                          }}
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
                        <CustomTextFieldVendor
                          label="Phone Number*"
                          type="number"
                          id="phone"
                          name="user_contact"
                          isRequired={true}
                          placeholder="Your phone number"
                          fieldValue={getValues("user_contact")}
                          fieldError={errors?.user_contact}
                          formValue={{
                            ...register("user_contact", {
                              required: "*Phone number is required",
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message: "*Please enter a valid phone Number",
                              },
                            }),
                          }}
                          onInput={handleInput}
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
                  </div>

                  <div className="border mt-10">
                    <div className="flex px-3 md:px-5 py-2 bg-colorPrimary justify-between">
                      <div className="uppercase font-semibold sm:text-lg text-sm text-white">
                        Shop info
                      </div>
                      {shopDetails === "Show" ? (
                        <KeyboardArrowUpIcon
                          onClick={() => handleShopDetails("Hide")}
                          className="text-white cursor-pointer"
                        />
                      ) : (
                        <KeyboardArrowDownIcon
                          onClick={() => handleShopDetails("Show")}
                          className="text-white cursor-pointer"
                        />
                      )}
                    </div>
                    <div
                      className={`space-y-5 p-4 md:p-10 ${
                        shopDetails === "Hide" && "hidden"
                      }`}
                    >
                      <div className="w-full relative">
                        <CustomTextFieldVendor
                          name="shop_name"
                          label="Shop Name*"
                          type="text"
                          id="shopName"
                          isRequired={true}
                          placeholder="Your shop name"
                          formValue={{
                            ...register("shop_name", {
                              required: "*Shop name is required",
                            }),
                          }}
                        />
                        {errors.shop_name && (
                          <div className="mt-2">
                            <span style={{ color: "red" }}>
                              {errors.shop_name?.message}
                            </span>
                          </div>
                        )}
                      </div>
                      {!individual && (
                        <>
                          <div className="w-full relative">
                            <CustomTextFieldVendor
                              name="shop_email"
                              label="Shop Email*"
                              type="email"
                              id="shopEmail"
                              isRequired={true}
                              placeholder="Your shop email"
                              formValue={{
                                ...register("shop_email", {
                                  required: "*Shop email is required",
                                  pattern: {
                                    value:
                                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: "*Please enter a valid email",
                                  },
                                }),
                              }}
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
                            <CustomTextFieldVendor
                              name="personal_website"
                              label="Personal Website Link"
                              type="text"
                              id="personalWebLink1"
                              isRequired={false}
                              placeholder="Personal Website Link"
                              formValue={{
                                ...register("personal_website", {}),
                              }}
                            />
                            {errors.personal_website && (
                              <div className="mt-2">
                                <span style={{ color: "red" }}>
                                  {errors.personal_website?.message}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="w-full flex gap-4 max-md:flex-col max-md:gap-5">
                            <div className="w-1/2 relative max-md:w-full">
                              <CustomTextFieldVendor
                                name="facebook_link"
                                label="Fackbook Link"
                                type="text"
                                id="fbLink"
                                isRequired={false}
                                placeholder="Your facebook link"
                                formValue={{
                                  ...register("facebook_link", {}),
                                }}
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
                              <CustomTextFieldVendor
                                name="instagram_link"
                                label=" Instagram Link"
                                type="text"
                                id="igLink"
                                isRequired={false}
                                placeholder="Your instagram link"
                                formValue={{
                                  ...register("instagram_link", {}),
                                }}
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
                        </>
                      )}
                    </div>
                  </div>

                  <div className="my-10">
                    {!individual && (
                      <>
                        <div className="border">
                          <div className="flex justify-between items-center px-3 md:px-5 py-2 bg-colorPrimary">
                            <div className="flex">
                              <div className="uppercase font-semibold sm:text-lg text-sm text-white">
                                Shop Open/Close Time
                              </div>
                            </div>
                            <div className="flex">
                              <div
                                className="flex gap-2 mr-4 items-center cursor-pointer"
                                onClick={() => setHoursModalOpen(true)}
                              >
                                <EditIcon
                                  fontSize="small"
                                  className="text-white"
                                />
                                <div className="text-white sm:text-lg text-sm">
                                  Edit
                                </div>
                              </div>
                              {shopTimeDetails === "Show" ? (
                                <KeyboardArrowUpIcon
                                  onClick={() => handleShopTimeDetails("Hide")}
                                  className="text-white cursor-pointer"
                                />
                              ) : (
                                <KeyboardArrowDownIcon
                                  onClick={() => handleShopTimeDetails("Show")}
                                  className="text-white cursor-pointer"
                                />
                              )}
                            </div>
                          </div>
                          <div
                            className={`space-y-5 p-4 md:p-10 ${
                              shopTimeDetails === "Hide" && "hidden"
                            }`}
                          >
                            <div className="w-full grid sm:grid-cols-3 gap-y-8 gap-4 grid-cols-1">
                              {hours?.map((day, index) => (
                                <div className="relative" key={index}>
                                  {day["value"]?.map((time, index) => (
                                    <TimeCustomTextField
                                      key={index}
                                      type="text"
                                      id={index}
                                      variant="outlined"
                                      label={day["key"]}
                                      value={time}
                                    />
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <Divider className="!mt-10" />
                  <ActionButtons
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    onError={onError}
                    loading={loading}
                  />
                </div>
                <HoursModal
                  hoursModalOpen={hoursModalOpen}
                  setHoursModalOpen={setHoursModalOpen}
                  setDaysTimeModalOpen={setDaysTimeModalOpen}
                  hours={hours}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  setSelectedWeek={setSelectedWeek}
                  selectedWeek={selectedWeek}
                  selectedAllHours={selectedAllHours}
                  setSelectedAllHours={setSelectedAllHours}
                />
                <DaysTimeModal
                  daysTimeModalOpen={daysTimeModalOpen}
                  setDaysTimeModalOpen={setDaysTimeModalOpen}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  hours={hours}
                  setHours={setHours}
                  setSelectedWeek={setSelectedWeek}
                  selectedWeek={selectedWeek}
                  selectedAllHours={selectedAllHours}
                  setSelectedAllHours={setSelectedAllHours}
                />
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="sm:mx-10 mt-8">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <div className="col-span-3 sm:col-span-1">
                      <div className="flex flex-col justify-center items-center border">
                        <div className="sm:text-xl text-lg font-semibold bg-colorPrimary w-full flex justify-center p-2 text-white">
                          Shop Logo (Optional)
                        </div>
                        <div className="p-6">
                          <div
                            className="w-[220px] h-[220px] sm:w-[250px] sm:h-[250px] border border-gray-200 hover:border-2 cursor-pointer hover:border-colorGreen rounded-full flex items-center justify-center"
                            onClick={() => handleBrowseClick(0)}
                          >
                            {shopLogo !== "" ? (
                              <div className="w-full h-full relative rounded-full">
                                <Image
                                  src={shopLogo}
                                  alt="Uploaded Image"
                                  layout="fill"
                                  objectFit="contain"
                                  className="!object-cover !h-full !w-full !rounded-full !object-center"
                                  objectPosition="center"
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col gap-4">
                                <span className="flex justify-center">
                                  <TbPhotoPlus className="w-14 h-14 text-gray-400 hover:text-colorGreen" />
                                </span>
                                <div className="flex flex-col gap-1">
                                  <p className="text-base sm:text-lg text-gray-400">
                                    Click to upload{" "}
                                    <span className="text-colorGreen">
                                      logo
                                    </span>
                                  </p>
                                </div>
                              </div>
                            )}
                            <input
                              id="file-input-0"
                              type="file"
                              accept="image/jpg, image/jpeg, image/png , image/heic , image/webp"
                              className="hidden"
                              {...register("shopLogo", {
                                onChange: (e) => {
                                  if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                  ) {
                                    onShopLogoPreviewImage(e);
                                  }
                                },
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-3 sm:col-span-2">
                      <div className="flex flex-col justify-center items-center border">
                        <div className="sm:text-xl text-lg font-semibold bg-colorPrimary w-full flex justify-center p-2 text-white">
                          Shop Cover Image (Optional)
                        </div>
                        <div className="p-6 w-full flex justify-center">
                          <div
                            className="w-[100%] sm:w-[80%] h-[250px] cursor-pointer col-span-3 border border-gray-200 hover:border-2 hover:border-colorGreen flex items-center justify-center  rounded-lg"
                            onClick={() => handleBrowseClick(1)}
                          >
                            {shopBackground !== "" ? (
                              <div className="w-full h-full relative">
                                <Image
                                  src={shopBackground}
                                  alt="Uploaded Image"
                                  layout="fill"
                                  className="!object-cover !h-full !w-full !rounded-xl !object-top"
                                  objectFit="contain"
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col gap-4">
                                <span className="flex justify-center">
                                  <TbPhotoPlus className="w-14 h-14 text-gray-400 hover:text-colorGreen" />
                                </span>
                                <div className="flex flex-col gap-1">
                                  <p className="sm:text-xl text-base text-gray-400">
                                    <span className="text-colorGreen">
                                      Click to Upload
                                    </span>{" "}
                                    Cover Image
                                  </p>
                                </div>
                              </div>
                            )}
                            <input
                              id="file-input-1"
                              type="file"
                              accept="image/jpg, image/jpeg, image/png , image/heic , image/webp"
                              className="hidden"
                              {...register("shopBackground", {
                                onChange: (e) => {
                                  if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                  ) {
                                    onShopBackgroundPreviewImage(e);
                                  }
                                },
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10">
                    <div className="flex flex-col border">
                      <div className="sm:text-xl text-lg font-semibold bg-colorPrimary w-full p-2 pl-6 text-white">
                        Shop Images (Optional)
                      </div>
                      <div className="p-6">
                        <div className="sm:mx-auto flex xl:gap-8 xl:flex-row flex-col gap-4">
                          {["One", "Two", "Three"]?.map((item, index) => {
                            return (
                              <>
                                <div
                                  key={index}
                                  className="w-full cursor-pointer h-[300px] border border-gray-200 hover:border-2 hover:border-colorGreen rounded-lg flex items-center justify-center"
                                  onClick={() =>
                                    handleBrowseClickShopImages(
                                      `shopImage${item}`,
                                      index
                                    )
                                  }
                                >
                                  {shopImages[index] ? (
                                    <div className="w-full h-full relative">
                                      <Image
                                        src={shopImages[index] ?? ""}
                                        alt="Uploaded Image"
                                        layout="fill"
                                        className="!object-cover !h-full !w-full !rounded-xl !object-top"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex flex-col gap-4 text-center p-2">
                                      <span className="flex justify-center">
                                        <TbPhotoPlus className="w-14 h-14 text-gray-400 hover:text-colorGreen" />
                                      </span>
                                      <div className="flex flex-col gap-1 justify-center">
                                        <p className="text-base sm:text-base text-colorGreen">
                                          <span className="text-gray-400">
                                            Click to Upload{" "}
                                          </span>
                                          Shop Image
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  <input
                                    id={`shopImage${item}`}
                                    type="file"
                                    accept="image/jpg, image/jpeg, image/png , image/heic , image/webp"
                                    className="hidden"
                                    {...register("shopImages", {
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
                      </div>
                    </div>
                  </div>
                  <div className="mt-10">
                    <div className="grid grid-cols-4">
                      <div className="col-span-4 sm:col-span-2">
                        <div className="flex flex-col justify-center items-center border">
                          <div className="sm:text-xl text-lg font-semibold bg-colorPrimary w-full p-2 pl-6 text-white">
                            Shop Video (Optional)
                          </div>
                          <div className="w-full p-6">
                            <div
                              className="w-full h-[250px] cursor-pointer border border-gray-200 hover:border-2 hover:border-colorGreen rounded-lg flex items-center justify-center"
                              onClick={() => handleBrowseClick(5)}
                            >
                              {shopVideo !== "" ? (
                                <div className="w-full h-full">
                                  <video
                                    className="object-cover h-full w-full"
                                    controls
                                  >
                                    <source src={shopVideo}></source>
                                  </video>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-4">
                                  <span className="flex justify-center text-center">
                                    <TbPhotoPlus className="w-14 h-14 text-gray-400 hover:text-colorGreen" />
                                  </span>
                                  <div className="flex flex-col gap-1">
                                    <p className="sm:text-xl text-base text-gray-400">
                                      <span className="text-colorGreen">
                                        Click to Upload
                                      </span>{" "}
                                      Shop Video
                                    </p>
                                  </div>
                                </div>
                              )}
                              <input
                                id="file-input-5"
                                type="file"
                                accept="video/*"
                                className="hidden"
                                controls
                                onClick={(e) => (e.target.value = null)}
                                onChange={(e) => {
                                  if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                  ) {
                                    onShopVideoPreview(e);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Divider className="!mt-10" />
                  <ActionButtons
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    onError={onError}
                    loading={loading}
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="mt-8 sm:mx-10">
                  <div className="border mt-5">
                    <div className="flex px-3 md:px-5 py-2 bg-colorPrimary justify-between">
                      <div className="uppercase font-semibold sm:text-lg text-sm text-white">
                        Main Branch
                      </div>
                      {mainBranch === "Show" ? (
                        <KeyboardArrowUpIcon
                          onClick={() => handleMainBranchDetails("Hide")}
                          className="text-white cursor-pointer"
                        />
                      ) : (
                        <KeyboardArrowDownIcon
                          onClick={() => handleMainBranchDetails("Show")}
                          className="text-white cursor-pointer"
                        />
                      )}
                    </div>
                    <div
                      className={`space-y-5 p-4 md:p-10 ${
                        mainBranch === "Hide" && "hidden"
                      }`}
                    >
                      <div className="w-full relative">
                        <CustomTextFieldVendor
                          name="address"
                          label="Address"
                          type="text"
                          id="address"
                          isRequired={true}
                          placeholder="Your address"
                          formValue={{
                            ...register("address", {
                              required: "Address is required",
                            }),
                          }}
                        />
                        {errors.address && (
                          <div className="mt-2">
                            <span style={{ color: "red" }}>
                              {errors.address?.message}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="w-full relative">
                        <CustomAutoCompleteTextField
                          name="state"
                          label="State"
                          type="text"
                          id="state"
                          isRequired={true}
                          control={control}
                          rules={{ required: "State is required" }}
                          placeholder="Your state"
                          arrayListItem={stateDataLists}
                          onChangeValue={onChangeState}
                          stateField={true}
                        />

                        {errors.state && (
                          <div className="mt-2">
                            <span style={{ color: "red" }}>
                              {errors.state?.message}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="w-full flex sm:flex-row sm:gap-4 flex-col gap-5">
                        {getCityData?.length > 0 && (
                          <div className="sm:w-1/2 relative w-full">
                            <CustomAutoCompleteTextField
                              name="city"
                              label="City"
                              type="text"
                              id="city"
                              isRequired={true}
                              placeholder="Your city"
                              control={control}
                              rules={{ required: "City is required" }}
                              arrayListItem={getCityData}
                              onChangeValue={onChangeCity}
                              cityField={true}
                            />
                            {errors.city && (
                              <div className="mt-2">
                                <span style={{ color: "red" }}>
                                  {errors.city?.message}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        {getAreaData?.length > 0 && (
                          <div className="sm:w-1/2 relative w-full">
                            <CustomAutoCompleteTextField
                              name="pin_code"
                              label="Pincode"
                              type="text"
                              id="pincode"
                              isRequired={true}
                              placeholder="Your pincode"
                              control={control}
                              rules={{ required: "PinCode is required" }}
                              pinCodeField={true}
                              arrayListItem={getAreaData}
                              onChangeValue={onChangePinCode}
                            />
                            {errors.pin_code && (
                              <div className="mt-2">
                                <span style={{ color: "red" }}>
                                  {errors.pin_code?.message}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border mt-5">
                    <div className="flex px-3 md:px-5 py-2 bg-colorPrimary justify-between">
                      <div className="uppercase font-semibold sm:text-lg text-sm text-white">
                        Manager Details
                      </div>
                      {managerDetails === "Show" ? (
                        <KeyboardArrowUpIcon
                          onClick={() => handleManagerDetails("Hide")}
                          className="text-white cursor-pointer"
                        />
                      ) : (
                        <KeyboardArrowDownIcon
                          onClick={() => handleManagerDetails("Show")}
                          className="text-white cursor-pointer"
                        />
                      )}
                    </div>
                    <div
                      className={`space-y-5 p-4 pt-2 md:p-10 md:pt-4 ${
                        managerDetails === "Hide" && "hidden"
                      }`}
                    >
                      <div className="flex items-center justify-start">
                        <div className="uppercase font-semibold text-xs md:text-base whitespace-nowrap">
                          Same As Owner&nbsp;:&nbsp;
                        </div>
                        <RadioGroup
                          row
                          name="row-radio-buttons-group"
                          value={sameAsOwner}
                          onChange={(e) => {
                            if (e.target.value === "True") {
                              setSameAsOwner("True");
                            } else {
                              setSameAsOwner("False");
                            }
                          }}
                        >
                          <div className="flex gap-2">
                            <div className="flex items-center">
                              <span className="hidden sm:inline">
                                <Radio
                                  name="saveAsOwner"
                                  id="True"
                                  value="True"
                                  sx={{
                                    color: "rgba(21, 24, 39, 0.1)",
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 24,
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
                                  id="True"
                                  value="True"
                                  sx={{
                                    color: "rgba(21, 24, 39, 0.1)",
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 16,
                                    },
                                    "&.Mui-checked": {
                                      color: "#29977E",
                                    },
                                  }}
                                />
                              </span>
                              <label
                                htmlFor="True"
                                className="sm:text-xl text-sm text-gray-400"
                              >
                                Yes
                              </label>
                            </div>
                            <div className="flex items-center">
                              <span className="hidden sm:inline">
                                <Radio
                                  name="saveAsOwner"
                                  id="False"
                                  value="False"
                                  sx={{
                                    color: "rgba(21, 24, 39, 0.1)",
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 24,
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
                                  id="False"
                                  value="False"
                                  sx={{
                                    color: "rgba(21, 24, 39, 0.1)",
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 16,
                                    },
                                    "&.Mui-checked": {
                                      color: "#29977E",
                                    },
                                  }}
                                />
                              </span>
                              <label
                                htmlFor="False"
                                className="sm:text-xl text-sm text-gray-400"
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="w-full flex sm:flex-row sm:gap-4 flex-col gap-5 !mt-2">
                        <div className="sm:w-1/2 relative w-full">
                          <FormControl fullWidth>
                            <Controller
                              name="manager_first_name"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <>
                                  <TextField
                                    {...field}
                                    label="First Name"
                                    type="text"
                                    id="managerfName"
                                    isRequired={true}
                                    placeholder="Manager first name"
                                    disabled={sameAsOwner === "True"}
                                    {...register("manager_first_name", {
                                      required: "Manager FirstName is required",
                                      onChange: () => {
                                        getAllValues();
                                      },
                                    })}
                                  />
                                </>
                              )}
                            />
                          </FormControl>
                          {errors.manager_first_name && (
                            <div className="mt-2">
                              <span style={{ color: "red" }}>
                                {errors.manager_first_name?.message}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="sm:w-1/2 relative w-full">
                          <FormControl fullWidth>
                            <Controller
                              name="manager_last_name"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <>
                                  <TextField
                                    {...field}
                                    label=" Last Name"
                                    type="text"
                                    id="mangerlName"
                                    isRequired={true}
                                    placeholder="Manager last name"
                                    disabled={sameAsOwner === "True"}
                                    {...register("manager_last_name", {
                                      required: "Manager LastName is required",
                                      onChange: () => {
                                        getAllValues();
                                      },
                                    })}
                                  />
                                </>
                              )}
                            />
                          </FormControl>
                          {errors.manager_last_name && (
                            <div className="mt-2">
                              <span style={{ color: "red" }}>
                                {errors.manager_last_name?.message}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-full relative">
                        <FormControl fullWidth>
                          <Controller
                            name="manager_user_email"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <>
                                <TextField
                                  {...field}
                                  label=" E-Mail"
                                  type="email"
                                  id="managerEmail"
                                  isRequired={true}
                                  placeholder="Manager email address"
                                  disabled={sameAsOwner === "True"}
                                  {...register("manager_user_email", {
                                    required: "Manager Email is required",

                                    pattern: {
                                      value:
                                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                      message: "Please enter a valid email",
                                    },
                                    onChange: () => {
                                      getAllValues();
                                    },
                                  })}
                                />
                              </>
                            )}
                          />
                        </FormControl>
                        {errors.manager_user_email && (
                          <div className="mt-2">
                            <span style={{ color: "red" }}>
                              {errors.manager_user_email?.message}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="w-full relative">
                        <FormControl fullWidth>
                          <Controller
                            name="manager_user_contact"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <>
                                <TextField
                                  {...field}
                                  label="Phone Number"
                                  type="number"
                                  id="managerPhone"
                                  isRequired={true}
                                  placeholder="Manager phone number"
                                  disabled={sameAsOwner === "True"}
                                  {...register("manager_user_contact", {
                                    required:
                                      "Manager Contact Number is required",
                                    pattern: {
                                      value: /^[0-9]{10}$/,
                                      message: "Please enter a valid number",
                                    },
                                    onChange: () => {
                                      getAllValues();
                                    },
                                  })}
                                  onInput={handleInput}
                                />
                              </>
                            )}
                          />
                        </FormControl>
                        {errors.manager_user_contact && (
                          <div className="mt-2">
                            <span style={{ color: "red" }}>
                              {errors.manager_user_contact?.message}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!individual && (
                    <div className="border mt-5">
                      <div className="flex px-3 md:px-5 py-2 bg-colorPrimary justify-between">
                        <div className="uppercase font-semibold sm:text-lg text-sm text-white">
                          Sub Branch
                        </div>
                        {subBranchSec === "Show" ? (
                          <KeyboardArrowUpIcon
                            onClick={() => handleSubBranchDetails("Hide")}
                            className="text-white cursor-pointer"
                          />
                        ) : (
                          <KeyboardArrowDownIcon
                            onClick={() => handleSubBranchDetails("Show")}
                            className="text-white cursor-pointer"
                          />
                        )}
                      </div>

                      {subBranchSec === "Show" && (
                        <>
                          {subBranchSec?.length > 0 && (
                            <div className="p-4 pt-2 pb-0 md:p-10 md:pt-4 md:pb-0">
                              <Carousel
                                responsive={responsive}
                                arrows={true}
                                removeArrowOnDeviceType={["mobile"]}
                                customLeftArrow={
                                  <TrendingCustomLeftArrow
                                    onClick={TrendingCustomLeftArrow}
                                  />
                                }
                                customRightArrow={
                                  <TrendingCustomRightArrow
                                    onClick={TrendingCustomRightArrow}
                                  />
                                }
                              >
                                {subBranch?.map((sub, index) => (
                                  <div
                                    className="bg-colorWhite rounded-xl flex flex-col gap-1 border mr-5 p-5 pt-2"
                                    key={index}
                                  >
                                    <div className="flex justify-end">
                                      <div className="flex gap-2">
                                        <IconButton
                                          aria-label="delete"
                                          className="!rounded-md !capitalize !text-colorBlack !p-1 !bg-red-600 hover:!bg-red-600"
                                          onClick={() => {
                                            setSubBranch(
                                              subBranch.filter(
                                                (itm) => itm.id !== sub.id
                                              )
                                            );
                                          }}
                                        >
                                          <DeleteIcon
                                            className="!text-colorWhite"
                                            fontSize="small"
                                          />
                                        </IconButton>
                                        <IconButton
                                          aria-label="delete"
                                          className="!rounded-md !capitalize !text-colorBlack !p-1 !bg-colorStone hover:!bg-colorStone"
                                          onClick={() => {
                                            setSubBranchEdit(sub);
                                          }}
                                        >
                                          <EditIcon
                                            className="!text-colorWhite"
                                            fontSize="small"
                                          />
                                        </IconButton>
                                      </div>
                                    </div>
                                    <p className="text-sm sm:text-base lg:text-base text-colorBlack">
                                      <b className="mr-1 text-sm sm:text-base lg:text-base whitespace-nowrap">
                                        Address :{" "}
                                      </b>
                                      <span className="break-all">
                                        {sub.subManagerAddress}
                                      </span>
                                    </p>
                                    <p className="text-sm sm:text-base lg:text-base text-colorBlack">
                                      <b className="mr-1 text-sm sm:text-base lg:text-base whitespace-nowrap">
                                        State :{" "}
                                      </b>
                                      <span className="break-all">
                                        {sub.subManagerState}
                                      </span>
                                    </p>
                                    <p className="text-sm sm:text-base lg:text-base text-colorBlack">
                                      <b className="mr-1 text-sm sm:text-base lg:text-base whitespace-nowrap">
                                        City :{" "}
                                      </b>
                                      <span className="break-all">
                                        {sub.subManagerCity}
                                      </span>
                                    </p>
                                    <p className="text-sm sm:text-base lg:text-base text-colorBlack">
                                      <b className="mr-1 text-sm sm:text-base lg:text-base whitespace-nowrap">
                                        Pincode :{" "}
                                      </b>
                                      <span className="break-all">
                                        {sub.subManagerPinCode}
                                      </span>
                                    </p>
                                    <p className="text-sm sm:text-base lg:text-base text-colorBlack">
                                      <b className="mr-1 text-sm sm:text-base lg:text-base">
                                        Manager Name :
                                      </b>
                                      <span className="break-all">
                                        {sub.subManagerFirstName +
                                          " " +
                                          sub.subManagerLastName}
                                      </span>
                                    </p>
                                    <p className="text-sm sm:text-base lg:text-base text-colorBlack">
                                      <b className="mr-1 text-sm sm:text-base lg:text-base">
                                        Manager Email :
                                      </b>
                                      <span className="break-all">
                                        {sub.subManagerEmail}
                                      </span>
                                    </p>
                                    <p className="text-sm sm:text-base lg:text-base text-colorBlack">
                                      <b className="mr-1 text-sm sm:text-base lg:text-base">
                                        Manager Phone Number :
                                      </b>
                                      <span className="break-all">
                                        {sub.subManagerPhone}
                                      </span>
                                    </p>
                                  </div>
                                ))}
                              </Carousel>
                            </div>
                          )}
                          <div className="p-4 pt-2 pb-2 md:p-10 md:pt-4 md:pb-4">
                            <SubBranchModal
                              subBranch={subBranch}
                              setSubBranch={setSubBranch}
                              setValue={setValue}
                              getValues={getValues}
                              subBranchEdit={subBranchEdit}
                              setSubBranchEdit={setSubBranchEdit}
                              subBranchButtonShow={subBranchButtonShow}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <Divider className="!mt-10" />

                  <ActionButtons
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    onError={onError}
                    loading={loading}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const ActionButtons = ({
  currentStep,
  setCurrentStep,
  handleSubmit,
  onSubmit,
  onError,
  loading,
}) => {
  return (
    <div className="flex justify-end sm:gap-4 gap-2 mt-8">
      <button
        onClick={() => {
          currentStep > 1 && setCurrentStep(currentStep - 1);
        }}
        className="bg-[#FAFCFC] sm:py-3 sm:px-12 font-semibold sm:text-lg text-sm px-8 py-2 rounded-[4px] border"
      >
        Back
      </button>
      <button
        className="sm:py-3 sm:px-12 bg-colorGreen sm:rounded-md text-white sm:text-lg rounded-[4px] text-sm px-8 py-2 flex items-center"
        onClick={handleSubmit(onSubmit, onError)}
      >
        {loading && (
          <CircularProgress
            size={20}
            color="primary"
            sx={{ color: "white", mr: 1 }}
          />
        )}
        {currentStep === 3 ? "Submit" : "Next"}
      </button>
    </div>
  );
};

const SubBranchModal = ({
  subBranch,
  setSubBranch,
  setValue,
  getValues,
  setSubBranchEdit,
  subBranchEdit,
  subBranchButtonShow,
}) => {
  const [managerValue, setManagerValue] = useState("");

  const [subManagerAddress, setSubManagerAddress] = useState("");
  const [subManagerCity, setSubManagerCity] = useState("");
  const [subManagerState, setSubManagerState] = useState("");
  const [subManagerPinCode, setSubManagerPinCode] = useState("");

  const [subManagerFirstName, setSubManagerFirstName] = useState("");
  const [subManagerLastName, setSubManagerLastName] = useState("");
  const [subManagerEmail, setSubManagerEmail] = useState("");
  const [subManagerPhone, setSubManagerPhone] = useState("");
  const [error, setError] = useState({
    subManagerAddressError: "",
    subManagerCityError: "",
    subManagerStateError: "",
    subManagerPinCodeError: "",
    subManagerFirstNameError: "",
    subManagerLastNameError: "",
    subManagerEmailError: "",
    subManagerPhoneError: "",
  });
  useEffect(() => {
    if (managerValue === "Same as owner") {
      setSubManagerFirstName(getValues("first_name"));
      setSubManagerLastName(getValues("last_name"));
      setSubManagerEmail(getValues("user_email"));
      setSubManagerPhone(getValues("user_contact"));
      error.subManagerFirstNameError = "";
      error.subManagerLastNameError = "";
      error.subManagerEmailError = "";
      error.subManagerPhoneError = "";
    } else if (managerValue === "same as main branch manager") {
      setSubManagerFirstName(getValues("manager_first_name"));
      setSubManagerLastName(getValues("manager_last_name"));
      setSubManagerEmail(getValues("manager_user_email"));
      setSubManagerPhone(getValues("manager_user_contact"));
      error.subManagerFirstNameError = "";
      error.subManagerLastNameError = "";
      error.subManagerEmailError = "";
      error.subManagerPhoneError = "";
    } else {
      setSubManagerFirstName("");
      setSubManagerLastName("");
      setSubManagerEmail("");
      setSubManagerPhone("");
    }
  }, [error, getValues, managerValue, setValue]);

  useEffect(() => {
    if (subBranchEdit !== undefined) {
      setSubManagerAddress(subBranchEdit.subManagerAddress);
      setSubManagerCity(subBranchEdit.subManagerCity);
      setSubManagerState(subBranchEdit.subManagerState);
      setSubManagerPinCode(subBranchEdit.subManagerPinCode);
      setSubManagerFirstName(subBranchEdit.subManagerFirstName);
      setSubManagerLastName(subBranchEdit.subManagerLastName);
      setSubManagerEmail(subBranchEdit.subManagerEmail);
      setSubManagerPhone(subBranchEdit.subManagerPhone);
    }
  }, [subBranchEdit]);

  const subBranchSubmit = () => {
    let allError = {};
    if (!subManagerAddress) {
      allError.subManagerAddressError = "SubManagerAddress is require";
    } else {
      allError.subManagerAddressError = "";
    }
    if (!subManagerState) {
      allError.subManagerStateError = "SubManagerState is require";
    } else {
      allError.subManagerStateError = "";
    }
    if (!subManagerCity) {
      allError.subManagerCityError = "SubManagerCity is require";
    } else {
      allError.subManagerCityError = "";
    }

    if (!subManagerPinCode) {
      allError.subManagerPinCodeError = "SubManagerPinCode is require";
    } else {
      allError.subManagerPinCodeError = "";
    }

    if (!subManagerFirstName) {
      allError.subManagerFirstNameError = "SubManagerFirstName is require";
    } else {
      allError.subManagerFirstNameError = "";
    }
    if (!subManagerLastName) {
      allError.subManagerLastNameError = "SubManagerLastName is require";
    } else {
      allError.subManagerLastNameError = "";
    }
    if (!subManagerEmail) {
      allError.subManagerEmailError = "SubManagerEmail is require";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(subManagerEmail)
    ) {
      allError.subManagerEmailError = "Invalid SubManagerEmail address";
    } else {
      allError.subManagerEmailError = "";
    }
    if (!subManagerPhone) {
      allError.subManagerPhoneError = "SubManagerPhone is require";
    } else if (subManagerPhone.length != 10) {
      allError.subManagerPhoneError =
        "SubManagerPhone Number must be 10 numbers";
    } else {
      allError.subManagerPhoneError = "";
    }

    if (
      !subManagerAddress ||
      !subManagerState ||
      !subManagerCity ||
      !subManagerPinCode ||
      !subManagerFirstName ||
      !subManagerLastName ||
      !subManagerEmail ||
      !subManagerPhone
    ) {
      setError(allError);
    } else {
      if (subBranchEdit === undefined) {
        setSubBranch([
          ...subBranch,
          {
            id: subBranch.length + 1,
            subManagerAddress,
            subManagerState,
            subManagerCity,
            subManagerPinCode,
            subManagerFirstName,
            subManagerLastName,
            subManagerEmail,
            subManagerPhone,
            managerValue,
          },
        ]);
      } else {
        const editSelectedSubBranchIndex = subBranch.findIndex(
          (sub) => sub.id === subBranchEdit.id
        );

        const editSelectedSubBranch = [...subBranch];

        editSelectedSubBranch[editSelectedSubBranchIndex] = {
          id: subBranchEdit.id,
          subManagerAddress,
          subManagerState,
          subManagerCity,
          subManagerPinCode,
          subManagerFirstName,
          subManagerLastName,
          subManagerEmail,
          subManagerPhone,
          managerValue,
        };
        setSubBranch(editSelectedSubBranch);
      }
      handleSubBranchModalClose();
    }
  };

  const handleSubBranchModalClose = () => {
    setSubManagerAddress("");
    setSubManagerState("");
    setSubManagerCity("");
    setSubManagerPinCode("");
    setSubManagerFirstName("");
    setSubManagerLastName("");
    setSubManagerEmail("");
    setManagerValue("");
    setSubManagerPhone("");
    setSubBranchEdit();
    error.subManagerFirstNameError = "";
    error.subManagerLastNameError = "";
    error.subManagerEmailError = "";
    error.subManagerPhoneError = "";
    error.subManagerFirstNameError = "";
    error.subManagerLastNameError = "";
    error.subManagerEmailError = "";
    error.subManagerPhoneError = "";
    error.subManagerAddressError = "";
    error.subManagerStateError = "";
    error.subManagerCityError = "";
    error.subManagerPinCodeError = "";
  };

  const [getCityData, setGetCityData] = useState([]);
  const [getAreaData, setGetAreaData] = useState([]);

  const [stateDataLists, setStateDataLists] = useState([]);

  const getApiState = async () => {
    await getStateLists()
      .then((res) => setStateDataLists(res?.data?.stateList))
      .catch((error) => console.log("ee", error));
  };
  useEffect(() => {
    getApiState();
  }, []);

  const onChangeSubBranchState = async (data) => {
    await getCityByStateLists(data)
      .then((res) => setGetCityData(res?.data?.cityByState))
      .catch((err) => console.log("error", err));

    setSubManagerState(data);
    error.subManagerStateError = "";
    setSubManagerCity("");
  };
  const onChangeSubBranchCity = async (data) => {
    await getAreaByCityLists(data)
      .then((res) => setGetAreaData(res?.data?.areaByCity))
      .catch((err) => console.log("error", err));

    setSubManagerCity(data);
    error.subManagerCityError = "";
    setSubManagerPinCode("");
  };
  const onChangeSubBranchPinCode = (data) => {
    setSubManagerPinCode(data);
    error.subManagerPinCodeError = "";
  };

  const handleInput = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length > 10) {
      e.target.value = inputValue.slice(0, 10);
    } else if (inputValue < 0) {
      e.target.value = 0;
    }

    let inputValue1 = e.target.value.replace(/[^\d-]/g, "");

    if (inputValue1.startsWith("-")) {
      inputValue1 = "-" + inputValue1.replace(/-/g, "");
    }

    e.target.value = inputValue1;
  };
  return (
    <>
      <Box>
        <div>
          <div>
            <div className="bg-colorWhite rounded-lg my-5 space-y-5">
              <form>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-center gap-20">
                    <div className="w-full flex flex-col gap-2">
                      <Box sx={{ display: "flex" }}>
                        <CustomTextFieldVendor
                          id="input-with-sx"
                          label="Address"
                          variant="standard"
                          className="w-full"
                          value={subManagerAddress}
                          onChange={(e) => {
                            setSubManagerAddress(e.target.value);
                            error.subManagerAddressError = "";
                          }}
                        />
                      </Box>
                      <span style={{ color: "red" }}>
                        {error.subManagerAddressError || ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-20">
                    <div className="w-full flex flex-col gap-2">
                      <Box>
                        <CustomAutoCompleteTextField
                          id="input-with-sx"
                          label="State"
                          variant="standard"
                          className="w-full"
                          value={subManagerState}
                          subBranchSelect={true}
                          arrayListItem={stateDataLists}
                          onChangeValue={onChangeSubBranchState}
                          stateField={true}
                          branchText={subManagerState}
                          setBranchText={setSubManagerState}
                        />
                      </Box>
                      <span style={{ color: "red" }}>
                        {error.subManagerStateError || ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:gap-4 gap-2.5 w-full justify-between items-center">
                    {getCityData?.length > 0 && (
                      <div className="w-full flex flex-col gap-2">
                        <Box>
                          <CustomAutoCompleteTextField
                            id="input-with-sx"
                            label="City"
                            variant="standard"
                            className="w-full"
                            value={subManagerCity}
                            subBranchSelect={true}
                            arrayListItem={getCityData}
                            onChangeValue={onChangeSubBranchCity}
                            cityField={true}
                            branchText={subManagerCity}
                            setBranchText={setSubManagerCity}
                          />
                        </Box>
                        <span style={{ color: "red" }}>
                          {error.subManagerCityError || ""}
                        </span>
                      </div>
                    )}
                    {getAreaData?.length > 0 && (
                      <div className="w-full flex flex-col gap-2">
                        <Box>
                          <CustomAutoCompleteTextField
                            id="input-with-sx"
                            label="PinCode"
                            variant="standard"
                            className="w-full"
                            type="text"
                            value={subManagerPinCode}
                            subBranchSelect={true}
                            arrayListItem={getAreaData}
                            onChangeValue={onChangeSubBranchPinCode}
                            pinCodeField={true}
                            branchText={subManagerPinCode}
                            setBranchText={setSubManagerPinCode}
                          />
                        </Box>
                        <span style={{ color: "red" }}>
                          {error.subManagerPinCodeError || ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center items-center">
                    <div className="w-full flex justify-between items-center gap-5 sm:gap-10">
                      <CustomTextFieldVendor
                        label="Manager"
                        variant="standard"
                        select
                        fullWidth
                        value={managerValue}
                        onChange={(e) => setManagerValue(e.target.value)}
                      >
                        <MenuItem value="">None</MenuItem>
                        {["Same as owner", "same as main branch manager"]?.map(
                          (man) => (
                            <MenuItem value={man} key={man}>
                              {man}
                            </MenuItem>
                          )
                        )}
                      </CustomTextFieldVendor>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:gap-4 gap-2.5 w-full justify-between items-center">
                    <div className="w-full flex flex-col gap-2">
                      <Box sx={{ display: "flex" }}>
                        <CustomTextFieldVendor
                          id="input-with-sx"
                          label="Manager First Name"
                          variant="standard"
                          className="w-full"
                          disabled={
                            managerValue === "Same as owner" ||
                            managerValue === "same as main branch manager"
                          }
                          value={subManagerFirstName}
                          onChange={(e) => {
                            setSubManagerFirstName(e.target.value);
                            error.subManagerFirstNameError = "";
                          }}
                        />
                      </Box>
                      <span style={{ color: "red" }}>
                        {error.subManagerFirstNameError || ""}
                      </span>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <Box sx={{ display: "flex" }}>
                        <CustomTextFieldVendor
                          id="input-with-sx"
                          label="Manager Last Name"
                          variant="standard"
                          className="w-full"
                          disabled={
                            managerValue === "Same as owner" ||
                            managerValue === "same as main branch manager"
                          }
                          value={subManagerLastName}
                          onChange={(e) => {
                            setSubManagerLastName(e.target.value);
                            error.subManagerLastNameError = "";
                          }}
                        />
                      </Box>
                      <span style={{ color: "red" }}>
                        {error.subManagerLastNameError || ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-10 sm:gap-20">
                    <div className="w-full flex flex-col gap-2">
                      <Box sx={{ display: "flex" }}>
                        <CustomTextFieldVendor
                          id="input-with-sx"
                          label="Manager Email Address"
                          variant="standard"
                          className="w-full"
                          type="email"
                          disabled={
                            managerValue === "Same as owner" ||
                            managerValue === "same as main branch manager"
                          }
                          value={subManagerEmail}
                          onChange={(e) => {
                            setSubManagerEmail(e.target.value);
                            error.subManagerEmailError = "";
                          }}
                        />
                      </Box>
                      <span style={{ color: "red" }}>
                        {error.subManagerEmailError || ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-10 sm:gap-20">
                    <div className="w-full flex flex-col gap-2">
                      <Box sx={{ display: "flex" }}>
                        <CustomTextFieldVendor
                          id="input-with-sx"
                          label="Manager Phone Number"
                          variant="standard"
                          className="w-full"
                          type="number"
                          disabled={
                            managerValue === "Same as owner" ||
                            managerValue === "same as main branch manager"
                          }
                          value={subManagerPhone}
                          onChange={(e) => {
                            setSubManagerPhone(e.target.value);
                            if (e.target.value.length != 10) {
                              error.subManagerPhoneError =
                                "SubManagerPhone Number must be 10 numbers";
                            } else {
                              error.subManagerPhoneError = "";
                            }
                          }}
                          onInput={handleInput}
                        />
                      </Box>
                      <span style={{ color: "red" }}>
                        {error.subManagerPhoneError || ""}
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-end sm:gap-4 gap-2">
            <Button
              variant="outlined"
              className="font-semibold bg-[#FAFCFC] border border-[#e5e7eb] hover:border-[#e5e7eb] hover:border text-inherit hover:bg-[#FAFCFC]"
              onClick={handleSubBranchModalClose}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              className="font-semibold text-white bg-colorGreen hover:bg-colorGreen border-0 hover:border-0"
              onClick={subBranchSubmit}
              disabled={!subBranchButtonShow}
            >
              {subBranchEdit?.id ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </Box>
    </>
  );
};

export const HoursModal = ({
  hoursModalOpen,
  setHoursModalOpen,
  setDaysTimeModalOpen,
  hours,
  setSelectedDay,
  setSelectedWeek,
  setSelectedAllHours,
  ShopEdit,
}) => {
  return (
    <>
      <CustomAuthModal
        open={hoursModalOpen}
        onClose={() => setHoursModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="animate__animated animate__slideInDown"
      >
        <Box
          sx={style}
          className="!w-[90%] lg:!w-[80%] xl:!w-[50%] !overflow-scroll"
        >
          <div className="sm:p-5 p-1 sm:pb-0">
            <div className="flex justify-between items-center mb-5">
              <div className="sm:text-[28px] text-[16px] font-bold">
                {ShopEdit === "true" ? "Hours" : "Set Hours"}
              </div>
              <span>
                <CloseIcon
                  className="text-gray-500 !text-xl sm:!text-3xl"
                  fontSize="large"
                  onClick={() => setHoursModalOpen(false)}
                />
              </span>
            </div>
            <div className="h-[50vh] sm:h-[80%] overflow-auto">
              <div className="grid grid-cols-1 gap-y-5 my-2">
                {hours?.map((day, index) => (
                  <div
                    key={index}
                    className="flex justify-between sm:items-center items-start w-full lg:gap-5 xl:gap-10 sm:gap-16 gap-2"
                  >
                    <div className="flex xl:gap-32  items-center mt-1 sm:mt-0">
                      <div className="uppercase sm:text-base text-sm font-semibold">
                        {day["key"]}
                      </div>
                    </div>
                    {day["value"]?.map((time, index) => (
                      <div
                        key={index}
                        className="flex gap-2 sm:gap-4 sm:items-center items-start sm:mr-20"
                      >
                        {time === "Closed" || time === "Open 24 hours" ? (
                          <p
                            className={`uppercase ${
                              time === "Closed"
                                ? "text-red-600"
                                : time === "Open 24 hours"
                                ? "text-green-600"
                                : ""
                            } text-base`}
                          >
                            {time}
                          </p>
                        ) : (
                          <div className="flex lg:gap-4 gap-2 sm:flex-row flex-col">
                            <div className="relative">
                              <TimeCustomTextField
                                type="time"
                                id={index}
                                variant="outlined"
                                label="Start with"
                                value={
                                  time?.split(" - ")[0]?.split(" ")[1] === "PM"
                                    ? String(
                                        Number(
                                          time
                                            ?.split(" - ")[1]
                                            ?.split(" ")[0]
                                            ?.split(":")[0]
                                        ) + 12
                                      ) +
                                      ":" +
                                      time
                                        ?.split(" - ")[0]
                                        ?.split(" ")[0]
                                        ?.split(":")[1]
                                    : time?.split(" - ")[0]?.split(" ")[0]
                                }
                              />
                            </div>
                            <div className="relative">
                              <TimeCustomTextField
                                type="time"
                                id={index}
                                variant="outlined"
                                label="End with"
                                value={
                                  time?.split(" - ")[1]?.split(" ")[1] === "PM"
                                    ? String(
                                        Number(
                                          time
                                            ?.split(" - ")[1]
                                            ?.split(" ")[0]
                                            ?.split(":")[0]
                                        ) + 12
                                      ) +
                                      ":" +
                                      time
                                        ?.split(" - ")[1]
                                        ?.split(" ")[0]
                                        ?.split(":")[1]
                                    : time?.split(" - ")[1]?.split(" ")[0]
                                }
                              />
                            </div>
                          </div>
                        )}

                        <span
                          onClick={() => {
                            setDaysTimeModalOpen(true);
                            setSelectedDay(day["key"] + " - " + time);
                          }}
                          className="border mr-2 sm:mr-0 border-gray-200 rounded-full text-gray-400 hover:text-white hover:bg-colorGreen hover:border-colorGreen cursor-pointer"
                        >
                          <EditIcon fontSize="small" className="m-2" />
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row xl:flex-col 2xl:flex-row justify-center items-center lg:justify-between  mt-5 lg:gap-6 gap-4">
              <div className="flex">
                <div
                  className="uppercase sm:flex sm:items-center sm:text-[14px] text-[10px] py-1 text-gray-400 font-semibold hover:border-colorGreen hover:text-colorGreen whitespace-nowrap cursor-pointer mr-1 sm:mr-4 gap-2"
                  onClick={() => {
                    setDaysTimeModalOpen(true);

                    setSelectedAllHours([
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ]);
                  }}
                >
                  <span>
                    <EditIcon
                      fontSize="small"
                      className="!text-[15px] sm:!text-[20px]"
                    />
                  </span>
                  Edit all hours
                </div>
                <div
                  onClick={() => {
                    setDaysTimeModalOpen(true);

                    setSelectedWeek([
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ]);
                  }}
                  className="uppercase sm:flex sm:items-center sm:text-[14px] text-[10px] py-1 text-gray-400 font-semibold hover:border-colorGreen hover:text-colorGreen whitespace-nowrap cursor-pointer mr-1 sm:mr-4 gap-2"
                >
                  <span className="">
                    <EditIcon
                      fontSize="small"
                      className="!text-[15px] sm:!text-[20px]"
                    />
                  </span>
                  Edit Mon to Sat
                </div>
                <div
                  onClick={() => {
                    setDaysTimeModalOpen(true);
                    setSelectedDay(
                      "Sunday" +
                        " - " +
                        hours[hours.findIndex((item) => item.key === "Sunday")]
                          .value
                    );
                  }}
                  className="uppercase sm:flex sm:items-center sm:text-[14px] text-[10px] py-1 text-gray-400 font-semibold hover:border-colorGreen hover:text-colorGreen whitespace-nowrap cursor-pointer mr-1 sm:mr-4 gap-2"
                >
                  <span className="">
                    <EditIcon
                      fontSize="small"
                      className="!text-[15px] sm:!text-[20px]"
                    />
                  </span>
                  Edit Sunday
                </div>
              </div>
              <div>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setHoursModalOpen(false)}
                  className="!font-semibold !mr-4 !bg-[#FAFCFC] !border !border-[#e5e7eb] hover:!border-[#e5e7eb] hover:!border !text-inherit hover:!bg-[#FAFCFC]"
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setHoursModalOpen(false)}
                  className="!font-semibold !text-white !bg-colorGreen hover:!bg-colorGreen !border-0 hover:!border-0"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Box>
      </CustomAuthModal>
    </>
  );
};

const DaysTimeModal = ({
  daysTimeModalOpen,
  setDaysTimeModalOpen,
  selectedDay,
  setSelectedDay,
  hours,
  setHours,
  setSelectedWeek,
  selectedWeek,
  selectedAllHours,
  setSelectedAllHours,
}) => {
  const [startTime, setStartTime] = useState();
  const [closeTime, setCloseTime] = useState();
  const [closed, setClosed] = useState(false);
  const [open24Hours, setOpen24Hours] = useState(false);

  useEffect(() => {
    setStartTime(
      selectedDay?.split(" - ")[1]?.split(" ")[1] === "PM"
        ? String(
            Number(selectedDay?.split(" - ")[1]?.split(" ")[0]?.split(":")[0]) +
              12
          ) +
            ":" +
            selectedDay?.split(" - ")[1]?.split(" ")[0]?.split(":")[1]
        : selectedDay?.split(" - ")[1]?.split(" ")[0]
    );

    setCloseTime(
      selectedDay?.split(" - ")[2]?.split(" ")[1] === "PM"
        ? String(
            Number(selectedDay?.split(" - ")[2]?.split(" ")[0]?.split(":")[0]) +
              12
          ) +
            ":" +
            selectedDay?.split(" - ")[2]?.split(" ")[0]?.split(":")[1]
        : selectedDay?.split(" - ")[2]?.split(" ")[0]
    );
  }, [selectedDay]);

  useEffect(() => {
    if (selectedDay?.split(" - ")[1] === "Closed") {
      setClosed(true);
    } else {
      setClosed(false);
    }

    if (selectedDay?.split(" - ")[1] === "Open 24 hours") {
      setOpen24Hours(true);
    } else {
      setOpen24Hours(false);
    }
  }, [selectedDay]);

  const saveDaysTimeData = () => {
    if ((closed || open24Hours) && selectedDay) {
      const index = hours.findIndex(
        (item) => item.key === selectedDay?.split(" - ")[0]
      );
      if (hours[index]?.value) {
        hours[index].value = open24Hours ? ["Open 24 hours"] : ["Closed"];
        setHours(hours);
      }
      handleCloseDaysTimeModal();
    }

    if ((closed || open24Hours) && selectedWeek) {
      hours?.map((itm) =>
        selectedWeek?.map((day) => {
          if (day === itm.key) {
            return (itm.value = open24Hours ? ["Open 24 hours"] : ["Closed"]);
          }
          return itm;
        })
      );
      handleCloseDaysTimeModal();
    }

    if ((closed || open24Hours) && selectedAllHours) {
      hours?.map((itm) =>
        selectedAllHours?.map((day) => {
          if (day === itm.key) {
            return (itm.value = open24Hours ? ["Open 24 hours"] : ["Closed"]);
          }
          return itm;
        })
      );
      handleCloseDaysTimeModal();
    }

    if (hours && !closed && !open24Hours && selectedWeek) {
      hours?.map((itm) =>
        selectedWeek?.map((day) => {
          if (day === itm.key) {
            return (itm.value = [
              `${
                startTime?.split(":")[0] > 12
                  ? startTime?.split(":")[0] -
                    12 +
                    ":" +
                    startTime?.split(":")[1] +
                    " PM"
                  : startTime + " AM"
              }  - ${
                closeTime?.split(":")[0] > 12
                  ? closeTime?.split(":")[0] -
                    12 +
                    ":" +
                    closeTime?.split(":")[1] +
                    " PM"
                  : closeTime + " AM"
              } `,
            ]);
          }
          return itm;
        })
      );

      handleCloseDaysTimeModal();
    }

    if (hours && !closed && !open24Hours && selectedAllHours) {
      hours?.map((itm) =>
        selectedAllHours?.map((day) => {
          if (day === itm.key) {
            return (itm.value = [
              `${
                startTime?.split(":")[0] > 12
                  ? startTime?.split(":")[0] -
                    12 +
                    ":" +
                    startTime?.split(":")[1] +
                    " PM"
                  : startTime + " AM"
              }  - ${
                closeTime?.split(":")[0] > 12
                  ? closeTime?.split(":")[0] -
                    12 +
                    ":" +
                    closeTime?.split(":")[1] +
                    " PM"
                  : closeTime + " AM"
              } `,
            ]);
          }
          return itm;
        })
      );

      handleCloseDaysTimeModal();
    }

    if (
      hours &&
      !closed &&
      !open24Hours &&
      selectedWeek === undefined &&
      selectedAllHours === undefined
    ) {
      const index = hours.findIndex(
        (item) => item.key === selectedDay?.split(" - ")[0]
      );
      if (hours[index]?.value && startTime && closeTime) {
        hours[index].value = [
          `${
            startTime.split(":")[0] > 12
              ? startTime.split(":")[0] -
                12 +
                ":" +
                startTime.split(":")[1] +
                " PM"
              : startTime + " AM"
          }  - ${
            closeTime.split(":")[0] > 12
              ? closeTime.split(":")[0] -
                12 +
                ":" +
                closeTime.split(":")[1] +
                " PM"
              : closeTime + " AM"
          } `,
        ];
        setHours(hours);
      }

      handleCloseDaysTimeModal();
    }
  };

  const handleCloseDaysTimeModal = () => {
    setDaysTimeModalOpen(false);
    setSelectedWeek();
    setSelectedDay();
    setSelectedAllHours();
    setClosed(false);
    setOpen24Hours(false);
    setStartTime();
    setCloseTime();
  };

  const DisableButton = () => {
    if ((startTime && closeTime) === undefined && !open24Hours && !closed) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <CustomAuthModal
        open={daysTimeModalOpen}
        onClose={handleCloseDaysTimeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="animate__animated animate__slideInDown"
      >
        <Box sx={style} className="!w-[80%] lg:!w-[40%]">
          <div className="p-5 pb-0">
            <div className="flex justify-between items-center">
              <div className="sm:text-[22px] text-[16px] font-bold">
                Select days & time
              </div>
              <span>
                <CloseIcon
                  className="text-gray-500 !text-xl sm:!text-3xl"
                  fontSize="large"
                  onClick={() => handleCloseDaysTimeModal(false)}
                />
              </span>
            </div>

            <div className="max-h-[calc(100vh-300px)] sm:max-h-[calc(100vh-350px)] overflow-auto">
              <div className="mt-10 flex items-center gap-2 sm:gap-5 flex-wrap">
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ]?.map((itm, index) => (
                  <div
                    className={`md:px-[3%] md:py-[2%] px-[4%] py-[2%]  border rounded-[50%] cursor-pointer ${
                      selectedDay?.split(" - ")[0] === itm &&
                      "bg-colorGreen text-white"
                    } ${
                      selectedWeek?.find((day) => day === itm) &&
                      "bg-colorGreen text-white"
                    } ${
                      selectedAllHours?.find((day) => day === itm) &&
                      "bg-colorGreen text-white"
                    }  hover:bg-[#bdbbbb]`}
                    key={itm}
                  >
                    {itm.charAt(0)}
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={open24Hours}
                      onChange={(e) => {
                        setOpen24Hours(e.target.checked);
                        if (closed) {
                          setClosed(!e.target.checked);
                        }
                      }}
                    />
                  }
                  label="Open 24 Hours"
                  className="uppercase"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={closed}
                      onChange={(e) => {
                        setClosed(e.target.checked);
                        if (open24Hours) {
                          setOpen24Hours(!e.target.checked);
                        }
                      }}
                    />
                  }
                  label="Closed"
                  className="uppercase"
                />
              </div>
              {!(closed || open24Hours) && (
                <div className=" mt-5 flex flex-col sm:flex-row sm:items-center items-start gap-10">
                  <TextField
                    label="Open Time"
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                    }}
                  />

                  <TextField
                    label="Close Time"
                    type="time"
                    value={closeTime}
                    onChange={(e) => {
                      setCloseTime(e.target.value);
                    }}
                  />
                </div>
              )}
            </div>
            <div className=" mt-5">
              <Divider />
            </div>
            <div className="mt-4 flex items-center justify-end">
              <Button
                variant="outlined"
                size="large"
                className="!font-semibold !mr-4 !bg-[#FAFCFC] !border !border-[#e5e7eb] hover:!border-[#e5e7eb] hover:!border !text-inherit hover:!bg-[#FAFCFC]"
                onClick={handleCloseDaysTimeModal}
              >
                Cancel
              </Button>
              <Button
                size="large"
                className={`!font-semibold !text-white !bg-colorGreen hover:!bg-colorGreen !border-colorGreen`}
                onClick={saveDaysTimeData}
                disabled={DisableButton()}
              >
                Save
              </Button>
            </div>
          </div>
        </Box>
      </CustomAuthModal>
    </>
  );
};

export default withAuthWithoutShop(ShopPage);
