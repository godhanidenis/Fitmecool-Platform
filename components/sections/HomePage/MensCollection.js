import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import bannerImg1 from "../../../assets/banner/Product IMg.svg";
import bannerImg2 from "../../../assets/banner/top images.svg";
import Image from "next/image";
import ProductCard from "../product-section/ProductCard";

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

const productsData = [
  {
    id: "64ec70c87a539c5bbb3e4970",
    product_name: "Black Art Silk Embroidered Pathani Suit",
    product_description:
      "<p>Unlike kurta being unisex, kurta pajama sets are worn by men. They are the Indian equivalent of the tuxedo for formal events like weddings and religious rituals. While elegant and stylish, they are lighter, more breathable, and more comfortable to wear for a longer period.Bring variety to your collection to reach out to a larger audience and offer something new and refreshing for your existing clients. Give your business the support of efficient service by collaborating with reliable partners.Bring variety to your collection to reach out to a larger audience and offer something new and refreshing for your existing clients. <br>Give your business the support of efficient service by collaborating with reliable partners.Bring variety to your collection to reach out to a larger audience and offer something new and refreshing for your existing clients. Give your business the support of efficient service by collaborating with reliable partners.Bring variety to your collection to reach out to a larger audience and offer something new and refreshing for your existing clients. Give your business the support of efficient service by collaborating with reliable partners.</p>",
    product_image: {
      front:
        "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1694605864169.jpeg",
      back: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1694605865103.jpeg",
      side: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1694605866054.jpeg",
      __typename: "ProductImage",
    },
    product_video: null,
    categoryInfo: {
      id: "634d2954f1e84a3514b2f489",
      category_name: "Kurta",
      category_type: "Men",
      flag: true,
      __typename: "Category",
    },
    branchInfo: {
      id: "64ec21ef3f703f3a5a77bca6",
      shop_id: "64ec21ef3f703f3a5a77bca5",
      shop_info: {
        id: "64ec21ef3f703f3a5a77bca5",
        user_id: "64ec1fd53f703f3a5a77bca3",
        shop_logo:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693196777136.jpeg",
        shop_cover_image:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693196778399.jpeg",
        shop_images: [
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693196779839.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693196780746.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693196781602.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693196782398.jpeg",
            __typename: "ImagesList",
          },
        ],
        shop_video: null,
        is_live: false,
        flag: true,
        form_steps: "3",
        shop_social_link: {
          facebook: "https://depositphotos.com/photos/shop.html",
          instagram: "https://depositphotos.com/photos/shop.html",
          website: "https://depositphotos.com/photos/shop.html",
          __typename: "socialLink",
        },
        shopFollowerCount: 0,
        shopReviewCount: 0,
        shop_name: "axz",
        shop_time: [
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Sunday",
            __typename: "shopTime",
          },
          {
            close_time: "10:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Monday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "07:00 AM",
            week: "Tuesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Wednesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Thursday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Friday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Saturday",
            __typename: "shopTime",
          },
        ],
        shop_rating: null,
        shop_review: [],
        shop_type: "shop",
        __typename: "Shop",
      },
      branch_address: "abc Road",
      branch_pinCode: "395009",
      manager_name: "xyz dummy",
      manager_contact: "9876543217",
      manager_email: "abc@gmail.com",
      branch_type: "main",
      flag: true,
      __typename: "Branch",
    },
    flag: true,
    productLikes: 1,
    product_color: "black",
    __typename: "Product",
  },
  {
    id: "64ec3d12bf89b16590f424e5",
    product_name: "dummy",
    product_description: "<p>Hy dummy</p>",
    product_image: {
      front:
        "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693203948482.jpeg",
      back: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693203949208.jpeg",
      side: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693203949896.jpeg",
      __typename: "ProductImage",
    },
    product_video: null,
    categoryInfo: {
      id: "634d2954f1e84a3514b2f486",
      category_name: "Indo-Western",
      category_type: "Men",
      flag: true,
      __typename: "Category",
    },
    branchInfo: {
      id: "64ec383ebf89b16590f424e2",
      shop_id: "64ec383ebf89b16590f424e1",
      shop_info: {
        id: "64ec383ebf89b16590f424e1",
        user_id: "64ec366dbf89b16590f424df",
        shop_logo:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693202481236.jpeg",
        shop_cover_image:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693202482353.jpeg",
        shop_images: [
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693202483887.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693202486772.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693202490737.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693202493426.jpeg",
            __typename: "ImagesList",
          },
        ],
        shop_video: null,
        is_live: false,
        flag: true,
        form_steps: "3",
        shop_social_link: {
          facebook: "biubi",
          instagram: "biub",
          website: "ibiu",
          __typename: "socialLink",
        },
        shopFollowerCount: 1,
        shopReviewCount: 2,
        shop_name: "Bhargesh Shop1",
        shop_time: [
          {
            close_time: "-",
            is_24Hours_open: false,
            is_close: true,
            open_time: "-",
            week: "Sunday",
            __typename: "shopTime",
          },
          {
            close_time: "10:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Monday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "07:00 AM",
            week: "Tuesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Wednesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Thursday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Friday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Saturday",
            __typename: "shopTime",
          },
        ],
        shop_rating: 4,
        shop_review: [
          {
            id: "64ec3e65bf89b16590f424e8",
            shop_id: "64ec383ebf89b16590f424e1",
            user_id: "64143906e153d205c702fbea",
            stars: 5,
            message: "Best Shop ever!!!",
            flag: "true",
            __typename: "ShopReview",
          },
          {
            id: "64f57f46d8e5672bedbbb488",
            shop_id: "64ec383ebf89b16590f424e1",
            user_id: "64362f86b9a2600df7390799",
            stars: 3,
            message: "Good Product gives this shop.",
            flag: "true",
            __typename: "ShopReview",
          },
        ],
        shop_type: "shop",
        __typename: "Shop",
      },
      branch_address: "Vip Circle, Uttaran1",
      branch_pinCode: "123654",
      manager_name: "Bhargesh Gediya",
      manager_contact: "7896541210",
      manager_email: "sudip@gmail.com",
      branch_type: "main",
      flag: true,
      __typename: "Branch",
    },
    flag: true,
    productLikes: 0,
    product_color: "blue",
    __typename: "Product",
  },
  {
    id: "64ec23a13f703f3a5a77bcaa",
    product_name: "Kurta",
    product_description:
      "<p><strong>SHRESTHA By VASTRAMAY Men's Black Mirror Kurta Dhoti Set</strong><br></p><p><u>Tax included.</u></p><p><em><strong><u>Estimated date of delivery 04 Sep, 2023</u></strong></em></p><p><em>Easy 7 days returns and exchange available. Return Policies may vary based on products and promotions. For full details on our Returns Policies, please click here.Easy 7 days returns and exchange available. Return Policies may vary based on products and promotions. For full details on our Returns Policies, please click here.Easy 7 days returns and exchange available. Return Policies may vary based on products and promotions. For full details on our Returns Policies, please click here.Easy 7 days returns and exchange available. Return Policies may vary based on products and promotions. For full details on our Returns Policies, please click here.Easy 7 days returns and exchange available. Return Policies may vary based on products and promotions. For full details on our Returns Policies, please click here.Estimated date of delivery 04 Sep, 2023</em></p>",
    product_image: {
      front:
        "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693302950399.jpeg",
      back: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693302951401.jpeg",
      side: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693302952400.jpeg",
      __typename: "ProductImage",
    },
    product_video: null,
    categoryInfo: {
      id: "634d2954f1e84a3514b2f489",
      category_name: "Kurta",
      category_type: "Men",
      flag: true,
      __typename: "Category",
    },
    branchInfo: {
      id: "64ec21ef3f703f3a5a77bca6",
      shop_id: "64ec21ef3f703f3a5a77bca5",
      shop_info: {
        id: "64ec21ef3f703f3a5a77bca5",
        user_id: "64ec1fd53f703f3a5a77bca3",
        shop_logo:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693196777136.jpeg",
        shop_cover_image:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693196778399.jpeg",
        shop_images: [
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693196779839.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693196780746.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693196781602.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1693196782398.jpeg",
            __typename: "ImagesList",
          },
        ],
        shop_video: null,
        is_live: false,
        flag: true,
        form_steps: "3",
        shop_social_link: {
          facebook: "https://depositphotos.com/photos/shop.html",
          instagram: "https://depositphotos.com/photos/shop.html",
          website: "https://depositphotos.com/photos/shop.html",
          __typename: "socialLink",
        },
        shopFollowerCount: 0,
        shopReviewCount: 0,
        shop_name: "axz",
        shop_time: [
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Sunday",
            __typename: "shopTime",
          },
          {
            close_time: "10:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Monday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "07:00 AM",
            week: "Tuesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Wednesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Thursday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Friday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Saturday",
            __typename: "shopTime",
          },
        ],
        shop_rating: null,
        shop_review: [],
        shop_type: "shop",
        __typename: "Shop",
      },
      branch_address: "abc Road",
      branch_pinCode: "395009",
      manager_name: "xyz dummy",
      manager_contact: "9876543217",
      manager_email: "abc@gmail.com",
      branch_type: "main",
      flag: true,
      __typename: "Branch",
    },
    flag: true,
    productLikes: 0,
    product_color: "black",
    __typename: "Product",
  },
  {
    id: "64afbbf4b6ea471f215802f8",
    product_name:
      "NPLASH FASHION Women's Silk Semi Stitched Lehenga Choli (yellow bindu_Yellow_Free Size)",
    product_description:
      '<h3>Nplash Fashion Women\'s Embroidered Net Lehenga with Choli</h3><p>This lehenga with intricate embroidery detail is brought to you byNplash Fashion. The versatile combination of blouse, and skirt with ample flair makes it a piece that can be worn at a grand occasion. Since it is semi-stitched, the possibilities are endless - from a modern take to a more traditional look.</p><p><span style="font-size: 19px">Material and Style</span><br></p><p>Embroidery on an elegant velvet fabric screams grand celebration. Paired with the silk blouse and a soft netted dupatta is all you need to shine at any event. Go for a deep back or a high neck. With dupatta or without. High heels and gold clutch. All for a bonafide wedding ensemble.</p><p><span style="font-size: 19px">We made fits fitter</span><br></p><ul><li><span style="color: rgb(15, 17, 17)">We did a complete body measurement to create a range of smarter and perfect fits</span></li><li><span style="color: rgb(15, 17, 17)">Free Size Available as per your age.</span></li><li><span style="color: rgb(15, 17, 17)">Right fit is priceless and we want to deliver perfection to every woman</span></li></ul>',
    product_image: {
      front:
        "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692108440823.jpeg",
      back: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692108441841.jpeg",
      side: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692108442983.jpeg",
      __typename: "ProductImage",
    },
    product_video: null,
    categoryInfo: {
      id: "634d2954f1e84a3514b2f47f",
      category_name: "Marriage Gown",
      category_type: "Women",
      flag: true,
      __typename: "Category",
    },
    branchInfo: {
      id: "64993c738018fc0dfbbbc99a",
      shop_id: "64993c738018fc0dfbbbc999",
      shop_info: {
        id: "64993c738018fc0dfbbbc999",
        user_id: "6426a1aae526933a44b3d84c",
        shop_logo:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1687773181879.jpeg",
        shop_cover_image:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1687773183042.jpeg",
        shop_images: [
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1687773184349.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1687773185521.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1687773186607.jpeg",
            __typename: "ImagesList",
          },
        ],
        shop_video: null,
        is_live: false,
        flag: true,
        form_steps: "3",
        shop_social_link: {
          facebook: "www.facebook.in",
          instagram: "www.instagram.com",
          website: "m&gwedding.com",
          __typename: "socialLink",
        },
        shopFollowerCount: 0,
        shopReviewCount: 0,
        shop_name: "M&G wedding",
        shop_time: [
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Sunday",
            __typename: "shopTime",
          },
          {
            close_time: "10:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Monday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "07:00 AM",
            week: "Tuesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Wednesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Thursday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Friday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Saturday",
            __typename: "shopTime",
          },
        ],
        shop_rating: null,
        shop_review: [],
        shop_type: "shop",
        __typename: "Shop",
      },
      branch_address: "Yamuna chok",
      branch_pinCode: "125263",
      manager_name: "Gautam Bhesaniya",
      manager_contact: "5543543434",
      manager_email: "gautam.flyontechsolution@gmail.com",
      branch_type: "main",
      flag: true,
      __typename: "Branch",
    },
    flag: true,
    productLikes: 1,
    product_color: "pink",
    __typename: "Product",
  },
  {
    id: "64a4fbb6b6ea471f215802ea",
    product_name: "Test Product",
    product_description: "Test Product Test Product Test Product Test Product",
    product_image: {
      front:
        "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688533937036.jpeg",
      back: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688533938726.jpeg",
      side: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688533940457.jpeg",
      __typename: "ProductImage",
    },
    product_video: null,
    categoryInfo: {
      id: "634d2954f1e84a3514b2f484",
      category_name: "Sherwani",
      category_type: "Men",
      flag: true,
      __typename: "Category",
    },
    branchInfo: {
      id: "64a4fb40b6ea471f215802e8",
      shop_id: "64a4fb40b6ea471f215802e7",
      shop_info: {
        id: "64a4fb40b6ea471f215802e7",
        user_id: "6496b2428018fc0dfbbbc994",
        shop_logo:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688533813361.jpeg",
        shop_cover_image:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688533815524.jpeg",
        shop_images: [
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688533819827.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688533821092.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688533822436.jpeg",
            __typename: "ImagesList",
          },
        ],
        shop_video: null,
        is_live: false,
        flag: true,
        form_steps: "3",
        shop_social_link: {
          facebook: "flyontech.facebook",
          instagram: "flyontech.instagram",
          website: "flyontech.com",
          __typename: "socialLink",
        },
        shopFollowerCount: 0,
        shopReviewCount: 0,
        shop_name: "FlyOnTech Solution",
        shop_time: [
          {
            close_time: "-",
            is_24Hours_open: false,
            is_close: true,
            open_time: "-",
            week: "Sunday",
            __typename: "shopTime",
          },
          {
            close_time: "10:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Monday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "07:00 AM",
            week: "Tuesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Wednesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Thursday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Friday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Saturday",
            __typename: "shopTime",
          },
        ],
        shop_rating: null,
        shop_review: [],
        shop_type: "shop",
        __typename: "Shop",
      },
      branch_address: "E 502,shyam shikhar recydency",
      branch_pinCode: "520147",
      manager_name: "Denis Godhani",
      manager_contact: "9537256159",
      manager_email: "godhanidenis@gmail.com",
      branch_type: "main",
      flag: true,
      __typename: "Branch",
    },
    flag: true,
    productLikes: 2,
    product_color: "red",
    __typename: "Product",
  },
  {
    id: "648eb0158018fc0dfbbbc977",
    product_name: "Pretty Marsidise With Sequence & Moti Work For Women",
    product_description:
      "Amazing Marsidise Moti & Hand Work Lehenga Choli  Lehenga Choli Description Lehenga Fabric : Marsidise  Work : Plain Style  Flair : 5 Mtr Inner : Crep Length : 41 Size : 38 Type : Stitched Choli Fabric : Marsidise  Work : Sequence Work, Val Work & Moti Work  & Handwork Size : Up to 44 Available Dupatta Fabric : Chinon  Work : Flower Work  Length : 2.20 Mtr Color :Same As Pic  Occasion : Wedding Wear",
    product_image: {
      front:
        "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1687072785622.jpeg",
      back: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1687072786936.jpeg",
      side: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1687072788355.jpeg",
      __typename: "ProductImage",
    },
    product_video: null,
    categoryInfo: {
      id: "634d2954f1e84a3514b2f47e",
      category_name: "Sider's Choli",
      category_type: "Women",
      flag: true,
      __typename: "Category",
    },
    branchInfo: {
      id: "648eae9b8018fc0dfbbbc974",
      shop_id: "648eae9b8018fc0dfbbbc973",
      shop_info: {
        id: "648eae9b8018fc0dfbbbc973",
        user_id: "648eabc38018fc0dfbbbc971",
        shop_logo:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534261624.jpeg",
        shop_cover_image:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534262732.jpeg",
        shop_images: [
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534264317.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534265579.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534266890.jpeg",
            __typename: "ImagesList",
          },
        ],
        shop_video: null,
        is_live: false,
        flag: true,
        form_steps: "3",
        shop_social_link: {
          facebook: "https://gj5.com",
          instagram: "https://gj5.com",
          website: "https://gj5.com",
          __typename: "socialLink",
        },
        shopFollowerCount: 1,
        shopReviewCount: 1,
        shop_name: "GJ5 Fashion",
        shop_time: [
          {
            close_time: "-",
            is_24Hours_open: false,
            is_close: true,
            open_time: "-",
            week: "Sunday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Monday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Tuesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Wednesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Thursday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Friday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Saturday",
            __typename: "shopTime",
          },
        ],
        shop_rating: 3,
        shop_review: [
          {
            id: "648eb2ec8018fc0dfbbbc97d",
            shop_id: "648eae9b8018fc0dfbbbc973",
            user_id: "648eb2578018fc0dfbbbc978",
            stars: 3,
            message:
              "Gj 5 is one of the best shop in yogi chowk for bridal rent cloths.\nReally enjoyed cloths from Gj5.",
            flag: "true",
            __typename: "ShopReview",
          },
        ],
        shop_type: "shop",
        __typename: "Shop",
      },
      branch_address: "5, Yogi ChowkAmrakunj Society, Yoginagar Society",
      branch_pinCode: "395010",
      manager_name: "Denis Godhani",
      manager_contact: "1231231232",
      manager_email: "godhanidenis123123@gmail.com",
      branch_type: "main",
      flag: true,
      __typename: "Branch",
    },
    flag: true,
    productLikes: 2,
    product_color: "yellow",
    __typename: "Product",
  },
  {
    id: "648eafe58018fc0dfbbbc976",
    product_name:
      "Women's Beautiful Ready to Wear Multicolour Pure Chinon Lehenga Choli Set",
    product_description:
      "<p>​👗💌 Introducing our exquisite Navratri Special Lehenga Choli! Perfect for celebrating the festive season with style and elegance. Here are the details of each component of the outfit: 👗 Choli: Fabric: Made from pure Chinon, ensuring a luxurious and comfortable feel. Inner: Crafted with soft Micro Cotton, enhancing the comfort of the choli. Size: Available in XL up to 2 XL sizes with extra margin to provide a perfect fit. The choli comes fully stitched and ready to wear. 👗 Lehenga: Fabric: Created with high-quality Pure Chinon fabric, offering a beautiful drape and appeal. Inner: Lined with Micro Cotton to ensure a smooth and comfortable experience. Work: Adorned with intricate Gota Patti Lace Work, adding a touch of traditional charm to the lehenga. Flair: The lehenga features a mesmerizing 4.50-meter flair, giving a graceful and majestic look. Size: Available in size 44. 👗 Dupatta: Fabric: Made from pure Chinon fabric, providing a lightweight and ethereal appearance. Size: The dupatta is 2.30 meters long, allowing versatile draping styles and ease of movement. Work: Embellished with a delicate Gota Patti Lace Border, enhancing its beauty and making it a perfect match for the lehenga. Get ready to dazzle this Navratri with our stunning Lehenga Choli set, showcasing the rich craftsmanship and attention to detail. To purchase this exquisite Navratri Special Lehenga Choli, visit our Amazon store and embrace the festive spirit with grace and panache! 🛍️🎉​</p>",
    product_image: {
      front:
        "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692108873752.jpeg",
      back: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692108874727.jpeg",
      side: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692108875905.jpeg",
      __typename: "ProductImage",
    },
    product_video: null,
    categoryInfo: {
      id: "634d2954f1e84a3514b2f47e",
      category_name: "Sider's Choli",
      category_type: "Women",
      flag: true,
      __typename: "Category",
    },
    branchInfo: {
      id: "648eae9b8018fc0dfbbbc974",
      shop_id: "648eae9b8018fc0dfbbbc973",
      shop_info: {
        id: "648eae9b8018fc0dfbbbc973",
        user_id: "648eabc38018fc0dfbbbc971",
        shop_logo:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534261624.jpeg",
        shop_cover_image:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534262732.jpeg",
        shop_images: [
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534264317.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534265579.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534266890.jpeg",
            __typename: "ImagesList",
          },
        ],
        shop_video: null,
        is_live: false,
        flag: true,
        form_steps: "3",
        shop_social_link: {
          facebook: "https://gj5.com",
          instagram: "https://gj5.com",
          website: "https://gj5.com",
          __typename: "socialLink",
        },
        shopFollowerCount: 1,
        shopReviewCount: 1,
        shop_name: "GJ5 Fashion",
        shop_time: [
          {
            close_time: "-",
            is_24Hours_open: false,
            is_close: true,
            open_time: "-",
            week: "Sunday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Monday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Tuesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Wednesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Thursday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Friday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Saturday",
            __typename: "shopTime",
          },
        ],
        shop_rating: 3,
        shop_review: [
          {
            id: "648eb2ec8018fc0dfbbbc97d",
            shop_id: "648eae9b8018fc0dfbbbc973",
            user_id: "648eb2578018fc0dfbbbc978",
            stars: 3,
            message:
              "Gj 5 is one of the best shop in yogi chowk for bridal rent cloths.\nReally enjoyed cloths from Gj5.",
            flag: "true",
            __typename: "ShopReview",
          },
        ],
        shop_type: "shop",
        __typename: "Shop",
      },
      branch_address: "5, Yogi ChowkAmrakunj Society, Yoginagar Society",
      branch_pinCode: "395010",
      manager_name: "Denis Godhani",
      manager_contact: "1231231232",
      manager_email: "godhanidenis123123@gmail.com",
      branch_type: "main",
      flag: true,
      __typename: "Branch",
    },
    flag: true,
    productLikes: 2,
    product_color: "blue",
    __typename: "Product",
  },
  {
    id: "648eaf9e8018fc0dfbbbc975",
    product_name:
      "Zeel Clothing Women's Sequins Zari Embroidered Georgette Lehenga Choli with Dupatta (400-Wedding-Bridal-Latest-New-Stylish; Free Size)",
    product_description:
      "<p>Shop from a wide range of beautifully crafted lehenga cholis from zeel clothing on amazon. Pair this piece with heels or flats and matching jewelry for a stunning look. Zeel clothing store is a carefully curated design platform that articulates your personal style and your accumulated experience. With this expertise, we brings you the opportunity to enhance your wardrobe with the creative excellence of our most coveted designer wears as well as the vibrant energy of our bright young talent.</p>",
    product_image: {
      front:
        "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692109052453.jpeg",
      back: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692109054115.jpeg",
      side: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692109055488.jpeg",
      __typename: "ProductImage",
    },
    product_video: null,
    categoryInfo: {
      id: "634d2954f1e84a3514b2f480",
      category_name: "Engagement Gown",
      category_type: "Women",
      flag: true,
      __typename: "Category",
    },
    branchInfo: {
      id: "648eae9b8018fc0dfbbbc974",
      shop_id: "648eae9b8018fc0dfbbbc973",
      shop_info: {
        id: "648eae9b8018fc0dfbbbc973",
        user_id: "648eabc38018fc0dfbbbc971",
        shop_logo:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534261624.jpeg",
        shop_cover_image:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534262732.jpeg",
        shop_images: [
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534264317.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534265579.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1688534266890.jpeg",
            __typename: "ImagesList",
          },
        ],
        shop_video: null,
        is_live: false,
        flag: true,
        form_steps: "3",
        shop_social_link: {
          facebook: "https://gj5.com",
          instagram: "https://gj5.com",
          website: "https://gj5.com",
          __typename: "socialLink",
        },
        shopFollowerCount: 1,
        shopReviewCount: 1,
        shop_name: "GJ5 Fashion",
        shop_time: [
          {
            close_time: "-",
            is_24Hours_open: false,
            is_close: true,
            open_time: "-",
            week: "Sunday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Monday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Tuesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Wednesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Thursday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Friday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Saturday",
            __typename: "shopTime",
          },
        ],
        shop_rating: 3,
        shop_review: [
          {
            id: "648eb2ec8018fc0dfbbbc97d",
            shop_id: "648eae9b8018fc0dfbbbc973",
            user_id: "648eb2578018fc0dfbbbc978",
            stars: 3,
            message:
              "Gj 5 is one of the best shop in yogi chowk for bridal rent cloths.\nReally enjoyed cloths from Gj5.",
            flag: "true",
            __typename: "ShopReview",
          },
        ],
        shop_type: "shop",
        __typename: "Shop",
      },
      branch_address: "5, Yogi ChowkAmrakunj Society, Yoginagar Society",
      branch_pinCode: "395010",
      manager_name: "Denis Godhani",
      manager_contact: "1231231232",
      manager_email: "godhanidenis123123@gmail.com",
      branch_type: "main",
      flag: true,
      __typename: "Branch",
    },
    flag: true,
    productLikes: 2,
    product_color: "orange",
    __typename: "Product",
  },
  {
    id: "64211ffb1ea5b9381fd921bf",
    product_name: "wdaasd",
    product_description: "dfsfsdf",
    product_image: {
      front:
        "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1679892472126.jpeg",
      back: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1679892473308.jpeg",
      side: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1679892474480.jpeg",
      __typename: "ProductImage",
    },
    product_video: null,
    categoryInfo: {
      id: "634d2954f1e84a3514b2f484",
      category_name: "Sherwani",
      category_type: "Men",
      flag: true,
      __typename: "Category",
    },
    branchInfo: {
      id: "64196e917e836d243c85f359",
      shop_id: "64196e917e836d243c85f358",
      shop_info: {
        id: "64196e917e836d243c85f358",
        user_id: "64142c30e153d205c702fbe4",
        shop_logo:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788395472.jpeg",
        shop_cover_image:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788398027.jpeg",
        shop_images: [
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788400032.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788401753.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788403257.jpeg",
            __typename: "ImagesList",
          },
        ],
        shop_video: null,
        is_live: false,
        flag: true,
        form_steps: "3",
        shop_social_link: {
          facebook: "fashionbazar.facebook.in",
          instagram: "fashionbazar.instagram",
          website: "fashionbazar.com",
          __typename: "socialLink",
        },
        shopFollowerCount: 4,
        shopReviewCount: 4,
        shop_name: "Fashion Bazar",
        shop_time: [
          {
            close_time: "-",
            is_24Hours_open: false,
            is_close: true,
            open_time: "-",
            week: "Sunday",
            __typename: "shopTime",
          },
          {
            close_time: "-",
            is_24Hours_open: true,
            is_close: false,
            open_time: "-",
            week: "Monday",
            __typename: "shopTime",
          },
          {
            close_time: "02:51 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "07:59 AM",
            week: "Tuesday",
            __typename: "shopTime",
          },
          {
            close_time: "06:01 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "06:00 AM",
            week: "Wednesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Thursday",
            __typename: "shopTime",
          },
          {
            close_time: "-",
            is_24Hours_open: true,
            is_close: false,
            open_time: "-",
            week: "Friday",
            __typename: "shopTime",
          },
          {
            close_time: "-",
            is_24Hours_open: true,
            is_close: false,
            open_time: "-",
            week: "Saturday",
            __typename: "shopTime",
          },
        ],
        shop_rating: 4.5,
        shop_review: [
          {
            id: "6419a65d7e836d243c85f35c",
            shop_id: "64196e917e836d243c85f358",
            user_id: "64142c30e153d205c702fbe4",
            stars: 5,
            message: "Good Product!!!",
            flag: "true",
            __typename: "ShopReview",
          },
          {
            id: "648173338018fc0dfbbbc95e",
            shop_id: "64196e917e836d243c85f358",
            user_id: "648166188018fc0dfbbbc95d",
            stars: 4,
            message: "hii",
            flag: "true",
            __typename: "ShopReview",
          },
          {
            id: "6490409e8018fc0dfbbbc97f",
            shop_id: "64196e917e836d243c85f358",
            user_id: "64143906e153d205c702fbea",
            stars: 4,
            message: "NIce!!!!!!",
            flag: "true",
            __typename: "ShopReview",
          },
          {
            id: "649284248018fc0dfbbbc982",
            shop_id: "64196e917e836d243c85f358",
            user_id: "64362f86b9a2600df7390799",
            stars: 5,
            message: "This is good!!",
            flag: "true",
            __typename: "ShopReview",
          },
        ],
        shop_type: "shop",
        __typename: "Shop",
      },
      branch_address: "Yogi Chowkk",
      branch_pinCode: "395012",
      manager_name: "Bhargesh113 Gediya",
      manager_contact: "7043602265",
      manager_email: "bhargeshgediya44@gmail.com",
      branch_type: "main",
      flag: true,
      __typename: "Branch",
    },
    flag: true,
    productLikes: 1,
    product_color: "pink",
    __typename: "Product",
  },
  {
    id: "641dac3fbec3000b609a41b7",
    product_name: "Raymond Men Blazer",
    product_description: "Raymond Dark Blue Blazer",
    product_image: {
      front:
        "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1679666236801.jpeg",
      back: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1679666237700.jpeg",
      side: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1679666238380.jpeg",
      __typename: "ProductImage",
    },
    product_video: null,
    categoryInfo: {
      id: "634d2954f1e84a3514b2f488",
      category_name: "Blazer",
      category_type: "Men",
      flag: true,
      __typename: "Category",
    },
    branchInfo: {
      id: "64196e917e836d243c85f359",
      shop_id: "64196e917e836d243c85f358",
      shop_info: {
        id: "64196e917e836d243c85f358",
        user_id: "64142c30e153d205c702fbe4",
        shop_logo:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788395472.jpeg",
        shop_cover_image:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788398027.jpeg",
        shop_images: [
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788400032.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788401753.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788403257.jpeg",
            __typename: "ImagesList",
          },
        ],
        shop_video: null,
        is_live: false,
        flag: true,
        form_steps: "3",
        shop_social_link: {
          facebook: "fashionbazar.facebook.in",
          instagram: "fashionbazar.instagram",
          website: "fashionbazar.com",
          __typename: "socialLink",
        },
        shopFollowerCount: 4,
        shopReviewCount: 4,
        shop_name: "Fashion Bazar",
        shop_time: [
          {
            close_time: "-",
            is_24Hours_open: false,
            is_close: true,
            open_time: "-",
            week: "Sunday",
            __typename: "shopTime",
          },
          {
            close_time: "-",
            is_24Hours_open: true,
            is_close: false,
            open_time: "-",
            week: "Monday",
            __typename: "shopTime",
          },
          {
            close_time: "02:51 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "07:59 AM",
            week: "Tuesday",
            __typename: "shopTime",
          },
          {
            close_time: "06:01 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "06:00 AM",
            week: "Wednesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Thursday",
            __typename: "shopTime",
          },
          {
            close_time: "-",
            is_24Hours_open: true,
            is_close: false,
            open_time: "-",
            week: "Friday",
            __typename: "shopTime",
          },
          {
            close_time: "-",
            is_24Hours_open: true,
            is_close: false,
            open_time: "-",
            week: "Saturday",
            __typename: "shopTime",
          },
        ],
        shop_rating: 4.5,
        shop_review: [
          {
            id: "6419a65d7e836d243c85f35c",
            shop_id: "64196e917e836d243c85f358",
            user_id: "64142c30e153d205c702fbe4",
            stars: 5,
            message: "Good Product!!!",
            flag: "true",
            __typename: "ShopReview",
          },
          {
            id: "648173338018fc0dfbbbc95e",
            shop_id: "64196e917e836d243c85f358",
            user_id: "648166188018fc0dfbbbc95d",
            stars: 4,
            message: "hii",
            flag: "true",
            __typename: "ShopReview",
          },
          {
            id: "6490409e8018fc0dfbbbc97f",
            shop_id: "64196e917e836d243c85f358",
            user_id: "64143906e153d205c702fbea",
            stars: 4,
            message: "NIce!!!!!!",
            flag: "true",
            __typename: "ShopReview",
          },
          {
            id: "649284248018fc0dfbbbc982",
            shop_id: "64196e917e836d243c85f358",
            user_id: "64362f86b9a2600df7390799",
            stars: 5,
            message: "This is good!!",
            flag: "true",
            __typename: "ShopReview",
          },
        ],
        shop_type: "shop",
        __typename: "Shop",
      },
      branch_address: "Yogi Chowkk",
      branch_pinCode: "395012",
      manager_name: "Bhargesh113 Gediya",
      manager_contact: "7043602265",
      manager_email: "bhargeshgediya44@gmail.com",
      branch_type: "main",
      flag: true,
      __typename: "Branch",
    },
    flag: true,
    productLikes: 3,
    product_color: "blue",
    __typename: "Product",
  },
  {
    id: "641da85ac068844c383e1393",
    product_name: "ONNIX MEN'S SHERWANI KURTA CHURIDAR SET",
    product_description:
      "<p>ONNIX BRNAD IS MOST SEARCHABLE BRNAD ON AMAZON PORTAL. ONNIX BRNAD IS HIGHLY GROWUP BRNADS. THIS BRNAD IS OWN MANUFACTUREING PRODUCT AND MAKE SPECIFIC FASHION CLOTHING DESIGINE. ONNIX BRNAD MAKE A PERFECT AND FITABLE CLOTH FOR MENS. THIS DESIGINE IS SHERWANI FOR MEN THIS ITME IS MAKE BY DUPION SILK FABRIC. KURTA FITABE FOR BODY FOR EVERY MAN.</p>",
    product_image: {
      front:
        "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692104052491.jpeg",
      back: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692104053507.jpeg",
      side: "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692104054444.jpeg",
      __typename: "ProductImage",
    },
    product_video: null,
    categoryInfo: {
      id: "634d2954f1e84a3514b2f484",
      category_name: "Sherwani",
      category_type: "Men",
      flag: true,
      __typename: "Category",
    },
    branchInfo: {
      id: "64196e917e836d243c85f359",
      shop_id: "64196e917e836d243c85f358",
      shop_info: {
        id: "64196e917e836d243c85f358",
        user_id: "64142c30e153d205c702fbe4",
        shop_logo:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788395472.jpeg",
        shop_cover_image:
          "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788398027.jpeg",
        shop_images: [
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788400032.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788401753.jpeg",
            __typename: "ImagesList",
          },
          {
            links:
              "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1692788403257.jpeg",
            __typename: "ImagesList",
          },
        ],
        shop_video: null,
        is_live: false,
        flag: true,
        form_steps: "3",
        shop_social_link: {
          facebook: "fashionbazar.facebook.in",
          instagram: "fashionbazar.instagram",
          website: "fashionbazar.com",
          __typename: "socialLink",
        },
        shopFollowerCount: 4,
        shopReviewCount: 4,
        shop_name: "Fashion Bazar",
        shop_time: [
          {
            close_time: "-",
            is_24Hours_open: false,
            is_close: true,
            open_time: "-",
            week: "Sunday",
            __typename: "shopTime",
          },
          {
            close_time: "-",
            is_24Hours_open: true,
            is_close: false,
            open_time: "-",
            week: "Monday",
            __typename: "shopTime",
          },
          {
            close_time: "02:51 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "07:59 AM",
            week: "Tuesday",
            __typename: "shopTime",
          },
          {
            close_time: "06:01 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "06:00 AM",
            week: "Wednesday",
            __typename: "shopTime",
          },
          {
            close_time: "08:00 PM",
            is_24Hours_open: false,
            is_close: false,
            open_time: "09:00 AM",
            week: "Thursday",
            __typename: "shopTime",
          },
          {
            close_time: "-",
            is_24Hours_open: true,
            is_close: false,
            open_time: "-",
            week: "Friday",
            __typename: "shopTime",
          },
          {
            close_time: "-",
            is_24Hours_open: true,
            is_close: false,
            open_time: "-",
            week: "Saturday",
            __typename: "shopTime",
          },
        ],
        shop_rating: 4.5,
        shop_review: [
          {
            id: "6419a65d7e836d243c85f35c",
            shop_id: "64196e917e836d243c85f358",
            user_id: "64142c30e153d205c702fbe4",
            stars: 5,
            message: "Good Product!!!",
            flag: "true",
            __typename: "ShopReview",
          },
          {
            id: "648173338018fc0dfbbbc95e",
            shop_id: "64196e917e836d243c85f358",
            user_id: "648166188018fc0dfbbbc95d",
            stars: 4,
            message: "hii",
            flag: "true",
            __typename: "ShopReview",
          },
          {
            id: "6490409e8018fc0dfbbbc97f",
            shop_id: "64196e917e836d243c85f358",
            user_id: "64143906e153d205c702fbea",
            stars: 4,
            message: "NIce!!!!!!",
            flag: "true",
            __typename: "ShopReview",
          },
          {
            id: "649284248018fc0dfbbbc982",
            shop_id: "64196e917e836d243c85f358",
            user_id: "64362f86b9a2600df7390799",
            stars: 5,
            message: "This is good!!",
            flag: "true",
            __typename: "ShopReview",
          },
        ],
        shop_type: "shop",
        __typename: "Shop",
      },
      branch_address: "Yogi Chowkk",
      branch_pinCode: "395012",
      manager_name: "Bhargesh113 Gediya",
      manager_contact: "7043602265",
      manager_email: "bhargeshgediya44@gmail.com",
      branch_type: "main",
      flag: true,
      __typename: "Branch",
    },
    flag: true,
    productLikes: 4,
    product_color: "black",
    __typename: "Product",
  },
];
const MensCollection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselItems = [
    { imageSrc: bannerImg1, des: "bannerImg1" },
    { imageSrc: bannerImg2, des: "bannerImg2" },
    { imageSrc: bannerImg1, des: "bannerImg3" },
    { imageSrc: bannerImg2, des: "bannerImg4" },
    // Add more items as needed
  ];
  return (
    <div>
      <Carousel
        responsive={responsive}
        customTransition="all .5s ease-in-out"
        afterChange={(previousSlide, currentSlide) => {
          setCurrentSlide(currentSlide);
        }}
        infinite
        // autoPlay
        // autoPlaySpeed={5000}
      >
        {productsData?.map((product) => (
          <div key={product.id} className="p-5">
            <ProductCard product={product} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MensCollection;
