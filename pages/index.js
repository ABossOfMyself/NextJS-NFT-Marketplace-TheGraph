import { useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox"
import networkMapping from "../constants/networkMapping.json"
import { useQuery } from "@apollo/client"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"



export default function Home() {

  const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()


  const chainId = parseInt(chainIdHex)

  
  const marketplaceAddress = chainId in networkMapping ? networkMapping[chainId]["NFTMarketplace"][0] : null


  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

  

  return (

    <div className = "container mx-auto">

      <h1 className = "py-4 px-4 font-bold text-2xl">Recently Listed</h1>

      <div className = "flex flex-wrap">


        {isWeb3Enabled ? (

          loading || !listedNfts ? (
                    
            <div className = "font-medium">Loading...</div>
            
          ) : (
              
              listedNfts.activeItems.map((nft) => {

                const { NFTContractAddress, price, tokenId, seller } = nft

                return (

                  <div className = "p-4">

                    <NFTBox

                      NFTContractAddress = {NFTContractAddress}

                      price = {price}

                      marketplaceAddress = {marketplaceAddress}

                      tokenId = {tokenId}

                      seller = {seller}

                      key = {`${NFTContractAddress}${tokenId}`}
                      
                    >
                      
                    </NFTBox>

                  </div>
              )

          }))

        ) : (
        
          <div className = "font-medium">Please Connect to Wallet</div>
        
        )}

      </div>

    </div>
  )
}
