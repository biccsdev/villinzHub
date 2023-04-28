import WalletContextProvider from "contexts/WalletContextProvider";
import { AppProps } from "next/app";
import Head from "next/head";
import { FC, useState } from "react";
import { AppBar } from "../components/AppBar";
import Notifications from "../components/Notification";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>VillinzHUB</title>
      </Head>

      <WalletContextProvider>
        <div className="flex flex-col h-screen bg-redBackground overflow-scroll container-snap">
          {/* <Notifications /> */}
          <AppBar />
          <Component {...pageProps} />
        </div>
      </WalletContextProvider>
    </>
  );
};

export default App;
