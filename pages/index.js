import styles from "../styles/Home.module.scss";
import Header from "../components/header";
import Footer from "../components/footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   router.push("/Vault");
  // }, [])

  useEffect(() => {
    AOS.init({
      duration: 1000,
      delay: 100,
      easing: "ease-in-out",
    });
  });

  const [faqList, setFaqList] = useState([
    {
      questions: "What is Bit Protocol?",
      answer:
        "<p>Bit Protocol is a decentralized borrowing protocol that allows you to borrow against Oasis Network’s native token ROSE, which is used as collateral. Loans are taken out in bitUSD - a $1 pegged private and confidential decentralized stablecoin.</p>",
      hide: true,
    },
    {
      questions: "How do I use Bit Protocol?",
      answer:
        "<p>To use Bit Protocol and take out a bitUSD loan, earn rewards, or vote on governance proposals, visit the Bit Protocol website, and select “Launch App” within the interface and connect a Web3 wallet.</p>",
      hide: true,
    },
    {
      questions: "How does Bit Protocol work?",
      answer:
        "<p>Bit Protocol is a private and confidential decentralized borrowing protocol. Bit Protocol smart contracts define a standard way to deposit collateral, mint bitUSD, and liquidate positions. A vault is where you take out and maintain your loans against your collateral (i.e. ROSE).</p><p>For a more in-depth description, see the Bit Protocol documentation available on Github and via the Bit Protocol website.</p> ",
      hide: true,
    },
    {
      questions: "What are the key benefits of using Bit Protocol?",
      answer:
        "<p>Bit Protocol offers a way to borrow bitUSD privately, confidentiality and in a fully decentrazied capital-efficient borrowing manner.</p><p>- A collateral ratio of just 120%<br/>- Directly redeemable - bitUSD can be redeemed at face value for the underlying collateral, ROSE always and at any time<br/>- Censorship resistant</p><p>Bit Protocol introduces the new era of stablecoins. bitUSD is the first privacy-focused digital currency built on the innovative Oasis Sapphire confidential EVM. Merging the stability of traditional stablecoins with unparalleled transactional confidentiality, bitUSD addresses the critical market need for privacy in DeFi. </p>",
      hide: true,
    },
    {
      questions: "How can I earn money on Bit Protocol?",
      answer:
        "<p>There are a number of different ways to generate revenue using Bit Protocol:<p/><p>1. Deposit bitUSD into the Stability Pool and earn liquidation fees, a share of liquidated collateral and bitGOV rewards.<br/>2. Stake bitGOV and earn the revenue from protocol generated fees.<br/>3. Mint bitUSD and maintain a debt position and meet dLP requirements to earn bitGOV rewards.<br/>4. Provide Liquidity to the bitGOV/ROSE LP and meet dLP thresholds to earn bitGOV rewards.</p>",
      hide: true,
    },
  ]);

  const toggleAnswer = (item, index, event) => {
    var answer = event.currentTarget.nextSibling;
    if (answer.style.display === "block") {
      answer.style.display = "none";
    } else {
      answer.style.display = "block";
    }

    const data = [...faqList];
    data[index].hide = !item.hide;
    setFaqList(data);
  };

  const [id, setId] = useState(null);
  const updateId = (uid) => {
    setId(uid);
  };
  useEffect(() => {
    if (id) {
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [id]);

  return (
    <>
      <Header updateId={updateId} menu="Home"></Header>
      <div className={styles.home}>
        <div className={`${styles.banner} ${"main"}`}>
          <img
            className="h5Show"
            style={{ width: "100%" }}
            src="/home/bannerBg.svg"
            alt="banner"
          />
          <div className={styles.bannerMain}>
            <div className={styles.bannerTxt}>
              <h2>bitUSD Privacy Focused Omnichain Stablecoin</h2>
              <p>
                The first privacy-focused stablecoin built on Oasis Sapphire EVM
                Decentralised, Confidential and Democratized
              </p>

              {parseInt(new Date().getTime() / 1000) < 1709730000 ? (
                <div className="button soon">
                  <span className="show">Deposit Collateral</span>
                  <span className="hide">Launching Soon</span>
                </div>
              ) : (
                <div div className="button">
                  <Link href="/Vault">
                    <span>Deposit Collateral</span>
                  </Link>
                </div>
              )}
            </div>
            <div className={styles.bannerImg}>
              {/* <img className={styles.img01} src="/home/banner_right.png" alt="banner" />
              <img className={styles.img02} src="/home/banner_bottom.svg" alt="banner" /> */}
            </div>
          </div>
        </div>
        <div className={`${styles.works} ${"main"}`} id="works">
          <h2>How Bit Protocol Works</h2>
          <div className={styles.worksList}>
            <div className={styles.worksItem}>
              {/* <img src='/home/mint.svg' alt='mint' />  data-aos="fade-right"*/}
              <div className={styles.mintDiv}>
                <img
                  src="/home/mint02.svg"
                  alt="mint"
                  className={styles.img01}
                />
                <img
                  src="/home/mint01.svg"
                  alt="mint"
                  className={styles.img02}
                />
              </div>
              <p>Mint bitUSD</p>
              <span>
                Deposit ROSE as your collateral and effortlessly mint bitUSD.
                More collateral assets will be supported by Bit Protocol in the
                future
              </span>
            </div>
            <div className={styles.worksItem}>
              <img
                src="/home/voting.svg"
                alt="voting"
                className={styles.votingImg}
              />
              <p>Voting</p>
              <span>
                Lock your bitGOV tokens into veBitGOV and vote to direct
                emissions and unlock additional incentive benefits.
              </span>
            </div>
            <div className={styles.worksItem}>
              <img src="/home/utility.svg" alt="utility" />
              <p>Utility</p>
              <span>
                Earn bitGOV token by minting bitUSD, managing your loan, or
                contributing to the stability pool. Enhance your yields further
                by participating in the dLP or locking into veBitGOV.
              </span>
            </div>
          </div>
          <div className={styles.privacy}>
            <div>
              <h2>
                Privacy-Powered
                <br />
                Stablecoin <span>bitUSD</span>
                <br />
                Revolution on Oasis Sapphire
              </h2>
              <div className={styles.redBorder}>
                <p style={{ marginBottom: "30px" }}>
                  bitUSD, built on Oasis Sapphire EVM, is the first
                  privacy-focused stablecoin, bridging the gap between privacy
                  and stability in DeFi.{" "}
                </p>
                <p>
                  Set to revolutionize the $3 trillion stablecoin market, bitUSD
                  paves the way for a new secure, private, and expansive DeFi
                  ecosystem with its innovative approach and omnichain
                  functionality to maximise scalability.
                </p>
              </div>
            </div>
            <div className={styles.vUSD}>
              {/* <img
                className={styles.img01}
                src="/home/vusd_bg.svg"
                alt="bitUSD"
              /> */}
              <img
                className={styles.img03}
                src="/dapp/bitUSD.svg"
                alt="bitUSD"
              />
              {/* <img className={styles.img02} src="/home/vusd.svg" alt="bitUSD" /> */}
            </div>
          </div>
          <div className={styles.faq} id="faq">
            <h2 style={{ textAlign: "center" }}>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {faqList.map((item, index) => (
                <div className={styles.faqItem} key={index}>
                  <div
                    className={styles.question}
                    onClick={toggleAnswer.bind(this, item, index)}
                  >
                    <p>{item.questions}</p>
                    <img
                      alt="icon"
                      src={
                        item.hide ? "/home/iconarr.svg" : "/home/iconarr_s.svg"
                      }
                      className={item.hide ? styles.show : styles.hidden}
                    />
                  </div>
                  <div
                    className={styles.answer}
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer updateId={updateId} menu="Home"></Footer>
    </>
  );
}
