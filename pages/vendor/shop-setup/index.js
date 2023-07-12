import React, { useEffect, useState } from "react";
import { withAuthWithoutShop } from "../../../components/core/PrivateRouteForVendor";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  MenuItem,
  Divider,
  Button,
  IconButton,
  Checkbox,
  TextField,
  CircularProgress,
  FormControl,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { TbPhotoPlus } from "react-icons/tb";
import AddIcon from "@mui/icons-material/Add";
import { Controller, useForm } from "react-hook-form";
import {
  CustomAuthModal,
  CustomTextField,
} from "../../../components/core/CustomMUIComponents";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { SingleImageUploadFile } from "../../../services/SingleImageUploadFile";
import { MultipleImageUploadFile } from "../../../services/MultipleImageUploadFile";
import { VideoUploadFile } from "../../../services/VideoUploadFile";
import { shopRegistration } from "../../../graphql/mutations/shops";
import { setShopRegisterId } from "../../../redux/ducks/userProfile";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import CustomTextFieldVendor from "../../../components/Layout/CustomTextFieldVendor";
import TimeCustomTextField from "../../../components/Layout/TimeCustomTextField";

const subBranchStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  maxWidth: "1200px",
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  borderRadius: "12px",
  height: "auto",
};

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

  const [sameAsOwner, setSameAsOwner] = useState("False");
  const [individual, setIndividual] = useState(false);
  const [subBranchModalOpen, setSubBranchModalOpen] = useState(false);
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
    reset,
    watch,
    getValues,
    setError,
    control,
  } = useForm();

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

  const getAllValues = () => {
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
  };

  useEffect(() => {
    getAllValues();
  }, [getValues, sameAsOwner, setValue, currentStep]);

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

  const returnSubBranchData = (val) => {
    return {
      branch_address: val.subManagerAddress,
      branch_pinCode: val.subManagerPinCode,
      branch_city: val.city,
      manager_name: val.subManagerFirstName + " " + val.subManagerLastName,
      manager_contact: val.subManagerPhone,
      manager_email: val.manager_user_email,
      branch_type: "sub",
    };
  };

  const onSubmit = (data) => {
    if (currentStep !== 3) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Data To be Submitted !!", data);
      setLoading(true);
      SingleImageUploadFile(uploadShopLogo).then((logoResponse) => {
        SingleImageUploadFile(uploadShopBackground).then(
          (backgroundResponse) => {
            MultipleImageUploadFile(uploadShopImages).then((imagesResponse) => {
              uploadShopVideo !== ""
                ? VideoUploadFile(uploadShopVideo).then((videoResponse) => {
                    shopRegistration({
                      userId: userProfile.id,
                      ownerInfo: {
                        owner_firstName: data.first_name,
                        owner_lastName: data.last_name,
                        owner_email: data.user_email,
                        owner_contact: data.user_contact,
                      },
                      shopInfo: {
                        shop_logo: logoResponse.data.data.singleUpload,
                        shop_cover_image:
                          backgroundResponse.data.data.singleUpload,
                        shop_images:
                          imagesResponse.data.data.multipleUpload.map((itm) => {
                            return { links: itm };
                          }),
                        shop_video: videoResponse.data.data.singleUpload,

                        form_steps: "3",
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
                            is_close:
                              day["value"][0] === "Closed" ? true : false,
                            is_24Hours_open:
                              day["value"][0] === "Open 24 hours"
                                ? true
                                : false,
                          };
                        }),
                      },
                      branchInfo: [
                        {
                          branch_address: data.address,
                          branch_city: data.city,
                          branch_pinCode: data.pin_code,
                          manager_name:
                            data.manager_first_name +
                            " " +
                            data.manager_last_name,
                          manager_contact: data.manager_user_contact,
                          manager_email: data.manager_user_email,
                          branch_type: "main",
                        },
                        ...(subBranch.length > 0
                          ? subBranch?.map(returnSubBranchData)
                          : []),
                      ],
                    }).then(
                      (res) => {
                        console.log("res:::", res);
                        dispatch(
                          setShopRegisterId(res.data.createShop.shopInfo.id)
                        );
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
                  })
                : shopRegistration({
                    userId: userProfile.id,
                    ownerInfo: {
                      owner_firstName: data.first_name,
                      owner_lastName: data.last_name,
                      owner_email: data.user_email,
                      owner_contact: data.user_contact,
                    },
                    shopInfo: {
                      shop_logo: logoResponse.data.data.singleUpload,
                      shop_cover_image:
                        backgroundResponse.data.data.singleUpload,
                      shop_images: imagesResponse.data.data.multipleUpload?.map(
                        (itm) => {
                          return { links: itm };
                        }
                      ),
                      form_steps: "3",
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
                        branch_pinCode: data.pin_code,
                        branch_city: data.city,
                        manager_name:
                          data.manager_first_name +
                          " " +
                          data.manager_last_name,
                        manager_contact: data.manager_user_contact,
                        manager_email: data.manager_user_email,
                        branch_type: "main",
                      },
                      ...(subBranch.length > 0
                        ? subBranch?.map(returnSubBranchData)
                        : []),
                    ],
                  }).then(
                    (res) => {
                      console.log("res:::", res);
                      dispatch(
                        setShopRegisterId(res.data.createShop.shopInfo.id)
                      );
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
            });
          }
        );
      });
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
              onClick={() => handleClickIndividual("Shop", false)}
            >
              Shop
            </button>
            <button
              className={`text-gray-400 sm:text-2xl sm:py-3  sm:px-14  py-2 text-lg px-8 ${
                selectedOption === "Individual" &&
                "bg-colorGreen rounded-md text-white"
              }`}
              onClick={() => handleClickIndividual("Individual", true)}
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
                        <CustomTextFieldVendor
                          label="First Name"
                          type="text"
                          id="fName"
                          name="first_name"
                          isRequired={true}
                          placeholder="Your first name"
                          fieldValue={getValues("first_name")}
                          fieldError={errors?.first_name}
                          formValue={{
                            ...register("first_name", {
                              required: "First name is required",
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
                          label="Last Name"
                          type="text"
                          id="lName"
                          name="last_name"
                          isRequired={true}
                          placeholder="Your last name"
                          fieldValue={getValues("last_name")}
                          fieldError={errors?.last_name}
                          formValue={{
                            ...register("last_name", {
                              required: "Last name is required",
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
                        label="E-Mail"
                        type="email"
                        id="email"
                        name="user_email"
                        isRequired={true}
                        placeholder="yourmail@gmail.com"
                        fieldValue={getValues("user_email")}
                        fieldError={errors?.user_email}
                        formValue={{
                          ...register("user_email", {
                            required: "Email is required",

                            pattern: {
                              value:
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                              message: "Please enter a valid email",
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
                        label="Phone Number"
                        type="text"
                        id="phone"
                        name="user_contact"
                        isRequired={true}
                        placeholder="Your phone number"
                        fieldValue={getValues("user_contact")}
                        fieldError={errors?.user_contact}
                        formValue={{
                          ...register("user_contact", {
                            required: "Contact number is required",
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Please enter a valid mobile number",
                            },
                          }),
                        }}
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
                      <CustomTextFieldVendor
                        name="shop_name"
                        label="Shop Name"
                        type="text"
                        id="shopName"
                        isRequired={true}
                        placeholder="Your shop name"
                        formValue={{
                          ...register("shop_name", {
                            required: "Shop name is required",
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
                            label="Shop Email"
                            type="email"
                            id="shopEmail"
                            isRequired={true}
                            placeholder="Your shop email"
                            formValue={{
                              ...register("shop_email", {
                                required: "Shop email is required",

                                pattern: {
                                  value:
                                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                  message: "Please enter a valid email",
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
                              ...register("personal_website", {
                                // required: "Personal Website is required",
                              }),
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
                        <div className="w-full flex gap-4 max-md:flex-col max-md:gap-8">
                          <div className="w-1/2 relative max-md:w-full">
                            <CustomTextFieldVendor
                              name="facebook_link"
                              label="Fackbook Link"
                              type="text"
                              id="fbLink"
                              isRequired={false}
                              placeholder="Your facebook link"
                              formValue={{
                                ...register("facebook_link", {
                                  // required: "Facebook Link is required",
                                }),
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
                                ...register("instagram_link", {
                                  // required: "Instagram Link is required",
                                }),
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
                  {!individual && (
                    <>
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
                          onClick={() => setHoursModalOpen(true)}
                        >
                          <EditIcon
                            fontSize="small"
                            className="text-gray-400"
                          />
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
                    </>
                  )}

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
                <div className="sm:mx-10 mx-3">
                  <div className="grid grid-cols-3 gap-10 my-10">
                    <div className="flex flex-col items-center justify-center col-span-3">
                      <div
                        className="sm:w-[300px]  sm:h-[300px] h-[250px] w-[250px] border border-gray-200 hover:border-4 cursor-pointer hover:border-colorGreen rounded-full flex items-center justify-center"
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
                              <p className="sm:text-xl text-sm font-bold text-gray-400">
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
                          {...register("shopLogo", {
                            required:
                              shopLogo === ""
                                ? "ShopLogo is required *"
                                : false,
                            onChange: (e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                onShopLogoPreviewImage(e);
                              }
                            },
                          })}
                        />
                      </div>
                      {errors.shopLogo && (
                        <div className="mt-2">
                          <span style={{ color: "red" }}>
                            {errors.shopLogo?.message}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center justify-center col-span-3">
                      <div
                        className="sm:w-2/3 w-full cursor-pointer sm:h-[350px] h-[200px] col-span-3 border border-gray-200 hover:border-4 hover:border-colorGreen rounded-3xl flex items-center justify-center"
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
                          {...register("shopBackground", {
                            required:
                              shopBackground === ""
                                ? "ShopBackground is required *"
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
                        <div className="mt-2">
                          <span style={{ color: "red" }}>
                            {errors.shopBackground?.message}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="col-span-3">
                      <div className="sm:w-[85%] sm:mx-auto sm:text-xl text-lg font-semibold  mb-10 mx-2">
                        Shop Images
                      </div>
                      <div className="sm:w-[85%] sm:mx-auto flex xl:gap-8 xl:flex-row flex-col gap-4">
                        {["One", "Two", "Three"]?.map((item, index) => {
                          return (
                            <>
                              <div
                                key={index}
                                className="w-full cursor-pointer sm:h-[344px] h-[344px] border border-gray-200 hover:border-4 hover:border-colorGreen rounded-3xl flex items-center justify-center"
                                onClick={() =>
                                  handleBrowseClickShopImages(
                                    `shopImage${item}`,
                                    index
                                  )
                                }
                              >
                                {shopImages[index] ? (
                                  <div className="w-full sm:h-[344px] h-[344px]">
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
                                  {...register("shopImages", {
                                    required: !ShopImgError[index]
                                      ? "Shop all images is required *"
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
                        <div className="flex justify-center mt-2">
                          <span style={{ color: "red" }}>
                            {errors.shopImages?.message}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="w-full col-span-3">
                      <div className="sm:w-2/3 sm:mx-auto sm:text-xl text-lg font-semibold  mb-10 mx-2">
                        Shop Video
                      </div>
                      <div
                        className="sm:w-2/3 w-full sm:mx-auto cursor-pointer sm:h-[350px] h-[200px]  border border-gray-200 hover:border-4 hover:border-colorGreen rounded-3xl flex items-center justify-center"
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
                    loading={loading}
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
                    <div className="w-full flex sm:flex-row sm:gap-4 flex-col gap-8">
                      <div className="sm:w-1/2 relative w-full">
                        <CustomTextFieldVendor
                          name="city"
                          label=" City"
                          type="text"
                          id="city"
                          isRequired={true}
                          placeholder="Your city"
                          formValue={{
                            ...register("city", {
                              required: "City is required",
                            }),
                          }}
                        />
                        {errors.city && (
                          <div className="mt-2">
                            <span style={{ color: "red" }}>
                              {errors.city?.message}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="sm:w-1/2 relative w-full">
                        <CustomTextFieldVendor
                          name="pin_code"
                          label=" Pincode"
                          type="number"
                          id="pincode"
                          isRequired={true}
                          placeholder="Your pincode"
                          formValue={{
                            ...register("pin_code", {
                              required: "PinCode is required",
                            }),
                          }}
                        />
                        {errors.pin_code && (
                          <div className="mt-2">
                            <span style={{ color: "red" }}>
                              {errors.pin_code?.message}
                            </span>
                          </div>
                        )}
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
                      value={sameAsOwner}
                      onChange={(e) => {
                        if (e.target.value === "True") {
                          setSameAsOwner("True");
                        } else {
                          setSameAsOwner("False");
                        }
                      }}
                    >
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <span className="hidden sm:inline">
                            <Radio
                              name="saveAsOwner"
                              id="True"
                              value="True"
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
                              id="True"
                              value="True"
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
                            htmlFor="True"
                            className="sm:text-xl text-sm text-gray-400 font-semibold"
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
                              id="False"
                              value="False"
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
                            htmlFor="False"
                            className="sm:text-xl text-sm text-gray-400 font-semibold"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </RadioGroup>

                    <div className="w-full flex sm:flex-row sm:gap-4 flex-col gap-8">
                      <div className="sm:w-1/2 relative w-full">
                        <FormControl fullWidth>
                          <Controller
                            name="manager_first_name"
                            control={control}
                            defaultValue="" // Set the initial value here
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
                            defaultValue="" // Set the initial value here
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
                          defaultValue="" // Set the initial value here
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
                          defaultValue="" // Set the initial value here
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
                  {!individual && (
                    <div className="my-10">
                      <button
                        onClick={() => setSubBranchModalOpen(true)}
                        disabled={!subBranchButtonShow}
                        className={`${
                          !subBranchButtonShow ? "opacity-50" : "opacity-100"
                        } cursor-pointer flex items-center uppercase border-2  sm:px-8 sm:py-3 sm:text-base px-3 py-2 text-sm rounded-md font-semibold border-colorGreen text-colorGreen`}
                      >
                        Sub Branch
                        <span className="hidden sm:inline">
                          <AddIcon fontSize="medium" className="ml-2" />
                        </span>
                        <span className="sm:hidden">
                          <AddIcon fontSize="small" className="ml-2" />
                        </span>
                      </button>
                    </div>
                  )}

                  {subBranch?.length > 0 && (
                    <div className="mb-10">
                      <h3 className="text-colorPrimary text-lg font-semibold leading-8 my-5">
                        Sub Branches
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        {subBranch?.map((sub, index) => (
                          <div
                            className="bg-colorWhite rounded-xl flex flex-col gap-1"
                            key={index}
                          >
                            <p className="text-sm sm:text-base lg:text-lg text-colorBlack flex justify-between">
                              <b className="mr-2 text-sm sm:text-base lg:text-lg">
                                Branch Address :{" "}
                              </b>
                              {sub.subManagerAddress}
                            </p>
                            <p className="text-sm sm:text-base lg:text-lg text-colorBlack flex justify-between">
                              <b className="mr-2 text-sm sm:text-base lg:text-lg">
                                Branch City :{" "}
                              </b>
                              {sub.subManagerCity}
                            </p>
                            <p className="text-sm sm:text-base lg:text-lg text-colorBlack flex justify-between">
                              <b className="mr-2 text-sm sm:text-base lg:text-lg">
                                Branch PinCode :{" "}
                              </b>
                              {sub.subManagerPinCode}
                            </p>
                            <p className="text-sm sm:text-base lg:text-lg text-colorBlack flex justify-between">
                              <b className="mr-2 text-sm sm:text-base lg:text-lg">
                                Branch Manager Name :
                              </b>
                              {sub.subManagerFirstName +
                                " " +
                                sub.subManagerLastName}
                            </p>
                            <p className="text-sm sm:text-base lg:text-lg text-colorBlack flex justify-between">
                              <b className="mr-2 text-sm sm:text-base lg:text-lg">
                                Branch Manager Email :
                              </b>
                              {sub.subManagerEmail}
                            </p>
                            <p className="text-sm sm:text-base lg:text-lg text-colorBlack flex justify-between">
                              <b className="mr-2 text-sm sm:text-base lg:text-lg">
                                Branch Manager Phone Number :
                              </b>
                              {sub.subManagerPhone}
                            </p>

                            <div className="container mt-5">
                              <Divider />
                            </div>
                            <div className="container mt-5 flex items-center justify-end gap-5">
                              <IconButton
                                aria-label="delete"
                                className="!rounded-xl !capitalize !text-colorBlack !p-2 !bg-red-600 hover:!bg-red-600"
                                onClick={() => {
                                  setSubBranch(
                                    subBranch.filter((itm) => itm.id !== sub.id)
                                  );
                                }}
                              >
                                <DeleteIcon className="!text-colorWhite" />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                className="!rounded-xl !capitalize !text-colorBlack !p-2 !bg-colorStone hover:!bg-colorStone"
                                onClick={() => {
                                  setSubBranchModalOpen(true);
                                  setSubBranchEdit(sub);
                                }}
                              >
                                <EditIcon className="!text-colorWhite" />
                              </IconButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
      <SubBranchModal
        subBranchModalOpen={subBranchModalOpen}
        setSubBranchModalOpen={setSubBranchModalOpen}
        subBranch={subBranch}
        setSubBranch={setSubBranch}
        setValue={setValue}
        getValues={getValues}
        subBranchEdit={subBranchEdit}
        setSubBranchEdit={setSubBranchEdit}
      />
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
  loading,
}) => {
  return (
    <div className="flex justify-end sm:gap-4 gap-2 mt-10">
      <button
        onClick={() => {
          currentStep > 1 && setCurrentStep(currentStep - 1);
        }}
        className="bg-[#FAFCFC] sm:py-3 sm:px-12 font-semibold sm:text-lg text-sm px-8 py-2 rounded-[4px] border"
      >
        Back
      </button>
      <button
        className="sm:py-3 sm:px-12 bg-colorGreen sm:rounded-md text-white sm:text-lg rounded-[4px] text-sm px-8 py-2"
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
  subBranchModalOpen,
  setSubBranchModalOpen,
  subBranch,
  setSubBranch,
  setValue,
  getValues,
  setSubBranchEdit,
  subBranchEdit,
}) => {
  const [managerValue, setManagerValue] = useState("");

  const [subManagerAddress, setSubManagerAddress] = useState("");
  const [subManagerCity, setSubManagerCity] = useState("");
  const [subManagerPinCode, setSubManagerPinCode] = useState("");

  const [subManagerFirstName, setSubManagerFirstName] = useState("");
  const [subManagerLastName, setSubManagerLastName] = useState("");
  const [subManagerEmail, setSubManagerEmail] = useState("");
  const [subManagerPhone, setSubManagerPhone] = useState("");

  const [error, setError] = useState({
    subManagerAddressError: "",
    subManagerCityError: "",
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
            subManagerCity,
            subManagerPinCode,
            subManagerFirstName,
            subManagerLastName,
            subManagerEmail,
            subManagerPhone,
          },
        ]);
        handleSubBranchModalClose();
      } else {
        const editSelectedSubBranchIndex = subBranch.findIndex(
          (sub) => sub.id === subBranchEdit.id
        );

        const editSelectedSubBranch = [...subBranch];

        editSelectedSubBranch[editSelectedSubBranchIndex] = {
          id: subBranchEdit.id,
          subManagerAddress,
          subManagerCity,
          subManagerPinCode,
          subManagerFirstName,
          subManagerLastName,
          subManagerEmail,
          subManagerPhone,
        };
        setSubBranch(editSelectedSubBranch);
        handleSubBranchModalClose();
      }
    }
  };

  const handleSubBranchModalClose = () => {
    setSubBranchModalOpen(false);
    setSubManagerAddress("");
    setSubManagerCity("");
    setSubManagerPinCode("");
    setSubManagerFirstName();
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
    error.subManagerCityError = "";
    error.subManagerPinCodeError = "";
  };
  return (
    <>
      <CustomAuthModal
        open={subBranchModalOpen}
        onClose={handleSubBranchModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="animate__animated animate__slideInDown"
      >
        <Box sx={subBranchStyle} className="!w-[90%] lg:!w-1/2">
          <div className="p-5">
            <div className="flex items-center">
              <ArrowBackIcon
                className="!text-black !cursor-pointer"
                onClick={handleSubBranchModalClose}
              />
              <p className="flex items-center text-colorBlack text-xl ml-5 font-semibold">
                {subBranchEdit?.id ? "Update" : "Add"} Sub Branch
              </p>
              <CloseIcon
                className="!text-black !ml-auto !cursor-pointer"
                onClick={handleSubBranchModalClose}
              />
            </div>

            <div className="h-[calc(100vh-300px)] sm:h-[calc(100vh-450px)] overflow-auto">
              <div className="bg-colorWhite rounded-lg my-5 p-5 space-y-5">
                {/* <h3 className="text-colorPrimary text-lg font-semibold leading-8">
                  Branches
                </h3> */}
                <form>
                  <div className="flex flex-col space-y-3">
                    {/* <p className="mt-2 container flex items-center text-colorBlack text-lg">
                      Sub Branch
                    </p> */}
                    <div className="flex items-center justify-center container gap-20">
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

                    <div className="container flex flex-col sm:flex-row space-y-3 sm:gap-20 w-full justify-between items-center">
                      <div className="w-full flex flex-col gap-2">
                        <Box sx={{ display: "flex" }}>
                          <CustomTextFieldVendor
                            id="input-with-sx"
                            label="City"
                            variant="standard"
                            className="w-full"
                            value={subManagerCity}
                            onChange={(e) => {
                              setSubManagerCity(e.target.value);
                              error.subManagerCityError = "";
                            }}
                          />
                        </Box>
                        <span style={{ color: "red" }}>
                          {error.subManagerCityError || ""}
                        </span>
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <Box sx={{ display: "flex" }}>
                          <CustomTextFieldVendor
                            id="input-with-sx"
                            label="PinCode"
                            variant="standard"
                            className="w-full"
                            type="number"
                            value={subManagerPinCode}
                            onChange={(e) => {
                              setSubManagerPinCode(e.target.value);
                              error.subManagerPinCodeError = "";
                            }}
                          />
                        </Box>
                        <span style={{ color: "red" }}>
                          {error.subManagerPinCodeError || ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center items-center">
                      <div className="flex justify-between items-center container gap-5 sm:gap-10">
                        {/* <span className="font-semibold text-lg text-[#11142D] mt-5">
                          Manager:
                        </span> */}

                        <CustomTextFieldVendor
                          label="Manager"
                          variant="standard"
                          select
                          fullWidth
                          value={managerValue}
                          onChange={(e) => setManagerValue(e.target.value)}
                        >
                          <MenuItem value="">None</MenuItem>
                          {[
                            "Same as owner",
                            "same as main branch manager",
                          ]?.map((man) => (
                            <MenuItem value={man} key={man}>
                              {man}
                            </MenuItem>
                          ))}
                        </CustomTextFieldVendor>
                      </div>
                    </div>

                    <div className="container flex flex-col sm:flex-row space-y-3 sm:gap-20 w-full justify-between items-center">
                      {/* <p className="mt-2 hidden sm:flex items-center text-colorBlack text-lg">
                        Name:
                      </p> */}
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

                    <div className="flex items-center justify-center container gap-10 sm:gap-20">
                      {/* <p className="mt-2 hidden sm:flex items-center justify-between  text-colorBlack text-lg">
                        Email:
                      </p> */}
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

                    <div className="flex items-center justify-center container gap-10 sm:gap-20">
                      {/* <p className="mt-2 hidden sm:flex items-center justify-between  text-colorBlack text-lg">
                        Phone:
                      </p> */}
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

            <div className="container mt-5">
              <Divider />
            </div>
            <div className="container mt-5 flex items-center justify-end gap-5">
              <Button
                variant="outlined"
                className="rounded-xl capitalize text-colorGreen hover:bg-white bg-white border border-colorGreen hover:border-colorGreen py-2 px-5"
                onClick={handleSubBranchModalClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="rounded-xl capitalize text-colorWhite bg-colorGreen hover:bg-colorGreen py-2 px-5"
                onClick={subBranchSubmit}
              >
                {subBranchEdit?.id ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </Box>
      </CustomAuthModal>
    </>
  );
};

const HoursModal = ({
  hoursModalOpen,
  setHoursModalOpen,
  setDaysTimeModalOpen,
  hours,
  selectedDay,
  setSelectedDay,
  setSelectedWeek,
  selectedWeek,
  selectedAllHours,
  setSelectedAllHours,
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
        <Box sx={style} className="!w-[90%] lg:!w-[80%] xl:!w-[50%]">
          <div className="sm:p-5 lg:p-5 p-1">
            <div className="flex justify-between items-center">
              <div className="sm:text-[28px] text-[16px] font-bold">Hours</div>
              <span>
                <CloseIcon
                  className="text-gray-500 !text-xl sm:!text-3xl"
                  fontSize="large"
                  onClick={() => setHoursModalOpen(false)}
                />
              </span>
            </div>
            <div className="h-[calc(100vh-300px)] sm:h-[calc(100vh-400px)] overflow-auto">
              <div className="grid grid-cols-1 gap-y-5 my-2">
                {hours?.map((day, index) => (
                  <div
                    key={index}
                    className="flex justify-between sm:items-center items-start w-full lg:gap-5 xl:gap-10 sm:gap-16 gap-2"
                  >
                    <div className="flex xl:gap-32  items-center mt-1 sm:mt-0">
                      <div className="sm:text-xl text-sm font-semibold">
                        {day["key"]}
                      </div>
                    </div>
                    {day["value"].map((time, index) => (
                      <div
                        key={index}
                        className="flex gap-2 sm:gap-4 sm:items-center items-start sm:mr-20"
                      >
                        {time === "Closed" || time === "Open 24 hours" ? (
                          <p
                            className={`${
                              time === "Closed"
                                ? "text-red-600"
                                : time === "Open 24 hours"
                                ? "text-green-600"
                                : ""
                            } font-semibold text-xl`}
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
                          className="border mr-2 sm:mr-0 border-gray-200 rounded-full text-gray-400 hover:text-white xl:ml-10  hover:bg-colorGreen hover:border-colorGreen"
                        >
                          <div className="hidden sm:block cursor-pointer">
                            <EditIcon className="m-1 sm:m-3" />
                          </div>
                          <div className="sm:hidden cursor-pointer">
                            <EditIcon fontSize="small" className="m-1 sm:m-3" />
                          </div>
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex sm:justify-center flex-wrap lg:gap-4 gap-2 mt-8">
                <button
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
                  className="uppercase sm:flex sm:items-center border-2 border-gray-400 lg:px-8 lg:py-3 sm:px-5 sm:py-2 sm:text-[14px] text-[10px] px-1 py-1 rounded-[4px] lg:rounded-md text-gray-400 font-semibold hover:border-colorGreen hover:text-colorGreen"
                >
                  <span className="hidden sm:block">
                    <EditIcon className="lg:mx-4 lg:-ml-6 mx-2 -ml-2" />
                  </span>
                  <span className="sm:hidden">
                    <EditIcon className="-ml-1" fontSize="small" />
                  </span>
                  Edit all hours
                </button>
                <button
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
                  className="uppercase sm:flex sm:items-center border-2 border-gray-400 lg:px-8 lg:py-3 sm:px-5 sm:py-2 sm:text-[14px] text-[10px] px-1 py-1 rounded-[4px] lg:rounded-md text-gray-400 font-semibold hover:border-colorGreen hover:text-colorGreen"
                >
                  <span className="hidden sm:block">
                    <EditIcon className="lg:mx-4 lg:-ml-6 mx-2 -ml-2" />
                  </span>
                  <span className="sm:hidden">
                    <EditIcon className="-ml-1" fontSize="small" />
                  </span>
                  Edit Mon to Sat
                </button>
                <button
                  onClick={() => {
                    setDaysTimeModalOpen(true);
                    setSelectedDay(
                      "Sunday" +
                        " - " +
                        hours[hours.findIndex((item) => item.key === "Sunday")]
                          .value
                    );
                  }}
                  className="uppercase sm:flex sm:items-center border-2 border-gray-400 lg:px-8 lg:py-3 sm:px-5 sm:py-2 sm:text-[14px] text-[10px] px-1 py-1 rounded-[4px] lg:rounded-md text-gray-400 font-semibold hover:border-colorGreen hover:text-colorGreen"
                >
                  <span className="hidden sm:block">
                    <EditIcon className="lg:mx-4 lg:-ml-6 mx-2 -ml-2" />
                  </span>
                  <span className="sm:hidden">
                    <EditIcon className="-ml-1" fontSize="small" />
                  </span>
                  Edit Sunday
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-5 lg:gap-6 gap-4">
              <button
                onClick={() => setHoursModalOpen(false)}
                className="uppercase font-semibold text-colorGreen lg:py-3 lg:px-8 sm:py-2 sm:px-5 sm:text-lg text-sm py-1 px-3 rounded-[4px] lg:rounded-md border-2 border-colorGreen"
              >
                Cancel
              </button>
              <button
                onClick={() => setHoursModalOpen(false)}
                className="uppercase font-semibold text-white lg:py-3 lg:px-8 sm:py-2 sm:px-5 sm:text-lg text-sm px-3 py-1 rounded-[4px] lg:rounded-md bg-colorGreen"
              >
                Save
              </button>
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
      hours.map((itm) =>
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
      hours.map((itm) =>
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
      hours.map((itm) =>
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
      hours.map((itm) =>
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
          <div className="p-5">
            <p className="flex items-center text-colorBlack text-xl font-semibold justify-center">
              Select days & time
            </p>

            <div className="max-h-[calc(100vh-300px)] sm:max-h-[calc(100vh-350px)] overflow-auto">
              <div className="container mt-10 flex items-center gap-2 sm:gap-5 flex-wrap">
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((itm, index) => (
                  <div
                    className={`md:px-[3%] md:py-[2%] px-[4%] py-[2%]  border rounded-[50%] ${
                      selectedDay?.split(" - ")[0] === itm && "bg-[#bdbbbb]"
                    } ${
                      selectedWeek?.find((day) => day === itm) && "bg-[#bdbbbb]"
                    } ${
                      selectedAllHours?.find((day) => day === itm) &&
                      "bg-[#bdbbbb]"
                    }  hover:bg-[#bdbbbb] cursor-pointer`}
                    key={itm}
                  >
                    {itm.charAt(0)}
                  </div>
                ))}
              </div>

              <div className="container mt-5">
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
                />
              </div>
              {!(closed || open24Hours) && (
                <div className="container mt-5 flex flex-col sm:flex-row sm:items-center items-start gap-10">
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
            <div className="container mt-5">
              <Divider />
            </div>
            <div className="container mt-5 flex items-center justify-end gap-5">
              <Button
                variant="outlined"
                className="rounded-xl capitalize font-semibold hover:!bg-white !bg-white !text-colorGreen border-2 !border-colorGreen hover:!border-colorGreen py-2 px-5"
                onClick={handleCloseDaysTimeModal}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className={`rounded-xl capitalize font-semibold !text-white ${
                  !DisableButton() && "!bg-colorGreen"
                } hover:!bg-colorGreen border-2 !border-colorGreen py-2 px-5`}
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
