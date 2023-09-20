import Head from "next/head";

import "../styles/globals.css";
import "../styles/auth.css";
import "../styles/product.css";
import "animate.css";
import "react-multi-carousel/lib/styles.css";
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
import { GoogleOAuthProvider } from "@react-oauth/google";
import appConfig from "../config";

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

  return (
    <>
      <Head>
        <title>{"Product Name"}</title>
        <meta property="og:title" content={"Product Name"} />
        <meta property="og:description" content={"Product Description"} />
        <meta
          property="og:image"
          content={
            "https://flyontech-rental-productt.s3.us-east-1.wasabisys.com/images/1695120844679.jpeg"
          }
        />
        <meta
          property="og:url"
          content={"https://rentbless.com/product/64ec3d12bf89b16590f424e5/"}
        />
      </Head>
      <GoogleOAuthProvider clientId={appConfig.googleClientId}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastContainer />
          <Provider store={store}>
            {!router.pathname.includes("/auth/") && <Header />}

            {router.pathname.includes("/vendor/") &&
            router.pathname !== "/vendor/shop-setup" &&
            !router.pathname.includes("/addEditProduct") ? (
              <VendorCommonLayout>
                <Component {...pageProps} />
              </VendorCommonLayout>
            ) : (
              <Component {...pageProps} />
            )}
            {!router.pathname.includes("/auth/") && <Footer />}
          </Provider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default MyApp;
