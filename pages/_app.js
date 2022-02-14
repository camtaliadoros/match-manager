import Head from 'next/head';
import { Provider } from 'react-redux';
import '../components/shared/dialogBox.scss';
import AuthState from '../firebase/authState';
import store from '../store/store';
import '../styles/globals.scss';

function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <Head>
          <link rel='stylesheet' href='https://use.typekit.net/tuo4kvr.css' />
        </Head>
        <AuthState />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default App;
