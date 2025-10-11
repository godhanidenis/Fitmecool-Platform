import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UpperFilter from "../../../components/Filters/UpperFilter/UpperFilter";
import {
  changeProductPage,
  changeProductStatus,
  loadProductsStart,
  updateProductList,
} from "../../../redux/ducks/product";
import { vendorPrivateGaurd } from "../../../components/core/VendorAuthGaurd";
import AddIcon from "@mui/icons-material/Add";
import AddEditProductPage from "../../../components/sections/vendor-section/AddEditProductPage";
import { getProducts } from "../../../graphql/queries/productQueries";
import { toast } from "react-toastify";
import { convertProductStatus } from "../../../graphql/mutations/products";
import { getVendorShopDetails } from "../../../graphql/queries/shopQueries";
import { updateVendorShopDetails } from "../../../redux/ducks/vendorShopDetails";
import VenderProduct from "../../../components/Layout/VenderProduct";

const ShopDetailsPage = () => {
  const dispatch = useDispatch();

  const [isHydrated, setIsHydrated] = useState(false);

  const [addEditProductShow, setAddEditProductShow] = useState(false);

  const [editableProductData, setEditableProductData] = useState();
  const [activeProductLoader, setActiveProductLoader] = useState(false);
  const [totalActiveProductCount, setTotalActiveProductCount] = useState(0);
  const [convertLoading, setConvertLoading] = useState(false);
  const [selectedActiveProductList, setSelectedActiveProductList] = useState(
    []
  );
  const [selectedInActiveProductList, setSelectedInActiveProductList] =
    useState([]);
  const [getActiveProduct, setGetActiveProduct] = useState(false);
  const { productPageSkip, isActive } = useSelector((state) => state.products);
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

  const manageSelected = (id, prev) => {
    // Check if id already exists
    if (prev?.includes(id)) {
      // Remove it
      return prev?.filter((item) => item !== id);
    } else {
      // Add it
      return [...prev, id];
    }
  };
  const handleChangeIsActive = (id) => {
    if (isActive) {
      setSelectedActiveProductList((prev) => {
        return manageSelected(id, prev);
      });
    } else {
      setSelectedInActiveProductList((prev) => {
        return manageSelected(id, prev);
      });
    }
  };

  const handleConvert = () => {
    setConvertLoading(true);
    convertProductStatus({
      ids: isActive ? selectedActiveProductList : selectedInActiveProductList,
      isActive: !isActive,
    }).then(
      async (res) => {
        productPageSkip >= 6
          ? dispatch(changeProductPage(0))
          : await getAllProducts(isActive);
        await getActiveProducts();
        setConvertLoading(false);
        isActive
          ? setSelectedActiveProductList([])
          : setSelectedInActiveProductList([]);
        toast.success(res?.data?.changeProductStatus, {
          theme: "colored",
        });
      },
      (error) => {
        setConvertLoading(false);
        toast.error(error.message, { theme: "colored" });
      }
    );
  };

  const { appliedProductsFilters, sortFilters } = useSelector(
    (state) => state.productsFiltersReducer
  );

  const tabs = [
    { value: true, label: "Active" },
    { value: false, label: "In Active" },
  ];

  const getProductsPayload = {
    pageData: {
      skip: 0,
      limit: 6,
    },
    filter: {
      category_id: appliedProductsFilters.categoryId.selectedValue,
      product_color: appliedProductsFilters.productColor.selectedValue,
      product_price: {
        min: appliedProductsFilters.productPrice.selectedValue.min,
        max: appliedProductsFilters.productPrice.selectedValue.max,
      },
      product_listing_type:
        appliedProductsFilters.productListingType.selectedValue,
    },
    shopId: appliedProductsFilters.shopId.selectedValue,
    sort: sortFilters.sortType.selectedValue,
    search: appliedProductsFilters.searchBarData.selectedValue,
    forDashboard: true,
  };

  const getAllProducts = (is_active) => {
    dispatch(
      loadProductsStart({
        ...getProductsPayload,
        isActive:
          is_active === true || is_active === false ? is_active : isActive,
      })
    );
  };

  const getUpdatedProductList = async () => {
    await getProducts({
      ...getProductsPayload,
      isActive: isActive,
    }).then(
      async (res) => {
        dispatch(updateProductList(res?.data?.productList));
      },
      (error) => {
        console.log(
          "get error from get product list after upload image and videos :>>",
          error
        );
      }
    );
  };

  const getActiveProducts = useCallback(() => {
    setActiveProductLoader(true);
    getProducts({
      pageData: {
        skip: 0,
        limit: 1,
      },
      filter: {
        category_id: [],
        product_color: [],
        product_price: {
          min: 0,
          max: 0,
        },
        product_listing_type: "",
      },
      shopId: [vendorShopDetails?.id],
      sort: "",
      search: "",
      isActive: true,
    }).then(
      (res) => {
        setTotalActiveProductCount(res?.data?.productList?.count);
        setActiveProductLoader(false);
      },
      (err) => {
        console.log("error from get active product >> ", err);
        setActiveProductLoader(false);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorShopDetails?.id, getActiveProduct]);

  const getShopDetail = async () => {
    await getVendorShopDetails({
      id: vendorShopDetails.id,
      forDashboard: true,
    }).then(
      async (res) => {
        dispatch(updateVendorShopDetails(res?.data?.shop));
      },
      (error) => {
        console.log(
          "get error from get shop detail after subscription :>> ",
          error
        );
      }
    );
  };

  const activeProductLimit = useCallback(() => {
    const activeCountChange = isActive
      ? selectedActiveProductList?.length ?? 0
      : -(selectedInActiveProductList?.length ?? 0);

    const finalTotalCount = totalActiveProductCount - activeCountChange;

    return activeProductLoader
      ? 0
      : (vendorShopDetails?.productLimit ?? 0) - finalTotalCount;
  }, [
    activeProductLoader,
    isActive,
    selectedActiveProductList,
    selectedInActiveProductList,
    totalActiveProductCount,
    vendorShopDetails?.productLimit,
  ]);

  const isConvert =
    (isActive && selectedActiveProductList?.length > 0) ||
    (!isActive && selectedInActiveProductList?.length > 0);

  useEffect(() => {
    if (vendorShopDetails?.id) {
      getActiveProducts();
      getAllProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getActiveProducts, vendorShopDetails?.id]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }
  return !addEditProductShow ? (
    <div className="flex flex-col px-6 sm:px-0 h-full overflow-scroll hideScroll">
      <div className="flex justify-between items-center mb-2">
        <p
          className={`${
            activeProductLoader && "opacity-50"
          } font-semibold text-colorGreen text-lg`}
        >
          Active product limit:{" "}
          <span>
            {vendorShopDetails.productLimit === null
              ? "Unlimited"
              : activeProductLimit()}
          </span>
        </p>
        <button
          onClick={() => setAddEditProductShow(true)}
          className="flex items-center text-lg py-1 px-2 rounded-md border-2 bg-colorGreen text-white border-colorGreen"
        >
          <AddIcon className="mr-2" />
          Add Products
        </button>
      </div>

      <div>
        <UpperFilter showOnlyShopDetailPage={false} />
        <div className={`flex justify-center items-center mt-4 relative`}>
          <div className="flex items-center">
            {tabs.map((tab, index) => (
              <button
                key={index}
                disabled={convertLoading}
                onClick={() => {
                  dispatch(changeProductPage(0));
                  dispatch(changeProductStatus(tab.value));
                }}
                className={`${
                  convertLoading && "opacity-50"
                } p-2 font-semibold transition-all duration-300 w-[100px] flex justify-center
              ${
                isActive === tab.value
                  ? "border-b-2 border-colorGreen text-colorGreen"
                  : "border-b-2 border-[#ececec] text-black"
              }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {isConvert && (
            <button
              className={`${
                convertLoading && "opacity-50"
              } absolute right-0 font-semibold p-2 w-[150px] bg-[#29977d21] text-[#29977e] border-2 border-[#29977e] rounded-lg`}
              disabled={convertLoading}
              onClick={handleConvert}
            >
              {isActive ? "Set as Inactive" : "Set as Active"}
            </button>
          )}
        </div>
        <VenderProduct
          setAddEditProductShow={setAddEditProductShow}
          setEditableProductData={setEditableProductData}
          getAllProducts={getAllProducts}
          getShopDetail={getShopDetail}
          handleChangeIsActive={handleChangeIsActive}
          selectedActiveProductList={selectedActiveProductList}
          selectedInActiveProductList={selectedInActiveProductList}
          setGetActiveProduct={setGetActiveProduct}
          activeProductLimit={activeProductLimit}
        />
      </div>
    </div>
  ) : (
    <AddEditProductPage
      setAddEditProductShow={setAddEditProductShow}
      editableProductData={editableProductData}
      setEditableProductData={setEditableProductData}
      getAllProducts={getAllProducts}
      getShopDetail={getShopDetail}
      getUpdatedProductList={getUpdatedProductList}
      setGetActiveProduct={setGetActiveProduct}
    />
  );
};

export default vendorPrivateGaurd(ShopDetailsPage);
