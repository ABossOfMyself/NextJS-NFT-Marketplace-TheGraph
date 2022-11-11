import styles from "../styles/Home.module.css"
import { Button, Form, useNotification } from "web3uikit"
import { Moralis } from "moralis-v1"
import NFTAbi from "../constants/BasicNFT.json"
import nftMarketplaceAbi from "../constants/NFTMarketplace.json"
import { useMoralis, useWeb3Contract } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState } from 'react'



export default function Home() {

  const { chainId: chainIdHex, account, isWeb3Enabled } = useMoralis()


  const chainId = parseInt(chainIdHex)


  const marketplaceAddress = chainId in networkMapping ? networkMapping[chainId]["NFTMarketplace"][0] : null


  const { runContractFunction } = useWeb3Contract()


  const dispatch = useNotification()


  const [proceeds, setProceeds] = useState("")



  const approveAndList = async(data) => {

    const NFTContractAddress = data.data[0].inputResult

    const tokenId = data.data[1].inputResult

    const price = Moralis.Units.ETH(data.data[2].inputResult)


    const approveOptions = {

      abi: NFTAbi,

      contractAddress: NFTContractAddress,

      functionName: "approve",

      params: {

        to: marketplaceAddress,

        tokenId: tokenId
      }
    }

    await runContractFunction({

      params: approveOptions,

      onError: (error) => {

        console.log(error)
      },

      onSuccess: (tx) => {

        handleApproveSuccess(tx, NFTContractAddress, tokenId, price)
      }
    })
  }



  const handleApproveSuccess = async(tx, NFTContractAddress, tokenId, price) => {

    await tx.wait(1)

    const listOptions = {

      abi: nftMarketplaceAbi,
  
      contractAddress: marketplaceAddress,
  
      functionName: "listItem",
  
      params: {
  
        NFTContractAddress: NFTContractAddress,
  
        tokenId: tokenId,
  
        price: price
      }
    }

    await runContractFunction({

      params: listOptions,

      onError: (error) => {

        console.log(error)
      },

      onSuccess: handleListSuccess
    })
  }



  const handleListSuccess = async(tx) => {

    await tx.wait(1)

    dispatch({

      type: "success",

      message: "NFT Listed Successfully",

      title: "Listing NFT",

      position: "topR"
    })
  }



  const withdrawProceeds = async() => {

    await runContractFunction({

      params: {

        abi: nftMarketplaceAbi,

        contractAddress: marketplaceAddress,

        functionName: "withdrawProceeds",

        params: {}
      },

      onError: (error) => {

        console.log(error)
      },

      onSuccess: handleWithdrawSuccess
    })
  }



  const handleWithdrawSuccess = async(tx) => {

    await tx.wait(1)

    dispatch({

      type: "success",

      message: "Proceeds Withdrawn Successfully",

      title: "Withdrawing Proceeds",

      position: "topR"
    })
  }



  const updateProceedsInUI = async() => {

    const returnedProceeds = await runContractFunction({

      params: {

        abi: nftMarketplaceAbi,

        contractAddress: marketplaceAddress,

        functionName: "getProceeds",

        params: {

          seller: account
        }
      },

      onError: (error) => {

        console.log(error)
      }
    })

    if(returnedProceeds) {

      setProceeds(Moralis.Units.FromWei(returnedProceeds).toString())
    }
  }



  useEffect(() => {

    if(isWeb3Enabled) {

      updateProceedsInUI()
    }
  }, [isWeb3Enabled, account, proceeds, chainId])



  return (

    <div className={styles.container}>

      <Form 

        onSubmit = {approveAndList}
        
        data = {[

          {
            name: "NFT Contract Address",

            type: "text",

            inputWidth: "50%",

            value: "",

            key: "NFTContractAddress"
          },

          {
            name: "Token ID",

            type: "number",

            value: "",

            key: "tokenId"
          },

          {
            name: "Price",

            type: "number",

            value: "",

            key: "price"
          }

      ]}

      title = "Sell your NFTs"

      id = "Main Form"
      
      >

      </Form>


      <h2 className = "pt-8 py-2 px-2 font-bold text-2xl text-gray-500">Proceeds</h2>

      <div className = "pt-4 pb-6 pl-3 font-semibold text-gray-500">{proceeds} ETH</div>

      {proceeds != "0" ? (

        <Button onClick = {withdrawProceeds} text = "Withdraw Proceeds" type = "button"></Button>

      ) : (

        <div className = "pl-3 font-semibold text-gray-600">No Proceeds Detected!</div>
      )}

    </div>
  )
}