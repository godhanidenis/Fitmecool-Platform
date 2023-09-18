import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import ProductCard from "../product-section/ProductCard";
import { CustomTab, TabPanel, a11yProps } from "../../core/CustomMUIComponents";
import { Tab } from "@mui/material";
import { useSelector } from "react-redux";
import { getProducts } from "../../../graphql/queries/productQueries";
import { useRouter } from "next/router";

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
    breakpoint: { max: 1024, min: 768 }, // Example: New breakpoint for larger tablets
    items: 3,
    slidesToSlide: 3,
  },
  largeTablet: {
    breakpoint: { max: 768, min: 464 }, // Example: Another new breakpoint for large tablets
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const MenCollection = () => {
  const { categories } = useSelector((state) => state.categories);
  const [value, setValue] = useState(0);
  const [menCategoryId, setMenCategoryId] = useState([]);
  const [menCategoryData, setMenCategoryData] = useState([]);
  const [menCategory, setMenCategory] = useState([]);

  const router = useRouter();

  const getAllMenProducts = () => {
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
      },
      (err) => console.log("error >> ", err)
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
      <div className="flex justify-between gap-1 2xl:gap-5 items-center">
        <div className="w-[70%] md:w-[80%] 2xl:w-[90%]mx-auto flex items-center justify-start ps-5 pb-1 md:pb-1 lg:pb-4 2xl:pb-6">
          <CustomTab
            variant="scrollable"
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            collection={true}
          >
            {menCategory?.map((item, index) => (
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
          className="text-[#29977E] font-semibold text-[12px] sm:text-[12px] md:text-[18px] 2xl:text-[18px] w-[30%] md:w-[20%] 2xl:w-[10%] pt-2 md:pt-0 lg:pt-4 2xl:pt-2  pb-2 md:pb-5 lg:pb-5 2xl:pb-8"
          onClick={() => router.push("/home")}
        >
          View All
        </button>
      </div>
      {menCategory && (
        <TabPanel value={value} index={value} padding={3}>
          <div className="w-full">
            <Carousel
              responsive={responsive}
              customTransition="all .5s ease-in-out"
              removeArrowOnDeviceType={["mobile"]}
              arrows={true}
              infinite
              // autoPlay
              // autoPlaySpeed={5000}
              customLeftArrow={
                <TrendingCustomLeftArrow onClick={TrendingCustomLeftArrow} />
              }
              customRightArrow={
                <TrendingCustomRightArrow onClick={TrendingCustomRightArrow} />
              }
            >
              {menCategoryData?.map((product) => (
                <div key={product.id} className="p-5">
                  <ProductCard product={product} landingPage={true} />
                </div>
              ))}
            </Carousel>
          </div>
        </TabPanel>
      )}
    </>
  );
};

export default MenCollection;
