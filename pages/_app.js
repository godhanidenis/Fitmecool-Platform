import Head from "next/head";

import "../styles/globals.css";
import "../styles/auth.css";
import "../styles/product.css";
import "animate.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";

import store from "../redux/store";
import { Provider } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { ToastContainer } from "react-toastify";
import VendorCommonLayout from "../components/Layout/VendorCommonLayout";
import { useRouter } from "next/router";
import { CssBaseline } from "@mui/material/";
import { useState } from "react";
import { useEffect } from "react";
import Script from "next/script";

const theme = createTheme({
  palette: {
    primary: {
      main: "#95539B",
    },
    background: {
      default: "#f1f3f6 !important",
    },
  },
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    if (window.history.state === "signin") {
      setModalType(window.history.state);
    } else {
      setModalType("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeof window !== "undefined" && window.history.state]);
  return (
    <>
      <Head>
        <title>Rentbless</title>
      </Head>

      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <Provider store={store}>
          <Header modalType={modalType} />
          {router.pathname.includes("/vendor/") &&
          router.pathname !== "/vendor/shop-setup" ? (
            <VendorCommonLayout>
              <Component {...pageProps} />
            </VendorCommonLayout>
          ) : (
            <Component {...pageProps} />
          )}
          <Footer />
        </Provider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
