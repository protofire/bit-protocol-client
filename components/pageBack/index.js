import { useEffect, useState, useContext } from "react";
import styles from "../../styles/dapp.module.scss";
import { useRouter } from "next/router";

export default function PageBack() {
  const router = useRouter();

  return (
    <div className={styles.pageBack}>
      <div className={styles.container} onClick={() => router.back()}>
        <img src="/icon/left-arrow.svg" />
        <span>Go back to Manage Collateral</span>
      </div>
    </div>
  );
}
