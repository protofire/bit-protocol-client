import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sapphire, sapphireTestnet } from "wagmi/chains";

export const CHAIN_ID = {
  SAPPHIRE: sapphire.id,
  SAPPHIRE_TESTNET: sapphireTestnet.id,
};

export const config = getDefaultConfig({
  appName: "Bit Protocol",
  chains: [sapphire],
  projectId: "7fabb9fcd815ac04dfd210d062824df1",
});

// import { http, createConfig } from "wagmi";
// import { sapphire, sapphireTestnet } from "wagmi/chains";
// import { coinbaseWallet, metaMask } from "wagmi/connectors";
// import { sapphireHttpTransport } from "@oasisprotocol/sapphire-wagmi-v2";

// export const CHAIN_ID = {
//   SAPPHIRE: sapphire.id,
//   SAPPHIRE_TESTNET: sapphireTestnet.id,
// };

// const projectId = "7fabb9fcd815ac04dfd210d062824df1";

// const createTransport = (url) => {
//   return http(url, {
//     timeout: 15000,
//   });
// };

// export const config = createConfig({
//   chains: [sapphire],
//   // chains: [sapphireTestnet, sapphire],

//   connectors: [
//     metaMask({
//       shimDisconnect: true,
//       chains: [sapphire],
//       // chains: [sapphire, sapphireTestnet],
//       options: {
//         shimDisconnect: true,
//         UNSTABLE_shimOnConnectSelectAccount: true,
//         name: "MetaMask",
//       },
//     }),
//     coinbaseWallet({
//       appName: "Bit Protocol",
//       chains: [sapphire],
//       // chains: [sapphire, sapphireTestnet],
//       options: {
//         darkMode: false,
//         headlessMode: false,
//         enableMobileWalletLink: true,
//         preferredNetwork: CHAIN_ID.SAPPHIRE.toString(),
//         chainParameters: {
//           [CHAIN_ID.SAPPHIRE]: {
//             chainId: `0x${CHAIN_ID.SAPPHIRE.toString(16)}`,
//             chainName: "Oasis Sapphire",
//             nativeCurrency: {
//               name: "ROSE",
//               symbol: "ROSE",
//               decimals: 18,
//             },
//             rpcUrls: ["https://sapphire.oasis.dev"],
//             blockExplorerUrls: ["https://explorer.sapphire.oasis.dev"],
//           },
//         },
//         reloadOnDisconnect: true,
//         shimDisconnect: true,
//       },
//     }),
//   ],

//   transports: {
//     [sapphire.id]: sapphireHttpTransport({
//       transport: createTransport(sapphire.rpcUrls.default.http[0]),
//     }),
//     // [sapphireTestnet.id]: sapphireHttpTransport({
//     //   transport: createTransport(sapphireTestnet.rpcUrls.default.http[0]),
//     // }),
//   },

//   syncConnectedChain: true,
//   multiInjectedProviderDiscovery: false,
// });
