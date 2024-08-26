import { createContext, useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { useConnectWallet } from "@web3-onboard/react";
// import idoHook from "../abi/ido";
import tokenHook from "../abi/token";
import BorrowerOperationsHook from "../abi/BorrowerOperations";
import SortedTrovesHook from "../abi/SortedTroves";
import TroveManagerHook from "../abi/TroveManager";
import PriceFeedHook from "../abi/PriceFeed";
import TroveManagerGettersHook from "../abi/TroveManagerGetters";
import tokenLockerHook from "../abi/tokenLocker";
import BoostCalculatorHook from "../abi/BoostCalculator";
import BitLpTokenPoolHook from "../abi/BitLpTokenPool";
import LPPriceOracleHook from "../abi/LPPriceOracle";
import StabilityPoolHook from "../abi/StabilityPool";
import MultiCollateralHintHelpersHook from "../abi/MultiCollateralHintHelpers";
import IncentiveVotingHook from "../abi/IncentiveVoting";
import idovestingHook from "../abi/idovesting";
import bitVaultHook from "../abi/bitVault";

export const UserContext = createContext({
  account: "",
  setAccount: () => {},
  ethersProvider: undefined,
  setEthersProvider: () => {},
  idoAddr: "",
  usdcAddr: "",
  // idoAbi: "",
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
  bitToken: "",
  tokenLocker: "",
  BoostCalculator: "",
  BitLpTokenPool: "",
  LPPriceOracle: "",
  stabilityPool: "",
  MultiCollateralHintHelpers: "",
  incentiveVoting: "",
  idovesting: "",
  bitVault: "",
  VUSDUSDCLP: "",
  usdcPool: "",

  BorrowerOperationsAbi: "",
  SortedTrovesAbi: "",
  TroveManagerAbi: "",
  PriceFeedAbi: "",
  TroveManagerGettersAbi: "",
  BoostCalculatorAbi: "",
  BitLpTokenPoolAbi: "",
  LPPriceOracleAbi: "",
  StabilityPoolAbi: "",
  MultiCollateralHintHelpersAbi: "",
  IncentiveVotingAbi: "",
  idovestingAbi: "",
  bitVaultAbi: "",

  ethProvider: undefined,
  setEthProvider: () => {},
  ethProviderSigner: undefined,
  setEthProviderSigner: () => {},

  balance: 0,
  totalWbtc: 0,

  signInAuth: {},
  setSignInAuth: () => {},
  signInAuthToken: {},
  setSignInAuthToken: () => {},

  sortedTrovesToken: "",
  troveManagerGettersSigner: "",
  borrowerOperationsMint: "",
  priceFeedToken: "",
  debtTokenQuery: "",
  bitTokenQuery: "",
  tokenLockerMain: "",
  tokenLockerQuery: "",
  boostCalculatorQuery: "",
  bitLpTokenPoolMain: "",
  troveManagerMain: "",
  wrappedCoin: "",
  incentiveVotingMain: "",
  mockLpQuery: "",
  bitLpTokenPoolQuery: "",
  lPPriceOracleQuery: "",
  mockLpMain: "",
  stabilityPoolMain: "",
  stabilityPoolQuery: "",
  multiCollateralHintHelpersQuery: "",
  troveManagerQuery: "",
  incentiveVotingQuery: "",
  idovestingQuery: "",
  idovestingMain: "",
  bitVaultMain: "",
  bitVaultQuery: "",
  VUSDUSDCLPQuery: "",
  usdcPoolQuery: "",
  VUSDUSDCLPMain: "",
  usdcPoolMain: "",

  status: 0,
  deposits: 0,
  debt: 0,
  pre: 0,
  next: 0,
  wBtcPrice: 0,
  bitUSDbalance: 0,
  lpPrice: 0,
  bitPrice: 0,
  boost: 0,
  totalTvl: 0,

  vaultEarned: 0,
  bitWbtcEarned: 0,
  stabilityEarned: 0,
  bitusdUsdcEarned: 0,

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

  const idoAddr = "0x0000000000000000000000000000000000000000";
  const usdcAddr = "0x0000000000000000000000000000000000000000";
  // const idoAbi = idoHook;
  const tokenAbi = tokenHook;

  const troveManager = "0x5A0f84EBCeCa7cf943879CBB0A584979eFd0Ab11";
  const sortedTroves = "0x2A7D69a47f3a3d87F29A008d2047Ce6031151e6F";
  const borrowerOperations = "0x2a776A5463Dc3d1d7FA86d740e662ab4154Fb5A1";
  const troveManagerGetters = "0xA9Ae7A9Ae35836aA0A194cf203a0D4e8FA32fd38";
  const priceFeed = "0x652eF55bB290eb2a0A3CE3C28920F2065907f9b0";
  const debtToken = "0xFB03F2562ae339ae387e795A6D4E057b93FE6bC4";
  const bitToken = "0x73a154FC038215A617793C47044A599B0ea9941e";
  const tokenLocker = "0x9B3a40A6d7d7E85AFBe74cA8eF3e49d0b9E00580";
  const BoostCalculator = "0xB85912752B1fc97E4c631e57caB1DEa0643D2416";
  const BitLpTokenPool = "0x0000000000000000000000000000000000000000";
  const LPPriceOracle = "0x19a454C8A316383652dB5A720dec03B2AC4D1c17";
  const stabilityPool = "0xb888845bCfDFeaf8e27A63aCEA63833Ed73cC3c7";
  const MultiCollateralHintHelpers =
    "0x4922878266Aff87Fc3962cc85Cf92E0602861a41";
  const incentiveVoting = "0x213EeedC618388AbBd9bb79F660e88607D3067a4";
  const idovesting = "0x1E659F0704b2BC354b4CF1D21A2638C9795FcaA6"; //iDOTokenVesting
  const bitVault = "0xF6d761207c13c2aD546682650a8B383E73f2A57E";
  const VUSDUSDCLP = "0x0000000000000000000000000000000000000000";
  const usdcPool = "0x0000000000000000000000000000000000000000";
  const wBtc = "0xB5EA3151e1edED183CC9571916B435b6B188D508";

  const BorrowerOperationsAbi = BorrowerOperationsHook;
  const SortedTrovesAbi = SortedTrovesHook;
  const TroveManagerAbi = TroveManagerHook;
  const PriceFeedAbi = PriceFeedHook;
  const TroveManagerGettersAbi = TroveManagerGettersHook;
  const tokenLockerAbi = tokenLockerHook;
  const BoostCalculatorAbi = BoostCalculatorHook;
  const BitLpTokenPoolAbi = BitLpTokenPoolHook;
  const LPPriceOracleAbi = LPPriceOracleHook;
  const StabilityPoolAbi = StabilityPoolHook;
  const MultiCollateralHintHelpersAbi = MultiCollateralHintHelpersHook;
  const IncentiveVotingAbi = IncentiveVotingHook;
  const idovestingAbi = idovestingHook;
  const bitVaultAbi = bitVaultHook;

  const [ethProvider, setEthProvider] = useState(undefined);
  const [ethProviderSigner, setEthProviderSigner] = useState(undefined);

  const [balance, setBalance] = useState(0);
  const [bitUSDbalance, setbitUSDbalance] = useState(0);

  useEffect(() => {
    if (account) {
      setEthProvider(new ethers.providers.Web3Provider(wallet.provider));
      setEthProviderSigner(
        new ethers.providers.Web3Provider(wallet.provider).getSigner()
      );
    } else {
      setEthProvider(new ethers.providers.JsonRpcProvider(infuraRPC));
      setEthProviderSigner(
        new ethers.providers.JsonRpcProvider(infuraRPC).getSigner()
      );
    }
  }, [account]);

  const [totalWbtc, setTotalWbtc] = useState(0);
  const getBalance = async () => {
    // const user = await ethersProvider.getBalance(account);
    const user = await await wBtcQuery.balanceOf(account);
    setBalance(new BigNumber(user._hex).div(1e18).toFixed());
    // const totalWbtc = await ethersProvider.getBalance(stabilityPool);
    const totalWbtc = await wBtcQuery.balanceOf(stabilityPool);
    setTotalWbtc(new BigNumber(totalWbtc._hex).div(1e18).toFixed());
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

  const [bitTokenQuery, setBitTokenQuery] = useState(null);
  const [tokenLockerQuery, setTokenLockerQuery] = useState(null);
  const [boostCalculatorQuery, setBoostCalculatorQuery] = useState(null);
  const [mockLpQuery, setMockLpQuery] = useState(null);
  const [bitLpTokenPoolQuery, setBitLpTokenPoolQuery] = useState(null);
  const [lPPriceOracleQuery, setLPPriceOracleQuery] = useState(null);
  const [stabilityPoolMain, setStabilityPoolMain] = useState(null);
  const [stabilityPoolQuery, setStabilityPoolQuery] = useState(null);
  const [multiCollateralHintHelpersQuery, setMultiCollateralHintHelpersQuery] =
    useState(null);
  const [troveManagerQuery, setTroveManagerQuery] = useState(null);
  const [incentiveVotingQuery, setIncentiveVotingQuery] = useState(null);
  const [idovestingQuery, setIdovestingQuery] = useState(null);
  const [bitVaultQuery, setBitVaultQuery] = useState(null);

  const [VUSDUSDCLPQuery, setVUSDUSDCLPQuery] = useState(null);
  const [usdcPoolQuery, setusdcPoolQuery] = useState(null);
  const [wBtcQuery, setWbtcQuery] = useState(null);
  // const [borrowerOperationsQuery, setBorrowerOperationsQuery] = useState(null);

  useEffect(() => {
    if (ethProvider) {
      setSortedTrovesToken(
        new ethers.Contract(sortedTroves, SortedTrovesAbi, ethProvider)
      );
      setPriceFeedToken(
        new ethers.Contract(priceFeed, PriceFeedAbi, ethProvider)
      );
      setBitTokenQuery(new ethers.Contract(bitToken, tokenAbi, ethProvider));
      setTokenLockerQuery(
        new ethers.Contract(tokenLocker, tokenLockerAbi, ethProvider)
      );
      setBoostCalculatorQuery(
        new ethers.Contract(BoostCalculator, BoostCalculatorAbi, ethProvider)
      );

      setBitLpTokenPoolQuery(
        new ethers.Contract(BitLpTokenPool, BitLpTokenPoolAbi, ethProvider)
      );
      setLPPriceOracleQuery(
        new ethers.Contract(LPPriceOracle, LPPriceOracleAbi, ethProvider)
      );
      setStabilityPoolQuery(
        new ethers.Contract(stabilityPool, StabilityPoolAbi, ethProvider)
      );
      setMultiCollateralHintHelpersQuery(
        new ethers.Contract(
          MultiCollateralHintHelpers,
          MultiCollateralHintHelpersAbi,
          ethProvider
        )
      );
      setTroveManagerQuery(
        new ethers.Contract(troveManager, TroveManagerAbi, ethProvider)
      );

      setIncentiveVotingQuery(
        new ethers.Contract(incentiveVoting, IncentiveVotingAbi, ethProvider)
      );
      setIdovestingQuery(
        new ethers.Contract(idovesting, idovestingAbi, ethProvider)
      );
      setBitVaultQuery(new ethers.Contract(bitVault, bitVaultAbi, ethProvider));

      setVUSDUSDCLPQuery(
        new ethers.Contract(VUSDUSDCLP, tokenAbi, ethProvider)
      );
      setusdcPoolQuery(
        new ethers.Contract(usdcPool, BitLpTokenPoolAbi, ethProvider)
      );
      setWbtcQuery(new ethers.Contract(wBtc, BitLpTokenPoolAbi, ethProvider));

      setTroveManagerGettersSigner(
        new ethers.Contract(
          troveManagerGetters,
          TroveManagerGettersAbi,
          ethProvider
        )
      );

      setTroveManagerSigner(
        new ethers.Contract(troveManager, TroveManagerAbi, ethProvider)
      );

      setDebtTokenQuery(new ethers.Contract(debtToken, tokenAbi, ethProvider));
    }
  }, [ethProvider]);

  const [borrowerOperationsMint, setBorrowerOperationsMint] = useState(null);
  const [tokenLockerMain, setTokenLockerMain] = useState(null);
  const [mockLpMain, setMockLpMain] = useState(null);
  const [bitLpTokenPoolMain, setBitLpTokenPoolMain] = useState(null);
  const [troveManagerMain, setTroveManagerMain] = useState(null);
  const [incentiveVotingMain, setIncentiveVotingMain] = useState(null);
  const [idovestingMain, setIdovestingMain] = useState(null);
  const [bitVaultMain, setBitVaultMain] = useState(null);
  const [wrappedCoin, setWrappedCoin] = useState(null);

  const [VUSDUSDCLPMain, setVUSDUSDCLPMain] = useState(null);
  const [usdcPoolMain, setusdcPoolMain] = useState(null);

  useEffect(() => {
    if (ethProviderSigner) {
      setBorrowerOperationsMint(
        new ethers.Contract(
          borrowerOperations,
          BorrowerOperationsAbi,
          ethProviderSigner
        )
      );
      setTokenLockerMain(
        new ethers.Contract(tokenLocker, tokenLockerAbi, ethProviderSigner)
      );
      setBitLpTokenPoolMain(
        new ethers.Contract(
          BitLpTokenPool,
          BitLpTokenPoolAbi,
          ethProviderSigner
        )
      );
      setStabilityPoolMain(
        new ethers.Contract(stabilityPool, StabilityPoolAbi, ethProviderSigner)
      );
      setTroveManagerMain(
        new ethers.Contract(troveManager, TroveManagerAbi, ethProviderSigner)
      );
      setWrappedCoin(new ethers.Contract(wBtc, tokenAbi, ethProviderSigner));
      setIncentiveVotingMain(
        new ethers.Contract(
          incentiveVoting,
          IncentiveVotingAbi,
          ethProviderSigner
        )
      );
      setIdovestingMain(
        new ethers.Contract(idovesting, idovestingAbi, ethProviderSigner)
      );
      setBitVaultMain(
        new ethers.Contract(bitVault, bitVaultAbi, ethProviderSigner)
      );
      setVUSDUSDCLPMain(
        new ethers.Contract(VUSDUSDCLP, tokenAbi, ethProviderSigner)
      );
      setusdcPoolMain(
        new ethers.Contract(usdcPool, BitLpTokenPoolAbi, ethProviderSigner)
      );
    }
  }, [ethProviderSigner]);

  const [status, setStatus] = useState(0);
  const [deposits, setDeposits] = useState(0);
  const [debt, setDebt] = useState(0);
  const [pre, setPre] = useState(0);
  const [next, setNext] = useState(0);
  const [wBtcPrice, setWbtcPrice] = useState(0);
  const [lpPrice, setLpPrice] = useState(0);
  const [bitPrice, setBitPrice] = useState(0);
  const [boost, setBoost] = useState(0);
  const [totalTvl, setTotalTvl] = useState(0);

  const [vaultEarned, setvaultEarned] = useState(0);
  const [bitWbtcEarned, setBitWbtcEarned] = useState(0);
  const [stabilityEarned, setstabilityEarned] = useState(0);
  const [bitusdUsdcEarned, setbitusdUsdcEarned] = useState(0);
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
      setbitUSDbalance(new BigNumber(balanceOf._hex).div(1e18).toFixed());

      const boost = await boostCalculatorQuery.getBoostedAmount(
        account,
        10000,
        0,
        100000
      );
      setBoost(new BigNumber(boost._hex).multipliedBy(2).div(10000).toFixed());

      //bitUSD Minting
      const vaultEarned = await bitVaultQuery.claimableRewardAfterBoost(
        account,
        account,
        "0x0000000000000000000000000000000000000000",
        troveManager
      );
      setvaultEarned(Number(vaultEarned.adjustedAmount._hex) / 1e18);

      //Stability Pool
      const stabilityEarned = await bitVaultQuery.claimableRewardAfterBoost(
        account,
        account,
        "0x0000000000000000000000000000000000000000",
        stabilityPool
      );
      setstabilityEarned(Number(stabilityEarned.adjustedAmount._hex) / 1e18);
    }
    const wBtcPrice = await priceFeedToken.loadPrice(
      "0xB5EA3151e1edED183CC9571916B435b6B188D508"
    );
    setWbtcPrice(Number(wBtcPrice) / 1e18);

    // TODO: MOCK FOR NOW
    setLpPrice(1);
    setBitPrice(1);

    const totalTvl = await ethersProvider.getBalance(borrowerOperations);
    setTotalTvl((Number(totalTvl) / 1e18) * (Number(wBtcPrice) / 1e18));
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
        // idoAbi,
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
        bitToken,
        tokenLocker,
        BoostCalculator,
        BitLpTokenPool,
        LPPriceOracle,
        stabilityPool,
        MultiCollateralHintHelpers,
        incentiveVoting,
        idovesting,
        bitVault,
        VUSDUSDCLP,
        usdcPool,
        ethProvider,
        setEthProvider,
        BorrowerOperationsAbi,
        SortedTrovesAbi,
        TroveManagerAbi,
        PriceFeedAbi,
        TroveManagerGettersAbi,
        BoostCalculatorAbi,
        BitLpTokenPoolAbi,
        LPPriceOracleAbi,
        StabilityPoolAbi,
        MultiCollateralHintHelpersAbi,
        IncentiveVotingAbi,
        idovestingAbi,
        bitVaultAbi,
        ethProviderSigner,
        setEthProviderSigner,
        balance,
        totalWbtc,
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
        wBtcPrice,
        bitUSDbalance,
        lpPrice,
        bitPrice,
        boost,
        totalTvl,
        debtTokenQuery,
        bitTokenQuery,
        tokenLockerMain,
        bitLpTokenPoolMain,
        troveManagerMain,
        wrappedCoin,
        incentiveVotingMain,
        mockLpQuery,
        bitLpTokenPoolQuery,
        lPPriceOracleQuery,
        stabilityPoolMain,
        stabilityPoolQuery,
        multiCollateralHintHelpersQuery,
        troveManagerQuery,
        incentiveVotingQuery,
        tokenLockerQuery,
        boostCalculatorQuery,
        idovestingQuery,
        bitVaultQuery,
        idovestingMain,
        mockLpMain,
        bitVaultMain,
        VUSDUSDCLPQuery,
        usdcPoolQuery,
        VUSDUSDCLPMain,
        usdcPoolMain,
        formatNum,
        vaultEarned,
        bitWbtcEarned,
        stabilityEarned,
        bitusdUsdcEarned,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
