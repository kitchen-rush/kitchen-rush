import { MediaRenderer, useAddress, useContract, useOwnedNFTs, useTokenBalance } from "@thirdweb-dev/react";
import { CHEF_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS } from "../constants/contract";
import styles from "../styles/Home.module.css";
const Chef = () => {
    const address = useAddress();
    const {contract: chefContract} = useContract(CHEF_CONTRACT_ADDRESS);
    const { data : ownedChefs, isLoading: loadingChefs} =useOwnedNFTs (
        chefContract,
        address
    );
    const { contract: tokenContract } = useContract(TOKEN_CONTRACT_ADDRESS);
    const { data: tokenBalance } = useTokenBalance(tokenContract, address);

    const truncateNumber = (num: string) => {
        return num.slice(0, 6);
    }
    
    return (
        <div style={{ width: "50%"}}>
            {!loadingChefs ? (
                ownedChefs && ownedChefs.length > 0 && (
                   ownedChefs.map((chef) => (
                    <div className={styles.chefContainer} key={chef.metadata.id} >   
                        <div>
                        <h2>Chef Stats:</h2>
                        <MediaRenderer
                            src={chef.metadata.image}
                            style={{ borderRadius: "10px", margin: "10px 0px"}}
                        />
                        </div>
                        <div>
                            <p style={{fontWeight: "bold"}}> chef.metadata.name - ID: #{chef.metadata.id}</p>
                            { tokenBalance && (
                                <p>Balance: {truncateNumber(tokenBalance.displayValue as string )} {tokenBalance.symbol}</p>
                            )}
                        </div>
                    </div>
                   ))
                )
            ) :(
               <p>Loading...</p> 
            )}
        </div>
    )
}
export default Chef;