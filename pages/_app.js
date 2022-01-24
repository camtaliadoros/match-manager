import Head from "next/head";
import "../styles/globals.scss";
import { Provider } from 'react-redux';
import store from '../store/store'


function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <Head>
          <link rel="stylesheet" href="https://use.typekit.net/tuo4kvr.css" />
        </Head>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default App;
