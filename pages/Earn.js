import styles from "../styles/dapp.module.scss";
import Header from "../components/header";
import Footer from "../components/footer";
import { useState, useContext, useRef, useEffect } from "react";
import { BlockchainContext } from "../hook/blockchain";
import Wait from "../components/tooltip/wait";
import Loading from "../components/tooltip/loading";
import tooltip from "../components/tooltip";
import Link from "next/link";
import { formatNumber, fromBigNumber } from "../utils/helpers";
import BigNumber from "bignumber.js";
import { addresses } from "../utils/addresses";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

export default function Earn() {
  const router = useRouter();

  const account = useAccount();
  const {
    bitUSDCirculation,
    stabilityPool,
    boost,
    getRosePrice,
    bitUSDBalance,
    provideToSP,
    setCurrentState,
    setCurrentWaitInfo,
    currentState,
    withdrawFromSP,
    claimCollateralGains,
    bitGovLpData,
    bitUsdLpData,
    collaterals,
    // userTotalDebt,
    claimableRewards,
    approveBitGovLp,
    stakeBitGovLP,
    withdrawBitGovLP,
    approveBitUsdLp,
    stakeBitUsdLP,
    withdrawBitUsdLP,
    signatureTrove,
    signatureToken,
    getLpTokenPrice,
    getBitGovPrice,
    // getTokenBalance,
  } = useContext(BlockchainContext);

  const [tvl, setTvl] = useState(0);
  const [showEarnMain, setShowEarnMain] = useState(false);
  const [changeType, setChangeType] = useState("Mint");
  const [coin, setCoin] = useState("bitUSD");
  const [typeName, setTypeName] = useState("");
  const [maxBalance, setMaxBalance] = useState(0);
  const [buttonName, setButtonName] = useState("Stake");
  const [amount, setAmount] = useState("");
  const [stakeLpBalance, setStakeLpBalance] = useState(0);
  const [unStakeLpBalance, setUnStakeLpBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [accountDeposits, setAccountDeposits] = useState(0);
  const [stakeLpBalance2, setStakeLpBalance2] = useState(0);
  const [unStakeLpBalance2, setUnStakeLpBalance2] = useState(0);
  const [allowance2, setAllowance2] = useState(0);
  const [mockLpBalance, setMockLpBalance] = useState(0);
  const [VUSDLpBalance, setVUSDLpBalance] = useState(0);
  const [stabilityPoolBalance, setStabilityPoolBalance] = useState(0);
  //bitUSD Minting
  // const [vUSDCirc, setvUSDCirc] = useState(0);
  const [baseAPR1, setBaseAPR1] = useState(0);
  //VINE/ROSE LP
  const [baseAPR2, setBaseAPR2] = useState(0);
  //Stability Pool
  const [baseAPR3, setBaseAPR3] = useState(0);
  //bitUSD/USDC LP
  const [baseAPR4, setBaseAPR4] = useState(0);
  const [USDCtotalSupply, setUSDCtotalSupply] = useState(0);
  const [depositorCollateralGain, setDepositorCollateralGain] = useState([]);
  const [vUSDBaseApr1, setvUSDBaseApr1] = useState(0);
  const [vUSDBaseApr2, setvUSDBaseApr2] = useState(0);
  const [vUSDBaseApr3, setvUSDBaseApr3] = useState(0);
  const [vUSDBaseApr4, setvUSDBaseApr4] = useState(0);
  const [bitGovPrice, setBitGovPrice] = useState(0);
  const [bitGovLPPrice, setBitGovbitGovLPPrice] = useState(0);
  const [bitUsdLPPrice, setBitUsdLPPrice] = useState(0);

  const rosePrice = getRosePrice();

  const changeTypeCoin = (type, coin) => {
    setAmount("");
    setChangeType(type);
    setCoin(coin);
  };

  const changeManage = (value) => {
    setTypeName(value);
    if (value == "bitGOV/wBTC LP") {
      changeTypeCoin("Stake", "LP");
    } else if (value == "bitUSD/USDC LP") {
      changeTypeCoin("Stake", "LP");
    } else {
      changeTypeCoin("Deposit", "bitUSD");
    }
    setShowEarnMain(true);
  };

  const onKeyDown = (e) => {
    // Prevent minus sign, plus sign, 'e' and 'E' (exponential notation)
    if (["-", "+", "e", "E"].includes(e.key)) {
      e.preventDefault();
    }

    // Allow: backspace, delete, tab, escape, enter, decimal point
    if (
      ["Backspace", "Delete", "Tab", "Escape", "Enter", ".", ","].includes(
        e.key
      )
    ) {
      return;
    }

    // Prevent if not a number
    if (isNaN(Number(e.key))) {
      e.preventDefault();
    }
  };

  const changeAmount = async (e) => {
    const value = e.target.value;
    const numValue = Number(value);

    if (!/^\d*\.?\d{0,3}$/.test(value)) {
      return;
    }

    // Allow empty string or values within range (including zero)
    if (value === "" || (numValue >= 0 && numValue <= maxBalance)) {
      setAmount(value === "" ? "" : numValue);
    } else if (numValue > maxBalance) {
      setAmount(maxBalance);
    }
  };

  const changeAmountValue = (value) => {
    setAmount(maxBalance * value);
  };

  const queryData = async () => {
    if (
      stabilityPool?.deposits >= 0 &&
      bitUSDCirculation &&
      collaterals &&
      account.status === "connected" &&
      claimableRewards
    ) {
      setAccountDeposits(stabilityPool.accountDeposits);
      setDepositorCollateralGain(stabilityPool.depositorCollateralGain);
      setStabilityPoolBalance(stabilityPool.deposits);
      // COMMENTED OUT UNLESS WE HAVE REWARDS
      // const bitGovLp = await bitGovLpData();
      // const bitUsdLp = await bitUsdLpData();
      // setStakeLpBalance(bitGovLp.balance);
      // setAllowance(bitGovLp.allowance);
      // setUnStakeLpBalance(bitGovLp.depositBalance);
      // setMockLpBalance(bitGovLp.depositLpBalance);
      // setStakeLpBalance2(bitUsdLp.balance);
      // setAllowance2(bitUsdLp.allowance);
      // setUnStakeLpBalance2(bitUsdLp.depositBalance);

      // FIGURE IT OUT HOW TO GET DEBT TOKEN BALANCE OF THE POOL
      // const usdcBalance = await getTokenBalance()
      // COMMENTED OUT UNLESS WE HAVE REWARDS
      // setVUSDLpBalance(bitUsdLp.depositLpBalance);
      // setBitUsdLPPrice(await getLpTokenPrice("bitUSD"));
      // setBitGovbitGovLPPrice(await getLpTokenPrice("bitGOV"));
      // setBitGovPrice(await getBitGovPrice());

      //bitUSD Minting
      setBaseAPR1(
        collaterals[addresses.troveManager[account.chainId]].rewardRate
      );
      setBaseAPR3(stabilityPool.rewardRate);
      // COMMENTED OUT UNLESS WE HAVE REWARDS
      // setBaseAPR2(bitGovLp.rewardRate);
      // setBaseAPR4(bitUsdLp.rewardRate);
      // setUSDCtotalSupply(bitUsdLp.totalSupply);
    }
  };

  let timerLoading = useRef(null);

  useEffect(() => {
    queryData();
    timerLoading.current = setInterval(() => {
      queryData();
    }, 30000);
    return () => clearInterval(timerLoading.current);
  }, [
    account.status,
    account.address,
    stabilityPool,
    collaterals,
    depositorCollateralGain,
  ]);

  useEffect(() => {
    const vUSDBaseApr1 =
      (baseAPR1 * 86400 * 365 * bitGovPrice * 100) / bitUSDCirculation;
    setvUSDBaseApr1(vUSDBaseApr1);
    const vUSDBaseApr2 =
      (baseAPR2 * 86400 * 365 * bitGovPrice * 100) /
      (Number(mockLpBalance) * bitGovLPPrice);
    setvUSDBaseApr2(vUSDBaseApr2);
    const vUSDBaseApr4 =
      (baseAPR4 * 86400 * 365 * bitGovPrice * 100) /
      (Number(VUSDLpBalance) * 2);
    setvUSDBaseApr4(vUSDBaseApr4);
    const vUSDBaseApr3 =
      (baseAPR3 * 86400 * 365 * bitGovPrice * 100) /
      (Number(stabilityPoolBalance) +
        Number(stabilityPool.balance) * rosePrice);
    setvUSDBaseApr3(vUSDBaseApr3);
  }, [
    baseAPR3,
    bitGovPrice,
    stabilityPoolBalance,
    stabilityPool.balance,
    baseAPR1,
    baseAPR2,
    baseAPR3,
    bitUSDCirculation,
    rosePrice,
    bitGovLPPrice,
  ]);

  useEffect(() => {
    if (typeName == "bitGOV/wBTC LP") {
      if (changeType == "Stake") {
        setMaxBalance(Number(stakeLpBalance));
      } else {
        setMaxBalance(Number(unStakeLpBalance));
      }
    } else if (typeName == "bitUSD/USDC LP") {
      if (changeType == "Stake") {
        setMaxBalance(Number(stakeLpBalance2));
      } else {
        setMaxBalance(Number(unStakeLpBalance2));
      }
    } else {
      if (changeType == "Deposit") {
        setMaxBalance(bitUSDBalance);
      } else if (changeType == "Withdraw") {
        setMaxBalance(Number(accountDeposits));
      } else {
        setMaxBalance(
          depositorCollateralGain.reduce((acc, value) => acc + Number(value), 0)
        );
      }
    }
  }, [
    typeName,
    changeType,
    stakeLpBalance,
    unStakeLpBalance,
    accountDeposits,
    stakeLpBalance2,
    unStakeLpBalance2,
    depositorCollateralGain,
  ]);

  useEffect(() => {
    if (changeType == "Stake") {
      if (typeName == "bitGOV/wBTC LP") {
        if (Number(amount) > Number(allowance)) {
          setButtonName("Approve");
        } else {
          setButtonName(changeType);
        }
      } else {
        if (Number(amount) > Number(allowance2)) {
          setButtonName("Approve");
        } else {
          setButtonName(changeType);
        }
      }
    } else {
      setButtonName(changeType);
    }
  }, [typeName, changeType, allowance, amount]);

  useEffect(() => {
    let num = 0;
    if (typeName == "bitGOV/ROSE LP") {
      num = Number(mockLpBalance) * bitGovLPPrice;
    } else if (typeName == "bitUSD/USDC LP") {
      num = Number(VUSDLpBalance) * 2;
    } else {
      num =
        Number(stabilityPoolBalance) +
        Number(stabilityPool.balance) * rosePrice;
    }
    setTvl(isNaN(num) ? 0 : formatNumber(num));
  }, [
    stabilityPoolBalance,
    rosePrice,
    stabilityPool.balance,
    typeName,
    bitGovLPPrice,
    bitGovLPPrice,
  ]);

  const stakeApproveBitGov = async () => {
    try {
      const tx = await approveBitGovLp(
        new BigNumber(amount).multipliedBy(1e18).toFixed()
      );
      setCurrentWaitInfo({
        type: "loading",
        info: "Approve " + Number(amount.toFixed(4)).toLocaleString() + " LP",
      });
      setCurrentState(true);
      const result = await tx.wait();
      setCurrentState(false);
      if (result.status === 0) {
        tooltip.error({
          content:
            "Transaction failed due to a network error. Please refresh the page and try again.",
          duration: 5000,
        });
      } else {
        tooltip.success({ content: "Successful", duration: 5000 });
        queryData();
      }
      setAmount("");
    } catch (error) {
      console.log(error);
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const stakeLpBitGov = async () => {
    try {
      const tx = await stakeBitGovLP(
        new BigNumber(amount).multipliedBy(1e18).toFixed()
      );
      setCurrentWaitInfo({
        type: "loading",
        info: "Stake " + Number(amount.toFixed(4)).toLocaleString() + " LP",
      });
      setCurrentState(true);
      const result = await tx.wait();
      setCurrentState(false);
      if (result.status === 0) {
        tooltip.error({
          content:
            "Transaction failed due to a network error. Please refresh the page and try again.",
          duration: 5000,
        });
      } else {
        tooltip.success({ content: "Successful", duration: 5000 });
        queryData();
      }
      setAmount("");
    } catch (error) {
      console.log(error);
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const unStakeLpBitGov = async () => {
    try {
      const tx = await withdrawBitGovLP(
        new BigNumber(amount).multipliedBy(1e18).toFixed()
      );
      setCurrentWaitInfo({
        type: "loading",
        info: "UnStake " + Number(amount.toFixed(4)).toLocaleString() + " LP",
      });
      setCurrentState(true);
      const result = await tx.wait();
      setCurrentState(false);
      if (result.status === 0) {
        tooltip.error({
          content:
            "Transaction failed due to a network error. Please refresh the page and try again.",
          duration: 5000,
        });
      } else {
        tooltip.success({ content: "Successful", duration: 5000 });
        queryData();
      }
      setAmount("");
    } catch (error) {
      console.log(error);
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const stakeApproveBitUsd = async () => {
    try {
      const tx = await approveBitUsdLp(
        new BigNumber(amount).multipliedBy(1e18).toFixed()
      );
      setCurrentWaitInfo({
        type: "loading",
        info: "Approve " + Number(amount.toFixed(4)).toLocaleString() + " LP",
      });
      setCurrentState(true);
      const result = await tx.wait();
      setCurrentState(false);
      if (result.status === 0) {
        tooltip.error({
          content:
            "Transaction failed due to a network error. Please refresh the page and try again.",
          duration: 5000,
        });
      } else {
        tooltip.success({ content: "Successful", duration: 5000 });
        queryData();
      }
      setAmount("");
    } catch (error) {
      console.log(error);
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const stakeLpBitUsd = async () => {
    try {
      const tx = await stakeBitUsdLP(
        new BigNumber(amount).multipliedBy(1e18).toFixed()
      );
      setCurrentWaitInfo({
        type: "loading",
        info: "Stake " + Number(amount.toFixed(4)).toLocaleString() + " LP",
      });
      setCurrentState(true);
      const result = await tx.wait();
      setCurrentState(false);
      if (result.status === 0) {
        tooltip.error({
          content:
            "Transaction failed due to a network error. Please refresh the page and try again.",
          duration: 5000,
        });
      } else {
        tooltip.success({ content: "Successful", duration: 5000 });
        queryData();
      }
      setAmount("");
    } catch (error) {
      console.log(error);
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const unStakeLpBitUsd = async () => {
    try {
      const tx = await withdrawBitUsdLP(
        new BigNumber(amount).multipliedBy(1e18).toFixed()
      );
      setCurrentWaitInfo({
        type: "loading",
        info: "UnStake " + Number(amount.toFixed(4)).toLocaleString() + " LP",
      });
      setCurrentState(true);
      const result = await tx.wait();
      setCurrentState(false);
      if (result.status === 0) {
        tooltip.error({
          content:
            "Transaction failed due to a network error. Please refresh the page and try again.",
          duration: 5000,
        });
      } else {
        tooltip.success({ content: "Successful", duration: 5000 });
        queryData();
      }
      setAmount("");
    } catch (error) {
      console.log(error);
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const deposit = async () => {
    try {
      const tx = await provideToSP(
        new BigNumber(amount).multipliedBy(1e18).toFixed()
      );
      setCurrentWaitInfo({
        type: "loading",
        info:
          "Deposit " + Number(amount.toFixed(4)).toLocaleString() + " bitUSD",
      });
      setCurrentState(true);
      const result = await tx.wait();
      setCurrentState(false);
      if (result.status === 0) {
        tooltip.error({
          content:
            "Transaction failed due to a network error. Please refresh the page and try again.",
          duration: 5000,
        });
      } else {
        tooltip.success({ content: "Successful", duration: 5000 });
        queryData();
      }
      setAmount("");
    } catch (error) {
      console.log(error);
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const withdraw = async () => {
    try {
      const tx = await withdrawFromSP(
        new BigNumber(amount).multipliedBy(1e18).toFixed()
      );
      setCurrentWaitInfo({
        type: "loading",
        info:
          "Withdraw " + Number(amount.toFixed(4)).toLocaleString() + " bitUSD",
      });
      setCurrentState(true);
      const result = await tx.wait();
      setCurrentState(false);
      if (result.status === 0) {
        tooltip.error({
          content:
            "Transaction failed due to a network error. Please refresh the page and try again.",
          duration: 5000,
        });
      } else {
        tooltip.success({ content: "Successful", duration: 5000 });
        queryData();
      }
      setAmount("");
    } catch (error) {
      console.log(error);
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const claim = async () => {
    try {
      const tx = await claimCollateralGains();
      setCurrentWaitInfo({
        type: "loading",
        info: "Claiming",
      });
      setCurrentState(true);
      const result = await tx.wait();
      setCurrentState(false);
      if (result.status === 0) {
        tooltip.error({
          content:
            "Transaction failed due to a network error. Please refresh the page and try again.",
          duration: 5000,
        });
      } else {
        tooltip.success({ content: "Successful", duration: 5000 });
        queryData();
      }
      setAmount("");
    } catch (error) {
      console.log(error);
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const Operate = () => {
    if (typeName == "bitGOV/ROSE LP") {
      // Allow zero amounts for approval and staking operations
      if (amount === "" || amount === undefined) {
        return;
      }
      if (buttonName == "Approve") {
        stakeApproveBitGov();
      } else if (buttonName == "Stake") {
        stakeLpBitGov();
      } else if (buttonName == "UnStake") {
        unStakeLpBitGov();
      }
    } else if (typeName == "bitUSD/USDC LP") {
      if (amount === "" || amount === undefined) {
        return;
      }
      if (buttonName == "Approve") {
        stakeApproveBitUsd();
      } else if (buttonName == "Stake") {
        stakeLpBitUsd();
      } else if (buttonName == "UnStake") {
        unStakeLpBitUsd();
      }
    } else {
      if (buttonName == "Deposit") {
        if (amount === "" || amount === undefined) {
          return;
        }
        deposit();
      } else if (buttonName == "Withdraw") {
        if (amount === "" || amount === undefined) {
          return;
        }
        withdraw();
      } else {
        if (!maxBalance) {
          return;
        }
        claim();
      }
    }
  };

  return (
    <>
      <Header type="dapp" dappMenu="Earn"></Header>
      <div className="dappBg">
        {account.status !== "connected" && (
          <div className={`${styles.Earn} ${"dappMain2"}`}>
            <h2 style={{ textAlign: "center" }}>Please connect your wallet</h2>
          </div>
        )}

        {!showEarnMain && account.status === "connected" ? (
          <div className={`${styles.Earn} ${"dappMain2"}`}>
            <div className={styles.earnMain}>
              {/* <div className={styles.earnInfo}>
                <p className={styles.earnTip}>
                  Lock $bitGOV to boost your APR to {boost}x.
                </p>
                <div className={styles.CoinType}>
                  <div className={styles.collateral}>
                    <img src="/dapp/bitUSD.svg" alt="bitUSD" />
                    bitUSD Minting
                  </div>
                </div>
                <div className={styles.data}>
                  <div className={styles.dataItem}>
                    <p>Earn</p>
                    <span>bitGOV</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>bitUSD Circ.</p>
                    <span>${formatNumber(bitUSDCirculation)}</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Base APR</p>
                    <span>{formatNumber(vUSDBaseApr1)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Boosted APR</p>
                    <span>{formatNumber(vUSDBaseApr1 * boost)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Your Minted bitUSD</p>
                    <span>{formatNumber(userTotalDebt)}</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Earned</p>
                    <span>{formatNumber(claimableRewards?.vaultRewards)}</span>
                  </div>
                </div>
                <div
                  className={styles.button}
                  onClick={() => router.push("/Vault")}
                >
                  <div className="button rightAngle height">Manage</div>
                </div>
              </div> */}
              <div className={styles.earnInfo}>
                <p className={styles.earnTip}>
                  Lock $bitGOV to boost your APR to {boost}x.
                </p>
                <div className={styles.CoinType}>
                  <div className={styles.collateral}>
                    <img src="/dapp/bitUSD.svg" alt="vUSD" />
                    Stability Pool
                  </div>
                </div>
                <div className={styles.data}>
                  <div className={styles.dataItem}>
                    <p>Earn</p>
                    <span>bitGOV</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>TVL</p>
                    <span>
                      $
                      {formatNumber(
                        Number(stabilityPoolBalance) +
                          Number(stabilityPool.balance) * rosePrice
                      )}
                    </span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Base APR</p>
                    <span>{formatNumber(vUSDBaseApr3)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Boosted APR</p>
                    <span>{formatNumber(vUSDBaseApr3 * boost)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Your Deposits</p>
                    <span>{formatNumber(accountDeposits)}</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Earned</p>
                    <span>{formatNumber(stabilityPool?.earned || 0)}</span>
                  </div>
                </div>
                <div
                  className={styles.button}
                  onClick={() => changeManage("Stability Pool")}
                >
                  <div className="button rightAngle height">Manage</div>
                </div>
              </div>
              {/* <div className={styles.earnInfo}>
                <p className={styles.earnTip}>
                  Lock $bitGOV to boost your APR to {boost}x.
                </p>
                <div className={styles.CoinType}>
                  <div className={styles.collateral}>
                    <img src="/dapp/vineArose.svg" alt="vUSD" />
                    bitGOV/ROSE LP
                  </div>
                </div>
                <div className={styles.data}>
                  <div className={styles.dataItem}>
                    <p>Earn</p>
                    <span>bitGOV</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>TVL</p>
                    <span>
                      ${formatNumber(Number(mockLpBalance) * bitGovLPPrice)}
                    </span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Base APR</p>
                    <span>{formatNumber(vUSDBaseApr2)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Boosted APR</p>
                    <span>{formatNumber(vUSDBaseApr2 * boost)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Your Deposits</p>
                    <span>{formatNumber(unStakeLpBalance)}</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Earned</p>
                    <span>{formatNumber(claimableRewards?.bitGov)}</span>
                  </div>
                </div>
                <div
                  className={styles.button}
                  onClick={() => changeManage("bitGOV/ROSE LP")}
                >
                  <div className="button rightAngle height">Manage</div>
                </div>
              </div> */}
              {/* <div className={styles.earnInfo}>
                <p className={styles.earnTip}>
                  Lock $bitGOV to boost your APR to {boost}x.
                </p>
                <div className={styles.CoinType}>
                  <div className={styles.collateral}>
                    <img src="/dapp/usdc.svg" alt="icon" />
                    bitUSD/USDC LP
                  </div>
                </div>
                <div className={styles.data}>
                  <div className={styles.dataItem}>
                    <p>Earn</p>
                    <span>bitGOV</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>TVL</p>
                    <span>
                      ${formatNumber(Number(VUSDLpBalance) * bitUsdLPPrice)}
                    </span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Base APR</p>
                    <span>{formatNumber(vUSDBaseApr4)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Boosted APR</p>
                    <span>{formatNumber(vUSDBaseApr4 * boost)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Your Deposits</p>
                    <span>{formatNumber(unStakeLpBalance2)}</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Earned</p>
                    <span>{formatNumber(claimableRewards?.bitUsd)}</span>
                  </div>
                </div>
                <div
                  className={styles.button}
                  onClick={() => changeManage("bitUSD/USDC LP")}
                >
                  <div className="button rightAngle height">Manage</div>
                </div>
              </div> */}
            </div>
          </div>
        ) : null}

        {showEarnMain && account.status === "connected" ? (
          <div className={`${styles.Earn2} ${"dappMain"}`}>
            <div className={styles.back} onClick={() => setShowEarnMain(false)}>
              <img src="/dapp/leftArr.svg" alt="icon" />
              Back
            </div>
            <div className={styles.earnMain}>
              <div className={styles.title}>
                <img src="/dapp/bitUSD.svg" alt="vUSD" />
                {typeName}
              </div>
              <div className={styles.dataInfo}>
                <div className={styles.value}>
                  <span>APR</span>
                  <div>
                    <p>
                      {typeName == "bitGOV/ROSE LP"
                        ? formatNumber(vUSDBaseApr2 * boost)
                        : typeName == "bitUSD/USDC LP"
                        ? formatNumber(vUSDBaseApr4 * boost)
                        : formatNumber(vUSDBaseApr3 * boost)}{" "}
                      ({boost}x)
                    </p>
                  </div>
                </div>
                <div className={styles.value}>
                  <span>Pool TVL</span>
                  <div>${tvl}</div>
                </div>
              </div>
              <div className={styles.manage}>
                <div className={styles.manageMain}>
                  <div className={styles.manageDesc}>
                    <p>{"Manage " + typeName}</p>
                    <div>
                      {typeName == "bitGOV/wBTC LP"
                        ? "Stake bitGOV/wBTC LP to earn bitGOV rewards."
                        : typeName == "bitUSD/USDC LP"
                        ? "Stake bitUSD/USDC LP to earn bitGOV rewards."
                        : "Stake bitUSD to earn bitGOV rewards. During liquidations, your deposit will be used to purchase discounted collaterals."}
                      {typeName == "Stability Pool" ? (
                        <Link
                          target="_blank"
                          href=""
                          rel="nofollow noopener noreferrer"
                        >
                          <span style={{ color: "#00D7CA" }}> Read more.</span>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className={styles.opType}
                    style={
                      typeName == "Stability Pool"
                        ? { gridTemplateColumns: "1fr 1fr 1fr" }
                        : null
                    }
                  >
                    {typeName == "Mint bitUSD" ? (
                      <>
                        <span
                          className={
                            changeType == "Mint" ? `${styles.active}` : null
                          }
                          onClick={() => changeTypeCoin("Mint", "bitUSD")}
                          style={{ display: "none" }}
                        >
                          Mint
                        </span>
                      </>
                    ) : null}
                    {typeName == "bitGOV/wBTC LP" ||
                    typeName == "bitUSD/USDC LP" ? (
                      <>
                        <span
                          className={
                            changeType == "Stake" ? `${styles.active}` : null
                          }
                          onClick={() => changeTypeCoin("Stake", "LP")}
                        >
                          Stake
                        </span>
                        <span
                          className={
                            changeType == "UnStake" ? `${styles.active}` : null
                          }
                          onClick={() => changeTypeCoin("UnStake", "LP")}
                        >
                          UnStake
                        </span>
                      </>
                    ) : null}
                    {typeName == "Stability Pool" ? (
                      <>
                        <span
                          className={
                            changeType == "Deposit" ? `${styles.active}` : null
                          }
                          onClick={() => changeTypeCoin("Deposit", "bitUSD")}
                        >
                          Deposit
                        </span>
                        <span
                          className={
                            changeType == "Withdraw" ? `${styles.active}` : null
                          }
                          onClick={() => changeTypeCoin("Withdraw", "bitUSD")}
                        >
                          Withdraw
                        </span>
                        <span
                          className={
                            changeType == "Claim" ? `${styles.active}` : null
                          }
                          onClick={() => changeTypeCoin("Claim", "$wBTC")}
                        >
                          Reward
                        </span>
                      </>
                    ) : null}
                  </div>
                  <div className="balance">
                    {typeName == "Stability Pool" && changeType == "Claim" ? (
                      <>
                        {depositorCollateralGain.map((item, index) => (
                          <div key={index} className="value">
                            <p>
                              {changeType} $
                              {
                                collaterals[Object.keys(collaterals)[index]]
                                  ?.collateral?.name
                              }
                            </p>
                            <span>
                              {fromBigNumber(item).toLocaleString()} $
                              {
                                collaterals[Object.keys(collaterals)[index]]
                                  ?.collateral?.name
                              }
                            </span>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="value">
                        <p>
                          {changeType} {coin}
                        </p>
                        <span>
                          {changeType == "Claim" ? null : "MAX "}{" "}
                          {Number(maxBalance.toFixed(4)).toLocaleString()}{" "}
                          {coin}
                        </span>
                      </div>
                    )}
                  </div>
                  {changeType == "Claim" ? null : (
                    <>
                      <div className="inputTxt2">
                        <div>
                          <input
                            type="number"
                            placeholder="0"
                            onWheel={(e) => e.target.blur()}
                            id="amount"
                            min="0" // Prevent negative values
                            step="any" // Allow decimal values
                            onKeyDown={onKeyDown}
                            onChange={changeAmount}
                            value={amount === 0 ? "0" : amount || ""}
                          />
                          <span className="font_12_gray">
                            ≈$
                            {typeName == "bitGOV/ROSE LP"
                              ? formatNumber(Number(amount) * bitGovLPPrice)
                              : typeName == "bitUSD/USDC LP"
                              ? formatNumber(
                                  Number(amount) * (tvl / USDCtotalSupply)
                                )
                              : formatNumber(Number(amount))}
                          </span>
                        </div>
                        <span className="font_14 gray">{coin}</span>
                      </div>
                      <div
                        className="changeBalance"
                        style={{ marginTop: "12px" }}
                      >
                        <span onClick={() => changeAmountValue(0.25)}>25%</span>
                        <span onClick={() => changeAmountValue(0.5)}>50%</span>
                        <span onClick={() => changeAmountValue(0.75)}>75%</span>
                        <span
                          onClick={() => changeAmountValue(1)}
                          style={{ border: "none" }}
                        >
                          Max
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className={styles.button}>
                  {changeType == "Claim" ? (
                    <div
                      className={
                        !maxBalance
                          ? "button rightAngle height disable"
                          : "button rightAngle height"
                      }
                      onClick={() => Operate()}
                    >
                      {buttonName}
                    </div>
                  ) : (
                    <div
                      className={
                        !amount
                          ? "button rightAngle height disable"
                          : "button rightAngle height"
                      }
                      onClick={() => Operate()}
                    >
                      {buttonName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {!Object.keys(stabilityPool).length > 0 &&
      account.status === "connected" &&
      signatureToken?.user &&
      signatureTrove?.user ? (
        <Loading></Loading>
      ) : null}

      {currentState ? <Wait></Wait> : null}

      <Footer></Footer>
    </>
  );
}
