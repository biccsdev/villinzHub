import WalletContextProvider from "contexts/WalletContextProvider";
import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { AppBar } from "../components/AppBar";
import { SearchBar } from "components/SearchBar";
import { MintUnrevealed } from "components/mintUnrevealed";
import { MetaplexProvider } from "./MetaplexProvider";

require("@solana/wallet-adapter-react-ui/styles.css");

const VillinzHome: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>VillinzHUB</title>
      </Head>

      {/* probablemente estoy pasando es WalletContextProvider de manera innecesaria aqui porque el parent de esta clase ( _app.tsx) ya esta usando el context y se lo pasa a este componente creo  */}
      {/* <WalletContextProvider> */}
      <div className="flex flex-col h-screen bg-redBackground overflow-scroll container-snap ">
        <MetaplexProvider>
          <div className="h-screen ">
            <MintUnrevealed />
          </div>
        </MetaplexProvider>
        <div className="md:hero mx-auto p-4 ">
          <div className="md:hero-content flex flex-col ">
            <>
              <div className="">
                <SearchBar />
              </div>
            </>
          </div>
        </div>
      </div>
      {/* </WalletContextProvider> */}
    </>
  );
};

export default VillinzHome;
