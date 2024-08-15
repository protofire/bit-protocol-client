import { createContext, useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import * as sapphire from "@oasisprotocol/sapphire-paratime";
import BigNumber from "bignumber.js";
import { useConnectWallet } from "@web3-onboard/react";
import idoHook from "../abi/ido";
import tokenHook from "../abi/token";
import BorrowerOperationsHook from "../abi/BorrowerOperations";
import SortedTrovesHook from "../abi/SortedTroves";
import TroveManagerHook from "../abi/TroveManager";
import PriceFeedHook from "../abi/PriceFeed";
import TroveManagerGettersHook from "../abi/TroveManagerGetters";
import tokenLockerHook from "../abi/tokenLocker";
import BoostCalculatorHook from "../abi/BoostCalculator";
import VineLpTokenPoolHook from "../abi/VineLpTokenPool";
import LPPriceOracleHook from "../abi/LPPriceOracle";
import StabilityPoolHook from "../abi/StabilityPool";
import MultiCollateralHintHelpersHook from "../abi/MultiCollateralHintHelpers";
import IncentiveVotingHook from "../abi/IncentiveVoting";
import idovestingHook from "../abi/idovesting";
import vineVaultHook from "../abi/vineVault";

export const UserContext = createContext({
  account: "",
  setAccount: () => {},
  ethersProvider: undefined,
  setEthersProvider: () => {},
  idoAddr: "",
  usdcAddr: "",
  idoAbi: "",
  tokenAbi: "",
  tokenLockerAbi: "",
  signer: undefined,
  setSigner: () => {},
  infuraRPC: "",
  currentState: false,
  setCurrentState: () => {},
  currentWaitInfo: {},
  setCurrentWaitInfo: () => {},

  troveManager: "",
  sortedTroves: "",
  borrowerOperations: "",
  troveManagerGetters: "",
  priceFeed: "",
  debtToken: "",
  vineToken: "",
  tokenLocker: "",
  BoostCalculator: "",
  VineLpTokenPool: "",
  mockLp: "",
  LPPriceOracle: "",
  stabilityPool: "",
  MultiCollateralHintHelpers: "",
  incentiveVoting: "",
  idovesting: "",
  vineVault: "",
  VUSDUSDCLP: "",
  usdcPool: "",

  BorrowerOperationsAbi: "",
  SortedTrovesAbi: "",
  TroveManagerAbi: "",
  PriceFeedAbi: "",
  TroveManagerGettersAbi: "",
  BoostCalculatorAbi: "",
  VineLpTokenPoolAbi: "",
  LPPriceOracleAbi: "",
  StabilityPoolAbi: "",
  MultiCollateralHintHelpersAbi: "",
  IncentiveVotingAbi: "",
  idovestingAbi: "",
  vineVaultAbi: "",

  sapphireProvider: undefined,
  setSapphireProvider: () => {},
  sapphireProviderSigner: undefined,
  setSapphireProviderSigner: () => {},

  balance: 0,
  totalRose: 0,

  signInAuth: {},
  setSignInAuth: () => {},
  signInAuthToken: {},
  setSignInAuthToken: () => {},

  sortedTrovesToken: "",
  troveManagerGettersSigner: "",
  borrowerOperationsMint: "",
  priceFeedToken: "",
  debtTokenQuery: "",
  vineTokenQuery: "",
  tokenLockerMain: "",
  tokenLockerQuery: "",
  boostCalculatorQuery: "",
  vineLpTokenPoolMain: "",
  troveManagerMain: "",
  incentiveVotingMain: "",
  mockLpQuery: "",
  vineLpTokenPoolQuery: "",
  lPPriceOracleQuery: "",
  mockLpMain: "",
  stabilityPoolMain: "",
  stabilityPoolQuery: "",
  multiCollateralHintHelpersQuery: "",
  troveManagerQuery: "",
  incentiveVotingQuery: "",
  idovestingQuery: "",
  idovestingMain: "",
  vineVaultMain: "",
  vineVaultQuery: "",
  VUSDUSDCLPQuery: "",
  usdcPoolQuery: "",
  VUSDUSDCLPMain: "",
  usdcPoolMain: "",

  status: 0,
  deposits: 0,
  debt: 0,
  pre: 0,
  next: 0,
  rosePrice: 0,
  vUSDbalance: 0,
  lpPrice: 0,
  vinePrice: 0,
  boost: 0,
  totalTvl: 0,

  vaultEarned: 0,
  vineRoseEarned: 0,
  stabilityEarned: 0,
  vusdUsdcEarned: 0,

  formatNum: (num) => {},
});

export const UserContextProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [ethersProvider, setEthersProvider] = useState(undefined);
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [signInAuth, setSignInAuth] = useState({});
  const [signInAuthToken, setSignInAuthToken] = useState({});

  const formatNum = (num) => {
    if (Number(num) >= 1000000000) {
      return Number(num / 1000000000).toLocaleString() + "B";
    } else if (num >= 1000000) {
      return Number(num / 1000000).toLocaleString() + "M";
    } else {
      return Number(num).toLocaleString();
    }
  };

  const [signer, setSigner] = useState(undefined);
  const infuraRPC = "https://sapphire.oasis.io";
  // const infuraRPC = "https://testnet.sapphire.oasis.dev/";

  const idoAddr = "0xfc340b4bAA34Ce98c312d4b6B739CCD56f5359c5";
  const usdcAddr = "0x5A80eA8e945312D24a85d1F1C684f092aD43B566";
  const idoAbi = idoHook;
  const tokenAbi = tokenHook;

  const troveManager = "0x06eBC049Fa9d394Aa660E79b94c0278C677ba773";
  const sortedTroves = "0xfAc36524Eb744fDc7cE6Ac52608D88aA4E90a7fA";
  const borrowerOperations = "0x942432ad0F0D55AC01C8661619be93d8940A1820";
  const troveManagerGetters = "0xBf2fe64DCaA032b33e4412798a5DbF9BDafcC05E";
  const priceFeed = "0xee6A971FECE446AFD6181bACFb1F8Ae5fCa787fc";
  const debtToken = "0xB0159B1f625d83539D6db40CB2bc3DC4309038Ac";
  const vineToken = "0xf7E952095be89627e77c85633F7567CfB30f07c1";
  const tokenLocker = "0x3A2c1D25c2F97E144d43d6B421022F976FcB3D09";
  const BoostCalculator = "0xCd2327F3631d220972aEdb4d07Ed42efe157CF71";
  const mockLp = "0xf1E00B2B98d9c796963C4251738f5f6e2b31453d"; //VinelpToken
  const VineLpTokenPool = "0xE4F88f60f3C3262Be66FDfca40FA9Fbd64Cf7aD9";
  const LPPriceOracle = "0x6b7BC9dD2b851587863fa5c77636869fe1206d9a";
  const stabilityPool = "0x6D920d36A6D1948c1d911aCB457b2545c4012ccf";
  const MultiCollateralHintHelpers =
    "0x195C411887ef06119Efe3DF523D75930863C4172";
  const incentiveVoting = "0x0f4F2E81eA524a0bEA415187Cf5c98eAfAACF45c";
  const idovesting = "0xAA854f386fe35983ac5bA8d9998224cdBd89c72c"; //iDOTokenVesting
  const vineVault = "0xc5cEdeF3c75Bb5b5Ca653A5E937995E29350FadE";
  const VUSDUSDCLP = "0x2BCD9a9Cc2a49E00cB58b9EE3855dF5bC80dfFee";
  const usdcPool = "0x7EAAB9F7C992eE3cD1D9F055511Af5741B372124";
  const wRose = "0x8Bc2B030b299964eEfb5e1e0b36991352E56D2D3";

  const BorrowerOperationsAbi = BorrowerOperationsHook;
  const SortedTrovesAbi = SortedTrovesHook;
  const TroveManagerAbi = TroveManagerHook;
  const PriceFeedAbi = PriceFeedHook;
  const TroveManagerGettersAbi = TroveManagerGettersHook;
  const tokenLockerAbi = tokenLockerHook;
  const BoostCalculatorAbi = BoostCalculatorHook;
  const VineLpTokenPoolAbi = VineLpTokenPoolHook;
  const LPPriceOracleAbi = LPPriceOracleHook;
  const StabilityPoolAbi = StabilityPoolHook;
  const MultiCollateralHintHelpersAbi = MultiCollateralHintHelpersHook;
  const IncentiveVotingAbi = IncentiveVotingHook;
  const idovestingAbi = idovestingHook;
  const vineVaultAbi = vineVaultHook;

  const [sapphireProvider, setSapphireProvider] = useState(undefined);
  const [sapphireProviderSigner, setSapphireProviderSigner] =
    useState(undefined);

  const [balance, setBalance] = useState(0);
  const [vUSDbalance, setvUSDbalance] = useState(0);

  useEffect(() => {
    if (account) {
      setSapphireProvider(
        sapphire.wrap(new ethers.providers.Web3Provider(wallet.provider))
      );
      setSapphireProviderSigner(
        sapphire.wrap(
          new ethers.providers.Web3Provider(wallet.provider).getSigner()
        )
      );
    } else {
      setSapphireProvider(
        sapphire.wrap(new ethers.providers.JsonRpcProvider(infuraRPC))
      );
      setSapphireProviderSigner(
        sapphire.wrap(
          new ethers.providers.JsonRpcProvider(infuraRPC).getSigner()
        )
      );
    }
  }, [account]);

  const [totalRose, setTotalRose] = useState(0);
  const getBalance = async () => {
    const user = await ethersProvider.getBalance(account);
    setBalance(new BigNumber(user._hex).div(1e18).toFixed());
    const totalRose = await ethersProvider.getBalance(stabilityPool);
    setTotalRose(new BigNumber(totalRose._hex).div(1e18).toFixed());
  };

  const [currentState, setCurrentState] = useState(false);
  const [currentWaitInfo, setCurrentWaitInfo] = useState({
    type: "",
    info: "",
  });

  const [sortedTrovesToken, setSortedTrovesToken] = useState(null);
  const [troveManagerGettersSigner, setTroveManagerGettersSigner] =
    useState(null);
  const [troveManagerSigner, setTroveManagerSigner] = useState(null);
  const [priceFeedToken, setPriceFeedToken] = useState(null);
  const [debtTokenQuery, setDebtTokenQuery] = useState(null);

  const [vineTokenQuery, setVineTokenQuery] = useState(null);
  const [tokenLockerQuery, setTokenLockerQuery] = useState(null);
  const [boostCalculatorQuery, setBoostCalculatorQuery] = useState(null);
  const [mockLpQuery, setMockLpQuery] = useState(null);
  const [vineLpTokenPoolQuery, setVineLpTokenPoolQuery] = useState(null);
  const [lPPriceOracleQuery, setLPPriceOracleQuery] = useState(null);
  const [stabilityPoolMain, setStabilityPoolMain] = useState(null);
  const [stabilityPoolQuery, setStabilityPoolQuery] = useState(null);
  const [multiCollateralHintHelpersQuery, setMultiCollateralHintHelpersQuery] =
    useState(null);
  const [troveManagerQuery, setTroveManagerQuery] = useState(null);
  const [incentiveVotingQuery, setIncentiveVotingQuery] = useState(null);
  const [idovestingQuery, setIdovestingQuery] = useState(null);
  const [vineVaultQuery, setVineVaultQuery] = useState(null);

  const [VUSDUSDCLPQuery, setVUSDUSDCLPQuery] = useState(null);
  const [usdcPoolQuery, setusdcPoolQuery] = useState(null);
  const [wRoseQuery, setwRoseQuery] = useState(null);
  // const [borrowerOperationsQuery, setBorrowerOperationsQuery] = useState(null);

  useEffect(() => {
    if (sapphireProvider) {
      setSortedTrovesToken(
        new ethers.Contract(sortedTroves, SortedTrovesAbi, sapphireProvider)
      );
      setPriceFeedToken(
        new ethers.Contract(priceFeed, PriceFeedAbi, sapphireProvider)
      );
      setVineTokenQuery(
        new ethers.Contract(vineToken, tokenAbi, sapphireProvider)
      );
      setTokenLockerQuery(
        new ethers.Contract(tokenLocker, tokenLockerAbi, sapphireProvider)
      );
      setBoostCalculatorQuery(
        new ethers.Contract(
          BoostCalculator,
          BoostCalculatorAbi,
          sapphireProvider
        )
      );

      setMockLpQuery(new ethers.Contract(mockLp, tokenAbi, sapphireProvider));
      setVineLpTokenPoolQuery(
        new ethers.Contract(
          VineLpTokenPool,
          VineLpTokenPoolAbi,
          sapphireProvider
        )
      );
      setLPPriceOracleQuery(
        new ethers.Contract(LPPriceOracle, LPPriceOracleAbi, sapphireProvider)
      );
      setStabilityPoolQuery(
        new ethers.Contract(stabilityPool, StabilityPoolAbi, sapphireProvider)
      );
      setMultiCollateralHintHelpersQuery(
        new ethers.Contract(
          MultiCollateralHintHelpers,
          MultiCollateralHintHelpersAbi,
          sapphireProvider
        )
      );
      setTroveManagerQuery(
        new ethers.Contract(troveManager, TroveManagerAbi, sapphireProvider)
      );

      setIncentiveVotingQuery(
        new ethers.Contract(
          incentiveVoting,
          IncentiveVotingAbi,
          sapphireProvider
        )
      );
      setIdovestingQuery(
        new ethers.Contract(idovesting, idovestingAbi, sapphireProvider)
      );
      setVineVaultQuery(
        new ethers.Contract(vineVault, vineVaultAbi, sapphireProvider)
      );

      setVUSDUSDCLPQuery(
        new ethers.Contract(VUSDUSDCLP, tokenAbi, sapphireProvider)
      );
      setusdcPoolQuery(
        new ethers.Contract(usdcPool, VineLpTokenPoolAbi, sapphireProvider)
      );
      setwRoseQuery(
        new ethers.Contract(wRose, VineLpTokenPoolAbi, sapphireProvider)
      );

      // setBorrowerOperationsQuery(new ethers.Contract(borrowerOperations, BorrowerOperationsAbi, sapphireProvider));

      if (signInAuth) {
        setTroveManagerGettersSigner(
          new ethers.Contract(
            troveManagerGetters,
            TroveManagerGettersAbi,
            sapphireProvider
          )
        );

        setTroveManagerSigner(
          new ethers.Contract(troveManager, TroveManagerAbi, sapphireProvider)
        );
      }
      if (signInAuthToken) {
        setDebtTokenQuery(
          new ethers.Contract(debtToken, tokenAbi, sapphireProvider)
        );
      }
    }
  }, [sapphireProvider, signInAuth, signInAuthToken]);

  const [borrowerOperationsMint, setBorrowerOperationsMint] = useState(null);
  const [tokenLockerMain, setTokenLockerMain] = useState(null);
  const [mockLpMain, setMockLpMain] = useState(null);
  const [vineLpTokenPoolMain, setVineLpTokenPoolMain] = useState(null);
  const [troveManagerMain, setTroveManagerMain] = useState(null);
  const [incentiveVotingMain, setIncentiveVotingMain] = useState(null);
  const [idovestingMain, setIdovestingMain] = useState(null);
  const [vineVaultMain, setVineVaultMain] = useState(null);

  const [VUSDUSDCLPMain, setVUSDUSDCLPMain] = useState(null);
  const [usdcPoolMain, setusdcPoolMain] = useState(null);

  useEffect(() => {
    if (sapphireProviderSigner) {
      setBorrowerOperationsMint(
        new ethers.Contract(
          borrowerOperations,
          BorrowerOperationsAbi,
          sapphireProviderSigner
        )
      );
      setTokenLockerMain(
        new ethers.Contract(tokenLocker, tokenLockerAbi, sapphireProviderSigner)
      );
      setMockLpMain(
        new ethers.Contract(mockLp, tokenAbi, sapphireProviderSigner)
      );
      setVineLpTokenPoolMain(
        new ethers.Contract(
          VineLpTokenPool,
          VineLpTokenPoolAbi,
          sapphireProviderSigner
        )
      );
      setStabilityPoolMain(
        new ethers.Contract(
          stabilityPool,
          StabilityPoolAbi,
          sapphireProviderSigner
        )
      );
      setTroveManagerMain(
        new ethers.Contract(
          troveManager,
          TroveManagerAbi,
          sapphireProviderSigner
        )
      );
      setIncentiveVotingMain(
        new ethers.Contract(
          incentiveVoting,
          IncentiveVotingAbi,
          sapphireProviderSigner
        )
      );
      setIdovestingMain(
        new ethers.Contract(idovesting, idovestingAbi, sapphireProviderSigner)
      );
      setVineVaultMain(
        new ethers.Contract(vineVault, vineVaultAbi, sapphireProviderSigner)
      );
      setVUSDUSDCLPMain(
        new ethers.Contract(VUSDUSDCLP, tokenAbi, sapphireProviderSigner)
      );
      setusdcPoolMain(
        new ethers.Contract(
          usdcPool,
          VineLpTokenPoolAbi,
          sapphireProviderSigner
        )
      );
    }
  }, [sapphireProviderSigner]);

  const [status, setStatus] = useState(0);
  const [deposits, setDeposits] = useState(0);
  const [debt, setDebt] = useState(0);
  const [pre, setPre] = useState(0);
  const [next, setNext] = useState(0);
  const [rosePrice, setRosePrice] = useState(0);
  const [lpPrice, setLpPrice] = useState(0);
  const [vinePrice, setVinePrice] = useState(0);
  const [boost, setBoost] = useState(0);
  const [totalTvl, setTotalTvl] = useState(0);

  const [vaultEarned, setvaultEarned] = useState(0);
  const [vineRoseEarned, setvineRoseEarned] = useState(0);
  const [stabilityEarned, setstabilityEarned] = useState(0);
  const [vusdUsdcEarned, setvusdUsdcEarned] = useState(0);
  const getData = async () => {
    if (account && signInAuth.user && signInAuthToken.user) {
      getBalance();
      const trove = await troveManagerGettersSigner.getTrove(
        signInAuth,
        troveManager
      );
      setDeposits(Number(new BigNumber(trove.coll._hex).div(1e18).toFixed()));
      setDebt(Number(new BigNumber(trove.debt._hex).div(1e18).toFixed()));
      setStatus(trove.status);

      const pre = await sortedTrovesToken.getPrev(account);
      const next = await sortedTrovesToken.getNext(account);
      setPre(pre);
      setNext(next);
      const balanceOf = await debtTokenQuery.checkBalanceOf(signInAuthToken);
      // const balanceOf = await debtTokenQuery.balanceOf(account);
      setvUSDbalance(new BigNumber(balanceOf._hex).div(1e18).toFixed());

      const boost = await boostCalculatorQuery.getBoostedAmount(
        account,
        10000,
        0,
        100000
      );
      setBoost(new BigNumber(boost._hex).multipliedBy(2).div(10000).toFixed());

      //vUSD Minting
      const vaultEarned = await vineVaultQuery.claimableRewardAfterBoost(
        account,
        account,
        "0x0000000000000000000000000000000000000000",
        troveManager
      );
      setvaultEarned(Number(vaultEarned.adjustedAmount._hex) / 1e18);

      //VINE/ROSE LP
      // const vineRoseEarned = await vineVaultQuery.claimableRewardAfterBoost(
      //   account,
      //   account,
      //   "0x0000000000000000000000000000000000000000",
      //   VineLpTokenPool
      // );
      // setvineRoseEarned(Number(vineRoseEarned.adjustedAmount._hex) / 1e18);

      //Stability Pool
      const stabilityEarned = await vineVaultQuery.claimableRewardAfterBoost(
        account,
        account,
        "0x0000000000000000000000000000000000000000",
        stabilityPool
      );
      setstabilityEarned(Number(stabilityEarned.adjustedAmount._hex) / 1e18);

      // // //vUSD/USDC LP
      // const vusdUsdcEarned = await vineVaultQuery.claimableRewardAfterBoost(
      //   account,
      //   account,
      //   "0x0000000000000000000000000000000000000000",
      //   usdcPool
      // );
      // setvusdUsdcEarned(Number(vusdUsdcEarned.adjustedAmount._hex) / 1e18);
    }
    const rosePrice = await priceFeedToken.loadPrice(
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    );
    setRosePrice(Number(rosePrice) / 1e18);
    // const lpPrice = await lPPriceOracleQuery.getReferenceData("LP", "USD");
    // setLpPrice(Number(lpPrice[0]._hex) / 1e18);
    // TODO: MOCK FOR NOW
    setLpPrice(1);

    const wRosebalance = await wRoseQuery.balanceOf(mockLp);
    const wRosebalance2 = await vineTokenQuery.balanceOf(mockLp);
    const vPrice =
      (Number(wRosebalance._hex) * Number(rosePrice)) /
        1e18 /
        Number(wRosebalance2._hex) || 1;
    // console.log("vine price", {
    //   vPrice,
    //   wROse: Number(wRosebalance._hex),
    //   rosePrice: Number(rosePrice),
    //   wRose2: Number(wRosebalance2._hex),
    // });
    setVinePrice(vPrice);

    const totalTvl = await ethersProvider.getBalance(borrowerOperations);
    setTotalTvl((Number(totalTvl) / 1e18) * (Number(rosePrice) / 1e18));
  };

  let timerLoading = useRef(null);
  useEffect(() => {
    if (
      troveManagerGettersSigner &&
      sortedTrovesToken &&
      priceFeedToken &&
      debtTokenQuery &&
      ethersProvider &&
      lPPriceOracleQuery
    ) {
      getData();
      timerLoading.current = setInterval(() => {
        getData();
      }, 3000);
      return () => clearInterval(timerLoading.current);
    }
  }, [
    troveManagerGettersSigner,
    sortedTrovesToken,
    priceFeedToken,
    debtTokenQuery,
    ethersProvider,
    lPPriceOracleQuery,
  ]);

  // const txs = new ethers.Contract(stabilityPool, StabilityPoolAbi, ethersProvider);

  // const getTransactionItem = async () => {
  //     let filterFrom = txs.filters.CollateralGainWithdrawn(null, null);
  //     const RewardClaimed = await txs.queryFilter(filterFrom, 3288360, 3296155 + 100);
  //     console.log("--------------", RewardClaimed)
  // }

  // useEffect(() => {
  //     if (txs) {
  //         getTransactionItem()
  //     }
  // }, [txs])

  return (
    <UserContext.Provider
      value={{
        account,
        setAccount,
        ethersProvider,
        setEthersProvider,
        idoAddr,
        usdcAddr,
        idoAbi,
        tokenAbi,
        signer,
        setSigner,
        infuraRPC,
        currentState,
        setCurrentState,
        currentWaitInfo,
        setCurrentWaitInfo,
        troveManager,
        sortedTroves,
        borrowerOperations,
        troveManagerGetters,
        priceFeed,
        debtToken,
        vineToken,
        tokenLocker,
        BoostCalculator,
        VineLpTokenPool,
        LPPriceOracle,
        stabilityPool,
        MultiCollateralHintHelpers,
        incentiveVoting,
        idovesting,
        vineVault,
        VUSDUSDCLP,
        usdcPool,
        mockLp,
        sapphireProvider,
        setSapphireProvider,
        BorrowerOperationsAbi,
        SortedTrovesAbi,
        TroveManagerAbi,
        PriceFeedAbi,
        TroveManagerGettersAbi,
        BoostCalculatorAbi,
        VineLpTokenPoolAbi,
        LPPriceOracleAbi,
        StabilityPoolAbi,
        MultiCollateralHintHelpersAbi,
        IncentiveVotingAbi,
        idovestingAbi,
        vineVaultAbi,
        sapphireProviderSigner,
        setSapphireProviderSigner,
        balance,
        totalRose,
        signInAuth,
        setSignInAuth,
        signInAuthToken,
        setSignInAuthToken,
        sortedTrovesToken,
        troveManagerGettersSigner,
        borrowerOperationsMint,
        priceFeedToken,
        status,
        deposits,
        debt,
        pre,
        next,
        rosePrice,
        vUSDbalance,
        lpPrice,
        vinePrice,
        boost,
        totalTvl,
        debtTokenQuery,
        vineTokenQuery,
        tokenLockerMain,
        vineLpTokenPoolMain,
        troveManagerMain,
        incentiveVotingMain,
        mockLpQuery,
        vineLpTokenPoolQuery,
        lPPriceOracleQuery,
        stabilityPoolMain,
        stabilityPoolQuery,
        multiCollateralHintHelpersQuery,
        troveManagerQuery,
        incentiveVotingQuery,
        tokenLockerQuery,
        boostCalculatorQuery,
        idovestingQuery,
        vineVaultQuery,
        idovestingMain,
        mockLpMain,
        vineVaultMain,
        VUSDUSDCLPQuery,
        usdcPoolQuery,
        VUSDUSDCLPMain,
        usdcPoolMain,
        formatNum,
        vaultEarned,
        vineRoseEarned,
        stabilityEarned,
        vusdUsdcEarned,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
