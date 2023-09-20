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
        <title>Rentbless</title>
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
