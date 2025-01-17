import { useContext, useEffect, useState } from 'react';
import { BlockchainContext } from '../../hook/blockchain';
import Wait from "../../components/tooltip/wait";
import tooltip from "../../components/tooltip";
import styles from '../../styles/dapp.module.scss';

const closedBy = {
  3: 'redemption',
  4: 'liquidation',
}

export default function RedemptionNotification({ address, status, token }) {
  const {
    checkCollateralSurplus,
    claimCollateral,
    setCurrentState,
    setCurrentWaitInfo,
    currentState
  } = useContext(BlockchainContext);

  const [hasSurplus, setHasSurplus] = useState(false);
  const [wasClosed, setWasClosed] = useState(false);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const checkSurplus = async () => {
      try {
        setWasClosed(status === 3 || status === 4);
        const surplus = await checkCollateralSurplus(address);
        setAmount(surplus);
        setHasSurplus(surplus > 0);
      } catch (error) {
        console.error('Error checking collateral surplus:', error);
      }
    };

    if (address) {
      checkSurplus();
    }
  }, [address, checkCollateralSurplus]);

  const handleClaimCollateral = async () => {
    try {
      setCurrentWaitInfo({
        type: 'loading',
        info: 'Claiming Collateral',
      });
      setCurrentState(true);
      

      const tx = await claimCollateral(address);

      const result = await tx.wait();
      setCurrentState(false);

      if (result.status === 0) {
        tooltip.error({
          content:
            "Transaction failed. Please verify collateral ratio and try again.",
          duration: 5000,
        });
      } else {
        tooltip.success({
          content: "Successfully claimed collateral",
          duration: 5000,
        });
      }
      
      setHasSurplus(false);
      setWasClosed(false);
    } catch (error) {
      console.error('Error claiming collateral:', error);
      setCurrentState(false);
      tooltip.error({
        content:
          "Transaction failed due to a network error. Please refresh the page and try again.",
        duration: 5000,
      });
    }
  };

  const title = () => {
    if (wasClosed && !hasSurplus || wasClosed && hasSurplus) return 'Position Closed';
    if (hasSurplus && !wasClosed) return 'Collateral Available';
  };

  const message = () => {
    const collateralMsg = `You have ${amount} ${token} of collateral available to claim.`
    const closedMsg = `Your position has been closed due to ${closedBy[status]}.`
    if (wasClosed && hasSurplus) return `${closedMsg} ${collateralMsg}`;
    if (!wasClosed && hasSurplus) return collateralMsg
    if (wasClosed && !hasSurplus) return closedMsg
  }

  if (!hasSurplus && !wasClosed) return null;

  return (
    <div className={styles.redemptionNotification}>
      <div className={styles.notificationContent}>
        <h3>{title()}</h3>
        <p>{message()}</p>
        {hasSurplus &&
          <button
            onClick={handleClaimCollateral}
            disabled={currentState}
            className={styles.claimButton}
          >
            {currentState ? 'Claiming...' : 'Claim Collateral'}
          </button>}
      </div>
    </div>
  );
}