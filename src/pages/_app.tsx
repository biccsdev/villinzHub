import WalletContextProvider from "contexts/WalletContextProvider";
import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { AppBar } from "../components/AppBar";
import AuthRouteGuard from "guard/RouteGuard";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  // Move here all the data fetching in order to reduce API calls
  const publicRoutes = ["/"];
  const privateRoutes = ["/home"];
  const errorRoutes = ["/unauthorized"];

  /*
    DATA FETCHING RETRIEVED FROM OTHER COMPONENTS IN ORDER TO 
    PREVENT UNNECESSARY DATA FETCHING
  */
  // RouteGuards variables
  // const wallet = useWallet();
  const { connection } = useConnection();
  // const { getUserNfts } = useUserNftStore();
  const router = useRouter();
  // /Home/Index variables

  return (
    <>
      <Head>
        <title>VillinzHUB</title>
      </Head>

      <WalletContextProvider>
        <div className="flex flex-col h-screen bg-redBackground overflow-scroll container-snap">
          <AppBar />
          <AuthRouteGuard
            publicRoutes={publicRoutes}
            errorRoutes={errorRoutes}
            privateRoutes={privateRoutes}
            routerContext={router}
          >
            <Component {...pageProps} />
          </AuthRouteGuard>
        </div>
      </WalletContextProvider>
    </>
  );
};

export default App;
