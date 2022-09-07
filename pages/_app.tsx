import '../styles/globals.css'
import type { AppProps } from 'next/app'
import SearchSidebar from '../components/common/SearchSidebar'

function MyApp({ Component, pageProps }: AppProps) {
  return (<div><SearchSidebar /><Component {...pageProps} /></div>);

}

export default MyApp
