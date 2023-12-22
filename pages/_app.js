import Head from "next/head";

import "../styles/globals.css";
import "animate.css";
import "react-multi-carousel/lib/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "suneditor/dist/css/suneditor.min.css";

import store from "../redux/store";
import { Provider } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { ToastContainer } from "react-toastify";
import VendorCommonLayout from "../components/Layout/VendorCommonLayout";
import { useRouter } from "next/router";
import { CssBaseline } from "@mui/material/";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import AuthCommonLayout from "../components/Layout/AuthCommonLayout";

import CustomerCommonLayout from "../components/Layout/CustomerCommonLayout";

const theme = createTheme({
  palette: {
    primary: {
      main: "#151827",
    },
    secondary: {
      main: "#29977E",
    },
    background: {
      default: "#FAFCFC !important",
    },
  },
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === null) {
        router.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>
          {pageProps?.productDetails?.data?.product?.data?.product_name ||
            pageProps?.shopDetails?.data?.shop?.shop_name}
        </title>

        <meta
          property="og:title"
          content={
            pageProps?.productDetails?.data?.product?.data?.product_name ||
            pageProps?.shopDetails?.data?.shop?.shop_name
          }
        />
        <meta
          property="og:description"
          content={
            pageProps?.productDetails?.data?.product?.data
              ?.product_description ||
            pageProps?.shopDetails?.data?.shop.branch_info.find(
              (branch) => branch?.branch_type === "main"
            )?.branch_address
          }
        />
        <meta
          property="og:image"
          content={
            pageProps?.productDetails?.data?.product?.data?.product_image?.front
              ?.small || pageProps?.shopDetails?.data?.shop.shop_logo?.small
          }
        />
        <meta
          property="og:url"
          content={typeof window !== "undefined" ? window.location.href : ""}
        />
      </Head>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastContainer />

          <Provider store={store}>
            {!router.pathname.includes("/auth/") && (
              <Header
                setAccessToken={setAccessToken}
                accessToken={accessToken}
              />
            )}

            <div>
              {router.pathname.includes("/vendor/") &&
              router.pathname !== "/vendor/shop-setup" ? (
                <VendorCommonLayout setAccessToken={setAccessToken}>
                  <Component {...pageProps} />
                </VendorCommonLayout>
              ) : router.pathname === "/auth/user-type" ||
                router.pathname === "/auth/signup" ||
                router.pathname === "/auth/signin" ? (
                <AuthCommonLayout>
                  <Component {...pageProps} />
                </AuthCommonLayout>
              ) : (
                <CustomerCommonLayout>
                  <Component {...pageProps} />
                </CustomerCommonLayout>
              )}
            </div>
            {!router.pathname.includes("/auth/") &&
              !router.pathname.includes("/vendor/") && <Footer />}
          </Provider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default MyApp;
