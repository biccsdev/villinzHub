import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Villinz Tools</title>
        <meta name="description" content="Solana tools for Villinz Community" />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
