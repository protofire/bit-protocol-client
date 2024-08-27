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
          <div className={styles.pwr}>
            Powered by
            <img src="/home/pwr.svg" alt="pwr" width="135" height="35" />
          </div>
          <div className={styles.list}>
            <span onClick={() => goMenu("works")}>How it works</span>
            <Link target="_blank" href="" rel="nofollow noopener noreferrer">
              <span>Docs</span>
            </Link>
            <div className="menu-container">
              <span>Socials</span>
              <div
                className="dropdown-menu"
                style={{ bottom: "120%", top: "auto" }}
              >
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
            <Link target="_blank" href="" rel="nofollow noopener noreferrer">
              <span>Disclaimer</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
