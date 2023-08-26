/* eslint-disable @next/next/no-img-element */
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";
import { deleteProduct } from "../../graphql/mutations/products";
import { toast } from "react-toastify";
import HTMLReactParser from "html-react-parser";
import ConfirmationModal from "../Modal/ConfirmationModal";

const VenderProductTable = ({
  productsData,
  setProductPageSkip,
  getAllProducts,
}) => {
  const router = useRouter();
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState();

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
                  "Action",
                ].map((itm, index) => (
                  <TableCell align="left" key={index}>
                    <b>{itm}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {productsData?.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell align="left">
                    <img
                      className="w-16 h-12 object-cover"
                      src={item?.product_image?.front}
                      alt=""
                    />
                  </TableCell>
                  <TableCell align="left">
                    {item?.branchInfo?.shop_info?.shop_name}
                  </TableCell>
                  <TableCell align="left">{item?.product_name}</TableCell>
                  <TableCell align="left">{item?.product_color}</TableCell>
                  <TableCell align="left">
                    <div className="line-clamp-2">
                      {HTMLReactParser(item?.product_description)}
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    <div className="flex gap-2">
                      <button
                        className={`sm:w-10 sm:h-10 w-8 h-8 rounded-full transition-colors bg-black text-white duration-300 hover:opacity-80 `}
                        onClick={() => {
                          router?.push(
                            `/vendor/shop/${vendorShopDetails?.id}/addEditProduct/${item?.id}`
                          );
                        }}
                      >
                        <EditIcon
                          sx={{
                            fontSize: 20,
                            "@media (max-width: 648px)": {
                              fontSize: 16,
                            },
                          }}
                        />
                      </button>
                      <button
                        className={`sm:w-10 sm:h-10 w-8 h-8 rounded-full transition-colors bg-[#D63848] duration-300 hover:opacity-80`}
                        onClick={() => {
                          setProductDeleteModalOpen(true);
                          setDeleteProductId(item?.id);
                        }}
                      >
                        <DeleteIcon
                          className="!text-white"
                          sx={{
                            fontSize: 20,
                            "@media (max-width: 648px)": {
                              fontSize: 16,
                            },
                          }}
                        />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <ConfirmationModal
          type="product"
          deleteModalOpen={productDeleteModalOpen}
          setDeleteModalOpen={setProductDeleteModalOpen}
          deleteId={deleteProductId}
          onClickItemDelete={() => {
            deleteProduct({ id: deleteProductId }).then(
              (res) => {
                toast.success(res.data.deleteProduct, {
                  theme: "colored",
                });
                setProductPageSkip(0);
                getAllProducts();
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
