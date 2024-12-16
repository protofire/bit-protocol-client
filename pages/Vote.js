import styles from "../styles/dapp.module.scss";
import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import Wait from "../components/tooltip/wait";
import tooltip from "../components/tooltip";
import Loading from "../components/tooltip/loading";
import { BlockchainContext } from "../hook/blockchain";
import { formatNumber, fromBigNumber } from "../utils/helpers";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

export default function Vote() {
  // const account = useAccount();
  // const {
  //   currentState,
  //   setCurrentState,
  //   setCurrentWaitInfo,
  //   boost,
  //   getAccountActiveLocks,
  //   accountUnlockAmount,
  //   accountLockAmount,
  //   userAccountWeight,
  //   systemWeek,
  //   lockTotalWeight,
  //   getTotalWeightAt,
  //   weeklyEmissions,
  //   getReceiverWeightAt,
  //   getAccountCurrentVotes,
  //   registerAccountWeightAndVote,
  //   signatureTrove,
  //   signatureToken,
  // } = useContext(BlockchainContext);

  // const [openDebt, setOpenDebt] = useState(false);
  // const [openvUSD, setOpenvUSD] = useState(false);
  // const [openPool, setOpenPool] = useState(false);
  // const [openVineLp, setOpenVineLp] = useState(false);
  // const [openvUSDLp, setOpenvUSDLp] = useState(false);

  // const vinePrice = 1;

  // const startDate = () => {
  //   var currentDate = new Date();
  //   var currentDay = currentDate.getDay();
  //   var daysUntilThursday = 4 - currentDay;
  //   if (daysUntilThursday <= 0) {
  //     daysUntilThursday += 7;
  //   }
  //   var millisecondsInADay = 1000 * 60 * 60 * 24;
  //   var millisecondsUntilThursday = daysUntilThursday * millisecondsInADay;
  //   var nextThursdayDate = new Date(
  //     currentDate.getTime() + millisecondsUntilThursday
  //   );
  //   return nextThursdayDate.toDateString();
  // };

  // const countdown = () => {
  //   var currentDate = new Date();
  //   var currentDay = currentDate.getDay();
  //   var daysUntilThursday = 4 - currentDay;
  //   if (daysUntilThursday <= 0) {
  //     daysUntilThursday += 7;
  //   }
  //   var millisecondsInADay = 1000 * 60 * 60 * 24;
  //   var millisecondsUntilThursday = daysUntilThursday * millisecondsInADay;
  //   var nextThursdayDate = new Date(
  //     currentDate.getTime() + millisecondsUntilThursday
  //   );
  //   nextThursdayDate.setHours(8, 0, 0, 0);
  //   var timeUntilThursdayMorning = nextThursdayDate - currentDate;
  //   var remainingDays = Math.floor(
  //     timeUntilThursdayMorning / (1000 * 60 * 60 * 24)
  //   );
  //   var remainingHours = Math.floor(
  //     (timeUntilThursdayMorning % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  //   );
  //   var remainingMinutes = Math.floor(
  //     (timeUntilThursdayMorning % (1000 * 60 * 60)) / (1000 * 60)
  //   );
  //   return (
  //     remainingDays + "d " + remainingHours + "h " + remainingMinutes + "m"
  //   );
  // };

  // const onKeyDown = (e) => {
  //   const invalidChars = ["-", "+", "e", "E"];
  //   if (invalidChars.includes(e.key)) {
  //     e.preventDefault();
  //   }
  // };

  // // Group vote-related state
  // const [voteState, setVoteState] = useState({
  //   isLocks: false,
  //   accountLock: 0,
  //   week: 0,
  //   votes: {
  //     votes0: 0,
  //     votes1: 0,
  //     votes2: 0,
  //     votes3: 0,
  //     votes4: 0,
  //   },
  //   amounts: {
  //     amount0: "",
  //     amount1: "",
  //     amount2: "",
  //     amount3: "",
  //     amount4: "",
  //   },
  // });

  // // Group weight-related state
  // const [weightState, setWeightState] = useState({
  //   totalPoint: 0,
  //   totalPointUpper: 0,
  //   totalWeightAtData: {
  //     upper0: 0,
  //     current0: 0,
  //     upper1: 0,
  //     current1: 0,
  //     upper2: 0,
  //     current2: 0,
  //     upper3: 0,
  //     current3: 0,
  //     upper4: 0,
  //     current4: 0,
  //   },
  //   currentWeeklyEmissions: 0,
  //   upperWeeklyEmissions: 0,
  // });

  // const [isLoading, setIsLoading] = useState(true);
  // const [showVote, setShowVote] = useState(false);

  // const calculatedValues = useMemo(() => {
  //   const { votes } = voteState;
  //   const {
  //     totalPoint,
  //     totalPointUpper,
  //     totalWeightAtData,
  //     currentWeeklyEmissions,
  //     upperWeeklyEmissions,
  //   } = weightState;

  //   // Ensure safe percentage calculations for votes
  //   const votesPercentage = Object.keys(votes).reduce(
  //     (acc, key) => ({
  //       ...acc,
  //       [key]: votes[key] ? (votes[key] / 100).toFixed(2) : "0.00", // Default to "0.00" if no value
  //     }),
  //     {}
  //   );

  //   const emissions = {
  //     current: {},
  //     upper: {},
  //   };

  //   for (let i = 0; i < 5; i++) {
  //     // Handle current emissions calculations
  //     emissions.current[`current${i}`] = isFinite(
  //       (currentWeeklyEmissions * totalWeightAtData[`current${i}`]) / totalPoint
  //     )
  //       ? formatNumber(
  //           (currentWeeklyEmissions * totalWeightAtData[`current${i}`]) /
  //             totalPoint
  //         )
  //       : "0";

  //     // Handle upper emissions calculations with proper default
  //     emissions.upper[`upper${i}`] =
  //       totalPointUpper <= 0
  //         ? "0"
  //         : isFinite(
  //             (upperWeeklyEmissions * totalWeightAtData[`current${i}`]) /
  //               totalPointUpper
  //           )
  //         ? formatNumber(
  //             (upperWeeklyEmissions * totalWeightAtData[`current${i}`]) /
  //               totalPointUpper
  //           )
  //         : "0";
  //   }

  //   // Calculate allocated and remaining percentages
  //   const totalVotes = Object.values(votes).reduce(
  //     (sum, vote) => sum + (Number(vote) || 0),
  //     0
  //   );
  //   const Allocated = ((totalVotes / 10000) * 100).toFixed(2);
  //   const Remaining = (100 - (totalVotes / 10000) * 100).toFixed(2);

  //   return {
  //     votesPercentage,
  //     emissions,
  //     Allocated: isNaN(Allocated) ? "0.00" : Allocated,
  //     Remaining: isNaN(Remaining) ? "100.00" : Remaining,
  //   };
  // }, [voteState.votes, weightState]);

  // const queryData = useCallback(async () => {
  //   if ((!systemWeek && systemWeek !== 0) || !lockTotalWeight) return;
  //   try {
  //     const locks = await getAccountActiveLocks();
  //     const votes = await getAccountCurrentVotes();
  //     const weightAt = await getTotalWeightAt();
  //     const currentWeeklyEmissions = await weeklyEmissions();

  //     // Process votes data
  //     const processedVotes = votes?.reduce(
  //       (acc, vote) => {
  //         acc[`votes${vote.id}`] = Number(vote.points);
  //         return acc;
  //       },
  //       { votes0: 0, votes1: 0, votes2: 0, votes3: 0, votes4: 0 }
  //     );

  //     // Update vote state
  //     setVoteState((prev) => ({
  //       ...prev,
  //       isLocks: locks.lockData.amount > 0 || locks.frozenAmount > 0,
  //       accountLock: accountUnlockAmount + accountLockAmount,
  //       week: systemWeek,
  //       votes: processedVotes,
  //     }));

  //     const newWeightData = {
  //       totalPoint: weightAt,
  //       currentWeeklyEmissions: fromBigNumber(currentWeeklyEmissions),
  //       totalWeightAtData: { ...weightState.totalWeightAtData },
  //     };

  //     for (let i = 0; i < 5; i++) {
  //       newWeightData.totalWeightAtData[`current${i}`] =
  //         await getReceiverWeightAt(i, systemWeek);
  //     }

  //     if (systemWeek > 0) {
  //       const upperEmissions = await weeklyEmissions(systemWeek - 1);
  //       const upperWeight = await getTotalWeightAt(systemWeek - 1);

  //       newWeightData.upperWeeklyEmissions = fromBigNumber(upperEmissions);
  //       newWeightData.totalPointUpper = upperWeight;

  //       for (let i = 0; i < 5; i++) {
  //         newWeightData.totalWeightAtData[`upper${i}`] =
  //           await getReceiverWeightAt(i, systemWeek - 1);
  //       }
  //     }

  //     setWeightState(newWeightData);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setIsLoading(false);
  //   }
  // }, [systemWeek, lockTotalWeight]);

  // const blockchainHelpers = {
  //   // Convert human readable amount to blockchain format (multiplied by 10^3)
  //   toBlockchainFormat: (amount) => {
  //     try {
  //       if (!amount || amount === "") return "0";

  //       return ethers.utils.parseUnits(amount.toString(), 3);
  //     } catch (error) {
  //       console.error("Error converting to blockchain format:", error);
  //       throw new Error("Invalid amount format");
  //     }
  //   },

  //   fromBlockchainFormat: (amount) => {
  //     try {
  //       return ethers.utils.formatUnits(amount, 3);
  //     } catch (error) {
  //       console.error("Error converting from blockchain format:", error);
  //       return "0";
  //     }
  //   },

  //   // Limit to two decimal places because of SC limitations
  //   isValidDecimal: (value) => {
  //     if (value === "" || value === undefined) return true;
  //     return /^\d*\.?\d{0,2}$/.test(value);
  //   },

  //   // Limit to two decimal places because of SC limitations
  //   enforceDecimals: (value) => {
  //     if (value === "" || !value.includes(".")) return value;
  //     const parts = value.split(".");
  //     return `${parts[0]}.${parts[1].slice(0, 2)}`;
  //   },
  // };

  // const createBlockchainInputHandler =
  //   (setState, maxValue = 100) =>
  //   (e) => {
  //     let value = e.target.value;

  //     if (value === "") {
  //       setState("");
  //       return;
  //     }

  //     if (!/^\d*\.?\d*$/.test(value)) return;

  //     value = blockchainHelpers.enforceDecimals(value);

  //     const numValue = Number(value);

  //     if (!isNaN(numValue) && numValue >= 0) {
  //       if (numValue <= maxValue) {
  //         setState(value);
  //       } else {
  //         setState(maxValue.toString());
  //       }
  //     }
  //   };

  // const handleAmountChange = (index) => (e) => {
  //   const value = e.target.value;

  //   if (!/^\d*\.?\d{0,2}$/.test(value)) {
  //     return;
  //   }

  //   // Allow empty string or valid numbers including zero
  //   if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
  //     setVoteState((prev) => ({
  //       ...prev,
  //       amounts: {
  //         ...prev.amounts,
  //         [`amount${index}`]: value,
  //       },
  //     }));
  //   }
  // };

  // const handleVote = async () => {
  //   const totalVotes = Object.values(voteState.amounts).reduce(
  //     (sum, amount) => sum + (amount === "" ? 0 : Number(amount)),
  //     0
  //   );

  //   if (totalVotes > 100) {
  //     tooltip.error({
  //       content: "Total amount of votes shouldn't exceed 10,000.",
  //       duration: 3000,
  //     });
  //     return;
  //   }

  //   try {
  //     // Include all votes, including zeros
  //     const voteData = Object.entries(voteState.amounts).map(
  //       ([key, amount]) => {
  //         const amountValue = amount === "" ? 0 : Number(amount);
  //         const points = Math.floor(amountValue * 100);
  //         return [Number(key.slice(-1)), points];
  //       }
  //     );

  //     setCurrentWaitInfo({
  //       type: "loading",
  //       info: "Processing vote submission",
  //     });
  //     setCurrentState(true);

  //     const tx = await registerAccountWeightAndVote(voteData);
  //     const result = await tx.wait();

  //     setCurrentState(false);

  //     if (result.status === 0) {
  //       tooltip.error({
  //         content: "Transaction failed. Please refresh and try again.",
  //         duration: 5000,
  //       });
  //     } else {
  //       tooltip.success({
  //         content: "Vote submitted successfully",
  //         duration: 5000,
  //       });
  //       await queryData();
  //     }
  //   } catch (error) {
  //     console.error("Vote error:", error);
  //     setCurrentState(false);

  //     let errorMessage = "Voting failed. Please try again.";
  //     if (error.error && error.error.message) {
  //       errorMessage = error.error.message
  //         .replace("execution reverted: ", "")
  //         .replace("VM Exception while processing transaction: revert ", "");
  //     }

  //     tooltip.error({
  //       content: "Transaction failed. Please refresh and try again.",
  //       duration: 5000,
  //     });
  //   }
  // };

  // useEffect(() => {
  //   queryData();
  //   const interval = setInterval(queryData, 30000);
  //   return () => clearInterval(interval);
  // }, [queryData]);

  // useEffect(() => {
  //   const totalAmount = Object.values(voteState.amounts).reduce(
  //     (sum, amount) => sum + (amount === "" ? 0 : Number(amount)),
  //     0
  //   );
  //   // Only check if the user has locks and total amount is within range (including zero)
  //   setShowVote(voteState.isLocks && totalAmount <= 100);
  // }, [voteState.amounts, voteState.isLocks]);

  // return (
  //   <>
  //     <Header type="dapp" dappMenu="Vote" />
  //     <div className="dappBg">
  //       <div className={`${styles.Vote} dappMain3`}>
  //         {account.status !== "connected" ? (
  //           <div className={`${styles.Earn} dappMain2`}>
  //             <h2 style={{ textAlign: "center" }}>
  //               Please connect your wallet
  //             </h2>
  //           </div>
  //         ) : (
  //           <>
  //             <div className={styles.dataInfo2}>
  //               <div className={styles.value}>
  //                 <span>Your Boost</span>
  //                 <div>
  //                   <p>{boost}x</p>
  //                 </div>
  //               </div>
  //               <div className={styles.value}>
  //                 <span>Locked bitGOV</span>
  //                 <div>
  //                   <p>{formatNumber(voteState.accountLock)}</p>
  //                   <span className={styles.span}>
  //                     ≈ $
  //                     {formatNumber(Number(voteState.accountLock) * vinePrice)}
  //                   </span>
  //                 </div>
  //               </div>
  //               <div className={styles.value}>
  //                 <span>Your Vote Weight</span>
  //                 <div>
  //                   <p>{formatNumber(userAccountWeight)}</p>
  //                   <span className={styles.span}>
  //                     of {formatNumber(lockTotalWeight)}
  //                   </span>
  //                 </div>
  //               </div>
  //               <div className={styles.value}>
  //                 <span>Your share</span>
  //                 <div>
  //                   <p>
  //                     {Number(
  //                       (
  //                         (Number(userAccountWeight) /
  //                           Number(lockTotalWeight)) *
  //                         100
  //                       ).toFixed(2)
  //                     ).toLocaleString()}
  //                     %
  //                   </p>
  //                   <span className={styles.span}>
  //                     of allocated vote weight.
  //                   </span>
  //                 </div>
  //               </div>
  //             </div>
  //             <div className={styles.voteMain1}>
  //               <div className={styles.title}>
  //                 <p>Governance & Emissions voting</p>
  //                 <div>
  //                   Incentivize liquidity to an action, such as minting bitUSD
  //                   or lock bitGOV with a specific collateral. Learn more
  //                 </div>
  //               </div>
  //               <div className={`${styles.dataInfo2} ${styles.voteData}`}>
  //                 <div className={styles.value}>
  //                   <span>Current emissions week:</span>
  //                   <div>
  //                     <p>{voteState.week}</p>
  //                   </div>
  //                 </div>
  //                 <div className={styles.value}>
  //                   <span>Epoch ending:</span>
  //                   <div>
  //                     <p>{countdown()}</p>
  //                     <span className={styles.span}>{startDate()}</span>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //             <div className={styles.voteMain2}>
  //               <div className={styles.topMain}>
  //                 <div className={styles.left}>
  //                   <div className="button_Mini active">Emissions</div>
  //                 </div>
  //                 <div className={styles.right}>
  //                   <p>
  //                     Allocated<span>{calculatedValues.Allocated}%</span>
  //                   </p>
  //                   <p>
  //                     Remaining<span>{calculatedValues.Remaining}%</span>
  //                   </p>
  //                 </div>
  //               </div>
  //               <div className={styles.h5Tab}>
  //                 <div className={styles.tabMain}>
  //                   <div className={styles.tabItem}>
  //                     <div>Pool</div>
  //                     <div className={styles.center}>My Votes</div>
  //                     <div className={styles.center}>Votes</div>
  //                     <div className={styles.center}>
  //                       Estimated bitGOV Emissions
  //                     </div>
  //                     <div></div>
  //                   </div>

  //                   {/* Tabs for indices 0 to 4 */}
  //                   {[0, 1, 2, 3, 4].map((index) => {
  //                     const poolNames = [
  //                       "Stability Pool",
  //                       "bitUSD Debt",
  //                       "bitUSD Minting",
  //                       "bitGOV/ROSE LP",
  //                       "bitUSD/USDC LP",
  //                     ];
  //                     const poolImages = [
  //                       "/dapp/bitUSD.svg",
  //                       "/dapp/bitUSD.svg",
  //                       "/dapp/bitUSD.svg",
  //                       "/dapp/vineArose.svg",
  //                       "/dapp/usdc.svg",
  //                     ];
  //                     const actions = [
  //                       "Deposit",
  //                       "Debt",
  //                       "Mint",
  //                       "Default",
  //                       "Default",
  //                     ];
  //                     const isOpen = [
  //                       openPool,
  //                       openDebt,
  //                       openvUSD,
  //                       openVineLp,
  //                       openvUSDLp,
  //                     ][index];
  //                     const setOpen = [
  //                       setOpenPool,
  //                       setOpenDebt,
  //                       setOpenvUSD,
  //                       setOpenVineLp,
  //                       setOpenvUSDLp,
  //                     ][index];
  //                     return (
  //                       <div key={index} className={styles.tab}>
  //                         <div
  //                           className={`${styles.tabItem} ${styles.tabItem2}`}
  //                           style={isOpen ? { background: "#111" } : null}
  //                           onClick={() => setOpen(!isOpen)}
  //                         >
  //                           <div>
  //                             <img src={poolImages[index]} alt="icon" />
  //                             {poolNames[index]}
  //                           </div>
  //                           <div className={styles.center}>
  //                             {
  //                               calculatedValues.votesPercentage[
  //                                 `votes${index}`
  //                               ]
  //                             }
  //                             %
  //                           </div>
  //                           <div className={styles.center}>
  //                             {Number(
  //                               weightState.totalPointUpper <= 0
  //                                 ? 0
  //                                 : (
  //                                     (weightState.totalWeightAtData[
  //                                       `upper${index}`
  //                                     ] /
  //                                       weightState.totalPointUpper) *
  //                                     100
  //                                   ).toFixed(2)
  //                             ) || 0}
  //                             %
  //                             <img
  //                               src="/dapp/right.svg"
  //                               alt="icon"
  //                               style={{ width: "10px" }}
  //                             />
  //                             <span>
  //                               {Number(
  //                                 weightState.totalPoint <= 0
  //                                   ? 0
  //                                   : (
  //                                       (weightState.totalWeightAtData[
  //                                         `current${index}`
  //                                       ] /
  //                                         weightState.totalPoint) *
  //                                       100
  //                                     ).toFixed(2)
  //                               ) || 0}
  //                               %
  //                             </span>
  //                           </div>
  //                           <div className={styles.center}>
  //                             {
  //                               calculatedValues.emissions.upper[
  //                                 `upper${index}`
  //                               ]
  //                             }
  //                             <img
  //                               src="/dapp/right.svg"
  //                               alt="icon"
  //                               style={{ width: "10px" }}
  //                             />
  //                             <span>
  //                               {
  //                                 calculatedValues.emissions.current[
  //                                   `current${index}`
  //                                 ]
  //                               }
  //                             </span>
  //                           </div>
  //                           <div
  //                             className={styles.center}
  //                             style={
  //                               isOpen ? { transform: "rotate(30deg)" } : null
  //                             }
  //                           >
  //                             <img
  //                               src="/dapp/arr_bottom.svg"
  //                               alt="icon"
  //                               style={{ width: "20px" }}
  //                             />
  //                           </div>
  //                         </div>
  //                         {isOpen && (
  //                           <div className={styles.main}>
  //                             <div className={styles.action}>
  //                               <span>Action</span>
  //                               <p>{actions[index]}</p>
  //                             </div>
  //                             <div className={styles.enter}>
  //                               <span>Enter a percentage</span>
  //                               <div className={styles.input}>
  //                                 <div className="inputTxt">
  //                                   <input
  //                                     type="number"
  //                                     placeholder="0"
  //                                     onWheel={(e) => e.target.blur()}
  //                                     id={`amount${index}`}
  //                                     min="0"
  //                                     step="any"
  //                                     onKeyDown={onKeyDown}
  //                                     onChange={handleAmountChange(index)}
  //                                     value={
  //                                       voteState.amounts[`amount${index}`]
  //                                     }
  //                                   />
  //                                 </div>
  //                               </div>
  //                             </div>
  //                           </div>
  //                         )}
  //                       </div>
  //                     );
  //                   })}
  //                 </div>
  //               </div>

  //               {/* Vote Button */}
  //               <div className={styles.button}>
  //                 <p className={styles.p}>
  //                   To participate in voting, a 26-week lock-up period is
  //                   required.
  //                 </p>
  //                 <div
  //                   className={
  //                     showVote
  //                       ? "button rightAngle height"
  //                       : "button rightAngle height disable"
  //                   }
  //                   onClick={handleVote}
  //                 >
  //                   VOTE
  //                 </div>
  //               </div>
  //             </div>
  //           </>
  //         )}
  //       </div>
  //     </div>
  //     {currentState ? <Wait /> : null}
  //     {/* {isLoading &&
  //       account.status === "connected" &&
  //       signatureToken?.user &&
  //       signatureTrove?.user ? (
  //       <Loading />
  //     ) : null} */}
  //     <Footer />
  //   </>
  // );
  return <></>;
}
