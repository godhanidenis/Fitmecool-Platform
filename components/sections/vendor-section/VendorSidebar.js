import React, { useEffect, useState } from "react";
import { Tooltip, styled, tooltipClasses } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { TbShare3 } from "react-icons/tb";
import facebookIcon from "../../../assets/facebook.png";
import googleIcon from "../../../assets/googleIcon.svg";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Image from "next/image";

const VendorSidebar = ({ vendorShopDetails }) => {
  const [ratingValue, setRatingValue] = useState(null);

  const [OpenToolTip, setOpenToolTip] = useState(false);
  const pageShareURL = typeof window !== "undefined" && window.location.href;

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip open={OpenToolTip} {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#ffffff",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      boxShadow: "0 0 10px rgba(0,0,0,.1)",
    },
  }));

  const ShareIconComponent = React.forwardRef(function MyComponent(props, ref) {
    //  Spread the props to the underlying DOM element.
    return (
      <div {...props} ref={ref}>
        <TbShare3
          onClick={props.onClick}
          className="lg:text-2xl xl:text-3xl sm:text-xl text-2xl"
        />
      </div>
    );
  });

  const handleTooltipOpen = () => {
    setOpenToolTip(!OpenToolTip);
  };

  useEffect(() => {
    if (vendorShopDetails) {
      setRatingValue(vendorShopDetails?.shop_rating);
    }
  }, [vendorShopDetails]);

  return (
    <div className="bg-white rounded-3xl lg:p-10 p-5 py-10">
      <div className="flex justify-center">
        <div className="xl:w-[278px] xl:h-[278px] lg:h-[200px] sm:h-[150px] lg:w-[200px] sm:w-[150px] h-[200px] w-[200px] mb-10 rounded-full">
          <img
            src={vendorShopDetails?.shop_logo}
            className="object-cover rounded-full w-full h-full"
          />
        </div>
      </div>
      <div className="flex flex-col items-center lg:gap-2 gap-1">
        <div className="xl:text-4xl lg:text-xl sm:text-sm text-[32px] font-bold text-colorBlack">
          {vendorShopDetails?.shop_name}
        </div>
        <div className="flex items-center">
          <span>
            <LocationOnOutlinedIcon
              className="text-gray-400"
              sx={{
                fontSize: 24,
                "@media (max-width: 768px)": {
                  fontSize: 12,
                },
                "@media (max-width: 648px)": {
                  fontSize: 24,
                },
              }}
            />
          </span>
          <span className="xl:text-2xl lg:text-lg sm:text-sm text-[22px] text-gray-400">
            {vendorShopDetails?.branch_info?.map((item) =>
              item?.branch_type === "main" ? item.branch_address : ""
            )}
          </span>
        </div>
        <span className="flex items-center">
          <Rating
            sx={{
              fontSize: 16,
              "@media (max-width: 768px)": {
                fontSize: 10,
              },
              "@media (max-width: 648px)": {
                fontSize: 16,
              },
            }}
            precision={0.5}
            name="read-only"
            value={ratingValue}
            emptyIcon={
              <StarIcon
                sx={{
                  opacity: 0.55,
                  fontSize: 16,
                  "@media (max-width: 768px)": {
                    fontSize: 10,
                  },
                  "@media (max-width: 648px)": {
                    fontSize: 16,
                  },
                }}
              />
            }
            readOnly
          />
          {vendorShopDetails?.shop_rating !== null && (
            <Box
              sx={{
                ml: 1,
                fontSize: 18,
                "@media (max-width: 768px)": {
                  fontSize: 12,
                },
                "@media (max-width: 648px)": {
                  fontSize: 16,
                },
              }}
            >
              {ratingValue}
            </Box>
          )}
        </span>
        <div
          onMouseLeave={() => setOpenToolTip(false)}
          className="text-gray-400 m-10 border border-gray-200 rounded-full p-3 cursor-pointer"
        >
          <HtmlTooltip
            title={
              // <React.Fragment>
              <div className="flex">
                <div className="p-2 rounded-lg cursor-pointer">
                  <FacebookShareButton
                    windowWidth={900}
                    windowHeight={900}
                    url={pageShareURL}
                  >
                    <Image src={facebookIcon ?? ""} alt="facebookIcon" />
                  </FacebookShareButton>
                </div>
                <div className="p-2 rounded-lg cursor-pointer">
                  <WhatsappShareButton
                    windowWidth={900}
                    windowHeight={900}
                    url={pageShareURL}
                  >
                    <WhatsappIcon size={25} round={true} />
                  </WhatsappShareButton>
                </div>
                <div className="p-2 mt-[2px] rounded-lg cursor-pointer">
                  <EmailShareButton
                    subject="Product Detail Page"
                    windowWidth={900}
                    windowHeight={900}
                    url={pageShareURL}
                  >
                    <Image src={googleIcon ?? ""} alt="googleIcon" />
                  </EmailShareButton>
                </div>
              </div>
              // </React.Fragment>
            }
          >
            <ShareIconComponent onClick={handleTooltipOpen} />
          </HtmlTooltip>
        </div>
      </div>
    </div>
  );
};
export default VendorSidebar;
