import "../styles/globals.scss";
import { WagmiProvider } from "wagmi";
import { config } from "../hook/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BlockchainContextProvider } from "../hook/blockchain";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BlockchainContextProvider>
          <Component {...pageProps} />
        </BlockchainContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
