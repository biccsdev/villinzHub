import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import Image from "next/image";

import solanaLogo from "../../public/solanaLogo.png";

const axios = require("axios");
const API_KEY = process.env.API_KEY;

export function SearchBar() {
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [totalNfts, setTotalNfts] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [solana, setSolana] = useState(-1);

  const handleSearch = async () => {
    try {
      //   const connection = new Connection("https://api.mainnet-beta.solana.com");
      const publicKey = new PublicKey(walletAddress);

      const url = `https://api.helius.xyz/v0/addresses/${publicKey.toString()}/balances?api-key=${API_KEY}`;
      const tokensRaw = [];

      const getBalances = async () => {
        const { data } = await axios.get(url);
        setSolana(data.nativeBalance / Math.pow(10, 9));
        for (let i = 0; i < data.tokens.length; i++) {
          const element = data.tokens[i];
          tokensRaw.push({
            mint: element.mint,
            amount: element.amount,
            decimals: element.decimals,
          });
        }
      };
      await getBalances();

      const url2 = `https://api.helius.xyz/v0/token-metadata?api-key=${API_KEY}`;
      const tkns = [];
      const nftsHelper = [];

      const getMetadata = async () => {
        const arrays = [];
        const tokensArr = tokensRaw.map((item) => item.mint);
        const numberOfArrays = Math.floor(tokensArr.length / 100);
        if (tokensArr.length > 99) {
          for (let i = 0; i < numberOfArrays + 1; i++) {
            const start = i * 100;
            const end = ((numberOfArrays * 100) / numberOfArrays) * (i + 1);
            if (i == numberOfArrays) {
              arrays.push(tokensArr.slice(start));
            } else {
              arrays.push(tokensArr.slice(start, end));
            }
          }
        } else {
          arrays.push(tokensArr);
        }

        for (let j = 0; j < arrays.length; j++) {
          const details = {
            mintAccounts: arrays[j],
            includeOffChain: true,
            disableCache: false,
          };

          const { data } = await axios.post(url2, details);

          for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (
              element.onChainMetadata.metadata === null ||
              element.offChainMetadata.error !== ""
            ) {
              continue;
            }
            if (element.onChainMetadata.metadata.tokenStandard === "Fungible") {
              const tokenAmount = tokensRaw.find(
                (token) => token.mint == element.account
              );
              const tkn = {
                img: element.offChainMetadata.metadata.image,
                symbol: element.offChainMetadata.metadata.symbol,
                amount: tokenAmount.amount / Math.pow(10, tokenAmount.decimals),
              };
              tkns.push(tkn);
            }
            if (
              element.onChainMetadata.metadata.tokenStandard ===
                "NonFungible" ||
              element.onChainMetadata.metadata.tokenStandard ===
                "ProgrammableNonFungible"
            ) {
              const nft = {
                img: element.offChainMetadata.metadata.image,
                name: element.offChainMetadata.metadata.name,
                description: element.offChainMetadata.metadata.description,
                attributes: element.offChainMetadata.attributes,
                //   collectionId: element.onChainMetadata.metadata.collection.key,
              };
              nftsHelper.push(nft);
            }
          }
        }

        // while (!done) {}
      };
      await getMetadata();
      setTokens(tkns);
      setNfts(nftsHelper);
      setTotalTokens(tkns.length + 1);
      setTotalNfts(nftsHelper.length + 1);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  return (
    <>
      <div className="flex flex-wrap text-blackDetails justify-center">
        <div className="w-full flex flex-wrap justify-center">
          <h2 className="w-full text-center pb-2 mr-28 font-bold text-whiteNavbar">
            Look inside any wallet.
          </h2>
          <input
            className=" py-2 px-4 border border-gray-400 rounded shadow-sm mr-2 text-blackDetails"
            type="text"
            placeholder="Enter wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <button
            className="bg-blackDetails hover:bg-whiteNavbar hover:text-blackDetails text-whiteNavbar font-bold py-2 px-4 rounded"
            type="button"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {error && (
          <>
            <div className="w-2/5 mt-5 border-4 border-whiteNavbar rounded-lg bg-whiteNavbar shadow-2xl shadow-blackDetails">
              <div className="w-full flex justify-end pt-5 pr-5">
                <button
                  className="bg-blackDetails hover:bg-whiteNavbar text-whiteNavbar hover:text-blackDetails font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={() => setError(false)}
                >
                  X
                </button>
              </div>
              <h1 className="font-bold text-redBackground ml-4">
                An Error Ocurred
              </h1>
              <p className="font-bold text-blackDetails mt-2 mb-10 ml-4">
                Couldn't retrieve data from the given address, dm{" "}
                <a
                  href="https://twitter.com/itsbiccs"
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  biccs
                </a>{" "}
                over twitter to report this error.
              </p>
            </div>
          </>
        )}
        {solana >= 0 && !error && (
          <>
            <div className="w-3/4 mt-5 h-100 overflow-hidden overflow-y-scroll container-snap border-4 border-whiteNavbar rounded-lg bg-whiteNavbar shadow-2xl shadow-blackDetails">
              <div className="w-full flex justify-end">
                <button
                  className="bg-blackDetails hover:bg-whiteNavbar text-whiteNavbar hover:text-blackDetails font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={() => setSolana(-1)}
                >
                  X
                </button>
              </div>

              <h1 className="w-full ml-5 font-extrabold text-2xl">
                Tokens{" "}
                <span className="text-sm">( total items: {totalTokens} )</span>
              </h1>
              <div className="w-full flex ml-5 flex-wrap">
                <div className="w-full md:w-1/2 lg:w-2/6 flex mt-3 items-center">
                  <Image
                    src={solanaLogo}
                    width={50}
                    height={50}
                    alt="logo solana"
                  />
                  <h1 className="inline-block align-middle ml-4 md:ml-8">
                    {solana}
                  </h1>
                  <h1 className="inline-block align-middle font-extrabold ml-2 md:ml-2">
                    $SOL
                  </h1>
                </div>
                {tokens.map((token) => (
                  <div
                    className="w-full md:w-1/2 lg:w-2/6 flex mt-3 items-center"
                    key={token.symbol}
                  >
                    <Image
                      className="rounded-3xl "
                      loader={() => token.img}
                      src={token.img}
                      width={50}
                      height={50}
                      alt="logo"
                    />
                    <h1 className="inline-block align-middle ml-2 md:ml-8">
                      {token.amount}
                    </h1>
                    <h1 className="inline-block align-middle font-extrabold ml-4 md:ml-2">
                      ${token.symbol}
                    </h1>
                  </div>
                ))}
              </div>
              <h1 className="w-full m-5 font-extrabold text-2xl">
                Collectibles{" "}
                <span className="text-sm">( total items: {totalNfts} )</span>
              </h1>
              <div className="w-full flex flex-wrap justify-center">
                {nfts.map((nft) => (
                  <div
                    className="flex items-center justify-center md:w-1/3 "
                    key={nft.name}
                  >
                    <a
                      className="relative block w-3/4 h-64 
                      bg-transparent group"
                      href="##"
                    >
                      <div
                        className="absolute bg-blackDetails inset-0 
                            w-full h-fit group-hover:opacity-50 text-center shadow-lg shadow-blackDetails rounded-lg"
                      >
                        <Image
                          className="relative w-max h-full rounded-lg"
                          loader={() => nft.img}
                          src={nft.img}
                          alt="logo"
                          width={256}
                          height={256}
                        />
                      </div>
                      <div className="relative p-10 ">
                        <div className="mt-2">
                          <div
                            className="transition-all transform 
                                translate-y-8 opacity-0 
                                group-hover:opacity-100 
                                group-hover:translate-y-0"
                          >
                            <div className="p-2 ">
                              <p className="text-xl text-white text-center">
                                {nft.name}
                              </p>
                              <p
                                className="text-xl text-white mt-2 text-justify 
                            leading-snug max-h-20 md:max-h-32 lg:max-h-36 xl:max-h-40 overflow-scroll container-snap"
                              >
                                {nft.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
