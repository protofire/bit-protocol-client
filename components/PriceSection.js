import styles from '../styles/PriceSection.module.scss'

const PriceSection = () => {
  return (
    <div className={styles.priceSection}> 
      <div className={styles.lineWrapper} style={{ top: '20%' }}>
        <img src="line-price.svg" alt="" className={styles.animatedLine} />
        <img src="line-price.svg" alt="" className={styles.animatedLine} />
      </div>
      <div className={styles.priceContent}>
        <img 
          src="/dapp/bitUSD.svg"
          alt="bitUSD"
          className={styles.bitIcon} 
        />
        <span>1 BitUSD = $1</span>
      </div>
      <div className={styles.lineWrapper} style={{ top: '80%' }}>
        <img src="line-price.svg" alt="" className={styles.animatedLine} />
        <img src="line-price.svg" alt="" className={styles.animatedLine} />
      </div>
    </div>
  )
}

export default PriceSection 