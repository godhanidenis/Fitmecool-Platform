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
import ConfirmationModal from "../Modal/ConfirmationModal";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { changeProductPage } from "../../redux/ducks/product";
import { loadVendorShopDetailsStart } from "../../redux/ducks/vendorShopDetails";
import { refactorPrice } from "../../utils/common";
import { deleteObjectsInFolder } from "../../services/wasabi";
import ImageLoadingSkeleton from "../Modal/ImageLoadingSkeleton";

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
  const { userProfile } = useSelector((state) => state.userProfile);

  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState();
  const [deletableProductFolderName, setDeletableProductFolderName] =
    useState();
  const [deleteLoader, setDeleteLoader] = useState(false);

  const dispatch = useDispatch();

  const deleteWasabiFolder = async (folderName) => {
    const folderStructure = `user_${userProfile?.id}/shop/${folderName}`;
    await deleteObjectsInFolder(folderStructure);
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
                  "Product Name",
                  "Price",
                  "Color",
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
                    <div className="relative flex justify-center items-center">
                      <div className="relative cursor-pointer pt-1 ps-1 overflow-hidden">
                        {item?.product_listing_type && (
                          <div className="absolute top-2 z-10">
                            <span
                              className={`label-small label-large arrowed-right text-white font-semibold ${
                                item?.product_listing_type === "rent"
                                  ? "bg-[#ff0000cc]"
                                  : "bg-[#29977E]"
                              }`}
                            >
                              {item?.product_listing_type === "sell"
                                ? "Sell"
                                : "Rent"}
                            </span>
                          </div>
                        )}

                        {item?.product_image?.front?.small ? (
                          <Image
                            objectFit="cover"
                            objectPosition="center top"
                            src={item?.product_image?.front?.small ?? ""}
                            unoptimized={true}
                            width={"100%"}
                            height={"100%"}
                            alt="Product Image"
                          />
                        ) : (
                          <ImageLoadingSkeleton
                            sx={{
                              backgroundColor: "gray",
                              width: "100px",
                              height: "100px",
                            }}
                            validClassName={true}
                          />
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="line-clamp-1">{item?.product_name}</div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="line-clamp-1">
                      ₹
                      {refactorPrice(
                        Math.round(
                          item?.product_price -
                            item?.product_price * (item?.product_discount / 100)
                        )
                      )}
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex items-center justify-center">
                      <span
                        className={`rounded-[50%] w-4 h-4 me-2 border `}
                        style={{
                          backgroundColor: item?.product_color,
                        }}
                      />
                      {item?.product_color}
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
                          setDeletableProductFolderName(
                            item?.product_image?.front?.small
                              ?.split("/products/")[1]
                              .split("/")[0]
                          );
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
          deleteLoader={deleteLoader}
          setDeleteModalOpen={setProductDeleteModalOpen}
          onClickItemDelete={async () => {
            setDeleteLoader(true);
            await deleteWasabiFolder(`products/${deletableProductFolderName}`);

            deleteProduct({ id: deleteProductId }).then(
              (res) => {
                toast.success(res.data.deleteProduct, {
                  theme: "colored",
                });
                dispatch(changeProductPage(0));
                getAllProducts();
                dispatch(loadVendorShopDetailsStart(vendorShopDetails?.id));
                setDeleteLoader(false);
              },
              (error) => {
                toast.error(error.message, { theme: "colored" });
                setDeleteLoader(false);
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
