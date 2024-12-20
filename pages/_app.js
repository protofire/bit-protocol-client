import "../styles/globals.scss";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { config } from "../hook/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BlockchainContextProvider } from "../hook/blockchain";
import { RainbowKitProvider, Locale, darkTheme } from "@rainbow-me/rainbowkit";
import { SignatureGuard } from "../components/signatureGuard";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale={Locale}
          modalSize="compact"
          theme={darkTheme()}
        >
          <SignatureGuard>
            <BlockchainContextProvider>
              <Component {...pageProps} />
            </BlockchainContextProvider>
          </SignatureGuard>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
