import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
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
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [hoursModalOpen, setHoursModalOpen] = useState(false);
  const [daysTimeModalOpen, setDaysTimeModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedWeek, setSelectedWeek] = useState();
  const [selectedAllHours, setSelectedAllHours] = useState();

  const [hours, setHours] = useState([
    { key: "Sunday", value: ["01:30 PM - 10:50 PM"] },
    { key: "Monday", value: ["09:15 AM - 11:25 AM"] },
    { key: "Tuesday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Wednesday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Thursday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Friday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Saturday", value: ["09:00 AM - 10:50 AM"] },
  ]);
  const [image, setImage] = useState("");

  const [bgimage, setBgImage] = useState("");

  const [shopImages, setShopImages] = useState([]);
  const [shopImagesPreview, setShopImagesPreview] = useState([]);
  const [videoBase64, setVideoBase64] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    getValues,
    setError,
    control,
  } = useForm();

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

  const onSubmit = (data) => {
    if (activeStep !== 2) {
      handleNext();
    } else {
      shopImages.forEach((image) => {
        console.log("Data To be Submitted !!", image);
      });
      console.log("Data To be Submitted !!", data);
    }
  };
  const onError = (errors) => console.log("Errors Occurred !! :", errors);

  const onShopLogoPreviewImage = (e) => {
    const reader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0]);
      console.log("????????????????????", e.target.files[0]);
      reader.addEventListener("load", (e) => {
        setImage(reader.result);
      });
    }
  };

  const onShopBackgroundPreviewImage = (e) => {
    const reader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0]);
      console.log("????????????????????", e.target.files[0]);
      reader.addEventListener("load", (e) => {
        // console.log("llllllllllllllllllllllll", reader.result);
        setBgImage(reader.result);
      });
    }
  };

  const createShopImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setShopImagesPreview([]);
    setShopImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setShopImagesPreview((old) => [...old, reader.result]);
        setShopImages((old) => [...old, reader.result]);
      };
    });
  };

  const onPreviewImage = (e) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0]);
      reader.addEventListener("load", (e) => {
        setVideoBase64(reader.result);
      });
    }
  };
  return (
    <>
      <div className="bg-[#F5F5F5]">
        <div className="container py-10">
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            connector={<QontoConnector />}
            className="w-full"
          >
            {shopRegistrationSteps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <>
            {activeStep === 0 && (
              <>
                <div className="container bg-colorWhite rounded-lg my-10 p-5 space-y-5">
                  <h3 className="text-colorPrimary text-lg font-semibold leading-8">
                    Owner Details
                  </h3>
                  <form>
                    <div className="flex flex-col space-y-3">
                      <div className="container flex gap-20 w-full justify-between items-center">
                        <p className="mt-2 flex items-center text-colorBlack text-lg">
                          Name:
                        </p>
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="First Name"
                              variant="standard"
                              className="w-full"
                              {...register("first_name", {
                                required: "FirstName is required",
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
                              label="Last Name"
                              variant="standard"
                              className="w-full"
                              {...register("last_name", {
                                required: "LastName is required",
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

                      <div className="flex items-center justify-center container gap-20">
                        <p className="mt-2 flex items-center justify-between  text-colorBlack text-lg">
                          Email:
                        </p>
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Email Address"
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

                      <div className="flex items-center justify-center container gap-20">
                        <p className="mt-2 flex items-center justify-between  text-colorBlack text-lg">
                          Phone:
                        </p>
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Phone Number"
                              variant="standard"
                              className="w-full"
                              type="number"
                              {...register("user_contact", {
                                required: "Contact Number is required",
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
                <div className="container bg-colorWhite rounded-lg my-10 p-5 space-y-5">
                  <h3 className="text-colorPrimary text-lg font-semibold leading-8">
                    Shop Info
                  </h3>
                  <form>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-center container gap-20">
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Shop Name"
                              variant="standard"
                              className="w-full"
                              {...register("shop_name", {
                                required: "Shop Name is required",
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

                      <div className="flex items-center justify-center container gap-20">
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Shop Email"
                              variant="standard"
                              className="w-full"
                              {...register("shop_email", {
                                required: "Shop Email is required",

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
                              label="Personal Website"
                              variant="standard"
                              className="w-full"
                              {...register("personal_website", {
                                required: "Personal Website is required",
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

                      <div className="container flex gap-20 w-full justify-between items-center">
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Facebook Link"
                              variant="standard"
                              className="w-full"
                              {...register("facebook_link", {
                                required: "Facebook Link is required",
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
                                required: "Instagram Link is required",
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
                        <p className="flex items-center text-colorBlack text-lg">
                          Hours
                        </p>
                        <div
                          className="w-full border border-colorBlack p-3 rounded-lg flex items-center justify-between cursor-pointer text-colorBlack text-base font-semibold"
                          onClick={() => {
                            setHoursModalOpen(true);
                          }}
                        >
                          <div>
                            {hours.map((day, index) => (
                              <div
                                className="flex items-center gap-2"
                                key={index}
                              >
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
                    </div>
                  </form>
                </div>
              </>
            )}
            {activeStep === 1 && (
              <>
                <div className="flex gap-20 items-center container mt-10">
                  <div>
                    <label className="flex justify-center items-center font-bold mb-3">
                      Logo
                    </label>
                    <input
                      type="file"
                      id="picture"
                      name="picture"
                      hidden
                      {...register("picture")}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          onShopLogoPreviewImage(e);
                          // onSubmt(e);
                        }
                      }}
                    />
                    {image !== "" ? (
                      <div>
                        <Image
                          src={image}
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
                                document.getElementById("picture").click();
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="h-24 w-24  border-dashed border-colorSecondary flex justify-center items-center"
                        style={{
                          borderStyle: "dashed",
                          border: "1px dashed #000000",
                        }}
                      >
                        <button
                          className="h-24 w-24  border-dashed border-colorSecondary flex justify-center items-center"
                          onClick={() => {
                            document.getElementById("picture").click();
                          }}
                        >
                          <AddIcon />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex justify-center items-center font-bold  mb-3">
                      Background
                    </label>

                    <input
                      type="file"
                      id="bgpicture"
                      name="bgpicture"
                      hidden
                      {...register("bgpicture")}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          onShopBackgroundPreviewImage(e);
                        }
                      }}
                    />
                    {bgimage !== "" ? (
                      <div>
                        <Image
                          src={bgimage}
                          height="150px"
                          alt="logoimg"
                          width="200px"
                        />
                        <div
                          className="bg-gray-300 rounded-full flex justify-center items-center"
                          style={{
                            position: "relative",
                            left: 130,
                            bottom: 30,
                            height: 30,
                            width: 30,
                            color: "#5cb85c",
                          }}
                        >
                          <EditIcon
                            style={{ color: "black", cursor: "pointer" }}
                            onClick={() =>
                              document.getElementById("bgpicture").click()
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="h-24 w-36  border-dashed border-colorSecondary flex justify-center items-center"
                        style={{
                          borderStyle: "dashed",
                          border: "1px dashed #000000",
                        }}
                      >
                        <button
                          className="h-24 w-36  border-dashed border-colorSecondary flex justify-center items-center"
                          onClick={() => {
                            document.getElementById("bgpicture").click();
                          }}
                        >
                          <AddIcon />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 items-center flex-col w-full container">
                  <h4 className="font-bold mb-3 flex justify-center items-center">
                    Shop Images
                  </h4>

                  <div className="flex justify-center flex-col items-center">
                    <div className="flex  justify-center">
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
                          {...register("image", {
                            // required: "Shop Image is required",
                            onChange: (e) => {
                              createShopImagesChange(e);
                            },
                          })}
                        />
                      </Button>
                      <div className="mt-2 ml-9">
                        {errors.image && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {errors.image?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex  justify-center mt-10">
                    <div className="flex sm:block flex-col w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
                        {shopImagesPreview.map((image, index) => (
                          <Image
                            key={index}
                            src={image}
                            alt="Product Preview"
                            height={200}
                            width={250}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-10 container">
                  <input
                    type="file"
                    id="vpicture"
                    name="picture"
                    hidden
                    // {...register("picture")}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        onPreviewImage(e);
                      }
                    }}
                  />
                  {videoBase64 !== "" ? (
                    <div>
                      <video
                        autoPlay
                        style={{ width: "350px", height: "250px" }}
                        controls
                      >
                        <source src={videoBase64} />
                      </video>
                      <div
                        className="bg-gray-300 rounded-full flex justify-center items-center w-32"
                        style={{
                          position: "relative",
                          left: 335,
                          bottom: 15,
                          height: 30,
                          width: 30,
                          color: "#5cb85c",
                        }}
                      >
                        <button onClick={() => {}}>
                          <EditIcon
                            style={{ color: "black" }}
                            onClick={() => {
                              document.getElementById("vpicture").click();
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="h-32 w-56  border-dashed border-colorSecondary flex justify-center items-center"
                      style={{
                        borderStyle: "dashed",
                        border: "1px dashed #000000",
                      }}
                    >
                      <button
                        className="h-24 w-24  border-dashed border-colorSecondary flex justify-center items-center"
                        onClick={() => {
                          document.getElementById("vpicture").click();
                        }}
                      >
                        <AddIcon />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            {activeStep === 2 && (
              <>
                <div className="container bg-colorWhite rounded-lg my-10 p-5 space-y-5">
                  <h3 className="text-colorPrimary text-lg font-semibold leading-8">
                    Owner Details
                  </h3>
                  <form>
                    <div className="flex flex-col space-y-3">
                      <p className="mt-2 container flex items-center text-colorBlack text-lg">
                        Main Branches
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

                      <div className="container flex gap-20 w-full justify-between items-center">
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
                          <span className="font-semibold text-lg text-[#11142D]">
                            Manager : Save as owner
                          </span>

                          <RadioGroup
                            row
                            aria-labelledby="demo-form-control-label-placement"
                            name="position"
                            className="ml-12 sm:ml-0"
                            // value={graduatedValue}
                            // onChange={(e) => {
                            //   console.log("first:::", e.target.value);
                            //   if (e.target.value === "True") {
                            //     setLabel("Graduation Date");
                            //     setGraduatedValue("True");
                            //   } else {
                            //     setLabel("Projected Graduation Date");
                            //     setGraduatedValue("False");
                            //   }
                            // }}
                          >
                            <FormControlLabel
                              value="True"
                              control={<Radio {...register("graduated")} />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value="False"
                              control={<Radio {...register("graduated")} />}
                              label="No"
                            />
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="container flex gap-20 w-full justify-between items-center">
                        <p className="mt-2 flex items-center text-colorBlack text-lg">
                          Name:
                        </p>
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Manager First Name"
                              variant="standard"
                              className="w-full"
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

                      <div className="flex items-center justify-center container gap-20">
                        <p className="mt-2 flex items-center justify-between  text-colorBlack text-lg">
                          Email:
                        </p>
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Manager Email Address"
                              variant="standard"
                              className="w-full"
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

                      <div className="flex items-center justify-center container gap-20">
                        <p className="mt-2 flex items-center justify-between  text-colorBlack text-lg">
                          Phone:
                        </p>
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Manager Phone Number"
                              variant="standard"
                              className="w-full"
                              type="number"
                              {...register("manager_user_contact", {
                                required: "Manager Contact Number is required",
                                minLength: {
                                  value: 10,
                                  message:
                                    "Manager Contact Number must be 10 numbers",
                                },
                                maxLength: {
                                  value: 10,
                                  message:
                                    "Manager Contact Number must be 10 numbers",
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
                    </div>
                  </form>
                </div>
              </>
            )}

            <div className="flex justify-center">
              <Box className="flex pt-2 mt-4 w-full container justify-between">
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
                  className="bg-colorPrimary hover:bg-colorPrimary mr-1 text-white px-9 py-3 rounded-xl font-semibold focus:outline-none focus:shadow-outline 
                  shadow-lg flex items-center justify-center"
                >
                  {/* {loading && (
                          <CircularProgress
                            size={20}
                            color="primary"
                            sx={{ color: "white", mr: 1 }}
                          />
                        )} */}
                  Next
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
    </>
  );
};

export default ShopPage;

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
        <Box sx={style}>
          <div className="p-5">
            <div className="flex items-center">
              <ArrowBackIcon
                className="text-black cursor-pointer"
                onClick={() => setHoursModalOpen(false)}
              />
              <p className="flex items-center text-colorBlack text-xl ml-5 font-semibold">
                Hours
              </p>
              <CloseIcon
                className="text-black ml-auto cursor-pointer"
                onClick={() => setHoursModalOpen(false)}
              />
            </div>

            <div className="flex flex-col gap-2 mt-10 container">
              {hours.map((day, index) => (
                <div
                  className="flex items-center justify-between text-colorBlack"
                  key={index}
                >
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

            <div className="mt-10 container flex items-center gap-10">
              <Button
                variant="outlined"
                size="medium"
                className="rounded-xl capitalize text-colorBlack"
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
                Edit All Hours
              </Button>
              <Button
                variant="outlined"
                size="medium"
                className="rounded-xl capitalize text-colorBlack"
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
              >
                Edit Mon - Sat
              </Button>
              <Button
                variant="outlined"
                size="medium"
                className="rounded-xl capitalize text-colorBlack"
                onClick={() => {
                  setDaysTimeModalOpen(true);
                  setSelectedDay(
                    "Sunday" +
                      " - " +
                      hours[hours.findIndex((item) => item.key === "Sunday")]
                        .value
                  );
                }}
              >
                Edit Sunday
              </Button>
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

  console.log(":::::", startTime, closeTime);

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

  return (
    <>
      <CustomAuthModal
        open={daysTimeModalOpen}
        onClose={handleCloseDaysTimeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="animate__animated animate__slideInDown"
      >
        <Box sx={style} className="!w-[40%]">
          <div className="p-5">
            <p className="flex items-center text-colorBlack text-xl font-semibold justify-center">
              Select days & time
            </p>

            <div className="container mt-10 flex items-center justify-between">
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((itm) => (
                <div
                  className={`p-5 border rounded-[50%] ${
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
              <div className="container mt-5 flex items-center gap-10">
                <TextField
                  label="Open Time"
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setStartTime(e.target.value);
                  }}
                />

                <TextField
                  label="Close Time"
                  type="time"
                  value={closeTime}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setCloseTime(e.target.value);
                  }}
                />
              </div>
            )}
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
                disabled={(startTime && closeTime) === undefined}
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
