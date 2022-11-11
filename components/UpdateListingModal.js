import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { Modal, Input, useNotification } from "web3uikit"
import nftMarketplaceAbi from "../constants/NFTMarketplace.json"
import { Moralis } from "moralis-v1"



export default function UpdateListingModal({ NFTContractAddress, marketplaceAddress, tokenId, isVisible, onClose }) {

    
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)



    const dispatch = useNotification()

    

    const {runContractFunction: updateListing} = useWeb3Contract({

        abi: nftMarketplaceAbi,

        contractAddress: marketplaceAddress,

        functionName: "updateListing",

        params: {

            NFTContractAddress: NFTContractAddress,

            tokenId: tokenId,

            newPrice: Moralis.Units.ETH(priceToUpdateListingWith || "0")
        }
    })



    const handleUpdateListingSuccess = async(tx) => {

        await tx.wait(1)

        dispatch({

            type: "success",

            message: "Listing Updated Successfully",

            title: "Update Listing",

            position: "topR"
        })

        onClose && onClose()

        setPriceToUpdateListingWith("0")
    }



    return (

        <Modal 
        
            isVisible = {isVisible}
            
            onCancel = {onClose}
            
            onCloseButtonPressed = {onClose}

            onOk = {() => {

                updateListing({

                    onError: (error) => {

                        console.log(error)
                    },

                    onSuccess: handleUpdateListingSuccess
                })
            }}
            
            >

            <Input
            
                label = "Update Listing Price in L1 Currency (ETH)"

                name = "New Listing Price"

                type = "number"

                onChange = {(event) => {

                    setPriceToUpdateListingWith(event.target.value)
                }}
            
            >
            
            </Input>

        </Modal>
    )
}