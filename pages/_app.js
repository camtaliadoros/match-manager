import Head from "next/head";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://use.typekit.net/tuo4kvr.css" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
