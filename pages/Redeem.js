import styles from "../styles/dapp.module.scss";
import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState, useContext, useRef } from "react";
import BigNumber from "bignumber.js";
import Wait from "../components/tooltip/wait";
import tooltip from "../components/tooltip";
import { UserContext } from "../hook/user";

export default function Redeem() {
  const {
    account,
    currentState,
    setCurrentState,
    setCurrentWaitInfo,
    bitUSDbalance,
    multiCollateralHintHelpersQuery,
    troveManager,
    wbtcPrice,
    sortedTrovesToken,
    troveManagerMain,
    troveManagerQuery,
    formatNum,
  } = useContext(UserContext);

  const onKeyDown = async (e) => {
    const invalidChars = ["-", "+", "e", "E"];
    if (invalidChars.indexOf(e.key) !== -1) {
      e.preventDefault();
    }
  };

  const [amount, setAmount] = useState("");
  const changeAmount = async (e) => {
    const value = Number(e.target.value);
    if (value < Number(bitUSDbalance)) {
      setAmount(value == 0 ? "" : value);
    } else {
      setAmount(Number(bitUSDbalance));
    }
  };

  const changeAmountVaule = (value) => {
    setAmount(Number(bitUSDbalance) * value);
  };

  const [startTime, setStartTime] = useState(0);
  const [fee, setFee] = useState(0);
  const queryData = async () => {
    const systemDeploymentTime = await troveManagerQuery.systemDeploymentTime();
    const bootstrapPeriod = await troveManagerQuery.BOOTSTRAP_PERIOD();
    setStartTime(Number(systemDeploymentTime) + Number(bootstrapPeriod));

    const redemptionFeeFloor = await troveManagerQuery.redemptionFeeFloor();
    const baseRate = await troveManagerQuery.baseRate();
    setFee((Number(redemptionFeeFloor._hex) + Number(baseRate._hex)) / 1e18);
  };

  const [showRedeem, setShowRedeem] = useState(false);
  useEffect(() => {
    if (startTime) {
      var timestamp = Date.parse(new Date()) / 1000;
      if (timestamp > startTime) {
        setShowRedeem(true);
      }
    }
  }, [startTime]);

  const [feeAmount, setFeeAmount] = useState(0);
  const [expectedCollateralReceived, setExpectedCollateralReceived] =
    useState(0);
  useEffect(() => {
    if (amount) {
      setFeeAmount((Number(amount) / wbtcPrice) * fee);
      setExpectedCollateralReceived(
        Number(amount) / wbtcPrice - (Number(amount) / wbtcPrice) * fee
      );
    } else {
      setFeeAmount(0);
      setExpectedCollateralReceived(0);
    }
  }, [amount, wbtcPrice, fee]);

  let timerLoading = useRef(null);
  useEffect(() => {
    queryData();
    timerLoading.current = setInterval(() => {
      queryData();
    }, 2000);
    return () => clearInterval(timerLoading.current);
  }, [account]);

  let timer = null;
  const getCountDown = () => {
    const nowDate = new Date();
    const nowTime = parseInt(nowDate.getTime() / 1000);
    const t = startTime - nowTime;

    if (t <= -1) {
      clearTimeout(timer);
    } else {
      let day = Math.floor(t / 60 / 60 / 24);
      let hour = Math.floor((t / 60 / 60) % 24);
      let minute = Math.floor((t / 60) % 60);
      let second = Math.floor(t % 60);
      if (day < 10) {
        day = "0" + day;
      }
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      if (second < 10) {
        second = "0" + second;
      }
      timer = setTimeout(() => {
        getCountDown();
      }, 1000);
      return day + "d " + hour + "h " + minute + "m";
    }
  };

  const redeemCollateral = async () => {
    const redemptionHints =
      await multiCollateralHintHelpersQuery.getRedemptionHints(
        troveManager,
        new BigNumber(amount).multipliedBy(1e18).toFixed(),
        new BigNumber(wbtcPrice).multipliedBy(1e18).toFixed(),
        0
      );
    // console.log(Number(redemptionHints.truncatedDebtAmount._hex), Number(new BigNumber(amount).multipliedBy(1e18).toFixed()))
    const status =
      Number(redemptionHints.truncatedDebtAmount._hex) ==
      Number(new BigNumber(amount).multipliedBy(1e18).toFixed())
        ? 1
        : 0;
    // console.log(Number(redemptionHints.partialRedemptionHintNICR._hex))
    const prev = await sortedTrovesToken.getPrev(
      redemptionHints.firstRedemptionHint
    );
    const next = await sortedTrovesToken.getNext(
      redemptionHints.firstRedemptionHint
    );

    try {
      // console.log(
      //     new BigNumber(amount).multipliedBy(1e18).toFixed(),
      //     redemptionHints.firstRedemptionHint,
      //     prev,
      //     next,
      //     new BigNumber(redemptionHints.partialRedemptionHintNICR._hex).toFixed(),
      //     status,
      //     new BigNumber(1e18).toFixed())

      const tx = await troveManagerMain.redeemCollateral(
        new BigNumber(amount).multipliedBy(1e18).toFixed(),
        redemptionHints.firstRedemptionHint,
        prev,
        next,
        new BigNumber(redemptionHints.partialRedemptionHintNICR._hex).toFixed(),
        status,
        new BigNumber(1e18).toFixed()
      );
      setCurrentWaitInfo({
        type: "loading",
        info:
          "Redeem " + Number(amount.toFixed(4)).toLocaleString() + " bitUSD",
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
      console.log(error);
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const Redeem = () => {
    // tooltip.error({ content: "Redemption not available yet", duration: 5000 })

    if (!showRedeem) {
      tooltip.error({
        content: "Redemption should be available in " + getCountDown(),
        duration: 5000,
      });
      return;
    }
    if (!amount) {
      return;
    }
    redeemCollateral();
  };

  return (
    <>
      <Header type="dapp" dappMenu="Redeem"></Header>
      <div className="dappBg">
        <div className={`${styles.Redeem} ${"dappMain"}`}>
          <div className={styles.title}>
            <p>Redeem bitUSD for $wBTC</p>
            <span>1 bitUSD is always redeemable for $1 of collateral.</span>
          </div>
          <div className={styles.redeemMain}>
            <div className={styles.inputMain}>
              <div className="balance">
                <p>Redeem bitUSD</p>
                <span>Balance {formatNum(bitUSDbalance)} bitUSD</span>
              </div>
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
                </div>
                <span className="font_14 gray">bitUSD</span>
              </div>
              <div className="changeBalance" style={{ marginTop: "12px" }}>
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
            </div>
            <div className={styles.infoMain}>
              <div
                className={
                  amount && showRedeem
                    ? "button rightAngle height "
                    : "button rightAngle height disable"
                }
                onClick={() => Redeem()}
              >
                Redeem
              </div>
              <div
                className="button rightAngle height disable"
                onClick={() => Redeem()}
              >
                Redeem
              </div>
              <div className={styles.data} style={{ borderTop: "none" }}>
                <div className={styles.dataItem}>
                  <p>Collateral Price</p>
                  <span>${formatNum(wbtcPrice)}</span>
                </div>
                <div className={styles.dataItem}>
                  <p>Redemption Fee</p>
                  <span>{formatNum(fee * 100)}%</span>
                </div>
                <div className={styles.dataItem}>
                  <p>Redemption Fee Amount</p>
                  <span>{formatNum(feeAmount)} wBTC</span>
                </div>
                <div className={styles.dataItem}>
                  <p>Expected Collateral Received</p>
                  <span>{formatNum(expectedCollateralReceived)} wBTC</span>
                </div>
                <div className={styles.dataItem}>
                  <p>Value of Collateral Received</p>
                  <span>
                    ${formatNum(expectedCollateralReceived * wbtcPrice)}
                  </span>
                </div>
                <div className={styles.dataItem}>
                  <p>Actual Redemption Amount</p>
                  <span>{formatNum(amount)} bitUSD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {currentState ? <Wait></Wait> : null}
      <Footer></Footer>
    </>
  );
}
