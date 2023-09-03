import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import useUserNftStore from "stores/useUserNftStore";
import { PublicKey } from "@solana/web3.js";

const AuthRouteGuard = ({
  children,
  publicRoutes,
  errorRoutes,
  privateRoutes,
  routerContext,
}) => {
  const wallet = useWallet();
  const { getUserNfts } = useUserNftStore();
  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState(null);
  const [fetchingNfts, setFetchingNfts] = useState(true);
  const router = routerContext;

  const checkRouteGuard = () => {
    if (privateRoutes.includes(router.pathname) && !wallet.publicKey) {
      router.push("/");
    } else if (publicRoutes.includes(router.pathname) && wallet.publicKey) {
      if (!fetchingNfts) {
        if (
          !nfts &&
          wallet.publicKey !=
            new PublicKey("EHxBwGsZDLCtdguVtgzkyiq9Hrw2BHdk73aMMeBKBgRB")
        ) {
          router.push("/unauthorized");
        } else {
          router.push("/home");
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (wallet.publicKey) {
        const holder = await getUserNfts(wallet.publicKey);
        setNfts(holder);
        if (holder !== null) {
          setFetchingNfts(false);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [wallet.publicKey]);

  useEffect(() => {
    checkRouteGuard();
  }, [wallet.publicKey, nfts, fetchingNfts]);

  if (loading) {
    return null; // or render a loading spinner
  }

  return children;
};

export default AuthRouteGuard;
