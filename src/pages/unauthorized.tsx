import WalletContextProvider from "contexts/WalletContextProvider";
import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { AppBar } from "../components/AppBar";

// require("@solana/wallet-adapter-react-ui/styles.css");
// require("../styles/globals.css");

const Unauthorized: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>VillinzHUB</title>
      </Head>

      <WalletContextProvider>
        <div className="flex flex-col h-screen bg-redBackground overflow-scroll container-snap">
          <div className="w-full text-5xl text-center pb-2 mr-28  font-bold text-whiteNavbar">
            <h1 className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              Sorry, you are not a holder...
            </h1>
            <h2 className="mt-5 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              Go grab a VILLIN over at{" "}
              <a
                href="https://magiceden.io/marketplace/madvillevillinz"
                className="underline"
                target="_blank"
              >
                Magic Eden
              </a>
            </h2>
          </div>
        </div>
      </WalletContextProvider>
    </>
  );
};

export default Unauthorized;
