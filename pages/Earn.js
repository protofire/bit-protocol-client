import styles from "../styles/dapp.module.scss";
import Header from "../components/header";
import Footer from "../components/footer";
import { useState, useContext, useRef, useEffect } from "react";
import DepositsAndDebt from "../components/dapp/depositsAndDebt";
import { UserContext } from "../hook/user";
import { useRouter } from "next/router";
import BigNumber from "bignumber.js";
import Wait from "../components/tooltip/wait";
import tooltip from "../components/tooltip";
import Link from "next/link";

export default function Earn() {
  const router = useRouter();

  const {
    currentState,
    setCurrentState,
    setCurrentWaitInfo,
    account,
    vineLpTokenPoolMain,
    vineLpTokenPoolQuery,
    mockLpMain,
    mockLpQuery,
    VineLpTokenPool,
    lpPrice,
    stabilityPoolMain,
    stabilityPoolQuery,
    vUSDbalance,
    rosePrice,
    totalRose,
    debtTokenQuery,
    debt,
    troveManagerQuery,
    vinePrice,
    boost,
    formatNum,
    VUSDUSDCLPQuery,
    usdcPoolQuery,
    VUSDUSDCLPMain,
    usdcPoolMain,
    usdcPool,
    VUSDUSDCLP,
    vaultEarned,
    vineRoseEarned,
    stabilityEarned,
    vusdUsdcEarned,
  } = useContext(UserContext);

  const [showEarnMain, setShowEarnMain] = useState(false);
  const [changeType, setChangeType] = useState("Mint");
  const [coin, setCoin] = useState("bitUSD");
  const [typeName, setTypeName] = useState("");
  const [maxBalance, setMaxBalance] = useState(0);
  const [buttonName, setButtonName] = useState("Stake");

  const changeTypeCoin = (type, coin) => {
    setAmount("");
    setChangeType(type);
    setCoin(coin);
  };

  const changeManage = (value) => {
    setTypeName(value);
    if (value == "bitGOV/ROSE LP") {
      changeTypeCoin("Stake", "LP");
    } else if (value == "bitUSD/USDC LP") {
      changeTypeCoin("Stake", "LP");
    } else {
      changeTypeCoin("Deposit", "bitUSD");
    }
    setShowEarnMain(true);
  };

  const onKeyDown = async (e) => {
    const invalidChars = ["-", "+", "e", "E"];
    if (invalidChars.indexOf(e.key) !== -1) {
      e.preventDefault();
    }
  };

  const [amount, setAmount] = useState("");
  const changeAmount = async (e) => {
    const value = Number(e.target.value);
    if (value < maxBalance) {
      setAmount(value == 0 ? "" : value);
    } else {
      setAmount(maxBalance);
    }
  };

  const changeAmountVaule = (value) => {
    setAmount(maxBalance * value);
  };

  const [stakeLpBalance, setStakeLpBalance] = useState(0);
  const [unStakeLpBalance, setUnStakeLpBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [accountDeposits, setAccountDeposits] = useState(0);

  const [stakeLpBalance2, setStakeLpBalance2] = useState(0);
  const [unStakeLpBalance2, setUnStakeLpBalance2] = useState(0);
  const [allowance2, setAllowance2] = useState(0);

  const [mockLpBanace, setMockLpBanace] = useState(0);
  const [VUSDLpBanace, setVUSDLpBanace] = useState(0);
  const [stabilityPoolBanace, setStabilityPoolBanace] = useState(0);

  //vUSD Minting
  const [vUSDCirc, setvUSDCirc] = useState(0);
  const [baseAPR1, setBaseAPR1] = useState(0);

  //VINE/ROSE LP
  const [baseAPR2, setBaseAPR2] = useState(0);

  //Stability Pool
  const [baseAPR3, setBaseAPR3] = useState(0);

  //vUSD/USDC LP
  const [baseAPR4, setBaseAPR4] = useState(0);
  const [USDCtotalSupply, setUSDCtotalSupply] = useState(0);

  const [depositorCollateralGain, setDepositorCollateralGain] = useState(0);

  const queryData = async () => {
    if (account) {
      //VINE/ROSE LP
      //stake
      // const balanceOf1 = await mockLpQuery.balanceOf(account);
      // setStakeLpBalance((new BigNumber(balanceOf1._hex).div(1e18)).toFixed());
      // const allowance = await mockLpQuery.allowance(account, VineLpTokenPool);
      // setAllowance((new BigNumber(allowance._hex).div(1e18)).toFixed());
      // //unstake
      // const balanceOf2 = await vineLpTokenPoolQuery.balanceOf(account);
      // setUnStakeLpBalance((new BigNumber(balanceOf2._hex).div(1e18)).toFixed());

      // //vUSD/USDC LP
      // //stake
      // const balanceOf4 = await VUSDUSDCLPQuery.balanceOf(account);
      // setStakeLpBalance2((new BigNumber(balanceOf4._hex).div(1e6)).toFixed());
      // const allowance2 = await VUSDUSDCLPQuery.allowance(account, usdcPool);
      // setAllowance2((new BigNumber(allowance2._hex).div(1e18)).toFixed());
      // //unstake
      // const balanceOf5 = await usdcPoolQuery.balanceOf(account);
      // setUnStakeLpBalance2((new BigNumber(balanceOf5._hex).div(1e6)).toFixed());

      //withdraw
      const balanceOf3 = await stabilityPoolQuery.accountDeposits(account);
      setAccountDeposits(new BigNumber(balanceOf3[0]._hex).div(1e18).toFixed());

      //Claim
      const getDepositorCollateralGain =
        await stabilityPoolQuery.getDepositorCollateralGain(account);
      setDepositorCollateralGain(
        new BigNumber(getDepositorCollateralGain[0]._hex).div(1e18).toFixed()
      );
    }
    // if (mockLpQuery) {
    //     const balanceOf = await mockLpQuery.balanceOf(VineLpTokenPool);
    //     setMockLpBanace((new BigNumber(balanceOf._hex).div(1e18)).toFixed());
    // }
    if (stabilityPoolQuery) {
      const balanceOf = await stabilityPoolQuery.getTotalDebtTokenDeposits();
      setStabilityPoolBanace(new BigNumber(balanceOf._hex).div(1e18).toFixed());
    }
    // const balanceOf = await debtTokenQuery.balanceOf(VUSDUSDCLP);
    // setVUSDLpBanace(new BigNumber(balanceOf._hex).div(1e18).toFixed());

    //vUSD Minting
    const vUSDCirc = await debtTokenQuery.totalSupply();
    setvUSDCirc(Number(vUSDCirc._hex) / 1e18);
    const baseAPR1 = await troveManagerQuery.rewardRate();
    setBaseAPR1(Number(baseAPR1._hex) === 0 ? 0 : Number(baseAPR1._hex) / 1e18);
    // const baseAPR2 = await vineLpTokenPoolQuery.rewardRate();
    // setBaseAPR2(Number(baseAPR2._hex) / 1e18);
    const baseAPR3 = await stabilityPoolQuery.rewardRate();
    setBaseAPR3(Number(baseAPR3._hex) / 1e18);
    // const baseAPR4 = await usdcPoolQuery.rewardRate();
    // setBaseAPR4(Number(baseAPR4._hex) / 1e18);

    // const totalSupply = await VUSDUSDCLPQuery.totalSupply();
    // setUSDCtotalSupply(Number(totalSupply._hex) / 1e18);
  };

  let timerLoading = useRef(null);
  useEffect(() => {
    queryData();
    timerLoading.current = setInterval(() => {
      queryData();
    }, 3000);
    return () => clearInterval(timerLoading.current);
  }, [account]);

  const [vUSDBaseApr1, setvUSDBaseApr1] = useState(0);
  const [vUSDBaseApr2, setvUSDBaseApr2] = useState(0);
  const [vUSDBaseApr3, setvUSDBaseApr3] = useState(0);
  const [vUSDBaseApr4, setvUSDBaseApr4] = useState(0);
  useEffect(() => {
    const vUSDBaseApr1 = (baseAPR1 * 86400 * 365 * vinePrice * 100) / vUSDCirc;
    setvUSDBaseApr1(vUSDBaseApr1);
    const vUSDBaseApr2 =
      (baseAPR2 * 86400 * 365 * vinePrice * 100) /
      (Number(mockLpBanace) * lpPrice);
    setvUSDBaseApr2(vUSDBaseApr2);
    const vUSDBaseApr4 =
      (baseAPR4 * 86400 * 365 * vinePrice * 100) / (Number(VUSDLpBanace) * 2);
    setvUSDBaseApr4(vUSDBaseApr4);
    const vUSDBaseApr3 =
      (baseAPR3 * 86400 * 365 * vinePrice * 100) /
      (Number(stabilityPoolBanace) + Number(totalRose) * rosePrice);
    setvUSDBaseApr3(vUSDBaseApr3);
  }, [
    vUSDCirc,
    baseAPR1,
    baseAPR2,
    baseAPR3,
    vinePrice,
    mockLpBanace,
    lpPrice,
    stabilityPoolBanace,
    totalRose,
    rosePrice,
    baseAPR4,
    VUSDLpBanace,
  ]);

  useEffect(() => {
    if (typeName == "bitGOV/ROSE LP") {
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
        setMaxBalance(Number(vUSDbalance));
      } else if (changeType == "Withdraw") {
        setMaxBalance(Number(accountDeposits));
      } else {
        setMaxBalance(Number(depositorCollateralGain));
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
      if (typeName == "bitGOV/ROSE LP") {
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

  const [tvl, setTvl] = useState(0);
  useEffect(() => {
    let num = 0;
    if (typeName == "bitGOV/ROSE LP") {
      num = Number(mockLpBanace) * lpPrice;
    } else if (typeName == "bitUSD/USDC LP") {
      num = Number(VUSDLpBanace) * 2;
    } else {
      num = Number(stabilityPoolBanace) + Number(totalRose) * rosePrice;
    }
    setTvl(formatNum(num));
  }, [
    typeName,
    mockLpBanace,
    lpPrice,
    stabilityPoolBanace,
    rosePrice,
    totalRose,
    VUSDLpBanace,
  ]);

  const stakeApprove = async () => {
    try {
      const tx = await mockLpMain.approve(
        VineLpTokenPool,
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
      }
      setAmount("");
    } catch (error) {
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const stakeLp = async () => {
    try {
      const tx = await vineLpTokenPoolMain.deposit(
        account,
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
      }
      setAmount("");
    } catch (error) {
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const unStakeLp = async () => {
    try {
      const tx = await vineLpTokenPoolMain.withdraw(
        account,
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
      }
      setAmount("");
    } catch (error) {
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const stakeApprove2 = async () => {
    try {
      const tx = await VUSDUSDCLPMain.approve(
        usdcPool,
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
      }
      setAmount("");
    } catch (error) {
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const stakeLp2 = async () => {
    try {
      const tx = await usdcPoolMain.deposit(
        account,
        new BigNumber(amount).multipliedBy(1e6).toFixed()
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
      }
      setAmount("");
    } catch (error) {
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const unStakeLp2 = async () => {
    try {
      const tx = await usdcPoolMain.withdraw(
        account,
        new BigNumber(amount).multipliedBy(1e6).toFixed()
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
      }
      setAmount("");
    } catch (error) {
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const Deposit = async () => {
    try {
      const tx = await stabilityPoolMain.provideToSP(
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
      }
      setAmount("");
    } catch (error) {
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const Withdraw = async () => {
    try {
      const tx = await stabilityPoolMain.withdrawFromSP(
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
      }
      setAmount("");
    } catch (error) {
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const Claim = async () => {
    try {
      const tx = await stabilityPoolMain.claimCollateralGains(account, [0]);
      setCurrentWaitInfo({
        type: "loading",
        info: "Claim " + Number(amount.toFixed(4)).toLocaleString() + " bitUSD",
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
      }
      setAmount("");
    } catch (error) {
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
      if (!amount) {
        return;
      }
      if (buttonName == "Approve") {
        stakeApprove();
      } else if (buttonName == "Stake") {
        stakeLp();
      } else if (buttonName == "UnStake") {
        unStakeLp();
      }
    } else if (typeName == "bitUSD/USDC LP") {
      if (!amount) {
        return;
      }
      if (buttonName == "Approve") {
        stakeApprove2();
      } else if (buttonName == "Stake") {
        stakeLp2();
      } else if (buttonName == "UnStake") {
        unStakeLp2();
      }
    } else {
      if (buttonName == "Deposit") {
        if (!amount) {
          return;
        }
        Deposit();
      } else if (buttonName == "Withdraw") {
        if (!amount) {
          return;
        }
        Withdraw();
      } else {
        if (!maxBalance) {
          return;
        }
        Claim();
      }
    }
  };

  return (
    <>
      <Header type="dapp" dappMenu="Earn"></Header>
      <div className="dappBg">
        {!showEarnMain ? (
          <div className={`${styles.Earn} ${"dappMain2"}`}>
            <div className={styles.max480}>
              <DepositsAndDebt type="Earn"></DepositsAndDebt>
            </div>

            <div className={styles.earnMain}>
              <div className={styles.earnInfo}>
                <p className={styles.earnTip}>
                  Lock $bitGOV to boost your APR to {boost}x.
                </p>
                <div className={styles.CoinType}>
                  <img src="/dapp/vUSD.svg" alt="bitUSD" />
                  bitUSD Minting
                </div>
                <div className={styles.data}>
                  <div className={styles.dataItem}>
                    <p>Earn</p>
                    <span>bitGOV</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>bitUSD Circ.</p>
                    <span>${formatNum(vUSDCirc)}</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Base APR</p>
                    <span>{formatNum(vUSDBaseApr1)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Boosted APR</p>
                    <span>{formatNum(vUSDBaseApr1 * boost)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Your Minted bitUSD</p>
                    <span>{formatNum(debt)}</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Earned</p>
                    <span>{formatNum(vaultEarned)}</span>
                  </div>
                </div>
                <div
                  className={styles.button}
                  onClick={() => router.push("/Mint")}
                >
                  <div className="button rightAngle height">Manage</div>
                </div>
              </div>

              <div className={styles.earnInfo}>
                <p className={styles.earnTip}>
                  Lock $bitGOV to boost your APR to {boost}x.
                </p>
                <div
                  className="button rightAngle height disable"
                  style={{ marginTop: "10px", border: "1px solid #333" }}
                >
                  COMING SOON
                </div>
                {/* <div className={styles.CoinType}>
                  <img
                    style={{ width: "65px" }}
                    src="/dapp/vineArose.svg"
                    alt="vUSD"
                  />
                  bitGOV/ROSE LP
                </div>
                <div className={styles.data}>
                  <div className={styles.dataItem}>
                    <p>Earn</p>
                    <span>bitGOV</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>TVL</p>
                    <span>${formatNum(Number(mockLpBanace) * lpPrice)}</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Base APR</p>
                    <span>{formatNum(vUSDBaseApr2)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Boosted APR</p>
                    <span>{formatNum(vUSDBaseApr2 * boost)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Your Deposits</p>
                    <span>{formatNum(unStakeLpBalance)}</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Earned</p>
                    <span>{formatNum(vineRoseEarned)}</span>
                  </div>
                </div>
                <div
                  className={styles.button}
                  onClick={() => changeManage("bitGOV/ROSE LP")}
                >
                  <div className="button rightAngle height">Manage</div>
                </div> */}
              </div>

              <div className={styles.earnInfo}>
                <p className={styles.earnTip}>
                  Lock $bitGOV to boost your APR to {boost}x.
                </p>
                <div
                  className="button rightAngle height disable"
                  style={{ marginTop: "10px", border: "1px solid #333" }}
                >
                  COMING SOON
                </div>
                {/* <div className={styles.CoinType}>
                  <img
                    style={{ width: "65px" }}
                    src="/dapp/usdc.svg"
                    alt="icon"
                  />
                  bitUSD/USDC LP
                </div>
                <div className={styles.data}>
                  <div className={styles.dataItem}>
                    <p>Earn</p>
                    <span>bitGOV</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>TVL</p>
                    <span>${formatNum(Number(VUSDLpBanace) * 2)}</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Base APR</p>
                    <span>{formatNum(vUSDBaseApr4)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Boosted APR</p>
                    <span>{formatNum(vUSDBaseApr4 * boost)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Your Deposits</p>
                    <span>{formatNum(unStakeLpBalance2)}</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Earned</p>
                    <span>{formatNum(vusdUsdcEarned)}</span>
                  </div>
                </div>
                <div
                  className={styles.button}
                  onClick={() => changeManage("bitUSD/USDC LP")}
                >
                  <div className="button rightAngle height">Manage</div>
                </div> */}
              </div>

              <div className={styles.earnInfo}>
                <p className={styles.earnTip}>
                  Lock $bitGOV to boost your APR to {boost}x.
                </p>
                <div className={styles.CoinType}>
                  <img src="/dapp/vUSD.svg" alt="vUSD" />
                  Stability Pool
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
                      {formatNum(
                        Number(stabilityPoolBanace) +
                          Number(totalRose) * rosePrice
                      )}
                    </span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Base APR</p>
                    <span>{formatNum(vUSDBaseApr3)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Boosted APR</p>
                    <span>{formatNum(vUSDBaseApr3 * boost)}%</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Your Deposits</p>
                    <span>{formatNum(accountDeposits)}</span>
                  </div>
                  <div className={styles.dataItem}>
                    <p>Earned</p>
                    <span>{formatNum(stabilityEarned)}</span>
                  </div>
                </div>
                <div
                  className={styles.button}
                  onClick={() => changeManage("Stability Pool")}
                >
                  <div className="button rightAngle height">Manage</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {showEarnMain ? (
          <div className={`${styles.Earn2} ${"dappMain"}`}>
            <div className={styles.back} onClick={() => setShowEarnMain(false)}>
              <img src="/dapp/leftArr.svg" alt="icon" />
              Back
            </div>
            <div className={styles.earnMain}>
              <div className={styles.title}>
                <img src="/dapp/vUSD.svg" alt="vUSD" />
                {typeName}
              </div>
              <div className={styles.dataInfo}>
                <div className={styles.value}>
                  <span>APR</span>
                  <div>
                    <p>
                      {typeName == "bitGOV/ROSE LP"
                        ? formatNum(vUSDBaseApr2 * boost)
                        : typeName == "bitUSD/USDC LP"
                        ? formatNum(vUSDBaseApr4 * boost)
                        : formatNum(vUSDBaseApr3 * boost)}{" "}
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
                      {typeName == "bitGOV/ROSE LP"
                        ? "Stake bitGOV/ROSE LP to earn bitGOV rewards."
                        : typeName == "bitUSD/USDC LP"
                        ? "Stake bitUSD/USDC LP to earn bitGOV rewards."
                        : "Stake bitUSD to earn bitGOV rewards. During liquidations, your deposit will be used to purchase discounted collaterals."}
                      {typeName == "Stability Pool" ? (
                        <Link
                          target="_blank"
                          href="https://vine-money.gitbook.io/vine-money/protocol/stability-pool-and-liquidations"
                          rel="nofollow noopener noreferrer"
                        >
                          <span style={{ color: "#57CC99" }}> Read more.</span>
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
                    {typeName == "bitGOV/ROSE LP" ||
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
                          onClick={() => changeTypeCoin("Claim", "$ROSE")}
                        >
                          Reward
                        </span>
                      </>
                    ) : null}
                  </div>
                  <div className="balance">
                    <p>
                      {changeType} {coin}
                    </p>
                    <span>
                      {changeType == "Claim" ? null : "MAX "}{" "}
                      {Number(maxBalance.toFixed(4)).toLocaleString()} {coin}
                    </span>
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
                            onKeyDown={onKeyDown.bind(this)}
                            onChange={changeAmount.bind(this)}
                            value={amount}
                          />
                          <span className="font_12_gray">
                            ≈$
                            {typeName == "bitGOV/ROSE LP"
                              ? formatNum(Number(amount) * lpPrice)
                              : typeName == "bitUSD/USDC LP"
                              ? formatNum(
                                  Number(amount) * (tvl / USDCtotalSupply)
                                )
                              : formatNum(Number(amount))}
                          </span>
                        </div>
                        <span className="font_14 gray">{coin}</span>
                      </div>
                      <div
                        className="changeBalance"
                        style={{ marginTop: "12px" }}
                      >
                        <span onClick={() => changeAmountVaule(0.25)}>25%</span>
                        <span onClick={() => changeAmountVaule(0.5)}>50%</span>
                        <span onClick={() => changeAmountVaule(0.75)}>75%</span>
                        <span
                          onClick={() => changeAmountVaule(1)}
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
      {currentState ? <Wait></Wait> : null}
      <Footer></Footer>
    </>
  );
}
