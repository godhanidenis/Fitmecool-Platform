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
import { ApolloProvider } from "@apollo/client";
import client from "../graphql/apollo-client";

const theme = createTheme({
  palette: {
    primary: {
      main: "#95539B",
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Wedding Bell</title>
      </Head>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </ApolloProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
