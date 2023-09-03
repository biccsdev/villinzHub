import create, { State } from "zustand";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
const axios = require("axios");
const API_KEY = process.env.API_KEY;

interface UserNftStore extends State {
  holder: boolean;
  getUserNfts: (publicKey: PublicKey) => Promise<boolean>;
}

const useUserNftStore = create<UserNftStore>((set, _get) => ({
  holder: false,
  getUserNfts: async (publicKey) => {
    let holder = false;
    try {
      const publicK = new PublicKey(publicKey);

      const url = `https://api.helius.xyz/v0/addresses/${publicK.toString()}/balances?api-key=${API_KEY}`;
      const tokensRaw = [];

      const getBalances = async () => {
        const { data } = await axios.get(url);
        // setSolana(data.nativeBalance / Math.pow(10, 9));
        for (let i = 0; i < data.tokens.length; i++) {
          const element = data.tokens[i];
          tokensRaw.push({
            mint: element.mint,
          });
        }
      };
      await getBalances();

      const url2 = `https://api.helius.xyz/v0/token-metadata?api-key=${API_KEY}`;

      const getMetadata = async () => {
        const { data } = await axios.post(url2, {
          mintAccounts: tokensRaw.map((item) => item.mint),
          includeOffChain: true,
          disableCache: false,
        });
        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          if (
            element.onChainMetadata.metadata === null ||
            element.offChainMetadata.error !== ""
          ) {
            continue;
          }
          if (
            element.onChainMetadata.metadata.tokenStandard === "NonFungible" ||
            element.onChainMetadata.metadata.tokenStandard ===
              "ProgrammableNonFungible"
          ) {
            const collection = element.onChainMetadata.metadata.collection;
            if (collection === null) {
              continue;
            }
            if (
              collection.key === "GbsDfrGL2aESr7a9xUzsq2hMomMawXXccaMVszr9EevK"
            ) {
              holder = true;
            }
          }
        }
      };
      await getMetadata();
      set((s) => {
        s.holder = holder;
      });
      return holder;
    } catch (e) {
      console.log(`error getting balance: `, e);
    }
  },
}));

export default useUserNftStore;
