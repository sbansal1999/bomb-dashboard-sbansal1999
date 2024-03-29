import React, { useMemo } from 'react';

import { useWallet } from 'use-wallet';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import UnlockWallet from '../../../../components/UnlockWallet';

import { Button, Typography } from '@material-ui/core';

import TokenSymbol from '../../../../components/TokenSymbol';

import useEarningsOnBoardroom from '../../../../hooks/useEarningsOnBoardroom';
import useStakedBalanceOnBoardroom from '../../../../hooks/useStakedBalanceOnBoardroom';
import useTotalStakedOnBoardroom from '../../../../hooks/useTotalStakedOnBoardroom';
import useModal from '../../../../hooks/useModal';
import useApprove, { ApprovalState } from '../../../../hooks/useApprove';
import useBombFinance from '../../../../hooks/useBombFinance';
import useTokenBalance from '../../../../hooks/useTokenBalance';
import useStakeToBoardroom from '../../../../hooks/useStakeToBoardroom';
import useWithdrawFromBoardroom from '../../../../hooks/useWithdrawFromBoardroom';
import useWithdrawCheck from '../../../../hooks/boardroom/useWithdrawCheck';
import useHarvestFromBoardroom from '../../../../hooks/useHarvestFromBoardroom';
import useClaimRewardCheck from '../../../../hooks/boardroom/useClaimRewardCheck';
import useStakedTokenPriceInDollars from '../../../../hooks/useStakedTokenPriceInDollars';
import useStatsForPool from '../../../../hooks/useStatsForPool';
import useFetchBoardroomAPR from '../../../../hooks/useFetchBoardroomAPR';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';

import UpArrow from '../../../../assets/img/arrow-up-circle.svg';
import DownArrow from '../../../../assets/img/arrow-down-circle.svg';
import Bomb from '../../../../assets/img/bomb.png';

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

const BoardRoom: React.FC<{ bank: Bank }> = ({ bank }) => {
  const classes = useStyles();
  const { account } = useWallet();
  const statsOnPool = useStatsForPool(bank);

  const earnings = useEarningsOnBoardroom();
  const stakedBalance = useStakedBalanceOnBoardroom();
  const totalStaked = useTotalStakedOnBoardroom();

  const bombFinance = useBombFinance();
  const [approveStatus, approve] = useApprove(bombFinance.BSHARE, bombFinance.contracts.Boardroom.address);
  const tokenBalance = useTokenBalance(bombFinance.BSHARE);
  const { onStake } = useStakeToBoardroom();
  const { onWithdraw } = useWithdrawFromBoardroom();
  const canWithdrawFromBoardroom = useWithdrawCheck();
  const { onReward } = useHarvestFromBoardroom();
  const canClaimReward = useClaimRewardCheck();
  const boardroomAPR = useFetchBoardroomAPR();

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
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'BShare'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'BShare'}
    />,
  );

  return (
    <>
      <StyledPaddedDiv style={{ flexDirection: 'column' }}>
        <StyledRowDiv>
          <TokenSymbol symbol="BSHARE" size={40} />
          <StyledColumnDiv>
            <Typography className={classes.subHeadingLeft} style={{ fontSize: '22px' }}>
              Boardroom
              <Typography
                className={classes.smallText}
                style={{
                  fontSize: '10px',
                  marginLeft: '2%',
                  padding: '0.5% 2%',
                  marginBottom: '2%',
                  background: 'rgba(0, 232, 162, 0.5)',
                  borderRadius: '3px',
                }}
                display="inline"
              >
                Recommended
              </Typography>
            </Typography>
            <StyledSeperateDiv>
              <Typography className={classes.subHeadingLeft} style={{ fontSize: '14px' }}>
                Stake BSHARE and earn BOMB every epoch
              </Typography>
              <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                TVL: {statsOnPool?.TVL ? getFormattedDollarAmount(statsOnPool?.TVL as unknown as number) : '--'}
              </Typography>
              <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                Total Staked:
                <StyledRowDiv>
                  <TokenSymbol symbol="BSHARE" size={20} />
                  {totalStaked ? getDisplayBalance(totalStaked) : '--'}
                </StyledRowDiv>
              </Typography>
            </StyledSeperateDiv>
          </StyledColumnDiv>
        </StyledRowDiv>
        <StyledFlexDiv style={{ justifyContent: 'center', alignItems: 'center' }}>
          {!!account ? (
            <StyledSeperateDiv>
              <StyledFlexDiv style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                  Daily Returns:
                  <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%', fontSize: '24px' }}>
                    {(boardroomAPR / 365).toFixed(2)}%
                  </Typography>
                </Typography>

                <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                  Your Stake:
                  <StyledFlexDiv>
                    <TokenSymbol symbol="BSHARE" size={20} />
                    <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%' }}>
                      {stakedBalance ? getDisplayBalance(stakedBalance) : '--'}
                    </Typography>
                  </StyledFlexDiv>
                  <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%' }}>
                    {tokenPriceInDollars ? `≈ $${tokenPriceInDollars}` : '--'}
                  </Typography>
                </Typography>

                <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                  Earned:
                  <StyledFlexDiv>
                    <TokenSymbol symbol="BOMB" size={20} />
                    <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%' }}>
                      {getDisplayBalance(earnings)}
                    </Typography>
                  </StyledFlexDiv>
                  <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%' }}>
                    {`≈ $${earnedInDollars}`}
                  </Typography>
                </Typography>

                <div style={{ paddingRight: '5%' }}>
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
                      <div style={{ display: 'flex', marginTop: '5%' }}>
                        <Button
                          disabled={!canWithdrawFromBoardroom}
                          onClick={onPresentWithdraw}
                          style={{
                            width: '100%',
                            textTransform: 'none',
                            border: '1px white solid',
                            borderRadius: '5px',
                          }}
                        >
                          <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                            Withdraw
                          </Typography>
                          <img alt="read docs" style={{ width: '30px' }} src={UpArrow} />
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
                          <img alt="read docs" style={{ width: '30px' }} src={DownArrow} />
                        </Button>
                      </div>
                      <Button
                        onClick={onReward}
                        disabled={earnings.eq(0) || !canClaimReward}
                        style={
                          earnings.eq(0) || !canClaimReward
                            ? { width: '100%', border: '1px white solid', marginTop: '5%', backgroundColor: 'grey' }
                            : { width: '100%', border: '1px white solid', marginTop: '5%' }
                        }
                      >
                        <StyledRowDiv style={{ alignItems: 'center', justifyContent: 'center' }}>
                          <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                            Claim Rewards
                          </Typography>
                          <img alt="read docs" style={{ width: '20px' }} src={Bomb} />
                        </StyledRowDiv>
                      </Button>
                    </>
                  )}
                </div>
              </StyledFlexDiv>
            </StyledSeperateDiv>
          ) : (
            <UnlockWallet />
          )}
        </StyledFlexDiv>
      </StyledPaddedDiv>
    </>
  );
};

export default BoardRoom;

const StyledSeperateDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const StyledRowDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const StyledPaddedDiv = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
`;

const StyledColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const StyledFlexDiv = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;
