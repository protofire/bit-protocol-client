const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_bitCore",
        type: "address",
      },
      {
        internalType: "contract ITokenLocker",
        name: "_locker",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_graceWeeks",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "MAX_BOOST_GRACE_WEEKS",
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
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "previousAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalWeeklyEmissions",
        type: "uint256",
      },
    ],
    name: "getBoostedAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "adjustedAmount",
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
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "previousAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalWeeklyEmissions",
        type: "uint256",
      },
    ],
    name: "getBoostedAmountWrite",
    outputs: [
      {
        internalType: "uint256",
        name: "adjustedAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "claimant",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "previousAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalWeeklyEmissions",
        type: "uint256",
      },
    ],
    name: "getClaimableWithBoost",
    outputs: [
      {
        internalType: "uint256",
        name: "maxBoosted",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "boosted",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getWeek",
    outputs: [
      {
        internalType: "uint256",
        name: "week",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "locker",
    outputs: [
      {
        internalType: "contract ITokenLocker",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default abi;
