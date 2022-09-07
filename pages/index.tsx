import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { createClient, SchemaFieldTypes, SearchOptions } from "redis";
import React, { useState, useEffect } from "react";

// export async function getStaticProps(context) {

//   const client = createClient({});
//   client.connect();
//   client.on('connect', () => console.log('connected to redis successfully!'));
//   client.on('error', (err) => console.log('Redis Client Error', err));

//   var output = await client.ft.search('idx:cards', '@type_line:Bear');

//   var foundNames = []
//   output['documents'].forEach(element => {
//     foundNames.push(element['value']['name'])
//   });

//   return {
//     props: { uri: foundNames }, // will be passed to the page component as props
//   }
// }

const Home: React.FC = () => {
  const [content, setContent] = useState("");
  const [results, setResults] = useState([]);

  // var out = useSWR('/api/search?q=' + content)

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const api_req = await fetch("/api/search?q=" + content);

    const api_res = await api_req.json();

    setResults(api_res);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="lmao" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}></main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
