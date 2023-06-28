import WalletContextProvider from "contexts/WalletContextProvider";
import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { AppBar } from "../components/AppBar";
import { SearchBar } from "components/SearchBar";
import { MintUnrevealed } from "components/mintUnrevealed";

require("@solana/wallet-adapter-react-ui/styles.css");

const Unauthorized: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>VillinzHUB</title>
      </Head>

      <WalletContextProvider>
        <div className="flex flex-col h-screen bg-redBackground overflow-scroll container-snap border-dotted border-2">
          <div className="md:hero mx-auto p-4 border-dotted border-2">
            <div className="md:hero-content flex flex-col border-dotted border-2">
              <>
                <div className="border-dotted border-2">
                  <SearchBar />
                </div>
              </>
            </div>
          </div>
          <div className="h-screen border-dotted border-2 ">
            <MintUnrevealed />
          </div>
        </div>
      </WalletContextProvider>
    </>
  );
};

export default Unauthorized;
