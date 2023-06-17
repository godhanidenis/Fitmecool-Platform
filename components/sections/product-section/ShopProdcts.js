import removeArrowOnDeviceType from "react";
import Image from "next/image";
import Slider from "react-slick";
import CreateSharpIcon from "@mui/icons-material/CreateSharp";
import img from "../../../assets/product-image.png";

const ShopProducts = ({ product }) => {
  const items = [img, img, img].map((itm) => {
    return (
      <Image
        src={itm ?? ""}
        alt="aoa"
        width={250}
        height={400}
        className="rounded"
        key={itm}
      />
    );
  });

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-lg  grid grid-row-3">
      <div className="border-b">
        <div className="container my-[5px] cursor-pointer product-parent-div">
          <div className="grid grid-cols-1  place-items-center">
            <div className="w-[60%]">
              <Slider {...settings}>{items}</Slider>
            </div>
          </div>
          <button
            className={`w-10 h-10 rounded-full transition-colors bg-[#f5f5f5] duration-300 hover:opacity-80  absolute top-0 right-0`}
          >
            <CreateSharpIcon />
          </button>
        </div>
      </div>
      <div className="px-5 py-3">
        <p className="font-semibold text-colorBlack text-lg mt-2">
          {product.product_name}
        </p>
        <p className="text-[#888888] font-normal text-sm">
          {product.product_description}
        </p>
        <p className="font-semibold text-colorBlack text-lg mt-2">
          {product.product_color}
        </p>
      </div>
    </div>
  );
};

export default ShopProducts;
