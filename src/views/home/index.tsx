// Next, React
import { FC, useEffect, useState } from "react";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Components
import { SearchBar } from "components/SearchBar";

// Store
import useUserNftStore from "stores/useUserNftStore";

export const HomeView: FC = ({}) => {
  const [isHolder, setIsHolder] = useState(null);

  const wallet = useWallet();
  const { connection } = useConnection();

  const nftss = useUserNftStore((s) => s.holder);
  const { getUserNfts } = useUserNftStore();

  useEffect(() => {
    async function fetchData() {
      if (wallet.publicKey) {
        await getUserNfts(wallet.publicKey, connection);
        setIsHolder(nftss);
      }
    }
    fetchData();
  }, [wallet.publicKey, connection, getUserNfts, nftss]);

  return (
    <div className="md:hero mx-auto p-4 ">
      <div className="md:hero-content flex flex-col">
        {isHolder === null && (
          <>
            <div>
              <h1 className="w-full text-5xl text-center pb-2 mr-28  font-bold text-whiteNavbar">
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
        )}
        {isHolder === false && (
          <>
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
          </>
        )}
        {isHolder && (
          <>
            <div>
              <SearchBar />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
