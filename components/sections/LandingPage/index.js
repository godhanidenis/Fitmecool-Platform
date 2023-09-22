import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import bannerImg1 from "../../../assets/svg/Product IMg.svg";
import bannerImg2 from "../../../assets/svg/top images.svg";
import Image from "next/image";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  CustomIconTextField,
  CustomTab,
  TabPanel,
  a11yProps,
} from "../../core/CustomMUIComponents";
import { CircularProgress, InputAdornment, Tab } from "@mui/material";
import Customer from "./Customer";
import Vendor from "./Vendor";
import MenCollection from "./MenCollection";
import WomenCollection from "./WomenCollection";
import phone from "../../../assets/img/iPhone 12 View.png";
import bharat from "../../../assets/img/bharat.png";
import playStore from "../../../assets/img/playStore.png";
import appStore from "../../../assets/img/appStore.png";
import { useForm } from "react-hook-form";
import ShopCard from "./ShopCard";
import { loadShopsStart } from "../../../redux/ducks/shop";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const TrendingCustomLeftArrow = ({ onClick }) => {
  return (
    <div
      style={{
        background: "white",
        color: "black",
        left: -12,
        position: "absolute",
        cursor: "pointer",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        marginLeft: "16px",
        bottom: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "2px 2px 10px 0 rgba(0, 0, 0, 0.5)",
      }}
      onClick={() => onClick()}
    >
      <i
        style={{
          border: "solid",
          width: "12px",
          height: "12px",
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
        background: "white",
        color: "black",
        right: -12,
        position: "absolute",
        cursor: "pointer",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        marginRight: "16px",
        bottom: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "-2px 4px 10px 0 rgba(0, 0, 0, 0.5)",
      }}
      onClick={() => onClick()}
    >
      <i
        style={{
          border: "solid",
          width: "12px",
          height: "12px",
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

const responsive1 = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1600 },
    items: 5,
    slidesToSlide: 1,
  },
  desktop: {
    breakpoint: { max: 1600, min: 1367 }, // Desktop screens
    items: 4,
    slidesToSlide: 1,
  },
  mediumDesktop: {
    breakpoint: { max: 1366, min: 1280 }, // Medium-sized desktop screens
    items: 4,
    slidesToSlide: 1,
  },
  laptop: {
    breakpoint: { max: 1279, min: 1024 }, // Laptop screens
    items: 3,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 }, // Example: New breakpoint for larger tablets
    items: 3,
    slidesToSlide: 1,
  },
  largerMobile: {
    breakpoint: { max: 767, min: 480 }, // Larger mobile devices
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1.5,
    slidesToSlide: 1,
  },
};

