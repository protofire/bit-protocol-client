import styles from "./index.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Footer(props) {
  const { menu } = props;
  const router = useRouter();

  const goMenu = (id) => {
    if (menu == "Home") {
      props.updateId(id);
    } else {
      router.push("/#" + id);
    }
  };
  return (
    <>
      <div className={styles.footer}>
        <div>
          <div className={styles.logo} onClick={() => goMenu("vine")}>
            <img
              style={{ width: "50px", height: "35px", cursor: "pointer" }}
              src="/bitusd-logo.svg"
              alt="logo"
            ></img>
          </div>
          <div className={styles.list}>
            <span onClick={() => goMenu("works")}>How it works</span>
            {/* <div className='tooltipMain'>
                            <span>Key features</span>
                            <div className='tooltip'>LAUNCHING SOON</div>
                        </div> */}
            <Link
              target="_blank"
              href="https://vine-money.gitbook.io/vine-money/"
              rel="nofollow noopener noreferrer"
            >
              <span>Docs</span>
            </Link>
            {/* <span>Whitepaper</span> */}
            {/* <div className='tooltipMain'>
                            <span>Socials</span>
                            <div className='tooltip'>LAUNCHING SOON</div>
                        </div> */}
            <div className="menu-container">
              <span>Socials</span>
              <div
                className="dropdown-menu"
                style={{ bottom: "120%", top: "auto" }}
              >
                <Link
                  target="_blank"
                  href="https://x.com/BitProtocol_"
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
                  href="https://medium.com/@bitusdprotocol"
                  rel="nofollow noopener noreferrer"
                >
                  Medium
                </Link>
              </div>
            </div>
            <span onClick={() => goMenu("faq")}>FAQ</span>
            {/* <div className="menu-container">
                            <span>IDO</span>
                            <div className="dropdown-menu" style={{ "bottom": "120%", "top": "auto" }}>
                                <Link href="/ido-countdown" rel="nofollow noopener noreferrer" style={{ "width": "135px" }}>IDO Countdown</Link>
                                <Link href="/ido-raffle" rel="nofollow noopener noreferrer" style={{ "width": "135px" }}>Whitelist Raffle</Link>
                            </div>
                        </div> */}
            {/* <Link
              target="_blank"
              href="/Vine_Money_Disclaimer.pdf"
              rel="nofollow noopener noreferrer"
            >
              <span>Disclaimer</span>
            </Link> */}
          </div>
        </div>
        {/* <div className={styles.iconList}>
                    <img src="/home/icon01.svg" alt="icon" />
                    <img src="/home/icon02.svg" alt="icon" />
                    <img src="/home/icon03.svg" alt="icon" />
                    <img src="/home/icon04.svg" alt="icon" />
                </div> */}
      </div>
    </>
  );
}
