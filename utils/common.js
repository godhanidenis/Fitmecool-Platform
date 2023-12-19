export function formatDate(inputDateStr) {
  const options = { year: "numeric", month: "short", day: "2-digit" };
  const date = new Date(inputDateStr);
  return date.toLocaleDateString("en-US", options);
}

export const getReviewedTimeString = (updatedAt) => {
  const now = new Date();
  const updatedDate = new Date(parseInt(updatedAt));
  const timeDiff = now - updatedDate;

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const diffInMonths = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));

  if (diffInMonths === 0) {
    if (days > 0) {
      return `Reviewed ${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `Reviewed ${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `Reviewed ${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else {
      return "Reviewed just now";
    }
  } else if (diffInMonths === 1) {
    return "Reviewed 1 month ago";
  } else {
    return `Reviewed ${diffInMonths} months ago`;
  }
};

export const generateRandomNumberString = (length) => {
  let result = "";
  const characters = "0123456789";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

export const refactorPrice = (data) => {
  if (Number.isInteger(Number(data))) {
    return Number(data);
  } else {
    return Number(Number(data).toFixed(2));
  }
};

export const scrollToTitleName = () => {
  const targetElement = document.getElementById("titleName");
  if (targetElement) {
    const targetScrollPosition = targetElement.getBoundingClientRect().top;
    window.scrollTo({
      top: window.scrollY + targetScrollPosition,
      behavior: "smooth",
    });
  }
};

export const generateFileType = (fileType) => {
  if (fileType === "image/png") {
    return ".png";
  } else if (fileType === "image/jpeg") {
    return ".jpeg";
  } else if (fileType === "image/jpg") {
    return ".jpg";
  } else if (fileType === "image/heic") {
    return ".heic";
  } else if (fileType === "video/mp4") {
    return ".mp4";
  }
};

export const productImageSizeVariants = [
  {
    width: Number(process.env.NEXT_PUBLIC_PRODUCT_SMALL_VARIANT),
    size: "small",
  },
  {
    width: Number(process.env.NEXT_PUBLIC_PRODUCT_MEDIUM_VARIANT),
    size: "medium",
  },
  {
    width: Number(process.env.NEXT_PUBLIC_PRODUCT_LARGE_VARIANT),
    size: "large",
  },
];

export const shopLogoSizeVariants = [
  {
    width: Number(process.env.NEXT_PUBLIC_SHOP_LOGO_EXTRA_SMALL_VARIANT),
    size: "extraSmall",
  },
  {
    width: Number(process.env.NEXT_PUBLIC_SHOP_LOGO_SMALL_VARIANT),
    size: "small",
  },
  {
    width: Number(process.env.NEXT_PUBLIC_SHOP_LOGO_MEDIUM_VARIANT),
    size: "medium",
  },
  {
    width: Number(process.env.NEXT_PUBLIC_SHOP_LOGO_LARGE_VARIANT),
    size: "large",
  },
];

export const shopCoverSizeVariants = [
  {
    width: Number(process.env.NEXT_PUBLIC_SHOP_COVER_SMALL_VARIANT),
    size: "small",
  },
  {
    width: Number(process.env.NEXT_PUBLIC_SHOP_COVER_MEDIUM_VARIANT),
    size: "medium",
  },
  {
    width: Number(process.env.NEXT_PUBLIC_SHOP_COVER_LARGE_VARIANT),
    size: "large",
  },
];

export const shopImageSizeVariants = [
  {
    width: Number(process.env.NEXT_PUBLIC_SHOP_SMALL_VARIANT),
    size: "small",
  },
  {
    width: Number(process.env.NEXT_PUBLIC_SHOP_MEDIUM_VARIANT),
    size: "medium",
  },
];
