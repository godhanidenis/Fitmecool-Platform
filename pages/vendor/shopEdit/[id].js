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
  CustomVenderShopTab,
  TabPanel,
} from "../../../components/core/CustomMUIComponents";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { shopUpdate } from "../../../graphql/mutations/shops";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { deleteBranch, updateBranch } from "../../../graphql/mutations/branch";
import { createBranch } from "../../../graphql/mutations/branch";
import { withAuth } from "../../../components/core/PrivateRouteForVendor";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { TbPhotoPlus } from "react-icons/tb";
import { loadVendorShopDetailsStart } from "../../../redux/ducks/vendorShopDetails";
import TimeCustomTextField from "../../../components/Layout/TimeCustomTextField";
import VendorBranchTable from "../../../components/Layout/VendorBranchTable";
import ConfirmationModal from "../../../components/Modal/ConfirmationModal";
import ImageLoadingSkeleton from "../../../components/Modal/ImageLoadingSkeleton";
import CustomTextFieldVendor from "../../../components/core/CustomTextFieldVendor";
import { HoursModal } from "../shop-setup";
import { useRouter } from "next/router";
import { fileDelete, fileUpdate, fileUpload } from "../../../services/wasabi";
import Image from "next/image";
import CustomAutoCompleteTextField from "../../../components/core/CustomAutoCompleteTextField";
import {
  getAreaByCityLists,
  getCityByStateLists,
  getStateLists,
} from "../../../graphql/queries/areaListsQueries";

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
    getValues: shopInfoGetValue,

    reset: shopInfoReset,
  } = useForm();

  const {
    register: mainBranchInfoRegister,
    handleSubmit: mainBranchInfoHandleSubmit,
    formState: { errors: mainBranchInfoErrors },
    setValue: mainBranchInfoSetValue,
    getValues: mainBranchInfoGetValue,
    reset: mainBranchInfoReset,
    control: mainBranchInfoControl,
  } = useForm();

  const {
    register: shopLayoutRegister,
    handleSubmit: shopLayoutHandleSubmit,
    formState: { errors: shopLayoutErrors },
    reset: shopLayoutReset,
  } = useForm();

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
  const [editableBranchData, setEditableBranchData] = useState();

  const [addEditSubBranchShow, setAddEditSubBranchShow] = useState(false);

  const [shopLogo, setShopLogo] = useState("");
  const [uploadShopLogo, setUploadShopLogo] = useState("");
  const [deleteShopLogo, setDeleteShopLogo] = useState("");

  const [shopBackground, setShopBackground] = useState("");
  const [uploadShopBackground, setUploadShopBackground] = useState("");
  const [deleteShopBackground, setDeleteShopBackground] = useState("");

  const [shopImages, setShopImages] = useState([]);
  const [shopImagesWasabiUrl, setShopImageWasabiUrl] = useState([]);
  const [editableShopImages, setEditableShopImages] = useState([]);
  const [ShopEditImg, setShopEditImg] = useState("");
  const [deleteShopImages, setDeleteShopImages] = useState([]);

  const [shopVideo, setShopVideo] = useState("");
  const [uploadShopVideo, setUploadShopVideo] = useState("");
  const [deleteShopVideo, setDeleteShopVideo] = useState("");

  const [isHydrated, setIsHydrated] = useState(false);

  const [value, setValue] = useState(0);
  const router = useRouter();

  const { id } = router.query;

  const [stateDataLists, setStateDataLists] = useState([]);
  const [getCityData, setGetCityData] = useState([]);
  const [getAreaData, setGetAreaData] = useState([]);

  const getApiState = async () => {
    await getStateLists()
      .then((res) => setStateDataLists(res?.data?.stateList))
      .catch((error) => console.log("ee", error));
  };

  const onChangeState = async (data) => {
    // console.log("data 1234:>> ", data);
    await getCityByStateLists(data)
      .then((res) => setGetCityData(res?.data?.cityByState))
      .catch((err) => console.log("error", err));
    mainBranchInfoSetValue("city", "");
  };
  const onChangeCity = async (data) => {
    await getAreaByCityLists(data)
      .then((res) => setGetAreaData(res?.data?.areaByCity))
      .catch((err) => console.log("error", err));
    mainBranchInfoSetValue("pin_code", "");
  };
  const onChangePinCode = (data) => {
    console.log("pincode", data);
  };

  useEffect(() => {
    const getCityList = async () => {
      await getCityByStateLists(mainBranch?.branch_state)
        .then((res) => setGetCityData(res?.data?.cityByState))
        .catch((err) => console.log("error", err));
    };
    if (mainBranch?.branch_state) {
      mainBranchInfoSetValue("state", mainBranch?.branch_state);
      getCityList();
    }
  }, [mainBranch, mainBranchInfoSetValue]);

  useEffect(() => {
    const getAreaList = async () => {
      await getAreaByCityLists(mainBranch?.branch_city)
        .then((res) => setGetAreaData(res?.data?.areaByCity))
        .catch((err) => console.log("error", err));
    };
    if (mainBranch?.branch_city) {
      getAreaList();
    }
  }, [mainBranch]);

  useEffect(() => {
    getApiState();
  }, []);

  const emptyImageStates = () => {
    setShopLogo("");
    setUploadShopLogo("");
    setShopBackground("");
    setUploadShopBackground("");
    setShopImages([]);
    setShopImageWasabiUrl([]);
    setEditableShopImages([]);
    setDeleteShopImages([]);
    setShopEditImg("");
    setDeleteShopLogo("");
    setDeleteShopBackground("");
    setDeleteShopVideo("");
    setShopVideo("");
    setUploadShopVideo("");
  };

  useEffect(() => {
    emptyImageStates();
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleShopTimeDetails = (option) => {
    setShopTimeDetails(option);
  };

  const handleManagerDetails = (option) => {
    setManagerDetails(option);
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (id && vendorShopDetails?.id) {
      if (id !== vendorShopDetails?.id) {
        router.push("/vendor/dashboard");
      }
    }
  }, [id, router, vendorShopDetails?.id]);

  useEffect(() => {
    ownerInfoReset();
    mainBranchInfoReset();
  }, [mainBranchInfoReset, ownerInfoReset, value]);

  const onShopLogoPreviewImage = (e) => {
    setUploadShopLogo(e.target.files[0]);
    setShopLogo(URL.createObjectURL(e.target.files[0]));
    setDeleteShopLogo("");
  };

  const onShopBackgroundPreviewImage = (e) => {
    setUploadShopBackground(e.target.files[0]);
    setShopBackground(URL.createObjectURL(e.target.files[0]));
    setDeleteShopBackground("");
  };

  function fillArrayWithEmptyValues(arr, targetLength) {
    while (arr.length < targetLength) {
      arr.push({ links: `none${arr.length}` });
    }
    return arr;
  }

  const updateShopImagesChange = (e) => {
    const files = Array.from(e.target.files);

    let deleteShopImagesData = deleteShopImages;

    deleteShopImagesData[ShopEditImg] = undefined;
    setDeleteShopImages(() => [...deleteShopImagesData]);

    let shopImagesData = shopImages;
    let editableShopImagesData = editableShopImages;

    editableShopImagesData[ShopEditImg] = {
      oldLink: shopImagesWasabiUrl[ShopEditImg]?.links,
      newData: files[0],
    };

    setEditableShopImages(() => [...editableShopImagesData]);

    files.forEach((file) => {
      shopImagesData[ShopEditImg] = { links: URL.createObjectURL(file) };
      setShopImages(() => [...shopImagesData]);
    });
  };

  const onShopVideoPreview = (e) => {
    setUploadShopVideo(e.target.files[0]);
    setShopVideo(URL.createObjectURL(e.target.files[0]));
    setDeleteShopVideo("");
  };

  const updateVendorShopDetailStore = () => {
    dispatch(loadVendorShopDetailsStart(userProfile?.userCreatedShopId));
  };

  useEffect(() => {
    if (vendorShopDetails?.shop_type === "shop") {
      setIndividual(false);
    } else {
      setIndividual(true);
    }
  }, [vendorShopDetails]);

  useEffect(() => {
    if (vendorShopDetails && value === 2 && mainBranch) {
      if (sameAsOwner === "True") {
        mainBranchInfoSetValue(
          "manager_first_name",
          vendorShopDetails?.ownerInfo?.owner_firstName
        );
        mainBranchInfoSetValue(
          "manager_last_name",
          vendorShopDetails?.ownerInfo?.owner_lastName
        );
        mainBranchInfoSetValue(
          "manager_user_email",
          vendorShopDetails?.ownerInfo?.owner_email
        );
        mainBranchInfoSetValue(
          "manager_user_contact",
          vendorShopDetails?.ownerInfo?.owner_contact
        );
      } else {
        mainBranchInfoSetValue("address", mainBranch?.branch_address);
        mainBranchInfoSetValue("pin_code", mainBranch?.branch_pinCode);

        mainBranchInfoSetValue(
          "manager_first_name",
          mainBranch?.manager_name.split(" ")[0]
        );
        mainBranchInfoSetValue(
          "manager_last_name",
          mainBranch?.manager_name.split(" ")[1]
        );
        mainBranchInfoSetValue(
          "manager_user_contact",
          mainBranch?.manager_contact
        );
        mainBranchInfoSetValue("city", mainBranch?.branch_city);
        mainBranchInfoSetValue("manager_user_email", mainBranch?.manager_email);
      }
    }
  }, [
    mainBranch,
    mainBranchInfoSetValue,
    sameAsOwner,
    value,
    vendorShopDetails,
  ]);

  useEffect(() => {
    if (vendorShopDetails && value === 0) {
      ownerInfoSetValue(
        "first_name",
        vendorShopDetails?.ownerInfo?.owner_firstName
      );
      ownerInfoSetValue(
        "last_name",
        vendorShopDetails?.ownerInfo?.owner_lastName
      );
      ownerInfoSetValue(
        "user_email",
        vendorShopDetails?.ownerInfo?.owner_email
      );
      ownerInfoSetValue(
        "user_contact",
        vendorShopDetails?.ownerInfo?.owner_contact
      );
    }
    if (vendorShopDetails && value === 1) {
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
    }

    if (vendorShopDetails && value === 2) {
      const mainBranches = vendorShopDetails?.branch_info?.find(
        (itm) => itm.branch_type === "main"
      );
      setMainBranch(mainBranches);

      const subBranches = vendorShopDetails?.branch_info?.filter(
        (itm) => itm.branch_type === "sub"
      );
      setSubBranchList(subBranches);

      if (mainBranches?.same_as === "owner") {
        setSameAsOwner("True");
      } else {
        setSameAsOwner("False");
      }
      console.log("mainBranches", mainBranches);
      mainBranchInfoSetValue("address", mainBranches?.branch_address);
      mainBranchInfoSetValue("state", mainBranches?.branch_state);
      mainBranchInfoSetValue("pin_code", mainBranches?.branch_pinCode);
      mainBranchInfoSetValue("city", mainBranches?.branch_city);
    }

    if (vendorShopDetails && !individual && value === 3) {
      const subBranches = vendorShopDetails?.branch_info?.filter(
        (itm) => itm.branch_type === "sub"
      );
      setSubBranchList(subBranches);
    }

    if (vendorShopDetails && individual ? value === 3 : value === 4) {
      vendorShopDetails?.shop_logo && setShopLogo(vendorShopDetails?.shop_logo);

      vendorShopDetails?.shop_cover_image &&
        setShopBackground(vendorShopDetails?.shop_cover_image);

      vendorShopDetails?.shop_images &&
        setShopImageWasabiUrl([...vendorShopDetails?.shop_images]);
      vendorShopDetails?.shop_images &&
        setShopImages([...vendorShopDetails?.shop_images]);

      vendorShopDetails?.shop_video &&
        setShopVideo(vendorShopDetails?.shop_video);
    }
  }, [
    hours,
    individual,
    mainBranchInfoSetValue,
    ownerInfoSetValue,
    shopInfoSetValue,
    value,
    vendorShopDetails,
  ]);

  useEffect(() => {
    setAddEditSubBranchShow(false);
  }, [value]);

  const ownerInfoOnSubmit = (data) => {
    setOwnerLoading(true);
    shopUpdate({
      ownerInfo: {
        id: vendorShopDetails?.ownerInfo?.id,
        owner_firstName: data.first_name,
        owner_lastName: data.last_name,
        owner_email: data.user_email,
        owner_contact: data.user_contact,
        user_id: userProfile?.userCreatedShopId,
      },
    }).then(
      (res) => {
        toast.success(res.data.updateShop.message, {
          theme: "colored",
        });

        setOwnerLoading(false);
        updateVendorShopDetailStore();
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
    setShopLoading(true);
    shopUpdate({
      shopInfo: {
        id: userProfile?.userCreatedShopId,
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
        toast.success(res.data.updateShop.message, {
          theme: "colored",
        });
        setShopLoading(false);
        updateVendorShopDetailStore();
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
    setMainBranchLoading(true);
    shopUpdate({
      branchInfo: [
        {
          id: mainBranch.id,
          branch_address: data.address,
          branch_pinCode: data.pin_code,
          branch_city: data.city,
          branch_state: data.state,
          same_as: sameAsOwner === "True" ? "owner" : "none",
          manager_name: data.manager_first_name + " " + data.manager_last_name,
          manager_contact: data.manager_user_contact,
          manager_email: data.manager_user_email,
          branch_type: mainBranch.branch_type,
        },
      ],
    }).then(
      (res) => {
        toast.success(res.data.updateShop.message, {
          theme: "colored",
        });
        setMainBranchLoading(false);
        updateVendorShopDetailStore();
      },
      (error) => {
        setMainBranchLoading(false);
        toast.error(error.message, { theme: "colored" });
      }
    );
  };
  const mainBranchInfoOError = (errors) =>
    console.log("Errors Occurred !! :", errors);

  const deleteImageFiles = async (deletableProducts, type) => {
    try {
      const deletionPromises = deletableProducts.map((deleteProduct) =>
        fileDelete(deleteProduct, type)
      );
      await Promise.all(deletionPromises);
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  };

  const shopLayoutOnSubmit = async (data) => {
    setShopLayoutLoading(true);

    let logoResponse = "";
    let backgroundResponse = "";
    let imagesResponse = [];
    let videoResponse = null;

    if (deleteShopLogo) {
      await deleteImageFiles([deleteShopLogo], "image");
    }

    if (deleteShopBackground) {
      await deleteImageFiles([deleteShopBackground], "image");
    }

    if (deleteShopImages?.filter((itm) => itm !== undefined).length > 0) {
      await deleteImageFiles(
        deleteShopImages?.filter((itm) => itm !== undefined),
        "image"
      );
    }

    if (deleteShopVideo) {
      await deleteImageFiles([deleteShopVideo], "video");
    }

    if (uploadShopLogo) {
      if (vendorShopDetails?.shop_logo) {
        try {
          const shopLogoRes = await fileUpdate(
            vendorShopDetails?.shop_logo,
            "image",
            uploadShopLogo
          );
          logoResponse = shopLogoRes;
        } catch (error) {
          console.error("Error during file upload:", error);
          return;
        }
      } else {
        try {
          const shopLogoRes = await fileUpload(uploadShopLogo);
          logoResponse = shopLogoRes;
        } catch (error) {
          console.error("Error during file upload:", error);
          return;
        }
      }
    }

    if (uploadShopBackground) {
      if (vendorShopDetails?.shop_cover_image) {
        try {
          const shopCoverRes = await fileUpdate(
            vendorShopDetails?.shop_cover_image,
            "image",
            uploadShopBackground
          );
          backgroundResponse = shopCoverRes;
        } catch (error) {
          console.error("Error during file upload:", error);
          return;
        }
      } else {
        try {
          const shopCoverRes = await fileUpload(uploadShopBackground);
          backgroundResponse = shopCoverRes;
        } catch (error) {
          console.error("Error during file upload:", error);
          return;
        }
      }
    }

    if (editableShopImages?.length > 0) {
      const uploadPromises = editableShopImages
        ?.filter((itm) => itm !== undefined)
        ?.map((shopImage) => {
          if (shopImage?.oldLink) {
            return fileUpdate(shopImage?.oldLink, "image", shopImage?.newData);
          } else {
            return fileUpload(shopImage?.newData);
          }
        });

      try {
        const updateShopImgs = await Promise.all(uploadPromises);
        imagesResponse = updateShopImgs;
      } catch (error) {
        console.error("Error during file upload:", error);
        return;
      }
    }

    if (uploadShopVideo) {
      if (vendorShopDetails?.shop_video) {
        try {
          const shopVideoRes = await fileUpdate(
            vendorShopDetails?.shop_video,
            "video",
            uploadShopVideo
          );
          videoResponse = shopVideoRes;
        } catch (error) {
          console.error("Error during file upload:", error);
          return;
        }
      } else {
        try {
          const shopVideoRes = await fileUpload(uploadShopVideo);
          videoResponse = shopVideoRes;
        } catch (error) {
          console.error("Error during file upload:", error);
          return;
        }
      }
    }

    const existingLinks = shopImagesWasabiUrl.map((item) => item.links);

    const filteredImageResponse = imagesResponse.filter(
      (item) => !existingLinks.includes(item)
    );

    let combinedLinks = [
      ...shopImagesWasabiUrl,
      ...filteredImageResponse.map((links) => ({ links })),
    ];

    if (deleteShopImages?.filter((itm) => itm !== undefined).length > 0) {
      combinedLinks = combinedLinks.filter((linkObj) => {
        return !deleteShopImages
          ?.filter((itm) => itm !== undefined)
          .includes(linkObj.links);
      });
    }

    await shopUpdate({
      shopLayout: {
        id: userProfile?.userCreatedShopId,
        shop_logo:
          logoResponse || (deleteShopLogo ? "" : vendorShopDetails?.shop_logo),
        shop_cover_image:
          backgroundResponse ||
          (deleteShopBackground ? "" : vendorShopDetails?.shop_cover_image),
        shop_images: combinedLinks?.map((item) => ({
          links: item.links,
        })),
        shop_video:
          videoResponse ||
          (deleteShopVideo ? "" : vendorShopDetails?.shop_video),
      },
    }).then(
      (res) => {
        toast.success(res.data.updateShop.message, {
          theme: "colored",
        });
        emptyImageStates();
        setShopLayoutLoading(false);
        updateVendorShopDetailStore();
      },
      (error) => {
        setShopLayoutLoading(false);
        toast.error(error.message, { theme: "colored" });
      }
    );
  };

  const shopLayoutOnError = (errors) =>
    console.log("Errors Occurred !! :", errors);

  const TabList = ["Owner Details", "Shop Info", "Main Branch", "Shop Layout"];

  if (!individual) TabList.splice(3, 0, "Sub Branch");

  if (!isHydrated) {
    return null;
  }
  return (
    <>
      <div className="">
        <div className="">
          <div className="">
            <Box className="bg-colorPrimary rounded-md">
              <CustomVenderShopTab
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                variant="scrollable"
                scrollButtons="auto"
              >
                {TabList.map((item, index) => (
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
              <div className="flex flex-col space-y-6">
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
                  <Box className="flex w-full sm:justify-end justify-center">
                    <button
                      type="submit"
                      onClick={ownerInfoHandleSubmit(
                        ownerInfoOnSubmit,
                        ownerInfoOError
                      )}
                      className="sm:py-2 sm:px-4 bg-colorGreen sm:rounded-md text-white sm:text-xl rounded-[4px] text-sm px-8 py-2 flex items-center"
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
              <div className="space-y-6">
                <div className="w-full relative">
                  <CustomTextFieldVendor
                    label="Shop Name"
                    type="text"
                    id="shopName"
                    isRequired={false}
                    placeholder="Your shop name"
                    fieldError={shopInfoErrors?.shop_name}
                    fieldValue={shopInfoGetValue("shop_name")}
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
                          ...shopInfoRegister("personal_website", {}),
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
                            ...shopInfoRegister("facebook_link", {}),
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
                            ...shopInfoRegister("instagram_link", {}),
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
                    className={`space-y-6 ${
                      shopTimeDetails === "Hide" && "hidden"
                    }`}
                  >
                    <div className="w-full grid sm:grid-cols-2 gap-y-8 gap-4 grid-cols-1">
                      {hours.map((day, index) => (
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
              <div className="flex items-center justify-center">
                <Box className="flex w-full sm:justify-end justify-center mb-6">
                  <button
                    type="submit"
                    onClick={shopInfoHandleSubmit(
                      shopInfoOnSubmit,
                      shopInfoOError
                    )}
                    className="sm:py-2 sm:px-4 bg-colorGreen sm:rounded-md text-white sm:text-xl rounded-[4px] text-sm px-8 py-2 flex items-center"
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
                ShopEdit="true"
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
              <div className="space-y-6">
                <div className="w-full relative">
                  <CustomTextFieldVendor
                    label="Address"
                    type="text"
                    id="address"
                    isRequired={false}
                    placeholder="Your address"
                    fieldValue={mainBranchInfoGetValue("address")}
                    fieldError={mainBranchInfoErrors?.address}
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
                <div className="w-full relative">
                  <CustomAutoCompleteTextField
                    name="state"
                    label="State"
                    type="text"
                    id="state"
                    isRequired={false}
                    placeholder="Your state"
                    control={mainBranchInfoControl}
                    rules={{ required: "State is required" }}
                    arrayListItem={stateDataLists}
                    onChangeValue={onChangeState}
                    stateField={true}
                  />
                  <div className="mt-2">
                    {mainBranchInfoErrors.state && (
                      <span style={{ color: "red" }} className="-mb-6">
                        {mainBranchInfoErrors.state?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full flex sm:flex-row sm:gap-4 flex-col gap-2">
                  {getCityData?.length > 0 && (
                    <div className="sm:w-1/2 relative w-full">
                      <CustomAutoCompleteTextField
                        name="city"
                        label="City"
                        type="text"
                        id="city"
                        isRequired={false}
                        placeholder="Your city"
                        control={mainBranchInfoControl}
                        rules={{ required: "City is required" }}
                        arrayListItem={getCityData}
                        onChangeValue={onChangeCity}
                        cityField={true}
                      />
                      <div className="mt-2">
                        {mainBranchInfoErrors.city && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {mainBranchInfoErrors.city?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {getAreaData?.length > 0 && (
                    <div className="sm:w-1/2 relative w-full">
                      <CustomAutoCompleteTextField
                        name="pin_code"
                        label="Pincode"
                        type="text"
                        id="pincode"
                        isRequired={false}
                        placeholder="Your pincode"
                        rules={{ required: "PinCode is required" }}
                        pinCodeField={true}
                        arrayListItem={getAreaData}
                        control={mainBranchInfoControl}
                        onChangeValue={onChangePinCode}
                      />
                      <div className="mt-2">
                        {mainBranchInfoErrors.pin_code && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {mainBranchInfoErrors.pin_code?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
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
                <div className="font-semibold sm:text-lg text-sm uppercase">
                  Manager Details
                </div>
              </div>
              <div
                className={`space-y-6 ${managerDetails === "Hide" && "hidden"}`}
              >
                <div className="flex items-center">
                  <span className="uppercase sm:text-lg text-sm font-semibold">
                    Same As Owner:
                  </span>
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
                </div>

                <div className="w-full flex sm:flex-row sm:gap-4 flex-col gap-8">
                  <div className="sm:w-1/2 relative w-full">
                    <CustomTextFieldVendor
                      label=" First Name"
                      type="text"
                      id="managerfName"
                      isRequired={false}
                      placeholder="Manager first name"
                      disabled={sameAsOwner === "True"}
                      fieldError={mainBranchInfoErrors?.manager_first_name}
                      fieldValue={mainBranchInfoGetValue("manager_first_name")}
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
                      fieldError={mainBranchInfoErrors?.manager_last_name}
                      fieldValue={mainBranchInfoGetValue("manager_last_name")}
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
                    fieldError={mainBranchInfoErrors?.manager_user_email}
                    fieldValue={mainBranchInfoGetValue("manager_user_email")}
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
                    fieldError={mainBranchInfoErrors?.manager_user_contact}
                    fieldValue={mainBranchInfoGetValue("manager_user_contact")}
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
                <Box className="flex w-full sm:justify-end justify-center mt-4 mb-6">
                  <button
                    type="submit"
                    onClick={mainBranchInfoHandleSubmit(
                      mainBranchInfoOnSubmit,
                      mainBranchInfoOError
                    )}
                    className="sm:py-2 sm:px-4 bg-colorGreen sm:rounded-md text-white sm:text-xl rounded-[4px] text-sm px-8 py-2 flex items-center"
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

          {!individual && (
            <TabPanel value={value} index={3}>
              {!addEditSubBranchShow && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setAddEditSubBranchShow(true)}
                    className="flex items-center text-lg py-1 px-2 rounded-md border-2 bg-colorGreen text-white border-colorGreen"
                  >
                    <span className="hidden sm:inline">
                      <AddIcon fontSize="medium" className="mr-1 -mt-1" />
                    </span>
                    <span className="sm:hidden">
                      <AddIcon fontSize="small" className="mr-1 -mt-1" />
                    </span>
                    Sub Branch
                  </button>
                </div>
              )}

              {addEditSubBranchShow ? (
                <AddEditSubBranch
                  setAddEditSubBranchShow={setAddEditSubBranchShow}
                  updateVendorShopDetailStore={updateVendorShopDetailStore}
                  ShopId={userProfile?.userCreatedShopId}
                  editableBranchData={editableBranchData}
                  setEditableBranchData={setEditableBranchData}
                />
              ) : (
                <>
                  <div className="mt-4">
                    <VendorBranchTable
                      subBranchList={subBranchList}
                      updateVendorShopDetailStore={updateVendorShopDetailStore}
                      setAddEditSubBranchShow={setAddEditSubBranchShow}
                      setEditableBranchData={setEditableBranchData}
                      setBranchDeleteModalOpen={setBranchDeleteModalOpen}
                      setDeleteBranchId={setDeleteBranchId}
                    />
                  </div>
                </>
              )}
            </TabPanel>
          )}

          <TabPanel value={value} index={individual ? 3 : 4}>
            <div className="container rounded-lg mt-10">
              <div className="grid grid-cols-3 gap-6 sm:gap-10 my-10">
                <div className="col-span-3 lg:flex justify-center gap-10 items-start">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-base sm:text-xl font-semibold mb-3 mx-2 text-black">
                      Shop Logo
                      <span className="text-[#31333e66] ml-1">(Optional)</span>
                    </div>
                    <div className="relative w-[150px] sm:w-[200px] h-[150px] sm:h-[200px]  border border-gray-200 cursor-pointer rounded-full flex items-center justify-center">
                      {shopLogo !== "" ? (
                        shopLogo ? (
                          <>
                            <span className="absolute right-4 sm:bottom-2 bottom-0 border border-black rounded-full lg:p-2 px-2 py-1 bg-black text-white z-[9999]">
                              <EditIcon
                                sx={{
                                  "@media (max-width: 768px)": {
                                    fontSize: 16,
                                  },
                                }}
                                onClick={() =>
                                  document.getElementById("shopLogo").click()
                                }
                              />
                            </span>
                            <span
                              onClick={() => {
                                setShopLogo("");
                                setUploadShopLogo("");
                                setDeleteShopLogo(vendorShopDetails?.shop_logo);
                              }}
                              className="absolute left-4 sm:bottom-2 bottom-0 border border-red-600 rounded-full p-2 bg-red-600 text-white z-[9999]"
                            >
                              <DeleteIcon
                                sx={{
                                  "@media (max-width: 768px)": {
                                    fontSize: 16,
                                  },
                                }}
                              />
                            </span>
                            <div className="w-full h-full">
                              <Image
                                src={shopLogo}
                                alt="Uploaded Image"
                                className="!object-cover !h-full !w-full !rounded-full !object-center"
                                layout="fill"
                                unoptimized={true}
                              />
                            </div>
                          </>
                        ) : (
                          <ImageLoadingSkeleton
                            className="rounded-full"
                            variant="circular"
                          />
                        )
                      ) : (
                        <div
                          className="flex flex-col gap-4"
                          onClick={() =>
                            document.getElementById("shopLogo").click()
                          }
                        >
                          <span className="flex justify-center">
                            <TbPhotoPlus className="w-14 h-14 text-gray-400 hover:text-colorGreen" />
                          </span>
                          <div className="flex flex-col gap-1">
                            <p className="sm:text-lg text-sm font-bold text-gray-400">
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
                          onChange: (e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              onShopLogoPreviewImage(e);
                            }
                          },
                        })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col mt-6 sm:mt-6 lg:mt-0 items-center justify-center">
                    <div className="text-base sm:text-xl font-semibold mb-3 text-black">
                      Shop Cover Image
                      <span className="text-[#31333e66] ml-1">(Optional)</span>
                    </div>
                    <div className="w-full cursor-pointer relative h-[200px] sm:h-[300px] col-span-3 border border-gray-200 rounded-xl flex items-center justify-center">
                      {shopBackground !== "" ? (
                        shopBackground ? (
                          <>
                            <span className="absolute right-4 top-4 border border-black rounded-full lg:p-2 px-2 py-1 bg-black text-white z-[9999]">
                              <EditIcon
                                sx={{
                                  "@media (max-width: 768px)": {
                                    fontSize: 16,
                                  },
                                }}
                                onClick={() =>
                                  document
                                    .getElementById("shopBackground")
                                    .click()
                                }
                              />
                            </span>
                            <span
                              onClick={() => {
                                setShopBackground("");
                                setUploadShopBackground("");
                                setDeleteShopBackground(
                                  vendorShopDetails?.shop_cover_image
                                );
                              }}
                              className="absolute right-4 top-[70px] border border-red-600 rounded-full p-2 bg-red-600 text-white z-[9999]"
                            >
                              <DeleteIcon
                                sx={{
                                  "@media (max-width: 768px)": {
                                    fontSize: 16,
                                  },
                                }}
                              />{" "}
                            </span>
                            <div className="w-full h-full">
                              <Image
                                src={shopBackground}
                                alt="Uploaded Image"
                                className="!object-cover !h-full !w-full !rounded-xl !object-top"
                                layout="fill"
                                unoptimized={true}
                              />
                            </div>
                          </>
                        ) : (
                          <ImageLoadingSkeleton className="rounded-3xl" />
                        )
                      ) : (
                        <div
                          className="flex flex-col gap-4"
                          onClick={() =>
                            document.getElementById("shopBackground").click()
                          }
                        >
                          <span className="flex justify-center">
                            <TbPhotoPlus className="w-14 h-14 text-gray-400 hover:text-colorGreen" />
                          </span>
                          <div className="flex flex-col gap-1">
                            <p className="sm:text-lg text-sm font-bold text-colorGreen">
                              <span className="text-gray-400">
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
                          onChange: (e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              onShopBackgroundPreviewImage(e);
                            }
                          },
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-3">
                  <div className="text-base sm:text-xl font-semibold mb-3 text-black flex justify-center">
                    Shop Images
                    <span className="text-[#31333e66] ml-1">
                      <span className="text-[#31333e66] ml-1">(Optional)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-6">
                    {shopImages &&
                    fillArrayWithEmptyValues([...shopImages], 3)?.length > 0
                      ? fillArrayWithEmptyValues([...shopImages], 3)?.map(
                          (image, index) => {
                            return (
                              <div
                                key={index}
                                className={`${
                                  index === 0
                                    ? "col-start-2 lg:col-start-3"
                                    : "col-start-2"
                                } col-span-10 sm:col-span-6 md:col-span-6 lg:col-span-3 w-full cursor-pointer relative h-[300px] sm:h-[300px] border border-gray-200 rounded-xl flex items-center justify-center`}
                              >
                                {shopImages[index] ? (
                                  <>
                                    <span className="absolute right-4 top-4 border border-black rounded-full lg:p-2 px-2 py-1 bg-black text-white z-[9999]">
                                      <EditIcon
                                        sx={{
                                          "@media (max-width: 768px)": {
                                            fontSize: 16,
                                          },
                                        }}
                                        onClick={() => (
                                          setShopEditImg(index),
                                          document
                                            .getElementById("shopEditId")
                                            .click()
                                        )}
                                      />
                                    </span>

                                    <span
                                      onClick={() => {
                                        setShopImages(
                                          shopImages?.filter(
                                            (itm, idx) => idx !== index
                                          )
                                        );

                                        setEditableShopImages(
                                          editableShopImages.filter(
                                            (itm, idx) => idx !== index
                                          )
                                        );

                                        let deleteShopImagesData =
                                          deleteShopImages;

                                        deleteShopImagesData[index] =
                                          shopImagesWasabiUrl[index]?.links;
                                        setDeleteShopImages(() => [
                                          ...deleteShopImagesData,
                                        ]);

                                        let shopImagesData = shopImages;
                                        shopImagesData[index] = undefined;
                                        setShopImages(() => [
                                          ...shopImagesData,
                                        ]);
                                      }}
                                      className="absolute right-4 top-[70px] border border-red-600 rounded-full p-2 bg-red-600 text-white z-[99999]"
                                    >
                                      <DeleteIcon
                                        sx={{
                                          "@media (max-width: 768px)": {
                                            fontSize: 16,
                                          },
                                        }}
                                      />
                                    </span>

                                    <div className="w-full relative h-full">
                                      <Image
                                        src={image?.links}
                                        alt="Uploaded Image"
                                        className="!object-cover !h-full !w-full !rounded-xl !object-top"
                                        layout="fill"
                                        unoptimized={true}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <div
                                    className={`${
                                      index === 0 ? "col-start-3" : ""
                                    } col-span-3`}
                                    onClick={() => (
                                      setShopEditImg(index),
                                      document
                                        .getElementById("shopEditId")
                                        .click()
                                    )}
                                  >
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
                                    onChange: (e) => {
                                      updateShopImagesChange(e);
                                    },
                                  })}
                                />
                              </div>
                            );
                          }
                        )
                      : [0, 1, 2].map((itm, index) => (
                          <div
                            key={itm}
                            className={`${
                              index === 0
                                ? "col-start-2 lg:col-start-3"
                                : "col-start-2"
                            } col-span-10   flex h-[300px] sm:h-[300px] items-center justify-center lg:col-span-3  md:col-span-6 relative  sm:col-span-6  w-full`}
                          >
                            <ImageLoadingSkeleton className="rounded-3xl" />
                          </div>
                        ))}
                  </div>
                </div>
                <div className="w-full col-span-3">
                  <div className="text-base sm:text-xl font-semibold mb-3 text-black flex justify-center">
                    Shop Video
                    <span className="text-[#31333e66] ml-1">(Optional)</span>
                  </div>
                  <div
                    className="sm:w-2/3 w-full sm:mx-auto cursor-pointer h-[250px] sm:h-[300px] border border-gray-200 rounded-xl flex items-center justify-center"
                    onClick={() => {
                      shopVideo == "" &&
                        document.getElementById("shopVideoId").click();
                    }}
                  >
                    {shopVideo !== "" ? (
                      <div className="w-full h-full relative">
                        {shopVideo ? (
                          <>
                            <video
                              autoPlay
                              className="object-cover h-full w-full rounded-xl"
                              controls
                              src={shopVideo}
                            ></video>

                            <span className="absolute right-4 top-4 border border-black rounded-full lg:p-2 px-2 py-1 bg-black text-white z-[9999]">
                              <EditIcon
                                onClick={() => {
                                  document
                                    .getElementById("shopVideoId")
                                    .click();
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
                                setDeleteShopVideo(
                                  vendorShopDetails?.shop_video
                                );
                              }}
                              sx={{
                                "@media (max-width: 768px)": {
                                  fontSize: 16,
                                },
                              }}
                              className="absolute right-4 top-[70px] border border-red-600 rounded-full p-2 bg-red-600 text-white z-[9999]"
                            >
                              <DeleteIcon />
                            </span>
                          </>
                        ) : (
                          <ImageLoadingSkeleton className="rounded-3xl" />
                        )}
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
                            Size Limited
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
                <Box className="flex w-full sm:justify-end justify-center mb-6">
                  <button
                    type="submit"
                    onClick={shopLayoutHandleSubmit(
                      shopLayoutOnSubmit,
                      shopLayoutOnError
                    )}
                    className="sm:py-2 sm:px-4 bg-colorGreen sm:rounded-md text-white sm:text-xl rounded-[4px] text-sm px-8 py-2 flex items-center"
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

      <ConfirmationModal
        type="branch"
        deleteModalOpen={branchDeleteModalOpen}
        setDeleteModalOpen={setBranchDeleteModalOpen}
        deleteId={deleteBranchId}
        onClickItemDelete={() => {
          deleteBranch({ id: deleteBranchId }).then(
            (res) => {
              toast.success(res.data.deleteBranch, {
                theme: "colored",
              });
              updateVendorShopDetailStore();
            },
            (error) => {
              toast.error(error.message, { theme: "colored" });
            }
          );
          setBranchDeleteModalOpen(false);
        }}
      />
    </>
  );
};

export default withAuth(ShopEdit);

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

const AddEditSubBranch = ({
  setAddEditSubBranchShow,
  updateVendorShopDetailStore,
  ShopId,
  editableBranchData,
  setEditableBranchData,
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

  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const getCityList = async () => {
      await getCityByStateLists(editableBranchData?.branch_state)
        .then((res) => setGetCityData(res?.data?.cityByState))
        .catch((err) => console.log("error", err));
    };
    if (editableBranchData?.branch_state) {
      setSubManagerState(editableBranchData?.branch_state);
      getCityList();
    }
  }, [editableBranchData]);

  useEffect(() => {
    const getAreaList = async () => {
      await getAreaByCityLists(editableBranchData?.branch_city)
        .then((res) => setGetAreaData(res?.data?.areaByCity))
        .catch((err) => console.log("error", err));
    };
    if (editableBranchData?.branch_city) {
      getAreaList();
    }
  }, [editableBranchData]);

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

  const [error, setError] = useState({
    subManagerAddressError: "",
    subManagerStateError: "",
    subManagerCityError: "",
    subManagerPinCodeError: "",
    subManagerFirstNameError: "",
    subManagerLastNameError: "",
    subManagerEmailError: "",
    subManagerPhoneError: "",
  });

  const mainBranches = vendorShopDetails?.branch_info?.find(
    (itm) => itm.branch_type === "main"
  );

  useEffect(() => {
    if (managerValue === "Same as owner") {
      setSubManagerFirstName(vendorShopDetails?.ownerInfo?.owner_firstName);
      setSubManagerLastName(vendorShopDetails?.ownerInfo?.owner_lastName);
      setSubManagerEmail(vendorShopDetails?.ownerInfo?.owner_email);
      setSubManagerPhone(vendorShopDetails?.ownerInfo?.owner_contact);
      error.subManagerFirstNameError = "";
      error.subManagerLastNameError = "";
      error.subManagerEmailError = "";
      error.subManagerPhoneError = "";
    } else if (managerValue === "same as main branch manager") {
      setSubManagerFirstName(mainBranches?.manager_name.split(" ")[0]);
      setSubManagerLastName(mainBranches?.manager_name.split(" ")[1]);
      setSubManagerEmail(mainBranches?.manager_email);
      setSubManagerPhone(mainBranches?.manager_contact);
      error.subManagerFirstNameError = "";
      error.subManagerLastNameError = "";
      error.subManagerEmailError = "";
      error.subManagerPhoneError = "";
    } else {
      if (editableBranchData) {
        setSubManagerFirstName(editableBranchData?.manager_name.split(" ")[0]);
        setSubManagerLastName(editableBranchData?.manager_name.split(" ")[1]);
        setSubManagerEmail(editableBranchData?.manager_email);
        setSubManagerPhone(editableBranchData?.manager_contact);
      } else {
        setSubManagerFirstName("");
        setSubManagerLastName("");
        setSubManagerEmail("");
        setSubManagerPhone("");
      }
    }
  }, [
    editableBranchData,
    error,
    mainBranches,
    managerValue,
    vendorShopDetails,
  ]);

  useEffect(() => {
    if (editableBranchData) {
      setSubManagerAddress(editableBranchData.branch_address);
      setSubManagerCity(editableBranchData.branch_city);
      setSubManagerState(editableBranchData?.branch_state);
      setSubManagerPinCode(editableBranchData.branch_pinCode);
      setManagerValue(
        (editableBranchData?.same_as === "owner" && "Same as owner") ||
          (editableBranchData?.same_as === "main_branch_manager" &&
            "same as main branch manager") ||
          ""
      );
    }
  }, [editableBranchData]);

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
      !subManagerState ||
      !subManagerFirstName ||
      !subManagerLastName ||
      !subManagerEmail ||
      !subManagerPhone
    ) {
      setError(allError);
    } else {
      setLoading(true);
      if (editableBranchData) {
        updateBranch({
          id: editableBranchData?.id,
          branchInfo: {
            branch_address: subManagerAddress,
            branch_city: subManagerCity,
            branch_state: subManagerState,
            branch_pinCode: subManagerPinCode,
            same_as:
              (managerValue === "Same as owner" && "owner") ||
              (managerValue === "same as main branch manager" &&
                "main_branch_manager") ||
              "none",
            manager_name: subManagerFirstName + " " + subManagerLastName,
            manager_contact: subManagerPhone,
            manager_email: subManagerEmail,
            branch_type: "sub",
            shop_id: ShopId,
          },
        }).then(
          (res) => {
            toast.success(res.data.updateBranch.message, {
              theme: "colored",
            });
            setLoading(false);
            updateVendorShopDetailStore();
            handleSubBranchSectionClose();
          },
          (error) => {
            toast.error(error.message, { theme: "colored" });
            setLoading(false);
          }
        );
      } else {
        createBranch({
          branchInfo: {
            branch_address: subManagerAddress,
            branch_city: subManagerCity,
            branch_pinCode: subManagerPinCode,
            same_as:
              (managerValue === "Same as owner" && "owner") ||
              (managerValue === "same as main branch manager" &&
                "main_branch_manager") ||
              "none",
            manager_name: subManagerFirstName + " " + subManagerLastName,
            manager_contact: subManagerPhone,
            manager_email: subManagerEmail,
            branch_type: "sub",
            shop_id: ShopId,
          },
        }).then(
          (res) => {
            toast.success(res.data.createBranch.message, {
              theme: "colored",
            });
            updateVendorShopDetailStore();
            handleSubBranchSectionClose();
            setLoading(false);
          },
          (error) => {
            toast.error(error.message, { theme: "colored" });
            setLoading(false);
          }
        );
      }
    }
  };

  const handleSubBranchSectionClose = () => {
    setAddEditSubBranchShow(false);
    setSubManagerAddress("");
    setSubManagerCity("");
    setSubManagerState("");
    setSubManagerPinCode("");
    setSubManagerFirstName("");
    setSubManagerLastName("");
    setSubManagerEmail("");
    setManagerValue("");
    setSubManagerPhone("");
    setEditableBranchData();
    setLoading(false);
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
    error.subManagerStateError = "";
    error.subManagerPinCodeError = "";
  };

  return (
    <Box className="!w-[100%]">
      <div className="pt-5">
        <div className="flex items-center">
          <ArrowBackIcon
            className="!text-black !cursor-pointer"
            onClick={handleSubBranchSectionClose}
          />
          <p className="flex items-center text-colorBlack text-xl font-semibold ml-2">
            {editableBranchData ? "Update" : "Add"} Sub Branch
          </p>
        </div>

        <div className="mt-6">
          <div className="sm:ml-8 rounded-lg">
            <form>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-center">
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
                <div className="flex items-center justify-center">
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
                      {error.subManagerAddressError || ""}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row mt-2 gap-2 sm:gap-4 w-full justify-between items-center">
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
                          label="Pincode"
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
                      label="Select Manager"
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
                    </CustomTextFieldVendor>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4 w-full justify-between items-center !mt-5">
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

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            className="flex items-center capitalize text-lg py-1 px-2 rounded-md border-2 text-black"
            onClick={handleSubBranchSectionClose}
          >
            Cancel
          </button>
          <button
            className="flex items-center capitalize text-lg py-1 px-2 rounded-md border-2 bg-colorGreen text-white border-colorGreen"
            onClick={subBranchSubmit}
          >
            {loading && (
              <CircularProgress
                size={20}
                color="primary"
                sx={{ color: "white", mr: 1 }}
              />
            )}
            {editableBranchData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </Box>
  );
};
