import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import appConfig from "../config";

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
  appLogo: `${appConfig.wasabiUrl}/imgs/rentblessLogo.png`,
  appBlackLogo: `${appConfig.wasabiUrl}/imgs/BlackLogo.png`,
  emptyCart: `${appConfig.wasabiUrl}/imgs/empty_cart.png`,
  appStore: `${appConfig.wasabiUrl}/imgs/appStore.png`,
  playStore: `${appConfig.wasabiUrl}/imgs/playStore.png`,
  bannerImg1: `${appConfig.wasabiUrl}/banners/bannerImg1.png`,
  bannerImg2: `${appConfig.wasabiUrl}/banners/bannerImg2.png`,
  bannerImg3: `${appConfig.wasabiUrl}/banners/bannerImg3.png`,
  bannerImg4: `${appConfig.wasabiUrl}/banners/bannerImg4.png`,
  bannerImg5: `${appConfig.wasabiUrl}/banners/bannerImg5.png`,
  bannerImg6: `${appConfig.wasabiUrl}/banners/bannerImg6.png`,
  phoneImage: `${appConfig.wasabiUrl}/imgs/phone.png`,
  storeImage1: `${appConfig.wasabiUrl}/imgs/store1.png`,
  storeImage2: `${appConfig.wasabiUrl}/imgs/store2.png`,
  storeImage3: `${appConfig.wasabiUrl}/imgs/store3.png`,
  storeImage4: `${appConfig.wasabiUrl}/imgs/store4.png`,
  storeImage5: `${appConfig.wasabiUrl}/imgs/store5.png`,
  homeCoverImage: `${appConfig.wasabiUrl}/imgs/homeCoverImage.png`,
  bharatFlag: `${appConfig.wasabiUrl}/imgs/bharatFlag.png`,
  authCover: `${appConfig.wasabiUrl}/imgs/authCover.png`,
  callIcon: `${appConfig.wasabiUrl}/svgs/callIcon.svg`,
  emailIcon: `${appConfig.wasabiUrl}/svgs/emailIcon.svg`,
  facebookIcon: `${appConfig.wasabiUrl}/svgs/facebookIcon.svg`,
  googleIcon: `${appConfig.wasabiUrl}/svgs/googleIcon.svg`,
  locationIcon: `${appConfig.wasabiUrl}/svgs/locationIcon.svg`,
  shareIcon: `${appConfig.wasabiUrl}/svgs/shareIcon.svg`,
  facebookLogo: `${appConfig.wasabiUrl}/svgs/facebookLogo.svg`,
  instagramLogo: `${appConfig.wasabiUrl}/svgs/instagramLogo.svg`,
  linkedinLogo: `${appConfig.wasabiUrl}/svgs/linkedinLogo.svg`,
  twitterLogo: `${appConfig.wasabiUrl}/svgs/twitterLogo.svg`,
  youtubeLogo: `${appConfig.wasabiUrl}/svgs/youtubeLogo.svg`,
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
