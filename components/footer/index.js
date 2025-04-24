import styles from './index.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Footer(props) {
  const { menu } = props;
  const router = useRouter();

  const goMenu = (id) => {
    if (menu == 'Home') {
      props.updateId(id);
    } else {
      router.push('/#' + id);
    }
  };
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.leftSection}>
          <div className={styles.logoSection}>
            <div className={styles.logo} onClick={() => goMenu('vine')}>
              <img
                style={{ width: '50px', height: '35px', cursor: 'pointer' }}
                src="/BIT-logo.svg"
                alt="logo"
              />
            </div>
            <p className={styles.disclaimer}>
              Bit Protocol is a decentralized, open-source, self-executing smart contract system. [BIT LABS] does not control, operate, or manage the Bit Protocol, bitUSD stablecoin, or BIT token. The Protocol is run by its users and DAO. No entity herein provides financial services, investment advice, or custody of assets. Use at your own risk.
            </p>
          </div>
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
              <div
                className="dropdown-menu"
                style={{ bottom: '120%', top: 'auto' }}
              >
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
                  href="https://medium.com/@bitprotocol"
                  rel="nofollow noopener noreferrer"
                >
                  Medium
                </Link>
              </div>
            </div>
            <span onClick={() => goMenu('faq')}>FAQ</span>
            <div className={styles.some}>
              <Link
                href="https://github.com/protofire/bit-protocol-contracts"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className={styles.iconLink}
              >
                <img
                  src="/icon/github.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className={styles.whiteIcon}
                />
              </Link>
              <Link
                href="https://defillama.com/protocol/bitusd"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className={styles.iconLink}
              >
                <img
                  src="/icon/defillama.svg"
                  alt="DefiLlama"
                  width={20}
                  height={20}
                  className={styles.whiteIcon}
                />
              </Link>
            </div>
          </div>
        </div>
        {/* <div className={styles.rightSection}>
          <Link
            href="https://github.com/bitprotocol"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className={styles.iconLink}
          >
            <img src="/icon/github.svg" alt="GitHub" width={20} height={20} />
          </Link>
          <Link
            href="https://defillama.com/protocol/bit-protocol"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className={styles.iconLink}
          >
            <img
              src="/icon/defillama.svg"
              alt="DefiLlama"
              width={20}
              height={20}
            />
          </Link>
        </div> */}
      </div>
    </>
  );
}
