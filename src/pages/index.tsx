import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>VillinzHUB</title>
        <meta
          name="description"
          content="Solana tools for the Villinz Community"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
