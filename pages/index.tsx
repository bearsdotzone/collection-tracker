import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import fetch from 'make-fetch-happen'
import streamarray from 'stream-json/streamers/StreamArray'
import * as redis from 'redis';

export async function getStaticProps(context) {

  const bulk_data_req = await fetch('https://api.scryfall.com/bulk-data', { cachePath: './cache', cache: 'force-cache' })

  const bulk_data = await bulk_data_req.json()
  const bulk_data_uri = bulk_data['data'][3]['download_uri']

  const all_cards_request = await fetch(bulk_data_uri, { cachePath: './cache', cache: 'force-cache' })

  const pipeline = all_cards_request.body.pipe(streamarray.withParser());
  const client = redis.createClient({});
  client.connect();
  client.on('connect', () => console.log('connected to redis successfully!'));
  client.on('error', (err) => console.log('Redis Client Error', err));

  // await client.set('key', 'value');

  pipeline.on('data', async data => {
    await client.json.set(data['value']['id'], '.', data['value'])
  })

  // let objectCounter = 0;
  // parser.on('data', data => console.log(data));
  // parser.on('end', () => console.log(`Found ${objectCounter} objects.`));

  // all_cards_request.body.pipe(parser);

  // const all_cards = await all_cards_request.json()

  return {
    props: { uri: "test" }, // will be passed to the page component as props
  }
}


const Home: NextPage = ({ uri }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="lmao" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>{uri}</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
