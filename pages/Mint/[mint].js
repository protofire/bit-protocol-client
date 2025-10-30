import styles from '../../styles/dapp.module.scss';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { useEffect, useState, useContext } from 'react';
import BigNumber from 'bignumber.js';
import Wait from '../../components/tooltip/wait';
import tooltip from '../../components/tooltip';
import Loading from '../../components/tooltip/loading';
import DepositsAndDebt from '../../components/dapp/depositsAndDebt';
import { useRouter } from 'next/router';
import { BlockchainContext } from '../../hook/blockchain';
import PageBack from '../../components/pageBack';
import { useWaitForTransactionReceipt, useAccount } from 'wagmi';
import useDebounce from '../../hook/useDebounce';
import { utils } from 'ethers';
import { bnIsBiggerThan, inputValueDisplay } from '../../utils/helpers';

export default function Mint() {
  const router = useRouter();
  const account = useAccount();
  const {
    userTroves,
    collaterals,
    balance,
    collateralPrices,
    setCurrentState,
    setCurrentWaitInfo,
    currentState,
    adjustTrove,
    getTokenBalance,
    approve,
    getData,
  } = useContext(BlockchainContext);

  const [ratioType, setRatioType] = useState('Custom');
  const [collAmount, setCollAmount] = useState('');
  const [collateralRatio, setCollateralRatio] = useState(0);
  const [debtMax, setDebtMax] = useState(0);
  const [debtAmount, setDebtAmount] = useState('');
  const [ratio, setRatio] = useState(0);
  const [ratioNew, setRatioNew] = useState(0);
  const [isPayable, setIsPayable] = useState(false);
  const [collateralBalance, setCollateralBalance] = useState({
    formatted: 0,
    exact: new BigNumber(0),
  });
  const [deposits, setDeposits] = useState(0);
  const [debt, setDebt] = useState(0);
  const [status, setStatus] = useState(0);
  const [collateralAddr, setCollateralAddr] = useState('');
  const [txHash, setTxHash] = useState('');
  const [approved, setApproved] = useState({
    hash: '',
    status: false,
  });
  const [collateral, setCollateral] = useState({
    mcr: 0,
    borrowingRate: 0.0,
    redemptionRate: 0.0,
    mintedBitUSD: 0.0,
    tvl: 0.0,
    collateral: {
      logo: 'rose.svg',
      name: '',
      address: '',
      payable: false,
    },
  });
  const [collInputValue, setCollInputValue] = useState('');
  const debouncedCollAmount = useDebounce(collInputValue, 200);

  const price = collateralPrices[router.query.mint];

  const { data: txReceipt, error: txError } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
  });

  useEffect(() => {
    async function getData() {
      setCollateral(collaterals[router.query.mint]);
      setDeposits(userTroves[router.query.mint]?.deposits || 0);
      setDebt(userTroves[router.query.mint]?.debt || 0);
      setStatus(userTroves[router.query.mint]?.status || 0);
      setCollateralAddr(collaterals[router.query.mint]?.collateral.address);
      setIsPayable(collaterals[router.query.mint]?.collateral.payable);
      const tokenBalance = !collaterals[router.query.mint]?.collateral.payable
        ? await getTokenBalance(
            collaterals[router.query.mint]?.collateral.address
          )
        : { formatted: 0, exact: new BigNumber(0) };
      setCollateralBalance(tokenBalance);
    }

    if (userTroves[router.query.mint]?.owner !== account.address) {
      router.push('/Vault');
    }

    getData();
  }, [collaterals, userTroves, account.address]);

  useEffect(() => {
    if (txReceipt && txHash) {
      setCurrentState(false);
      tooltip.success({ content: 'Successful', duration: 5000 });
      if (approved.hash) {
        setApproved({
          hash: approved.hash,
          status: true,
        });
      }
      getData();
    }
    if (txError && txHash) {
      setCurrentState(false);
      tooltip.error({
        content:
          'Transaction failed due to a network error. Please refresh the page and try again.',
        duration: 5000,
      });
      setApproved({
        hash: '',
        status: false,
      });
    }
    setTxHash('');
  }, [txReceipt, txError]);

  useEffect(() => {
    async function depositApproved() {
      if (approved.hash && approved.status) {
        await mint();
        setApproved({
          hash: '',
          status: false,
        });
      }
    }
    depositApproved();
  }, [approved]);

  useEffect(() => {
    const value = ((deposits * price) / debt) * 100;
    setRatio(value || 0);
    if (collateralRatio && ratioType == 'Auto') {
      setRatioNew(collateralRatio);
    } else {
      const valueNew =
        (((deposits + Number(collAmount)) * price) /
          (debt + Number(debtAmount))) *
        100;
      setRatioNew(valueNew);
    }
  }, [collAmount, price, collateralRatio, debtAmount, ratioType]);

  useEffect(() => {
    if (collAmount) {
      const collAmountBN = new BigNumber(collAmount);
      let max;
      if (collateralRatio && ratioType === 'Auto') {
        max = collAmountBN
          .plus(deposits)
          .multipliedBy(price)
          .dividedBy(collateralRatio / 100)
          .minus(debt);
      } else {
        max = collAmountBN
          .plus(deposits)
          .multipliedBy(price)
          .dividedBy(1.55)
          .minus(debt);
      }
      setDebtAmount(max.toFixed(18)); // Use higher precision
    }
  }, [collAmount, ratioType, collateralRatio]);

  const onKeyDown = (e) => {
    // Prevent minus sign, plus sign, 'e' and 'E' (exponential notation)
    if (['-', '+', 'e', 'E'].includes(e.key)) {
      e.preventDefault();
    }

    // Allow: backspace, delete, tab, escape, enter, decimal point
    if (
      ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', '.', ','].includes(
        e.key
      )
    ) {
      return;
    }

    if (isNaN(Number(e.key))) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (debouncedCollAmount === '') {
      setCollAmount('');
      return;
    }

    if (!/^\d*\.?\d{0,3}$/.test(debouncedCollAmount)) {
      return;
    }

    const parts = debouncedCollAmount.split('.');
    if (parts[1] && parts[1].length > 3) {
      return;
    }

    const numValue = Number(debouncedCollAmount);
    const userBalance = isPayable ? balance : collateralBalance.formatted;

    let maxBalance;
    if (isPayable) maxBalance = userBalance - 1 > 0 ? userBalance - 1 : 0;
    else maxBalance = userBalance;

    // Allow empty string or values within range (including zero)
    if (
      debouncedCollAmount === '' ||
      (numValue >= 0 && numValue <= maxBalance)
    ) {
      setCollAmount(debouncedCollAmount === '' ? '' : numValue);

      // Update debt amount based on new collateral amount
      if (debouncedCollAmount === '' || numValue === 0) {
        setDebtAmount('');
        setDebtMax(0);
      } else if (collateralRatio && ratioType === 'Auto') {
        const max =
          (Number(deposits + numValue) * price) / (collateralRatio / 100) -
          debt;
        setDebtAmount(max);
        setDebtMax(max);
      } else {
        const max = (Number(deposits + numValue) * price) / 1.55 - debt;
        setDebtAmount(max.toFixed(3));
        setDebtMax(max);
      }
    } else if (numValue > maxBalance) {
      setCollAmount(maxBalance.toFixed(3));
    }
  }, [
    debouncedCollAmount,
    isPayable,
    balance,
    collateralBalance,
    deposits,
    price,
    collateralRatio,
    ratioType,
    debt,
  ]);

  const changeCollAmount = (e) => {
    const value = e.target.value;

    if (value === '') {
      setCollAmount('');
      return;
    }

    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const parts = value.split('.');
    if (parts[1] && parts[1].length > 3) {
      return;
    }

    const numValue = Number(value);
    const balanceValue = isPayable ? balance : collateralBalance.formatted;
    let maxBalance;
    if (isPayable) maxBalance = balanceValue - 1 > 0 ? balanceValue - 1 : 0;
    else maxBalance = balanceValue;

    if (numValue >= 0 && numValue <= maxBalance) {
      setCollAmount(value);
    } else if (numValue > maxBalance) {
      setCollAmount(maxBalance.toFixed(3));
    }
  };

  const changeCollValue = (value) => {
    const balanceValue = isPayable ? balance : collateralBalance.formatted;

    const amount = isPayable
      ? balanceValue - 1 > 0
        ? balanceValue - 1
        : 0
      : balanceValue;
    const newAmount = amount * value;
    setCollAmount(newAmount);

    if (collateralRatio && ratioType === 'Auto') {
      const max =
        (Number(deposits + newAmount) * price) / (collateralRatio / 100) - debt;
      setDebtAmount(max);
      setDebtMax(max);
    } else {
      const max = (Number(deposits + newAmount) * price) / 1.55 - debt;
      setDebtAmount(max);
      setDebtMax(max);
    }
  };

  const changeCollateralRatio = async (e) => {
    const value = e.target.value;

    if (value === '') {
      setCollateralRatio('');
      return;
    }

    if (!/^\d*\.?\d{0,3}$/.test(value)) {
      return;
    }

    const parts = value.split('.');
    if (parts[1] && parts[1].length > 3) {
      return;
    }

    const numValue = Number(value);
    if (numValue >= 0) {
      setCollateralRatio(value);

      // Allow empty string or non-negative values
      if (value === '' || numValue >= 0) {
        setCollateralRatio(value === '' ? '' : numValue);

        // Update debt max and amount based on new ratio
        if (collAmount && numValue > 0) {
          const max =
            (Number(deposits + Number(collAmount)) * price) / (numValue / 100) -
            debt;
          setDebtMax(max);
          setDebtAmount(max.toFixed(3));
        }
      }
    }
  };

  useEffect(() => {
    if (collateralRatio && ratioType == 'Auto') {
      const max =
        (Number(deposits + Number(collAmount)) * price) /
          (collateralRatio / 100) -
        debt;
      setDebtMax(max);
    } else {
      const max = (Number(deposits + Number(collAmount)) * price) / 1.55 - debt;
      setDebtMax(max);
    }
  }, [collAmount, price, collateralRatio, ratioType]);

  const changeDebtAmount = (e) => {
    const value = e.target.value;
    if (!/^\d*\.?\d*$/.test(value)) return;

    const numValue = Number(value);
    // Allow empty string or values within range (including zero)
    if (value === '' || (numValue >= 0 && numValue <= debtMax)) {
      setDebtAmount(value === '' ? '' : numValue);
    } else if (numValue > debtMax) {
      setDebtAmount(debtMax);
    }
  };

  const changeDebtValue = (value) => {
    const newAmount = debtMax * value;
    setDebtAmount(newAmount);
  };

  const changeRatioType = (index) => {
    setRatioType(index);
    if (index == 'Auto') {
      setCollateralRatio(0);
    }
  };

  const approveCollateral = async () => {
    if (
      collAmount === '' ||
      collAmount === undefined ||
      debtAmount === '' ||
      debtAmount === undefined
    ) {
      return;
    }

    // if (Number(debtAmount) < 10) {
    //   tooltip.error({
    //     content: "A Minimum Debt of 10 bitUSD is Required!",
    //     duration: 5000,
    //   });
    //   return;
    // }

    try {
      let collAmountBN;
      if (bnIsBiggerThan(collateralBalance?.exact, collAmount))
        collAmountBN = collateralBalance?.exact;
      else collAmountBN = new BigNumber(collAmount).multipliedBy(1e18);

      const tx = await approve(
        collateralAddr,
        collAmountBN.integerValue().toFixed()
      );
      setCurrentWaitInfo({
        type: 'loading',
        info: `Approving ${Number(collAmount).toLocaleString()} $${
          collateral?.collateral?.name
        }`,
      });
      setApproved({
        hash: tx,
        status: false,
      });
      setCurrentState(true);
      setTxHash(tx);
    } catch (error) {
      setCurrentState(false);
      tooltip.error({
        content:
          'Transaction failed due to a network error. Please refresh the page and try again.',
        duration: 5000,
      });
    }
  };

  const mint = async () => {
    if (!debtAmount) {
      return;
    }
    // if (Number(debtAmount) < 10) {
    //   tooltip.error({
    //     content: "A Minimum Debt of 10 bitUSD is Required!",
    //     duration: 5000,
    //   });
    //   return;
    // }

    try {
      let collAmountBN;
      if (collAmount) {
        // Convert both amounts using BigNumber properly
        if (!isPayable && bnIsBiggerThan(collateralBalance?.exact, collAmount))
          collAmountBN = collateralBalance?.exact;
        else collAmountBN = new BigNumber(collAmount).multipliedBy(1e18);
      }

      const debtAmountBN = utils.parseUnits(debtAmount.toString(), 18);

      const tx = await adjustTrove(
        router.query.mint,
        collAmount ? collAmountBN.integerValue().toFixed() : 0,
        debtAmountBN.toString(),
        isPayable
      );
      setCurrentWaitInfo({
        type: 'loading',
        info: 'Mint ' + Number(debtAmount).toLocaleString() + ' $bitUSD',
      });
      setCurrentState(true);
      const mintResult = await tx.wait();
      setCurrentState(false);
      if (mintResult.status === 0) {
        tooltip.error({
          content:
            'Transaction failed due to a network error. Please refresh the page and try again.',
          duration: 5000,
        });
      } else {
        tooltip.success({ content: 'Successful', duration: 5000 });
      }
      setCollAmount('');
      setDebtAmount('');
    } catch (error) {
      console.log('error', error);
      setCurrentState(false);
      tooltip.error({
        content:
          'Transaction failed due to a network error. Please refresh the page and try again.',
        duration: 5000,
      });
    }
  };

  return (
    <>
      <Header type="dapp" dappMenu="Mint"></Header>
      <div className="dappBg">
        <PageBack></PageBack>
        <div className={`${styles.Mint} ${'dappMain'}`}>
          <div className={styles.topType}>
            <h3>Mint bitUSD</h3>
            <p>
              Deposit your ${collateral?.collateral?.name} as collateral in
              Vault to mint bitUSD. Stake bitUSD or provide liquidity to earn
              rewards using the Bit Protocol.
            </p>
          </div>

          <DepositsAndDebt address={router.query.mint}></DepositsAndDebt>

          <div className={styles.mintMain}>
            <div className={styles.CoinType}>
              <div className={styles.collateral}>
                <img src="/dapp/bitUSD.svg" alt="bitUSD" />
                $bitUSD
              </div>
            </div>

            <div className={styles.enterAmount}>
              <div className={styles.miniTitle}>
                <span>Enter amount</span>
                <span style={{ fontSize: '12px' }}>
                  Balance{' '}
                  {Number(
                    Number(
                      isPayable ? balance : collateralBalance.formatted
                    ).toFixed(4)
                  ).toLocaleString()}{' '}
                  ${collateral?.collateral?.name}
                </span>
              </div>

              <div className="inputTxt3">
                <input
                  type="text"
                  placeholder="0"
                  onWheel={(e) => e.target.blur()}
                  id="collAmount"
                  onKeyDown={onKeyDown}
                  onChange={changeCollAmount}
                  value={inputValueDisplay(
                    collAmount,
                    collateralBalance.exact,
                    isPayable
                  )}
                />
                <span>${collateral?.collateral?.name}</span>
              </div>
              <div className="changeBalance">
                <span onClick={() => changeCollValue(0.25)}>25%</span>
                <span onClick={() => changeCollValue(0.5)}>50%</span>
                <span onClick={() => changeCollValue(0.75)}>75%</span>
                <span
                  onClick={() => changeCollValue(1)}
                  style={{ border: 'none' }}
                >
                  Max
                </span>
              </div>
            </div>
            <div className={styles.ratio}>
              <span className={styles.miniTitle}>Collateral Ratio</span>
              <div className={styles.autoOrcustom}>
                <div className={styles.buttonList}>
                  <span
                    className={
                      ratioType == 'Custom'
                        ? 'button rightAngle'
                        : 'button rightAngle noactive'
                    }
                    onClick={() => changeRatioType('Custom')}
                  >
                    Custom
                  </span>
                  <span
                    className={
                      ratioType == 'Auto'
                        ? 'button rightAngle'
                        : 'button rightAngle noactive'
                    }
                    onClick={() => changeRatioType('Auto')}
                  >
                    Auto
                  </span>
                </div>
                {ratioType == 'Auto' ? (
                  <div className="inputTxt" style={{ width: '120px' }}>
                    <input
                      type="text"
                      placeholder="0"
                      onWheel={(e) => e.target.blur()}
                      id="collateralRatio"
                      onKeyDown={onKeyDown}
                      onChange={changeCollateralRatio}
                      value={
                        collateralRatio === 0 ? '0' : collateralRatio || ''
                      }
                    />
                    <span>%</span>
                  </div>
                ) : null}
              </div>
            </div>
            <div className={styles.enterAmount}>
              <div className={styles.miniTitle}>
                <span>Mint bitUSD</span>
                <span style={{ fontSize: '12px' }}>
                  max{' '}
                  {debtMax > 0
                    ? Number(Number(debtMax).toFixed(2)).toLocaleString()
                    : 0}{' '}
                  bitUSD
                </span>
              </div>

              <div className="inputTxt3">
                <input
                  type="text"
                  placeholder="0"
                  onWheel={(e) => e.target.blur()}
                  id="debtAmount"
                  onKeyDown={onKeyDown}
                  onChange={changeDebtAmount}
                  value={
                    debtAmount === 0
                      ? '0'
                      : debtAmount > 0
                      ? debtAmount
                      : '0' || ''
                  }
                />
                <span>$bitUSD</span>
              </div>
              <div className="changeBalance">
                <span onClick={() => changeDebtValue(0.25)}>25%</span>
                <span onClick={() => changeDebtValue(0.5)}>50%</span>
                <span onClick={() => changeDebtValue(0.75)}>75%</span>
                <span
                  onClick={() => changeDebtValue(1)}
                  style={{ border: 'none' }}
                >
                  Max
                </span>
              </div>
            </div>

            <div className={styles.debt}>
              <div className={styles.dataList}>
                <div className={styles.dataItem}>
                  <p>+ Collateral Assets</p>
                  <span>
                    $
                    {Number(
                      (Number(collAmount) * price).toFixed(2)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className={styles.dataItem}>
                  <p>+ Minted bitUSD</p>
                  <div>
                    <span>
                      {Number(Number(debt).toFixed(2)).toLocaleString()} bitUSD
                    </span>
                    {collAmount && debtAmount ? (
                      <span>
                        {' '}
                        ➡️{' '}
                        {Number(
                          (Number(debtAmount) + Number(debt)).toFixed(2)
                        ).toLocaleString()}{' '}
                        bitUSD
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className={styles.dataItem}>
                  <p>+ Collateral Ratio</p>
                  <div>
                    <span>
                      {Number(Number(ratio).toFixed(2)).toLocaleString()}%
                    </span>
                    {collAmount && debtAmount ? (
                      <span>
                        {' '}
                        ➡️{' '}
                        {Number(Number(ratioNew).toFixed(2)).toLocaleString()}%
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className={styles.dataItem}>
                  <span>+ Mint Fee </span>
                  <span>0.5%</span>
                </div>
                {status == 0 || status == 2 || status == 3 ? (
                  <div className={styles.dataItem}>
                    <p>+ Liquidation Fee</p>
                    <span>1 bitUSD</span>
                  </div>
                ) : null}
                <div className={styles.dataItem}>
                  <p>Liquidation Price</p>
                  <span>
                    {collateral?.collateral?.name} = $
                    {Number(((debt || 0) * 1.5) / deposits)
                      .toFixed(4)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
              <div className={styles.total}>
                <p>Total Debt</p>
                <span>
                  {Number(
                    (debt + Number(debtAmount)).toFixed(2)
                  ).toLocaleString()}{' '}
                  bitUSD
                </span>
              </div>
            </div>
            <div className={styles.button}>
              <div
                className={
                  !debtAmount
                    ? 'button rightAngle height disable'
                    : 'button rightAngle height'
                }
                onClick={() => {
                  if (isPayable || !collAmount) {
                    mint();
                  } else {
                    approveCollateral();
                  }
                }}
              >
                Mint
              </div>
            </div>
          </div>
        </div>
      </div>
      {currentState ? <Wait></Wait> : null}
      {collateral?.mcr === 0 ? <Loading></Loading> : null}
      <Footer></Footer>
    </>
  );
}
