import { MediaRenderer, useAddress, useClaimConditions, useContract } from "@thirdweb-dev/react";
import  { NFT, toEther } from "@thirdweb-dev/sdk";
import { STAKING_CONTRACT_ADDRESS, UTILS_CONTRACT_ADDRESS } from "../constants/contract";
import styles from "../styles/Home.module.css"
import { useState } from "react";

type Props = {
    nft: NFT;
};

export default function NFTCard ({ nft }: Props ){
    const address = useAddress();
    const { contract: UtilsContract } =useContract(UTILS_CONTRACT_ADDRESS, "edition-drop");
    const { data: claimCondition } = useClaimConditions(UtilsContract, nft.metadata.id);

    const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS);
    const calculateEarnings = (cost: number) => {
        return cost * 0.1;
    };

    const [claimState, setClaimState] = useState<
    "init"| "nftClaim" | "staking">("init");

    const handleClaim = async () => {
        if(!address) return ;
        setClaimState("nftClaim");
        try {
            await UtilsContract?.erc1155.claim(nft.metadata.id, 1);

            setClaimState("staking");
            const isApproved = await UtilsContract?.isApproved(
                address,
                STAKING_CONTRACT_ADDRESS
            );

            if(!isApproved) {
                await UtilsContract?.setApprovalForAll(STAKING_CONTRACT_ADDRESS, true)
            }
            await stakingContract?.call (
                "stake",
                [nft.metadata.id, 1]
            )

        } catch (error) {
            console.error(error);
        } finally {
            setClaimState("init");
        }
    };

    return(
        <div className={styles.nftCard}>
            <MediaRenderer
                src={nft.metadata.image}
            />
            <div style={{padding: "10px"}}>
                <h3>{nft.metadata.image}</h3>
                {claimCondition && claimCondition.length > 0 && (
                    claimCondition.map((condition, index) => (
                        <div key={index}>
                            <p>Cost:{toEther(condition.price)}{condition.currencyMetadata.symbol}</p>
                            <p>Earns: {calculateEarnings(parseInt(toEther(condition.price)))} {condition.currencyMetadata.symbol}/hour</p>
                        </div>
                    ))
                )}
            </div>
            <button 
                className={styles.nftCardButton}
                onClick={handleClaim}
                disabled={claimState !== "init"}
            >
            {claimState === "nftClaim" ? "Purchasing utilities... " : claimState === "staking" ? "Staking utils.. " : "Buy Now"}
            </button>
        </div>
    )
};