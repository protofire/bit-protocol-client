import styles from "./index.module.scss";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { BlockchainContext } from "../../hook/blockchain";

export default function Wait() {
  const { currentWaitInfo, setCurrentState } = useContext(BlockchainContext);

  return (
    <>
      <div className={styles.wait}>
        {currentWaitInfo.type == "success" ? (
          <div className={styles.waitMain}>
            <img src="/icon/confirm.svg" alt="icon" />
            <p className={styles.waitTitle}>Transaction submitted</p>
            <div className="button" onClick={() => setCurrentState(false)}>
              Confirm
            </div>
          </div>
        ) : (
          <div className={styles.waitMain}>
            <img
              className={styles.loading}
              style={{ width: "64px", height: "64px" }}
              src="/dapp/bitUSD.svg"
              alt="icon"
            />
            <p className={styles.waitTitle}>Waiting for confirmation...</p>
            <p className={styles.waitTitle}>{currentWaitInfo.info}</p>
          </div>
        )}
      </div>
    </>
  );
}
