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
import Script from "next/script";
import Image from "next/image";
import { assets } from "../constants";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoLoading, setIsLogoLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLogoLoading(false);
    }, 1200);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  }, []);

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
          {pageProps?.productDetails?.data?.product?.data?.product_name}
        </title>
        <meta
          property="og:title"
          content={pageProps?.productDetails?.data?.product?.data?.product_name}
        />
        {/* <meta property="og:description" content={"Product Description"} /> */}
        <meta
          property="og:image"
          content={
            pageProps?.productDetails?.data?.product?.data?.product_image?.front
          }
        />
        <meta
          property="og:url"
          content={typeof window !== "undefined" ? window.location.href : ""}
        />
      </Head>
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastContainer />

          <Provider store={store}>
            {isLogoLoading && (
              <div className="fixed flex justify-center z-10 bg-[#0000006e] w-full h-full">
                <div className="flex flex-col justify-center items-center">
                  <div className="flex flex-col justify-center items-center bg-[#ffffff41] p-5 rounded-xl">
                    <Image
                      src={assets.appBlackLogo}
                      alt="AppLogo"
                      width={80}
                      height={80}
                      className="animate-bounce"
                    />
                    <div className="text-[24px] font-bold text-black tracking-wider font-Nova ">
                      R<span className="text-[20px]">entbless</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!router.pathname.includes("/auth/") && <Header />}
            {isLoading && <div className="h-screen" />}
            <div>
              {router.pathname.includes("/vendor/") &&
              router.pathname !== "/vendor/shop-setup" ? (
                <VendorCommonLayout>
                  <Component {...pageProps} />
                </VendorCommonLayout>
              ) : router.pathname === "/auth/user-type" ||
                router.pathname === "/auth/signup" ||
                router.pathname === "/auth/signin" ? (
                <AuthCommonLayout>
                  <Component {...pageProps} />
                </AuthCommonLayout>
              ) : (
                <Component {...pageProps} />
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
