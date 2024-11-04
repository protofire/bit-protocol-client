import { http, createConfig } from "wagmi";
import { sapphire, sapphireTestnet } from "wagmi/chains";
import { coinbaseWallet, metaMask } from "wagmi/connectors";
import { sapphireHttpTransport } from "@oasisprotocol/sapphire-wagmi-v2";

export const CHAIN_ID = {
  SAPPHIRE: sapphire.id,
  SAPPHIRE_TESTNET: sapphireTestnet.id
};

const createTransport = (url) => {
  return http(url, {
    timeout: 15000
  });
};

export const config = createConfig({
  chains: [sapphireTestnet, sapphire],

  connectors: [
    metaMask({
      shimDisconnect: true,
      chains: [sapphire, sapphireTestnet],
      options: {
        shimDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: true,
        name: 'MetaMask',
      }
    }),
    coinbaseWallet({
      appName: 'Bit Protocol',
      chains: [sapphire, sapphireTestnet],
      options: {
        darkMode: false,
        headlessMode: false,
        enableMobileWalletLink: true,
        preferredNetwork: CHAIN_ID.SAPPHIRE_TESTNET.toString(),
        chainParameters: {
          [CHAIN_ID.SAPPHIRE_TESTNET]: {
            chainId: `0x${CHAIN_ID.SAPPHIRE_TESTNET.toString(16)}`,
            chainName: 'Oasis Sapphire Testnet',
            nativeCurrency: {
              name: 'TEST',
              symbol: 'TEST',
              decimals: 18
            },
            rpcUrls: ['https://testnet.sapphire.oasis.dev'],
            blockExplorerUrls: ['https://testnet.explorer.sapphire.oasis.dev']
          }
        },
        reloadOnDisconnect: true,
        shimDisconnect: true
      }
    })
  ],

  transports: {
    [sapphire.id]: sapphireHttpTransport({
      transport: createTransport(sapphire.rpcUrls.default.http[0])
    }),
    [sapphireTestnet.id]: sapphireHttpTransport({
      transport: createTransport(sapphireTestnet.rpcUrls.default.http[0])
    })
  },

  syncConnectedChain: true,
  multiInjectedProviderDiscovery: false,
});