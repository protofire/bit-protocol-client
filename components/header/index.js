import Head from 'next/head';
import styles from './index.module.scss';
import { useEffect, useState, useContext } from 'react';
import { useAccount, useConnect, useSwitchChain } from 'wagmi';
import { BlockchainContext } from '../../hook/blockchain';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { formatNumber } from '../../utils/helpers';
import { CHAIN_ID } from '../../hook/wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
      console.error('Connect error:', error);
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
          // console.log(`Connector ${connector.name} ready status:`, isReady);
        } catch (error) {
          console.log(`Connector ${connector.name} check failed:`, error);
        }
      }
    };

    checkConnectors();
  }, [connectors]);

  const { chains, switchChain } = useSwitchChain();
  const [openHealth, setOpenHealth] = useState(false);

  const { tcr, totalPricedCollateral, totalSystemDebt } =
    useContext(BlockchainContext);

  const [open, setOpen] = useState(true);
  const [openConnect, setOpenConnect] = useState(false);
  // const [openNetworks, setOpenNetworks] = useState(false);

  const goMenu = (id) => {
    if (menu == 'Home') {
      props.updateId(id);
    } else {
      router.push('/#' + id);
    }
  };

  useEffect(() => {
    if (account.status === 'connected' && menu !== 'Home') {
      // FOR STAGING ONLY / FOR PRODUCTION SHOULD BE OASIS SAPPHIRE MAINNET 23294
      if (account.chainId !== 23294) {
        switchChain({ chainId: 23294 });
      }
    }
  }, [account, menu]);

  const openH5Menu = async () => {
    setOpen(!open);
  };

  const goMenu_h5 = (id) => {
    setOpen(true);
    if (menu == 'Home') {
      props.updateId(id);
    } else {
      router.push('/#' + id);
    }
  };

  const [hasAttemptedSwitch, setHasAttemptedSwitch] = useState(false);

  // const handleChainAddition = async (provider) => {
  //   try {
  //     // Check if chain is already added
  //     try {
  //       const chain = await provider.request({
  //         method: "eth_chainId",
  //         params: [],
  //       });

  //       if (chain === `0x${CHAIN_ID.SAPPHIRE.toString(16)}`) {
  //         return true;
  //       }
  //     } catch (error) {
  //       console.error("Error checking chain:", error);
  //     }

  //     // Add the network
  //     await provider.request({
  //       method: "wallet_addEthereumChain",
  //       params: [
  //         {
  //           chainId: `0x${CHAIN_ID.SAPPHIRE.toString(16)}`,
  //           chainName: "Oasis Sapphire",
  //           nativeCurrency: {
  //             name: "ROSE",
  //             symbol: "ROSE",
  //             decimals: 18,
  //           },
  //           rpcUrls: ["https://sapphire.oasis.dev"],
  //           blockExplorerUrls: ["https://explorer.sapphire.oasis.dev"],
  //         },
  //       ],
  //     });

  //     return true;
  //   } catch (error) {
  //     console.error("Error adding chain:", error);
  //     if (error.code === 4001) {
  //       throw new Error("User rejected adding the network");
  //     }
  //     throw error;
  //   }
  // };

  useEffect(() => {
    if (account.status === 'connected' && !hasAttemptedSwitch) {
      const switchChainIfNeeded = async () => {
        if (account.chainId !== CHAIN_ID.SAPPHIRE) {
          try {
            setHasAttemptedSwitch(true);
            await switchChain({ chainId: CHAIN_ID.SAPPHIRE });
          } catch (error) {
            console.error('Chain switch error:', error);
            // Don't throw, just log the error
          }
        }
      };

      switchChainIfNeeded();
    }
  }, [account.status, account.chainId, hasAttemptedSwitch]);

  // Reset switch attempt flag on disconnect
  useEffect(() => {
    if (account.status === 'disconnected') {
      setHasAttemptedSwitch(false);
    }
  }, [account.status]);

  useEffect(() => {
    if (account.isConnected) {
      setOpenConnect(false);
    }
  }, [account.isConnected]);

  useEffect(() => {
    if (account.status === 'disconnected') {
      setHasAttemptedSwitch(false);
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
            {type == 'dapp' ? (
              <div className={styles.main}>
                <div
                  className={styles.health}
                  onClick={() => setOpenHealth(true)}
                >
                  <img src="/icon/heart.svg" alt="heart"></img>
                  {account.status === 'connected'
                    ? tcr >= 1.1579208923731621e61
                      ? '∞'
                      : `${formatNumber(tcr)}%`
                    : 0}
                </div>
              </div>
            ) : null}
          </div>

          {type == 'dapp' ? (
            <div className={styles.dappList}>
              <Link
                className={dappMenu == 'Vault' ? `${styles.active}` : null}
                href="/Vault"
                rel="nofollow noopener noreferrer"
              >
                <span>Vaults</span>
              </Link>
              <Link
                className={dappMenu == 'Earn' ? `${styles.active}` : null}
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
                className={dappMenu == 'Redeem' ? `${styles.active}` : null}
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
              <span onClick={() => goMenu('works')}>How it works</span>
              <Link
                target="_blank"
                href="https://bitprotocol.gitbook.io/bitprotocol"
                rel="nofollow noopener noreferrer"
              >
                <span>Docs</span>
              </Link>
              <div className="menu-container">
                <span>Socials</span>
                <div className="dropdown-menu">
                  <Link
                    target="_blank"
                    href="https://x.com/BitUSD_finance"
                    rel="nofollow noopener noreferrer"
                  >
                    Twitter/X
                  </Link>
                  <Link
                    target="_blank"
                    href="https://t.me/bitprotocolofficial"
                    rel="nofollow noopener noreferrer"
                  >
                    Telegram Community
                  </Link>
                  <Link
                    target="_blank"
                    href="https://medium.com/@bitusdprotocol"
                    rel="nofollow noopener noreferrer"
                  >
                    Medium
                  </Link>
                </div>
              </div>
              <span onClick={() => goMenu('faq')}>FAQ</span>
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
            {type != 'dapp' ? (
              <div className="button">
                <Link href="/Vault">
                  <span>Launch App</span>
                </Link>
              </div>
            ) : (
              <>
                {/* {account.status === "connected" && (
                  <div className="h5None">
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
                  </div>
                )} */}

                <div className="h5None">
                  <ConnectButton
                    accountStatus="avatar"
                    chainStatus="none"
                    showBalance={true}
                  />
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

      {!open ? (
        type == 'dapp' ? (
          <div className={styles.h5Block}>
            <div className={styles.h5Item}>
              <Link href="/Vault" rel="nofollow noopener noreferrer">
                <span>Vault</span>
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
            </div>
            <div className={styles.h5Item}>
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
            {/* <div className={styles.h5Item}>
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
            </div> */}
            <div className="h5user">
              <ConnectButton
                accountStatus="avatar"
                chainStatus="name"
                showBalance={true}
              />
            </div>
          </div>
        ) : (
          <div className={styles.h5Block}>
            <div className={styles.h5Item} onClick={() => goMenu_h5('works')}>
              How it works
            </div>
            <div className={styles.h5Item}>
              <Link
                target="_blank"
                href="https://bitprotocol.gitbook.io/bitprotocol"
                rel="nofollow noopener noreferrer"
              >
                <span>Docs</span>
              </Link>
            </div>
            <div className={`${styles.h5Item}`}>
              <div>Socials</div>
              <div className={styles.socials}>
                <div>
                  <Link
                    target="_blank"
                    href="https://x.com/BitUSD_finance"
                    rel="nofollow noopener noreferrer"
                  >
                    Twitter/X
                  </Link>
                </div>
                <div>
                  <Link
                    target="_blank"
                    href="https://t.me/bitprotocolofficial"
                    rel="nofollow noopener noreferrer"
                  >
                    Telegram Community
                  </Link>
                </div>
                <div>
                  <Link
                    target="_blank"
                    href="https://medium.com/@bitusdprotocol"
                    rel="nofollow noopener noreferrer"
                  >
                    Medium
                  </Link>
                </div>
              </div>
            </div>
            <div className={styles.h5Item} onClick={() => goMenu_h5('faq')}>
              FAQ
            </div>

            <div className="h5user">
              <ConnectButton
                accountStatus="avatar"
                chainStatus="name"
                showBalance={true}
              />
            </div>
          </div>
        )
      ) : null}

      {/* {openNetworks ? (
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
      ) : null} */}
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
              <div className="data" style={{ borderTop: 'none' }}>
                <div className="dataItem">
                  <p>Total Collateral Value</p>
                  <span>
                    {account.status === 'connected'
                      ? `$${formatNumber(totalPricedCollateral)}`
                      : 0}
                  </span>
                </div>
                <div className="dataItem">
                  <p>Total Debt Value</p>
                  <span>
                    {account.status === 'connected'
                      ? `$${formatNumber(totalSystemDebt)}`
                      : 0}
                  </span>
                </div>
                <div className="dataItem">
                  <p>TCR</p>
                  <span>
                    {account.status === 'connected'
                      ? tcr >= 1.1579208923731621e61
                        ? '∞'
                        : `${formatNumber(tcr)}%`
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
