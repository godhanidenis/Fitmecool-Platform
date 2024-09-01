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
import { assets } from "../constants";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID; // Replace with your GA Tracking ID

import CustomerCommonLayout from "../components/Layout/CustomerCommonLayout";
import Script from "next/script";
import { UserTypeProvider } from "../contexts/usertypecontext";
import RootLayout from "../components/Layout/RootLayout";

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
  return (
    <>
      <Head>
        <title>
          {pageProps?.productDetails?.data?.product?.data?.product_name ||
            pageProps?.shopDetails?.data?.shop?.shop_name ||
            "FitMeCool"}
        </title>

        <meta
          property="og:title"
          content={
            pageProps?.productDetails?.data?.product?.data?.product_name ||
            pageProps?.shopDetails?.data?.shop?.shop_name ||
            "FitMeCool"
          }
        />
        <meta
          property="og:description"
          content={
            pageProps?.productDetails?.data?.product?.data
              ?.product_description ||
            pageProps?.shopDetails?.data?.shop.branch_info.find(
              (branch) => branch?.branch_type === "main"
            )?.branch_address ||
            "Clothe Rent/ Sell Inquiry Platform"
          }
        />
        <meta
          property="og:image"
          content={
            pageProps?.productDetails?.data?.product?.data?.product_image?.front
              ?.medium ||
            pageProps?.shopDetails?.data?.shop.shop_logo?.small ||
            assets?.appLogo
          }
        />
        <meta
          property="og:url"
          content={typeof window !== "undefined" ? window.location.href : ""}
        />
      </Head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastContainer />
          <Provider store={store}>
            <RootLayout>
              <Component {...pageProps} />
            </RootLayout>
          </Provider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default MyApp;
