import React, { useMemo } from 'react';
import { createGlobalStyle } from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import moment from 'moment';
import { Button, Grid, Table, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';

import { Switch } from 'react-router-dom';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import Page from '../../components/Page';
import { Helmet } from 'react-helmet';
import ProgressCountdown from './components/ProgressCountdown';
import TokenSymbol from '../../components/TokenSymbol';

import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useBombStats from '../../hooks/useBombStats';
import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useBombFinance from '../../hooks/useBombFinance';

import { roundAndFormatNumber } from '../../0x';

import HomeImage from '../../assets/img/background.jpg';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'bomb.money | Dashboard';

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
}));

const getFormattedDollarAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatCompactNumber = (amount: number) => {
  //@ts-ignore
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(amount);
};

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const currentEpoch = useCurrentEpoch();
  const { to } = useTreasuryAllocationTimes();
  const cashStat = useCashPriceInEstimatedTWAP();
  const cashPrice = useCashPriceInLastTWAP();
  const TVL = useTotalValueLocked();
  const bombFinance = useBombFinance();

  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();

  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4);

  const bombCirculatingSupply = useMemo(() => (bombStats ? Number(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? Number(bombStats.totalSupply) : null), [bombStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(Number(bombStats.priceInDollars).toFixed(2)) : null),
    [bombStats],
  );
  const bombPriceInBNB = useMemo(
    () => (bombStats ? Number(Number(bombStats.tokenInFtm).toFixed(4)) : null),
    [bombStats],
  );

  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? Number(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? Number(bShareStats.totalSupply) : null), [bShareStats]);
  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(Number(bShareStats.priceInDollars).toFixed(2)) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(Number(bShareStats.tokenInFtm).toFixed(4)) : null),
    [bShareStats],
  );

  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? Number(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? Number(tBondStats.totalSupply) : null), [tBondStats]);
  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(Number(tBondStats.priceInDollars).toFixed(2)) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(
    () => (tBondStats ? Number(Number(tBondStats.tokenInFtm).toFixed(4)) : null),
    [tBondStats],
  );

  return (
    <Switch>
      <Page>
        <BackgroundImage />
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>

        <TempDiv>
          <Typography className={classes.subHeading} style={{ fontSize: '22px', paddingTop: '10px' }}>
            Bomb Finance Summary
          </Typography>

          <div style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)', width: '970px' }} />

          <SeperateDiv style={{ marginTop: '10px', marginBottom: '20px' }}>
            <div>
              <Typography className={classes.subHeading}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>
                        <Typography className={classes.smallText}>Current Supply</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className={classes.smallText}>Total Supply</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className={classes.smallText}>Price</Typography>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableRow>
                    <TableCell>
                      <RowDiv>
                        <TokenSymbol symbol="BOMB" size={40} />
                        <Typography className={classes.priceText}>$BOMB</Typography>
                      </RowDiv>
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.priceText}>
                        {formatCompactNumber(bombCirculatingSupply)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.priceText}>{formatCompactNumber(bombTotalSupply)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.priceText}>
                        ${bombPriceInDollars ? formatCompactNumber(bombPriceInDollars) : '-.--'}
                      </Typography>
                      <Typography className={classes.priceText}>
                        {bombPriceInBNB ? formatCompactNumber(bombPriceInBNB) : '-.--'} BNB
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          bombFinance.watchAssetInMetamask('BOMB');
                        }}
                      >
                        <img
                          alt="metamask fox"
                          style={{ width: '20px', filter: 'grayscale(100%)' }}
                          src={MetamaskFox}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <RowDiv>
                        <TokenSymbol symbol="BSHARE" size={40} />
                        <Typography className={classes.priceText}>$BSHARE</Typography>
                      </RowDiv>
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.priceText}>
                        {formatCompactNumber(bShareCirculatingSupply)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.priceText}>{formatCompactNumber(bShareTotalSupply)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.priceText}>
                        ${bSharePriceInDollars ? formatCompactNumber(bSharePriceInDollars) : '-.--'}
                      </Typography>
                      <Typography className={classes.priceText}>
                        {bSharePriceInBNB ? formatCompactNumber(bSharePriceInBNB) : '-.--'} BNB
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          bombFinance.watchAssetInMetamask('BSHARE');
                        }}
                      >
                        <img
                          alt="metamask fox"
                          style={{ width: '20px', filter: 'grayscale(100%)' }}
                          src={MetamaskFox}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <RowDiv>
                        <TokenSymbol symbol="BBOND" size={40} />
                        <Typography className={classes.priceText}>$BBOND</Typography>
                      </RowDiv>
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.priceText}>
                        {formatCompactNumber(tBondCirculatingSupply)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.priceText}>{formatCompactNumber(tBondTotalSupply)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.priceText}>
                        ${tBondPriceInDollars ? formatCompactNumber(tBondPriceInDollars) : '-.--'}
                      </Typography>
                      <Typography className={classes.priceText}>
                        {tBondPriceInBNB ? formatCompactNumber(tBondPriceInBNB) : '-.--'} BNB
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          bombFinance.watchAssetInMetamask('BBOND');
                        }}
                      >
                        <img
                          alt="metamask fox"
                          style={{ width: '20px', filter: 'grayscale(100%)' }}
                          src={MetamaskFox}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                </Table>
              </Typography>
            </div>
            <div style={{ marginRight: '10px', marginTop: '25px' }}>
              <Typography className={classes.subHeading}>Current Epoch</Typography>
              <Typography className={classes.subHeading} style={{ fontSize: '34px' }}>
                {Number(currentEpoch)}
              </Typography>

              <div style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)', width: '200px', margin: '5px' }} />

              <Typography className={classes.subHeading} style={{ fontSize: '34px' }}>
                <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
              </Typography>
              <Typography className={classes.subHeading}>Next Epoch In</Typography>

              <div style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)', width: '200px', margin: '5px' }} />

              <Typography className={classes.subHeading}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  Live TWAP: <Typography style={{ color: '#00E8A2' }}> {scalingFactor}</Typography>
                </div>
              </Typography>
              <Typography className={classes.subHeading}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  TVL: <Typography style={{ color: '#00E8A2' }}> {getFormattedDollarAmount(TVL as number)}</Typography>
                </div>
              </Typography>
              <Typography className={classes.subHeading}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  Last Epoch TWAP: <Typography style={{ color: '#00E8A2' }}> {bondScale}</Typography>
                </div>
              </Typography>
            </div>
          </SeperateDiv>
        </TempDiv>
      </Page>
    </Switch>
  );
};

export default Dashboard;

const TempDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #171923;
`;

const SeperateDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background-color: #171923;
`;

const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100%;
`;
