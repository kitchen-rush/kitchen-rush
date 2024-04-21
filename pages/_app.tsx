import type { AppProps } from "next/app";
import { embeddedWallet, smartWallet, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Navbar from "../components/navbar";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
//xdc-apothem-network
//base-sepolia-testnet
const activeChain = "";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={activeChain}
      supportedWallets={[
        smartWallet(embeddedWallet(), {
          factoryAddress: "",
          gasless: true,
        })
      ]}
      authConfig={{
        domain: process.env.DOMAIN || "",
        authUrl: "/api/auth",
      }}
    >
      <Navbar/>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
