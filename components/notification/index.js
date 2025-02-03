import styles from '../../styles/dapp.module.scss';
import { useState, useEffect } from 'react';
import { BsBell } from 'react-icons/bs';
import { useSignMessage, useAccount } from 'wagmi';
import { api } from '../../utils/addresses';
import tooltip from '../../components/tooltip';

export default function Notification({ collateral }) {
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [registrationCode, setRegistrationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();

  const handleTelegramSignup = () => {
    setShowTelegramModal(true);
  };

  useEffect(() => {
    async function fetchData() {
      if (collateral) {
        await getSubscription();
      }
    }

    fetchData();
  }, [collateral]);

  const getSubscription = async () => {
    try {
      if (!address) return;
      setIsLoading(true);
      const response = await fetch(`${api.bot}/subscription/${address}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to register for notifications');
      }

      const { data } = await response.json();
      console.log({ data, collateral });
      setAlreadyRegistered(
        data.find((item) => item.collateralName === collateral)
      );
    } catch (error) {
      setAlreadyRegistered(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSetup = async () => {
    try {
      setIsLoading(true);

      // Message to sign
      const message = `Register for Bit Protocol Notifications\nWallet: ${address}\n`;

      // Get signature
      const signature = await signMessageAsync({ message });

      // Call API to register for notifications
      const response = await fetch(`${api.bot}/registration/generate-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          collateralName: collateral,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register for notifications');
      }

      const { registrationCode } = await response.json();
      setRegistrationCode(registrationCode);
      // setShowModal(true);
    } catch (error) {
      console.error('Error setting up notifications:', error);
      tooltip.error({
        content: 'Failed to setup notifications. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={styles.telegramNotification}>
        <div className={styles.tooltipContainer}>
          <button
            onClick={handleTelegramSignup}
            className={styles.telegramButton}
          >
            <BsBell className={styles.bellIcon} />
          </button>
          <div className={styles.tooltip}>Enable Telegram Notifications</div>
        </div>
      </div>

      {/*  Modal */}
      {showTelegramModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {alreadyRegistered ? (
              <>
                <h3>Telegram notifications enabled</h3>
                <p>
                  If you want to disable notifications, follow the steps in the
                  Telegram bot.
                </p>
              </>
            ) : (
              <>
                <h3>Enable Telegram Notifications</h3>
                <p>Get instant updates about your vault's collateral ratio</p>
                <p>Follow these steps to enable notifications:</p>
                {registrationCode ? (
                  <>
                    <li>Open our Telegram bot @BitProtocolBot</li>
                    <li>
                      Send the following code to the bot:{' '}
                      <code>{registrationCode}</code>
                    </li>
                    <li>The bot will confirm your registration</li>
                  </>
                ) : (
                  <>
                    <ol>
                      <li>
                        Sign in to your wallet this message to confirm your
                        address ownership
                      </li>
                      <li>Receive a confirmation code</li>
                    </ol>
                  </>
                )}
              </>
            )}
            <div className={styles.modalButtons}>
              {registrationCode ? (
                <a
                  href="https://t.me/BitProtocol_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.telegramLink}
                >
                  Open Telegram Bot
                </a>
              ) : alreadyRegistered ? null : (
                <button
                  className={styles.telegramLink}
                  onClick={() => handleNotificationSetup(false)}
                >
                  {isLoading ? 'Signing...' : 'Sign'}
                </button>
              )}
              <button onClick={() => setShowTelegramModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
