import WalletContextProvider from "contexts/WalletContextProvider";
import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { AppBar } from "../components/AppBar";
import { SearchBar } from "components/SearchBar";

require("@solana/wallet-adapter-react-ui/styles.css");

const Unauthorized: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>VillinzHUB</title>
      </Head>

      <WalletContextProvider>
        <div className="flex flex-col h-screen bg-redBackground overflow-scroll container-snap">
          <div className="md:hero mx-auto p-4 ">
            <div className="md:hero-content flex flex-col">
              <>
                <div>
                  <SearchBar />
                </div>
              </>
            </div>
          </div>
        </div>
      </WalletContextProvider>
    </>
  );
};

export default Unauthorized;
