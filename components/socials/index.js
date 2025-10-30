import styles from './socials.module.scss';

const Socials = () => {
  const socials = [
    {
      name: 'X (Twitter)',
      icon: '/socials/x.svg',
      url: 'https://x.com/BitUSD_finance'
    },
    {
      name: 'Medium',
      icon: '/socials/medium.svg',
      url: 'https://medium.com/@bitprotocol'
    },
    {
      name: 'Telegram',
      icon: '/socials/telegram.svg',
      url: 'https://t.me/bitprotocolofficial'
    },
    {
      name: 'DefiLlama',
      icon: '/icon/defillama.svg',
      url: 'https://defillama.com/protocol/bitusd'
    }
  ];

  return (
    <div className={styles.socials}>
      <h2>Join Our Community</h2>
      <div className={styles.container}>
        <div className={styles.icons}>
          {socials.map((social, index) => (
            <a 
              key={index} 
              className={styles.social}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              title={social.name}
            >
              <img src={social.icon} alt={social.name} />
              <span>{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Socials; 