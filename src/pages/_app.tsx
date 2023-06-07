import WalletContextProvider from "contexts/WalletContextProvider";
import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { AppBar } from "../components/AppBar";
import AuthRouteGuard from "guard/RouteGuard";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const publicRoutes = ["/"];
  const privateRoutes = ["/home"];
  const errorRoutes = ["/unauthorized"];

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
          >
            <Component {...pageProps} />
          </AuthRouteGuard>
        </div>
      </WalletContextProvider>
    </>
  );
};

export default App;
