import { useQuery, gql } from "@apollo/client"



const GET_ACTIVE_ITEMS = gql`

{
    activeItems(first: 5, where: { buyer: "0x0000000000000000000000000000000000000000" }) {

        id

        buyer

        seller

        NFTContractAddress

        tokenId

        price
    }
}

`


export default function graphExample() {

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    console.log(listedNfts)

    return <div>This is How you Query on The Graph.</div>
}