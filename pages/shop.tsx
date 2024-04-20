import { useContract, useNFT, useNFTs, useUser } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getUser } from "./api/auth/[...thirdweb]";
import { UTILS_CONTRACT_ADDRESS } from "../constants/contract";
import styles from "../styles/Home.module.css";
import NFTCard from "../components/NFTcard";

export default function shop() {
    const { isLoggedIn, isLoading } = useUser();
    const router = useRouter();

    const {contract: UtilsContract } = useContract(UTILS_CONTRACT_ADDRESS);
    const { data: Utilities } = useNFTs(UtilsContract);

    useEffect(()=> {
        if (!isLoggedIn && !isLoading) {
            router.push("/login");
        }
    },[isLoggedIn, isLoading, router]);

    return (
        <div className={styles.main}>
            <h2>Buy a utilities</h2>
            <div className={styles.grid}>
                {Utilities && Utilities.length > 0 ? (
                    Utilities.map((utils) => (
                        <NFTCard 
                            key = {utils.metadata.id}
                            nft = {utils}
                        />
                    ))
                ):(
                    <p>No utils available</p>
                )}

            </div>
        </div>
    )
};

export async function getServerSideProps (context: any) {
    const user = await getUser(context.req);

    if(!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };
}
