import React, { useState, useEffect, useRef } from "react";
import Carousel from "react-multi-carousel";
import ProductCard from "../product-section/ProductCard";
import { CustomTab, TabPanel, a11yProps } from "../../core/CustomMUIComponents";
import { CircularProgress, Tab } from "@mui/material";
import { useSelector } from "react-redux";
import { getProducts } from "../../../graphql/queries/productQueries";
import { useRouter } from "next/router";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1600 },
    items: 6,
    slidesToSlide: 6,
  },
  desktop: {
    breakpoint: { max: 1600, min: 1367 }, // Desktop screens
    items: 5,
    slidesToSlide: 5,
  },
  laptop: {
    breakpoint: { max: 1366, min: 1024 }, // Laptop screens
    items: 4,
    slidesToSlide: 4,
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

const MenCollection = () => {
  const { categories } = useSelector((state) => state.categories);
  const [value, setValue] = useState(0);
  const [menCategoryId, setMenCategoryId] = useState([]);
  const [menCategoryData, setMenCategoryData] = useState([]);
  const [menCategory, setMenCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

  const getAllMenProducts = () => {
    setMenCategoryData([]);
    setLoading(true);
    getProducts({
      pageData: {
        skip: 0,
        limit: 12,
      },
      filter: {
        category_id: menCategoryId,
        product_color: [],
      },
      shopId: [],
      sort: "new",
      search: "",
    }).then(
      (res) => {
        setMenCategoryData(res?.data?.productList?.data);
        setLoading(false);
      },
      (err) => {
        console.log("error >> ", err);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    setMenCategory(categories.filter((itm) => itm.category_type === "Men"));
    setMenCategoryId(
      categories.filter((itm) => itm.category_type === "Men")[0]?.id
    );
  }, [categories]);

  useEffect(() => {
    menCategoryId?.length > 0 && getAllMenProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menCategoryId]);

  return (
    <>
      <div className="flex justify-between gap-1 2xl:gap-5 items-center ">
        <div className="w-[70%] md:w-[80%] 2xl:w-[90%]mx-auto flex items-center justify-start">
          <CustomTab
            variant="scrollable"
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            collection="true"
          >
            {menCategory.slice(0, 5)?.map((item, index) => (
              <Tab
                key={item.id}
                label={item?.category_name}
                {...a11yProps(index)}
                className="whitespace-nowrap"
                onClick={() => setMenCategoryId([item?.id])}
              />
            ))}
          </CustomTab>
        </div>

        <button
          className="underline text-[#29977E] font-semibold text-[16px] sm:text-[18px] md:text-[18px] lg-text-[18px] 2xl:text-[18px]"
          onClick={() => router.push("/home")}
        >
          View All
        </button>
      </div>
      {menCategoryData?.length > 0 ? (
        <div className="p-5 flex gap-5">
          <button
            className="flex justify-center items-center p-2 border border-1 rounded-lg"
            onClick={prevSlide}
          >
            <ChevronLeftIcon />
          </button>
          <button
            className="flex justify-center items-center p-2 border border-1 rounded-lg"
            onClick={nextSlide}
          >
            <ChevronRightIcon />
          </button>
        </div>
      ) : (
        <div className="p-3"></div>
      )}
      <TabPanel value={value} index={value}>
        <div className="w-full h-[416px]">
          {!loading && menCategoryData.length > 0 ? (
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
              {menCategoryData?.map((product, index) => (
                <div key={product.id} className={`pr-3 pb-8`}>
                  <ProductCard product={product} landingPage={true} />
                </div>
              ))}
            </Carousel>
          ) : !loading && menCategoryData.length === 0 ? (
            <div className="flex items-center justify-center  pb-8 h-full w-full">
              No Product Found
            </div>
          ) : (
            loading &&
            menCategoryData.length === 0 && (
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

export default MenCollection;
