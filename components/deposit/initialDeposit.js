import styles from "../../styles/dapp.module.scss";
import { BlockchainContext } from "../../hook/blockchain";
import { useEffect, useState, useContext } from "react";
import BigNumber from "bignumber.js";
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
          (Number(deposits + collAmount) * price) / (collateralRatio / 100) -
          debt;
        setDebtAmount(max);
      } else {
        const max = (Number(deposits + collAmount) * price) / 1.55 - debt;
        setDebtAmount(max);
      }
    }
  }, [collAmount, ratioType, collateralRatio]);

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

  const onKeyDown = async (e) => {
    const invalidChars = ["-", "+", "e", "E"];
    if (invalidChars.indexOf(e.key) !== -1) {
      e.preventDefault();
    }
  };

  const changeCollAmount = async (e) => {
    const value = Number(e.target.value);
    const balanceValue = isPayable ? balance : collateralBalance;
    const maxBalance = balanceValue - 1 > 0 ? balanceValue - 1 : 0;
    if (value < maxBalance) {
      setCollAmount(value == 0 ? "" : value);
    } else {
      setCollAmount(maxBalance);
    }
  };

  const changeCollVaule = (value) => {
    const balanceValue = isPayable ? balance : collateralBalance;
    setCollAmount((balanceValue - 1 > 0 ? balanceValue - 1 : 0) * value);
  };

  const changeCollateralRatio = async (e) => {
    const value = Number(e.target.value);
    setCollateralRatio(value == 0 ? "" : value);
  };

  useEffect(() => {
    if (collateralRatio && ratioType == "Auto") {
      const max =
        (Number(deposits + collAmount) * price) / (collateralRatio / 100) -
        debt;
      setDebtMax(max);
    } else {
      const max = (Number(deposits + collAmount) * price) / 1.55 - debt;
      setDebtMax(max);
    }
  }, [collAmount, price, collateralRatio, ratioType]);

  const changeDebtAmount = async (e) => {
    const value = Number(e.target.value);
    if (value > debtMax) {
      setDebtAmount(debtMax);
    } else {
      setDebtAmount(value == 0 ? "" : value);
    }
  };

  const changeDebtVaule = (value) => {
    setDebtAmount(debtMax * value);
  };

  const changeRatioType = (index) => {
    setRatioType(index);
    if (index == "Auto") {
      setCollateralRatio(0);
    }
  };

  const approveCollateral = async () => {
    if (!collAmount || !debtAmount) {
      return;
    }
    if (Number(debtAmount) < 1) {
      tooltip.error({
        content: "A Minimum Debt of 1 bitUSD is Required!",
        duration: 5000,
      });
      return;
    }
    try {
      const tx = await approve(
        collateralAddr,
        new BigNumber(collAmount).multipliedBy(1e18).toFixed()
      );
      setCurrentWaitInfo({
        type: "loading",
        info: `Approving ${Number(collAmount.toFixed(4)).toLocaleString()} $${
          collateral?.collateral?.name
        }`,
      });
      setApproved({
        hash: tx,
        status: false,
      });
      setCurrentState(true);
      setTxHash(tx);
    } catch (error) {
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const mint = async () => {
    if (!collAmount || !debtAmount) {
      return;
    }
    if (Number(debtAmount) < 1) {
      tooltip.error({
        content: "A Minimum Debt of 1 bitUSD is Required!",
        duration: 5000,
      });
      return;
    }
    try {
      const tx = await openTrove(
        address,
        new BigNumber(collAmount).multipliedBy(1e18).toFixed(),
        new BigNumber(debtAmount).multipliedBy(1e18).toFixed(),
        isPayable
      );
      setCurrentWaitInfo({
        type: "loading",
        info:
          "Mint " + Number(debtAmount.toFixed(4)).toLocaleString() + " $bitUSD",
      });
      setCurrentState(true);
      const mintResult = await tx.wait();
      setCurrentState(false);
      if (mintResult.status === 0) {
        tooltip.error({
          content:
            "Transaction failed due to a network error. Please refresh the page and try again.",
          duration: 5000,
        });
      } else {
        tooltip.success({ content: "Successful", duration: 5000 });
      }
      setCollAmount("");
      setDebtAmount("");
      await getData();
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
                    Number(isPayable ? balance : collateralBalance).toFixed(4)
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
                  onKeyDown={onKeyDown.bind(this)}
                  onChange={changeCollAmount.bind(this)}
                  value={collAmount}
                ></input>
                <span>${collateral?.collateral?.name}</span>
              </div>
              <div className="changeBalance">
                <span onClick={() => changeCollVaule(0.25)}>25%</span>
                <span onClick={() => changeCollVaule(0.5)}>50%</span>
                <span onClick={() => changeCollVaule(0.75)}>75%</span>
                <span
                  onClick={() => changeCollVaule(1)}
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
                      onKeyDown={onKeyDown.bind(this)}
                      onChange={changeCollateralRatio.bind(this)}
                      value={collateralRatio}
                    ></input>
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
                  onKeyDown={onKeyDown.bind(this)}
                  onChange={changeDebtAmount.bind(this)}
                  value={debtAmount}
                ></input>
                <span>$bitUSD</span>
              </div>
              <div className="changeBalance">
                <span onClick={() => changeDebtVaule(0.25)}>25%</span>
                <span onClick={() => changeDebtVaule(0.5)}>50%</span>
                <span onClick={() => changeDebtVaule(0.75)}>75%</span>
                <span
                  onClick={() => changeDebtVaule(1)}
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
                    {Number(((debt || 0) * 1.5) / deposits)
                      .toFixed(4)
                      .toLocaleString()}
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
