import styles from "../styles/dapp.module.scss";
import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState, useContext, useRef, useCallback } from "react";
import BigNumber from "bignumber.js";
import Wait from "../components/tooltip/wait";
import tooltip from "../components/tooltip";
import Loading from "../components/tooltip/loading";
import { BlockchainContext } from "../hook/blockchain";
import { formatNumber, fromBigNumber } from "../utils/helpers";
import { useAccount } from "wagmi";

export default function Vote() {
  const account = useAccount();

  const {
    currentState,
    setCurrentState,
    setCurrentWaitInfo,
    boost,
    getAccountActiveLocks,
    accountUnlockAmount,
    accountLockAmount,
    userAccountWeight,
    systemWeek,
    lockTotalWeight,
    getTotalWeightAt,
    weeklyEmissions,
    getReceiverWeightAt,
    getAccountCurrentVotes,
    registerAccountWeightAndVote,
    signatureTrove,
    signatureToken,
  } = useContext(BlockchainContext);

  const vinePrice = 1;

  const [openDebt, setOpenDebt] = useState(false);
  const [openvUSD, setOpenvUSD] = useState(false);
  const [openPool, setOpenPool] = useState(false);
  const [openVineLp, setOpenVineLp] = useState(false);
  const [openvUSDLp, setOpenvUSDLp] = useState(false);
  const [isLocks, setIsLocks] = useState(false);
  const [accountLock, setAccountLock] = useState(0);
  const [week, setWeek] = useState(0);
  const [votes, setVotes] = useState(0);
  const [totalPoint, setTotalPoint] = useState(0);
  const [totalPointUpper, setTotalPointUpper] = useState(0);
  const [totalWeightAtData, setTotalWeightAtData] = useState({
    upper0: 0,
    current0: 0,
    upper1: 0,
    current1: 0,
    upper2: 0,
    current2: 0,
    upper3: 0,
    current3: 0,
    upper4: 0,
    current4: 0,
  });
  const [currentWeeklyEmissions, setCurrentWeeklyEmissions] = useState(0);
  const [upperWeeklyEmissions, setUpperWeeklyEmissions] = useState(0);
  const [accountWeight, setAccountWeight] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [amount3, setAmount3] = useState("");
  const [amount4, setAmount4] = useState("");
  const [accountShare, setAccountShare] = useState(0);
  const [votes0, setVotes0] = useState(0);
  const [votes1, setVotes1] = useState(0);
  const [votes2, setVotes2] = useState(0);
  const [votes3, setVotes3] = useState(0);
  const [votes4, setVotes4] = useState(0);
  const [Allocated, setAllocated] = useState(0);
  const [Remaining, setRemaining] = useState(100);
  const [showVote, setShowVote] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // const [registeredLocks, setRegisteredLocks] = useState(0);

  const onKeyDown = async (e) => {
    const invalidChars = ["-", "+", "e", "E"];
    if (invalidChars.indexOf(e.key) !== -1) {
      e.preventDefault();
    }
  };

  const changeAmount0 = async (e) => {
    const value = Number(e.target.value);
    setAmount0(value == 0 ? "" : value);
  };
  const changeAmount1 = async (e) => {
    const value = Number(e.target.value);
    setAmount1(value == 0 ? "" : value);
  };
  const changeAmount2 = async (e) => {
    const value = Number(e.target.value);
    setAmount2(value == 0 ? "" : value);
  };
  const changeAmount3 = async (e) => {
    const value = Number(e.target.value);
    setAmount3(value == 0 ? "" : value);
  };
  const changeAmount4 = async (e) => {
    const value = Number(e.target.value);
    setAmount4(value == 0 ? "" : value);
  };

  const queryData = useCallback(async () => {
    if (systemWeek && lockTotalWeight) {
      console.log("getting");
      const locks = await getAccountActiveLocks();
      setIsLocks(
        locks.lockData.amount > 0 || locks.frozenAmount > 0 ? true : false
      );
      setAccountLock(accountUnlockAmount + accountLockAmount);
      setAccountWeight(userAccountWeight);
      const votes = await getAccountCurrentVotes();
      setVotes(votes);
      setWeek(systemWeek);
      setTotalWeight(lockTotalWeight);

      const weightAt = await getTotalWeightAt();
      setTotalPoint(weightAt);
      const currentWeeklyEmissions = await weeklyEmissions();
      setCurrentWeeklyEmissions(fromBigNumber(currentWeeklyEmissions));
      setTotalWeightAtData({
        ...totalWeightAtData,
        current0: await getReceiverWeightAt(0, systemWeek),
        current1: await getReceiverWeightAt(1, systemWeek),
        current2: await getReceiverWeightAt(2, systemWeek),
        current3: await getReceiverWeightAt(3, systemWeek),
        current4: await getReceiverWeightAt(4, systemWeek),
      });
      if (systemWeek > 0) {
        const upperWeeklyEmissions = await weeklyEmissions(systemWeek - 1);
        setUpperWeeklyEmissions(fromBigNumber(upperWeeklyEmissions));
        const getTotalWeightAtUpper = await getTotalWeightAt(systemWeek - 1);
        setTotalPointUpper(getTotalWeightAtUpper);
        setTotalWeightAtData({
          ...totalWeightAtData,
          upper0: await getReceiverWeightAt(0, systemWeek - 1),
          upper1: await getReceiverWeightAt(1, systemWeek - 1),
          upper2: await getReceiverWeightAt(2, systemWeek - 1),
          upper3: await getReceiverWeightAt(3, systemWeek - 1),
          upper4: await getReceiverWeightAt(4, systemWeek - 1),
        });
      }
    }

    // const registeredLocks = await incentiveVotingQuery.getAccountRegisteredLocks(account);
    // console.log("locks--", registeredLocks)
    // setRegisteredLocks(Number(registeredLocks[0]));
  }, [systemWeek, lockTotalWeight]);

  useEffect(() => {
    if (accountWeight && totalWeight) {
      setAccountShare((Number(accountWeight) / Number(totalWeight)) * 100);
    }
  }, [totalWeight, accountWeight]);

  // let timerLoading = useRef(null);
  useEffect(() => {
    queryData();
  }, [systemWeek, lockTotalWeight]);

  useEffect(() => {
    setIsLoading(false);
    if (votes) {
      votes.forEach((element) => {
        if (Number(element.id) == 0) {
          setVotes0(Number(element.points));
        }
        if (Number(element.id) == 1) {
          setVotes1(Number(element.points));
        }
        if (Number(element.id) == 2) {
          setVotes2(Number(element.points));
        }
        if (Number(element.id) == 3) {
          setVotes3(Number(element.points));
        }
        if (Number(element.id) == 4) {
          setVotes4(Number(element.points));
        }
      });
    }
  }, [votes]);

  useEffect(() => {
    const myVotes = votes0 + votes1 + votes2 + votes3 + votes4;
    const value = (myVotes / 10000) * 100;
    setAllocated(value);
    setRemaining(100 - value);
  }, [votes0, votes1, votes2, votes3, votes4]);

  const startDate = () => {
    var currentDate = new Date();
    var currentDay = currentDate.getDay();
    var daysUntilThursday = 4 - currentDay;
    if (daysUntilThursday <= 0) {
      daysUntilThursday += 7;
    }
    var millisecondsInADay = 1000 * 60 * 60 * 24;
    var millisecondsUntilThursday = daysUntilThursday * millisecondsInADay;
    var nextThursdayDate = new Date(
      currentDate.getTime() + millisecondsUntilThursday
    );
    return nextThursdayDate.toDateString();
  };

  const countdown = () => {
    var currentDate = new Date();
    var currentDay = currentDate.getDay();
    var daysUntilThursday = 4 - currentDay;
    if (daysUntilThursday <= 0) {
      daysUntilThursday += 7;
    }
    var millisecondsInADay = 1000 * 60 * 60 * 24;
    var millisecondsUntilThursday = daysUntilThursday * millisecondsInADay;
    var nextThursdayDate = new Date(
      currentDate.getTime() + millisecondsUntilThursday
    );
    nextThursdayDate.setHours(8, 0, 0, 0);
    var timeUntilThursdayMorning = nextThursdayDate - currentDate;
    var remainingDays = Math.floor(
      timeUntilThursdayMorning / (1000 * 60 * 60 * 24)
    );
    var remainingHours = Math.floor(
      (timeUntilThursdayMorning % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var remainingMinutes = Math.floor(
      (timeUntilThursdayMorning % (1000 * 60 * 60)) / (1000 * 60)
    );
    return (
      remainingDays + "d " + remainingHours + "h " + remainingMinutes + "m"
    );
  };

  useEffect(() => {
    if (!isLocks) {
      setShowVote(false);
    } else if (
      !Number(amount0) &&
      !Number(amount1) &&
      !Number(amount2) &&
      !Number(amount3) &&
      !Number(amount4)
    ) {
      setShowVote(false);
    } else if (
      Number(amount0) +
        Number(amount1) +
        Number(amount2) +
        Number(amount3) +
        Number(amount4) >
      10000
    ) {
      setShowVote(false);
    } else {
      setShowVote(true);
    }
  }, [isLocks, amount0, amount1, amount2, amount3, amount4]);

  const vote = async () => {
    if (
      Number(amount0) +
        Number(amount1) +
        Number(amount2) +
        Number(amount3) +
        Number(amount4) >
      10000
    ) {
      tooltip.error({
        content: "Total amount of votes shouldn’t exceed 10,000.",
        duration: 3000,
      });
      return;
    }
    if (!showVote) {
      return;
    }
    try {
      let data = [];
      if (Number(amount0) > 0) {
        data.push([0, Number(amount0) * 100]);
      }
      if (Number(amount1) > 0) {
        data.push([1, Number(amount1) * 100]);
      }
      if (Number(amount2) > 0) {
        data.push([2, Number(amount2) * 100]);
      }
      if (Number(amount3) > 0) {
        data.push([3, Number(amount3) * 100]);
      }
      if (Number(amount4) > 0) {
        data.push([4, Number(amount4) * 100]);
      }

      const tx = await registerAccountWeightAndVote(data);
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

  return (
    <>
      <Header type="dapp" dappMenu="Vote"></Header>
      <div className="dappBg">
        <div className={`${styles.Vote} ${"dappMain3"}`}>
          {account.status !== "connected" ? (
            <div className={`${styles.Earn} ${"dappMain2"}`}>
              <h2 style={{ textAlign: "center" }}>
                Please connect your wallet
              </h2>
            </div>
          ) : (
            <>
              <div className={styles.dataInfo2}>
                <div className={styles.value}>
                  <span>Your Boost</span>
                  <div>
                    <p>{boost}x</p>
                    {/* <span className={styles.span}>Up to 0.00 $VINE</span> */}
                  </div>
                </div>
                <div className={styles.value}>
                  <span>Locked bitGOV</span>
                  <div>
                    <p>{formatNumber(accountLock)}</p>
                    <span className={styles.span}>
                      ≈ ${formatNumber(Number(accountLock) * vinePrice)}
                    </span>
                  </div>
                </div>
                <div className={styles.value}>
                  <span>Your Vote Weight</span>
                  <div>
                    <p>{formatNumber(accountWeight)}</p>
                    <span className={styles.span}>
                      of {formatNumber(totalWeight)}
                    </span>
                  </div>
                </div>
                <div className={styles.value}>
                  <span>Your share</span>
                  <div>
                    <p>{Number(accountShare.toFixed(2)).toLocaleString()}%</p>
                    <span className={styles.span}>
                      of allocated vote weight.
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.voteMain1}>
                <div className={styles.title}>
                  <p>Governance & Emissions voting</p>
                  <div>
                    Incentivize liquidity to an action, such as minting bitUSD
                    or lock bitGOV with a specific collateral. Learn more
                  </div>
                </div>
                <div className={`${styles.dataInfo2} ${styles.voteData}`}>
                  <div className={styles.value}>
                    <span>Current emissions week:</span>
                    <div>
                      <p>{week}</p>
                    </div>
                  </div>
                  <div className={styles.value}>
                    <span>Epoch ending:</span>
                    <div>
                      <p>{countdown()}</p>
                      <span className={styles.span}>{startDate()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.voteMain2}>
                <div className={styles.topMain}>
                  <div className={styles.left}>
                    <div className="button_Mini active">Emissions</div>
                    {/* <div className='button_Mini'>Proposals</div> */}
                  </div>
                  <div className={styles.right}>
                    <p>
                      Allocated<span>{Allocated}%</span>
                    </p>
                    <p>
                      Remaining<span>{Remaining}%</span>
                    </p>
                  </div>
                </div>
                <div className={styles.h5Tab}>
                  <div className={styles.tabMain}>
                    <div className={styles.tabItem}>
                      <div>Pool</div>
                      <div className={styles.center}>My Votes</div>
                      <div className={styles.center}>Votes</div>
                      <div className={styles.center}>
                        Estimated bitGOV Emissions
                      </div>
                      {/* <div className={styles.center}>Vote Ratio</div> */}
                      <div></div>
                    </div>

                    <div className={styles.tab}>
                      <div
                        className={`${styles.tabItem} ${styles.tabItem2}`}
                        style={openDebt ? { background: "#111" } : null}
                        onClick={() => setOpenDebt(!openDebt)}
                      >
                        <div>
                          <img src="/dapp/bitUSD.svg" alt="icon" />
                          bitUSD Debt
                        </div>
                        <div className={styles.center}>
                          {(votes1 / 100).toFixed(2)}%
                        </div>
                        <div className={styles.center}>
                          {totalPointUpper <= 0
                            ? 0
                            : Number(
                                (totalWeightAtData.upper1 / totalPointUpper) *
                                  100
                              ).toFixed(2)}
                          %
                          <img
                            src="/dapp/right.svg"
                            alt="icon"
                            style={{ width: "10px" }}
                          />
                          <span>
                            {isFinite(
                              Number(
                                (totalWeightAtData.current1 / totalPoint) * 100
                              )
                            )
                              ? Number(
                                  (totalWeightAtData.current1 / totalPoint) *
                                    100
                                ).toFixed(2)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className={styles.center}>
                          {totalPointUpper <= 0
                            ? 0
                            : (upperWeeklyEmissions *
                                totalWeightAtData.current1) /
                              totalPointUpper}
                          <img
                            src="/dapp/right.svg"
                            alt="icon"
                            style={{ width: "10px" }}
                          />
                          <span>
                            {isFinite(
                              (currentWeeklyEmissions *
                                totalWeightAtData.current1) /
                                totalPoint
                            )
                              ? formatNumber(
                                  (currentWeeklyEmissions *
                                    totalWeightAtData.current1) /
                                    totalPoint
                                )
                              : 0}
                          </span>
                        </div>
                        {/* <div className={styles.center}>
                                            <img src='/dapp/round.svg' alt='icon' style={{ "width": "30px" }} />
                                        </div> */}
                        <div
                          className={styles.center}
                          style={
                            openDebt ? { transform: "rotate(180deg)" } : null
                          }
                        >
                          <img
                            src="/dapp/arr_bottom.svg"
                            alt="icon"
                            style={{ width: "20px" }}
                          />
                        </div>
                      </div>

                      {openDebt ? (
                        <div className={styles.main}>
                          <div className={styles.action}>
                            <span>Action</span>
                            <p>Debt</p>
                          </div>
                          <div className={styles.enter}>
                            <span>Enter a percentage</span>
                            <div className={styles.input}>
                              <div className="inputTxt">
                                <input
                                  type="number"
                                  placeholder="0"
                                  onWheel={(e) => e.target.blur()}
                                  id="amount1"
                                  onKeyDown={onKeyDown.bind(this)}
                                  onChange={changeAmount1.bind(this)}
                                  value={amount1}
                                ></input>
                              </div>
                            </div>
                            {/* <span>My previous vote: 0.0%</span> */}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className={styles.tab}>
                      <div
                        className={`${styles.tabItem} ${styles.tabItem2}`}
                        style={openvUSD ? { background: "#111" } : null}
                        onClick={() => setOpenvUSD(!openvUSD)}
                      >
                        <div>
                          <img src="/dapp/bitUSD.svg" alt="icon" />
                          bitUSD Minting
                        </div>
                        <div className={styles.center}>
                          {(votes2 / 100).toFixed(2)}%
                        </div>
                        <div className={styles.center}>
                          {totalPointUpper <= 0
                            ? 0
                            : Number(
                                (totalWeightAtData.upper2 / totalPointUpper) *
                                  100
                              ).toFixed(2)}
                          %
                          <img
                            src="/dapp/right.svg"
                            alt="icon"
                            style={{ width: "10px" }}
                          />
                          <span>
                            {isFinite(
                              Number(
                                (totalWeightAtData.current2 / totalPoint) * 100
                              )
                            )
                              ? Number(
                                  (totalWeightAtData.current2 / totalPoint) *
                                    100
                                ).toFixed(2)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className={styles.center}>
                          {totalPointUpper <= 0
                            ? 0
                            : (upperWeeklyEmissions *
                                totalWeightAtData.current2) /
                              totalPointUpper}
                          <img
                            src="/dapp/right.svg"
                            alt="icon"
                            style={{ width: "10px" }}
                          />
                          <span>
                            {isFinite(
                              (currentWeeklyEmissions *
                                totalWeightAtData.current2) /
                                totalPoint
                            )
                              ? formatNumber(
                                  (currentWeeklyEmissions *
                                    totalWeightAtData.current2) /
                                    totalPoint
                                )
                              : 0}
                          </span>
                        </div>
                        {/* <div className={styles.center}>
                                            <img src='/dapp/round.svg' alt='icon' style={{ "width": "30px" }} />
                                        </div> */}
                        <div
                          className={styles.center}
                          style={
                            openvUSD ? { transform: "rotate(180deg)" } : null
                          }
                        >
                          <img
                            src="/dapp/arr_bottom.svg"
                            alt="icon"
                            style={{ width: "20px" }}
                          />
                        </div>
                      </div>

                      {openvUSD ? (
                        <div className={styles.main}>
                          <div className={styles.action}>
                            <span>Action</span>
                            <p>Mint</p>
                          </div>
                          <div className={styles.enter}>
                            <span>Enter a percentage</span>
                            <div className={styles.input}>
                              <div className="inputTxt">
                                <input
                                  type="number"
                                  placeholder="0"
                                  onWheel={(e) => e.target.blur()}
                                  id="amount2"
                                  onKeyDown={onKeyDown.bind(this)}
                                  onChange={changeAmount2.bind(this)}
                                  value={amount2}
                                ></input>
                              </div>
                            </div>
                            {/* <span>My previous vote: 0.0%</span> */}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className={styles.tab}>
                      <div
                        className={`${styles.tabItem} ${styles.tabItem2}`}
                        style={openPool ? { background: "#111" } : null}
                        onClick={() => setOpenPool(!openPool)}
                      >
                        <div>
                          <img src="/dapp/bitUSD.svg" alt="icon" />
                          Stability Pool
                        </div>
                        <div className={styles.center}>
                          {(votes0 / 100).toFixed(2)}%
                        </div>
                        <div className={styles.center}>
                          {totalPointUpper <= 0
                            ? 0
                            : Number(
                                (totalWeightAtData.upper0 / totalPointUpper) *
                                  100
                              ).toFixed(2)}
                          %
                          <img
                            src="/dapp/right.svg"
                            alt="icon"
                            style={{ width: "10px" }}
                          />
                          <span>
                            {isFinite(
                              Number(
                                (totalWeightAtData.current0 / totalPoint) * 100
                              )
                            )
                              ? Number(
                                  (totalWeightAtData.current0 / totalPoint) *
                                    100
                                ).toFixed(2)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className={styles.center}>
                          {totalPointUpper <= 0
                            ? 0
                            : (upperWeeklyEmissions *
                                totalWeightAtData.current0) /
                              totalPointUpper}
                          <img
                            src="/dapp/right.svg"
                            alt="icon"
                            style={{ width: "10px" }}
                          />
                          <span>
                            {isFinite(
                              (currentWeeklyEmissions *
                                totalWeightAtData.current0) /
                                totalPoint
                            )
                              ? formatNumber(
                                  (currentWeeklyEmissions *
                                    totalWeightAtData.current0) /
                                    totalPoint
                                )
                              : 0}
                          </span>
                        </div>
                        {/* <div className={styles.center}>
                                            <img src='/dapp/round.svg' alt='icon' style={{ "width": "30px" }} />
                                        </div> */}
                        <div
                          className={styles.center}
                          style={
                            openPool ? { transform: "rotate(180deg)" } : null
                          }
                        >
                          <img
                            src="/dapp/arr_bottom.svg"
                            alt="icon"
                            style={{ width: "20px" }}
                          />
                        </div>
                      </div>

                      {openPool ? (
                        <div className={styles.main}>
                          <div className={styles.action}>
                            <span>Action</span>
                            <p>Deposit</p>
                          </div>
                          <div className={styles.enter}>
                            <span>Enter a percentage</span>
                            <div className={styles.input}>
                              <div className="inputTxt">
                                <input
                                  type="number"
                                  placeholder="0"
                                  onWheel={(e) => e.target.blur()}
                                  id="amount0"
                                  onKeyDown={onKeyDown.bind(this)}
                                  onChange={changeAmount0.bind(this)}
                                  value={amount0}
                                ></input>
                              </div>
                            </div>
                            {/* <span>My previous vote: 0.0%</span> */}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className={styles.tab}>
                      <div
                        className={`${styles.tabItem} ${styles.tabItem2}`}
                        style={openVineLp ? { background: "#111" } : null}
                        onClick={() => setOpenVineLp(!openVineLp)}
                      >
                        <div>
                          <img src="/dapp/vineArose.svg" alt="icon" />
                          bitGOV/ROSE LP
                        </div>
                        <div className={styles.center}>
                          {(votes3 / 100).toFixed(2)}%
                        </div>
                        <div className={styles.center}>
                          {totalPointUpper <= 0
                            ? 0
                            : Number(
                                (totalWeightAtData.upper3 / totalPointUpper) *
                                  100
                              ).toFixed(2)}
                          %
                          <img
                            src="/dapp/right.svg"
                            alt="icon"
                            style={{ width: "10px" }}
                          />
                          <span>
                            {isFinite(
                              Number(
                                (totalWeightAtData.current3 / totalPoint) * 100
                              )
                            )
                              ? Number(
                                  (totalWeightAtData.current3 / totalPoint) *
                                    100
                                ).toFixed(2)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className={styles.center}>
                          {totalPointUpper <= 0
                            ? 0
                            : (upperWeeklyEmissions *
                                totalWeightAtData.current3) /
                              totalPointUpper}
                          <img
                            src="/dapp/right.svg"
                            alt="icon"
                            style={{ width: "10px" }}
                          />
                          <span>
                            {isFinite(
                              (currentWeeklyEmissions *
                                totalWeightAtData.current3) /
                                totalPoint
                            )
                              ? formatNumber(
                                  (currentWeeklyEmissions *
                                    totalWeightAtData.current3) /
                                    totalPoint
                                )
                              : 0}
                          </span>
                        </div>
                        <div
                          className={styles.center}
                          style={
                            openVineLp ? { transform: "rotate(180deg)" } : null
                          }
                        >
                          <img
                            src="/dapp/arr_bottom.svg"
                            alt="icon"
                            style={{ width: "20px" }}
                          />
                        </div>
                      </div>

                      {openVineLp ? (
                        <div className={styles.main}>
                          <div className={styles.action}>
                            <span>Action</span>
                            <p>Default</p>
                          </div>
                          <div className={styles.enter}>
                            <span>Enter a percentage</span>
                            <div className={styles.input}>
                              <div className="inputTxt">
                                <input
                                  type="number"
                                  placeholder="0"
                                  onWheel={(e) => e.target.blur()}
                                  id="amount3"
                                  onKeyDown={onKeyDown.bind(this)}
                                  onChange={changeAmount3.bind(this)}
                                  value={amount3}
                                ></input>
                              </div>
                            </div>
                            {/* <span>My previous vote: 0.0%</span> */}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className={styles.tab}>
                      <div
                        className={`${styles.tabItem} ${styles.tabItem2}`}
                        style={openvUSDLp ? { background: "#111" } : null}
                        onClick={() => setOpenvUSDLp(!openvUSDLp)}
                      >
                        <div>
                          <img src="/dapp/usdc.svg" alt="icon" />
                          bitUSD/USDC LP
                        </div>
                        <div className={styles.center}>
                          {(votes4 / 100).toFixed(2)}%
                        </div>
                        <div className={styles.center}>
                          {totalPointUpper <= 0
                            ? 0
                            : Number(
                                (totalWeightAtData.upper4 / totalPointUpper) *
                                  100
                              ).toFixed(2)}
                          %
                          <img
                            src="/dapp/right.svg"
                            alt="icon"
                            style={{ width: "10px" }}
                          />
                          <span>
                            {isFinite(
                              Number(
                                (totalWeightAtData.current4 / totalPoint) * 100
                              )
                            )
                              ? Number(
                                  (totalWeightAtData.current4 / totalPoint) *
                                    100
                                ).toFixed(2)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className={styles.center}>
                          {totalPointUpper <= 0
                            ? 0
                            : (upperWeeklyEmissions *
                                totalWeightAtData.current4) /
                              totalPointUpper}
                          <img
                            src="/dapp/right.svg"
                            alt="icon"
                            style={{ width: "10px" }}
                          />
                          <span>
                            {isFinite(
                              (currentWeeklyEmissions *
                                totalWeightAtData.current4) /
                                totalPoint
                            )
                              ? formatNumber(
                                  (currentWeeklyEmissions *
                                    totalWeightAtData.current4) /
                                    totalPoint
                                )
                              : 0}
                          </span>
                        </div>
                        <div
                          className={styles.center}
                          style={
                            openvUSDLp ? { transform: "rotate(180deg)" } : null
                          }
                        >
                          <img
                            src="/dapp/arr_bottom.svg"
                            alt="icon"
                            style={{ width: "20px" }}
                          />
                        </div>
                      </div>

                      {openvUSDLp ? (
                        <div className={styles.main}>
                          <div className={styles.action}>
                            <span>Action</span>
                            <p>Default</p>
                          </div>
                          <div className={styles.enter}>
                            <span>Enter a percentage</span>
                            <div className={styles.input}>
                              <div className="inputTxt">
                                <input
                                  type="number"
                                  placeholder="0"
                                  onWheel={(e) => e.target.blur()}
                                  id="amount4"
                                  onKeyDown={onKeyDown.bind(this)}
                                  onChange={changeAmount4.bind(this)}
                                  value={amount4}
                                ></input>
                              </div>
                            </div>
                            {/* <span>My previous vote: 0.0%</span> */}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className={styles.button}>
                  {/* <p className={styles.p}>Lock some $VINE to start voting</p> */}
                  <p className={styles.p}>
                    To participate in voting, a 26-week lock-up period is
                    required.
                  </p>
                  <div
                    className={
                      showVote
                        ? "button rightAngle height "
                        : "button rightAngle height disable"
                    }
                    onClick={() => vote()}
                  >
                    VOTE
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {currentState ? <Wait></Wait> : null}
      {isLoading &&
      account.status === "connected" &&
      signatureToken?.user &&
      signatureTrove?.user ? (
        <Loading></Loading>
      ) : null}
      <Footer></Footer>
    </>
  );
}
