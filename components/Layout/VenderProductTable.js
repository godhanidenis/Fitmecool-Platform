import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
} from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { deleteProduct } from "../../graphql/mutations/products";
import { toast } from "react-toastify";
import HTMLReactParser from "html-react-parser";
import ConfirmationModal from "../Modal/ConfirmationModal";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { changeProductPage } from "../../redux/ducks/product";
import { loadVendorShopDetailsStart } from "../../redux/ducks/vendorShopDetails";
import { fileDelete } from "../../services/wasabi";

const StyledTableCell = styled(TableCell)(({ theme, index }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#151827",
    color: "white",
    width: index === 0 ? "20px" : "100px",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const VenderProductTable = ({
  productsData,
  setAddEditProductShow,
  setEditableProductData,
  getAllProducts,
}) => {
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState();

  const [deletableProductsImages, setDeletableProductsImages] = useState([]);
  const [deletableProductVideo, setDeletableProductVideo] = useState();

  const dispatch = useDispatch();

  const deleteImageFiles = async (deletableProducts, type) => {
    try {
      const deletionPromises = deletableProducts.map((deleteProduct) =>
        fileDelete(deleteProduct, type)
      );
      await Promise.all(deletionPromises);
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  };

  return (
    <>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {[
                  "No",
                  "Thumbnail",
                  "Shop Name",
                  "Product Name",
                  "Color",
                  "Description",
                  "Inquiry",
                  "Action",
                ].map((itm, index) => (
                  <StyledTableCell align="center" key={index} index={index}>
                    <b>{itm}</b>
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {productsData?.map((item, index) => (
                <StyledTableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>
                    <div className="relative flex justify-center ">
                      <div className="relative cursor-pointer pt-1 ps-1 overflow-hidden ">
                        {item?.product_listing_type && (
                          <div className="absolute top-0">
                            <span
                              className={`z-10 absolute w-28 p-[1px] text-white text-[8px] font-semibold uppercase flex items-center justify-center transform -rotate-45 top-2 -left-[45px]  border-2 border-[#f5cd79] ${
                                item?.product_listing_type === "rent"
                                  ? "bg-[#ff3b3b]"
                                  : "bg-[#29977E]"
                              } `}
                            >
                              {item?.product_listing_type === "sell"
                                ? "Sell"
                                : "Rent"}
                            </span>
                            <span className="absolute top-0 z-0 left-8 p-1 bg-[#f19066]" />
                            <span className="absolute top-[36px] z-0 -left-[4px] p-1 bg-[#f19066]" />
                          </div>
                        )}

                        <Image
                          objectFit="cover"
                          objectPosition="center top"
                          src={item?.product_image?.front ?? ""}
                          unoptimized={true}
                          width={"100%"}
                          height={"100%"}
                          alt="Product Image"
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    {item?.branchInfo?.shop_info?.shop_name}
                  </TableCell>
                  <TableCell align="center">
                    <div className="line-clamp-1">{item?.product_name}</div>
                  </TableCell>
                  <TableCell align="center">{item?.product_color}</TableCell>
                  <TableCell align="center">
                    <div className="line-clamp-2">
                      {HTMLReactParser(item?.product_description)}
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex flex-col items-center">
                      <p className="flex justify-between p-1 whitespace-no-wrap w-[150px]">
                        WhatsApp Inquiry : <b>{item.whatsapp_inquiry}</b>
                      </p>
                      <p className="flex justify-between p-1 whitespace-no-wrap w-[150px]">
                        Contact Inquiry : <b>{item.contact_inquiry}</b>
                      </p>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-2 justify-center">
                      <button
                        className={`flex justify-center items-center w-8 h-8 rounded-full transition-colors bg-black text-white duration-300 hover:opacity-80 `}
                        onClick={() => {
                          setAddEditProductShow(true);
                          setEditableProductData(item);
                        }}
                      >
                        <EditIcon
                          sx={{
                            fontSize: 18,
                            "@media (max-width: 648px)": {
                              fontSize: 16,
                            },
                          }}
                        />
                      </button>
                      <button
                        className={`flex justify-center items-center w-8 h-8 rounded-full transition-colors bg-red-600 duration-300 hover:opacity-80`}
                        onClick={() => {
                          setProductDeleteModalOpen(true);
                          setDeleteProductId(item?.id);

                          setDeletableProductsImages(
                            ["front", "back", "side"].map(
                              (key) => item?.product_image[key]
                            )
                          );

                          if (item?.product_video) {
                            setDeletableProductVideo(item?.product_video);
                          }
                        }}
                      >
                        <DeleteIcon
                          className="!text-white"
                          sx={{
                            fontSize: 18,
                            "@media (max-width: 648px)": {
                              fontSize: 16,
                            },
                          }}
                        />
                      </button>
                    </div>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <ConfirmationModal
          type="product"
          deleteModalOpen={productDeleteModalOpen}
          setDeleteModalOpen={setProductDeleteModalOpen}
          deleteId={deleteProductId}
          onClickItemDelete={async () => {
            await deleteImageFiles(deletableProductsImages, "image");

            if (deletableProductVideo) {
              await deleteImageFiles([deletableProductVideo], "video");
            }

            deleteProduct({ id: deleteProductId }).then(
              (res) => {
                toast.success(res.data.deleteProduct, {
                  theme: "colored",
                });
                dispatch(changeProductPage(0));
                getAllProducts();
                dispatch(loadVendorShopDetailsStart(vendorShopDetails?.id));
              },
              (error) => {
                toast.error(error.message, { theme: "colored" });
              }
            );
            setProductDeleteModalOpen(false);
          }}
        />
      </div>
    </>
  );
};

export default VenderProductTable;
