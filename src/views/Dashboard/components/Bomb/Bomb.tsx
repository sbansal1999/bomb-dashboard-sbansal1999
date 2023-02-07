import React, { useMemo } from 'react';

import { useWallet } from 'use-wallet';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import UnlockWallet from '../../../../components/UnlockWallet';

import { Button, Typography } from '@material-ui/core';

import TokenSymbol from '../../../../components/TokenSymbol';

import useModal from '../../../../hooks/useModal';
import useApprove, { ApprovalState } from '../../../../hooks/useApprove';
import useBombFinance from '../../../../hooks/useBombFinance';
import useTokenBalance from '../../../../hooks/useTokenBalance';
import useStakedTokenPriceInDollars from '../../../../hooks/useStakedTokenPriceInDollars';
import useEarnings from '../../../../hooks/useEarnings';
import useRedeem from '../../../../hooks/useRedeem';
import useStake from '../../../../hooks/useStake';
import useWithdraw from '../../../../hooks/useWithdraw';
import useStakedBalance from '../../../../hooks/useStakedBalance';
import useStatsForPool from '../../../../hooks/useStatsForPool';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';

import UpArrow from '../../../../assets/img/arrow-up-circle.svg';
import DownArrow from '../../../../assets/img/arrow-down-circle.svg';
import BombImg from '../../../../assets/img/bomb.png';
import BombBTCBImg from '../../../../assets/img/bomb-bitcoin-LP.png';
import BShareBNBImg from '../../../../assets/img/bshare-bnb-LP.png';

import { getDisplayBalance } from '../../../../utils/formatBalance';
import { Bank } from '../../../../bomb-finance';

const useStyles = makeStyles((theme) => ({
  subHeading: {
    color: theme.palette.text.primary,
    textAlign: 'center',
    textTransform: 'none',
    fontWeight: 'bold',
  },
  smallText: {
    color: theme.palette.text.primary,
    textAlign: 'center',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '10px',
  },
  priceText: {
    color: theme.palette.text.primary,
    textAlign: 'center',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  sideText: {
    color: theme.palette.text.primary,
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '20px',
  },
  subHeadingLeft: {
    color: theme.palette.text.primary,
    textAlign: 'left',
    textTransform: 'none',
    fontWeight: 'bold',
  },
  subHeadingRight: {
    color: theme.palette.text.primary,
    textAlign: 'right',
    textTransform: 'none',
    fontWeight: 'bold',
  },
}));

const getFormattedDollarAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const Bomb: React.FC<{ bank: Bank }> = ({ bank }) => {
  const classes = useStyles();
  const { account } = useWallet();
  const { onRedeem } = useRedeem(bank);
  const statsOnPool = useStatsForPool(bank);

  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  const stakedBalance = useStakedBalance(bank.contract, bank.poolId);

  const bombFinance = useBombFinance();
  const [approveStatus, approve] = useApprove(bank.depositToken, bank.address);

  const tokenBalance = useTokenBalance(bombFinance.BSHARE);
  const { onStake } = useStake(bank);
  const { onWithdraw } = useWithdraw(bank);

  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars('BSHARE', bombFinance.BSHARE);
  const tokenPriceInDollars = useMemo(
    () =>
      stakedTokenPriceInDollars
        ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
        : null,
    [stakedTokenPriceInDollars, stakedBalance],
  );
  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  return (
    <>
      <PaddedDiv style={{ flexDirection: 'column' }}>
        <RowDiv>
          <ColumnDiv>
            <FlexDiv>
              <FlexDiv style={{ alignItems: 'center' }}>
                <img alt="read docs" style={{ width: '40px' }} src={bank.poolId === 1 ? BombBTCBImg : BShareBNBImg} />
                <Typography className={classes.subHeadingLeft} style={{ fontSize: '22px', marginLeft: '2%' }}>
                  {bank.poolId === 1 ? 'BOMB-BTCB' : 'BSHARE-BNB'}
                </Typography>
                <Typography
                  className={classes.smallText}
                  style={{
                    fontSize: '10px',
                    padding: '0.5% 2%',
                    marginLeft: '2%',
                    background: 'rgba(0, 232, 162, 0.5)',
                    borderRadius: '3px',
                  }}
                  display="inline"
                >
                  Recommended
                </Typography>
              </FlexDiv>

              <Typography
                className={classes.subHeadingRight}
                style={{ marginRight: '10%', width: '100%', marginTop: '2%' }}
              >
                TVL: {statsOnPool?.TVL ? getFormattedDollarAmount(statsOnPool?.TVL as unknown as number) : '--'}
              </Typography>
            </FlexDiv>
          </ColumnDiv>
        </RowDiv>

        <div style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)', width: '95%' }} />

        {!!account ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2%', alignItems: 'center' }}>
              <div style={{ display: 'flex', minWidth: '50%', justifyContent: 'space-between' }}>
                <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                  Daily Returns:
                  <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%', fontSize: '24px' }}>
                    2%
                  </Typography>
                </Typography>

                <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                  Your Stake:
                  <div style={{ display: 'flex' }}>
                    <TokenSymbol symbol="BSHARE" size={20} />
                    <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%' }}>
                      {getDisplayBalance(stakedBalance, bank.depositToken.decimal)}
                    </Typography>
                  </div>
                  <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%' }}>
                    {`≈ $${earnedInDollars}`}
                  </Typography>
                </Typography>

                <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                  Earned:
                  <div style={{ display: 'flex' }}>
                    <TokenSymbol symbol="BOMB" size={20} />
                    <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%' }}>
                      {getDisplayBalance(earnings)}
                    </Typography>
                  </div>
                  <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%' }}>
                    {`≈ $${earnedInDollars}`}
                  </Typography>
                </Typography>
              </div>

              <div style={{ marginRight: '5%', display: 'flex', paddingRight: '2%' }}>
                {approveStatus !== ApprovalState.APPROVED ? (
                  <Button
                    disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                    className={approveStatus === ApprovalState.NOT_APPROVED ? 'shinyButton' : 'shinyButtonDisabled'}
                    style={{ marginTop: '20px' }}
                    onClick={approve}
                  >
                    Approve BSHARE
                  </Button>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        onClick={onPresentWithdraw}
                        style={{
                          width: '100%',
                          textTransform: 'none',
                          border: '1px white solid',
                          borderRadius: '5px',
                        }}
                      >
                        <Typography className={classes.subHeading} style={{ marginRight: '10%', paddingLeft: '2%' }}>
                          Withdraw
                        </Typography>
                        <img alt="withdraw" style={{ width: '30px' }} src={UpArrow} />
                      </Button>

                      <Button
                        onClick={onPresentDeposit}
                        style={{
                          width: '100%',
                          textTransform: 'none',
                          border: '1px white solid',
                          marginLeft: '10px',
                        }}
                      >
                        <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                          Deposit
                        </Typography>
                        <img alt="down arrow" style={{ width: '30px' }} src={DownArrow} />
                      </Button>

                      <Button
                        onClick={onRedeem}
                        style={{
                          width: '100%',
                          textTransform: 'none',
                          border: '1px white solid',
                          marginLeft: '10px',
                        }}
                      >
                        <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                          Claim &amp; Withdraw
                        </Typography>
                        <img alt="bomb logo" style={{ width: '20px' }} src={BombImg} />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <UnlockWallet />
        )}
      </PaddedDiv>
    </>
  );
};

export default Bomb;

const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const PaddedDiv = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
`;

const ColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const FlexDiv = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;
