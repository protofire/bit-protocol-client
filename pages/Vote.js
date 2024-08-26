import styles from "../styles/dapp.module.scss";
import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState, useContext, useRef } from "react";
import BigNumber from "bignumber.js";
import Wait from "../components/tooltip/wait";
import tooltip from "../components/tooltip";
import { UserContext } from "../hook/user";

export default function Vote() {
  const {
    account,
    currentState,
    setCurrentState,
    setCurrentWaitInfo,
    incentiveVotingMain,
    incentiveVotingQuery,
    tokenLockerQuery,
    boost,
    bitVaultQuery,
    formatNum,
    bitPrice,
  } = useContext(UserContext);
  const [openDebt, setOpenDebt] = useState(false);
  const [openbitUSD, setOpenbitUSD] = useState(false);
  const [openPool, setOpenPool] = useState(false);
  const [openBitLp, setOpenBitLp] = useState(false);
  const [openbitUSDLp, setOpenbitUSDLp] = useState(false);

  const onKeyDown = async (e) => {
    const invalidChars = ["-", "+", "e", "E"];
    if (invalidChars.indexOf(e.key) !== -1) {
      e.preventDefault();
    }
  };

  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [amount3, setAmount3] = useState("");
  const [amount4, setAmount4] = useState("");

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
  // const [registeredLocks, setRegisteredLocks] = useState(0);

  const queryData = async () => {
    if (account) {
      const locks = await tokenLockerQuery.getAccountActiveLocks(account, 26);
      setIsLocks(
        locks.lockData.length > 0 || Number(locks.frozenAmount._hex) > 0
          ? true
          : false
      );
      const accountBalances = await tokenLockerQuery.getAccountBalances(
        account
      );
      setAccountLock(
        Number(new BigNumber(accountBalances.locked._hex).toFixed()) +
          Number(new BigNumber(accountBalances.unlocked._hex).toFixed())
      );
      const accountWeight = await tokenLockerQuery.getAccountWeight(account);
      setAccountWeight(new BigNumber(accountWeight._hex).toFixed());
      const votes = await incentiveVotingQuery.getAccountCurrentVotes(account);
      setVotes(votes);
    }
    const getWeek = await bitVaultQuery.getWeek();
    setWeek(Number(getWeek._hex));

    const totalWeight = await tokenLockerQuery.getTotalWeight();
    setTotalWeight(new BigNumber(totalWeight._hex).toFixed());

    // const registeredLocks = await incentiveVotingQuery.getAccountRegisteredLocks(account);
    // console.log("locks--", registeredLocks)
    // setRegisteredLocks(Number(registeredLocks[0]._hex));

    const getTotalWeightAt = await incentiveVotingQuery.getTotalWeightAt(week);
    setTotalPoint(Number(getTotalWeightAt._hex));
    const currentWeeklyEmissions = await bitVaultQuery.weeklyEmissions(week);
    setCurrentWeeklyEmissions(Number(currentWeeklyEmissions._hex));
    setTotalWeightAtData({
      ...totalWeightAtData,
      current0: await getReceiverWeightAt(0, week),
      current1: await getReceiverWeightAt(1, week),
      current2: await getReceiverWeightAt(2, week),
      current3: await getReceiverWeightAt(3, week),
      current4: await getReceiverWeightAt(4, week),
    });
    if (week > 0) {
      const upperWeeklyEmissions = await bitVaultQuery.weeklyEmissions(
        week - 1
      );
      setUpperWeeklyEmissions(Number(upperWeeklyEmissions._hex));
      const getTotalWeightAtUpper = await incentiveVotingQuery.getTotalWeightAt(
        week - 1
      );
      setTotalPointUpper(
        Number(getTotalWeightAtUpper._hex) == 0
          ? 1
          : Number(getTotalWeightAtUpper._hex)
      );
      setTotalWeightAtData({
        ...totalWeightAtData,
        upper0: await getReceiverWeightAt(0, week - 1),
        upper1: await getReceiverWeightAt(1, week - 1),
        upper2: await getReceiverWeightAt(2, week - 1),
        upper3: await getReceiverWeightAt(3, week - 1),
        upper4: await getReceiverWeightAt(4, week - 1),
      });
    }
  };

  const [accountShare, setAccountShare] = useState(0);
  useEffect(() => {
    if (accountWeight && totalWeight) {
      setAccountShare((Number(accountWeight) / Number(totalWeight)) * 100);
    }
  }, [totalWeight, accountWeight]);

  let timerLoading = useRef(null);
  useEffect(() => {
    queryData();
    timerLoading.current = setInterval(() => {
      queryData();
    }, 2000);
    return () => clearInterval(timerLoading.current);
  }, [account]);

  const getReceiverWeightAt = async (id, week) => {
    const getTotalWeightAt = await incentiveVotingQuery.getReceiverWeightAt(
      id,
      week
    );
    return Number(getTotalWeightAt._hex) == 0
      ? 1
      : Number(getTotalWeightAt._hex);
  };

  const [votes0, setVotes0] = useState(0);
  const [votes1, setVotes1] = useState(0);
  const [votes2, setVotes2] = useState(0);
  const [votes3, setVotes3] = useState(0);
  const [votes4, setVotes4] = useState(0);
  useEffect(() => {
    if (votes) {
      votes.forEach((element) => {
        if (Number(element[0]._hex) == 0) {
          setVotes0(Number(element[1]._hex));
        }
        if (Number(element[0]._hex) == 1) {
          setVotes1(Number(element[1]._hex));
        }
        if (Number(element[0]._hex) == 2) {
          setVotes2(Number(element[1]._hex));
        }
        if (Number(element[0]._hex) == 3) {
          setVotes3(Number(element[1]._hex));
        }
        if (Number(element[0]._hex) == 4) {
          setVotes4(Number(element[1]._hex));
        }
      });
    }
  }, [votes]);

  const [Allocated, setAllocated] = useState(0);
  const [Remaining, setRemaining] = useState(100);
  useEffect(() => {
    // console.log(votes0, votes1, votes2, votes3, votes4)
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

  const [showVote, setShowVote] = useState(false);
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

  const Vote = async () => {
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
        data.push([0, Number(amount0)]);
      }
      if (Number(amount1) > 0) {
        data.push([1, Number(amount1)]);
      }
      if (Number(amount2) > 0) {
        data.push([2, Number(amount2)]);
      }
      if (Number(amount3) > 0) {
        data.push([3, Number(amount3)]);
      }
      if (Number(amount4) > 0) {
        data.push([4, Number(amount4)]);
      }

      const tx = await incentiveVotingMain.registerAccountWeightAndVote(
        account,
        26,
        data
      );
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
          <div className={styles.dataInfo2}>
            <div className={styles.value}>
              <span>Your Boost</span>
              <div>
                <p>{boost}x</p>
                {/* <span className={styles.span}>Up to 0.00 $bitGOV</span> */}
              </div>
            </div>
            <div className={styles.value}>
              <span>Locked bitGOV</span>
              <div>
                <p>{formatNum(accountLock)}</p>
                <span className={styles.span}>
                  ≈ ${formatNum(Number(accountLock) * bitPrice)}
                </span>
              </div>
            </div>
            <div className={styles.value}>
              <span>Your Vote Weight</span>
              <div>
                <p>{formatNum(accountWeight)}</p>
                <span className={styles.span}>of {formatNum(totalWeight)}</span>
              </div>
            </div>
            <div className={styles.value}>
              <span>Your share</span>
              <div>
                <p>{Number(accountShare.toFixed(2)).toLocaleString()}%</p>
                <span className={styles.span}>of allocated vote weight.</span>
              </div>
            </div>
          </div>
          <div className={styles.voteMain1}>
            <div className={styles.title}>
              <p>Governance & Emissions voting</p>
              <div>
                Incentivize liquidity to an action, such as minting bitUSD or
                lock bitGOV with a specific collateral. Learn more
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
                            (totalWeightAtData.upper1 / totalPointUpper) * 100
                          ).toFixed(2)}
                      %
                      <img
                        src="/dapp/right.svg"
                        alt="icon"
                        style={{ width: "10px" }}
                      />
                      <span>
                        {Number(
                          (totalWeightAtData.current1 / totalPoint) * 100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                    <div className={styles.center}>
                      {totalPointUpper <= 0
                        ? 0
                        : (upperWeeklyEmissions * totalWeightAtData.current1) /
                          totalPointUpper}
                      <img
                        src="/dapp/right.svg"
                        alt="icon"
                        style={{ width: "10px" }}
                      />
                      <span>
                        {(currentWeeklyEmissions * totalWeightAtData.current1) /
                          totalPoint}
                      </span>
                    </div>
                    {/* <div className={styles.center}>
                                            <img src='/dapp/round.svg' alt='icon' style={{ "width": "30px" }} />
                                        </div> */}
                    <div
                      className={styles.center}
                      style={openDebt ? { transform: "rotate(180deg)" } : null}
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
                    style={openbitUSD ? { background: "#111" } : null}
                    onClick={() => setOpenbitUSD(!openbitUSD)}
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
                            (totalWeightAtData.upper2 / totalPointUpper) * 100
                          ).toFixed(2)}
                      %
                      <img
                        src="/dapp/right.svg"
                        alt="icon"
                        style={{ width: "10px" }}
                      />
                      <span>
                        {Number(
                          (totalWeightAtData.current2 / totalPoint) * 100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                    <div className={styles.center}>
                      {totalPointUpper <= 0
                        ? 0
                        : (upperWeeklyEmissions * totalWeightAtData.current2) /
                          totalPointUpper}
                      <img
                        src="/dapp/right.svg"
                        alt="icon"
                        style={{ width: "10px" }}
                      />
                      <span>
                        {(currentWeeklyEmissions * totalWeightAtData.current2) /
                          totalPoint}
                      </span>
                    </div>
                    {/* <div className={styles.center}>
                                            <img src='/dapp/round.svg' alt='icon' style={{ "width": "30px" }} />
                                        </div> */}
                    <div
                      className={styles.center}
                      style={
                        openbitUSD ? { transform: "rotate(180deg)" } : null
                      }
                    >
                      <img
                        src="/dapp/arr_bottom.svg"
                        alt="icon"
                        style={{ width: "20px" }}
                      />
                    </div>
                  </div>

                  {openbitUSD ? (
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
                            (totalWeightAtData.upper0 / totalPointUpper) * 100
                          ).toFixed(2)}
                      %
                      <img
                        src="/dapp/right.svg"
                        alt="icon"
                        style={{ width: "10px" }}
                      />
                      <span>
                        {Number(
                          (totalWeightAtData.current0 / totalPoint) * 100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                    <div className={styles.center}>
                      {totalPointUpper <= 0
                        ? 0
                        : (upperWeeklyEmissions * totalWeightAtData.current0) /
                          totalPointUpper}
                      <img
                        src="/dapp/right.svg"
                        alt="icon"
                        style={{ width: "10px" }}
                      />
                      <span>
                        {(currentWeeklyEmissions * totalWeightAtData.current0) /
                          totalPoint}
                      </span>
                    </div>
                    {/* <div className={styles.center}>
                                            <img src='/dapp/round.svg' alt='icon' style={{ "width": "30px" }} />
                                        </div> */}
                    <div
                      className={styles.center}
                      style={openPool ? { transform: "rotate(180deg)" } : null}
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
                    style={openBitLp ? { background: "#111" } : null}
                    onClick={() => setOpenBitLp(!openBitLp)}
                  >
                    <div>
                      <img src="/dapp/bitAwbtc.svg" alt="icon" />
                      bitGOV/wBTC LP
                    </div>
                    <div className={styles.center}>
                      {(votes3 / 100).toFixed(2)}%
                    </div>
                    <div className={styles.center}>
                      {totalPointUpper <= 0
                        ? 0
                        : Number(
                            (totalWeightAtData.upper3 / totalPointUpper) * 100
                          ).toFixed(2)}
                      %
                      <img
                        src="/dapp/right.svg"
                        alt="icon"
                        style={{ width: "10px" }}
                      />
                      <span>
                        {Number(
                          (totalWeightAtData.current3 / totalPoint) * 100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                    <div className={styles.center}>
                      {totalPointUpper <= 0
                        ? 0
                        : (upperWeeklyEmissions * totalWeightAtData.current3) /
                          totalPointUpper}
                      <img
                        src="/dapp/right.svg"
                        alt="icon"
                        style={{ width: "10px" }}
                      />
                      <span>
                        {(currentWeeklyEmissions * totalWeightAtData.current3) /
                          totalPoint}
                      </span>
                    </div>
                    <div
                      className={styles.center}
                      style={openBitLp ? { transform: "rotate(180deg)" } : null}
                    >
                      <img
                        src="/dapp/arr_bottom.svg"
                        alt="icon"
                        style={{ width: "20px" }}
                      />
                    </div>
                  </div>

                  {openBitLp ? (
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
                    style={openbitUSDLp ? { background: "#111" } : null}
                    onClick={() => setOpenbitUSDLp(!openbitUSDLp)}
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
                            (totalWeightAtData.upper4 / totalPointUpper) * 100
                          ).toFixed(2)}
                      %
                      <img
                        src="/dapp/right.svg"
                        alt="icon"
                        style={{ width: "10px" }}
                      />
                      <span>
                        {Number(
                          (totalWeightAtData.current4 / totalPoint) * 100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                    <div className={styles.center}>
                      {totalPointUpper <= 0
                        ? 0
                        : (upperWeeklyEmissions * totalWeightAtData.current4) /
                          totalPointUpper}
                      <img
                        src="/dapp/right.svg"
                        alt="icon"
                        style={{ width: "10px" }}
                      />
                      <span>
                        {(currentWeeklyEmissions * totalWeightAtData.current4) /
                          totalPoint}
                      </span>
                    </div>
                    <div
                      className={styles.center}
                      style={
                        openbitUSDLp ? { transform: "rotate(180deg)" } : null
                      }
                    >
                      <img
                        src="/dapp/arr_bottom.svg"
                        alt="icon"
                        style={{ width: "20px" }}
                      />
                    </div>
                  </div>

                  {openbitUSDLp ? (
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
              {/* <p className={styles.p}>Lock some $bitGOV to start voting</p> */}
              <p className={styles.p}>
                To participate in voting, a 26-week lock-up period is required.
              </p>
              <div
                className={
                  showVote
                    ? "button rightAngle height "
                    : "button rightAngle height disable"
                }
                onClick={() => Vote()}
              >
                VOTE
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
