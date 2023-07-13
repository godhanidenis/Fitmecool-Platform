import {
  Box,
  Button,
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
import { CustomAuthModal } from "../core/CustomMUIComponents";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  maxWidth: "1200px",
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  borderRadius: "12px",
  height: "auto",
};

const VenderProductTable = ({
  productsData,
  setProductPageSkip,
  getAllProducts,
}) => {
  const router = useRouter();
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );
  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState();

  return (
    <>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <b>No</b>
                </TableCell>
                <TableCell align="left">
                  <b>Thumbnail</b>
                </TableCell>
                <TableCell align="left">
                  <b>Shop Name</b>
                </TableCell>
                <TableCell align="left">
                  <b>Product Name</b>
                </TableCell>
                <TableCell align="left">
                  <b>Color</b>
                </TableCell>
                <TableCell align="left">
                  <b>Description</b>
                </TableCell>
                <TableCell align="left">
                  <b>Action</b>
                </TableCell>
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
                  {/* <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell> */}
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
                      {item?.product_description}
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
        <CustomAuthModal
          open={productDeleteModalOpen}
          onClose={() => setProductDeleteModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="animate__animated animate__slideInDown"
        >
          <Box sx={style} className="!w-[90%] lg:!w-1/2">
            <div className="p-5">
              <div className="flex items-center">
                <p className="flex items-center text-colorBlack text-xl font-semibold">
                  Confirmation Modal
                </p>
              </div>

              <div className="p-5 text-colorBlack text-lg font-normal">
                Are you sure delete this Product <b>{deleteProductId}</b>.
              </div>

              <div className="container mt-5 flex items-center justify-end gap-5">
                <Button
                  variant="outlined"
                  className="rounded-xl capitalize !text-colorBlack py-2 px-5"
                  onClick={() => setProductDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  className="rounded-xl capitalize !text-colorWhite !bg-red-600 hover:!bg-red-600 py-2 px-5"
                  onClick={() => {
                    if (isAuthenticate) {
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
                    } else {
                      router.push("/auth/user-type");
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Box>
        </CustomAuthModal>
      </div>
    </>
  );
};

export default VenderProductTable;
