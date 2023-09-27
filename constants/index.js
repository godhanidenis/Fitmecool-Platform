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
  appLogo: `${appConfig.wasabiUrl}/rentblessLogo.png`,
  appBlackLogo: `${appConfig.wasabiUrl}/BlackLogo.png`,
  emptyCart: `${appConfig.wasabiUrl}/empty_cart.png`,
  appStore: `${appConfig.wasabiUrl}/appStore.png`,
  playStore: `${appConfig.wasabiUrl}/playStore.png`,
  bannerImg1: `${appConfig.wasabiUrl}/bannerImg1.png`,
  bannerImg2: `${appConfig.wasabiUrl}/bannerImg2.png`,
  bannerImg3: `${appConfig.wasabiUrl}/bannerImg3.png`,
  bannerImg4: `${appConfig.wasabiUrl}/bannerImg4.png`,
  bannerImg5: `${appConfig.wasabiUrl}/bannerImg5.png`,
  bannerImg6: `${appConfig.wasabiUrl}/bannerImg6.png`,
  phoneImage: `${appConfig.wasabiUrl}/phone.png`,
  storeImage1: `${appConfig.wasabiUrl}/store1.png`,
  storeImage2: `${appConfig.wasabiUrl}/store2.png`,
  storeImage3: `${appConfig.wasabiUrl}/store3.png`,
  storeImage4: `${appConfig.wasabiUrl}/store4.png`,
  storeImage5: `${appConfig.wasabiUrl}/store5.png`,
  homeCoverImage: `${appConfig.wasabiUrl}/homeCoverImage.png`,
  bharatFlag: `${appConfig.wasabiUrl}/bharatFlag.png`,
  authCover: `${appConfig.wasabiUrl}/authCover.png`,
  callIcon: `${appConfig.wasabiUrl}/callIcon.svg`,
  emailIcon: `${appConfig.wasabiUrl}/emailIcon.svg`,
  facebookIcon: `${appConfig.wasabiUrl}/facebookIcon.svg`,
  googleIcon: `${appConfig.wasabiUrl}/googleIcon.svg`,
  locationIcon: `${appConfig.wasabiUrl}/locationIcon.svg`,
  shareIcon: `${appConfig.wasabiUrl}/shareIcon.svg`,
  facebookLogo: `${appConfig.wasabiUrl}/facebookLogo.svg`,
  instagramLogo: `${appConfig.wasabiUrl}/instagramLogo.svg`,
  linkedinLogo: `${appConfig.wasabiUrl}/linkedinLogo.svg`,
  twitterLogo: `${appConfig.wasabiUrl}/twitterLogo.svg`,
  youtubeLogo: `${appConfig.wasabiUrl}/youtubeLogo.svg`,
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
