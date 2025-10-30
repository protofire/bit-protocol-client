import styles from '../styles/Features.module.scss'

const Features = () => {
  return (
    <div className={styles.features}>
      <div className={styles.container}>
        <div className={styles.featureBox}>
          <div className={styles.iconWrapper}>
            <img src="/icons/multi-collateral.svg" alt="Multi-Collateral" />
          </div>
          <h3>Multi-Collateral</h3>
          <p>
            Bit Protocol allows the widest range of collateral accepted such as native tokens, 
            Liquid staking tokens, crypto treasury bonds, high liquid memecoins and even meme AI Agents.
          </p>
        </div>
        <div className={styles.featureBox}>
          <div className={styles.iconWrapper}>
            <img src="/icons/multi-chain.svg" alt="Multi-Chain" />
          </div>
          <h3>Multi-Chain</h3>
          <p>
            Bit Protocol gives EVM Chains the ability to bring a native Defi building block for their ecosystem, 
            that foster & boosts leverage on present and future ecosystem tokens.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Features 