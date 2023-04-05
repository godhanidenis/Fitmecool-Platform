import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
} from "@mui/material";
import {
  CustomAuthModal,
  CustomTextField,
  QontoConnector,
  QontoStepIcon,
} from "../../../components/core/CustomMUIComponents";
import { Box } from "@mui/system";
import { useForm } from "react-hook-form";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import { SingleImageUploadFile } from "../../../services/SingleImageUploadFile";
import { MultipleImageUploadFile } from "../../../services/MultipleImageUploadFile";
import { VideoUploadFile } from "../../../services/VideoUploadFile";
import { shopRegistration } from "../../../graphql/mutations/shops";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import Router from "next/router";
import DeleteIcon from "@mui/icons-material/Delete";
import { setShopRegisterId } from "../../../redux/ducks/userProfile";
import { withAuthWithoutShop } from "../../../components/core/PrivateRouteForVendor";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const shopRegistrationSteps = ["Details", "Photos", "Branches"];
const style = {
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

const ShopPage = () => {
  const { userProfile } = useSelector((state) => state.userProfile);

  const [activeStep, setActiveStep] = useState(2);
  const [completed, setCompleted] = useState([]);
  const [hoursModalOpen, setHoursModalOpen] = useState(false);
  const [daysTimeModalOpen, setDaysTimeModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedWeek, setSelectedWeek] = useState();
  const [selectedAllHours, setSelectedAllHours] = useState();

  const [subBranchModalOpen, setSubBranchModalOpen] = useState(false);

  const [hours, setHours] = useState([
    { key: "Sunday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Monday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Tuesday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Wednesday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Thursday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Friday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Saturday", value: ["09:00 AM - 08:00 PM"] },
  ]);
  const [shopLogo, setShopLogo] = useState("");
  const [uploadShopLogo, setUploadShopLogo] = useState("");

  const [shopBackground, setShopBackground] = useState("");
  const [uploadShopBackground, setUploadShopBackground] = useState("");

  // const [shopImages, setShopImages] = useState([]);
  // const [uploadShopImages, setUploadShopImages] = useState("");

  const [shopImagesOne, setShopImagesOne] = useState([]);
  const [uploadShopImagesOne, setUploadShopImagesOne] = useState([]);

  const [shopImagesSecond, setShopImagesSecond] = useState([]);
  const [uploadShopImagesSecond, setUploadShopImagesSecond] = useState([]);

  const [shopImagesThird, setShopImagesThird] = useState([]);
  const [uploadShopImagesThird, setUploadShopImagesThird] = useState([]);

  const AllUploadShopImages = [...uploadShopImagesOne, ...uploadShopImagesSecond, ...uploadShopImagesThird];

  const [ShopImageFirst, setShopImageFirst] = useState(false);
  const [ShopImageSecond, setShopImageSecond] = useState(false);
  const [ShopImageThird, setShopImageThird] = useState(false);

  const [shopVideo, setShopVideo] = useState("");
  const [uploadShopVideo, setUploadShopVideo] = useState("");

  const [individual, setIndividual] = useState(false);

  const [sameAsOwner, setSameAsOwner] = useState("False");

  const [loading, setLoading] = useState(false);

  const [subBranch, setSubBranch] = useState([]);

  const [subBranchEdit, setSubBranchEdit] = useState();
  const dispatch = useDispatch();

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
  }, [getValues, sameAsOwner, setValue, activeStep]);

  const totalSteps = () => {
    return shopRegistrationSteps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          shopRegistrationSteps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
    if (activeStep !== 2) {
      handleNext();
    } else {
      console.log("Data To be Submitted !!", data);

      setLoading(true);
      SingleImageUploadFile(uploadShopLogo).then((logoResponse) => {
        SingleImageUploadFile(uploadShopBackground).then((backgroundResponse) => {
          MultipleImageUploadFile(AllUploadShopImages).then((imagesResponse) => {
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
                      shop_cover_image: backgroundResponse.data.data.singleUpload,
                      shop_images: imagesResponse.data.data.multipleUpload.map((itm) => {
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
                      shop_time: hours.map((day) => {
                        return {
                          week: day["key"],
                          open_time:
                            day["value"][0] === "Closed" || day["value"][0] === "Open 24 hours"
                              ? "-"
                              : day["value"][0].split(" - ")[0],
                          close_time:
                            day["value"][0] === "Closed" || day["value"][0] === "Open 24 hours"
                              ? "-"
                              : day["value"][0].split(" - ")[1],
                          is_close: day["value"][0] === "Closed" ? true : false,
                          is_24Hours_open: day["value"][0] === "Open 24 hours" ? true : false,
                        };
                      }),
                    },
                    branchInfo: [
                      {
                        branch_address: data.address,
                        branch_city: data.city,
                        branch_pinCode: data.pin_code,
                        manager_name: data.manager_first_name + " " + data.manager_last_name,
                        manager_contact: data.manager_user_contact,
                        manager_email: data.manager_user_email,
                        branch_type: "main",
                      },
                      ...(subBranch.length > 0 ? subBranch.map(returnSubBranchData) : []),
                    ],
                  }).then(
                    (res) => {
                      console.log("res:::", res);
                      dispatch(setShopRegisterId(res.data.createShop.shopInfo.id));
                      toast.success(res.data.createShop.message, {
                        theme: "colored",
                      });
                      setLoading(false);
                      localStorage.setItem("userHaveAnyShop", "true");
                      Router.push("/vendor/dashboard");
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
                    shop_cover_image: backgroundResponse.data.data.singleUpload,
                    shop_images: imagesResponse.data.data.multipleUpload.map((itm) => {
                      return { links: itm };
                    }),
                    form_steps: "3",
                    shop_social_link: {
                      facebook: individual ? "" : data.facebook_link,
                      instagram: individual ? "" : data.instagram_link,
                      website: individual ? "" : data.personal_website,
                    },
                    shop_name: data.shop_name,
                    shop_email: data.shop_email,
                    shop_type: individual ? "individual" : "shop",
                    shop_time: hours.map((day) => {
                      return {
                        week: day["key"],
                        open_time:
                          day["value"][0] === "Closed" || day["value"][0] === "Open 24 hours"
                            ? "-"
                            : day["value"][0].split(" - ")[0],
                        close_time:
                          day["value"][0] === "Closed" || day["value"][0] === "Open 24 hours"
                            ? "-"
                            : day["value"][0].split(" - ")[1],
                        is_close: day["value"][0] === "Closed" ? true : false,
                        is_24Hours_open: day["value"][0] === "Open 24 hours" ? true : false,
                      };
                    }),
                  },
                  branchInfo: [
                    {
                      branch_address: data.address,
                      branch_pinCode: data.pin_code,
                      branch_city: data.city,
                      manager_name: data.manager_first_name + " " + data.manager_last_name,
                      manager_contact: data.manager_user_contact,
                      manager_email: data.manager_user_email,
                      branch_type: "main",
                    },
                    ...(subBranch.length > 0 ? subBranch.map(returnSubBranchData) : []),
                  ],
                }).then(
                  (res) => {
                    console.log("res:::", res);
                    dispatch(setShopRegisterId(res.data.createShop.shopInfo.id));
                    toast.success(res.data.createShop.message, {
                      theme: "colored",
                    });
                    setLoading(false);
                    localStorage.setItem("userHaveAnyShop", "true");
                    Router.push("/vendor/dashboard");
                  },
                  (error) => {
                    setLoading(false);
                    toast.error(error.message, { theme: "colored" });
                  }
                );
          });
        });
      });
    }
  };

  const onError = (errors) => console.log("Errors Occurred !! :", errors);

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

  // const createShopImagesChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setShopImages([]);
  //   setUploadShopImages([]);
  //   files.forEach((file) => {
  //     setUploadShopImages((old) => [...old, file]);
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onloadend = () => {
  //       setShopImages((old) => [...old, reader.result]);
  //     };
  //   });
  // };

  const createShopImagesChangeOne = (e) => {
    const files = Array.from(e.target.files);
    setShopImagesOne([]);
    setUploadShopImagesOne([]);
    files.forEach((file) => {
      setUploadShopImagesOne([file]);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setShopImagesOne([reader.result]);
      };
    });
    setShopImageFirst(true);
  };
  const createShopImagesChangeTwo = (e) => {
    const files = Array.from(e.target.files);
    setShopImagesSecond([]);
    setUploadShopImagesSecond([]);
    files.forEach((file) => {
      setUploadShopImagesSecond([file]);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setShopImagesSecond([reader.result]);
      };
    });
    setShopImageSecond(true);
  };
  const createShopImagesChangeThird = (e) => {
    const files = Array.from(e.target.files);
    setShopImagesThird([]);
    setUploadShopImagesThird([]);
    files.forEach((file) => {
      setUploadShopImagesThird([file]);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setShopImagesThird([reader.result]);
      };
    });
    setShopImageThird(true);
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

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <div className="">
        <div className="container py-10">
          <div className="flex justify-center">
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />} className="md:w-[30%]">
              {shopRegistrationSteps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>

          <>
            {activeStep === 0 && (
              <>
                <div className="container p-5 !w-[70%] flex justify-end px-0">
                  <div className="flex items-center gap-2">
                    <label className="inline-flex border-2 cursor-pointer dark:bg-white-300 dark:text-white-800">
                      <input
                        id="Toggle4"
                        type="checkbox"
                        className="hidden peer"
                        onChange={(e) => setIndividual(e.target.checked)}
                      />
                      <span className="px-4 py-1 bg-colorPrimary peer-checked:text-black peer-checked:bg-white text-white">
                        SHOP
                      </span>
                      <span className="px-4 py-1 dark:bg-white-300 peer-checked:bg-colorPrimary peer-checked:text-white ">
                        INDIVIDUAL
                      </span>
                    </label>
                  </div>
                </div>
                <div className="container bg-colorWhite rounded-lg p-5 !w-[70%]">
                  <h3 className="container text-colorPrimary text-lg font-semibold leading-8">OWNER DETAILS</h3>
                  <form>
                    <div className="flex flex-col space-y-3">
                      <div className="container flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:gap-5 w-full justify-between items-center">
                        {/* <p className="mt-2 hidden sm:flex items-center text-colorBlack text-lg">Name:</p> */}
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="First Name*"
                              variant="standard"
                              className="w-full"
                              {...register("first_name", {
                                required: "First name is required",
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {errors.first_name && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.first_name?.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Last Name*"
                              variant="standard"
                              className="w-full"
                              {...register("last_name", {
                                required: "Last name is required",
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {errors.last_name && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.last_name?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center container gap-10 sm:gap-20">
                        {/* <p className="mt-2 hidden sm:flex items-center justify-between  text-colorBlack text-lg">
                          Email:
                        </p> */}
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Email Address*"
                              variant="standard"
                              className="w-full"
                              {...register("user_email", {
                                required: "Email is required",

                                pattern: {
                                  value:
                                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                  message: "Please enter a valid email",
                                },
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {errors.user_email && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.user_email?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center container gap-10 sm:gap-20">
                        {/* <p className="mt-2 hidden sm:flex items-center justify-between  text-colorBlack text-lg">
                          Phone:
                        </p> */}
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Phone Number*"
                              variant="standard"
                              className="w-full"
                              type="number"
                              {...register("user_contact", {
                                required: "Contact number is required",
                                minLength: {
                                  value: 10,
                                  message: "Contact Number must be 10 numbers",
                                },
                                maxLength: {
                                  value: 10,
                                  message: "Contact Number must be 10 numbers",
                                },
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {errors.user_contact && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.user_contact?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="container bg-colorWhite rounded-lg my-5 lg:my-5 p-5 !w-[70%]">
                  <h3 className="container text-colorPrimary text-lg font-semibold leading-8">SHOP INFO</h3>
                  <form>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-center container gap-20">
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Shop Name*"
                              variant="standard"
                              className="w-full"
                              {...register("shop_name", {
                                required: "Shop name is required",
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {errors.shop_name && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.shop_name?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {!individual && (
                        <>
                          <div className="flex items-center justify-center container gap-20">
                            <div className="w-full">
                              <Box sx={{ display: "flex" }}>
                                <CustomTextField
                                  id="input-with-sx"
                                  label="Shop Email"
                                  variant="standard"
                                  className="w-full"
                                  {...register("shop_email", {
                                    // required: "Shop email is required",

                                    pattern: {
                                      value:
                                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                      message: "Please enter a valid email",
                                    },
                                  })}
                                />
                              </Box>
                              <div className="mt-2">
                                {errors.shop_email && (
                                  <span style={{ color: "red" }} className="-mb-6">
                                    {errors.shop_email?.message}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-center container gap-20">
                            <div className="w-full">
                              <Box sx={{ display: "flex" }}>
                                <CustomTextField
                                  id="input-with-sx"
                                  label="Personal Website Link"
                                  variant="standard"
                                  className="w-full"
                                  {...register("personal_website", {
                                    // required: "Personal Website is required",
                                  })}
                                />
                              </Box>
                              <div className="mt-2">
                                {errors.personal_website && (
                                  <span style={{ color: "red" }} className="-mb-6">
                                    {errors.personal_website?.message}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="container flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:gap-5 w-full justify-between items-center">
                            <div className="w-full">
                              <Box sx={{ display: "flex" }}>
                                <CustomTextField
                                  id="input-with-sx"
                                  label="Facebook Link"
                                  variant="standard"
                                  className="w-full"
                                  {...register("facebook_link", {
                                    // required: "Facebook Link is required",
                                  })}
                                />
                              </Box>
                              <div className="mt-2">
                                {errors.facebook_link && (
                                  <span style={{ color: "red" }} className="-mb-6">
                                    {errors.facebook_link?.message}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="w-full">
                              <Box sx={{ display: "flex" }}>
                                <CustomTextField
                                  id="input-with-sx"
                                  label="Instagram Link"
                                  variant="standard"
                                  className="w-full"
                                  {...register("instagram_link", {
                                    // required: "Instagram Link is required",
                                  })}
                                />
                              </Box>
                              <div className="mt-2">
                                {errors.instagram_link && (
                                  <span style={{ color: "red" }} className="-mb-6">
                                    {errors.instagram_link?.message}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="container flex gap-2 w-full flex-col">
                            <p className="flex items-center text-colorBlack text-lg">Hours</p>
                            <div
                              className="w-full border border-colorBlack p-3 rounded-lg flex items-center justify-between cursor-pointer text-colorBlack text-sm sm:text-base font-semibold"
                              onClick={() => {
                                setHoursModalOpen(true);
                              }}
                            >
                              <div>
                                {hours.map((day, index) => (
                                  <div className="flex items-center gap-2" key={index}>
                                    {day["key"]} :
                                    <div className="flex items-center gap-5">
                                      {day["value"]?.map((time, index) => (
                                        <p key={index}>{time}</p>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <KeyboardArrowRightIcon />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </>
            )}
            {activeStep === 1 && (
              <>
                <div className="flex flex-col sm:flex-row sm:gap-20 justify-center items-center container mt-10">
                  <div>
                    {/* <label className="flex justify-center items-center font-bold mb-3">Logo</label> */}
                    <input
                      type="file"
                      id="shopLogo"
                      name="shopLogo"
                      hidden
                      {...register("shopLogo", {
                        required: shopLogo === "" ? "shopLogo is required" : false,
                        onChange: (e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            onShopLogoPreviewImage(e);
                          }
                        },
                      })}
                    />
                    {shopLogo !== "" ? (
                      <div>
                        <Image
                          src={shopLogo}
                          height="150px"
                          alt="logoimg"
                          width="150px"
                          style={{ borderRadius: 100 }}
                        />
                        <div
                          className="bg-gray-300 rounded-full flex justify-center items-center"
                          style={{
                            position: "relative",
                            left: 100,
                            bottom: 30,
                            height: 30,
                            width: 30,
                            color: "#5cb85c",
                          }}
                        >
                          <button onClick={() => {}}>
                            <EditIcon
                              style={{ color: "black" }}
                              onClick={() => {
                                document.getElementById("shopLogo").click();
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="border rounded-full border-[cadetblue]"
                        // style={{
                        //   borderStyle: "dashed",
                        //   border: "1px dashed #000000",
                        // }}
                      >
                        {/* <button
                          className="h-24 w-24  border-dashed border-colorSecondary flex justify-center items-center"
                          onClick={() => {
                            document.getElementById("shopLogo").click();
                          }}
                        >
                          Upload
                        </button> */}
                        <div className="m-10">
                          <div style={{ width: "inherit" }} className="mb-2 flex justify-center items-center">
                            <AddAPhotoIcon />
                          </div>
                          <div className="mb-3 px-[12px] text-sm font-emoji">
                            <p>Upload Logo</p>
                          </div>
                          <div className="mb-2">
                            <Button
                              variant="contained"
                              component="label"
                              className="w-full !capitalize !bg-gray-500 !rounded-3xl"
                              onClick={() => {
                                document.getElementById("shopLogo").click();
                              }}
                            >
                              Upload
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-2">
                      {errors.shopLogo && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {errors.shopLogo?.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {/* <label className="flex justify-center items-center font-bold  mb-3">Background</label> */}

                    <input
                      type="file"
                      id="shopBackground"
                      name="shopBackground"
                      hidden
                      {...register("shopBackground", {
                        required: shopBackground === "" ? "shopBackground is required" : false,
                        onChange: (e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            onShopBackgroundPreviewImage(e);
                          }
                        },
                      })}
                    />

                    {shopBackground !== "" ? (
                      <div>
                        <Image src={shopBackground} height="150px" alt="logoimg" width="200px" />
                        <div
                          className="bg-gray-300 rounded-full flex justify-center items-center"
                          style={{
                            position: "relative",
                            left: 180,
                            bottom: 30,
                            height: 30,
                            width: 30,
                            color: "#5cb85c",
                          }}
                        >
                          <EditIcon
                            style={{ color: "black", cursor: "pointer" }}
                            onClick={() => document.getElementById("shopBackground").click()}
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="border border-[cadetblue] flex justify-center items-center"
                        // style={{
                        //   borderStyle: "dashed",
                        //   border: "1px dashed #000000",
                        // }}
                      >
                        {/* <button
                          className="h-24 w-36  border-dashed border-colorSecondary flex justify-center items-center"
                          onClick={() => {
                            document.getElementById("shopBackground").click();
                          }}
                        >
                          <AddIcon />
                        </button> */}
                        <div className="m-8">
                          <div style={{ width: "inherit" }} className="mb-2 flex justify-center items-center">
                            <AddAPhotoIcon />
                          </div>
                          <div className="mb-3 px-[32px] text-sm font-emoji">
                            <p>Upload Cover Image</p>
                          </div>
                          <div className="mb-2">
                            <Button
                              variant="contained"
                              component="label"
                              className="w-full !capitalize !bg-gray-500 !rounded-3xl"
                              onClick={() => {
                                document.getElementById("shopBackground").click();
                              }}
                            >
                              Upload
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-2">
                      {errors.shopBackground && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {errors.shopBackground?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 items-center flex-col w-full container">
                  <h4 className="font-bold mb-3 flex justify-center items-center">Shop Images</h4>

                  {/* <div className="flex justify-center flex-col items-center">
                    <div className="flex justify-center">
                      <Button
                        variant="contained"
                        component="label"
                        className="w-full !capitalize !bg-gray-500 !rounded-3xl"
                      >
                        Choose Shop Images
                        <input
                          type="file"
                          hidden
                          multiple
                          accept="image/*"
                          {...register("shopImages", {
                            required: shopImages.length === 0 ? "Shop Image is required" : false,
                            onChange: (e) => {
                              createShopImagesChange(e);
                            },
                          })}
                        />
                      </Button>
                    </div>
                    <div className="mt-2">
                      {errors.shopImages && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {errors.shopImages?.message}
                        </span>
                      )}
                    </div>
                  </div> */}
                  <div className="flex justify-center mt-10">
                    <div className="flex items-center flex-col w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-10 place-items-center">
                        <div className="h-[100%]">
                          <input
                            type="file"
                            id="shopImageOne"
                            name="shopImagesOne"
                            hidden
                            accept="image/*"
                            {...register("shopImagesOne", {
                              required: shopImagesOne.length === 0 ? "Shop Front Image is required" : false,
                              onChange: (e) => {
                                createShopImagesChangeOne(e);
                              },
                            })}
                          />

                          {ShopImageFirst ? (
                            <div>
                              <Image src={shopImagesOne[0]} height="210px" alt="logoimg" width="200px" />
                              <div
                                className="bg-gray-300 rounded-full flex justify-center items-center"
                                style={{
                                  position: "relative",
                                  left: 180,
                                  bottom: 30,
                                  height: 30,
                                  width: 30,
                                  color: "#5cb85c",
                                }}
                              >
                                <EditIcon
                                  style={{ color: "black", cursor: "pointer" }}
                                  onClick={() => document.getElementById("shopImageOne").click()}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="h-[82%] border border-[cadetblue] flex justify-center items-center">
                              <div style={{marginTop:"35%" , marginBottom:"35%"}} className="mx-8">
                                <div style={{ width: "inherit" }} className="mb-2 flex justify-center items-center">
                                  <AddAPhotoIcon />
                                </div>
                                <div className="mb-3 text-sm font-emoji">
                                  <p>Upload Front Image</p>
                                </div>
                                <div className="mb-2">
                                  <Button
                                    variant="contained"
                                    component="label"
                                    className="w-full !capitalize !bg-gray-500 !rounded-3xl"
                                    onClick={() => {
                                      document.getElementById("shopImageOne").click();
                                    }}
                                  >
                                    Upload
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="mt-2">
                            {errors.shopImagesOne && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.shopImagesOne?.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="h-[100%]">
                          <input
                            type="file"
                            id="shopImageTwo"
                            name="shopImagesSecond"
                            hidden
                            accept="image/*"
                            {...register("shopImagesSecond", {
                              required: shopImagesSecond.length === 0 ? "Shop Back Image is required" : false,
                              onChange: (e) => {
                                createShopImagesChangeTwo(e);
                              },
                            })}
                          />

                          {ShopImageSecond ? (
                            <div>
                              <Image src={shopImagesSecond[0]} height="210px" alt="logoimg" width="200px" />
                              <div
                                className="bg-gray-300 rounded-full flex justify-center items-center"
                                style={{
                                  position: "relative",
                                  left: 180,
                                  bottom: 30,
                                  height: 30,
                                  width: 30,
                                  color: "#5cb85c",
                                }}
                              >
                                <EditIcon
                                  style={{ color: "black", cursor: "pointer" }}
                                  onClick={() => document.getElementById("shopImageTwo").click()}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="h-[82%] border border-[cadetblue] flex justify-center items-center">
                              <div style={{marginTop:"35%" , marginBottom:"35%"}} className="mx-8">
                                <div style={{ width: "inherit" }} className="mb-2 flex justify-center items-center">
                                  <AddAPhotoIcon />
                                </div>
                                <div className="mb-3 text-sm font-emoji">
                                  <p>Upload Back Image</p>
                                </div>
                                <div className="mb-2">
                                  <Button
                                    variant="contained"
                                    component="label"
                                    className="w-full !capitalize !bg-gray-500 !rounded-3xl"
                                    onClick={() => {
                                      document.getElementById("shopImageTwo").click();
                                    }}
                                  >
                                    Upload
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="mt-2">
                            {errors.shopImagesSecond && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.shopImagesSecond?.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="h-[100%]">
                          <input
                            type="file"
                            id="shopImageThree"
                            name="shopImagesThird"
                            hidden
                            accept="image/*"
                            {...register("shopImagesThird", {
                              required: shopImagesThird.length === 0 ? "Shop Side Image is required" : false,
                              onChange: (e) => {
                                createShopImagesChangeThird(e);
                              },
                            })}
                          />

                          {ShopImageThird ? (
                            <div>
                              <Image src={shopImagesThird[0]} height="210px" alt="logoimg" width="200px" />
                              <div
                                className="bg-gray-300 rounded-full flex justify-center items-center"
                                style={{
                                  position: "relative",
                                  left: 180,
                                  bottom: 30,
                                  height: 30,
                                  width: 30,
                                  color: "#5cb85c",
                                }}
                              >
                                <EditIcon
                                  style={{ color: "black", cursor: "pointer" }}
                                  onClick={() => document.getElementById("shopImageThree").click()}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="h-[82%] border border-[cadetblue] flex justify-center items-center">
                              <div style={{marginTop:"35%" , marginBottom:"35%"}} className="mx-8">
                                <div style={{ width: "inherit" }} className="mb-2 flex justify-center items-center">
                                  <AddAPhotoIcon />
                                </div>
                                <div className="mb-3 text-sm font-emoji">
                                  <p>Upload Side Image</p>
                                </div>
                                <div className="mb-2">
                                  <Button
                                    variant="contained"
                                    component="label"
                                    className="w-full !capitalize !bg-gray-500 !rounded-3xl"
                                    onClick={() => {
                                      document.getElementById("shopImageThree").click();
                                    }}
                                  >
                                    Upload
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="mt-2">
                            {errors.shopImagesThird && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.shopImagesThird?.message}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* {shopImages.map((image, index) => (
                          <div key={index}>
                            <Image src={image} alt="Product Preview" height={200} width={250} />
                          </div>
                        ))} */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="my-5 items-center flex-col w-full container">
                  <h4 className="font-bold mb-3 flex justify-center items-center">Shop Video</h4>

                  <div className="flex justify-center flex-col items-center">
                    <div className="flex  justify-center">
                      <Button
                        variant="contained"
                        disabled={shopVideo !== ""}
                        component="label"
                        className="w-full !capitalize !bg-gray-500 !rounded-3xl"
                      >
                        Choose Shop Video
                        <input
                          type="file"
                          id="shopVideo"
                          name="shopVideo"
                          accept="video/*"
                          hidden
                          controls
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              onShopVideoPreview(e);
                            }
                          }}
                        />
                      </Button>
                    </div>
                  </div>
                  {shopVideo !== "" && (
                    <div className="flex  justify-center mt-10">
                      <div className="flex flex-col w-full">
                        <div className="grid grid-cols-1 place-items-center">
                          <div>
                            <video
                              autoPlay
                              style={{ width: "350px", height: "250px" }}
                              controls
                              src={shopVideo}
                            ></video>
                            <div
                              className="bg-gray-300 rounded-full flex justify-center items-center cursor-pointer"
                              style={{
                                position: "relative",
                                right: 10,
                                bottom: 20,
                                height: 30,
                                width: 30,
                                color: "#5cb85c",
                              }}
                            >
                              <CancelIcon
                                style={{ color: "black" }}
                                onClick={() => {
                                  setShopVideo("");
                                  setUploadShopVideo("");
                                }}
                              />
                            </div>
                            <div
                              className="bg-gray-300 rounded-full flex justify-center items-center cursor-pointer"
                              style={{
                                position: "relative",
                                left: 335,
                                bottom: 50,
                                height: 30,
                                width: 30,
                                color: "#5cb85c",
                              }}
                            >
                              <button onClick={() => {}}>
                                <EditIcon
                                  style={{ color: "black" }}
                                  onClick={() => {
                                    document.getElementById("shopVideo").click();
                                  }}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            {activeStep === 2 && (
              <>
                <div className="container bg-colorWhite rounded-lg my-10 p-5 space-y-5 md:!w-[70%]">
                  <h3 className="text-colorPrimary text-lg font-semibold leading-8">BRANCHES</h3>
                  <form>
                    <div className="flex flex-col space-y-3">
                      <p className="mt-2 container flex items-center text-colorBlack text-sm font-semibold">
                        MAIN BRANCH
                      </p>
                      <div className="flex items-center justify-center container gap-20">
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Address"
                              variant="standard"
                              className="w-full"
                              {...register("address", {
                                required: "Address is required",
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {errors.address && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.address?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="container flex gap-10 sm:gap-5 w-full justify-between items-center">
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="City"
                              variant="standard"
                              className="w-full"
                              {...register("city", {
                                required: "City is required",
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {errors.city && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.city?.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="PinCode"
                              variant="standard"
                              className="w-full"
                              type="number"
                              {...register("pin_code", {
                                required: "PinCode is required",
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {errors.pin_code && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.pin_code?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:justify-center">
                        <div className="mb-4 mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center container">
                          <span className="font-semibold text-lg text-[#11142D]">Manager : Save as owner</span>

                          <RadioGroup
                            row
                            aria-labelledby="demo-form-control-label-placement"
                            name="position"
                            className="ml-20 sm:ml-0"
                            value={sameAsOwner}
                            onChange={(e) => {
                              if (e.target.value === "True") {
                                setSameAsOwner("True");
                              } else {
                                setSameAsOwner("False");
                              }
                            }}
                          >
                            <FormControlLabel value="True" label="Yes" control={<Radio />} />
                            <FormControlLabel value="False" control={<Radio />} label="No" />
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="container flex gap-10 sm:gap-20 w-full justify-between items-center">
                        <p className="mt-2 hidden sm:flex items-center text-colorBlack text-lg">Name:</p>
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Manager First Name"
                              variant="standard"
                              className="w-full"
                              disabled={sameAsOwner === "True"}
                              {...register("manager_first_name", {
                                required: "Manager FirstName is required",
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {errors.manager_first_name && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.manager_first_name?.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Manager Last Name"
                              variant="standard"
                              className="w-full"
                              disabled={sameAsOwner === "True"}
                              {...register("manager_last_name", {
                                required: "Manager LastName is required",
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {errors.manager_last_name && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.manager_last_name?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center container gap-10 sm:gap-20">
                        <p className="mt-2 hidden sm:flex items-center justify-between  text-colorBlack text-lg">
                          Email:
                        </p>
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Manager Email Address"
                              variant="standard"
                              className="w-full"
                              disabled={sameAsOwner === "True"}
                              {...register("manager_user_email", {
                                required: "Manager Email is required",

                                pattern: {
                                  value:
                                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                  message: "Please enter a valid email",
                                },
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {errors.manager_user_email && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.manager_user_email?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center container gap-10 sm:gap-[4.5rem]">
                        <p className="mt-2 hidden sm:flex items-center justify-between  text-colorBlack text-lg">
                          Phone:
                        </p>
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Manager Phone Number"
                              variant="standard"
                              className="w-full"
                              disabled={sameAsOwner === "True"}
                              type="number"
                              {...register("manager_user_contact", {
                                required: "Manager Contact Number is required",
                                minLength: {
                                  value: 10,
                                  message: "Manager Contact Number must be 10 numbers",
                                },
                                maxLength: {
                                  value: 10,
                                  message: "Manager Contact Number must be 10 numbers",
                                },
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {errors.manager_user_contact && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {errors.manager_user_contact?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {!individual && (
                        <div className="container flex items-center !mt-10">
                          <Button
                            variant="contained"
                            endIcon={<AddIcon />}
                            className="!bg-colorPrimary"
                            onClick={() => setSubBranchModalOpen(true)}
                            disabled={!isValid}
                          >
                            Sub Branch
                          </Button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
                {subBranch.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-colorPrimary text-lg font-semibold leading-8 container my-5">Sub Branches</h3>

                    <div className="container grid grid-cols-1 sm:grid-cols-2 gap-10">
                      {subBranch.map((sub, index) => (
                        <div className="bg-colorWhite p-5 rounded-xl flex flex-col gap-1" key={index}>
                          <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                            <b className="mr-2 text-sm sm:text-base lg:text-lg">Branch Address : </b>
                            {sub.subManagerAddress}
                          </p>
                          <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                            <b className="mr-2 text-sm sm:text-base lg:text-lg">Branch City : </b>
                            {sub.subManagerCity}
                          </p>
                          <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                            <b className="mr-2 text-sm sm:text-base lg:text-lg">Branch PinCode : </b>
                            {sub.subManagerPinCode}
                          </p>
                          <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                            <b className="mr-2 text-sm sm:text-base lg:text-lg">Branch Manager Name :</b>
                            {sub.subManagerFirstName + " " + sub.subManagerLastName}
                          </p>
                          <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                            <b className="mr-2 text-sm sm:text-base lg:text-lg">Branch Manager Email :</b>
                            {sub.subManagerEmail}
                          </p>
                          <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                            <b className="mr-2 text-sm sm:text-base lg:text-lg">Branch Manager Phone Number :</b>
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
                                setSubBranch(subBranch.filter((itm) => itm.id !== sub.id));
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
              </>
            )}

            <div className="flex justify-center">
              <Box className="flex pt-2 !w-[70%] container justify-between">
                <button
                  type="submit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={`text-[#544E5D] font-semibold mr-1 bg-[#F9F9FA] hover:bg-[#F9F9FA] px-9 py-3 rounded-xl focus:outline-none focus:shadow-outline ${
                    activeStep === 0 && "cursor-not-allowed"
                  }`}
                >
                  Back
                </button>

                <button
                  type="submit"
                  onClick={handleSubmit(onSubmit, onError)}
                  // onClick={onSubmit}
                  className="bg-colorPrimary hover:bg-colorPrimary mr-1 text-white px-9 py-3 rounded-xl font-semibold focus:outline-none focus:shadow-outline 
                  shadow-lg flex items-center justify-center"
                >
                  {loading && <CircularProgress size={20} color="primary" sx={{ color: "white", mr: 1 }} />}
                  {activeStep === 2 ? "Submit" : "Next"}
                </button>
              </Box>
            </div>
          </>
        </div>
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
        <Box sx={style} className="!w-[90%] lg:!w-1/2">
          <div className="p-5">
            <div className="flex items-center">
              <ArrowBackIcon className="!text-black !cursor-pointer" onClick={() => setHoursModalOpen(false)} />
              <p className="flex items-center text-colorBlack text-xl ml-5 font-semibold">Hours</p>
              <CloseIcon className="!text-black !ml-auto !cursor-pointer" onClick={() => setHoursModalOpen(false)} />
            </div>
            <div className="h-[calc(100vh-300px)] sm:h-[calc(100vh-350px)] overflow-auto">
              <div className="flex flex-col gap-2 mt-10 container">
                {hours.map((day, index) => (
                  <div className="flex items-center justify-between text-colorBlack text-sm sm:text-base" key={index}>
                    <p>{day["key"]}</p>

                    <div className="flex flex-col">
                      {day["value"].map((time, index) => (
                        <div className="flex items-center gap-5" key={index}>
                          <p>{time}</p>
                          <div
                            className="p-2 border rounded-full cursor-pointer hover:bg-[#bdbbbb]"
                            onClick={() => {
                              setDaysTimeModalOpen(true);
                              setSelectedDay(day["key"] + " - " + time);
                            }}
                          >
                            <EditIcon />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 container flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-10">
                <Button
                  variant="outlined"
                  size="medium"
                  className="rounded-xl capitalize text-colorBlack"
                  onClick={() => {
                    setDaysTimeModalOpen(true);

                    setSelectedAllHours(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
                  }}
                >
                  Edit All Hours
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  className="rounded-xl capitalize text-colorBlack"
                  onClick={() => {
                    setDaysTimeModalOpen(true);

                    setSelectedWeek(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
                  }}
                >
                  Edit Mon - Sat
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  className="rounded-xl capitalize text-colorBlack"
                  onClick={() => {
                    setDaysTimeModalOpen(true);
                    setSelectedDay("Sunday" + " - " + hours[hours.findIndex((item) => item.key === "Sunday")].value);
                  }}
                >
                  Edit Sunday
                </Button>
              </div>
            </div>
            <div className="container mt-5">
              <Divider />
            </div>
            <div className="container mt-5 flex items-center justify-end gap-5">
              <Button
                variant="outlined"
                className="rounded-xl capitalize text-colorBlack py-2 px-5"
                onClick={() => setHoursModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="rounded-xl capitalize text-colorWhite bg-colorPrimary py-2 px-5"
                onClick={() => setHoursModalOpen(false)}
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
        ? String(Number(selectedDay?.split(" - ")[1]?.split(" ")[0]?.split(":")[0]) + 12) +
            ":" +
            selectedDay?.split(" - ")[1]?.split(" ")[0]?.split(":")[1]
        : selectedDay?.split(" - ")[1]?.split(" ")[0]
    );

    setCloseTime(
      selectedDay?.split(" - ")[2]?.split(" ")[1] === "PM"
        ? String(Number(selectedDay?.split(" - ")[2]?.split(" ")[0]?.split(":")[0]) + 12) +
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
      const index = hours.findIndex((item) => item.key === selectedDay?.split(" - ")[0]);
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
                  ? startTime?.split(":")[0] - 12 + ":" + startTime?.split(":")[1] + " PM"
                  : startTime + " AM"
              }  - ${
                closeTime?.split(":")[0] > 12
                  ? closeTime?.split(":")[0] - 12 + ":" + closeTime?.split(":")[1] + " PM"
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
                  ? startTime?.split(":")[0] - 12 + ":" + startTime?.split(":")[1] + " PM"
                  : startTime + " AM"
              }  - ${
                closeTime?.split(":")[0] > 12
                  ? closeTime?.split(":")[0] - 12 + ":" + closeTime?.split(":")[1] + " PM"
                  : closeTime + " AM"
              } `,
            ]);
          }
          return itm;
        })
      );

      handleCloseDaysTimeModal();
    }

    if (hours && !closed && !open24Hours && selectedWeek === undefined && selectedAllHours === undefined) {
      const index = hours.findIndex((item) => item.key === selectedDay?.split(" - ")[0]);
      if (hours[index]?.value && startTime && closeTime) {
        hours[index].value = [
          `${
            startTime.split(":")[0] > 12
              ? startTime.split(":")[0] - 12 + ":" + startTime.split(":")[1] + " PM"
              : startTime + " AM"
          }  - ${
            closeTime.split(":")[0] > 12
              ? closeTime.split(":")[0] - 12 + ":" + closeTime.split(":")[1] + " PM"
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
            <p className="flex items-center text-colorBlack text-xl font-semibold justify-center">Select days & time</p>

            <div className="max-h-[calc(100vh-300px)] sm:max-h-[calc(100vh-350px)] overflow-auto">
              <div className="container mt-10 flex items-center gap-2 sm:gap-5 flex-wrap">
                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((itm) => (
                  <div
                    className={`p-5 border rounded-[50%] ${selectedDay?.split(" - ")[0] === itm && "bg-[#bdbbbb]"} ${
                      selectedWeek?.find((day) => day === itm) && "bg-[#bdbbbb]"
                    } ${
                      selectedAllHours?.find((day) => day === itm) && "bg-[#bdbbbb]"
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
                <div className="container mt-5 flex items-center gap-10">
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
                className="rounded-xl capitalize text-colorBlack py-2 px-5"
                onClick={handleCloseDaysTimeModal}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="rounded-xl capitalize text-colorWhite bg-colorPrimary py-2 px-5"
                onClick={saveDaysTimeData}
                disabled={(startTime && closeTime) === undefined && !open24Hours && !closed}
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
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(subManagerEmail)) {
      allError.subManagerEmailError = "Invalid SubManagerEmail address";
    } else {
      allError.subManagerEmailError = "";
    }
    if (!subManagerPhone) {
      allError.subManagerPhoneError = "SubManagerPhone is require";
    } else if (subManagerPhone.length != 10) {
      allError.subManagerPhoneError = "SubManagerPhone Number must be 10 numbers";
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
        const editSelectedSubBranchIndex = subBranch.findIndex((sub) => sub.id === subBranchEdit.id);

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
        <Box sx={style} className="!w-[90%] lg:!w-1/2">
          <div className="p-5">
            <div className="flex items-center">
              <ArrowBackIcon className="!text-black !cursor-pointer" onClick={handleSubBranchModalClose} />
              <p className="flex items-center text-colorBlack text-xl ml-5 font-semibold">
                {subBranchEdit?.id ? "Update" : "Add"} Sub Branch
              </p>
              <CloseIcon className="!text-black !ml-auto !cursor-pointer" onClick={handleSubBranchModalClose} />
            </div>

            <div className="h-[calc(100vh-300px)] sm:h-[calc(100vh-335px)] overflow-auto">
              <div className="container bg-colorWhite rounded-lg my-5 sm:my-10 p-5 space-y-5">
                <h3 className="text-colorPrimary text-lg font-semibold leading-8">Branches</h3>
                <form>
                  <div className="flex flex-col space-y-3">
                    <p className="mt-2 container flex items-center text-colorBlack text-lg">Sub Branch</p>
                    <div className="flex items-center justify-center container gap-20">
                      <div className="w-full flex flex-col gap-2">
                        <Box sx={{ display: "flex" }}>
                          <CustomTextField
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
                        <span style={{ color: "red" }}>{error.subManagerAddressError || ""}</span>
                      </div>
                    </div>

                    <div className="container flex flex-col sm:flex-row space-y-3 sm:gap-20 w-full justify-between items-center">
                      <div className="w-full flex flex-col gap-2">
                        <Box sx={{ display: "flex" }}>
                          <CustomTextField
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
                        <span style={{ color: "red" }}>{error.subManagerCityError || ""}</span>
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <Box sx={{ display: "flex" }}>
                          <CustomTextField
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
                        <span style={{ color: "red" }}>{error.subManagerPinCodeError || ""}</span>
                      </div>
                    </div>

                    <div className="flex justify-center items-center">
                      <div className="flex justify-between items-center container gap-5 sm:gap-10">
                        <span className="font-semibold text-lg text-[#11142D] mt-5">Manager:</span>

                        <CustomTextField
                          label="Manager"
                          variant="standard"
                          select
                          fullWidth
                          value={managerValue}
                          onChange={(e) => setManagerValue(e.target.value)}
                        >
                          <MenuItem value="">None</MenuItem>
                          {["Same as owner", "same as main branch manager"].map((man) => (
                            <MenuItem value={man} key={man}>
                              {man}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      </div>
                    </div>

                    <div className="container flex flex-col sm:flex-row space-y-3 sm:gap-20 w-full justify-between items-center">
                      <p className="mt-2 hidden sm:flex items-center text-colorBlack text-lg">Name:</p>
                      <div className="w-full flex flex-col gap-2">
                        <Box sx={{ display: "flex" }}>
                          <CustomTextField
                            id="input-with-sx"
                            label="Manager First Name"
                            variant="standard"
                            className="w-full"
                            disabled={
                              managerValue === "Same as owner" || managerValue === "same as main branch manager"
                            }
                            value={subManagerFirstName}
                            onChange={(e) => {
                              setSubManagerFirstName(e.target.value);
                              error.subManagerFirstNameError = "";
                            }}
                          />
                        </Box>
                        <span style={{ color: "red" }}>{error.subManagerFirstNameError || ""}</span>
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <Box sx={{ display: "flex" }}>
                          <CustomTextField
                            id="input-with-sx"
                            label="Manager Last Name"
                            variant="standard"
                            className="w-full"
                            disabled={
                              managerValue === "Same as owner" || managerValue === "same as main branch manager"
                            }
                            value={subManagerLastName}
                            onChange={(e) => {
                              setSubManagerLastName(e.target.value);
                              error.subManagerLastNameError = "";
                            }}
                          />
                        </Box>
                        <span style={{ color: "red" }}>{error.subManagerLastNameError || ""}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center container gap-10 sm:gap-20">
                      <p className="mt-2 hidden sm:flex items-center justify-between  text-colorBlack text-lg">
                        Email:
                      </p>
                      <div className="w-full flex flex-col gap-2">
                        <Box sx={{ display: "flex" }}>
                          <CustomTextField
                            id="input-with-sx"
                            label="Manager Email Address"
                            variant="standard"
                            className="w-full"
                            type="email"
                            disabled={
                              managerValue === "Same as owner" || managerValue === "same as main branch manager"
                            }
                            value={subManagerEmail}
                            onChange={(e) => {
                              setSubManagerEmail(e.target.value);
                              error.subManagerEmailError = "";
                            }}
                          />
                        </Box>
                        <span style={{ color: "red" }}>{error.subManagerEmailError || ""}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center container gap-10 sm:gap-20">
                      <p className="mt-2 hidden sm:flex items-center justify-between  text-colorBlack text-lg">
                        Phone:
                      </p>
                      <div className="w-full flex flex-col gap-2">
                        <Box sx={{ display: "flex" }}>
                          <CustomTextField
                            id="input-with-sx"
                            label="Manager Phone Number"
                            variant="standard"
                            className="w-full"
                            type="number"
                            disabled={
                              managerValue === "Same as owner" || managerValue === "same as main branch manager"
                            }
                            value={subManagerPhone}
                            onChange={(e) => {
                              setSubManagerPhone(e.target.value);
                              if (e.target.value.length != 10) {
                                error.subManagerPhoneError = "SubManagerPhone Number must be 10 numbers";
                              } else {
                                error.subManagerPhoneError = "";
                              }
                            }}
                          />
                        </Box>
                        <span style={{ color: "red" }}>{error.subManagerPhoneError || ""}</span>
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
                className="rounded-xl capitalize text-colorBlack py-2 px-5"
                onClick={handleSubBranchModalClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="rounded-xl capitalize text-colorWhite bg-colorPrimary py-2 px-5"
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
