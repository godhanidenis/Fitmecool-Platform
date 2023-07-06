import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Tab,
  TextField,
} from "@mui/material";
import {
  a11yProps,
  CustomAuthModal,
  CustomTextField,
  CustomVenderShopTab,
  TabPanel,
} from "../../../components/core/CustomMUIComponents";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { getShopOwnerDetail } from "../../../graphql/queries/shopQueries";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useDispatch, useSelector } from "react-redux";
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
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { TbPhotoPlus } from "react-icons/tb";
import CustomTextFieldVendor from "../../../components/Layout/CustomTextFieldVendor";
import { loadVendorShopDetailsStart } from "../../../redux/ducks/vendorShopDetails";

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
  const [shopTimeDetails, setShopTimeDetails] = useState("Show");
  const [managerDetails, setManagerDetails] = useState("Show");
  const [branchDetails, setBranchDetails] = useState({});

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
  const dispatch = useDispatch();

  const {
    register: ownerInfoRegister,
    handleSubmit: ownerInfoHandleSubmit,
    formState: { errors: ownerInfoErrors },
    setValue: ownerInfoSetValue,
    getValues: ownerInfoGetValue,
    reset: ownerInfoReset,
  } = useForm();

  const {
    register: shopInfoRegister,
    handleSubmit: shopInfoHandleSubmit,
    formState: { errors: shopInfoErrors },
    setValue: shopInfoSetValue,
    reset: shopInfoReset,
  } = useForm();

  const {
    register: mainBranchInfoRegister,
    handleSubmit: mainBranchInfoHandleSubmit,
    formState: { errors: mainBranchInfoErrors },
    setValue: mainBranchInfoSetValue,
    getValues: mainBranchInfoGetValue,
    reset: mainBranchInfoReset,
  } = useForm();

  const {
    register: shopLayoutRegister,
    handleSubmit: shopLayoutHandleSubmit,
    formState: { errors: shopLayoutErrors },
    reset: shopLayoutReset,
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
  const [getUploadShopImages, setGetUploadShopImages] = useState([]);

  const [ShopEditImg, setShopEditImg] = useState("");
  const [shopVideo, setShopVideo] = useState("");
  const [uploadShopVideo, setUploadShopVideo] = useState("");

  console.log("shopVideoshopVideo", uploadShopVideo);

  const [shopLayoutAllMediaImages, setShopLayoutAllMediaImages] = useState([]);
  const [shopLayoutAllMediaVideos, setShopLayoutAllMediaVideos] = useState();

  const [isHydrated, setIsHydrated] = useState(false);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleShopTimeDetails = (option) => {
    setShopTimeDetails(option);
  };

  const handleManagerDetails = (option) => {
    setManagerDetails(option);
  };
  const handleBranchDetails = (id) => {
    setBranchDetails((prevState) => ({
      ...prevState,
      [id]: !prevState[id] || false,
    }));
  };

  if (Object.keys(branchDetails).length === 0) {
    subBranchList.forEach((item) => {
      setBranchDetails((prevState) => ({
        ...prevState,
        [item.id]: true,
      }));
    });
  }
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    ownerInfoReset();
  }, [value]);

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
    // setShopVideo("");
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
      // mainBranchInfoSetValue("manager_first_name", "");
      // mainBranchInfoSetValue("manager_last_name", "");
      // mainBranchInfoSetValue("manager_user_email", "");
      // mainBranchInfoSetValue("manager_user_contact", "");
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
  }, [sameAsOwner, mainBranchInfoSetValue, ownerInfoGetValue]);

  useEffect(() => {
    if (userProfile?.userCreatedShopId) {
      dispatch(loadVendorShopDetailsStart(userProfile?.userCreatedShopId));
    }
  }, [dispatch, userProfile?.userCreatedShopId, value]);
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
            setGetUploadShopImages((old) => [...old, file]);
            // setUploadShopImages((old) => [...old, file]);
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
    value,
  ]);

  useEffect(() => {
    setUploadShopImages([...getUploadShopImages?.slice(0, 3)]);
  }, [getUploadShopImages?.length]);

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
        <div className="sm:m-2 m-6">
          <div className="py-2">
            <Box>
              <CustomVenderShopTab
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
              </CustomVenderShopTab>
            </Box>
          </div>
          <TabPanel value={value} index={0}>
            <div className="rounded-lg  mt-10">
              <div className="flex flex-col space-y-10">
                <div className="w-full flex sm:flex-row sm:gap-4 flex-col gap-8">
                  <div className="sm:w-1/2 relative w-full">
                    <CustomTextFieldVendor
                      label="First Name"
                      type="text"
                      id="fName"
                      isRequired={false}
                      placeholder="Your first name"
                      fieldValue={ownerInfoGetValue("first_name")}
                      fieldError={ownerInfoErrors?.first_name}
                      formValue={{
                        ...ownerInfoRegister("first_name", {
                          required: "FirstName is required",
                        }),
                      }}
                    />

                    <div className="mt-2">
                      {ownerInfoErrors?.first_name && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {ownerInfoErrors.first_name?.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="sm:w-1/2 relative w-full">
                    <CustomTextFieldVendor
                      label="Last Name"
                      type="text"
                      id="lName"
                      isRequired={false}
                      placeholder="Your last name"
                      fieldValue={ownerInfoGetValue("last_name")}
                      fieldError={ownerInfoErrors?.last_name}
                      formValue={{
                        ...ownerInfoRegister("last_name", {
                          required: "LastName is required",
                        }),
                      }}
                    />
                    <div className="mt-2">
                      {ownerInfoErrors?.last_name && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {ownerInfoErrors.last_name?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full relative">
                  <CustomTextFieldVendor
                    label="Email Address"
                    type="email"
                    id="email"
                    isRequired={false}
                    placeholder="yourmail@gmail.com"
                    fieldValue={ownerInfoGetValue("user_email")}
                    fieldError={ownerInfoErrors?.user_email}
                    formValue={{
                      ...ownerInfoRegister("user_email", {
                        required: "Email is required",

                        pattern: {
                          value:
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: "Please enter a valid email",
                        },
                      }),
                    }}
                  />
                  <div className="mt-2">
                    {ownerInfoErrors?.user_email && (
                      <span style={{ color: "red" }} className="-mb-6">
                        {ownerInfoErrors.user_email?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full relative">
                  <CustomTextFieldVendor
                    label="Phone Number"
                    type="text"
                    id="phone"
                    isRequired={false}
                    placeholder="Your phone number"
                    fieldValue={ownerInfoGetValue("user_contact")}
                    fieldError={ownerInfoErrors?.user_contact}
                    formValue={{
                      ...ownerInfoRegister("user_contact", {
                        required: "Contact Number is required",
                        minLength: {
                          value: 10,
                          message: "Contact Number must be 10 numbers",
                        },
                        maxLength: {
                          value: 10,
                          message: "Contact Number must be 10 numbers",
                        },
                      }),
                    }}
                  />
                  <div className="mt-2">
                    {ownerInfoErrors?.user_contact && (
                      <span style={{ color: "red" }} className="-mb-6">
                        {ownerInfoErrors.user_contact?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <Box className="flex pt-2 mt-4 w-full sm:justify-end justify-center">
                    <button
                      type="submit"
                      onClick={ownerInfoHandleSubmit(
                        ownerInfoOnSubmit,
                        ownerInfoOError
                      )}
                      className="bg-colorGreen sm:text-lg text-sm  mr-1 text-white px-8 py-3 rounded-xl font-medium focus:outline-none focus:shadow-outline 
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
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <div className=" rounded-lg mt-10">
              <div className="space-y-10">
                <div className="w-full relative">
                  <CustomTextFieldVendor
                    label="Shop Name"
                    type="text"
                    id="shopName"
                    isRequired={false}
                    placeholder="Your shop name"
                    formValue={{
                      ...shopInfoRegister("shop_name", {
                        required: "Shop Name is required",
                      }),
                    }}
                  />
                  <div className="mt-2">
                    {shopInfoErrors.shop_name && (
                      <span style={{ color: "red" }} className="-mb-6">
                        {shopInfoErrors.shop_name?.message}
                      </span>
                    )}
                  </div>
                </div>
                {!individual && (
                  <>
                    <div className="w-full relative">
                      <CustomTextFieldVendor
                        label="Shop Email"
                        type="email"
                        id="shopEmail"
                        isRequired={false}
                        placeholder="Your shop email"
                        formValue={{
                          ...shopInfoRegister("shop_email", {
                            required: "Shop Email is required",

                            pattern: {
                              value:
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                              message: "Please enter a valid email",
                            },
                          }),
                        }}
                      />
                      <div className="mt-2">
                        {shopInfoErrors.shop_email && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {shopInfoErrors.shop_email?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-full relative">
                      <CustomTextFieldVendor
                        label=" Personal Website Link"
                        type="text"
                        id="personalWebLink1"
                        isRequired={false}
                        placeholder="Personal Website Link"
                        formValue={{
                          ...shopInfoRegister("personal_website", {
                            required: "Personal Website is required",
                          }),
                        }}
                      />
                      <div className="mt-2">
                        {shopInfoErrors.personal_website && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {shopInfoErrors.personal_website?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-full flex gap-4 max-md:flex-col max-md:gap-8">
                      <div className="w-1/2 relative max-md:w-full">
                        <CustomTextFieldVendor
                          label=" Fackbook Link"
                          type="text"
                          id="fbLink"
                          isRequired={false}
                          placeholder="Your facebook link"
                          formValue={{
                            ...shopInfoRegister("facebook_link", {
                              required: "Facebook Link is required",
                            }),
                          }}
                        />
                        <div className="mt-2">
                          {shopInfoErrors.facebook_link && (
                            <span style={{ color: "red" }} className="-mb-6">
                              {shopInfoErrors.facebook_link?.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-1/2 relative max-md:w-full">
                        <CustomTextFieldVendor
                          label=" Instagram Link"
                          type="text"
                          id="igLink"
                          isRequired={false}
                          placeholder="Your instagram link"
                          formValue={{
                            ...shopInfoRegister("instagram_link", {
                              required: "Instagram Link is required",
                            }),
                          }}
                        />
                        <div className="mt-2">
                          {shopInfoErrors.instagram_link && (
                            <span style={{ color: "red" }} className="-mb-6">
                              {shopInfoErrors.instagram_link?.message}
                            </span>
                          )}
                        </div>
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
                    <div className="w-full grid sm:grid-cols-2 gap-y-8 gap-4 grid-cols-1">
                      {hours.map((day, index) => (
                        <div className="relative" key={index}>
                          <label
                            htmlFor="sunday"
                            className="absolute sm:-top-4 -top-3 left-5 px-2 bg-white font-semibold sm:text-base text-sm"
                          >
                            {day["key"]}
                          </label>
                          {day["value"]?.map((time, index) => (
                            <input
                              key={index}
                              type="text"
                              id="sunday"
                              value={time}
                              className={`w-full px-7 sm:py-5 py-3 text-sm sm:text-lg rounded-xl border border-gray-200 outline-none ${
                                time === "Closed"
                                  ? "text-red-600"
                                  : time === "Open 24 hours"
                                  ? "text-green-600"
                                  : ""
                              }`}
                              readOnly
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center">
                      <Box className="flex pt-2 my-4 w-full sm:justify-end justify-center">
                        <button
                          type="submit"
                          onClick={shopInfoHandleSubmit(
                            shopInfoOnSubmit,
                            shopInfoOError
                          )}
                          className="bg-colorGreen sm:text-lg text-sm  mr-1 text-white px-8 py-3 rounded-xl font-medium focus:outline-none focus:shadow-outline 
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
                </>
              )}
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
            <div className="rounded-lg mt-10">
              <div className="space-y-10">
                <div className="w-full relative">
                  <CustomTextFieldVendor
                    label="Address"
                    type="text"
                    id="address"
                    isRequired={false}
                    placeholder="Your address"
                    formValue={{
                      ...mainBranchInfoRegister("address", {
                        required: "Address is required",
                      }),
                    }}
                  />
                  <div className="mt-2">
                    {mainBranchInfoErrors.address && (
                      <span style={{ color: "red" }} className="-mb-6">
                        {mainBranchInfoErrors.address?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full flex sm:flex-row sm:gap-4 flex-col gap-8">
                  <div className="sm:w-1/2 relative w-full">
                    <CustomTextFieldVendor
                      label=" City"
                      type="text"
                      id="city"
                      isRequired={false}
                      placeholder="Your city"
                      formValue={{
                        ...mainBranchInfoRegister("city", {
                          required: "City is required",
                        }),
                      }}
                    />
                    <div className="mt-2">
                      {mainBranchInfoErrors.city && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {mainBranchInfoErrors.city?.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="sm:w-1/2 relative w-full">
                    <CustomTextFieldVendor
                      label=" Pincode"
                      type="number"
                      id="pincode"
                      isRequired={false}
                      placeholder="Your pincode"
                      formValue={{
                        ...mainBranchInfoRegister("pin_code", {
                          required: "PinCode is required",
                        }),
                      }}
                    />
                    <div className="mt-2">
                      {mainBranchInfoErrors.pin_code && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {mainBranchInfoErrors.pin_code?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex my-5">
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
                  Manager Details
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
                    <CustomTextFieldVendor
                      label=" First Name"
                      type="text"
                      id="managerfName"
                      isRequired={false}
                      placeholder="Manager first name"
                      disabled={sameAsOwner === "True"}
                      formValue={{
                        ...mainBranchInfoRegister("manager_first_name", {
                          required: "Manager FirstName is required",
                        }),
                      }}
                    />
                    <div className="mt-2">
                      {mainBranchInfoErrors.manager_first_name && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {mainBranchInfoErrors.manager_first_name?.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="sm:w-1/2 relative w-full">
                    <CustomTextFieldVendor
                      label=" Last Name"
                      type="text"
                      id="mangerlName"
                      isRequired={false}
                      placeholder="Manager last name"
                      disabled={sameAsOwner === "True"}
                      formValue={{
                        ...mainBranchInfoRegister("manager_last_name", {
                          required: "Manager LastName is required",
                        }),
                      }}
                    />
                    <div className="mt-2">
                      {mainBranchInfoErrors.manager_last_name && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {mainBranchInfoErrors.manager_last_name?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full relative">
                  <CustomTextFieldVendor
                    label=" E-Mail"
                    type="email"
                    id="managerEmail"
                    isRequired={false}
                    placeholder="Manager email address"
                    disabled={sameAsOwner === "True"}
                    formValue={{
                      ...mainBranchInfoRegister("manager_user_email", {
                        required: "Manager Email is required",

                        pattern: {
                          value:
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: "Please enter a valid email",
                        },
                      }),
                    }}
                  />
                  <div className="mt-2">
                    {mainBranchInfoErrors.manager_user_email && (
                      <span style={{ color: "red" }} className="-mb-6">
                        {mainBranchInfoErrors.manager_user_email?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full relative">
                  <CustomTextFieldVendor
                    label=" Phone Number"
                    type="number"
                    id="managerPhone"
                    isRequired={false}
                    placeholder="Manager phone number"
                    disabled={sameAsOwner === "True"}
                    formValue={{
                      ...mainBranchInfoRegister("manager_user_contact", {
                        required: "Manager Contact Number is required",
                        minLength: {
                          value: 10,
                          message: "Manager Contact Number must be 10 numbers",
                        },
                        maxLength: {
                          value: 10,
                          message: "Manager Contact Number must be 10 numbers",
                        },
                      }),
                    }}
                  />
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
                <Box className="flex pt-2 mt-4 w-full sm:justify-end justify-center">
                  <button
                    type="submit"
                    onClick={mainBranchInfoHandleSubmit(
                      mainBranchInfoOnSubmit,
                      mainBranchInfoOError
                    )}
                    className="bg-colorGreen sm:text-lg text-sm  mr-1 text-white px-8 py-3 rounded-xl font-medium focus:outline-none focus:shadow-outline 
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
          </TabPanel>

          <TabPanel value={value} index={3}>
            {!individual && (
              <div className="flex justify-end mt-10">
                <button
                  onClick={() => setSubBranchModalOpen(true)}
                  className="flex items-center opacity-100
                   cursor-pointer uppercase border-2  lg:px-8 lg:py-3 sm:px-6 sm:py-2 px-3 py-2 sm:text-lg text-sm rounded-xl font-semibold border-colorGreen text-colorGreen"
                >
                  <span className="hidden sm:inline">
                    <AddIcon fontSize="medium" className="mr-2" />
                  </span>
                  <span className="sm:hidden">
                    <AddIcon fontSize="small" className="mr-2" />
                  </span>
                  Sub Branch
                </button>
              </div>
            )}

            {subBranchList?.length > 0 && (
              <div className="w-full">
                {subBranchList?.map((sub, index) => (
                  <>
                    <div
                      key={index}
                      style={{
                        borderRadius: branchDetails[sub.id]
                          ? "16px 16px 0px 0px"
                          : "16px",
                      }}
                      className="sm:mt-10 mt-5 w-full flex justify-between bg-[#F3F6F6] items-center"
                    >
                      <div
                        onClick={() => handleBranchDetails(sub.id)}
                        className="sm:text-base text-xs font-semibold text-black py-6 pl-6 cursor-pointer"
                      >
                        {branchDetails[sub.id] ? (
                          <KeyboardArrowUpIcon className="cursor-pointer" />
                        ) : (
                          <KeyboardArrowDownIcon className="cursor-pointer" />
                        )}
                        {"   "}
                        Branch {index + 1}
                      </div>
                      <div className="flex gap-4 pr-6">
                        <span className="bg-[#D63848]  text-white rounded-full lg:p-2 px-2 py-1">
                          <DeleteOutlineOutlinedIcon
                            sx={{
                              "@media (max-width: 768px)": {
                                fontSize: 16,
                              },
                            }}
                            className="cursor-pointer"
                            onClick={() => {
                              setBranchDeleteModalOpen(true);
                              setDeleteBranchId(sub.id);
                            }}
                          />
                        </span>
                        <span className="bg-[#151827]  text-white rounded-full lg:p-2 px-2 py-1">
                          <EditOutlinedIcon
                            sx={{
                              "@media (max-width: 768px)": {
                                fontSize: 16,
                              },
                            }}
                            className="cursor-pointer"
                            onClick={() => {
                              setSubBranchModalOpen(true);
                              setEditSubBranchId(sub.id);
                            }}
                          />
                        </span>
                      </div>
                    </div>

                    <div
                      style={{ border: "2px solid #F3F6F6" }}
                      className={` grid lg:grid-cols-2 grid-cols-1 gap-y-6 mb-16 py-6 ${
                        !branchDetails[sub.id] && "hidden"
                      }`}
                    >
                      <div
                        style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)" }}
                        className="flex flex-col gap-2 rounded-2xl p-4 mx-6"
                      >
                        <p className="sm:text-[16px] text-[12px] text-gray-400 font-semibold">
                          Branch Address
                        </p>
                        <p className="sm:text-[16px] text-[12px] font-semibold text-black">
                          {sub.branch_address}
                        </p>
                      </div>
                      <div
                        style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)" }}
                        className="flex flex-col gap-2 rounded-2xl p-4 mx-6"
                      >
                        <p className="sm:text-[16px] text-[12px] text-gray-400 font-semibold">
                          Branch City
                        </p>
                        <p className="sm:text-[16px] text-[12px] font-semibold text-black">
                          {sub.branch_city}
                        </p>
                      </div>
                      <div
                        style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)" }}
                        className="flex flex-col gap-2 rounded-2xl p-4 mx-6"
                      >
                        <p className="sm:text-[16px] text-[12px] text-gray-400 font-semibold">
                          Branch pincode
                        </p>
                        <p className="sm:text-[16px] text-[12px] font-semibold text-black">
                          {sub.branch_pinCode}
                        </p>
                      </div>
                      <div
                        style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)" }}
                        className="flex flex-col gap-2 rounded-2xl p-4 mx-6"
                      >
                        <p className="sm:text-[16px] text-[12px] text-gray-400 font-semibold">
                          Branch Manager Name
                        </p>
                        <p className="sm:text-[16px] text-[12px] font-semibold text-black">
                          {sub.manager_name}
                        </p>
                      </div>
                      <div
                        style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)" }}
                        className="flex flex-col gap-2 rounded-2xl p-4 mx-6"
                      >
                        <p className="sm:text-[16px] text-[12px] text-gray-400 font-semibold">
                          Branch Manager Email
                        </p>
                        <p className="sm:text-[16px] text-[12px] font-semibold text-black">
                          {sub.manager_email}
                        </p>
                      </div>
                      <div
                        style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)" }}
                        className="flex flex-col gap-2 rounded-2xl p-4 mx-6"
                      >
                        <p className="sm:text-[16px] text-[12px] text-gray-400 font-semibold">
                          Branch Manager Phone Number
                        </p>
                        <p className="sm:text-[16px] text-[12px] font-semibold text-black">
                          {sub.manager_contact}
                        </p>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={4}>
            <div className="container rounded-lg mt-10">
              <div className="grid grid-cols-3 gap-10 my-10">
                <div className="flex flex-col items-center justify-center col-span-3">
                  <div className="sm:text-xl text-sm font-semibold  mb-5 mx-2 text-black">
                    Logo
                  </div>
                  <div className="sm:w-[210px] relative sm:h-[210px] h-[130px] w-[130px] border border-gray-200 hover:border-4 cursor-pointer hover:border-colorGreen rounded-full flex items-center justify-center">
                    <span className="absolute right-4 sm:bottom-2 bottom-0 border border-black rounded-full lg:p-2 px-2 py-1 bg-black text-white">
                      <EditIcon
                        sx={{
                          "@media (max-width: 768px)": {
                            fontSize: 16,
                          },
                        }}
                        onClick={() => {
                          document.getElementById("shopLogo").click();
                        }}
                      />
                    </span>
                    {shopLogo !== "" ? (
                      <div className="sm:w-[210px]   sm:h-[210px] h-[130px] w-[130px]">
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
                      type="file"
                      id="shopLogo"
                      name="shopLogo"
                      accept="image/*"
                      className="hidden"
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
                  </div>
                  <div className="mt-2">
                    {shopLayoutErrors.shopLogo && (
                      <span style={{ color: "red" }} className="-mb-6">
                        {shopLayoutErrors.shopLogo?.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center col-span-3">
                  <div className="sm:text-xl text-sm font-semibold  mb-5 mx-2 text-black">
                    Cover Image
                  </div>
                  <div className="sm:w-2/3 w-full cursor-pointer relative sm:h-[290px] h-[180px] col-span-3 border border-gray-200 hover:border-4 hover:border-colorGreen rounded-3xl flex items-center justify-center">
                    <span className="absolute right-4 top-4 border border-black rounded-full lg:p-2 px-2 py-1 bg-black text-white">
                      <EditIcon
                        sx={{
                          "@media (max-width: 768px)": {
                            fontSize: 16,
                          },
                        }}
                        onClick={() =>
                          document.getElementById("shopBackground").click()
                        }
                      />
                    </span>
                    {shopBackground !== "" ? (
                      <div className="w-full  sm:h-[290px]  h-[180px]">
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
                      id="shopBackground"
                      name="shopBackground"
                      type="file"
                      accept="image/*"
                      className="hidden"
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
                  </div>
                  <div className="mt-2">
                    {shopLayoutErrors.shopBackground && (
                      <span style={{ color: "red" }} className="-mb-6">
                        {shopLayoutErrors.shopBackground?.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-span-3">
                  <div className="sm:text-xl text-sm  font-semibold  mb-5 mx-2 text-black flex justify-center">
                    Shop Images
                    <span className="text-gray-400 ml-1">
                      (Front, Back & Side)
                    </span>
                  </div>
                  <div className="flex xl:gap-8 xl:flex-row flex-col gap-4">
                    {shopImages?.map((image, index) => {
                      return (
                        <>
                          <div
                            key={index}
                            className="w-full  cursor-pointer relative sm:h-[290px] h-[344px] border border-gray-200 hover:border-4 hover:border-colorGreen rounded-3xl flex items-center justify-center"
                          >
                            <span className="absolute right-4 top-4 border border-black rounded-full lg:p-2 px-2 py-1 bg-black text-white z-50">
                              <EditIcon
                                sx={{
                                  "@media (max-width: 768px)": {
                                    fontSize: 16,
                                  },
                                }}
                                onClick={() => (
                                  setShopEditImg(image?.links),
                                  document.getElementById("shopEditId").click()
                                )}
                              />
                            </span>
                            {shopImages?.length > 0 && shopImages[index] ? (
                              <div className="w-full relative sm:h-[290px]  h-[344px]">
                                <img
                                  src={image?.links ?? ""}
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
                              id="shopEditId"
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
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
                        </>
                      );
                    })}
                  </div>
                  <div className="mt-2">
                    {shopLayoutErrors.shopImages && (
                      <span style={{ color: "red" }} className="-mb-6">
                        {shopLayoutErrors.shopImages?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full col-span-3">
                  <div className="sm:text-xl text-sm font-semibold  mb-5 mx-2 text-black flex justify-center">
                    Shop Video
                  </div>
                  <div
                    className="sm:w-2/3 w-full sm:mx-auto cursor-pointer  sm:h-[290px] h-[180px]  border border-gray-200 hover:border-4 hover:border-colorGreen rounded-3xl flex items-center justify-center"
                    onClick={() => {
                      shopVideo == "" &&
                        document.getElementById("shopVideoId").click();
                    }}
                  >
                    {shopVideo !== "" ? (
                      <div className="w-full sm:h-[290px] relative  h-[180px]">
                        <video
                          autoPlay
                          className="object-cover h-full w-full rounded-3xl"
                          controls
                          src={shopVideo}
                        ></video>
                        <span className="absolute right-4 top-4 border border-black rounded-full lg:p-2 px-2 py-1 bg-black text-white">
                          <EditIcon
                            onClick={() => {
                              document.getElementById("shopVideoId").click();
                            }}
                            sx={{
                              "@media (max-width: 768px)": {
                                fontSize: 16,
                              },
                            }}
                          />
                        </span>
                        <span
                          onClick={() => {
                            setShopVideo("");
                            setUploadShopVideo("");
                          }}
                          className="absolute right-4 top-[70px] border border-[#D63848] rounded-full p-2 bg-[#D63848]"
                        >
                          <DeleteIcon style={{ color: "white" }} />
                        </span>
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
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Box className="flex pt-2 my-4 w-full sm:justify-end justify-center">
                  <button
                    type="submit"
                    onClick={shopLayoutHandleSubmit(
                      shopLayoutOnSubmit,
                      shopLayoutOnError
                    )}
                    className="bg-colorGreen sm:text-lg text-sm  mr-1 text-white px-8 py-3 rounded-xl font-medium focus:outline-none focus:shadow-outline 
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
        <Box sx={style} className="!w-[90%] lg:!w-[80%]">
          <div className="sm:p-5 lg:p-5 p-2">
            <div className="flex justify-between items-center">
              <div className="sm:text-2xl text-[16px] font-bold">Hours</div>
              <span>
                <CloseIcon
                  className="text-gray-500 !text-xl sm:!text-3xl"
                  fontSize="large"
                  onClick={() => setHoursModalOpen(false)}
                />
              </span>
            </div>
            <div className="h-[calc(100vh-300px)] sm:h-[calc(100vh-350px)] overflow-auto">
              <div className="grid grid-cols-1 gap-y-5 my-5 xl:my-14 lg:my-10 sm:my-7 ">
                {hours?.map((day, index) => (
                  <div
                    key={index}
                    className="flex justify-between sm:items-center items-start w-full lg:gap-5 xl:gap-10 sm:gap-16 gap-2"
                  >
                    <div className="flex  xl:gap-32  items-center mt-1 sm:mt-0">
                      <div className="sm:text-2xl text-base font-semibold">
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
                            } font-semibold text-2xl`}
                          >
                            {time}
                          </p>
                        ) : (
                          <div className="flex lg:gap-4 gap-2 lg:flex-row flex-col">
                            <div className="relative">
                              <span className="absolute top-1 sm:text-xs text-[10px] font-semibold sm:left-10 left-5">
                                Start with
                              </span>
                              <input
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
                                type="time"
                                readOnly
                                id="saturday"
                                className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3 sm:text-xl text-base font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
                              />
                            </div>
                            <div className="relative">
                              <span className="absolute top-1 sm:text-xs text-[10px] font-semibold sm:left-10 left-5">
                                End with
                              </span>
                              <input
                                type="time"
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
                                id="saturday"
                                readOnly
                                className="lg:px-7 lg:pt-4 sm:px-3 pb-1 px-1 pt-3 sm:text-xl text-base font-semibold rounded-lg border border-gray-200 focus:border-black outline-none"
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
              <div className="flex sm:justify-center flex-wrap lg:gap-4 gap-2 lg:mt-20 mt-10">
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
                ].map((itm, index) => (
                  <div
                    key={index}
                    className={`md:px-[3%] md:py-[2%] px-[4%] py-[2%] border rounded-[50%] ${
                      selectedDay?.split(" - ")[0] === itm && "bg-[#bdbbbb]"
                    } ${
                      selectedWeek?.find((day) => day === itm) && "bg-[#bdbbbb]"
                    } ${
                      selectedAllHours?.find((day) => day === itm) &&
                      "bg-[#bdbbbb]"
                    }  hover:bg-[#bdbbbb] cursor-pointer`}
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
                className="rounded-xl capitalize font-semibold hover:bg-white bg-white text-colorGreen border-2 border-colorGreen hover:border-colorGreen py-2 px-5"
                onClick={handleCloseDaysTimeModal}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="rounded-xl capitalize font-semibold text-white bg-colorGreen hover:bg-colorGreen border-2 border-colorGreen py-2 px-5"
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
