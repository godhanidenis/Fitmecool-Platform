import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import Image from "next/image";
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
import { useForm } from "react-hook-form";
import ShopCard from "./ShopCard";
import { useDispatch } from "react-redux";
import { assets } from "../../../constants";
import { useRouter } from "next/router";
import { changeByShopFilters } from "../../../redux/ducks/shopsFilters";
import BannerHero from "../../DirectoryHero/BannerHero";
import { getShops } from "../../../graphql/queries/shopQueries";

const responsive = {
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
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shopsData, setShopsData] = useState([]);

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
    {
      imageSrc: assets.bannerImg1,
      des: "bannerImg1",
      func: () => router.push(`/home`),
    },
    {
      imageSrc: assets.bannerImg2,
      des: "bannerImg2",
      func: () => {
        router.push(`/auth/user-type/`);
        localStorage.setItem("user_type_for_auth", "vendor");
      },
    },
    {
      imageSrc: assets.bannerImg3,
      des: "bannerImg3",
      func: () => {
        router.push(`/auth/user-type/`);
        localStorage.setItem("user_type_for_auth", "vendor");
      },
    },
  ];

  const getAllShops = () => {
    setLoading(true);
    getShops({
      pageData: {
        skip: 0,
        limit: 10,
      },
      area: [],
      sort: "",
      stars: "",
    }).then(
      (res) => {
        setShopsData(res?.data?.shopList?.data);
        setLoading(false);
      },
      (err) => {
        console.log("error >> ", err);
        setLoading(false);
      }
    );
  };

  const handleInput = (e) => {
    const inputValue = e.target.value;

    // Check if the input exceeds 10 characters and truncate it
    if (inputValue.length > 10) {
      e.target.value = inputValue.slice(0, 10);
    } else if (inputValue < 0) {
      e.target.value = 0;
    }
  };

  useEffect(() => {
    getAllShops();
  }, []);

  return (
    <>
      <BannerHero carouselItems={carouselItems} className="cursor-pointer" />
      <div className="flex flex-col justify-center mt-1 md:mt-8">
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
      <div className="container flex flex-col justify-center mt-7">
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
      <div className="bg-[#29977E0A] py-8 mt-8">
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
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <div className="flex items-center gap-2">
                            <Image
                              src={assets.bharatFlag}
                              alt="bharatFlag"
                              width={36}
                              height={24}
                            />
                            <span>+91</span>
                          </div>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& fieldset": { border: "none" },
                    }}
                    {...register("mobileNumber", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^\d{10}$/, // Ensure exactly 10 digits
                        message: "Please enter a valid 10-digit mobile number",
                      },
                    })}
                    onInput={handleInput}
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
                  src={assets.playStore}
                  alt="playStore"
                  width={175}
                  height={62}
                  objectFit="cover"
                  className="cursor-pointer"
                />
                <Image
                  src={assets.appStore}
                  alt="appStore"
                  width={175}
                  height={62}
                  objectFit="cover"
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="col-span-3 sm:col-span-2 lg:col-span-3 justify-center items-center">
            <Image
              src={assets.phoneImage}
              alt="phone"
              objectFit="cover"
              width={235}
              height={480}
            />
          </div>
        </div>
      </div>
      <div className="container flex flex-col justify-center mt-10 mb-0 lg:mb-8">
        <div className="text-center">
          <h1 className="text-[#181725] font-bold text-[24px] sm:text-[24px] md:text-[28px] 2xl:text-[36px]">
            Featured Vendors
          </h1>
          <p className="text-[12px] sm:text-[16px] 2xl:text-[16px] text-[#31333e93]">
            Browse through our dreamy catalog and enrobe your wishes.
          </p>
        </div>

        <div className="w-full h-[350px] lg:h-[400px] place-items-center pt-5">
          {!loading && (
            <div className="flex justify-end">
              <button
                className="underline text-[#29977E] font-semibold text-[16px] sm:text-[18px] md:text-[18px] lg-text-[18px] 2xl:text-[18px]"
                onClick={() => {
                  dispatch(changeByShopFilters(true));
                  router.push("/home");
                }}
              >
                View All
              </button>
            </div>
          )}
          {!loading ? (
            shopsData.length > 0 ? (
              <Carousel
                responsive={responsive}
                customTransition="all .5s ease-in-out"
                removeArrowOnDeviceType={["mobile"]}
                arrows={false}
                infinite
                autoPlay
                autoPlaySpeed={2000}
                className="py-5"
              >
                {shopsData.map((shop) => (
                  <div key={shop.id} className={`pl-2 pr-3 pb-8`}>
                    <ShopCard shop={shop} />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="flex items-center justify-center pb-8 h-full w-full">
                No Shop Found
              </div>
            )
          ) : (
            <div className="flex justify-center items-center h-full">
              <CircularProgress color="secondary" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LandingPage;
