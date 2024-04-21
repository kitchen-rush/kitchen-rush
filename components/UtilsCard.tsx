import { MediaRenderer, toEther, useAddress, useContract, useContractRead, useNFT, Web3Button } from "@thirdweb-dev/react";
import { UTILS_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS } from "../constants/contract";
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import styles from "../styles/Home.module.css";
type Props = {
    tokenId: number;
};

export default function UtilsCard({tokenId}: Props){
    const address = useAddress();
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
    const { contract: UtilsContract } = useContract(UTILS_CONTRACT_ADDRESS);
    const { data: nft } = useNFT(UtilsContract, tokenId);

    const { contract: stakingContract} = useContract(STAKING_CONTRACT_ADDRESS);
    const { data: UtilsRewards } = useContractRead(
        stakingContract,
        "getStakeInfoForToken",
        [tokenId, address]
    );
    useEffect(()=>{
        if(!stakingContract || !address) return;
        async function loadClaimableRewards(){
            const stakeInfo = await stakingContract?.call(
                "getStakeInfoForToken",
                [tokenId, address]
            );
            setClaimableRewards(stakeInfo[1]);
        }

        loadClaimableRewards();

        const intervalId = setInterval(loadClaimableRewards, 1000);

        return () => clearInterval(intervalId);
    },[]);

    const truncateRevenue = (revenue: BigNumber) => {
        const convertToEther = toEther(revenue);
        const truncateValue =convertToEther.toString().slice(0,6);
        return truncateValue;
    };

    return (
        <div className={styles.nftCard} style={{ backgroundColor: "white"}}>
            <MediaRenderer
                src={nft?.metadata.image}
            />
            <div style={{margin: "10px"}}>
                <h4>{nft?.metadata.name}</h4>
                {UtilsRewards && (
                    UtilsRewards[1].gt(0) &&(
                        <p>Qty: {UtilsRewards[0].toNumber()}</p>
                    )
                )}
                {claimableRewards && (
                    <p>Revenue: {truncateRevenue(claimableRewards as BigNumber)}</p>
                )}
            </div>
            <Web3Button 
                contractAddress={STAKING_CONTRACT_ADDRESS}
                action={(contract) =>contract.call (
                    "claim Rewards"
                    [tokenId]
                )}
                onSuccess={() => alert("Claimed revenue!")}
                className={styles.nftCardButton}
                
                >Claim Revenue</Web3Button>
        </div>
    )
};