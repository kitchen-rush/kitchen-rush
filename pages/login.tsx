import React, { useEffect, useState } from "react";
import {ConnectEmbed, SmartWallet, useAddress, useSDK, useShowConnectEmbed, useUser, useWallet} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { getUser } from "./api/auth/[...thirdweb]";
import { CHEF_CONTRACT_ADDRESS } from "../constants/contract";

const loginOptional = false;
const Login  = () => {

    const showConnectedEmbed = useShowConnectEmbed();
    const {isLoggedIn, isLoading } = useUser();
    const router = useRouter();

    const wallet = useWallet();
    const address = useAddress();
    const sdk = useSDK();
    
    const [loadingChefStatus, setLoadingChefStatus] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState("");

    const checkNewPlayer = async () => {
        try{
            if(wallet instanceof SmartWallet && address && sdk) {
                setLoadingChefStatus(true);
                setLoadingStatus("checking chef balance .....");
                
                const chefContract = await sdk.getContract(CHEF_CONTRACT_ADDRESS);
                const chefBalance = await chefContract.erc721.balanceOf(address);

                if(chefBalance.toNumber() === 0){
                    setLoadingStatus("No chef found.....");
                    try {
                        const response = await fetch("/api/claimTokens", {
                            method: "POST",
                            headers: {
                                "Content-Type" :"application/json",
                            },
                            body: JSON.stringify({address}),
                        });

                        const data = await response.json();
                        if (!response.ok){
                            throw new Error(data.message);
                        }
                        setLoadingStatus("Chef and tokens claimed ..... ");
                    } catch  (error) {
                        console.error(error);
                    } finally {
                        setLoadingStatus("");
                        router.push("/");
                    }
                } else {
                    setLoadingStatus("");
                    router.push("/");
                }
            } else {
                alert ("wallet is not smartwallet")
            }

        } catch (error){
            console.error(error);
            alert("Error checking new player");
        }
    };

    useEffect(()=>{
        if(isLoggedIn && !isLoading){
            checkNewPlayer();
        }
    },[isLoggedIn, isLoading, router]);

    if(loadingChefStatus) {
        return (
            <div className={styles.container}>
                <h1>{loadingStatus}</h1>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h1>Kitchen Rush</h1>
            {showConnectedEmbed && (
                <ConnectEmbed
                    auth={{
                        loginOptional: loginOptional,
                    }}
                />
            )}
        </div>
    )
};

export default Login;

export async function getServerSideProps(context: any){
    const  user  = await getUser(context.req);
    if(user){
        return{
            redirect:{
                destination: "/",
                permanent: false,
            }
        }
    }

    return {
        props: {},
    };
}