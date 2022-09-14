import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { createClient, SchemaFieldTypes, SearchOptions } from "redis";
import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import SearchSidebar from "../components/common/SearchSidebar";
import CollectionView from "../components/common/CollectionView";
import useSWR from "swr";

// const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home(props) {
  const [collections, setCollections] = useState([]);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const data = await fetch("/api/collections/readCollections");
    const returned = await data.json();

    setCollections(returned);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta
          name="description"
          content="Collection Tracker"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <Header />

      <main className={styles.main}>
        <button onClick={submitData} />
        <SearchSidebar />
        <div>
          {collections.map((element) => {
            return <p>{element["id"]}</p>;
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
