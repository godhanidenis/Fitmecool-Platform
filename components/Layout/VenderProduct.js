import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState } from "react";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { deleteObjectsInFolder } from "../../services/wasabi";
import { refactorPrice, scrollToTitleName } from "../../utils/common";
import { changeProductPage } from "../../redux/ducks/product";
import ImageLoadingSkeleton from "../Modal/ImageLoadingSkeleton";
import ProductTable from "../core/ProductTable";
import { deleteProduct } from "../../graphql/mutations/products";
import { loadVendorShopDetailsStart } from "../../redux/ducks/vendorShopDetails";
import ConfirmationModal from "../Modal/ConfirmationModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CommonConfirmationModal from "../Modal/CommonConfirmationModal";
import { useRouter } from "next/router";

const VenderProduct = ({
  setAddEditProductShow,
  setEditableProductData,
  getAllProducts,
  getShopDetail,
  handleChangeIsActive,
  selectedActiveProductList,
  selectedInActiveProductList,
  setGetActiveProduct,
  activeProductLimit,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userProfile } = useSelector((state) => state.userProfile);
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const { productsData, productsCount, productPageSkip, loading, isActive } =
    useSelector((state) => state.products);

  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deletableProductFolderName, setDeletableProductFolderName] =
    useState();
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [warningModalId, setWarningModalId] = useState(null);

  const deleteWasabiFolder = async (folderName) => {
    const folderStructure = `user_${userProfile?.id}/shop/${folderName}`;
    await deleteObjectsInFolder(folderStructure);
  };

  const handlePageChange = (page) => {
    scrollToTitleName();
    dispatch(changeProductPage(page === 1 ? 0 : (page - 1) * 6));
  };

  const noMoreSelection = !isActive && activeProductLimit() === 0;

  const disableRow = useCallback(
    (rowId) => {
      if (isActive) {
        if (selectedActiveProductList?.includes(rowId)) {
          // return { bg: "!bg-blue-50", border: "!border-blue-500" };
          return { bg: "!bg-[#d5d5d5a8]", border: "!border-[#9b9b9b]" };
        } else {
          return { bg: "", border: "!border-gray-200" };
        }
      } else {
        if (selectedInActiveProductList?.includes(rowId)) {
          return { bg: "!bg-[#29977d21]", border: "!border-[#29977e]" };
        } else if (noMoreSelection) {
          return {
            bg: "!bg-[#1616161f]",
            border: "!border-[#9e9fa180]",
          };
        } else {
          return { bg: "", border: "!border-gray-200" };
        }
      }
    },
    [
      isActive,
      selectedInActiveProductList,
      selectedActiveProductList,
      noMoreSelection,
    ]
  );

  const columns = [
    {
      header: "No",
      field: "no",
      width: "50px",
    },
    {
      header: "Visible",
      field: "id",
      render: (val) => {
        const isActiveProduct = () => {
          if (isActive) {
            if (!selectedActiveProductList?.includes(val)) {
              return true;
            } else {
              return false;
            }
          } else {
            if (!selectedInActiveProductList?.includes(val)) {
              return false;
            } else {
              return true;
            }
          }
        };
        const isDisable = () => {
          if (noMoreSelection && !selectedInActiveProductList?.includes(val)) {
            return true;
          } else {
            return false;
          }
        };
        const handleSelect = () => {
          if (isDisable()) {
            setWarningModalId(val);
          } else {
            handleChangeIsActive(val);
          }
        };

        return (
          <>
            <div className="flex justify-center">
              <button
                // disabled={isDisable()}
                className={`${
                  isActiveProduct()
                    ? "bg-colorGreen text-white"
                    : "bg-colorGrey text-black"
                } px-4 py-1 flex items-center w-fit`}
                onClick={handleSelect}
              >
                {isActiveProduct() ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </button>
            </div>
            {warningModalId === val && (
              <CommonConfirmationModal
                open={!!warningModalId}
                onClose={() => setWarningModalId(null)}
                onConfirm={() => router.push("/vendor/subscription/")}
                confirmText="Upgrade Now"
                title="Active Product Limit Reached"
                message="You have reached the limit of active products for your current plan. Please upgrade your subscription to activate more products."
                iconColor="#f08a0a"
              />
            )}
          </>
        );
      },
    },
    {
      header: "Thumbnail",
      field: "product_image",
      render: (value, row) => (
        <div className="relative flex justify-center items-center">
          <div className="relative cursor-pointer pt-1 ps-1 overflow-hidden">
            {row?.product_listing_type && (
              <div className="absolute top-2 z-10">
                <span
                  className={`label-small label-large arrowed-right text-white font-semibold ${
                    row?.product_listing_type === "rent"
                      ? "bg-[#ff0000cc]"
                      : "bg-[#29977E]"
                  }`}
                >
                  {row?.product_listing_type === "sell" ? "Sell" : "Rent"}
                </span>
              </div>
            )}

            {row?.product_image?.front?.small ? (
              <Image
                objectFit="cover"
                objectPosition="center top"
                src={row?.product_image?.front?.small ?? ""}
                unoptimized={true}
                width={100}
                height={100}
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
      ),
    },
    {
      header: "Product Name",
      field: "product_name",
      render: (value) => <div className="line-clamp-1">{value}</div>,
    },
    {
      header: "Price",
      field: "product_price",
      render: (value, row) => (
        <div className="line-clamp-1">
          ₹
          {refactorPrice(
            Math.round(
              row?.product_price -
                row?.product_price * (row?.product_discount / 100)
            )
          )}
        </div>
      ),
    },
    {
      header: "Color",
      field: "product_color",
      render: (value) => (
        <div className="flex items-center justify-center">
          <span
            className="rounded-full w-4 h-4 me-2 border"
            style={{ backgroundColor: value }}
          />
          {value}
        </div>
      ),
    },
    {
      header: "Inquiry",
      field: "inquiry",
      render: (value, row) => (
        <div className="flex flex-col items-center">
          <p className="flex justify-between p-1 whitespace-no-wrap w-[150px]">
            WhatsApp Inquiry : <b>{row.whatsapp_inquiry}</b>
          </p>
          <p className="flex justify-between p-1 whitespace-no-wrap w-[150px]">
            Contact Inquiry : <b>{row.contact_inquiry}</b>
          </p>
        </div>
      ),
    },
    {
      header: "Action",
      field: "actions",
      render: (value, row) => (
        <div className="flex gap-2 justify-center">
          <button
            className="flex justify-center items-center w-8 h-8 rounded-full bg-black text-white hover:opacity-80"
            onClick={() => {
              setAddEditProductShow(true);
              setEditableProductData(row);
            }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </button>
          <button
            className="flex justify-center items-center w-8 h-8 rounded-full bg-red-600 text-white hover:opacity-80"
            onClick={() => {
              setProductDeleteModalOpen(true);
              setDeleteProductId(row?.id);
              setDeletableProductFolderName(
                row?.product_image?.front?.small
                  ?.split("/products/")[1]
                  ?.split("/")[0]
              );
            }}
          >
            <DeleteIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      ),
    },
  ];

  const rows = productsData?.map((item, index) => ({
    no: productPageSkip + index + 1,
    id: item?.id,
    ...item,
  }));

  return (
    <>
      <ProductTable
        columns={columns}
        rows={rows}
        loading={loading}
        productsCount={productsCount}
        productPageSkip={productPageSkip}
        onPageChange={handlePageChange}
        rowsPerPage={6}
        disableRow={disableRow}
      />

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
              toast.success(res.data.deleteProduct, { theme: "colored" });
              dispatch(changeProductPage(0));
              getAllProducts();
              getShopDetail();
              setGetActiveProduct((prev) => !prev);
              handleChangeIsActive(deleteProductId);
              setDeleteProductId(null);
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
    </>
  );
};

export default VenderProduct;
