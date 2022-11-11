import "../styles/globals.css"
import Head from "next/head"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import { NotificationProvider } from "web3uikit"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"



const client = new ApolloClient({

  cache: new InMemoryCache(),

  uri: process.env.NEXT_PUBLIC_SUBGRAPH_QUERY_URL
})



function MyApp({ Component, pageProps }) {

  return(

    <div>

      <Head>

        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />

      </Head>

      <MoralisProvider initializeOnMount = {false}>

        <ApolloProvider client = {client}>

          <NotificationProvider>

            <Header></Header>

            <Component {...pageProps} />

          </NotificationProvider>

        </ApolloProvider>
      
      </MoralisProvider>

    </div>
   
  )
}


export default MyApp
