import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Switch,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import {
  a11yProps,
  CustomAuthModal,
  CustomTextField,
  TabPanel,
} from "../../../components/core/CustomMUIComponents";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { getShopOwnerDetail } from "../../../graphql/queries/shopQueries";

import { useSelector } from "react-redux";
import { shopUpdate } from "../../../graphql/mutations/shops";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import {
  getBranchLists,
  getSingleBranchDetails,
} from "../../../graphql/queries/branchListsQueries";
import { deleteBranch, updateBranch } from "../../../graphql/mutations/branch";
import { createBranch } from "../../../graphql/mutations/branch";
import { deleteMedia } from "../../../graphql/mutations/deleteMedia";
import Image from "next/image";
import { SingleImageUploadFile } from "../../../services/SingleImageUploadFile";
import { MultipleImageUploadFile } from "../../../services/MultipleImageUploadFile";
import CancelIcon from "@mui/icons-material/Cancel";
import { VideoUploadFile } from "../../../services/VideoUploadFile";
import { withAuth } from "../../../components/core/PrivateRouteForVendor";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

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

const ShopEdit = () => {
  const [individual, setIndividual] = useState(false);
  const [sameAsOwner, setSameAsOwner] = useState("False");

  const [hours, setHours] = useState([
    { key: "Sunday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Monday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Tuesday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Wednesday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Thursday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Friday", value: ["09:00 AM - 08:00 PM"] },
    { key: "Saturday", value: ["09:00 AM - 08:00 PM"] },
  ]);

  const { userProfile } = useSelector((state) => state.userProfile);

  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

  const {
    register: ownerInfoRegister,
    handleSubmit: ownerInfoHandleSubmit,
    formState: { errors: ownerInfoErrors },
    setValue: ownerInfoSetValue,
    getValues: ownerInfoGetValue,
  } = useForm();

  const {
    register: shopInfoRegister,
    handleSubmit: shopInfoHandleSubmit,
    formState: { errors: shopInfoErrors },
    setValue: shopInfoSetValue,
  } = useForm();

  const {
    register: mainBranchInfoRegister,
    handleSubmit: mainBranchInfoHandleSubmit,
    formState: { errors: mainBranchInfoErrors },
    setValue: mainBranchInfoSetValue,
    getValues: mainBranchInfoGetValue,
  } = useForm();

  const {
    register: shopLayoutRegister,
    handleSubmit: shopLayoutHandleSubmit,
    formState: { errors: shopLayoutErrors },
  } = useForm();

  const [shopOwnerId, setShopOwnerId] = useState("");

  const [ownerLoading, setOwnerLoading] = useState(false);
  const [shopLoading, setShopLoading] = useState(false);
  const [mainBranchLoading, setMainBranchLoading] = useState(false);
  const [shopLayoutLoading, setShopLayoutLoading] = useState(false);

  const [hoursModalOpen, setHoursModalOpen] = useState(false);
  const [daysTimeModalOpen, setDaysTimeModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedWeek, setSelectedWeek] = useState();
  const [selectedAllHours, setSelectedAllHours] = useState();

  const [mainBranch, setMainBranch] = useState();
  const [subBranchList, setSubBranchList] = useState([]);

  const [branchDeleteModalOpen, setBranchDeleteModalOpen] = useState(false);
  const [deleteBranchId, setDeleteBranchId] = useState();
  const [editSubBranchId, setEditSubBranchId] = useState();

  const [subBranchModalOpen, setSubBranchModalOpen] = useState(false);

  const [shopLogo, setShopLogo] = useState("");
  const [uploadShopLogo, setUploadShopLogo] = useState("");

  const [shopBackground, setShopBackground] = useState("");
  const [uploadShopBackground, setUploadShopBackground] = useState("");

  const [shopImages, setShopImages] = useState([]);
  const [uploadShopImages, setUploadShopImages] = useState("");

  const [ShopEditImg, setShopEditImg] = useState("");
  const [shopVideo, setShopVideo] = useState("");
  const [uploadShopVideo, setUploadShopVideo] = useState("");

  const [shopLayoutAllMediaImages, setShopLayoutAllMediaImages] = useState([]);
  const [shopLayoutAllMediaVideos, setShopLayoutAllMediaVideos] = useState();

  const [isHydrated, setIsHydrated] = useState(false);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const srcToFile = async (src, fileName, mimeType) => {
    console.log("src, fileName, mimeType :", src, fileName, mimeType);
    const res = await fetch(src, {
      mode: "no-cors",
    });
    const buf = await res.arrayBuffer();
    return new File([buf], fileName, { type: mimeType });
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

  const updateShopImagesChange = (e) => {
    const files = Array.from(e.target.files);
    let resImgIndex = shopImages?.findIndex(
      (obj) => obj?.links === ShopEditImg
    );

    let uploadShopImagesData = uploadShopImages;
    let shopImagesData = shopImages;

    uploadShopImagesData[resImgIndex] = files[0];
    setUploadShopImages(() => [...uploadShopImagesData]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        shopImagesData[resImgIndex] = { links: reader.result };
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

  const getAllSubBranchList = () => {
    getBranchLists().then((res) => {
      const subBranches = res.data.branchList
        .filter((branch) => branch.shop_id === userProfile?.userCreatedShopId)
        .filter((itm) => itm.branch_type === "sub");
      setSubBranchList(subBranches);
    });
  };

  useEffect(() => {
    if (sameAsOwner === "True") {
      mainBranchInfoSetValue(
        "manager_first_name",
        ownerInfoGetValue("first_name")
      );
      mainBranchInfoSetValue(
        "manager_last_name",
        ownerInfoGetValue("last_name")
      );
      mainBranchInfoSetValue(
        "manager_user_email",
        ownerInfoGetValue("user_email")
      );
      mainBranchInfoSetValue(
        "manager_user_contact",
        ownerInfoGetValue("user_contact")
      );
    } else {
      mainBranchInfoSetValue("manager_first_name", "");
      mainBranchInfoSetValue("manager_last_name", "");
      mainBranchInfoSetValue("manager_user_email", "");
      mainBranchInfoSetValue("manager_user_contact", "");
    }
  }, [sameAsOwner, mainBranchInfoSetValue, ownerInfoGetValue]);

  useEffect(() => {
    if (userProfile?.userCreatedShopId) {
      getAllSubBranchList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.userCreatedShopId]);

  useEffect(() => {
    if (userProfile?.userCreatedShopId) {
      getShopOwnerDetail({ id: vendorShopDetails?.owner_id }).then(
        (ownerRes) => {
          setShopOwnerId(ownerRes?.data?.shopOwner?.id);
          ownerInfoSetValue(
            "first_name",
            ownerRes?.data?.shopOwner?.owner_firstName
          );
          ownerInfoSetValue(
            "last_name",
            ownerRes?.data?.shopOwner?.owner_lastName
          );
          ownerInfoSetValue(
            "user_email",
            ownerRes?.data?.shopOwner?.owner_email
          );
          ownerInfoSetValue(
            "user_contact",
            ownerRes?.data?.shopOwner?.owner_contact
          );
        }
      );

      {
        vendorShopDetails?.shop_logo &&
          srcToFile(
            vendorShopDetails?.shop_logo,
            "profile.png",
            "image/png"
          ).then(function (file) {
            setUploadShopLogo(file);
          });
      }
      setShopLogo(vendorShopDetails?.shop_logo);

      {
        vendorShopDetails?.shop_cover_image &&
          srcToFile(
            vendorShopDetails?.shop_cover_image,
            "profile.png",
            "image/png"
          ).then(function (file) {
            setUploadShopBackground(file);
          });
      }

      setShopBackground(vendorShopDetails?.shop_cover_image);

      console.log(
        "uploadShopImages---------------",
        vendorShopDetails?.shop_images
      );

      vendorShopDetails?.shop_images?.map((img) => {
        img?.links &&
          srcToFile(img?.links, "profile.png", "image/png").then(function (
            file
          ) {
            console.log("uploadShopImages00000000", file);
            setUploadShopImages((old) => [...old, file]);
          });
      });
      setShopImages(vendorShopDetails?.shop_images);

      {
        vendorShopDetails?.shop_video &&
          srcToFile(vendorShopDetails?.shop_video, "profile.mp4", "video").then(
            function (file) {
              setUploadShopVideo(file);
            }
          );
      }

      vendorShopDetails?.shop_video &&
        setShopVideo(vendorShopDetails?.shop_video);

      setShopLayoutAllMediaImages([
        vendorShopDetails?.shop_logo,
        vendorShopDetails?.shop_cover_image,
        ...(vendorShopDetails?.shop_images?.length > 0
          ? vendorShopDetails?.shop_images?.map((itm) => itm.links)
          : []),
      ]);

      vendorShopDetails?.shop_video &&
        setShopLayoutAllMediaVideos(vendorShopDetails?.shop_video);

      vendorShopDetails?.shop_time?.map((time) => {
        hours.map((itm) => {
          if (time.is_24Hours_open) {
            if (itm.key === time.week) {
              itm.value = ["Open 24 hours"];
            }
          } else if (time.is_close) {
            if (itm.key === time.week) {
              itm.value = ["Closed"];
            }
          } else {
            if (itm.key === time.week) {
              itm.value = [`${time.open_time} - ${time.close_time}`];
            }
          }

          return itm;
        });
        setHours(hours);
      });

      if (vendorShopDetails?.shop_type === "shop") {
        setIndividual(false);
      } else {
        setIndividual(true);
      }
      shopInfoSetValue("shop_name", vendorShopDetails?.shop_name);
      shopInfoSetValue("shop_email", vendorShopDetails?.shop_email);
      shopInfoSetValue(
        "facebook_link",
        vendorShopDetails?.shop_social_link?.facebook
      );
      shopInfoSetValue(
        "instagram_link",
        vendorShopDetails?.shop_social_link?.instagram
      );
      shopInfoSetValue(
        "personal_website",
        vendorShopDetails?.shop_social_link?.website
      );

      const mainBranches = vendorShopDetails?.branch_info?.find(
        (itm) => itm.branch_type === "main"
      );
      setMainBranch(mainBranches);

      mainBranchInfoSetValue("address", mainBranches?.branch_address);
      mainBranchInfoSetValue("pin_code", mainBranches?.branch_pinCode);

      mainBranchInfoSetValue(
        "manager_first_name",
        mainBranches?.manager_name.split(" ")[0]
      );
      mainBranchInfoSetValue(
        "manager_last_name",
        mainBranches?.manager_name.split(" ")[1]
      );
      mainBranchInfoSetValue(
        "manager_user_contact",
        mainBranches?.manager_contact
      );
      mainBranchInfoSetValue("city", mainBranches?.branch_city);
      mainBranchInfoSetValue("manager_user_email", mainBranches?.manager_email);
    }
  }, [
    hours,
    userProfile?.userCreatedShopId,
    mainBranchInfoSetValue,
    ownerInfoSetValue,
    shopInfoSetValue,
    vendorShopDetails,
  ]);

  const ownerInfoOnSubmit = (data) => {
    console.log("data", data);

    setOwnerLoading(true);
    shopUpdate({
      ownerInfo: {
        id: shopOwnerId,
        owner_firstName: data.first_name,
        owner_lastName: data.last_name,
        owner_email: data.user_email,
        owner_contact: data.user_contact,
      },
    }).then(
      (res) => {
        console.log("owner res:::", res);
        toast.success(res.data.updateShop.message, {
          theme: "colored",
        });
        setOwnerLoading(false);
      },
      (error) => {
        setOwnerLoading(false);
        toast.error(error.message, { theme: "colored" });
      }
    );
  };
  const ownerInfoOError = (errors) =>
    console.log("Errors Occurred !! :", errors);

  const shopInfoOnSubmit = (data) => {
    console.log("data", data);

    setShopLoading(true);
    shopUpdate({
      shopInfo: {
        id: userProfile?.userCreatedShopId,
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
            open_time: individual
              ? "-"
              : day["value"][0] === "Closed" ||
                day["value"][0] === "Open 24 hours"
              ? "-"
              : day["value"][0].split(" - ")[0],
            close_time: individual
              ? "-"
              : day["value"][0] === "Closed" ||
                day["value"][0] === "Open 24 hours"
              ? "-"
              : day["value"][0].split(" - ")[1],
            is_close: individual
              ? false
              : day["value"][0] === "Closed"
              ? true
              : false,
            is_24Hours_open: individual
              ? true
              : day["value"][0] === "Open 24 hours"
              ? true
              : false,
          };
        }),
      },
    }).then(
      (res) => {
        console.log("owner res:::", res);
        toast.success(res.data.updateShop.message, {
          theme: "colored",
        });
        setShopLoading(false);
      },
      (error) => {
        setShopLoading(false);
        toast.error(error.message, { theme: "colored" });
      }
    );
  };
  const shopInfoOError = (errors) =>
    console.log("Errors Occurred !! :", errors);

  const mainBranchInfoOnSubmit = (data) => {
    console.log("data", data);

    setMainBranchLoading(true);
    shopUpdate({
      branchInfo: [
        {
          id: mainBranch.id,
          branch_address: data.address,
          branch_pinCode: data.pin_code,
          branch_city: data.city,
          manager_name: data.manager_first_name + " " + data.manager_last_name,
          manager_contact: data.manager_user_contact,
          manager_email: data.manager_user_email,
          branch_type: mainBranch.branch_type,
        },
      ],
    }).then(
      (res) => {
        console.log("main res:::", res);
        toast.success(res.data.updateShop.message, {
          theme: "colored",
        });
        setMainBranchLoading(false);
      },
      (error) => {
        setMainBranchLoading(false);
        toast.error(error.message, { theme: "colored" });
      }
    );
  };
  const mainBranchInfoOError = (errors) =>
    console.log("Errors Occurred !! :", errors);

  const shopLayoutOnSubmit = (data) => {
    console.log("data,,", data);

    setShopLayoutLoading(true);
    shopLayoutAllMediaImages.map((img) =>
      deleteMedia({
        file: img,
        fileType: "image",
      }).then((res) => setShopLayoutAllMediaImages([]))
    );

    shopLayoutAllMediaVideos !== undefined &&
      deleteMedia({
        file: shopLayoutAllMediaVideos,
        fileType: "video",
      }).then((res) => setShopLayoutAllMediaVideos());

    SingleImageUploadFile(uploadShopLogo).then((logoResponse) => {
      SingleImageUploadFile(uploadShopBackground).then((backgroundResponse) => {
        MultipleImageUploadFile(uploadShopImages).then((imagesResponse) => {
          uploadShopVideo !== ""
            ? VideoUploadFile(uploadShopVideo).then((videoResponse) => {
                shopUpdate({
                  shopLayout: {
                    id: userProfile?.userCreatedShopId,
                    shop_logo: logoResponse.data.data.singleUpload,
                    shop_cover_image: backgroundResponse.data.data.singleUpload,
                    shop_images: imagesResponse.data.data.multipleUpload?.map(
                      (itm) => {
                        return { links: itm };
                      }
                    ),
                    shop_video: videoResponse.data.data.singleUpload,
                  },
                }).then(
                  (res) => {
                    console.log("owner res:::", res);
                    toast.success(res.data.updateShop.message, {
                      theme: "colored",
                    });
                    setShopLayoutLoading(false);
                  },
                  (error) => {
                    setShopLayoutLoading(false);
                    toast.error(error.message, { theme: "colored" });
                  }
                );
              })
            : shopUpdate({
                shopLayout: {
                  id: userProfile?.userCreatedShopId,
                  shop_logo: logoResponse.data.data.singleUpload,
                  shop_cover_image: backgroundResponse.data.data.singleUpload,
                  shop_images: imagesResponse.data.data.multipleUpload?.map(
                    (itm) => {
                      return { links: itm };
                    }
                  ),
                  shop_video: null,
                },
              }).then(
                (res) => {
                  console.log("owner res:::", res);
                  toast.success(res.data.updateShop.message, {
                    theme: "colored",
                  });
                  setShopLayoutLoading(false);
                },
                (error) => {
                  setShopLayoutLoading(false);
                  toast.error(error.message, { theme: "colored" });
                }
              );
        });
      });
    });
  };
  const shopLayoutOnError = (errors) =>
    console.log("Errors Occurred !! :", errors);

  if (!isHydrated) {
    return null;
  }
  return (
    <>
      <div className="min-h-screen">
        <div className="bg-white m-2">
          <div className="py-2">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                variant="scrollable"
                scrollButtons="auto"
              >
                {[
                  "Owner Details",
                  "Shop Info",
                  "Main Branch",
                  "Sub Branch",
                  "Shop Layout",
                ].map((item, index) => (
                  <Tab
                    key={index}
                    label={item}
                    {...a11yProps(index)}
                    className="capitalize text-base"
                  />
                ))}
              </Tabs>
            </Box>
          </div>
          <TabPanel value={value} index={0}>
            <div className="bg-colorWhite rounded-lg p-5 ">
              {/* <h3 className="text-colorPrimary text-lg font-semibold leading-8">
              Owner Details
            </h3> */}
              <form>
                <div className="flex flex-col space-y-3">
                  <div className="flex gap-10 sm:gap-20 w-full justify-between items-center">
                    {/* <p className="mt-2 hidden sm:flex items-center text-colorBlack text-lg">
                    Name:
                  </p> */}
                    <div className="w-full">
                      <Box sx={{ display: "flex" }}>
                        <CustomTextField
                          id="input-with-sx"
                          label="First Name"
                          variant="standard"
                          className="w-full"
                          {...ownerInfoRegister("first_name", {
                            required: "FirstName is required",
                          })}
                        />
                      </Box>
                      <div className="mt-2">
                        {ownerInfoErrors?.first_name && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {ownerInfoErrors.first_name?.message}
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
                          {...ownerInfoRegister("last_name", {
                            required: "LastName is required",
                          })}
                        />
                      </Box>
                      <div className="mt-2">
                        {ownerInfoErrors?.last_name && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {ownerInfoErrors.last_name?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-10 sm:gap-20">
                    {/* <p className="mt-2 hidden sm:flex items-center justify-between  text-colorBlack text-lg">
                    Email:
                  </p> */}
                    <div className="w-full">
                      <Box sx={{ display: "flex" }}>
                        <CustomTextField
                          id="input-with-sx"
                          label="Email Address"
                          variant="standard"
                          className="w-full"
                          {...ownerInfoRegister("user_email", {
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
                        {ownerInfoErrors?.user_email && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {ownerInfoErrors.user_email?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-10 sm:gap-20">
                    {/* <p className="mt-2 hidden sm:flex items-center justify-between  text-colorBlack text-lg">
                    Phone:
                  </p> */}
                    <div className="w-full">
                      <Box sx={{ display: "flex" }}>
                        <CustomTextField
                          id="input-with-sx"
                          label="Phone Number"
                          variant="standard"
                          className="w-full"
                          type="number"
                          {...ownerInfoRegister("user_contact", {
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
                        {ownerInfoErrors?.user_contact && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {ownerInfoErrors.user_contact?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <Box className="flex pt-2 mt-4 w-full justify-end">
                      <button
                        type="submit"
                        onClick={ownerInfoHandleSubmit(
                          ownerInfoOnSubmit,
                          ownerInfoOError
                        )}
                        className="bg-colorPrimary hover:bg-colorPrimary mr-1 text-white px-9 py-3 rounded-xl font-semibold focus:outline-none focus:shadow-outline 
                                     shadow-lg flex items-center justify-center"
                      >
                        {ownerLoading && (
                          <CircularProgress
                            size={20}
                            color="primary"
                            sx={{ color: "white", mr: 1 }}
                          />
                        )}
                        Update
                      </button>
                    </Box>
                  </div>
                </div>
              </form>
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <div className="bg-colorWhite rounded-lg p-5 ">
              <div className="flex w-full  items-center justify-between">
                {/* <h3 className="text-colorPrimary text-lg font-semibold leading-8">
                Shop Info
              </h3> */}

                {/* <div className="flex items-center gap-2">
                <label className="inline-flex border-2 cursor-pointer dark:bg-white-300 dark:text-white-800">
                  <input
                    id="Toggle4"
                    type="checkbox"
                    className="hidden peer"
                    onChange={(e) => setIndividual(e.target.checked)}
                    disabled
                  />
                  <span className="px-4 py-1 bg-colorPrimary peer-checked:text-black peer-checked:bg-white text-white">
                    Shop
                  </span>
                  <span className="px-4 py-1 dark:bg-white-300 peer-checked:bg-colorPrimary peer-checked:text-white ">
                    Individual
                  </span>
                </label>
              </div> */}
              </div>
              <form>
                <div className="flex flex-col">
                  <div className="flex items-center justify-center">
                    <div className="w-full">
                      <Box sx={{ display: "flex" }}>
                        <CustomTextField
                          id="input-with-sx"
                          label="Shop Name"
                          variant="standard"
                          className="w-full"
                          {...shopInfoRegister("shop_name", {
                            required: "Shop Name is required",
                          })}
                        />
                      </Box>
                      <div className="mt-2">
                        {shopInfoErrors.shop_name && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {shopInfoErrors.shop_name?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!individual && (
                    <>
                      <div className="flex items-center justify-center">
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Shop Email"
                              variant="standard"
                              className="w-full"
                              {...shopInfoRegister("shop_email", {
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
                            {shopInfoErrors.shop_email && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {shopInfoErrors.shop_email?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Personal Website"
                              variant="standard"
                              className="w-full"
                              {...shopInfoRegister("personal_website", {
                                required: "Personal Website is required",
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {shopInfoErrors.personal_website && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {shopInfoErrors.personal_website?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row w-full justify-between items-center space-y-3 sm:space-y-0 sm:gap-20">
                        <div className="w-full">
                          <Box sx={{ display: "flex" }}>
                            <CustomTextField
                              id="input-with-sx"
                              label="Facebook Link"
                              variant="standard"
                              className="w-full"
                              {...shopInfoRegister("facebook_link", {
                                required: "Facebook Link is required",
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {shopInfoErrors.facebook_link && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {shopInfoErrors.facebook_link?.message}
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
                              {...shopInfoRegister("instagram_link", {
                                required: "Instagram Link is required",
                              })}
                            />
                          </Box>
                          <div className="mt-2">
                            {shopInfoErrors.instagram_link && (
                              <span style={{ color: "red" }} className="-mb-6">
                                {shopInfoErrors.instagram_link?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-col">
                        <span className="flex items-center text-colorBlack text-xs opacity-80">
                          Hours
                        </span>
                        <div
                          className="border border-colorBlack p-3 rounded-lg flex items-center justify-between cursor-pointer text-colorBlack text-sm sm:text-base font-semibold"
                          onClick={() => {
                            setHoursModalOpen(true);
                          }}
                        >
                          <div className="">
                            {hours.map((day, index) => (
                              <div
                                className="flex justify-between pb-2"
                                key={index}
                              >
                                <div className="pr-2">{day["key"]} :</div>
                                <div className="">
                                  {day["value"]?.map((time, index) => (
                                    <p
                                      key={index}
                                      className={
                                        time === "Closed"
                                          ? "text-red-600"
                                          : time === "Open 24 hours"
                                          ? "text-green-600"
                                          : ""
                                      }
                                    >
                                      {time}
                                    </p>
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

                  <div className="flex items-center justify-center">
                    <Box className="flex pt-2 mt-4 w-full justify-end">
                      <button
                        type="submit"
                        onClick={shopInfoHandleSubmit(
                          shopInfoOnSubmit,
                          shopInfoOError
                        )}
                        className="bg-colorPrimary hover:bg-colorPrimary mr-1 text-white px-9 py-3 rounded-xl font-semibold focus:outline-none focus:shadow-outline 
                                     shadow-lg flex items-center justify-center"
                      >
                        {shopLoading && (
                          <CircularProgress
                            size={20}
                            color="primary"
                            sx={{ color: "white", mr: 1 }}
                          />
                        )}
                        Update
                      </button>
                    </Box>
                  </div>
                </div>
              </form>

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
            </div>
          </TabPanel>

          <TabPanel value={value} index={2}>
            <div className="bg-colorWhite rounded-lg p-5 ">
              <form>
                <div className="flex flex-col">
                  {/* <h3 className="text-colorPrimary text-lg font-semibold leading-8">
                    Main Branch
                  </h3> */}
                  <div className="flex items-center justify-center">
                    <div className="w-full">
                      <Box sx={{ display: "flex" }}>
                        <CustomTextField
                          id="input-with-sx"
                          label="Address"
                          variant="standard"
                          className="w-full"
                          {...mainBranchInfoRegister("address", {
                            required: "Address is required",
                          })}
                        />
                      </Box>
                      <div className="mt-2">
                        {mainBranchInfoErrors.address && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {mainBranchInfoErrors.address?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-10 sm:gap-20 w-full justify-between items-center">
                    <div className="w-full">
                      <Box sx={{ display: "flex" }}>
                        <CustomTextField
                          id="input-with-sx"
                          label="City"
                          variant="standard"
                          className="w-full"
                          {...mainBranchInfoRegister("city", {
                            required: "City is required",
                          })}
                        />
                      </Box>
                      <div className="mt-2">
                        {mainBranchInfoErrors.city && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {mainBranchInfoErrors.city?.message}
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
                          {...mainBranchInfoRegister("pin_code", {
                            required: "PinCode is required",
                          })}
                        />
                      </Box>
                      <div className="mt-2">
                        {mainBranchInfoErrors.pin_code && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {mainBranchInfoErrors.pin_code?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4>Manager Details</h4>
                  </div>
                  <div className="flex sm:justify-center md:justify-end">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <span className="font-semibold text-lg text-black opacity-80">
                        Same as owner
                      </span>

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
                        <FormControlLabel
                          value="True"
                          label="Yes"
                          control={<Radio />}
                        />
                        <FormControlLabel
                          value="False"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex gap-10 sm:gap-20 w-full justify-between items-center">
                    {/* <p className="mt-2 hidden sm:flex items-center text-colorBlack text-lg">
                      Name:
                    </p> */}
                    <div className="w-full">
                      <Box sx={{ display: "flex" }}>
                        <CustomTextField
                          id="input-with-sx"
                          label="Manager First Name"
                          variant="standard"
                          className="w-full"
                          disabled={sameAsOwner === "True"}
                          {...mainBranchInfoRegister("manager_first_name", {
                            required: "Manager FirstName is required",
                          })}
                        />
                      </Box>
                      <div className="mt-2">
                        {mainBranchInfoErrors.manager_first_name && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {mainBranchInfoErrors.manager_first_name?.message}
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
                          {...mainBranchInfoRegister("manager_last_name", {
                            required: "Manager LastName is required",
                          })}
                        />
                      </Box>
                      <div className="mt-2">
                        {mainBranchInfoErrors.manager_last_name && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {mainBranchInfoErrors.manager_last_name?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-10 sm:gap-20">
                    {/* <p className="mt-2 hidden sm:flex items-center justify-between  text-colorBlack text-lg">
                      Email:
                    </p> */}
                    <div className="w-full">
                      <Box sx={{ display: "flex" }}>
                        <CustomTextField
                          id="input-with-sx"
                          label="Manager Email Address"
                          variant="standard"
                          className="w-full"
                          disabled={sameAsOwner === "True"}
                          {...mainBranchInfoRegister("manager_user_email", {
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
                        {mainBranchInfoErrors.manager_user_email && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {mainBranchInfoErrors.manager_user_email?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-10 sm:gap-20">
                    {/* <p className="mt-2 hidden sm:flex items-center justify-between  text-colorBlack text-lg">
                      Phone:
                    </p> */}
                    <div className="w-full">
                      <Box sx={{ display: "flex" }}>
                        <CustomTextField
                          id="input-with-sx"
                          label="Manager Phone Number"
                          variant="standard"
                          className="w-full"
                          disabled={sameAsOwner === "True"}
                          type="number"
                          {...mainBranchInfoRegister("manager_user_contact", {
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
                        {mainBranchInfoErrors.manager_user_contact && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {mainBranchInfoErrors.manager_user_contact?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <Box className="flex pt-2 mt-4 w-full justify-end">
                      <button
                        type="submit"
                        onClick={mainBranchInfoHandleSubmit(
                          mainBranchInfoOnSubmit,
                          mainBranchInfoOError
                        )}
                        className="bg-colorPrimary hover:bg-colorPrimary mr-1 text-white px-9 py-3 rounded-xl font-semibold focus:outline-none focus:shadow-outline 
                                     shadow-lg flex items-center justify-center"
                      >
                        {mainBranchLoading && (
                          <CircularProgress
                            size={20}
                            color="primary"
                            sx={{ color: "white", mr: 1 }}
                          />
                        )}
                        Update
                      </button>
                    </Box>
                  </div>
                </div>
              </form>
            </div>
          </TabPanel>

          <TabPanel value={value} index={3}>
            {subBranchList.length > 0 && (
              <div className="">
                <div className="flex items-center justify-between container">
                  <h3 className="text-colorPrimary text-xl font-semibold leading-8">
                    Sub Branches
                  </h3>

                  <Button
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() => setSubBranchModalOpen(true)}
                  >
                    Sub Branch
                  </Button>
                </div>

                <div className="container grid grid-cols-1 sm:grid-cols-2 gap-10 my-5">
                  {subBranchList.map((sub, index) => (
                    <div
                      className="bg-colorWhite p-5 rounded-xl flex flex-col gap-1"
                      key={index}
                    >
                      <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                        <b className="mr-2 text-sm sm:text-base lg:text-lg">
                          Branch Address :{" "}
                        </b>
                        {sub.branch_address}
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                        <b className="mr-2 text-sm sm:text-base lg:text-lg">
                          Branch City :{" "}
                        </b>
                        {sub.branch_city}
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                        <b className="mr-2 text-sm sm:text-base lg:text-lg">
                          Branch PinCode :{" "}
                        </b>
                        {sub.branch_pinCode}
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                        <b className="mr-2 text-sm sm:text-base lg:text-lg">
                          Branch Manager Name :
                        </b>
                        {sub.manager_name}
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                        <b className="mr-2 text-sm sm:text-base lg:text-lg">
                          Branch Manager Email :
                        </b>
                        {sub.manager_email}
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                        <b className="mr-2 text-sm sm:text-base lg:text-lg">
                          Branch Manager Phone Number :
                        </b>
                        {sub.manager_contact}
                      </p>

                      <div className="container mt-5">
                        <Divider />
                      </div>
                      <div className="container mt-5 flex items-center justify-end gap-5">
                        <IconButton
                          aria-label="delete"
                          className="!rounded-xl !capitalize !text-colorBlack !p-2 !bg-red-600 hover:!bg-red-600"
                          onClick={() => {
                            setBranchDeleteModalOpen(true);
                            setDeleteBranchId(sub.id);
                          }}
                        >
                          <DeleteIcon className="!text-colorWhite" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          className="!rounded-xl !capitalize !text-colorBlack !p-2 !bg-colorStone hover:!bg-colorStone"
                          onClick={() => {
                            setSubBranchModalOpen(true);
                            setEditSubBranchId(sub.id);
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
          </TabPanel>

          <TabPanel value={value} index={4}>
            <div className="container bg-colorWhite rounded-lg my-5 p-5 ">
              <div className="flex flex-col space-y-3">
                <h3 className="text-colorPrimary text-lg font-semibold leading-8">
                  Shop Layout
                </h3>
                <div className="flex flex-col sm:flex-row sm:gap-20 items-center justify-center container mt-10">
                  <div>
                    <label className="flex justify-center items-center font-bold mb-3">
                      Logo
                    </label>
                    <input
                      type="file"
                      id="shopLogo"
                      name="shopLogo"
                      hidden
                      {...shopLayoutRegister("shopLogo", {
                        required:
                          shopLogo === "" ? "shopLogo is required" : false,
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
                          src={shopLogo ?? ""}
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
                        className="h-24 w-24  border-dashed border-colorSecondary flex justify-center items-center"
                        style={{
                          borderStyle: "dashed",
                          border: "1px dashed #000000",
                        }}
                      >
                        <button
                          className="h-24 w-24  border-dashed border-colorSecondary flex justify-center items-center"
                          onClick={() => {
                            document.getElementById("shopLogo").click();
                          }}
                        >
                          <AddIcon />
                        </button>
                      </div>
                    )}
                    <div className="mt-2">
                      {shopLayoutErrors.shopLogo && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {shopLayoutErrors.shopLogo?.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="flex justify-center items-center font-bold  mb-3">
                      Cover Image
                    </label>

                    <input
                      type="file"
                      id="shopBackground"
                      name="shopBackground"
                      hidden
                      {...shopLayoutRegister("shopBackground", {
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

                    {shopBackground !== "" ? (
                      <div>
                        <Image
                          src={shopBackground ?? ""}
                          height="150px"
                          alt="logoimg"
                          width="200px"
                        />
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
                            onClick={() =>
                              document.getElementById("shopBackground").click()
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
                            document.getElementById("shopBackground").click();
                          }}
                        >
                          <AddIcon />
                        </button>
                      </div>
                    )}
                    <div className="mt-2">
                      {shopLayoutErrors.shopBackground && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {shopLayoutErrors.shopBackground?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 items-center flex-col w-full container">
                  <h4 className="font-bold mb-3 flex justify-center items-center">
                    Shop Images
                  </h4>

                  <div className="flex justify-center flex-col items-center">
                    <div className="flex  justify-center">
                      <input
                        type="file"
                        id="shopEditId"
                        hidden
                        multiple
                        accept="image/*"
                        {...shopLayoutRegister("shopImages", {
                          required:
                            shopImages?.length === 0
                              ? "Shop Image is required"
                              : false,
                          onChange: (e) => {
                            updateShopImagesChange(e);
                          },
                        })}
                      />
                    </div>
                    <div className="mt-2">
                      {shopLayoutErrors.shopImages && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {shopLayoutErrors.shopImages?.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex  justify-center mt-10">
                    <div className="flex flex-col w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-10 place-items-center">
                        {shopImages?.map((image, index) => (
                          <div key={index}>
                            <Image
                              src={image?.links ?? ""}
                              alt="Product Preview"
                              height={200}
                              width={250}
                            />
                            <div
                              className="bg-gray-300 rounded-full flex justify-center items-center"
                              style={{
                                position: "relative",
                                left: 255,
                                bottom: 30,
                                height: 30,
                                width: 30,
                                color: "#5cb85c",
                              }}
                            >
                              <EditIcon
                                style={{ color: "black", cursor: "pointer" }}
                                // onClick={() => handleEdit(image?.links)}
                                onClick={() => (
                                  setShopEditImg(image?.links),
                                  document.getElementById("shopEditId").click()
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="my-5 items-center flex-col w-full container">
                  <h4 className="font-bold mb-3 flex justify-center items-center">
                    Shop Video
                  </h4>

                  {/* <div className="flex justify-center flex-col items-center">
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
                  </div> */}

                  {/* {shopVideo !== "" && ( */}
                  <div className="flex  justify-center mt-10">
                    <div className="flex flex-col w-full">
                      <div className="grid grid-cols-1 place-items-center">
                        <div>
                          <input
                            type="file"
                            id="shopVideoId"
                            name="shopVideo"
                            accept="video/*"
                            hidden
                            controls
                            onClick={(e) => (e.target.value = null)}
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                onShopVideoPreview(e);
                              }
                            }}
                          />

                          {shopVideo !== "" ? (
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
                                      document
                                        .getElementById("shopVideoId")
                                        .click();
                                    }}
                                  />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="w-[350px] h-[200px] border border-[cadetblue] flex justify-center items-center">
                              <div className="m-8">
                                <div
                                  style={{ width: "inherit" }}
                                  className="mb-2 flex justify-center items-center"
                                >
                                  <AddAPhotoIcon />
                                </div>
                                <div className="mb-3 px-[32px] text-sm font-emoji">
                                  <p>Upload Shop Video</p>
                                </div>
                                <div className="mb-2">
                                  <Button
                                    variant="contained"
                                    component="label"
                                    className="w-full !capitalize !bg-gray-500 !rounded-3xl"
                                    onClick={() => {
                                      document
                                        .getElementById("shopVideoId")
                                        .click();
                                    }}
                                  >
                                    Upload
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* )} */}
                </div>

                <div className="flex items-center justify-center">
                  <Box className="flex pt-2 mt-4 w-full container justify-end">
                    <button
                      type="submit"
                      onClick={shopLayoutHandleSubmit(
                        shopLayoutOnSubmit,
                        shopLayoutOnError
                      )}
                      className="bg-colorPrimary hover:bg-colorPrimary mr-1 text-white px-9 py-3 rounded-xl font-semibold focus:outline-none focus:shadow-outline 
                                     shadow-lg flex items-center justify-center"
                    >
                      {shopLayoutLoading && (
                        <CircularProgress
                          size={20}
                          color="primary"
                          sx={{ color: "white", mr: 1 }}
                        />
                      )}
                      Update Shop Layout
                    </button>
                  </Box>
                </div>
              </div>
            </div>
          </TabPanel>
        </div>
      </div>
      <SubBranchModal
        subBranchModalOpen={subBranchModalOpen}
        setSubBranchModalOpen={setSubBranchModalOpen}
        getAllSubBranchList={getAllSubBranchList}
        ShopId={userProfile?.userCreatedShopId}
        editSubBranchId={editSubBranchId}
        setEditSubBranchId={setEditSubBranchId}
        mainBranchInfoGetValue={mainBranchInfoGetValue}
        ownerInfoGetValue={ownerInfoGetValue}
      />

      <CustomAuthModal
        open={branchDeleteModalOpen}
        onClose={() => setBranchDeleteModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="animate__animated animate__slideInDown"
      >
        <Box sx={style} className="!w-[90%] lg:!w-1/2">
          <div className="p-5">
            <div className="flex items-center">
              <p className="flex items-center text-colorBlack text-xl font-semibold">
                Confirmation Modal
              </p>
            </div>

            <div className="p-5 text-colorBlack text-lg font-normal">
              Are you sure delete this branch <b>{deleteBranchId}</b>.
            </div>

            <div className="container mt-5 flex items-center justify-end gap-5">
              <Button
                variant="outlined"
                className="rounded-xl capitalize text-colorBlack py-2 px-5"
                onClick={() => setBranchDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="rounded-xl capitalize text-colorWhite bg-red-600 hover:bg-red-600 py-2 px-5"
                onClick={() => {
                  deleteBranch({ id: deleteBranchId }).then(
                    (res) => {
                      toast.success(res.data.deleteBranch, {
                        theme: "colored",
                      });
                      getAllSubBranchList();
                    },
                    (error) => {
                      toast.error(error.message, { theme: "colored" });
                    }
                  );
                  setBranchDeleteModalOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Box>
      </CustomAuthModal>
    </>
  );
};

export default withAuth(ShopEdit);

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
              <ArrowBackIcon
                className="!text-black !cursor-pointer"
                onClick={() => setHoursModalOpen(false)}
              />
              <p className="flex items-center text-colorBlack text-xl ml-5 font-semibold">
                Hours
              </p>
              <CloseIcon
                className="!text-black !ml-auto !cursor-pointer"
                onClick={() => setHoursModalOpen(false)}
              />
            </div>
            <div className="h-[calc(100vh-300px)] sm:h-[calc(100vh-350px)] overflow-auto">
              <div className="flex flex-col gap-2 mt-10 container">
                {hours.map((day, index) => (
                  <div
                    className="flex items-center justify-between text-colorBlack text-sm sm:text-base"
                    key={index}
                  >
                    <p>
                      <b>{day["key"]}</b>
                    </p>

                    <div className="flex flex-col">
                      {day["value"].map((time, index) => (
                        <div className="flex items-center gap-5" key={index}>
                          <p
                            className={
                              time === "Closed"
                                ? "text-red-600"
                                : time === "Open 24 hours"
                                ? "text-green-600"
                                : ""
                            }
                          >
                            {time}
                          </p>
                          <div
                            className="p-1 border rounded-full cursor-pointer hover:bg-[#bdbbbb]"
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
        <Box sx={style} className="!w-[80%] lg:!w-[40%]">
          <div className="p-5">
            <p className="flex items-center text-colorBlack text-xl font-semibold justify-center">
              Select Days & Time
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
                ].map((itm) => (
                  <div
                    className={`md:px-[3%] md:py-[2%] px-[4%] py-[2%] border rounded-[50%] ${
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
                disabled={
                  (startTime && closeTime) === undefined &&
                  !open24Hours &&
                  !closed
                }
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
  getAllSubBranchList,
  ShopId,
  editSubBranchId,
  setEditSubBranchId,
  ownerInfoGetValue,
  mainBranchInfoGetValue,
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
      setSubManagerFirstName(ownerInfoGetValue("first_name"));
      setSubManagerLastName(ownerInfoGetValue("last_name"));
      setSubManagerEmail(ownerInfoGetValue("user_email"));
      setSubManagerPhone(ownerInfoGetValue("user_contact"));
      error.subManagerFirstNameError = "";
      error.subManagerLastNameError = "";
      error.subManagerEmailError = "";
      error.subManagerPhoneError = "";
    } else if (managerValue === "same as main branch manager") {
      setSubManagerFirstName(mainBranchInfoGetValue("manager_first_name"));
      setSubManagerLastName(mainBranchInfoGetValue("manager_last_name"));
      setSubManagerEmail(mainBranchInfoGetValue("manager_user_email"));
      setSubManagerPhone(mainBranchInfoGetValue("manager_user_contact"));
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
  }, [error, mainBranchInfoGetValue, managerValue, ownerInfoGetValue]);

  useEffect(() => {
    if (editSubBranchId !== undefined) {
      getSingleBranchDetails({ id: editSubBranchId }).then((res) => {
        setSubManagerAddress(res.data.branch.branch_address);
        setSubManagerCity(res.data.branch.branch_city);
        setSubManagerPinCode(res.data.branch.branch_pinCode);
        setSubManagerFirstName(res.data.branch.manager_name.split(" ")[0]);
        setSubManagerLastName(res.data.branch.manager_name.split(" ")[1]);
        setSubManagerEmail(res.data.branch.manager_email);
        setSubManagerPhone(res.data.branch.manager_contact);
      });
    }
  }, [editSubBranchId]);

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
      if (editSubBranchId === undefined) {
        createBranch({
          branchInfo: {
            branch_address: subManagerAddress,
            branch_city: subManagerCity,
            branch_pinCode: subManagerPinCode,
            manager_name: subManagerFirstName + " " + subManagerLastName,
            manager_contact: subManagerPhone,
            manager_email: subManagerEmail,
            branch_type: "sub",
            shop_id: ShopId,
          },
        }).then(
          (res) => {
            console.log("main res:::", res);
            toast.success(res.data.createBranch.message, {
              theme: "colored",
            });
            getAllSubBranchList();
            handleSubBranchModalClose();
          },
          (error) => {
            toast.error(error.message, { theme: "colored" });
          }
        );
      } else {
        updateBranch({
          id: editSubBranchId,
          branchInfo: {
            branch_address: subManagerAddress,
            branch_city: subManagerCity,
            branch_pinCode: subManagerPinCode,
            manager_name: subManagerFirstName + " " + subManagerLastName,
            manager_contact: subManagerPhone,
            manager_email: subManagerEmail,
            branch_type: "sub",
            shop_id: ShopId,
          },
        }).then(
          (res) => {
            console.log("main res:::", res);
            toast.success(res.data.updateBranch.message, {
              theme: "colored",
            });
            getAllSubBranchList();
            handleSubBranchModalClose();
          },
          (error) => {
            toast.error(error.message, { theme: "colored" });
          }
        );
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
    setEditSubBranchId();
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
              <ArrowBackIcon
                className="!text-black !cursor-pointer"
                onClick={handleSubBranchModalClose}
              />
              <p className="flex items-center text-colorBlack text-xl ml-5 font-semibold">
                {editSubBranchId === undefined ? "Add" : "Update"} Sub Branch
              </p>
              <CloseIcon
                className="!text-black !ml-auto !cursor-pointer"
                onClick={handleSubBranchModalClose}
              />
            </div>

            <div className="h-[calc(100vh-300px)] sm:h-[calc(100vh-335px)] overflow-auto">
              <div className="bg-colorWhite rounded-lg p-5 ">
                <h3 className="text-colorPrimary text-lg font-semibold leading-8">
                  Branches
                </h3>
                <form>
                  <div className="flex flex-col space-y-3">
                    <p className="mt-2 container flex items-center text-colorBlack text-lg">
                      Sub Branch
                    </p>
                    <div className="flex items-center justify-center container">
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
                        <span style={{ color: "red" }}>
                          {error.subManagerAddressError || ""}
                        </span>
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
                        <span style={{ color: "red" }}>
                          {error.subManagerCityError || ""}
                        </span>
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
                        <span style={{ color: "red" }}>
                          {error.subManagerPinCodeError || ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center items-center">
                      <div className="flex justify-between items-center container gap-5 sm:gap-10">
                        <span className="font-semibold text-lg text-[#11142D] mt-5 hidden sm:flex">
                          Manager:
                        </span>

                        <CustomTextField
                          label="Manager"
                          variant="standard"
                          select
                          fullWidth
                          value={managerValue}
                          onChange={(e) => setManagerValue(e.target.value)}
                        >
                          <MenuItem value="">None</MenuItem>
                          {["Same as owner", "same as main branch manager"].map(
                            (man) => (
                              <MenuItem value={man} key={man}>
                                {man}
                              </MenuItem>
                            )
                          )}
                        </CustomTextField>
                      </div>
                    </div>

                    <div className="container flex flex-col sm:flex-row space-y-3 sm:gap-20 w-full justify-between items-center">
                      <p className="mt-2 hidden sm:flex items-center text-colorBlack text-lg">
                        Name:
                      </p>
                      <div className="w-full flex flex-col gap-2">
                        <Box sx={{ display: "flex" }}>
                          <CustomTextField
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
                          <CustomTextField
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
                {editSubBranchId === undefined ? "Save" : "Update"}
              </Button>
            </div>
          </div>
        </Box>
      </CustomAuthModal>
    </>
  );
};
