import Head from "next/head";
import "../styles/globals.scss";
import { Provider } from "react-redux";
import store from "../store/store";
import UserAuth from "../components/auth/UserAuth";

function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <UserAuth />
          <Head>
            <link rel="stylesheet" href="https://use.typekit.net/tuo4kvr.css" />
          </Head>
          <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default App;
