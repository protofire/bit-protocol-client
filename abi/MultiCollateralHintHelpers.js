const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_borrowerOperationsAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_gasCompensation",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CCR",
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
    name: "DEBT_GAS_COMPENSATION",
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
    name: "DECIMAL_PRECISION",
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
    name: "PERCENT_DIVISOR",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_coll",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_debt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "computeCR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_coll",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_debt",
        type: "uint256",
      },
    ],
    name: "computeNominalCR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ITroveManager",
        name: "troveManager",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_CR",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_numTrials",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_inputRandomSeed",
        type: "uint256",
      },
    ],
    name: "getApproxHint",
    outputs: [
      {
        internalType: "address",
        name: "hintAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "diff",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "latestRandomSeed",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ITroveManager",
        name: "troveManager",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_debtAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxIterations",
        type: "uint256",
      },
    ],
    name: "getRedemptionHints",
    outputs: [
      {
        internalType: "address",
        name: "firstRedemptionHint",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "partialRedemptionHintNICR",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "truncatedDebtAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default abi;
