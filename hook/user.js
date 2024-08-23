import { createContext, useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
// import * as sapphire from "@oasisprotocol/sapphire-paratime";
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
  wrappedCoin: "",
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
  const infuraRPC = "https://devilmorallyelephant-rpc.eu-north-2.gateway.fm/";
  // const infuraRPC = "https://testnet.sapphire.oasis.dev/";

  const idoAddr = "0x0000000000000000000000000000000000000000";
  const usdcAddr = "0x0000000000000000000000000000000000000000";
  const idoAbi = idoHook;
  const tokenAbi = tokenHook;

  const troveManager = "0x5ACdCC77C064713Ac80a8Db43ac0ff9E9F756Df3";
  const sortedTroves = "0x1B5F877BC57BCd2B02089A8758d3aa007d56bA03";
  const borrowerOperations = "0x211554fb6b2b0068c231072335Be1cbDF88E3dB3";
  const troveManagerGetters = "0x327dbE693C56236C421430eEdd70FE606aA74988";
  const priceFeed = "0xc881e4bE73945Bc627DD731745916c6FCCe49bE9";
  const debtToken = "0xE70339B928F9b6620778866a62e953D115155433";
  const vineToken = "0x2C9E89e77Ad6b2A8c2cC127782DE811c89e8C4Cc";
  const tokenLocker = "0x06652790cb2C6CddE1FC204b8e7c3d099aF4f21e";
  const BoostCalculator = "0x07A793f9d906256d9E598b204C9B78d1F52F8f02";
  const mockLp = "0x0000000000000000000000000000000000000000"; //VinelpToken
  const VineLpTokenPool = "0x0000000000000000000000000000000000000000";
  const LPPriceOracle = "0x1b20014e1878e3F3ba8d8653aE61BAABbDAE4163";
  const stabilityPool = "0x60137625845CbcE178a8b1AF62c6eEddaABd5B5C";
  const MultiCollateralHintHelpers =
    "0x4CB5Ab4cc7F2f05148664b7DE2DEEAE7e7714Cc7";
  const incentiveVoting = "0xa86a14E9E237bA939fBDA8735d8709FAa82173ef";
  const idovesting = "0x8B5A01307BEd478d3d442910113Bef0E317bddcA"; //iDOTokenVesting
  const vineVault = "0x5E632549CcDbCf6B8a90745fE54aF2501C8dD624";
  const VUSDUSDCLP = "0x0000000000000000000000000000000000000000";
  const usdcPool = "0x0000000000000000000000000000000000000000";
  const wRose = "0xB5EA3151e1edED183CC9571916B435b6B188D508";

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
      setSapphireProvider(new ethers.providers.Web3Provider(wallet.provider));
      setSapphireProviderSigner(
        new ethers.providers.Web3Provider(wallet.provider).getSigner()
      );
    } else {
      setSapphireProvider(new ethers.providers.JsonRpcProvider(infuraRPC));
      setSapphireProviderSigner(
        new ethers.providers.JsonRpcProvider(infuraRPC).getSigner()
      );
    }
  }, [account]);

  const [totalRose, setTotalRose] = useState(0);
  const getBalance = async () => {
    // const user = await ethersProvider.getBalance(account);
    const user = await await wRoseQuery.balanceOf(account);
    setBalance(new BigNumber(user._hex).div(1e18).toFixed());
    // const totalRose = await ethersProvider.getBalance(stabilityPool);
    const totalRose = await wRoseQuery.balanceOf(stabilityPool);
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

      // if (signInAuth) {
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
      // }
      // if (signInAuthToken) {
      setDebtTokenQuery(
        new ethers.Contract(debtToken, tokenAbi, sapphireProvider)
      );
      // }
    }
  }, [sapphireProvider]);
  // }, [sapphireProvider, signInAuth, signInAuthToken]);

  const [borrowerOperationsMint, setBorrowerOperationsMint] = useState(null);
  const [tokenLockerMain, setTokenLockerMain] = useState(null);
  const [mockLpMain, setMockLpMain] = useState(null);
  const [vineLpTokenPoolMain, setVineLpTokenPoolMain] = useState(null);
  const [troveManagerMain, setTroveManagerMain] = useState(null);
  const [incentiveVotingMain, setIncentiveVotingMain] = useState(null);
  const [idovestingMain, setIdovestingMain] = useState(null);
  const [vineVaultMain, setVineVaultMain] = useState(null);
  const [wrappedCoin, setWrappedCoin] = useState(null);

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
      setWrappedCoin(
        new ethers.Contract(wRose, tokenAbi, sapphireProviderSigner)
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
    if (account) {
      getBalance();
      const trove = await troveManagerMain.getTrove(account);
      setDeposits(Number(new BigNumber(trove.coll._hex).div(1e18).toFixed()));
      setDebt(Number(new BigNumber(trove.debt._hex).div(1e18).toFixed()));
      setStatus(trove.status);

      const pre = await sortedTrovesToken.getPrev(account);
      const next = await sortedTrovesToken.getNext(account);
      setPre(pre);
      setNext(next);
      // const balanceOf = await debtTokenQuery.checkBalanceOf(signInAuthToken);
      const balanceOf = await debtTokenQuery.balanceOf(account);
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
      "0xB5EA3151e1edED183CC9571916B435b6B188D508"
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
        wrappedCoin,
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
