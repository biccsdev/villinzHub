import { useMetaplex } from "./useMetaplex";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { TwitterShareButton, TwitterIcon } from "next-share";

export const MintUnrevealed = () => {
  const { metaplex } = useMetaplex();
  const wallet = useWallet();

  const [nft, setNft] = useState(null);

  const [disableMint, setDisableMint] = useState(true);
  const [totalMinted, setTotalMinted] = useState(0);
  const [showMintedMixers, setShowMintedMixers] = useState(false);
  const [showErrorMessagePopUp, setshowErrorMessagePopUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mintDetails, setMintDetails] = useState([]);
  const [showGifPopup, setShowGifPopup] = useState(false);
  const [showMintedNft, setShowMintedNft] = useState(false);
  const [isCandyMachineInitialized, setIsCandyMachineInitialized] =
    useState(false);

  const candyMachineAddress = new PublicKey(
    "9rW3DnVhUU3yzTuHu8cbF5XSDnct5xE6n2eCCu7Cq2tX"
  );

  const mixersImages = [
    "8BITSLIME",
    "ABSTRACTROAD",
    "ALIEN",
    "AMONGO",
    "ANGELGLASS",
    "ANIMAL",
    "ASTRO",
    "BABYMILO",
    "BAT",
    "BEAR",
    "BLOB",
    "BOI",
    "BOLB",
    "BONI",
    "BRO",
    "BTCAT",
    "CACTUSBOI",
    "CACTUSJACK",
    "CAT",
    "CHEF",
    "CHIENBALLON",
    "CHILI",
    "CLASSICDOOM",
    "CLOUD",
    "COVERMASK",
    "CYBERBOI",
    "DAFTPUNK",
    "DEGEN",
    "DEVIL",
    "DEVILBEAR",
    "DIAMONDFARMER",
    "DINO",
    "DOOM",
    "DOOMMATCH",
    "DOWNBAD",
    "ELF",
    "EXPLOWORMER",
    "FANTASTICPAPERFACE",
    "FELINE",
    "FELINEORANGE",
    "FIRE",
    "FIREBOI",
    "FLOWERBOY",
    "FROG",
    "GBABOI",
    "GHOST",
    "GLASS",
    "GOLDENDOOM",
    "GUMBIE",
    "GUMBOI",
    "HACKER",
    "HAUNTED",
    "HEROBRINE",
    "HOLLOW",
    "IT",
    "JAZZITUP",
    "JETPACKBOI",
    "KAWS",
    "LEBRONJAMES",
    "LIBRE",
    "LIGHTGUY",
    "MADVILLAIN",
    "MADVILLE",
    "MICHIMAINCRA",
    "MIDNIGHTDOOM",
    "mixiDoom",
    "mixie",
    "MOUSE",
    "MUSICGUI",
    "MYBOI",
    "NEONSTICK",
    "NINJA",
    "OJO",
    "OSO",
    "PAMPIT",
    "PATO",
    "POKERFACE",
    "PREHISTORIC",
    "RADIOACTIVO",
    "RAPPER",
    "REPTILE",
    "RETRODOOM",
    "ROAD",
    "ROBOT",
    "ROCKETTE",
    "SHARK",
    "SK8R",
    "SKANE",
    "SKULL",
    "SNUPI",
    "SOLANADOOM",
    "SOUL",
    "SPACETRAVELER",
    "SPIRIT",
    "SSSSNAKE",
    "STRANDED",
    "SWIMMINGTURTLE",
    "SWORDMAN",
    "THEREAPER",
    "THUNDERBOI",
    "TRADOOR",
    "TURTLE",
    "UNKNOWN",
    "VATO",
    "WIZARD",
    "WARRIOR",
    "WOLFGANG",
    "WORM",
    "YCMI",
    "YODA",
    "ZOMBIE",
  ];

  let candyMachine;
  let walletBalance;

  useEffect(() => {
    if (!isCandyMachineInitialized) {
      (async () => {
        await checkEligibility();
        addListener();
        setIsCandyMachineInitialized(true);
      })();
    }
  }, [nft]);

  const addListener = async () => {
    // add a listener to monitor changes to the candy guard
    metaplex.connection.onAccountChange(candyMachine.candyGuard.address, () =>
      checkEligibility()
    );

    // add a listener to monitor changes to the user's wallet
    metaplex.connection.onAccountChange(metaplex.identity().publicKey, () =>
      checkEligibility()
    );
  };

  const checkEligibility = async () => {
    const details = [];
    //wallet not connected?
    if (!wallet.connected) {
      setDisableMint(true);
      return;
    }

    // read candy machine state from chain
    candyMachine = await metaplex
      .candyMachines()
      .findByAddress({ address: candyMachineAddress });

    details.push(
      candyMachine.itemsAvailable.toString(10) -
        candyMachine.itemsMinted.toString(10)
    );

    // enough items available?
    if (
      candyMachine.itemsMinted.toString(10) -
        candyMachine.itemsAvailable.toString(10) >
      0
    ) {
      console.error("not enough items available");
      setDisableMint(true);
      return;
    }

    const guard = candyMachine.candyGuard.guards;

    if (guard.mintLimit != null) {
      const mintLimitCounter = metaplex
        .candyMachines()
        .pdas()
        .mintLimitCounter({
          id: guard.mintLimit.id,
          user: metaplex.identity().publicKey,
          candyMachine: candyMachine.address,
          candyGuard: candyMachine.candyGuard.address,
        });
      //Read Data from chain
      const mintedAmountBuffer = await metaplex.connection.getAccountInfo(
        mintLimitCounter,
        "processed"
      );
      let mintedAmount = 0;
      if (mintedAmountBuffer != null) {
        mintedAmount = mintedAmountBuffer.data.readUintLE(0, 1);
      }
      details.push(mintedAmount);
      setTotalMinted(mintedAmount);
      if (mintedAmount != null && mintedAmount >= guard.mintLimit.limit) {
        console.error("mintLimit: mintLimit reached!");
        setErrorMessage("YOU ALREADY MINTED ENOUGH FAM :P");
        setshowErrorMessagePopUp(true);
        setDisableMint(true);
        return;
      }
    }

    if (guard.redeemedAmount != null) {
      if (
        guard.redeemedAmount.maximum.toString(10) <=
        candyMachine.itemsMinted.toString(10)
      ) {
        console.error(
          "redeemedAmount: Too many NFTs have already been minted!"
        );
        setDisableMint(true);
        return;
      }
    }

    if (guard.tokenBurn != null) {
      const ata = await metaplex.tokens().pdas().associatedTokenAccount({
        mint: guard.tokenBurn.mint,
        owner: metaplex.identity().publicKey,
      });
      const balance = await metaplex.connection.getTokenAccountBalance(ata);
      if (balance < guard.tokenBurn.amount.basisPoints.toNumber()) {
        console.error("tokenBurn: Not enough $VLNZ tokens to burn!");
        setErrorMessage("YOU AIN'T GOT ENOUGH $VLNZ SON :'( ");
        setshowErrorMessagePopUp(true);
        setDisableMint(true);
        return;
      }
    }
    details.push(guard.tokenBurn.amount.basisPoints.toNumber() / 1000000);
    setMintDetails(details);

    //good to go! Allow them to mint
    setDisableMint(false);
  };

  // show and do nothing if no wallet is connected
  if (!wallet.connected) {
    return null;
  }

  const openGifPopup = () => {
    setShowGifPopup(true);
  };

  const closeGifPopup = () => {
    setShowGifPopup(false);
  };

  const closeErrorPopUp = () => {
    setshowErrorMessagePopUp(false);
  };

  const openMintedPopup = () => {
    setShowMintedNft(true);
  };

  const closeMintedPopup = () => {
    setShowMintedNft(false);
  };

  const updateTotalMinted = () => {
    setTotalMinted(totalMinted + 1);
  };

  const openBrowseMinted = () => {
    setShowMintedMixers(true);
  };

  const openBrowseMintedFromMintPopUp = () => {
    closeMintedPopup();
    setShowMintedMixers(true);
  };

  const closeBrowseMinted = () => {
    setShowMintedMixers(false);
  };

  const onClick = async () => {
    if (showMintedNft) {
      closeMintedPopup();
    }
    if (totalMinted >= 3) {
      setErrorMessage("YOU ALREADY MINTED ENOUGH FAM :P");
      setshowErrorMessagePopUp(true);
      return;
    }
    openGifPopup();
    try {
      await checkEligibility();
      const { nft } = await metaplex.candyMachines().mint({
        candyMachine,
        collectionUpdateAuthority: candyMachine.authorityAddress,
      });

      setNft(nft);
      updateTotalMinted();
      closeGifPopup();
      openMintedPopup();
    } catch (error) {
      console.error("An error occurred:", error);
      closeGifPopup();
    }
  };

  return (
    <div>
      <div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-2xl font-bold text-whiteNavbar">
            GOT MIXERS?
          </h1>
          <div className="mt-10 flex flex-col items-center justify-center">
            <button
              className="w-96 h-60 relative bg-[url('/off.png')] hover:bg-[url('/on.png')] bg-cover bg-center"
              onClick={onClick}
              disabled={disableMint}
            ></button>
            <div className="w-11/12 mt-10 p-6 rounded-lg shadow-lg bg-white">
              <h2 className="font-bold text-gray-800">
                Mixers left: {mintDetails[0]} / 111
              </h2>
              <h2 className="font-bold text-gray-800 mt-2">
                You've Minted: {totalMinted} / 3
              </h2>
              <h2 className="font-bold text-gray-800 mt-2">
                Cost per Mint: $ {mintDetails[2]} VLNZ
              </h2>
              {totalMinted >= 1 && (
                <button
                  className=" bg-blackDetails hover:bg-whiteNavbar hover:text-blackDetails text-whiteNavbar font-bold mt-4 py-2 px-4 rounded my-4"
                  onClick={openBrowseMinted}
                >
                  Browse Mixers
                </button>
              )}
            </div>
          </div>

          {showErrorMessagePopUp && (
            <div className="fixed flex items-center justify-center z-10 inset-0">
              <div className="bg-blackDetails border-4 border-whiteNavbar  h-fit flex justify-center rounded-md flex-wrap items-center">
                <button
                  className=" left-5 bg-whiteNavbar hover:bg-blackDetails hover:text-whiteNavbar text-blackDetails font-bold mt-4 py-2 px-4 rounded"
                  onClick={closeErrorPopUp}
                >
                  Close
                </button>
                <h1 className="text-whiteNavbar text-2xl text-center font-bold w-full p-5">
                  SORRY!
                </h1>
                <h2 className="text-whiteNavbar text-lg text-center font-bold w-full p-5">
                  {errorMessage}
                </h2>
              </div>
            </div>
          )}
          {showMintedNft && (
            <div className="fixed flex items-center justify-center z-10 inset-0">
              <div className="bg-blackDetails h-fit flex justify-center rounded-md flex-wrap items-center">
                <button
                  className=" left-5 bg-whiteNavbar hover:bg-blackDetails hover:text-whiteNavbar text-blackDetails font-bold mt-4 py-2 px-4 rounded"
                  onClick={closeMintedPopup}
                >
                  Close
                </button>
                <h1 className="text-whiteNavbar text-center font-bold w-full p-5">
                  CONGRATS!!, You've minted:
                </h1>
                <h1 className="text-whiteNavbar text-center font-bold w-full">
                  {nft?.name}
                </h1>
                <div className="w-full flex justify-center">
                  <img
                    className="my-4"
                    src={nft?.json?.image || "/checkWallet.png"}
                    alt="The downloaded illustration of the provided NFT address."
                  />
                </div>
                <h1 className="text-whiteNavbar text-center font-bold w-full ">
                  You have minted {totalMinted} / 3
                </h1>
                {totalMinted < 3 && (
                  <button
                    className=" bg-whiteNavbar hover:bg-blackDetails hover:text-whiteNavbar text-blackDetails font-bold mt-4 py-2 px-4 rounded my-4"
                    onClick={onClick}
                  >
                    Mint Again
                  </button>
                )}
                <button
                  className=" bg-whiteNavbar hover:bg-blackDetails hover:text-whiteNavbar text-blackDetails font-bold ml-4 mt-4 py-2 px-4 rounded my-4"
                  onClick={openBrowseMintedFromMintPopUp}
                >
                  Browse Mixers
                </button>

                <TwitterShareButton
                  url={"https://villinz-hub.vercel.app"}
                  title={
                    "🚨 I Just minted a Mixer!🚨 \n A collection by @itsbiccs 👨🏽‍💻 \n Free for OG @madvillevillinz community members. \n"
                  }
                >
                  <div className="w-full flex justify-center m-4">
                    <TwitterIcon size={32} round />
                    <h1 className="text-whiteNavbar text-center font-bold ml-2">
                      Share your mint on X ( Twitter )
                    </h1>
                  </div>
                </TwitterShareButton>
              </div>
            </div>
          )}
        </div>
      </div>
      {showGifPopup && (
        <div className="fixed flex items-center justify-center z-10 inset-0 ">
          <div className="bg-white p-4 rounded-lg m-44">
            <button
              className="absolute top-2 right-30 bg-blackDetails hover:bg-whiteNavbar hover:text-blackDetails text-whiteNavbar font-bold py-2 px-4 rounded"
              onClick={closeGifPopup}
            >
              Close
            </button>
            <img src="/mintUnrevealedButton.gif" alt="GIF" />
          </div>
        </div>
      )}
      {showMintedMixers && (
        <div className="fixed flex flex-col z-10 inset-0 bg-blackDetails">
          <button
            className="bg-whiteNavbar hover:bg-blackDetails hover:text-whiteNavbar text-blackDetails font-bold py-2 px-4 rounded self-start ml-4 mt-4"
            onClick={closeBrowseMinted}
          >
            Close
          </button>
          <h1 className="text-whiteNavbar text-2xl text-center font-bold my-4">
            "[ MIXERS GALLERY ]"
          </h1>
          <div className="flex-grow overflow-auto flex flex-wrap justify-center p-4">
            {mixersImages.map((image, index) => (
              <div
                key={index}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 hover:scale-105 p-2"
              >
                <img
                  className="w-full cursor-pointer"
                  src={`/mixers/${image}.png`}
                  alt="Digital collectible from the Mixers Collection"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
