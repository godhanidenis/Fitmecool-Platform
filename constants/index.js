import { generateImageUrl } from "../utils/common";

import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";

export const colorsList = [
  "red",
  "pink",
  "yellow",
  "wine",
  "purple",
  "blue",
  "orange",
  "green",
  "white",
  "black",
];

export const assets = {
  appLogo: generateImageUrl("rentblessLogo", "png"),
  appBlackLogo: generateImageUrl("BlackLogo", "png"),
  emptyCart: generateImageUrl("empty_cart", "png"),
  appStore: generateImageUrl("appStore", "png"),
  playStore: generateImageUrl("playStore", "png"),
  bannerImg1: generateImageUrl("bannerImg1", "png"),
  bannerImg2: generateImageUrl("bannerImg2", "png"),
  phoneImage: generateImageUrl("phone", "png"),
  storeImage1: generateImageUrl("store1", "png"),
  storeImage2: generateImageUrl("store2", "png"),
  storeImage3: generateImageUrl("store3", "png"),
  storeImage4: generateImageUrl("store4", "png"),
  storeImage5: generateImageUrl("store5", "png"),
  homeCoverImage: generateImageUrl("homeCoverImage", "png"),
  bharatFlag: generateImageUrl("bharatFlag", "png"),
  authCover: generateImageUrl("authCover", "png"),
  callIcon: generateImageUrl("callIcon", "svg"),
  emailIcon: generateImageUrl("emailIcon", "svg"),
  facebookIcon: generateImageUrl("facebookIcon", "svg"),
  googleIcon: generateImageUrl("googleIcon", "svg"),
  locationIcon: generateImageUrl("locationIcon", "svg"),
  shareIcon: generateImageUrl("shareIcon", "svg"),
  facebookLogo: generateImageUrl("facebookLogo", "svg"),
  instagramLogo: generateImageUrl("instagramLogo", "svg"),
  linkedinLogo: generateImageUrl("linkedinLogo", "svg"),
  twitterLogo: generateImageUrl("twitterLogo", "svg"),
  youtubeLogo: generateImageUrl("youtubeLogo", "svg"),
};

export const footerData = {
  socialMediaList: [
    {
      id: 1,
      logo: assets.facebookLogo,
      link: "https://facebook.com/",
    },
    {
      id: 2,
      logo: assets.youtubeLogo,
      link: "https://youtube.com/",
    },
    {
      id: 3,
      logo: assets.twitterLogo,
      link: "https://twitter.com/",
    },
    {
      id: 4,
      logo: assets.linkedinLogo,
      link: "https://linkedin.com/",
    },
    {
      id: 5,
      logo: assets.instagramLogo,
      link: "https://instagram.com/",
    },
  ],
  dataList: [
    {
      name: "Products",
      data: ["Men's", "Women's", "kid's"],
    },
    {
      name: "Brands",
      data: ["FAQs", "How if Works", "About As"],
    },
  ],
};

export const vendorSidebarTabs = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: "/vendor/dashboard",
  },
  {
    label: "Shop",
    icon: <StoreIcon />,
    path: "/vendor/shopEdit",
  },
  {
    label: "Products",
    icon: <ProductionQuantityLimitsIcon />,
    path: "/vendor/shop",
  },
  {
    label: "Subscription",
    icon: <SubscriptionsIcon />,
    path: `/vendor/shop-subscription`,
  },
];
