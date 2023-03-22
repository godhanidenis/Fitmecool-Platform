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

const theme = createTheme({
  palette: {
    primary: {
      main: "#95539B",
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
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <Provider store={store}>
          <Header />
          {router.pathname.includes("/vendor/") ? (
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
