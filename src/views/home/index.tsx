// Next, React
import { FC, useEffect, useState } from "react";
import Link from "next/link";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Components
import pkg from "../../../package.json";
import { RequestAirdrop } from "../../components/RequestAirdrop";
import { SendTransaction } from "../../components/SendTransaction";
import { SearchBar } from "components/SearchBar";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";

export const HomeView: FC = ({}) => {
  // const wallet = useWallet();
  // const { connection } = useConnection();

  // const balance = useUserSOLBalanceStore((s) => s.balance);
  // const { getUserSOLBalance } = useUserSOLBalanceStore();

  // useEffect(() => {
  //   if (wallet.publicKey) {
  //     // console.log(wallet.publicKey.toBase58());
  //     getUserSOLBalance(wallet.publicKey, connection);
  //   }
  // }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <div className="md:hero mx-auto p-4 ">
      <div className="md:hero-content flex flex-col">
        <div>
          <SearchBar />
        </div>
      </div>
    </div>
  );
};
