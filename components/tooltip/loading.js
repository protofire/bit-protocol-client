import styles from "./index.module.scss";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../hook/user";

export default function Loading() {
  return (
    <>
      <div className={styles.wait}>
        <div className={styles.waitMain}>
          <img
            className={styles.loading}
            style={{ width: "64px", height: "64px" }}
            src="/dapp/bitUSD.svg"
            alt="icon"
          />
          <p className={styles.waitTitle}>Fetching data...</p>
          {/* <p className={styles.waitTitle}>{currentWaitInfo.info}</p> */}
        </div>
      </div>
    </>
  );
}
