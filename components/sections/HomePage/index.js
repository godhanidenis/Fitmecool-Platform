import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import bannerImg1 from "../../../assets/banner/Product IMg.svg";
import bannerImg2 from "../../../assets/banner/top images.svg";
import Image from "next/image";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { CustomTab, TabPanel, a11yProps } from "../../core/CustomMUIComponents";
import { Tab } from "@mui/material";
import Customer from "./Customer";
import Vendor from "./Vendor";
import MensCollection from "./MensCollection";

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

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [value, setValue] = useState(0);

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
        afterChange={(previousSlide, currentSlide) => {
          setCurrentSlide(currentSlide);
        }}
        infinite
        autoPlay
        autoPlaySpeed={5000}
      >
        {carouselItems.map((item, index) => (
          <div key={index} className="flex items-center w-full">
            <div className="w-[61%] pb-5">
              <Image
                src={item.imageSrc}
                alt=""
                objectFit="cover"
                width={1300}
                height={438}
              />
            </div>
            <div className="w-[39%] h-full flex items-center justify-center ">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <h1 className="text-[#181725] text-[56px] font-extrabold">
                    Men’s Blazer
                  </h1>
                  <p className="text-[40px] text-[#181725d5]">Under ₹699</p>
                </div>
                <div className="text-[24px] text-[#31333e93]">+ Explore</div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
      <div className="flex flex-col justify-center p-16">
        <div className="text-center">
          <h1 className="text-[#181725] font-bold text-[48px]">How It Works</h1>
          <p className="text-[16px] text-[#31333e93]">
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
                <TabPanel value={value} index={index} padding={3}>
                  <Customer />
                </TabPanel>
              )}

              {item === "Vendor" && (
                <TabPanel value={value} index={index} padding={3}>
                  <Vendor />
                </TabPanel>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center p-16 pt-0">
        <div className="text-center">
          <h1 className="text-[#181725] font-bold text-[48px]">
            Men’s Collection
          </h1>
          <p className="text-[16px] text-[#31333e93]">
            Browse through our dreamy catalog and enrobe your wishes.
          </p>
        </div>
        <div className="p-0 sm-p-0 2xl:p-5">
          <MensCollection />
        </div>
      </div>
      <div className="flex flex-col justify-center p-16 pt-0">
        <div className="text-center">
          <h1 className="text-[#181725] font-bold text-[48px]">
            Women’s Collection
          </h1>
          <p className="text-[16px] text-[#31333e93]">
            Browse through our dreamy catalog and enrobe your wishes.
          </p>
        </div>
        <div className="p-0 sm-p-0 2xl:p-5">
          <MensCollection />
        </div>
      </div>
    </div>
  );
};

export default Index;
