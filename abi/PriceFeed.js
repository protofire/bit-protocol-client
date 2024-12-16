const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_bitCore",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "address",
            name: "band",
            type: "address",
          },
          {
            internalType: "string",
            name: "base",
            type: "string",
          },
          {
            internalType: "string",
            name: "quote",
            type: "string",
          },
          {
            internalType: "uint32",
            name: "heartbeat",
            type: "uint32",
          },
        ],
        internalType: "struct PriceFeed.OracleSetup[]",
        name: "oracles",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "PriceFeed__FeedFrozenError",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceFeed__HeartbeatOutOfBoundsError",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "PriceFeed__InvalidFeedResponseError",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "PriceFeed__UnknownFeedError",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bandAggregator",
        type: "address",
      },
    ],
    name: "NewOracleRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "oracle",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isWorking",
        type: "bool",
      },
    ],
    name: "PriceFeedStatusUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "PriceRecordUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_PRICE_DEVIATION_FROM_PREVIOUS_ROUND",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RESPONSE_TIMEOUT_BUFFER",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bit_CORE",
    outputs: [
      {
        internalType: "contract IBitCore",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "fetchPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "guardian",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "loadPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "oracleRecords",
    outputs: [
      {
        internalType: "contract IStdReference",
        name: "bandOracle",
        type: "address",
      },
      {
        internalType: "string",
        name: "base",
        type: "string",
      },
      {
        internalType: "string",
        name: "quote",
        type: "string",
      },
      {
        internalType: "uint32",
        name: "heartbeat",
        type: "uint32",
      },
      {
        internalType: "bool",
        name: "isFeedWorking",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "priceRecords",
    outputs: [
      {
        internalType: "uint96",
        name: "price",
        type: "uint96",
      },
      {
        internalType: "uint32",
        name: "timestamp",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "lastUpdated",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_bandOracle",
        type: "address",
      },
      {
        internalType: "string",
        name: "_base",
        type: "string",
      },
      {
        internalType: "string",
        name: "_quote",
        type: "string",
      },
      {
        internalType: "uint32",
        name: "_heartbeat",
        type: "uint32",
      },
    ],
    name: "setOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default abi;
