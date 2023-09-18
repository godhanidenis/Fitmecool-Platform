import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import bannerImg1 from "../../../assets/banner/Product IMg.svg";
import bannerImg2 from "../../../assets/banner/top images.svg";
import Image from "next/image";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  CustomIconTextField,
  CustomTab,
  TabPanel,
  a11yProps,
} from "../../core/CustomMUIComponents";
import { InputAdornment, Tab } from "@mui/material";
import Customer from "./Customer";
import Vendor from "./Vendor";
import MenCollection from "./MenCollection";
import WomenCollection from "./WomenCollection";
import phone from "../../../assets/iPhone 12 View.png";
import bharat from "../../../assets/bharat.png";
import playStore from "../../../assets/playStore.png";
import appStore from "../../../assets/appStore.png";
import { useForm } from "react-hook-form";
import ShopCard from "./ShopCard";

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

const LandingPage = () => {
  const [value, setValue] = useState(0);
  const [invalid, setInvalid] = useState(false);
  const [success, setSuccess] = useState(false);

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
      <div className="flex flex-col justify-center p-5 md:p-5 xl:p-16 2xl:p-16 pt-8">
        <div className="text-center">
          <h1 className="text-[#181725] font-bold text-[22px] sm:text-[22px] md:text-[28px] 2xl:text-[48px]">
            How It Works
          </h1>
          <p className="text-[11px] sm:text-[16px] 2xl:text-[16px] text-[#31333e93]">
            Lorem Ipsum is simply dummy text of the printing
          </p>
        </div>

        <div className="w-full mx-auto flex items-center justify-center pb-6">
          <CustomTab
            variant="scrollable"
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            hometab={true}
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
              {item === "Customer" && (
                <TabPanel
                  value={value}
                  index={index}
                  className="p-0 sm:p-6 2xl:p-6"
                >
                  <Customer />
                </TabPanel>
              )}

              {item === "Vendor" && (
                <TabPanel
                  value={value}
                  index={index}
                  className="p-0 sm:p-6 2xl:p-6"
                >
                  <Vendor />
                </TabPanel>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center p-5 md:p-5 xl:p-16 2xl:p-16 !pb-0 pt-3 md:pt-3 xl:pt-0 2xl:pt-0">
        <div className="text-center">
          <h1 className="text-[#181725] font-bold text-[22px] sm:text-[22px] md:text-[28px] 2xl:text-[48px]">
            Men’s Collection
          </h1>
          <p className="text-[11px] sm:text-[16px] 2xl:text-[16px] text-[#31333e93]">
            Browse through our dreamy catalog and enrobe your wishes.
          </p>
        </div>
        <div className="p-0 sm-p-0 2xl:p-5">
          <MenCollection />
        </div>
      </div>
      <div className="flex flex-col justify-center p-5 md:p-5 xl:p-16 2xl:p-16 !pb-0 pt-3 md:pt-3 xl:pt-0 2xl:pt-0">
        <div className="text-center">
          <h1 className="text-[#181725] font-bold text-[22px] sm:text-[22px] md:text-[28px] 2xl:text-[48px]">
            Women’s Collection
          </h1>
          <p className="text-[11px] sm:text-[16px] 2xl:text-[16px] text-[#31333e93]">
            Browse through our dreamy catalog and enrobe your wishes.
          </p>
        </div>
        <div className="p-0 sm-p-0 2xl:p-5">
          <WomenCollection />
        </div>
      </div>
      <div className="p-10 mb-16 bg-[#29977E0A] flex justify-between items-center sm:p-10 2xl:p-20 gap-1 sm:gap-5 2xl:gap-0">
        <div className="w-full flex  justify-center">
          <div className=" flex flex-col ">
            <div className="flex flex-col pb-4 sm:pb-4 2xl:pb-9">
              <p className="text-[10px] sm:text-[16px]  md:text-[23px] lg:text-[32px] 2xl:text-[48px] font-semibold text-[#29977E]">
                Download Rentbless app
              </p>
              <p className="text-[8px] sm:text-[12px] md:text-[18px] lg:text-[22px] 2xl:text-[32px] text-[#18172593] flex flex-col">
                <span className="m-0">Plan weddings, book vendors</span>
                <span className="m-0">& explore curated ideas</span>
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit, onError)} onReset={reset}>
              <div className="flex flex-col gap-2">
                <p className="text-[#181725]  text-[8px] sm:text-[12px] md:text-[17px] lg:text-[18px] 2xl:text-[24px]">
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
                        <div>
                          <Image
                            src={bharat}
                            alt="bharat"
                            objectFit="cover"
                            className="w-full h-auto md:w-28 md:h-18 2xl:w-28 2xl:h-18 "
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
                      value: /^(\+\d{1,3}\s?)?\d{10}$/,
                      message: "Please enter a valid mobile number",
                    },
                  })}
                />
                {errors?.mobileNumber && (
                  <p className="text-red-600">{errors.mobileNumber.message}</p>
                )}
              </div>
              <div className="pt-5 sm:pt-8 2xl:pt-10 pb-5 sm:pb-10 2xl:pb-12">
                <button
                  className="text-white p-3 px-4 rounded-full text-[10px] sm:text-[16px] 2xl:text-[16px] font-semibold bg-[#29977E] sm:px-4 2xl:px-16"
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
        <div className="w-full sm:w-full 2xl:w-full ps-0 sm:ps-0 2xl:ps-16 flex md:justify-end xl:justify-center 2xl:justify-center">
          <Image
            src={phone}
            alt="phone"
            objectFit="cover"
            className="w-80 sm:w-80 2xl:w-full"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center p-5 md:p-5 xl:p-16 2xl:p-16 pt-3 md:pt-3 xl:pt-0 2xl:pt-0">
        <div className="text-center">
          <h1 className="text-[#181725] font-bold text-[22px] sm:text-[22px] md:text-[28px] 2xl:text-[48px]">
            Featured Vendors
          </h1>
          <p className="text-[11px] sm:text-[16px] 2xl:text-[16px] text-[#31333e93]">
            Browse through our dreamy catalog and enrobe your wishes.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1  md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5  gap-4 sm:gap-4 place-items-center pt-10  pb-5 md:pb-20 2xl:pb-20 ">
          {[1, 2, 3, 4, 5].map((id, index) => (
            <ShopCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