const LandingPage = () => {
  const dispatch = useDispatch();

  const [value, setValue] = useState(0);
  const [invalid, setInvalid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    shopsLimit,
    shopsCount,
    numOfPages: shopNumOfPages,
    shopPageSkip,
    shopsData,
    loading: shopLoading,
    error: shopError,
  } = useSelector((state) => state.shops);

  console.log("shopsData 123 :>> ", shopsData);

  const { appliedProductsFilters, sortFilters } = useSelector(
    (state) => state.productsFiltersReducer
  );
  const {
    appliedShopsFilters,
    sortFilters: shopSortFilter,
    byShop,
  } = useSelector((state) => state.shopsFiltersReducer);

  const handleMobileNumberChange = (event) => {
    // Remove any non-digit characters
    const cleanedValue = event.target.value.replace(/\D/g, "");

    // Limit the input to 10 characters
    const limitedValue = cleanedValue.slice(0, 10);

    setMobileNumber(limitedValue);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    console.log("data", data);
  };
  const onError = (errors) => console.log("Errors Occurred !! :", errors);

  const carouselItems = [
    { imageSrc: bannerImg1, des: "bannerImg1" },
    { imageSrc: bannerImg2, des: "bannerImg2" },
    { imageSrc: bannerImg1, des: "bannerImg3" },
    { imageSrc: bannerImg2, des: "bannerImg4" },
    // Add more items as needed
  ];

  const CustomDot = ({ onClick, active }) => {
    return (
      <li className="" onClick={() => onClick()}>
        <FiberManualRecordIcon
          className={`${
            active ? "!text-[#31333E]" : "!text-[#31333e33]"
          } !w-3 !h-3 !mx-1 !cursor-pointer`}
          fontSize="small"
        />
      </li>
    );
  };

  const getAllShops = () => {
    setLoading(true);
    dispatch(
      loadShopsStart({
        pageData: {
          skip: shopPageSkip,
          limit: 10,
        },
        area: appliedShopsFilters.locations.selectedValue,
        sort: shopSortFilter.sortType.selectedValue,
        stars: appliedShopsFilters.stars.selectedValue,
      })
    );
  };

  useEffect(() => {
    getAllShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, appliedShopsFilters, shopSortFilter, shopPageSkip]);

  return (
    <div>
      <Carousel
        responsive={responsive}
        arrows={false}
        showDots
        customDot={<CustomDot />}
        customTransition="all .5s ease-in-out"
        infinite
        autoPlay
        autoPlaySpeed={3000}
      >
        {carouselItems.map((item, index) => (
          <div key={index} className="flex items-center w-full gap-1">
            <div className="w-full md:w-[80%] 2xl:w-[61%] pb-5">
              <Image
                src={item.imageSrc}
                alt=""
                objectFit="cover"
                width={1300}
                height={438}
              />
            </div>
            <div className="w-[40%] md:w-[30%] 2xl:w-[39%] h-full flex items-start md:items-start 2xl:items-center justify-center ">
              <div className="flex flex-col gap-0 md:gap-8 2xl:gap-10">
                <div className="flex flex-col gap-0 md:gap-2 2xl:gap-4">
                  <h1 className="text-[#181725] text-[15px] md:text-[28px] 2xl:text-[56px] font-extrabold">
                    Men’s Blazer
                  </h1>
                  <p className="text-[12px] md:text-[22px] 2xl:text-[40px] text-[#181725d5]">
                    Under ₹699
                  </p>
                </div>
                <div className="text-[8px] md:text-[18px] 2xl:text-[24px] text-[#31333e93]">
                  + Explore
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
      <div className="flex flex-col justify-center mt-8">
        <div className="text-center">
          <h1 className="text-[#181725] font-bold text-[24px] sm:text-[24px] md:text-[28px] 2xl:text-[36px]">
            How It Works
          </h1>
          <p className="text-[12px] sm:text-[16px] 2xl:text-[16px] text-[#31333e93]">
            Lorem Ipsum is simply dummy text of the printing
          </p>
        </div>

        <div className="w-full mx-auto flex items-center justify-center sm:mt-2 ">
          <CustomTab
            variant="scrollable"
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            hometab="true"
          >
            {["Customer", "Vendor"]?.map((item, index) => (
              <Tab
                key={index}
                label={item}
                {...a11yProps(index)}
                className="whitespace-nowrap"
              />
            ))}
          </CustomTab>
        </div>
        <div>
          {["Customer", "Vendor"]?.map((item, index) => (
            <React.Fragment key={index}>
              <TabPanel value={value} index={index} className="mt-6 mb-8">
                {item === "Customer" ? <Customer /> : <Vendor />}
              </TabPanel>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="container flex flex-col justify-center">
        <div className="text-center">
          <h1 className="text-[#181725] font-bold text-[24px] sm:text-[24px] md:text-[28px] 2xl:text-[36px]">
            Men’s Collection
          </h1>
          <p className="text-[12px] sm:text-[16px] 2xl:text-[16px] text-[#31333e93]">
            Browse through our dreamy catalog and enrobe your wishes.
          </p>
        </div>
        <div className="mt-2 sm:mt-5">
          <MenCollection />
        </div>
      </div>
      <div className="container flex flex-col justify-center sm:-mt-4">
        <div className="text-center">
          <h1 className="text-[#181725] font-bold text-[24px] sm:text-[24px] md:text-[28px] 2xl:text-[36px]">
            Women’s Collection
          </h1>
          <p className="text-[12px] sm:text-[16px] 2xl:text-[16px] text-[#31333e93]">
            Browse through our dreamy catalog and enrobe your wishes.
          </p>
        </div>
        <div className="mt-5">
          <WomenCollection />
        </div>
      </div>
      <div className="bg-[#29977E0A] py-8">
        <div className="container grid grid-cols-12">
          <div className="w-full flex justify-start col-span-9 sm:col-span-10 lg:col-span-7 lg:col-start-2 items-start">
            <div className=" flex flex-col">
              <div className="flex flex-col pb-4 sm:pb-4 2xl:pb-9">
                <p className="font-bold text-[20px] sm:text-[22px] md:text-[28px] 2xl:text-[36px] text-[#29977E]">
                  Download Rentbless app
                </p>
                <p className="text-[14px] sm:text-[18px]  md:text-[18px]  2xl:text-[24px]  text-[#181725] font-semibold text-[#18172593] flex flex-col">
                  <span className="m-0">
                    Plan weddings, book vendors & explore curated ideas
                  </span>
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit, onError)} onReset={reset}>
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] sm:text-[12px] md:text-[17px] lg:text-[18px] 2xl:text-[16px]">
                    You will receive an SMS with a link to download the App
                  </p>
                  <CustomIconTextField
                    className="w-[90%] sm:w-[90%] 2xl:w-[90%]"
                    placeholder="Enter Mobile No."
                    type="text"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <div>
                            <Image
                              src={bharat}
                              alt="bharat"
                              objectFit="cover"
                              className="w-full h-auto md:w-28 md:h-18 2xl:w-28 2xl:h-18 "
                              priority
                            />
                            <span className="ms-1 mx-2">+91</span>
                          </div>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& fieldset": { border: "none" },
                    }}
                    {...register("mobileNumber", {
                      required: "Mobile number is required",
                      onChange: (e) => {
                        setInvalid(false);
                        setSuccess(false);
                      },
                      pattern: {
                        value: /^\d{10}$/, // Ensure exactly 10 digits
                        message: "Please enter a valid 10-digit mobile number",
                      },
                    })}
                    value={mobileNumber}
                    onChange={handleMobileNumberChange}
                  />
                  {errors?.mobileNumber && (
                    <p className="text-red-600">
                      {errors.mobileNumber.message}
                    </p>
                  )}
                </div>
                <div className="pt-3 sm:pt-6 2xl:pt-8 pb-5 sm:pb-10 2xl:pb-12">
                  <button
                    className="text-white p-3 px-4 rounded-full text-[12px] sm:text-[16px] 2xl:text-[16px] font-semibold bg-[#29977E] sm:px-4 2xl:px-16"
                    type="submit"
                  >
                    Download App
                  </button>
                </div>
              </form>
              <div className="flex -ms-3">
                <Image
                  src={playStore}
                  alt="playStore"
                  objectFit="cover"
                  className="cursor-pointer"
                />
                <Image
                  src={appStore}
                  alt="appStore"
                  objectFit="cover"
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="col-span-3 sm:col-span-2 lg:col-span-3 justify-center items-center">
            <Image
              src={phone}
              alt="phone"
              objectFit="cover"
              // className="w-80 sm:w-80 2xl:w-full"
            />
          </div>
        </div>
      </div>
      <div className="container flex flex-col justify-center my-6">
        <div className="text-center">
          <h1 className="text-[#181725] font-bold text-[24px] sm:text-[24px] md:text-[28px] 2xl:text-[36px]">
            Featured Vendors
          </h1>
          <p className="text-[12px] sm:text-[16px] 2xl:text-[16px] text-[#31333e93]">
            Browse through our dreamy catalog and enrobe your wishes.
          </p>
        </div>

        <div className="w-full h-[384px] place-items-center pt-5">
          <Carousel
            responsive={responsive1}
            customTransition="all .5s ease-in-out"
            removeArrowOnDeviceType={["mobile"]}
            arrows={true}
            infinite
            autoPlay
            autoPlaySpeed={2000}
            className="py-5"
            customLeftArrow={
              <TrendingCustomLeftArrow onClick={TrendingCustomLeftArrow} />
            }
            customRightArrow={
              <TrendingCustomRightArrow onClick={TrendingCustomRightArrow} />
            }
          >
            {shopsData.map((shop) => (
              <div key={shop.id} className={`pl-2 pr-3 pb-8`}>
                <ShopCard shop={shop} />
              </div>
            ))}
          </Carousel>
          {loading && shopsData.length === 0 && (
            <div className="flex justify-center items-center h-full">
              <CircularProgress color="secondary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
