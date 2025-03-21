const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_bitCore",
        type: "address",
      },
      {
        internalType: "contract IDebtToken",
        name: "_debtToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ERC1167FailedCreateClone",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "collateral",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "priceFeed",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "troveManager",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sortedTroves",
        type: "address",
      },
    ],
    name: "NewDeployment",
    type: "event",
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
    inputs: [],
    name: "borrowerOperations",
    outputs: [
      {
        internalType: "contract IBorrowerOperations",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "debtToken",
    outputs: [
      {
        internalType: "contract IDebtToken",
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
        name: "collateral",
        type: "address",
      },
      {
        internalType: "address",
        name: "priceFeed",
        type: "address",
      },
      {
        internalType: "address",
        name: "customTroveManagerImpl",
        type: "address",
      },
      {
        internalType: "address",
        name: "customSortedTrovesImpl",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "minuteDecayFactor",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "redemptionFeeFloor",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxRedemptionFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "borrowingFeeFloor",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxBorrowingFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "interestRateInBps",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxDebt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "MCR",
            type: "uint256",
          },
        ],
        internalType: "struct Factory.DeploymentParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "deployNewInstance",
    outputs: [],
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
    inputs: [],
    name: "liquidationManager",
    outputs: [
      {
        internalType: "contract ILiquidationManager",
        name: "",
        type: "address",
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
        name: "_troveManagerImpl",
        type: "address",
      },
      {
        internalType: "address",
        name: "_sortedTrovesImpl",
        type: "address",
      },
    ],
    name: "setImplementations",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IStabilityPool",
        name: "_stabilityPool",
        type: "address",
      },
      {
        internalType: "contract IBorrowerOperations",
        name: "_borrowerOperations",
        type: "address",
      },
      {
        internalType: "address",
        name: "_sortedTroves",
        type: "address",
      },
      {
        internalType: "address",
        name: "_troveManager",
        type: "address",
      },
      {
        internalType: "contract ILiquidationManager",
        name: "_liquidationManager",
        type: "address",
      },
    ],
    name: "setInitialParameters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_troveManager",
        type: "address",
      },
      {
        internalType: "bool",
        name: "bol",
        type: "bool",
      },
    ],
    name: "setTroveManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "sortedTrovesImpl",
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
    inputs: [],
    name: "stabilityPool",
    outputs: [
      {
        internalType: "contract IStabilityPool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "troveManagerCount",
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
    name: "troveManagerImpl",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "troveManagers",
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
];

export default abi;
