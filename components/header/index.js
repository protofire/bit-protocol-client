import Head from "next/head";
import styles from "./index.module.scss";
import { useEffect, useState, useContext } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { BlockchainContext } from "../../hook/blockchain";
import Link from "next/link";
import { useRouter } from "next/router";
import { formatNumber } from "../../utils/helpers";
// import Wait from "../tooltip/wait";
// import tooltip from "../tooltip";

export default function Header(props) {
  const { menu, type, dappMenu } = props;

  const router = useRouter();

  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { chains, switchChain, status, error } = useSwitchChain();
  const [openHealth, setOpenHealth] = useState(false);

  const {
    signTrove,
    checkAuth,
    signDebtToken,
    checkAuthToken,
    tcr,
    totalPricedCollateral,
    totalSystemDebt,
  } = useContext(BlockchainContext);

  const [open, setOpen] = useState(true);
  const [openConnect, setOpenConnect] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignInToken, setShowSignInToken] = useState(false);
  const [openNetworks, setOpenNetworks] = useState(false);

  const goMenu = (id) => {
    if (menu == "Home") {
      props.updateId(id);
    } else {
      router.push("/#" + id);
    }
  };

  useEffect(() => {
    if (account.status === "connected" && menu !== "Home") {
      // FOR STAGING ONLY / FOR PRODUCTION SHOULD BE OASIS SAPPHIRE MAINNET
      if (account.chainId !== 23295) {
        switchChain({ chainId: 23295 });
      }
      setShowSignIn(!checkAuth());
      setShowSignInToken(!checkAuthToken());
    }
  }, [account, menu]);

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
          <div className={styles.logo}>
            <Link href="/" className={styles.logo}>
              <img
                src="/bitusd-logo.svg"
                alt="logo"
                className={styles.logoImg}
              />
            </Link>
            {type == "dapp" ? (
              <div className={styles.main}>
                <div
                  className={styles.health}
                  onClick={() => setOpenHealth(true)}
                >
                  <img src="/icon/heart.svg" alt="heart"></img>
                  {account.status === "connected"
                    ? tcr >= 1.1579208923731621e61
                      ? "∞"
                      : `${formatNumber(tcr)}%`
                    : 0}
                </div>
              </div>
            ) : null}
          </div>

          {type == "dapp" ? (
            <div className={styles.dappList}>
              <Link
                className={dappMenu == "Vault" ? `${styles.active}` : null}
                href="/Vault"
                rel="nofollow noopener noreferrer"
              >
                <span>Vaults</span>
              </Link>
              <Link
                className={dappMenu == "Earn" ? `${styles.active}` : null}
                href="/Earn"
                rel="nofollow noopener noreferrer"
              >
                <span>Earn</span>
              </Link>
              <Link
                className={dappMenu == "Reward" ? `${styles.active}` : null}
                href="/Reward"
                rel="nofollow noopener noreferrer"
              >
                <span>Reward</span>
              </Link>
              <Link
                className={dappMenu == "Lock" ? `${styles.active}` : null}
                href="/Lock"
                rel="nofollow noopener noreferrer"
              >
                <span>Lock</span>
              </Link>
              <Link
                className={dappMenu == "Redeem" ? `${styles.active}` : null}
                href="/Redeem"
                rel="nofollow noopener noreferrer"
              >
                <span>Redeem</span>
              </Link>
              <Link
                className={dappMenu == "Vote" ? `${styles.active}` : null}
                href="/Vote"
                rel="nofollow noopener noreferrer"
              >
                <span>Vote</span>
              </Link>
            </div>
          ) : (
            <div className={styles.list}>
              <span onClick={() => goMenu("works")}>How it works</span>
              <Link
                target="_blank"
                href="https://vine-money.gitbook.io/vine-money/"
                rel="nofollow noopener noreferrer"
              >
                <span>Docs</span>
              </Link>
              <div className="menu-container">
                <span>Socials</span>
                <div className="dropdown-menu">
                  <Link
                    target="_blank"
                    href="https://twitter.com/Vine_Money"
                    rel="nofollow noopener noreferrer"
                  >
                    Twitter/X
                  </Link>
                  <Link
                    target="_blank"
                    href="https://t.me/vinemoneyofficial"
                    rel="nofollow noopener noreferrer"
                  >
                    Telegram Community
                  </Link>
                  <Link
                    target="_blank"
                    href="https://t.me/vinemoneyann"
                    rel="nofollow noopener noreferrer"
                  >
                    Telegram Announcements
                  </Link>
                  <Link
                    target="_blank"
                    href="https://medium.com/@vine_money"
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
              <Link
                target="_blank"
                href="/Vine_Money_Disclaimer.pdf"
                rel="nofollow noopener noreferrer"
              >
                <span>Disclaimer</span>
              </Link>
            </div>
          )}

          <div className={styles.menuList}>
            {type != "dapp" ? (
              <div div className="button">
                <Link href="/Vault">
                  <span>Launch App</span>
                </Link>
              </div>
            ) : (
              <>
                {account.status === "connected" && (
                  <div
                    className={styles.network}
                    onClick={() => setOpenNetworks(true)}
                  >
                    {account.chainId === 19236265 ? (
                      <img src="/dapp/btc-logo.svg" alt="chainLogo" />
                    ) : (
                      <img src="/dapp/rose.svg" alt="chainLogo" />
                    )}
                    {account?.chain?.name}
                  </div>
                )}

                <div className="h5None">
                  {account.status === "connected" ? (
                    <div style={{ display: "flex", gap: "5px" }}>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <div className="account">
                          {account.address.slice(0, 5) +
                            ".." +
                            account.address.slice(-5)}
                        </div>
                        <div
                          className="button h5None"
                          style={{ minWidth: "auto" }}
                          onClick={() => disconnect()}
                        >
                          Disconnect
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="button"
                      style={{ minWidth: "auto" }}
                      onClick={() => setOpenConnect(true)}
                    >
                      Connect Wallet
                    </div>
                  )}
                </div>
              </>
            )}

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

      {openConnect ? (
        <div className="promptBox">
          <div className="boxMain">
            <div className="boxInfo">
              <h2>Connect a wallet</h2>
              <img
                className={styles.close}
                onClick={() => setOpenConnect(false)}
                src="/icon/close.svg"
                alt="close"
              ></img>
            </div>
            {connectors.map((connector) => (
              <div
                className="divBtn"
                key={connector.uid}
                onClick={() => {
                  connect({ connector });
                  setOpenConnect(false);
                }}
                id={"connect-" + connector.id}
              >
                {connector.name === "Injected (Sapphire)"
                  ? "Browser wallet (Sapphire)"
                  : connector.name === "Injected"
                  ? "Browser wallet"
                  : connector.name}

                {connector.name === "Coinbase Wallet" ? (
                  <img
                    className={styles.close}
                    src="/icon/coinbase.svg"
                    alt="close"
                  ></img>
                ) : (
                  <img
                    className={styles.close}
                    src="/icon/browserWallet.svg"
                    alt="close"
                  ></img>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {openNetworks ? (
        <div className="promptBox">
          <div className="boxMain">
            <div className="boxInfo">
              <h2>Switch network</h2>
              <img
                className={styles.close}
                onClick={() => setOpenNetworks(false)}
                src="/icon/close.svg"
                alt="close"
              ></img>
            </div>
            {chains.map((chain) => (
              <div
                className="divBtn"
                key={chain.id}
                onClick={() => {
                  switchChain({ chainId: chain.id });
                  setOpenNetworks(false);
                }}
                id={"switch-" + chain.id}
              >
                {chain.name}

                {chain.id === 23294 || 23295 ? (
                  <img
                    className={styles.close}
                    src="/dapp/rose.svg"
                    alt="close"
                  ></img>
                ) : (
                  <img
                    className={styles.close}
                    src="/dapp/btc-logo.svg"
                    alt="close"
                  ></img>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {openHealth ? (
        <div className="promptBox">
          <div className="boxMain">
            <div className="boxInfo">
              <h2>Protocol Statistics</h2>
              <img
                className={styles.close}
                onClick={() => setOpenHealth(false)}
                src="/icon/close.svg"
                alt="close"
              ></img>
            </div>
            <div className="infoMain">
              <div className="data" style={{ borderTop: "none" }}>
                <div className="dataItem">
                  <p>Total Collateral Value</p>
                  <span>
                    {account.status === "connected"
                      ? `$${formatNumber(totalPricedCollateral)}`
                      : 0}
                  </span>
                </div>
                <div className="dataItem">
                  <p>Total Debt Value</p>
                  <span>
                    {account.status === "connected"
                      ? `$${formatNumber(totalSystemDebt)}`
                      : 0}
                  </span>
                </div>
                <div className="dataItem">
                  <p>TCR</p>
                  <span>
                    {account.status === "connected"
                      ? tcr >= 1.1579208923731621e61
                        ? "∞"
                        : `${formatNumber(tcr)}%`
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showSignIn ? (
        <div className="promptSign">
          <div className="firstBox">
            <div className="infoBox">
              Bit Protocol is the first and only encrypted DeFi protocol for
              Web3 that provides intelligent privacy features. Only your
              personal signature grants access to individual data. To streamline
              the signing process and enhance user experience, you are required
              to use EIP-712 to "sign in" once per day.
            </div>
            <div className="button" onClick={() => signTrove()}>
              Sign in
            </div>
          </div>
        </div>
      ) : null}

      {showSignInToken ? (
        <div className="promptSign">
          <div className="firstBox">
            <div className="infoBox">
              Please sign in your wallet's pop-up to allow Bit Protocol to
              access your bitUSD balance.
            </div>
            <div className="button" onClick={() => signDebtToken()}>
              Sign in
            </div>
          </div>
        </div>
      ) : null}

      {/* {status === "pending" ? <Wait></Wait> : null} */}
    </>
  );
}
