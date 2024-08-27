import Head from "next/head";
import styles from "./index.module.scss";
import { useConnectWallet } from "@web3-onboard/react";
import { ethers } from "ethers";
import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../hook/user";
import Link from "next/link";
import { useRouter } from "next/router";
import BigNumber from "bignumber.js";
import Wait from "../tooltip/wait";
import tooltip from "../tooltip";

export default function Header(props) {
  const { menu, type, dappMenu } = props;
  const router = useRouter();

  const {
    account,
    setAccount,
    ethersProvider,
    setEthersProvider,
    setSigner,
    setSignInAuth,
    setSignInAuthToken,
    infuraRPC,
    idovestingQuery,
    idovestingMain,
    ethProviderSigner,
    troveManagerGetters,
    debtToken,
    signInAuth,
    currentState,
    setCurrentState,
    setCurrentWaitInfo,
    formatNum,
    totalTvl,
  } = useContext(UserContext);

  // const [chainId, setchainId] = useState(0);
  // ethersProvider.send('eth_chainId').then(chainId => {
  //     setchainId(chainId)
  //     console.log(chainId)
  // })

  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const changeNetWork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: "0x1406F41",
            },
          ],
        });
        // console.log('wallet_switchEthereumChain');
      } catch (e) {
        if (e.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x1406F41",
                  chainName: "PWR BTC+",
                  nativeCurrency: {
                    name: "Bitcoin",
                    symbol: "BTC",
                    decimals: 18,
                  },
                  rpcUrls: ["https://bitcoinplus.pwrlabs.io/"],
                },
              ],
            });
          } catch (addError) {
            console.error(addError);
          }
        } else if (e.code === 4001) return;
      }
    }
  };
  useEffect(() => {
    changeNetWork();
  }, []);

  useEffect(() => {
    if (wallet) {
      setEthersProvider(new ethers.providers.Web3Provider(wallet.provider));
      setAccount(wallet.accounts[0].address);
    } else {
      setEthersProvider(new ethers.providers.JsonRpcProvider(infuraRPC));
      setAccount("");
    }
  }, [wallet]);

  useEffect(() => {
    if (ethersProvider) {
      setSigner(ethersProvider.getSigner());
    }
  }, [ethersProvider, wallet]);

  const goMenu = (id) => {
    if (menu == "Home") {
      props.updateId(id);
    } else {
      router.push("/#" + id);
    }
  };

  const [open, setOpen] = useState(true);
  const openH5Menu = async () => {
    setOpen(!open);
  };

  const goMenu_h5 = (id) => {
    setOpen(true);
    if (menu == "Home") {
      props.updateId(id);
    } else {
      router.push("/#" + id);
    }
  };

  const [showSignIn, setShowSignIn] = useState(false);

  const [showSignInToken, setShowSignInToken] = useState(false);

  useEffect(() => {
    if (account && menu !== "Home") {
      const auth = JSON.parse(localStorage.getItem("signInAuth"));
      const authToken = JSON.parse(localStorage.getItem("signInAuthToken"));
      if (!auth) {
        setShowSignIn(true);
      } else {
        const time = Math.floor(new Date().getTime() / 1000);
        if (account !== auth.user || time - auth.time >= 86400) {
          setShowSignIn(true);
        } else {
          setSignInAuth(auth);
          setSignInAuthToken(authToken);
        }
      }
    }
  }, [account, menu]);

  const [showClaim, setShowClaim] = useState(false);
  const [showClaim2, setshowClaim2] = useState(false);
  const [airDrop, setAirDrop] = useState(0);
  const [unlockableAmount, setUnlockableAmount] = useState(0);
  const [totalLocked, setTotalLocked] = useState(0);
  const [lastUnlockingTime, setLastUnlockingTime] = useState(0);
  const [unlockingStartTime, setUnlockingStartTime] = useState(0);
  const queryData = async () => {
    if (idovestingQuery && account) {
      const unlockingInfo = await idovestingQuery.UnlockingInfo(account);
      setTotalLocked(Number(unlockingInfo.totalLocked._hex) / 1e18);
      const airDrop = new BigNumber(unlockingInfo.airdrop._hex)
        .div(1e18)
        .toFixed();
      setAirDrop(Number(airDrop));
      const unlockingStartTime = await idovestingQuery.unlockingStartTime();
      var timestamp = Date.parse(new Date()) / 1000;
      if (
        Number(airDrop) > 1 &&
        unlockingInfo.isClaimed == false &&
        timestamp > Number(unlockingStartTime._hex)
      ) {
        setShowClaim(true);
      } else {
        setShowClaim(false);
      }

      setLastUnlockingTime(Number(unlockingInfo.lastUnlockingTime._hex));
      setUnlockingStartTime(Number(unlockingStartTime._hex));

      const unlockableAmount = await idovestingQuery.getUnlockableAmount(
        account
      );
      setUnlockableAmount(Number(unlockableAmount._hex) / 1e18);
    }
  };

  let timerLoading = useRef(null);
  // useEffect(() => {
  //   queryData();
  //   timerLoading.current = setInterval(() => {
  //     queryData();
  //   }, 2000);
  //   return () => clearInterval(timerLoading.current);
  // }, [account]);

  const [Claimed, setClaimed] = useState(0);
  const [Remaining, setRemaining] = useState(0);
  useEffect(() => {
    if (lastUnlockingTime <= 0) {
      setClaimed(0);
      setRemaining(totalLocked);
    } else {
      const claimed =
        ((Number(lastUnlockingTime) - Number(unlockingStartTime)) /
          (180 * 86400)) *
        Number(totalLocked);
      setClaimed(claimed);
      setRemaining(totalLocked - claimed);
    }
  }, [lastUnlockingTime, unlockingStartTime, totalLocked]);

  const ClaimIdo = async () => {
    if (showClaim) {
      try {
        const idoTx = await idovestingMain.claimAirdrop();
        setCurrentWaitInfo({
          type: "loading",
          info:
            "Claim " + Number(airDrop.toFixed(4)).toLocaleString() + " $bitGOV",
        });
        setCurrentState(true);
        const result = await idoTx.wait();
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
    } else if (unlockableAmount) {
      setshowClaim2(true);
    }
  };

  const Claim = async () => {
    if (unlockableAmount <= 0.001) {
      return;
    }
    try {
      const idoTx = await idovestingMain.vest(account);
      setCurrentWaitInfo({
        type: "loading",
        info: "Claim " + formatNum(unlockableAmount) + " $bitGOV",
      });
      setCurrentState(true);
      const result = await idoTx.wait();
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
      <Head>
        <title>Bit Protocol | Privacy Focused Omnichain Stablecoin</title>
        <meta
          name="description"
          content="Bit Protocol | Privacy Focused Omnichain Stablecoin"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.head}>
        <div className={styles.headMain} id="vine">
          <Link href="/" className={styles.logo}>
            <img src="/bitusd-logo.svg" alt="logo" />
            {type == "dapp" ? (
              <span className="tvl">TVL:${formatNum(totalTvl)}</span>
            ) : null}
          </Link>
          {type == "dapp" ? (
            <div className={styles.dappList}>
              <Link
                className={dappMenu == "Vault" ? `${styles.active}` : null}
                href="/Vault"
                rel="nofollow noopener noreferrer"
              >
                <span>Vault</span>
              </Link>
              <Link
                className={dappMenu == "Mint" ? `${styles.active}` : null}
                href="/Mint"
                rel="nofollow noopener noreferrer"
              >
                <span>Mint bitUSD</span>
              </Link>
              <Link
                className={dappMenu == "Earn" ? `${styles.active}` : null}
                href="/Earn"
                rel="nofollow noopener noreferrer"
              >
                <span>Earn</span>
              </Link>
              {/* <Link
                className={dappMenu == "Reward" ? `${styles.active}` : null}
                href="/Reward"
                rel="nofollow noopener noreferrer"
              >
                <span>Reward</span>
              </Link> */}
              {/* <Link
                className={dappMenu == "Lock" ? `${styles.active}` : null}
                href="/Lock"
                rel="nofollow noopener noreferrer"
              >
                <span>Lock</span>
              </Link> */}
              <Link
                className={dappMenu == "Redeem" ? `${styles.active}` : null}
                href="/Redeem"
                rel="nofollow noopener noreferrer"
              >
                <span>Redeem</span>
              </Link>
              {/* <Link
                className={dappMenu == "Vote" ? `${styles.active}` : null}
                href="/Vote"
                rel="nofollow noopener noreferrer"
              >
                <span>Vote</span>
              </Link> */}
            </div>
          ) : (
            <div className={styles.list}>
              <span onClick={() => goMenu("works")}>How it works</span>
              <Link target="_blank" href="" rel="nofollow noopener noreferrer">
                <span>Docs</span>
              </Link>
              <div className="menu-container">
                <span>Socials</span>
                <div className="dropdown-menu">
                  <Link
                    target="_blank"
                    href=""
                    rel="nofollow noopener noreferrer"
                  >
                    Twitter/X
                  </Link>
                  <Link
                    target="_blank"
                    href=""
                    rel="nofollow noopener noreferrer"
                  >
                    Telegram Community
                  </Link>
                  <Link
                    target="_blank"
                    href=""
                    rel="nofollow noopener noreferrer"
                  >
                    Telegram Announcements
                  </Link>
                  <Link
                    target="_blank"
                    href=""
                    rel="nofollow noopener noreferrer"
                  >
                    Medium
                  </Link>
                </div>
              </div>
              <span onClick={() => goMenu("faq")}>FAQ</span>
              <div className="menu-container">
                <span>IDO</span>
                <div className="dropdown-menu">
                  <Link
                    href="/ido-countdown"
                    rel="nofollow noopener noreferrer"
                    style={{ width: "135px" }}
                  >
                    IDO Countdown
                  </Link>
                  <Link
                    href="/ido-raffle"
                    rel="nofollow noopener noreferrer"
                    style={{ width: "135px" }}
                  >
                    Whitelist Raffle
                  </Link>
                </div>
              </div>
              <Link target="_blank" href="" rel="nofollow noopener noreferrer">
                <span>Disclaimer</span>
              </Link>
            </div>
          )}

          <div className={styles.menuList}>
            {menu == "Home" ? (
              parseInt(new Date().getTime() / 1000) < 1709730000 ? (
                <div div className="button soon">
                  <span className="show">Launch App</span>
                  <span className="hide">Launching Soon</span>
                </div>
              ) : (
                <div div className="button">
                  <Link href="/Vault">
                    <span>Launch App</span>
                  </Link>
                </div>
              )
            ) : null}
            <>
              <div className="h5None">
                {wallet ? (
                  <div style={{ display: "flex", gap: "5px" }}>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <div className="account">
                        {account.slice(0, 5) + ".." + account.slice(-5)}
                      </div>
                      <div
                        className="button h5None"
                        style={{ minWidth: "auto" }}
                        onClick={() => disconnect(wallet)}
                      >
                        Disconnect
                      </div>
                    </div>
                    {showClaim || unlockableAmount ? (
                      <div
                        className={`${"button"} ${styles.faucet}`}
                        style={{ minWidth: "auto" }}
                      >
                        <span onClick={() => ClaimIdo()}>Claim</span>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div
                    className="button"
                    disabled={connecting}
                    style={{ minWidth: "auto" }}
                    onClick={() => (wallet ? disconnect(wallet) : connect())}
                  >
                    {connecting
                      ? "Connecting"
                      : wallet
                      ? "Disconnect"
                      : "Connect Wallet"}
                  </div>
                )}
              </div>
            </>

            <div className={styles.h5Menu} onClick={openH5Menu}>
              {open ? (
                <img src="/icon/menu.svg" alt="menu" />
              ) : (
                <img src="/icon/menu_c.svg" alt="menu" />
              )}
            </div>
          </div>
        </div>
      </div>

      {!open ? (
        type == "dapp" ? (
          <div className={styles.h5Block}>
            <div className={styles.h5Item}>
              <Link href="/Vault" rel="nofollow noopener noreferrer">
                <span>Vault</span>
              </Link>
            </div>
            <div className={styles.h5Item}>
              <Link href="/Mint" rel="nofollow noopener noreferrer">
                <span>Mint bitUSD</span>
              </Link>
            </div>
            <div className={styles.h5Item}>
              <Link href="/Earn" rel="nofollow noopener noreferrer">
                <span>Earn</span>
              </Link>
            </div>
            {/* <div className={styles.h5Item}>
              <Link href="/Reward" rel="nofollow noopener noreferrer">
                <span>Reward</span>
              </Link>
            </div> */}
            {/* <div className={styles.h5Item}>
              <Link href="/Lock" rel="nofollow noopener noreferrer">
                <span>Lock</span>
              </Link>
            </div> */}
            <div className={styles.h5Item}>
              <Link href="/Redeem" rel="nofollow noopener noreferrer">
                <span>Redeem</span>
              </Link>
            </div>
            {/* <div className={styles.h5Item}>
              <Link href="/Vote" rel="nofollow noopener noreferrer">
                <span>Vote</span>
              </Link>
            </div> */}
            <div className="h5user">
              {wallet ? (
                <>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <div className="account">
                      {account.slice(0, 5) + ".." + account.slice(-5)}
                    </div>
                    <div
                      className="button"
                      style={{ minWidth: "auto" }}
                      onClick={() => disconnect(wallet)}
                    >
                      Disconnect
                    </div>
                    {showClaim || unlockableAmount ? (
                      <div
                        className={`${"button"} ${styles.claim}`}
                        style={{ minWidth: "auto" }}
                      >
                        <span onClick={() => ClaimIdo()}>Claim</span>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <div
                  className="button"
                  disabled={connecting}
                  style={{ minWidth: "auto" }}
                  onClick={() => (wallet ? disconnect(wallet) : connect())}
                >
                  {connecting
                    ? "Connecting"
                    : wallet
                    ? "Disconnect"
                    : "Connect Wallet"}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.h5Block}>
            <div className={styles.h5Item} onClick={() => goMenu_h5("works")}>
              How it works
            </div>
            <div className={styles.h5Item}>
              <Link target="_blank" href="" rel="nofollow noopener noreferrer">
                <span>Docs</span>
              </Link>
            </div>
            <div className={`${styles.h5Item}`}>
              <div>Socials</div>
              <div className={styles.socials}>
                <div>
                  <Link
                    target="_blank"
                    href=""
                    rel="nofollow noopener noreferrer"
                  >
                    Twitter/X
                  </Link>
                </div>
                <div>
                  <Link
                    target="_blank"
                    href=""
                    rel="nofollow noopener noreferrer"
                  >
                    Telegram Community
                  </Link>
                </div>
                <div>
                  <Link
                    target="_blank"
                    href=""
                    rel="nofollow noopener noreferrer"
                  >
                    Telegram Announcements
                  </Link>
                </div>
                <div>
                  <Link
                    target="_blank"
                    href=""
                    rel="nofollow noopener noreferrer"
                  >
                    Medium
                  </Link>
                </div>
              </div>
            </div>
            <div className={styles.h5Item} onClick={() => goMenu_h5("faq")}>
              FAQ
            </div>
            <div className={styles.h5Item}>
              <Link target="_blank" href="" rel="nofollow noopener noreferrer">
                <span>Disclaimer</span>
              </Link>
            </div>

            <div className="h5user">
              {wallet ? (
                <>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <div className="account">
                      {account.slice(0, 5) + ".." + account.slice(-5)}
                    </div>
                    <div
                      className="button"
                      style={{ minWidth: "auto" }}
                      onClick={() => disconnect(wallet)}
                    >
                      Disconnect
                    </div>
                    {showClaim || unlockableAmount ? (
                      <div
                        className={`${"button"} ${styles.claim}`}
                        style={{ minWidth: "auto" }}
                      >
                        <span onClick={() => ClaimIdo()}>Claim</span>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <div
                  className="button"
                  disabled={connecting}
                  style={{ minWidth: "auto" }}
                  onClick={() => (wallet ? disconnect(wallet) : connect())}
                >
                  {connecting
                    ? "Connecting"
                    : wallet
                    ? "Disconnect"
                    : "Connect Wallet"}
                </div>
              )}
            </div>
          </div>
        )
      ) : null}

      {/* {showSignIn ? (
        <div className="promptBox">
          <div className="boxMain">
            <div className="boxInfo">
              Bit Protocol is the first and only encrypted DeFi protocol for
              Web3 that provides intelligent privacy features. Only your
              personal signature grants access to individual data. To streamline
              the signing process and enhance user experience, you are required
              to use EIP-712 to "sign in" once per day.
            </div>
            <div className="button rightAngle" onClick={() => signIn()}>
              sign in
            </div>
          </div>
        </div>
      ) : null} */}

      {/* {showSignInToken ? (
        <div className="promptBox">
          <div className="boxMain">
            <div className="boxInfo">
              Please sign in your wallet's pop-up to allow Bit Protocol to
              access your bitUSD balance.
            </div>
            <div className="button rightAngle" onClick={() => signInToken()}>
              sign in
            </div>
          </div>
        </div>
      ) : null} */}

      {showClaim2 ? (
        <div className="infoTip">
          <div className="info infoNoPadding">
            <div className="infoTitle">
              <div>
                <img className="bitUSD" src="/dapp/bitUSD.svg" alt="bitUSD" />
                <p>Claim $bitGOV</p>
              </div>
              <div className="close">
                <img
                  src="/icon/close.svg"
                  alt="icon"
                  onClick={() => setshowClaim2(false)}
                />
              </div>
            </div>
            <div className="data">
              <div className="dataItem">
                <p>Total available</p>
                <span>{formatNum(totalLocked)} $bitGOV</span>
              </div>
              <div className="dataItem">
                <p>Claimed</p>
                <span>{formatNum(Claimed)} $bitGOV</span>
              </div>
              <div className="dataItem">
                <p>Remaining</p>
                <span>{formatNum(Remaining)} $bitGOV</span>
              </div>
              <div className="dataItem">
                <p>Claimable</p>
                <span>{formatNum(unlockableAmount)} $bitGOV</span>
              </div>
              <div
                className={
                  unlockableAmount > 0.001
                    ? "button rightAngle height"
                    : "button rightAngle height disable noactive"
                }
                style={{ marginTop: "10px" }}
                onClick={() => Claim()}
              >
                Claim
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {currentState ? <Wait></Wait> : null}
    </>
  );
}
