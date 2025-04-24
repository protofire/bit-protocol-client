import styles from './partners.module.scss';

const Partners = () => {
  const partners = [
    // First row
    {
      name: 'Protofire',
      logo: '/partners/Protofire.svg',
      url: 'https://protofire.io'
    },
    {
      name: 'Midas',
      logo: '/partners/Midas.svg',
      url: 'https://midas.app'
    },
    {
      name: 'Accumulated Finance',
      logo: '/partners/AccumulatedFinance.png',
      url: 'https://accumulated.finance'
    },
    {
      name: 'Thorn',
      logo: '/partners/Thorn.png',
      url: 'https://thornprotocol.com'
    },
    // Second row
    {
      name: 'Neby',
      logo: '/partners/Neby.svg',
      url: 'http://neby.exchange'
    },
    {
      name: 'Via Labs',
      logo: '/partners/ViaLabs.svg',
      url: 'https://vialabs.io/'
    },
    {
      name: 'Chainlink',
      logo: '/partners/Chainlink.svg',
      url: 'https://chain.link'
    }
  ];

  // Split partners into rows
  const firstRow = partners.slice(0, 4);
  const secondRow = partners.slice(4);

  return (
    <div className={styles.partners}>
      <h2>Partners</h2>
      <div className={styles.container}>
        <div className={styles.row}>
          {firstRow.map((partner, index) => (
            <a 
              key={index} 
              className={styles.partner}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={partner.logo} alt={partner.name} />
            </a>
          ))}
        </div>
        <div className={`${styles.row} ${styles.secondRow}`}>
          {secondRow.map((partner, index) => (
            <a 
              key={index} 
              className={styles.partner}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={partner.logo} alt={partner.name} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners; 