import { NextApiRequest, NextApiResponse } from "next";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import fs from "fs";

// const API_KEY = process.env.API_KEY;

function loadKeypair(filename: string): Keypair {
  const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[];
  const secretKey = Uint8Array.from(secret);
  return Keypair.fromSecretKey(secretKey);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const authority = loadKeypair(
      "../../Biccsu5dY5xyeFo24MqmLdCr6vrCmSTyU4XMgSNTnjLD.json"
    );
    const connection = new Connection(clusterApiUrl("mainnet-beta"));
    const metaplex = new Metaplex(connection);
    metaplex.use(keypairIdentity(authority));

    const candyMachine = await metaplex.candyMachines().findByAddress({
      address: new PublicKey("9rW3DnVhUU3yzTuHu8cbF5XSDnct5xE6n2eCCu7Cq2tX"),
    });

    try {
      const nft = await metaplex.candyMachines().mint({
        candyMachine,
        collectionUpdateAuthority: authority.publicKey,
      });

      res.status(200).json({ nft });
    } catch (error) {
      console.error("Minting error:", error);
      res.status(500).json({ error: "Minting failed" });
    }
  } else {
    res.status(405).end();
  }
}
