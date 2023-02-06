import React, { useMemo } from 'react';
import { createGlobalStyle } from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import moment from 'moment';
import { Box, Card, CardContent, Button, Typography, Grid } from '@material-ui/core';

import HomeImage from '../../assets/img/background.jpg';
import { Switch } from 'react-router-dom';
import Page from '../../components/Page';
import { Helmet } from 'react-helmet';
import ProgressCountdown from './components/ProgressCountdown';

import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';

import useCurrentEpoch from '../../hooks/useCurrentEpoch';
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
}));

const getFormattedDollarAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const currentEpoch = useCurrentEpoch();
  const { to } = useTreasuryAllocationTimes();
  const cashStat = useCashPriceInEstimatedTWAP();
  const cashPrice = useCashPriceInLastTWAP();
  const TVL = useTotalValueLocked();

  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4);

  return (
    <Switch>
      <Page>
        <BackgroundImage />
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>

        <TempDiv>
          <Typography className={classes.subHeading} style={{ fontSize: '22px' }}>
            Bomb Finance Summary
          </Typography>

          <div style={{ border: '0.5px solid rgba(195, 197, 203, 0.75)', width: '970px' }} />

          <SeperateDiv>
            <div>
              <Typography className={classes.subHeading}>A</Typography>
            </div>
            <div style={{ marginRight: '10px' }}>
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
