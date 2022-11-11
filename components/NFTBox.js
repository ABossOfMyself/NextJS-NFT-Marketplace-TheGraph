import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NFTMarketplace.json"
import NFTAbi from "../constants/BasicNFT.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { Moralis } from "moralis-v1"
import UpdateListingModal from "./UpdateListingModal"



const truncateString = (fullString, stringLength) => {

    if(fullString.length <= stringLength) {

        return fullString
    }

    const separator = "..."

    const separatorLength = separator.length

    const charactersToShow = stringLength - separatorLength

    const frontCharacters = Math.ceil(charactersToShow / 2)

    const backCharacters = Math.floor(charactersToShow / 2)

    return fullString.substring(0, frontCharacters) + separator + fullString.substring(fullString.length - backCharacters)
}



export default function NFTBox({ NFTContractAddress, price, marketplaceAddress, tokenId, seller }) {

    const { isWeb3Enabled, account } = useMoralis()

    const [imageURI, setImageURI] = useState("")

    const [nftName, setNftName] = useState("")

    const [nftDescription, setNftDescription] = useState("")

    const [showModal, setShowModal] = useState(false)



    const dispatch = useNotification()



    const hideModal = () => {

        setShowModal(false)
    }



    const { runContractFunction: getTokenURI } = useWeb3Contract({

        abi: NFTAbi,

        contractAddress: NFTContractAddress,

        functionName: "tokenURI",

        params: {

            tokenId: tokenId
        }
    })



    const { runContractFunction: buyItem } = useWeb3Contract({

        abi: nftMarketplaceAbi,

        contractAddress: marketplaceAddress,

        functionName: "buyItem",

        msgValue: price,

        params: {

            NFTContractAddress: NFTContractAddress,

            tokenId: tokenId
        }
    })



    async function updateUI() {

        const tokenURI = await getTokenURI()

        console.log(`The Token URI is : ${tokenURI}`)

        if(tokenURI) {

            const tokenURIURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")

            const fetchingTokenURI = await (await fetch(tokenURIURL)).json()

            const imageURI = fetchingTokenURI.nft

            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")

            setImageURI(imageURIURL)

            const nftName = fetchingTokenURI.name

            setNftName(nftName)

            const nftDescription = fetchingTokenURI.description

            setNftDescription(nftDescription)
        }
    }



    useEffect(() => {

        if(isWeb3Enabled) {

            updateUI()
        }

    }, [isWeb3Enabled])



    const isOwnedByUser = seller === account || seller === undefined

    const formattedSellerAddress = isOwnedByUser ? "you" : truncateString(seller || "", 15)



    const handleCardClick = () => {

        isOwnedByUser ? setShowModal(true)
        
        : buyItem({

            onError: (error) => {

                console.log(error)
            },

            onSuccess: handleBuyItemSuccess
        })
    }



    const handleBuyItemSuccess = async(tx) => {

        await tx.wait(1)

        dispatch({

            type: "success",

            message: "NFT Bought Successfully",

            title: "Buying NFT",

            position: "topR"
        })
    }



    return (

        <div>

            <div>

                {imageURI ? (

                    <div>

                        <UpdateListingModal 
                        
                            isVisible = {showModal}

                            NFTContractAddress = {NFTContractAddress}

                            marketplaceAddress = {marketplaceAddress}

                            tokenId = {tokenId}

                            onClose = {hideModal}

                        >

                        </UpdateListingModal>


                        <Card title = {nftName} description = {nftDescription} onClick = {handleCardClick}>

                            <div className = "p-2">

                                <div className = "flex flex-col items-end gap-2">

                                    <div>#{tokenId}</div>

                                    <div className = "italic text-sm">Owned by {formattedSellerAddress}</div>
                                    
                                    <Image loader = {() => imageURI} src = {imageURI} height = "200" width = "210"></Image>

                                    <div className = "font-bold">{Moralis.Units.FromWei(price)} ETH</div>

                                </div>

                            </div>

                        </Card>

                    </div>

                ) : (
                
                    <div className = "font-medium">Not Found!</div>
                    
                )}

            </div>

        </div>
    )
}