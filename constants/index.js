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
  // appLogo: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/rentblessLogo.png`,
  appLogo: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/fitMeCoolWhite.png`,
  appBlackLogo: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/BlackLogo.png`,
  emptyCart: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/empty_cart.png`,
  appStore: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/appStore.png`,
  playStore: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/playStore.png`,
  bannerImg1: `${process.env.NEXT_PUBLIC_WASABI_URL}/banners/bannerImg1.png`,
  bannerImg2: `${process.env.NEXT_PUBLIC_WASABI_URL}/banners/bannerImg2.png`,
  bannerImg3: `${process.env.NEXT_PUBLIC_WASABI_URL}/banners/bannerImg3.png`,
  bannerImg4: `${process.env.NEXT_PUBLIC_WASABI_URL}/banners/bannerImg4.png`,
  bannerImg5: `${process.env.NEXT_PUBLIC_WASABI_URL}/banners/bannerImg5.png`,
  bannerImg6: `${process.env.NEXT_PUBLIC_WASABI_URL}/banners/bannerImg6.png`,
  phoneImage: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/phone.png`,
  storeImage1: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/store1.png`,
  storeImage2: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/store2.png`,
  storeImage3: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/store3.png`,
  storeImage4: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/store4.png`,
  storeImage5: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/store5.png`,
  homeCoverImage: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/homeCoverImage.png`,
  bharatFlag: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/bharatFlag.png`,
  authCover: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/authCover.png`,
  callIcon: `${process.env.NEXT_PUBLIC_WASABI_URL}/svgs/callIcon.svg`,
  emailIcon: `${process.env.NEXT_PUBLIC_WASABI_URL}/svgs/emailIcon.svg`,
  facebookIcon: `${process.env.NEXT_PUBLIC_WASABI_URL}/svgs/facebookIcon.svg`,
  googleIcon: `${process.env.NEXT_PUBLIC_WASABI_URL}/svgs/googleIcon.svg`,
  locationIcon: `${process.env.NEXT_PUBLIC_WASABI_URL}/svgs/locationIcon.svg`,
  shareIcon: `${process.env.NEXT_PUBLIC_WASABI_URL}/svgs/shareIcon.svg`,
  facebookLogo: `${process.env.NEXT_PUBLIC_WASABI_URL}/svgs/facebookLogo.svg`,
  instagramLogo: `${process.env.NEXT_PUBLIC_WASABI_URL}/svgs/instagramLogo.svg`,
  linkedinLogo: `${process.env.NEXT_PUBLIC_WASABI_URL}/svgs/linkedinLogo.svg`,
  twitterLogo: `${process.env.NEXT_PUBLIC_WASABI_URL}/svgs/twitterLogo.svg`,
  youtubeLogo: `${process.env.NEXT_PUBLIC_WASABI_URL}/svgs/youtubeLogo.svg`,
  cloth: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/cloth.png`,
  shop_vendorIcon: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/shop_vendorIcon.png`,
  store_Icon: `${process.env.NEXT_PUBLIC_WASABI_URL}/imgs/store_Icon.png`,
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
