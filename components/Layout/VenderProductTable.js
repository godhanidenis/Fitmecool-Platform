/* eslint-disable @next/next/no-img-element */
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
import { useRouter } from "next/router";
import { useState } from "react";
import { deleteProduct } from "../../graphql/mutations/products";
import { toast } from "react-toastify";
import HTMLReactParser from "html-react-parser";
import ConfirmationModal from "../Modal/ConfirmationModal";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { changeProductPage } from "../../redux/ducks/product";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#151827",
    color: "white",
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

const VenderProductTable = ({ productsData, getAllProducts }) => {
  const router = useRouter();
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState();

  const dispatch = useDispatch();
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
                  <StyledTableCell align="left" key={index}>
                    <b>{itm}</b>
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {productsData?.map((item, index) => (
                <StyledTableRow key={index}>
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell>
                    <div className="relative">
                      <Image
                        // className="object-cover"
                        objectFit="cover"
                        objectPosition="center top"
                        src={item?.product_image?.front}
                        width={"100%"}
                        height={"100%"}
                        alt="Product Image"
                      />
                    </div>
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
                    <>
                      <p>
                        WhatsAppInquiry : <b>{item.whatsapp_inquiry}</b>
                      </p>
                      <p>
                        ContactInquiry : <b>{item.contact_inquiry}</b>
                      </p>
                    </>
                  </TableCell>
                  <TableCell align="left">
                    <div className="flex gap-2">
                      <button
                        className={`flex justify-center items-center w-8 h-8 rounded-full transition-colors bg-black text-white duration-300 hover:opacity-80 `}
                        onClick={() => {
                          router?.push(
                            `/vendor/shop/${vendorShopDetails?.id}/addEditProduct/${item?.id}`
                          );
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
          onClickItemDelete={() => {
            deleteProduct({ id: deleteProductId }).then(
              (res) => {
                toast.success(res.data.deleteProduct, {
                  theme: "colored",
                });
                dispatch(changeProductPage(0));
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
