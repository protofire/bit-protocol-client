import styles from "../styles/dapp.module.scss";
import Header from "../components/header";
import Footer from "../components/footer";
import { BlockchainContext } from "../hook/blockchain";
import { useEffect, useState, useContext, useRef } from "react";
import Wait from "../components/tooltip/wait";
import Loading from "../components/tooltip/loading";
import tooltip from "../components/tooltip";
import Slider from "rc-slider";
import BigNumber from "bignumber.js";
import { formatNumber } from "../utils/helpers";
import { useAccount } from "wagmi";
import useDebounce from "../hook/useDebounce";
import { ethers } from 'ethers';

import "rc-slider/assets/index.css";

export default function Lock() {
  const account = useAccount();

  const {
    bitGovBalance,
    userAccountWeight,
    accountUnlockAmount,
    accountLockAmount,
    getAccountActiveLocks,
    lockTotalWeight,
    getWithdrawWithPenaltyAmounts,
    boost,
    lockToken,
    setCurrentState,
    setCurrentWaitInfo,
    currentState,
    freeze,
    unfreeze,
    withdrawWithPenalty,
    signatureTrove,
    signatureToken,
  } = useContext(BlockchainContext);

  const vinePrice = 1;

  const onKeyDown = (e) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };  

  const marks = {
    2: "2",
    8: "8",
    16: "16",
    26: "26",
    52: "52",
  };
  const [currentValue, setCurrentValue] = useState(26);
  const log = (value) => {
    setCurrentValue(value);
  };

  const [balance, setBalance] = useState(0);
  const [accountWeight, setAccountWeight] = useState(0);
  const [accountLock, setAccountLock] = useState(0);
  const [accountUnLock, setAccountUnLock] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  // const [totalLock, setTotalLock] = useState(0);
  const [isLocks, setIsLocks] = useState(false);
  const [amountWithdrawn, setAmountWithdrawn] = useState(0);
  const [penaltyAmountPaid, setPenaltyAmountPaid] = useState(0);
  const [amount, setAmount] = useState("");
  const [lockDate, setLockDate] = useState();
  const [accountShare, setAccountShare] = useState(0);
  const [showUnlock, setShowUnlock] = useState(false);
  const [claimAmount, setClaimAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const debouncedValue = useDebounce(claimAmount, 3000);

  const queryData = async () => {
    if (account.status === "connected") {
      setBalance(bitGovBalance);
      setAccountWeight(userAccountWeight);
      setAccountLock(accountLockAmount);
      setAccountUnLock(accountUnlockAmount);
      const locks = await getAccountActiveLocks();
      setIsLocks(locks.frozenAmount > 0);
      setTotalWeight(lockTotalWeight);
      setLoading(false);
      // if (vineTokenQuery) {
      //     const balanceOf = await vineTokenQuery.balanceOf(tokenLocker);
      //     setTotalLock((new BigNumber(balanceOf._hex).div(1e18)).toFixed());
      // }
    }
  };

  let timerLoading = useRef(null);
  useEffect(() => {
    queryData();
    timerLoading.current = setInterval(() => {
      queryData();
    }, 3000);
    return () => clearInterval(timerLoading.current);
  }, [
    bitGovBalance,
    userAccountWeight,
    accountUnlockAmount,
    accountLockAmount,
    lockTotalWeight,
    account.status,
  ]);

  const changeAmount = (e) => {
    const value = e.target.value;

    if (value === '') {
      setAmount('');
      return;
    }

    // Only allow integers
    if (!/^\d+$/.test(value)) {
      return;
    }

    const numValue = Number(value);
    if (numValue >= 0 && numValue <= Math.floor(Number(balance))) {
      setAmount(value);
    } else if (numValue > Number(balance)) {
      setAmount(Math.floor(Number(balance)).toString());
    }
  };  

  const changeValue = (percentage) => {
    // percentage should be an integer, e.g., 25 for 25%
    const newAmount = Math.floor((Number(balance) * percentage) / 100);
    setAmount(newAmount.toString());
  };


  useEffect(() => {
    if (Number(amount) && currentValue) {
      const currentDate = new Date();
      const d = Number(currentValue) * 7;
      const futureDate = new Date(
        currentDate.getTime() + d * 24 * 60 * 60 * 1000
      );
      setLockDate(futureDate.toDateString());
    } else {
      setLockDate("-");
    }
  }, [amount, currentValue]);

  useEffect(() => {
    if (accountWeight && totalWeight) {
      setAccountShare((Number(accountWeight) / Number(totalWeight)) * 100);
    }
    // setLoading(false);
  }, [totalWeight, accountWeight]);

  useEffect(() => {
    if (debouncedValue) {
      fetchWithdrawPenaltyAmounts(debouncedValue);
    }
  }, [debouncedValue]);

  const fetchWithdrawPenaltyAmounts = async (value) => {
    const withdrawWithPenaltyAmounts = await getWithdrawWithPenaltyAmounts(
      Number(value)
    );
    setAmountWithdrawn(withdrawWithPenaltyAmounts.amountWithdrawn);
    setPenaltyAmountPaid(withdrawWithPenaltyAmounts.penaltyAmountPaid);
  };

  const changeClaimAmount = (e) => {
    const value = e.target.value;

    if (value === '') {
      setClaimAmount('');
      setAmountWithdrawn(0);
      setPenaltyAmountPaid(0);
      return;
    }

    // Only allow integers
    if (!/^\d+$/.test(value)) {
      return;
    }

    const numValue = Number(value);
    if (numValue >= 0 && numValue <= Math.floor(Number(accountLock))) {
      setClaimAmount(value);
      setAmountWithdrawn(0);
      setPenaltyAmountPaid(0);
    } else if (numValue > Number(accountLock)) {
      setClaimAmount(Math.floor(Number(accountLock)).toString());
    }
  };  

  const changeShowUnlock = async () => {
    setClaimAmount(accountUnLock);
    setShowUnlock(true);
  };

  const lock = async () => {
    if (amount === "" || amount === undefined) {
      tooltip.error({ content: "Please enter an amount", duration: 5000 });
      return;
    }

    const numAmount = ethers.utils.parseUnits(amount.toString(), 0); // Since no decimals

    if (numAmount.lte(0)) {
      tooltip.error({ content: "Please enter a valid amount", duration: 5000 });
      return;
    }

    if (numAmount.gt(ethers.BigNumber.from(balance))) {
      tooltip.error({ content: "Insufficient balance", duration: 5000 });
      return;
    }

    if (currentValue < 2 || currentValue > 52) {
      tooltip.error({ content: "Invalid lock duration", duration: 5000 });
      return;
    }

    try {
      const tx = await lockToken(
        amount.toString(),
        currentValue
      );
      setCurrentWaitInfo({
        type: "loading",
        info: "Lock " + Number(amount).toLocaleString() + " $bitGOV"
      });
      setCurrentState(true);

      const result = await tx.wait();
      setCurrentState(false);

      if (result.status === 0) {
        tooltip.error({
          content: "Transaction failed. Please try again.",
          duration: 5000
        });
      } else {
        setShowUnlock(false);
        tooltip.success({ content: "Successful", duration: 5000 });
        setAmount("");
      }
    } catch (error) {
      console.error("Lock error:", error);
      setCurrentState(false);
      tooltip.error({
        content: "Transaction failed. Please try again.",
        duration: 5000
      });
    }
  };

  const validateAndLock = () => {
    if (!amount || Number(amount) === 0) {
      tooltip.error({ content: "Please enter an amount", duration: 5000 });
      return;
    }

    if (Number(amount) > Number(balance)) {
      tooltip.error({ content: "Amount exceeds balance", duration: 5000 });
      return;
    }

    lock();
  };

  const enableAutoLock = async () => {
    if (Number(accountLock) <= 0) {
      return;
    }
    try {
      const tx = await freeze();
      setCurrentWaitInfo({ type: "loading" });
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

  const disableAutoLock = async () => {
    try {
      const tx = await unfreeze();
      setCurrentWaitInfo({ type: "loading" });
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

  const earlyUnlock = async () => {
    if (claimAmount === "" || claimAmount === undefined) {
      tooltip.error({ content: "Enter Amount", duration: 5000 });
      return;
    }

    try {
      const claimAmountInWei = ethers.utils.parseEther(claimAmount.toString());

      const tx = await withdrawWithPenalty(claimAmountInWei);
      setCurrentWaitInfo({
        type: "loading",
        info: "Early Unlock " + Number(claimAmount).toLocaleString() + " $bitGOV",
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
        setShowUnlock(false);
        tooltip.success({ content: "Successful", duration: 5000 });
      }
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

  return (
    <>
      <Header type="dapp" dappMenu="Lock"></Header>
      <div className="dappBg">
        <div className={`${styles.Lock} ${"dappMain3"}`}>
          {account.status !== "connected" ? (
            <div className={`${styles.Earn} ${"dappMain2"}`}>
              <h2 style={{ textAlign: "center" }}>
                Please connect your wallet
              </h2>
            </div>
          ) : (
            <>
              <div className={styles.lockTop}>
                <div className={styles.dataInfo2}>
                  <div className={styles.value}>
                    <span>Boost</span>
                    <div>
                      <p>{boost}x</p>
                    </div>
                    {/* <span className={styles.span}>Up to 0.00 $VINE</span> */}
                  </div>
                  <div className={styles.value}>
                    <span>Locked $bitGOV</span>
                    <div style={{ display: "flex" }}>
                      <img
                        style={{ width: "26px" }}
                        src="/dapp/bitUSD.svg"
                        alt="bitUSD"
                      />
                      <p>{formatNumber(accountLock + accountUnLock)}</p>
                    </div>
                    <span className={styles.span}>
                      ≈ $
                      {formatNumber((accountLock + accountUnLock) * vinePrice)}
                    </span>
                    {accountLock + accountUnLock > 0 ? (
                      <div
                        className="button_border"
                        style={{
                          padding: "5px",
                          marginTop: "5px",
                          lineHeight: "18px",
                        }}
                        onClick={() => changeShowUnlock()}
                      >
                        Claim
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className={styles.dataInfo2}>
                  <div className={styles.value}>
                    <span>Your Lock Weight</span>
                    <div>
                      <p>{formatNumber(accountWeight)}</p>
                    </div>
                    <span className={styles.span}>
                      of {formatNumber(totalWeight)}
                    </span>
                  </div>
                  <div className={styles.value}>
                    <span>Your Share</span>
                    <div>
                      <p>{Number(accountShare.toFixed(2)).toLocaleString()}%</p>
                    </div>
                    <span className={styles.span}>
                      of allocated vote weight
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.lockMain}>
                <div className={styles.left}>
                  <div className={styles.title}>
                    <p>Lock $bitGOV</p>
                    <span>
                      Lock for up to 52 weeks. Locked $bitGOV gives lock weight
                      and allows boosted claiming.
                    </span>
                  </div>
                  <div className={styles.enterAmount}>
                    <div className={styles.miniTitle}>
                      <span>Enter amount</span>
                      <span style={{ fontSize: "12px" }}>
                        Balance{" "}
                          {Math.floor(balance)}
                        $bitGOV
                      </span>
                    </div>
                    <div className="inputTxt3">
                      <input
                        type="number"
                        placeholder="0"
                        onWheel={(e) => e.target.blur()}
                        id="amount"
                          min="0"
                          step="1"
                          onKeyDown={onKeyDown}
                          onChange={changeAmount}
                          value={amount === 0 ? "0" : amount || ""}
                        />

                      <span>bitGOV</span>
                    </div>
                    <div className="changeBalance">
                        <span onClick={() => changeValue(25)}>25%</span>
                        <span onClick={() => changeValue(50)}>50%</span>
                        <span onClick={() => changeValue(75)}>75%</span>
                        <span onClick={() => changeValue(100)} style={{ border: "none" }}>
                        Max
                      </span>
                    </div>
                    <div className={styles.progressBar}>
                      <Slider
                        min={2}
                        max={52}
                        marks={marks}
                        onChange={log}
                        defaultValue={26}
                        dotStyle={{
                          borderColor: "#38a3a5",
                          background: "#38a3a5",
                        }}
                        activeDotStyle={{ borderColor: "#38a3a5" }}
                        handleStyle={{
                          borderColor: "#38a3a5",
                          backgroundColor: "#38a3a5",
                          opacity: "1",
                        }}
                        trackStyle={{ backgroundColor: "#38a3a5" }}
                      />
                      <div className={styles.value}>{currentValue}</div>
                    </div>
                  </div>
                  <div className={styles.button}>
                    <div
                        className={!amount ? "button rightAngle height disable" : "button rightAngle height"}
                        onClick={validateAndLock}
                    >
                      LOCK
                    </div>
                  </div>
                  <div className={styles.data}>
                    <div className={styles.dataItem}>
                      <p>Lock weight</p>
                      <div>
                        {formatNumber(accountWeight)}
                        {Number(amount) ? (
                          <>
                            <img src="/dapp/right.svg" alt="icon" />
                            <span>
                              {formatNumber(
                                Number(accountWeight) +
                                Number(amount) * currentValue
                              )}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className={styles.dataItem}>
                      <p>Total locked $bitGOV</p>
                      <div>
                        {formatNumber(accountLock + accountUnLock)}
                        {Number(amount) ? (
                          <>
                            <img src="/dapp/right.svg" alt="icon" />
                            <span>
                              {formatNumber(
                                Number(accountLock + accountUnLock) +
                                Number(amount)
                              )}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className={styles.dataItem}>
                      <p>Unlock date</p>
                      <div>
                        <span>{lockDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.right}>
                  <div className={styles.main}>
                    <p>Your Locks</p>
                    <div>
                      {!isLocks ? (
                        <span
                          className={
                            Number(accountLock) > 0
                              ? "button_border"
                              : "button_border disable"
                          }
                          onClick={() => enableAutoLock()}
                        >
                          Enable auto lock
                        </span>
                      ) : (
                        <span
                          className="button_border"
                          onClick={() => disableAutoLock()}
                        >
                          Disable auto lock
                        </span>
                      )}
                    </div>
                  </div>
                  {!isLocks ? (
                    Number(accountLock) > 0 ? (
                      <div className={styles.span}>
                        This allows you to combine all your existing locks in to
                        one lock that is locked in perpetuity for 52 weeks. This
                        ensures your vote-weight does not decrease week on week
                        and saves you spending gas on relocking.
                      </div>
                    ) : (
                      <div className={styles.span}>
                        No active locks, lock some $bitGOV to gain Lock Weight
                      </div>
                    )
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {showUnlock && account.status === "connected" ? (
        <div className="infoTip">
          <div className="info infoNoPadding">
            <div className="infoTitle">
              <div>
                <img className="vUSD" src="/dapp/bitUSD.svg" alt="vUSD" />
                <p>Claim $bitGOV</p>
              </div>
              <div className="close">
                <img
                  src="/icon/close.svg"
                  alt="icon"
                  onClick={() => setShowUnlock(false)}
                />
              </div>
            </div>
            <div className="data">
              <div className="dataItem">
                <p>Locked </p>
                <span>{formatNumber(accountLock)} $bitGOV</span>
              </div>
              <div className="dataItem">
                <p>Unlocked </p>
                <span>{formatNumber(accountUnLock)} $bitGOV</span>
              </div>
              <div className="inputTxt2">
                <input
                  type="number"
                  placeholder="0"
                  onWheel={(e) => e.target.blur()}
                  id="claimAmount"
                  min="0"
                  step="1"
                  onKeyDown={onKeyDown}
                  onChange={changeClaimAmount}
                  value={claimAmount === 0 ? "0" : claimAmount || ""}
                />
                <span>$bitGOV</span>
              </div>
              {claimAmount > accountUnLock ? (
                <p
                  style={{
                    textAlign: "center",
                    margin: "10px 0 20px",
                    fontSize: "14px",
                  }}
                >
                  Early Unlock Penalty:{" "}
                  <span style={{ color: "#00D7CA" }}>
                    {formatNumber(penaltyAmountPaid)}$bitGOV
                  </span>
                </p>
              ) : null}
              <div
                className={
                  Number(debouncedValue) > 0
                    ? "button rightAngle"
                    : "button rightAngle disable"
                }
                style={{ marginTop: "20px" }}
                onClick={() => earlyUnlock()}
              >
                Claim
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* {showUnlock ? <div className='infoTip'>
                <div className='info infoNoPadding'>
                    <div className='infoTitle'>
                        <div>
                            <img className='vUSD' src='/dapp/bitUSD.svg' alt='vUSD' />
                            <p>Early Unlock</p>
                        </div>
                        <div className="close">
                            <img src='/icon/close.svg' alt='icon' onClick={() => setShowUnlock(false)} />
                        </div>
                    </div>
                    <div className="data">
                        <div className="dataItem">
                            <p>Unlocking early will incur a penalty fee. Currently, you have locked <span style={{ "color": "#00D7CA" }}>{formatNumber(accountLock)}vine</span>.
                                Unlocking early will grant you <span style={{ "color": "#00D7CA" }}>{Math.floor(amountWithdrawn)}vine</span>.
                            </p>
                        </div>
                        <div className={styles.buttonTwo}>
                            <div className="button rightAngle noactive" onClick={() => setShowUnlock(false)}>Cancel</div>
                            <div className="button rightAngle" onClick={() => EarlyUnlock()}>Confirm</div>
                        </div>
                    </div>
                </div>
            </div> : null} */}

      {loading &&
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