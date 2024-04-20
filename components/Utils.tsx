import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { STAKING_CONTRACT_ADDRESS } from "../constants/contract";
import styles from "../styles/Home.module.css"
import { BigNumber } from "ethers";
import UtilsCard from "./UtilsCard";
const Utils = () => {
    const address = useAddress();

    const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS);
    const { data: stakedTokens, isLoading: loadingUtils} = useContractRead(
        stakingContract, 
        "getStakeInfo", 
        [address]
    );

    return (
        <div className={styles.chefContainer} style={{ width: "50%"}}>
            {!loadingUtils ? (
                <>
                <h2>Utils:</h2>
                <div className={styles.grid}>
                    {stakedTokens&&
                        stakedTokens[0].length > 0 ? (
                            stakedTokens[0].map((stakedToken: BigNumber) => (
                                <UtilsCard 
                                    key={stakedToken.toString()}
                                    tokenId={stakedToken.toNumber()}
                                />
                            ))
                        ) : (
                            <p>No Utils owned.</p>
                        )
                    }
                </div>
                </>
            ):(
                <p>Loading Utils...</p>
            )}
        </div>
    )
};

export default Utils