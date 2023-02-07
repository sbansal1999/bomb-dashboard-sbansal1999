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

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';

import UpArrow from '../../../../assets/img/arrow-up-circle.svg';
import DownArrow from '../../../../assets/img/arrow-down-circle.svg';
import Bomb from '../../../../assets/img/bomb.png';

import { getDisplayBalance } from '../../../../utils/formatBalance';

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

const BoardRoom: React.FC<{ TVL: string }> = ({ TVL }) => {
  const classes = useStyles();
  const { account } = useWallet();

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
      <PaddedDiv style={{ flexDirection: 'column' }}>
        <RowDiv>
          <TokenSymbol symbol="BSHARE" size={40} />
          <ColumnDiv>
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
            <SeperateDiv>
              <Typography className={classes.subHeadingLeft} style={{ fontSize: '14px' }}>
                Stake BSHARE and earn BOMB every epoch
              </Typography>
              <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                TVL: {TVL}
              </Typography>
              <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                Total Staked: {getDisplayBalance(totalStaked)}
              </Typography>
            </SeperateDiv>
          </ColumnDiv>
        </RowDiv>
        <FlexDiv style={{ justifyContent: 'center', alignItems: 'center' }}>
          {!!account ? (
            <SeperateDiv>
              <FlexDiv style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                  Daily Returns:
                  <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%', fontSize: '24px' }}>
                    2%
                  </Typography>
                </Typography>

                <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                  Earned:
                  <FlexDiv>
                    <TokenSymbol symbol="BSHARE" size={20} />
                    <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%' }}>
                      {getDisplayBalance(earnings)}
                    </Typography>
                  </FlexDiv>
                  <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%' }}>
                    {`≈ $${earnedInDollars}`}
                  </Typography>
                </Typography>

                <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                  Your Stake:
                  <FlexDiv>
                    <TokenSymbol symbol="BOMB" size={20} />
                    <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%' }}>
                      {getDisplayBalance(stakedBalance)}
                    </Typography>
                  </FlexDiv>
                  <Typography className={classes.subHeadingLeft} style={{ marginRight: '10%' }}>
                    {`≈ $${tokenPriceInDollars}`}
                  </Typography>
                </Typography>
              </FlexDiv>
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
                        style={{ width: '100%', textTransform: 'none', border: '1px white solid', borderRadius: '5px' }}
                      >
                        <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                          Withdraw
                        </Typography>
                        <img alt="read docs" style={{ width: '30px' }} src={UpArrow} />
                      </Button>
                      <Button
                        onClick={onPresentDeposit}
                        style={{ width: '100%', textTransform: 'none', border: '1px white solid', marginLeft: '10px' }}
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
                      <RowDiv style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Typography className={classes.subHeading} style={{ marginRight: '10%' }}>
                          Claim Rewards
                        </Typography>
                        <img alt="read docs" style={{ width: '20px' }} src={Bomb} />
                      </RowDiv>
                    </Button>
                  </>
                )}
              </div>
            </SeperateDiv>
          ) : (
            <UnlockWallet />
          )}
        </FlexDiv>
      </PaddedDiv>
    </>
  );
};

export default BoardRoom;

const SeperateDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

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
