import React, { useEffect, useState } from "react";
import { Avatar, Divider, Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import ImageLoadingSkeleton from "../../Modal/ImageLoadingSkeleton";
import { useSelector } from "react-redux";
import { vendorSidebarTabs } from "../../../constants";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteAccountConfirmationModal from "../../Modal/DeleteAccountConfirmationModal";

const VendorSidebar = ({ forHeader, handleMobileSidebarClick }) => {
  const router = useRouter();

  const [selectedValue, setSelectedValue] = useState("");
  const [deleteSelected, setDeleteSelected] = useState(false);

  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);

  useEffect(() => {
    const withoutLastChunk = router.pathname.slice(
      0,
      router.pathname.lastIndexOf("/")
    );

    if (router.pathname === "/vendor/dashboard") {
      setSelectedValue("Dashboard");
    } else if (router.pathname === "/vendor/shop-subscription") {
      setSelectedValue("Subscription");
    } else if (router.pathname === "/vendor/contact") {
      setSelectedValue("Subscription");
    } else if (withoutLastChunk === "/vendor/shopEdit") {
      setSelectedValue("Shop");
    } else if (
      withoutLastChunk === "/vendor/shop" ||
      `/vendor/shop/${vendorShopDetails?.id}/addEditProduct/`
    ) {
      setSelectedValue("Products");
    }
  }, [router.pathname, vendorShopDetails?.id]);

  return (
    <div className="flex flex-col justify-between h-full">
      <div
        className={`lg:p-6 p-5 sm:py-10 ${
          forHeader ? "flex" : "hidden"
        } lg:flex flex-col items-center`}
      >
        <div className="flex justify-center">
          <div className="w-[120px] h-[120px] mb-4 rounded-full">
            {vendorShopDetails?.shop_logo ? (
              <Avatar
                src={vendorShopDetails?.shop_logo ?? ""}
                key={new Date().getTime()}
                alt="Shop Logo"
                className="!object-cover !w-full !h-full"
              />
            ) : vendorShopDetails?.shop_logo?.length === 0 ? (
              <Avatar
                className="!bg-colorGreen"
                sx={{
                  fontSize: "70px",
                  width: "100%",
                  height: "100%",
                }}
              >
                {String(vendorShopDetails?.shop_name)
                  ?.split(" ")[0][0]
                  .toUpperCase()}
              </Avatar>
            ) : (
              <ImageLoadingSkeleton
                className="rounded-full"
                variant="circular"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col items-center lg:gap-2 gap-1 w-full">
          <div className="lg:text-3xl text-[32px] font-bold text-[#151827] pb-2 w-full text-center">
            {vendorShopDetails?.shop_name ?? <Skeleton animation="wave" />}
          </div>
          <Divider className="!w-full !opacity-50 " />
          <div className="w-full font-Nova mt-5">
            {vendorSidebarTabs.map((tab, index) => (
              <p
                key={index}
                onClick={() => {
                  forHeader && handleMobileSidebarClick();

                  if (tab.label === "Shop" || tab.label === "Products") {
                    router.push(`${tab.path}/${vendorShopDetails?.id}`);
                  } else {
                    router.push(tab.path);
                  }
                }}
                className={`font-semibold p-3 m-1 text-lg ${
                  selectedValue === tab.label
                    ? "text-[#29977E] bg-[#29977d21]"
                    : "text-[#151827]"
                } cursor-pointer uppercase flex items-center rounded-xl gap-4 hover:bg-[#29977d0c]`}
              >
                {tab.icon}
                {tab.label}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`w-full font-Nova lg:p-6 p-5 sm:py-10 ${
          forHeader ? "flex" : "hidden"
        } lg:flex flex-col`}
      >
        <p
          className={`font-semibold p-3 m-1 text-lg ${
            deleteSelected ? "text-red-500 bg-[#97292921]" : "text-red-500"
          } cursor-pointer uppercase flex items-center rounded-xl gap-4 hover:bg-[#9729290e]`}
          onClick={() => {
            setDeleteSelected(true);
            setProductDeleteModalOpen(true);
          }}
        >
          <DeleteIcon /> Delete Account
        </p>
      </div>
      <DeleteAccountConfirmationModal
        setDeleteSelected={setDeleteSelected}
        deleteModalOpen={productDeleteModalOpen}
        setDeleteModalOpen={setProductDeleteModalOpen}
      />
    </div>
  );
};

export default VendorSidebar;
