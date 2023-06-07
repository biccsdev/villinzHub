import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import useUserNftStore from "stores/useUserNftStore";

const AuthRouteGuard = ({
  children,
  publicRoutes,
  errorRoutes,
  privateRoutes,
}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { getUserNfts } = useUserNftStore();
  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState(null);
  const [fetchingNfts, setFetchingNfts] = useState(true); // New state variable

  const router = useRouter();

  async function fetchData() {
    if (wallet.publicKey) {
      const holder = await getUserNfts(wallet.publicKey, connection);
      console.log(`holder: ${holder}`);
      if (holder !== null) {
        setFetchingNfts(false); // Set fetchingNfts to false when fetching is complete
      }
      setNfts(holder);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [wallet.publicKey, fetchingNfts]);

  useEffect(() => {
    if (privateRoutes.includes(router.pathname) && !wallet.publicKey) {
      router.push("/");
    } else if (publicRoutes.includes(router.pathname) && wallet.publicKey) {
      console.log(`fetching: ${fetchingNfts}`);
      console.log(`nfst: ${nfts}`);
      if (!fetchingNfts) {
        if (!nfts) {
          // Check for nfts being null
          router.push("/unauthorized");
        } else {
          router.push("/home");
        }
      }
    }
  }, [wallet.publicKey, nfts, fetchingNfts]);

  if (loading) {
    return null; // or render a loading spinner
  }

  return children;
};

export default AuthRouteGuard;
