// Next, React
import { FC, useEffect, useState } from "react";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Components
import { SearchBar } from "components/SearchBar";

// Store
import useUserNftStore from "stores/useUserNftStore";

export const HomeView: FC = ({}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isHolder, setIsHolder] = useState(null);

  const wallet = useWallet();
  const { connection } = useConnection();

  const nftss = useUserNftStore((s) => s.holder);
  const { getUserNfts } = useUserNftStore();

  useEffect(() => {
    let isMounted = true; // Add a variable to track if the component is mounted

    async function fetchData() {
      if (wallet.publicKey) {
        const userNfts = await getUserNfts(wallet.publicKey);
        if (isMounted) {
          setIsHolder(userNfts); // Update state only if the component is still mounted
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false; // Set the variable to false when the component unmounts
    };
  }, [wallet.publicKey, connection, getUserNfts]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  if (isError) {
    return <div>Error fetching data.</div>;
  }

  return (
    <>
      <div>
        <h1 className="w-full text-5xl text-center pb-2 mr-28 font-bold text-whiteNavbar">
          Welcome to the{" "}
          <span className="bg-[url('/flames.gif')] bg-clip-text text-transparent drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            VillinzHUB
          </span>
        </h1>
        <h3 className="w-full text-xl text-center pb-2 mr-28 font-bold text-whiteNavbar">
          Connect your wallet to enter
        </h3>
      </div>
    </>
  );
};
