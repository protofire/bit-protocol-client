import styles from '../../styles/dapp.module.scss';
import { useRouter } from 'next/router';
import { formatNumber } from '../../utils/helpers';

export default function Collateral({ props }) {
  const router = useRouter();

  const {
    mcr,
    borrowingRate,
    interestRate,
    redemptionRate,
    mintedBitUSD,
    tvl,
    address,
    collateral: { name, logo },
    maxSystemDebt,
  } = props;

  return (
    <div className={styles.earnInfo}>
      <div className={styles.CoinType}>
        <div className={styles.collateral}>
          <img src={`/dapp/${logo}`} alt="rose" />
          {name}
        </div>
      </div>
      <div className={styles.data}>
        <div className={styles.dataItem}>
          <p>Total Value Locked</p>
          <span>${formatNumber(tvl)}</span>
        </div>
        <div className={styles.dataItem}>
          <p>Minted bitUSD</p>
          <span>
            ${formatNumber(mintedBitUSD)}/{formatNumber(maxSystemDebt)}
          </span>
        </div>
        <div className={styles.dataItem}>
          <p>MCR</p>
          <span>{mcr}%</span>
        </div>
        <div className={styles.dataItem}>
          <p>Interest rate</p>
          <span>{interestRate}%</span>
        </div>
        <div className={styles.dataItem}>
          <p>Borrowing fee</p>
          <span>{borrowingRate}%</span>
        </div>
        <div className={styles.dataItem}>
          <p>Redemption rate</p>
          <span>{redemptionRate}%</span>
        </div>
      </div>
      <div
        className={styles.button}
        onClick={() =>
          router.push({
            pathname: '/Vault/[vault]',
            query: { vault: address },
          })
        }
      >
        <div className="button rightAngle height">Choose collateral</div>
      </div>
    </div>
  );
}
