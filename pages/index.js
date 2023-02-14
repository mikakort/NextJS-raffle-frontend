import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
// const inter = Inter({ subsets: ["latin"] });

/* Component Imports*/
// import ManualHeader from "@/components/ManualHeader";
import Header from "@/components/Header";
import LotteryEntrance from "@/components/LotteryEntrance";

export default function Home() {
    return (
        <>
            <Head>
                <title>Smart Contract Raffle</title>
                <meta name="description" content="Our smart contract lottery" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <LotteryEntrance />
        </>
    );
}
