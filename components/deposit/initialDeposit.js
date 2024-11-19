import styles from "../../styles/dapp.module.scss";
import { BlockchainContext } from "../../hook/blockchain";
import { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import Wait from "../../components/tooltip/wait";
import tooltip from "../../components/tooltip";
import { useWaitForTransactionReceipt } from "wagmi";

export default function InitialDeposit({ address }) {
  const {
    userTroves,
    collaterals,
    balance,
    collateralPrices,
    openTrove,
    setCurrentState,
    setCurrentWaitInfo,
    currentState,
    approve,
    getTokenBalance,
    getData,
  } = useContext(BlockchainContext);

  const [ratioType, setRatioType] = useState("Custom");
  const [collAmount, setCollAmount] = useState("");
  const [collateral, setCollateral] = useState({});
  const [collateralRatio, setCollateralRatio] = useState(0);
  const [debtMax, setDebtMax] = useState(0);
  const [debtAmount, setDebtAmount] = useState("");
  const [ratio, setRatio] = useState(0);
  const [ratioNew, setRatioNew] = useState(0);
  const [isPayable, setIsPayable] = useState(false);
  const [deposits, setDeposits] = useState(0);
  const [collateralAddr, setCollateralAddr] = useState("");
  const [collateralBalance, setCollateralBalance] = useState(0);
  const [debt, setDebt] = useState(0);
  const [status, setStatus] = useState(0);
  const [txHash, setTxHash] = useState("");

  const [approved, setApproved] = useState({
    hash: "",
    status: false,
  });

  const { data: txReceipt, error: txError } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
  });

  const price = collateralPrices[address];

  useEffect(() => {
    async function getData() {
      if (userTroves[address] && collaterals[address]) {
        setCollateral(collaterals[address]);
        setDeposits(userTroves[address]?.deposits || 0);
        setDebt(userTroves[address]?.debt || 0);
        setStatus(userTroves[address]?.status || 0);
        setCollateralAddr(collaterals[address]?.collateral.address);
        setIsPayable(collaterals[address]?.collateral.payable);
        const tokenBalance = !collaterals[address]?.collateral.payable
          ? await getTokenBalance(collaterals[address]?.collateral.address)
          : 0;
        setCollateralBalance(tokenBalance);
      }
    }
    getData();
  }, [address, collaterals, userTroves]);

  useEffect(() => {
    const value = ((deposits * price) / debt) * 100;
    setRatio(value || 0);
    if (collateralRatio && ratioType == "Auto") {
      setRatioNew(collateralRatio);
    } else {
      const valueNew =
        (((deposits + Number(collAmount)) * price) /
          (debt + Number(debtAmount))) *
        100;
      setRatioNew(valueNew);
    }
  }, [collAmount, price, collateralRatio, debtAmount, ratioType]);

  useEffect(() => {
    if (collAmount) {
      if (collateralRatio && ratioType == "Auto") {
        const max =
          ((Number(deposits + collAmount) * price) / (collateralRatio / 100)) -
          debt;
        setDebtAmount(Number(max.toFixed(3)));
      } else {
        const max = ((Number(deposits + collAmount) * price) / 1.55) - debt;
        setDebtAmount(Number(max.toFixed(3)));
      }
    }
  }, [collAmount, ratioType, collateralRatio, price, deposits, debt]);

  useEffect(() => {
    if (txReceipt && txHash) {
      setCurrentState(false);
      tooltip.success({ content: "Successful", duration: 5000 });
      if (approved.hash) {
        setApproved({
          hash: approved.hash,
          status: true,
        });
      }
    }
    if (txError && txHash) {
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
      setApproved({
        hash: "",
        status: false,
      });
    }
    setTxHash("");
  }, [txReceipt, txError]);

  useEffect(() => {
    async function MintApproved() {
      if (approved.hash && approved.status) {
        await mint();
        setApproved({
          hash: "",
          status: false,
        });
      }
    }
    MintApproved();
  }, [approved]);

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

    if (isNaN(Number(e.key))) {
      e.preventDefault();
    }
  };

  const enforceThreeDecimals = (value) => {
    if (value === '' || !value.includes('.')) return value;
    const parts = value.split('.');
    return parts[0] + '.' + parts[1].slice(0, 3);
  };

  const changeCollAmount = async (e) => {
    const value = enforceThreeDecimals(e.target.value);
    const numValue = Number(value);
    const userBalance = isPayable ? balance : collateralBalance;
    const maxBalance = userBalance - 1 > 0 ? userBalance - 1 : 0;

    // Allow empty string or values within range (including zero)
    if (value === "" || (numValue >= 0 && numValue <= maxBalance)) {
      setCollAmount(value === "" ? "" : numValue);

      // Update debt amount based on new collateral amount
      if (value === "" || numValue === 0) {
        setDebtAmount("");
        setDebtMax(0);
      } else if (collateralRatio && ratioType === "Auto") {
        const max =
          (Number(deposits + numValue) * price) / (collateralRatio / 100) -
          debt;
        setDebtAmount(max);
        setDebtMax(max);
      } else {
        const max = (Number(deposits + numValue) * price) / 1.55 - debt;
        setDebtAmount(max);
        setDebtMax(max);
      }
    } else if (numValue > maxBalance) {
      setCollAmount(maxBalance.toFixed(3));
    }
  };

  const changeCollValue = (value) => {
    const balanceValue = isPayable ? balance : collateralBalance;
    const newAmount = (balanceValue - 1 > 0 ? balanceValue - 1 : 0) * value;
    setCollAmount(newAmount);

    // Update debt amount based on new collateral amount
    if (collateralRatio && ratioType === "Auto") {
      const max =
        (Number(deposits + newAmount) * price) / (collateralRatio / 100) - debt;
      setDebtAmount(max);
      setDebtMax(max);
    } else {
      const max = (Number(deposits + newAmount) * price) / 1.55 - debt;
      setDebtAmount(max);
      setDebtMax(max);
    }
  };

  const changeCollateralRatio = async (e) => {
    const value = e.target.value;
    const numValue = Number(value);

    // Allow empty string or non-negative values
    if (value === "" || numValue >= 0) {
      setCollateralRatio(value === "" ? "" : numValue);

      // Update debt max and amount based on new ratio
      if (collAmount && numValue > 0) {
        const max =
          (Number(deposits + Number(collAmount)) * price) / (numValue / 100) -
          debt;
        setDebtMax(max);
        setDebtAmount(max);
      }
    }
  };

  useEffect(() => {
    const currentDebt = Number(debt);
    const currentDeposits = Number(deposits);
    const newDebt = debtAmount === "" ? 0 : Number(debtAmount);
    const newColl = collAmount === "" ? 0 : Number(collAmount);

    // Calculate current ratio
    const value =
      currentDebt === 0 ? 0 : ((currentDeposits * price) / currentDebt) * 100;
    setRatio(value || 0);

    if (collateralRatio && ratioType === "Auto") {
      setRatioNew(collateralRatio);
    } else {
      const totalDebt = currentDebt + newDebt;
      const totalColl = currentDeposits + newColl;
      const valueNew =
        totalDebt === 0 ? 0 : ((totalColl * price) / totalDebt) * 100;
      setRatioNew(valueNew || 0);
    }
  }, [collAmount, price, collateralRatio, ratioType]);

  const changeDebtAmount = (e) => {
    const value = enforceThreeDecimals(e.target.value);
    const numValue = Number(value);

    if (value === "" || (!isNaN(value) && numValue >= 0)) {
      if (numValue > debtMax) {
        setDebtAmount(debtMax);
      } else {
        setDebtAmount(value === "" ? "" : numValue);
      }
    }
  };

  const changeDebtValue = (value) => {
    setDebtAmount(debtMax * value);
  };

  const changeRatioType = (index) => {
    setRatioType(index);
    if (index == "Auto") {
      setCollateralRatio(0);
    }
  };

  const approveCollateral = async () => {
    if (!numberHelpers.isValidNumber(collAmount)) {
      tooltip.error({
        content: "Please enter a valid collateral amount",
        duration: 5000
      });
      return;
    }

    try {
      const collateralWei = numberHelpers.toWei(collAmount);

      const tx = await approve(
        collateralAddr,
        collateralWei
      );

      setCurrentWaitInfo({
        type: "loading",
        info: `Approving ${Number(collAmount).toLocaleString()} $${collateral?.collateral?.name
          }`,
      });

      setApproved({
        hash: tx,
        status: false
      });

      setCurrentState(true);
      setTxHash(tx);
    } catch (error) {
      console.log("approval", error);
      setCurrentState(false);

      let errorMessage = "Approval failed. Please try again.";
      if (error.error && error.error.message) {
        errorMessage = error.error.message
          .replace('execution reverted: ', '')
          .replace('VM Exception while processing transaction: revert ', '');
      }

      tooltip.error({
        content: errorMessage,
        duration: 5000
      });
    }
  };

  const numberHelpers = {
    toWei: (value) => {
      try {
        if (!value || value === '') return '0';
        // Remove commas and ensure string
        const cleanValue = value.toString().replace(/,/g, '');
        // Use ethers to parse ether to wei
        return ethers.utils.parseEther(cleanValue).toString();
      } catch (error) {
        console.error('Error converting to Wei:', error);
        return '0';
      }
    },

    isValidNumber: (value) => {
      if (value === '' || value === undefined) return false;
      const num = Number(value);
      return !isNaN(num) && num > 0;
    }
  };

  const mint = async () => {
    // Allow zero collateral amount but require positive debt amount
    if (collAmount === "" || debtAmount === "") {
      return;
    }

    const numDebtAmount = Number(debtAmount);
    if (numDebtAmount < 1) {
      tooltip.error({
        content: "A Minimum Debt of 1 bitUSD is Required!",
        duration: 5000
      });
      return;
    }

    try {
      const collateralWei = numberHelpers.toWei(collAmount);
      const debtWei = numberHelpers.toWei(debtAmount);

      // Set loading state
      setCurrentWaitInfo({
        type: "loading",
        info: `Mint ${Number(debtAmount).toLocaleString()} $bitUSD`
      });
      setCurrentState(true);

      // Send transaction
      const tx = await openTrove(
        address,
        collateralWei,
        debtWei,
        isPayable,
        isPayable ? {
          value: collateralWei
        } : {}
      );

      const result = await tx.wait();
      setCurrentState(false);

      if (result.status === 0) {
        tooltip.error({
          content: "Transaction failed. Please verify collateral ratio and try again.",
          duration: 5000
        });
      } else {
        tooltip.success({ content: "Successfully minted bitUSD", duration: 5000 });
        // Clear inputs
        setCollAmount("");
        setDebtAmount("");
        // Refresh data
        await getData();
      }
    } catch (error) {
      console.log("mint", error);
      setCurrentState(false);

      let errorMessage = "Transaction failed. Please try again.";

      if (error.error && error.error.message) {
        errorMessage = error.error.message
          .replace('execution reverted: ', '')
          .replace('VM Exception while processing transaction: revert ', '');
      } else if (error.message && error.message.includes('insufficient funds')) {
        errorMessage = "Insufficient funds for transaction.";
      }

      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };


  return (
    <>
      <div className="dappBg">
        <div className={`${styles.Mint} ${"dappMain"}`}>
          <div className={styles.topType}>
            <h3>Mint bitUSD</h3>
            <p>
              Deposit your ${collateral?.collateral?.name} as collateral in
              Vault to mint bitUSD. Stake bitUSD or provide liquidity to earn
              rewards using the Bit Protocol.
            </p>
          </div>

          <div className={styles.mintMain}>
            <div className={styles.CoinType}>
              <div className={styles.collateral}>
                <img src="/dapp/bitUSD.svg" alt="bitUSD" />
                $bitUSD
              </div>
            </div>

            <div className={styles.enterAmount}>
              <div className={styles.miniTitle}>
                <span>Enter amount</span>
                <span style={{ fontSize: "12px" }}>
                  Balance{" "}
                  {Number(
                    Number(isPayable ? balance : collateralBalance).toFixed(3)
                  ).toLocaleString()}{" "}
                  ${collateral?.collateral?.name}
                </span>
              </div>

              <div className="inputTxt3">
                <input
                  type="number"
                  placeholder="0"
                  onWheel={(e) => e.target.blur()}
                  id="collAmount"
                  min="0"
                  step="0.001"
                  onKeyDown={onKeyDown}
                  onChange={changeCollAmount}
                  value={collAmount}
                />
                <span>${collateral?.collateral?.name}</span>
              </div>
              <div className="changeBalance">
                <span onClick={() => changeCollValue(0.25)}>25%</span>
                <span onClick={() => changeCollValue(0.5)}>50%</span>
                <span onClick={() => changeCollValue(0.75)}>75%</span>
                <span
                  onClick={() => changeCollValue(1)}
                  style={{ border: "none" }}
                >
                  Max
                </span>
              </div>
            </div>
            <div className={styles.ratio}>
              <span className={styles.miniTitle}>Collateral Ratio</span>
              <div className={styles.autoOrcustom}>
                <div className={styles.buttonList}>
                  <span
                    className={
                      ratioType == "Custom"
                        ? "button rightAngle"
                        : "button rightAngle noactive"
                    }
                    onClick={() => changeRatioType("Custom")}
                  >
                    Custom
                  </span>
                  <span
                    className={
                      ratioType == "Auto"
                        ? "button rightAngle"
                        : "button rightAngle noactive"
                    }
                    onClick={() => changeRatioType("Auto")}
                  >
                    Auto
                  </span>
                </div>
                {ratioType == "Auto" ? (
                  <div className="inputTxt" style={{ width: "120px" }}>
                    <input
                      type="number"
                      placeholder="0"
                      onWheel={(e) => e.target.blur()}
                      id="collateralRatio"
                      min="0" // Allow zero and prevent negative values
                      step="any" // Allow decimal values
                      onKeyDown={onKeyDown}
                      onChange={changeCollateralRatio}
                      value={
                        collateralRatio === 0 ? "0" : collateralRatio || ""
                      } // Handle zero explicitly
                    />
                    <span>%</span>
                  </div>
                ) : null}
              </div>
            </div>
            <div className={styles.enterAmount}>
              <div className={styles.miniTitle}>
                <span>Mint bitUSD</span>
                <span style={{ fontSize: "12px" }}>
                  max {Number(Number(debtMax).toFixed(2)).toLocaleString()}{" "}
                  bitUSD
                </span>
              </div>
              <div className="inputTxt3">
                <input
                  type="number"
                  placeholder="0"
                  onWheel={(e) => e.target.blur()}
                  id="debtAmount"
                  min="0" // Allow zero and prevent negative values
                  step="any" // Allow decimal values
                  onKeyDown={onKeyDown}
                  onChange={changeDebtAmount}
                  value={debtAmount === '' ? '' : debtAmount}
                />
                <span>$bitUSD</span>
              </div>
              <div className="changeBalance">
                <span onClick={() => changeDebtValue(0.25)}>25%</span>
                <span onClick={() => changeDebtValue(0.5)}>50%</span>
                <span onClick={() => changeDebtValue(0.75)}>75%</span>
                <span
                  onClick={() => changeDebtValue(1)}
                  style={{ border: "none" }}
                >
                  Max
                </span>
              </div>
            </div>

            <div className={styles.debt}>
              <div className={styles.dataList}>
                <div className={styles.dataItem}>
                  <p>+ Collateral Assets</p>
                  <span>
                    $
                    {Number(
                      (Number(collAmount) * price).toFixed(2)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className={styles.dataItem}>
                  <p>+ Minted bitUSD</p>
                  <div>
                    <span>
                      {Number(Number(debt).toFixed(2)).toLocaleString()} bitUSD
                    </span>
                    {collAmount && debtAmount ? (
                      <span>
                        {" "}
                        ➡️{" "}
                        {Number(
                          (Number(debtAmount) + Number(debt)).toFixed(2)
                        ).toLocaleString()}{" "}
                        bitUSD
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className={styles.dataItem}>
                  <p>+ Collateral Ratio</p>
                  <div>
                    <span>
                      {Number(Number(ratio).toFixed(2)).toLocaleString()}%
                    </span>
                    {collAmount && debtAmount ? (
                      <span>
                        {" "}
                        ➡️{" "}
                        {Number(Number(ratioNew).toFixed(2)).toLocaleString()}%
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className={styles.dataItem}>
                  <span>+ Mint Fee </span>
                  <span>0.5%</span>
                </div>
                {status == 0 || status == 2 || status == 3 ? (
                  <div className={styles.dataItem}>
                    <p>+ Liquidation Fee</p>
                    <span>1 bitUSD</span>
                  </div>
                ) : null}
                <div className={styles.dataItem}>
                  <p>Liquidation Price</p>
                  <span>
                    {collateral?.collateral?.name} = $
                    {deposits > 0
                      ? Number(((debt || 0) * 1.5) / deposits).toFixed(3).toLocaleString()
                      : 0
                    }
                  </span>
                </div>
              </div>
              <div className={styles.total}>
                <p>Total Debt</p>
                <span>
                  {Number(
                    (debt + Number(debtAmount)).toFixed(2)
                  ).toLocaleString()}{" "}
                  bitUSD
                </span>
              </div>
            </div>
            <div className={styles.button}>
              <div
                className={
                  !collAmount || !debtAmount
                    ? "button rightAngle height disable"
                    : "button rightAngle height"
                }
                onClick={() => {
                  if (isPayable) {
                    mint();
                  } else {
                    approveCollateral();
                  }
                }}
              >
                Mint
              </div>
            </div>
          </div>
        </div>
      </div>
      {currentState ? <Wait></Wait> : null}
    </>
  );
}
