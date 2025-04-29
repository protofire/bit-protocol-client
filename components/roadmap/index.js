import styles from './roadmap.module.scss';

const Roadmap = () => {
  const roadmapItems = [
    {
      quarter: 'Q1',
      title: 'Protocol Launch',
      items: [
        'v1 Launch',
        '$1M BitUSD Minted',
        '3 Types of Collateral'
      ]
    },
    {
      quarter: 'Q2',
      title: 'New Collateral & Cross-Chain',
      items: [
        'Crosschain v2 Launch (Flashloans)',
        'Point System',
        'FrontEnd Operators',
        '+3 Chains',
        '+10 Types of Collateral'
      ]
    },
    {
      quarter: 'Q3',
      title: 'Governance',
      items: [
        'Global & Local Governance',
        '+10 Chain Deployment'
      ]
    },
    {
      quarter: 'Q4',
      title: 'Credit & Lending',
      items: [
        'Seed Round (3M)',
        'Uncollateralized/Unsecured Lending',
        'Credit Score Implementation'
      ]
    }
  ];

  return (
    <div className={styles.roadmap}>
      <h2>ROADMAP 2025</h2>
      <p>Updated on 24 April 2025</p>
      <div className={styles.timeline}>
        <div className={styles.line}>
          {roadmapItems.map((item, index) => (
            <div key={index} className={styles.dot} />
          ))}
        </div>
        <div className={styles.items}>
          {roadmapItems.map((item, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.quarter}>{item.quarter} {item.title}</div>
              <ul>
                {item.items.map((listItem, i) => (
                  <li key={i}>{listItem}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap; 