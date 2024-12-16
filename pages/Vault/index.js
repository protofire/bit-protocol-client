import styles from "../../styles/dapp.module.scss";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useContext } from "react";
import Loading from "../../components/tooltip/loading";
import Collateral from "../../components/collateral";
import { BlockchainContext } from "../../hook/blockchain";
import { useAccount } from "wagmi";

export default function Vault() {
  const { collaterals, signatureTrove, signatureToken } =
    useContext(BlockchainContext);
  const account = useAccount();

  return (
    <>
      <Header type="dapp" dappMenu="Vault"></Header>

      <div className="dappBg">
        <div className={`${styles.Earn} ${"dappMain2"}`}>
          {account.status === "connected" ? (
            <div className={styles.earnMain}>
              {Object.keys(collaterals).map((key) => (
                <Collateral
                  key={key}
                  props={{ ...collaterals[key], address: key }}
                />
              ))}
            </div>
          ) : (
            <h2 style={{ textAlign: "center" }}>Please connect your wallet</h2>
          )}
        </div>
      </div>

      {Object.keys(collaterals).length === 0 &&
      account.status === "connected" &&
      signatureToken?.user &&
      signatureTrove?.user ? (
        <Loading></Loading>
      ) : null}

      <Footer></Footer>
    </>
  );
}
