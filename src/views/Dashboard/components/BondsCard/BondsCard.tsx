import React, { useCallback, useMemo } from 'react';

import { Grid, makeStyles, Typography } from '@material-ui/core';

import styled from 'styled-components';

import useBondsPurchasable from '../../../../hooks/useBondsPurchasable';
import useBondStats from '../../../../hooks/useBondStats';
import useBombFinance from '../../../../hooks/useBombFinance';
import useCashPriceInLastTWAP from '../../../../hooks/useCashPriceInLastTWAP';

import TokenSymbol from '../../../../components/TokenSymbol';

import { getDisplayBalance } from '../../../../utils/formatBalance';

import { BOND_REDEEM_PRICE_BN } from '../../../../bomb-finance/constants';
import { useTransactionAdder } from '../../../../state/transactions/hooks';

import Exchange from './Exchange';
import useTokenBalance from '../../../../hooks/useTokenBalance';

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

const BondsCard: React.FC<{ bondPrice: number }> = ({ bondPrice }) => {
  const classes = useStyles();

  const bondStat = useBondStats();
  const cashPrice = useCashPriceInLastTWAP();
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);
  const bondsPurchasable = useBondsPurchasable();
  const bombFinance = useBombFinance();
  const addTransaction = useTransactionAdder();
  const bondBalance = useTokenBalance(bombFinance?.BBOND);
  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} BBOND` });
    },
    [bombFinance, addTransaction],
  );

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} BBOND with ${amount} BOMB`,
      });
    },
    [bombFinance, addTransaction],
  );

  return (
    <StyledPaddedDiv>
      <StyledColumnDiv style={{ marginLeft: '15px' }}>
        <StyledRowDiv style={{ alignItems: 'center' }}>
          <TokenSymbol symbol="BBOND" size={40} />
          <StyledColumnDiv>
            <Typography className={classes.subHeadingLeft} style={{ fontSize: '22px' }}>
              Bonds
            </Typography>
            <Typography className={classes.priceText} style={{ textAlign: 'left' }}>
              BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1
            </Typography>
          </StyledColumnDiv>
        </StyledRowDiv>

        <Grid container spacing={2} style={{ marginTop: '2%' }}>
          <Grid item xs={3}>
            <StyledColumnDiv style={{ width: '100%' }}>
              <Typography className={classes.subHeadingLeft} style={{ fontWeight: '300', fontSize: '16px' }}>
                Current Price: (Bomb)^2
              </Typography>
              <Typography className={classes.subHeadingLeft} style={{ fontSize: '22px', marginTop: '5px' }}>
                BBond = {bondPrice ? bondPrice : '--'} BTCB
              </Typography>
            </StyledColumnDiv>
          </Grid>

          <Grid item xs={3}>
            <Typography className={classes.subHeadingLeft} style={{ fontWeight: '300', fontSize: '16px' }}>
              Available to {isBondPurchasable ? 'purchase' : 'redeem'}:
            </Typography>
            <StyledFlexDiv style={{ alignItems: 'center' }}>
              <TokenSymbol symbol="BBOND" size={40} />
              <Typography className={classes.subHeadingLeft} style={{ fontSize: '22px', marginTop: '5px' }}>
                {isBondPurchasable ? getDisplayBalance(bondsPurchasable, 18, 4) : getDisplayBalance(bondBalance, 18, 4)}
              </Typography>
            </StyledFlexDiv>
          </Grid>

          <Grid item xs={6}>
            <StyledColumnDiv style={{ marginLeft: '-10%' }}>
              <StyledRowDiv>
                <StyledColumnDiv>
                  <Typography className={classes.subHeadingLeft} style={{ fontWeight: '300', fontSize: '16px' }}>
                    Purchase BBond
                  </Typography>
                  <Typography className={classes.subHeadingLeft} style={{ fontWeight: '300', fontSize: '16px' }}>
                    {!isBondPurchasable ? 'BOMB is over peg' : 'BBOND available for purchase'}
                  </Typography>
                </StyledColumnDiv>
                <StyledFlexDiv>
                  <Exchange
                    action="Purchase"
                    fromToken={bombFinance.BOMB}
                    fromTokenName="BOMB"
                    toToken={bombFinance.BBOND}
                    toTokenName="BBOND"
                    priceDesc={
                      !isBondPurchasable
                        ? 'BOMB is over peg'
                        : getDisplayBalance(bondsPurchasable, 18, 4) + ' BBOND available for purchase'
                    }
                    onExchange={handleBuyBonds}
                    disabled={!bondStat || isBondRedeemable}
                  />
                </StyledFlexDiv>
              </StyledRowDiv>

              <div style={{ width: '100%', height: '1px', backgroundColor: '#E5E5E5', margin: '20px 10px' }} />

              <StyledRowDiv style={{ justifyContent: 'space-between' }}>
                <Typography className={classes.subHeadingLeft} style={{ fontWeight: '300', fontSize: '16px' }}>
                  Redeem Bomb
                </Typography>
                <StyledFlexDiv>
                  <Exchange
                    action="Redeem"
                    fromToken={bombFinance.BBOND}
                    fromTokenName="BBOND"
                    toToken={bombFinance.BOMB}
                    toTokenName="BOMB"
                    priceDesc={`${getDisplayBalance(bondBalance)} BBOND Available in wallet`}
                    onExchange={handleRedeemBonds}
                    disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                  />
                </StyledFlexDiv>
              </StyledRowDiv>
            </StyledColumnDiv>
          </Grid>
        </Grid>
      </StyledColumnDiv>
    </StyledPaddedDiv>
  );
};

export default BondsCard;

const StyledRowDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: '100%';
`;

const StyledPaddedDiv = styled.div`
  display: flex;
  width: 100%;
  padding: 10px;
`;

const StyledColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledFlexDiv = styled.div`
  display: flex;
`;
