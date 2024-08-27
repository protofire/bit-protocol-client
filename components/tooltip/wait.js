import styles from "./index.module.scss";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../hook/user";

export default function Wait() {
  const { currentWaitInfo, setCurrentState } = useContext(UserContext);

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
            {/* <img className={styles.loading} src='/icon/loading.svg' alt='icon' /> */}
            <img
              className={styles.loading}
              src="/dapp/bitUSD.svg"
              width="64"
              height="64"
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
