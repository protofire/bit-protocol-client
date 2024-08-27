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
  BITUSDUSDCLP: "",
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
  BITUSDUSDCLPQuery: "",
  usdcPoolQuery: "",
  BITUSDUSDCLPMain: "",
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
  const infuraRPC = "https://bitcoinplus.pwrlabs.io/";

  const idoAddr = "0x0000000000000000000000000000000000000000";
  const usdcAddr = "0x0000000000000000000000000000000000000000";
  // const idoAbi = idoHook;
  const tokenAbi = tokenHook;

  const troveManager = "0x60812F67E4725b24032124cb4d727727Df081F19";
  const sortedTroves = "0xBD21E54c7d5B361E9D523E0653266AcA2A99E83E";
  const borrowerOperations = "0x07A793f9d906256d9E598b204C9B78d1F52F8f02";
  const troveManagerGetters = "0x60137625845CbcE178a8b1AF62c6eEddaABd5B5C";
  const priceFeed = "0x2C9E89e77Ad6b2A8c2cC127782DE811c89e8C4Cc";
  const debtToken = "0x3fAeDb824A226Af1646dA0ec4dD7fAA3ba736382";
  const bitToken = "0x9640b27bBc8FBc85dd03b2B10827423b2853D5fD";
  const tokenLocker = "0x35129cFA130EFaE8a43293929f2B1e25aD884277";
  const BoostCalculator = "0x06652790cb2C6CddE1FC204b8e7c3d099aF4f21e";
  const BitLpTokenPool = "0x0000000000000000000000000000000000000000";
  const LPPriceOracle = "0xF9D07beebC4692A52E6FCD77e5ECf3Ab93C31Ab6";
  const stabilityPool = "0x211554fb6b2b0068c231072335Be1cbDF88E3dB3";
  const MultiCollateralHintHelpers =
    "0x4CB5Ab4cc7F2f05148664b7DE2DEEAE7e7714Cc7";
  const incentiveVoting = "0x4eb4cc2B18F387086Ce7fA3F337ED6d7484257a2";
  const idovesting = "0x8bda2E337a51FD1C95baF56A69708282A662af66"; //iDOTokenVesting
  const bitVault = "0x327dbE693C56236C421430eEdd70FE606aA74988";
  const BITUSDUSDCLP = "0x0000000000000000000000000000000000000000";
  const usdcPool = "0x0000000000000000000000000000000000000000";
  const wBtc = "0xf766051EA4FD0721948D78caFa35974D44954e9A";

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

  const [BITUSDUSDCLPQuery, setBITUSDUSDCLPQuery] = useState(null);
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

      setBITUSDUSDCLPQuery(
        new ethers.Contract(BITUSDUSDCLP, tokenAbi, ethProvider)
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

  const [BITUSDUSDCLPMain, setBITUSDUSDCLPMain] = useState(null);
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
      setBITUSDUSDCLPMain(
        new ethers.Contract(BITUSDUSDCLP, tokenAbi, ethProviderSigner)
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
      "0xf766051EA4FD0721948D78caFa35974D44954e9A"
    );
    setWbtcPrice(Number(wBtcPrice) / 1e18);

    // TODO: MOCK FOR NOW
    setLpPrice(1);
    setBitPrice(1);

    const totalTvl = await wBtcQuery.balanceOf(troveManager);
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
        BITUSDUSDCLP,
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
        BITUSDUSDCLPQuery,
        usdcPoolQuery,
        BITUSDUSDCLPMain,
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
