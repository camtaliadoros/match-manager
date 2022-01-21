import Head from "next/head";
import "../styles/globals.scss";
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";



function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://use.typekit.net/tuo4kvr.css" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;


