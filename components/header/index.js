import Head from "next/head";
import styles from "./index.module.scss";
import { useEffect, useState, useContext } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { BlockchainContext } from "../../hook/blockchain";
import Link from "next/link";
import { useRouter } from "next/router";
import { formatNumber } from "../../utils/helpers";
import { CHAIN_ID } from "../../hook/wagmi";

export default function Header(props) {
  const { menu, type, dappMenu } = props;
  const router = useRouter();
  const account = useAccount();

  const {
    connectors,
    connect,
    error: connectError,
  } = useConnect({
    onError(error) {
      console.error("Connect error:", error);
    },
    onSuccess(data) {
      setOpenConnect(false);
    },
  });
  useEffect(() => {
    const checkConnectors = async () => {
      for (const connector of connectors) {
        try {
          const isReady = await connector
            .getProvider()
            .then(() => true)
            .catch(() => false);
          console.log(`Connector ${connector.name} ready status:`, isReady);
        } catch (error) {
          console.log(`Connector ${connector.name} check failed:`, error);
        }
      }
    };

    checkConnectors();
  }, [connectors]);
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();
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
      // FOR STAGING ONLY / FOR PRODUCTION SHOULD BE OASIS SAPPHIRE MAINNET 23294
      if (account.chainId !== 23294) {
        switchChain({ chainId: 23294 });
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

  const [isConnecting, setIsConnecting] = useState(false);
  const [hasAttemptedSwitch, setHasAttemptedSwitch] = useState(false);

  const handleChainAddition = async (provider) => {
    try {
      // Check if chain is already added
      try {
        const chain = await provider.request({
          method: "eth_chainId",
          params: [],
        });

        if (chain === `0x${CHAIN_ID.SAPPHIRE.toString(16)}`) {
          return true;
        }
      } catch (error) {
        console.error("Error checking chain:", error);
      }

      // Add the network
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${CHAIN_ID.SAPPHIRE.toString(16)}`,
            chainName: "Oasis Sapphire",
            nativeCurrency: {
              name: "ROSE",
              symbol: "ROSE",
              decimals: 18,
            },
            rpcUrls: ["https://sapphire.oasis.dev"],
            blockExplorerUrls: ["https://explorer.sapphire.oasis.dev"],
          },
        ],
      });

      return true;
    } catch (error) {
      console.error("Error adding chain:", error);
      if (error.code === 4001) {
        throw new Error("User rejected adding the network");
      }
      throw error;
    }
  };

  const handleConnect = async (connector) => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);

      if (connector.name === "Coinbase Wallet") {
        try {
          // Get the provider
          const provider = await connector.getProvider();

          if (!provider) {
            throw new Error("Unable to get Coinbase Wallet provider");
          }

          // Try to add the chain first, but don't fail if it errors
          try {
            await handleChainAddition(provider);
          } catch (error) {
            // Log but don't throw for chain addition errors
            console.warn("Chain addition warning:", error.message);
            // Only throw if it's a user rejection
            if (error.code === 4001) {
              throw error;
            }
          }

          // Request accounts first
          const accounts = await provider.request({
            method: "eth_requestAccounts",
          });

          if (!accounts || accounts.length === 0) {
            throw new Error("No accounts received");
          }

          // Then attempt the wagmi connection
          await connect({
            connector,
            chainId: CHAIN_ID.SAPPHIRE,
          });

          // Wait a bit for the connection to be established
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Try switching to the correct chain
          try {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: `0x${CHAIN_ID.SAPPHIRE.toString(16)}` }],
            });
          } catch (switchError) {
            // Ignore switch errors - the chain might already be added
            console.warn("Chain switch warning:", switchError.message);
          }

          setOpenConnect(false);
        } catch (error) {
          console.error("Coinbase connection error:", error);

          // Only throw for actual connection errors
          if (error.code === 4001) {
            throw new Error("Connection rejected by user");
          } else if (
            error.message?.includes("provider is undefined") ||
            error.message?.includes("Unable to get Coinbase Wallet provider")
          ) {
            throw new Error(
              "Please install the Coinbase Wallet extension or open in Coinbase Wallet browser"
            );
          } else if (!error.message?.includes("chain")) {
            // Don't throw for chain-related errors
            throw error;
          }

          if (error.message?.includes("chain")) {
            setOpenConnect(false);
          }
        }
      } else {
        // Handle other wallets
        await connect({
          connector,
          chainId: CHAIN_ID.SAPPHIRE,
        });
        setOpenConnect(false);
      }
    } catch (error) {
      console.error("Connection error:", error);
      let errorMessage = "Failed to connect wallet. ";

      if (error.code === 4001) {
        errorMessage += "User rejected the connection.";
      } else if (error.message?.includes("provider")) {
        errorMessage +=
          "Please install the Coinbase Wallet extension or open in Coinbase Wallet browser.";
      } else {
        errorMessage += error.message || "Please try again.";
      }

      // Only show alert for non-chain-related errors
      if (!error.message?.includes("chain")) {
        alert(errorMessage);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (account.status === "connected" && !hasAttemptedSwitch) {
      const switchChainIfNeeded = async () => {
        if (account.chainId !== CHAIN_ID.SAPPHIRE) {
          try {
            setHasAttemptedSwitch(true);
            await switchChain({ chainId: CHAIN_ID.SAPPHIRE });
          } catch (error) {
            console.error("Chain switch error:", error);
            // Don't throw, just log the error
          }
        }
      };

      switchChainIfNeeded();
    }
  }, [account.status, account.chainId, hasAttemptedSwitch]);

  // Reset switch attempt flag on disconnect
  useEffect(() => {
    if (account.status === "disconnected") {
      setHasAttemptedSwitch(false);
    }
  }, [account.status]);

  useEffect(() => {
    if (account.isConnected) {
      setOpenConnect(false);
    }
  }, [account.isConnected]);

  const handleDisconnect = async () => {
    try {
      // Clear local storage
      localStorage.removeItem(`signInAuth-${account.chainId}`);
      localStorage.removeItem(`signInToken-${account.chainId}`);

      // Reset all relevant states
      setShowSignIn(false);
      setShowSignInToken(false);
      setOpenConnect(false);
      setOpenNetworks(false);
      setHasAttemptedSwitch(false);

      // Perform the disconnect
      await disconnect();

      // Force a page reload after a short delay to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Disconnect error:", error);
      alert("Error disconnecting. Please try again.");
    }
  };

  useEffect(() => {
    if (account.status === "disconnected") {
      setHasAttemptedSwitch(false);
      setShowSignIn(false);
      setShowSignInToken(false);

      // Clear auth storage
      localStorage.removeItem(`signInAuth-${account.chainId}`);
      localStorage.removeItem(`signInToken-${account.chainId}`);
    }
  }, [account.status, account.chainId]);

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
              {/* <div className="menu-container">
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
              </div> */}
              {/* <Link target="_blank" href="" rel="nofollow noopener noreferrer">
                <span>Disclaimer</span>
              </Link> */}
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
                          onClick={handleDisconnect}
                        >
                          Disconnect
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="button"
                      style={{
                        minWidth: "auto",
                        opacity: isConnecting ? 0.7 : 1,
                      }}
                      onClick={() => !isConnecting && setOpenConnect(true)}
                    >
                      {isConnecting ? "Connecting..." : "Connect Wallet"}
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
              />
            </div>
            {connectors.map((connector) => (
              <div
                className="divBtn"
                key={connector.uid}
                onClick={() => {
                  if (!isConnecting) {
                    handleConnect(connector);
                  }
                }}
                id={"connect-" + connector.id}
                style={{
                  opacity: isConnecting ? 0.5 : 1,
                  cursor: isConnecting ? "not-allowed" : "pointer",
                }}
              >
                {connector.name === "Injected (Sapphire)"
                  ? "Browser wallet (Sapphire)"
                  : connector.name === "Injected"
                  ? "Browser wallet"
                  : connector.name}
                {isConnecting &&
                  connector.name === "Coinbase Wallet" &&
                  " (Connecting...)"}

                {connector.name === "Coinbase Wallet" ? (
                  <img
                    className={styles.close}
                    src="/icon/coinbase.svg"
                    alt="close"
                  />
                ) : (
                  <img
                    className={styles.close}
                    src="/icon/browserWallet.svg"
                    alt="close"
                  />
                )}
              </div>
            ))}

            {connectError && (
              <div
                style={{ color: "red", marginTop: "10px", textAlign: "center" }}
              >
                {connectError.message}
              </div>
            )}
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
            <div
              className="button"
              onClick={async () => {
                try {
                  await signDebtToken();
                } catch (error) {
                  console.error("Failed to sign:", error);
                }
              }}
            >
              Sign in
            </div>
          </div>
        </div>
      ) : null}
      {/* {status === "pending" ? <Wait></Wait> : null} */}
    </>
  );
}
