import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { ConnectWallet, useAddress, useSDK, useUser, useWallet } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import { getUser } from "./api/auth/[...thirdweb]";
import Chef from "../components/Chef";
import Shop from "../components/Utils";

const Home: NextPage = () => {
  const {isLoggedIn, isLoading } = useUser();
  const router = useRouter();

  const wallet = useWallet();
  const address = useAddress();
  const sdk = useSDK();
  
  const [loadingchefStatus, setLoadingchefStatus ] = useState(false);
  const [loadingStatus, setLoadingStatus ] = useState("");

  const checkNewPlayer = async () => {
    try{

    }catch (error){
      console.error

    }
  };
  useEffect(() => {
    if(!isLoggedIn && !isLoading) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  return (
    <div className={styles.main}>
      <div style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "row",
        width: "100%",
      }}>

      </div>
      <Chef />
      <Shop />
    </div>
  );
};

export default Home;

export async function getServerSideProps(context:any) {
  const user = await getUser(context.req);
  if (!user) {
    return {
      redirect : {
        destination: "/login",
        permanent: false,
      }
    }
  }
    return {
      props: {},
    };
  }
