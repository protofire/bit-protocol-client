import styles from "../../styles/dapp.module.scss";
import { BlockchainContext } from "../../hook/blockchain";
import { useContext, useEffect, useState } from "react";

export default function DepositsAndDebt({ type, address }) {
  const { userTroves, collaterals } = useContext(BlockchainContext);

  const [deposits, setDeposits] = useState(0);
  const [debt, setDebt] = useState(0);
  const [collateral, setCollateral] = useState({
    mcr: 0,
    borrowingRate: 0.0,
    redemptionRate: 0.0,
    mintedBitUSD: 0.0,
    tvl: 0.0,
    collateral: {
      logo: "rose.svg",
      name: "",
    },
  });

  useEffect(() => {
    if (userTroves[address] && collaterals[address]) {
      setDeposits(userTroves[address].deposits);
      setDebt(userTroves[address].debt);
      setCollateral(collaterals[address]);
    }
  }, [address, userTroves, collaterals]);

  return (
    <>
      <div
        className={styles.dataInfo}
        style={type == "Earn" ? { width: "480px" } : null}
      >
        <div className={styles.value}>
          <span>Your Deposits</span>
          <div>
            <p>{Number(deposits.toFixed(4)).toLocaleString()}</p>
            <p>
              <img
                style={{ width: "24px", height: "24px" }}
                src={`/dapp/${collateral.collateral.logo}`}
                alt="rose"
              />
              {collateral.collateral.name}
            </p>
          </div>
        </div>

        <div className={styles.value}>
          <span>Your Debt</span>
          <div>
            <p>{Number(debt.toFixed(4)).toLocaleString()}</p>
            <p>
              <img src="/dapp/bitUSD.svg" width="24" height="24" alt="vUSD" />
              bitUSD
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
