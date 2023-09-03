import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { SearchBar } from "components/SearchBar";
import { MintUnrevealed } from "components/mintUnrevealed";
import { MetaplexProvider } from "../components/MetaplexProvider";

require("@solana/wallet-adapter-react-ui/styles.css");

const VillinzHome: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>VillinzHUB</title>
      </Head>

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
    </>
  );
};

export default VillinzHome;
