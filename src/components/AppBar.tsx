import { FC, useEffect } from "react";
import Image from "next/image";

import solanaLogo from "../../public/solanaLogo.png";
import villinzSvg from "../../public/villinzLogo.svg";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useUserSOLBalanceStore from "stores/useUserSOLBalanceStore";

export const AppBar: FC = (props) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <div>
      <div className="navbar flex flex-row md:mb-2  text-redBackground">
        <div className="navbar-start">
          <div className="hidden sm:inline w-22 h-22 md:p-2">
            <div className="flex items-center">
              <Image src={villinzSvg} width={80} height={80} alt="logo" />
            </div>
          </div>
        </div>

        <div className="hidden md:inline md:navbar-center">
          <div className="flex items-stretch"></div>
        </div>

        <div className="flex flex-wrap navbar-end align-middle">
          <WalletMultiButton className="wallet-button" />
          <div className="w-full flex justify-end text-center mt-2 pb-2 mr-4 font-bold text-whiteNavbar">
            {wallet.publicKey && (
              <>
                <Image
                  src={solanaLogo}
                  width={25}
                  height={25}
                  alt="logo solana"
                />
                <p className="ml-2">{(balance || 0).toLocaleString()} $SOL</p>
              </>
            )}
          </div>
        </div>
      </div>
      {props.children}
    </div>
  );
};
