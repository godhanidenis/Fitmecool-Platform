import React, { useState, useEffect, useRef } from "react";
import Carousel from "react-multi-carousel";
import ProductCard from "../product-section/ProductCard";
import { CustomTab, TabPanel, a11yProps } from "../../core/CustomMUIComponents";
import { CircularProgress, Tab } from "@mui/material";
import { useSelector } from "react-redux";
import { getProducts } from "../../../graphql/queries/productQueries";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "next/link";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1600 },
    items: 6,
    slidesToSlide: 2,
  },
  desktop: {
    breakpoint: { max: 1600, min: 1367 }, // Desktop screens
    items: 5,
    slidesToSlide: 2,
  },
  laptop: {
    breakpoint: { max: 1366, min: 1024 }, // Laptop screens
    items: 4,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 }, // Example: New breakpoint for larger tablets
    items: 3,
    slidesToSlide: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1.5,
    slidesToSlide: 1,
  },
};

const WomenCollection = () => {
  const { categories } = useSelector((state) => state.categories);
  const { themeLayout } = useSelector((state) => state.themeLayout);
  const [womenCategory, setWomenCategory] = useState([]);
  const [value, setValue] = useState(0);
  const [womenCategoryId, setWomenCategoryId] = useState([]);
  const [womenCategoryData, setWomenCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const carouselRef = useRef(null);

  const nextSlide = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const prevSlide = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
    }
  };

  const getAllWomenProducts = () => {
    setWomenCategoryData([]);
    setLoading(true);
    getProducts({
      pageData: {
        skip: 0,
        limit: 12,
      },
      filter: {
        category_id: womenCategoryId,
        product_color: [],
      },
      shopId: [],
      sort: "new",
      search: "",
    }).then(
      (res) => {
        setWomenCategoryData(res?.data?.productList?.data);
        setLoading(false);
      },
      (err) => {
        console.log("error >> ", err);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    setWomenCategory(categories.filter((itm) => itm.category_type === "Women"));
    setWomenCategoryId(
      categories.filter((itm) => itm.category_type === "Women")[0]?.id
    );
  }, [categories]);

  useEffect(() => {
    womenCategoryId?.length > 0 && getAllWomenProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [womenCategoryId]);

  return (
    <>
      <div className="flex justify-between gap-1 2xl:gap-5 items-center">
        <div className="w-[70%] md:w-[80%] 2xl:w-[90%]  flex items-center justify-start">
          <CustomTab
            variant="scrollable"
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            collection="true"
          >
            {womenCategory.slice(0, 5)?.map((item, index) => (
              <Tab
                key={item.id}
                label={item?.category_name}
                {...a11yProps(index)}
                className="whitespace-nowrap"
                onClick={() => setWomenCategoryId([item?.id])}
              />
            ))}
          </CustomTab>
        </div>
        <Link href={`/home`} passHref>
          <a
            target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}
            rel="noopener noreferrer"
          >
            <button className="underline text-[#29977E] font-semibold text-[16px] sm:text-[18px] md:text-[18px] lg-text-[18px] 2xl:text-[18px]">
              View All
            </button>
          </a>
        </Link>
      </div>
      {womenCategoryData?.length > 0 ? (
        <div className="p-5 flex gap-5">
          <button
            className="flex justify-center items-center p-1 rounded-lg bg-[#0000002a]"
            onClick={prevSlide}
          >
            <ChevronLeftIcon className="!text-black" />
          </button>
          <button
            className="flex justify-center items-center p-1 rounded-lg bg-[#0000002a]"
            onClick={nextSlide}
          >
            <ChevronRightIcon className="!text-black" />
          </button>
        </div>
      ) : (
        <div className="p-3"></div>
      )}

      <TabPanel value={value} index={value}>
        <div className="w-full h-[360px] lg:h-[416px]">
          {!loading && womenCategoryData.length > 0 ? (
            <Carousel
              ref={carouselRef}
              responsive={responsive}
              customTransition="all .5s ease-in-out"
              // removeArrowOnDeviceType={["mobile"]}
              arrows={false}
              infinite
              // autoPlay
              // autoPlaySpeed={5000}
            >
              {womenCategoryData?.map((product) => (
                <div key={product.id} className={`pr-3 pb-8`}>
                  <ProductCard product={product} landingPage={true} />
                </div>
              ))}
            </Carousel>
          ) : !loading && womenCategoryData.length === 0 ? (
            <div className="flex items-center justify-center  pb-8 h-full w-full">
              No Product Found
            </div>
          ) : (
            loading &&
            womenCategoryData.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <CircularProgress color="secondary" />
              </div>
            )
          )}
        </div>
      </TabPanel>
    </>
  );
};

export default WomenCollection;
