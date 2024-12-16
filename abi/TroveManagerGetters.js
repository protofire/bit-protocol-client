const abi = [
  {
    inputs: [
      {
        internalType: "contract IFactory",
        name: "_factory",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "EIP712_DOMAIN_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SIGNIN_TYPE",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SIGNIN_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "contract IFactory",
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
        name: "account",
        type: "address",
      },
    ],
    name: "getActiveTroveManagersForAccount",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllCollateralsAndTroveManagers",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "collateral",
            type: "address",
          },
          {
            internalType: "address[]",
            name: "troveManagers",
            type: "address[]",
          },
        ],
        internalType: "struct TroveManagerGetters.Collateral[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct SignatureRSV",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct BitSignature.SignIn",
        name: "auth",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_troveManager",
        type: "address",
      },
    ],
    name: "getEntireDebtAndColl",
    outputs: [
      {
        internalType: "uint256",
        name: "debt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "coll",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pendingDebtReward",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pendingCollateralReward",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct SignatureRSV",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct BitSignature.SignIn",
        name: "auth",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_troveManager",
        type: "address",
      },
    ],
    name: "getNominalICR",
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
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct SignatureRSV",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct BitSignature.SignIn",
        name: "auth",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_troveManager",
        type: "address",
      },
    ],
    name: "getPendingCollAndDebtRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct SignatureRSV",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct BitSignature.SignIn",
        name: "auth",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_troveManager",
        type: "address",
      },
    ],
    name: "getTrove",
    outputs: [
      {
        internalType: "uint256",
        name: "debt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "coll",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "uint128",
        name: "arrayIndex",
        type: "uint128",
      },
      {
        internalType: "uint256",
        name: "activeInterestIndex",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct SignatureRSV",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct BitSignature.SignIn",
        name: "auth",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_troveManager",
        type: "address",
      },
    ],
    name: "getTroveCollAndDebt",
    outputs: [
      {
        internalType: "uint256",
        name: "coll",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "debt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct SignatureRSV",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct BitSignature.SignIn",
        name: "auth",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_troveManager",
        type: "address",
      },
    ],
    name: "getTroveStake",
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
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct SignatureRSV",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct BitSignature.SignIn",
        name: "auth",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_troveManager",
        type: "address",
      },
    ],
    name: "getTroveStatus",
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
];
export default abi;
