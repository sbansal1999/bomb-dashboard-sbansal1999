import React, { useMemo } from 'react';
import { createGlobalStyle } from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import moment from 'moment';

import { Button, Table, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';

import { Switch } from 'react-router-dom';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import DocsLogo from '../../assets/img/docs.svg';
import Page from '../../components/Page';
import { Helmet } from 'react-helmet';
import ProgressCountdown from './components/ProgressCountdown';
import TokenSymbol from '../../components/TokenSymbol';

import { ReactComponent as IconDiscord } from '../../assets/img/discord.svg';

import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useBombStats from '../../hooks/useBombStats';
import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useBanks from '../../hooks/useBanks';
import useBombFinance from '../../hooks/useBombFinance';

import HomeImage from '../../assets/img/background.jpg';
import BombImg from '../../assets/img/bomb.png';

import BoardRoom from './components/BoardRoom/BoardRoom';
import Bomb from './components/Bomb/Bomb';

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

  const [banks] = useBanks();
  const activeBanks = banks.filter((bank) => !bank.finished);
  const requiredBanks = activeBanks.filter((bank) => bank.sectionInUI === 3);

  console.log(requiredBanks);
  const indexWithPoolId1 = requiredBanks.findIndex((bank) => bank.poolId === 1);
  const indexWithPoolId0 = requiredBanks.findIndex((bank) => bank.poolId === 0);
  const indexWithPoolId9 = requiredBanks.findIndex((bank) => bank.poolId === 9);
  const bankBOMB_BTCB = requiredBanks[indexWithPoolId1];
  const bankBOMBBSHARE_BNB = requiredBanks[indexWithPoolId0];
  const bankBBOND = requiredBanks[indexWithPoolId9];

  const bombBank = [bankBOMB_BTCB, bankBOMBBSHARE_BNB];

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
                      <RowDiv style={{ alignItems: 'center' }}>
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
                        <img alt="metamask fox" style={{ width: '30px' }} src={MetamaskFox} />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <RowDiv style={{ alignItems: 'center' }}>
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
                        <img alt="metamask fox" style={{ width: '30px' }} src={MetamaskFox} />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <RowDiv style={{ alignItems: 'center' }}>
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
                        <img alt="metamask fox" style={{ width: '30px' }} src={MetamaskFox} />
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

        <div style={{ marginTop: '10px', display: 'flex', height: '40vh' }}>
          <div style={{ display: 'flex', width: '100%', flexDirection: 'column', marginRight: '20px', rowGap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button>
                <a
                  href="https://bombbshare.medium.com/the-bomb-cycle-how-to-print-forever-e89dc82c12e5"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <Typography className={classes.subHeading} align="right">
                    <Typography
                      className={classes.subHeading}
                      style={{ textDecoration: 'underline' }}
                      display="inline"
                      align="right"
                    >
                      Read Investment Strategy
                    </Typography>
                    &nbsp;&gt;
                  </Typography>
                </a>
              </Button>
            </div>

            <Button
              style={{
                background:
                  'radial-gradient(59345.13% 4094144349.28% at 39511.5% -2722397851.45%, rgba(0, 245, 171, 0.5) 0%, rgba(0, 173, 232, 0.5) 100%) ',
              }}
            >
              <Typography className={classes.subHeading} style={{ padding: '5px' }}>
                Invest Now
              </Typography>
            </Button>

            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
              <Button
                style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid #728CDF',
                  backdropFilter: 'blur(12.5px)',
                  width: '100%',
                }}
              >
                <a
                  href="https://discord.bomb.money"
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{ color: '#dddfee' }}
                >
                  <RowDiv style={{ alignItems: 'center' }}>
                    <IconDiscord style={{ fill: '#dddfee', height: '20px' }} />
                    <Typography className={classes.subHeading}>Chat on Discord</Typography>
                  </RowDiv>
                </a>
              </Button>

              <Button
                style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid #728CDF',
                  backdropFilter: 'blur(12.5px)',
                  width: '100%',
                  marginLeft: '10px',
                }}
              >
                <a
                  href="https://docs.bomb.money"
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{ color: '#dddfee' }}
                >
                  <RowDiv style={{ alignItems: 'center' }}>
                    <img alt="read docs" style={{ width: '30px' }} src={DocsLogo} />
                    <Typography className={classes.subHeading}>Read Docs</Typography>
                  </RowDiv>
                </a>
              </Button>
            </div>

            <div
              style={{
                width: '100%',
                height: '100%',
                border: '1px solid #728CDF',
                borderRadius: '10px',
                background: 'rgba(35, 40, 75, 0.75)',
              }}
            >
              <BoardRoom bank={bankBBOND} />
            </div>
          </div>

          <div
            style={{
              width: '25vw',
              border: '1px solid #728CDF',
              borderRadius: '10px',
              background: 'rgba(35, 40, 75, 0.75)',
            }}
          >
            <Typography className={classes.sideText} style={{ margin: '10px' }}>
              Latest News
            </Typography>
          </div>
        </div>

        <div style={{ marginTop: '10px', display: 'flex', height: '50vh', maxHeight: '500px' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid #728CDF',
              borderRadius: '10px',
              background: 'rgba(35, 40, 75, 0.75)',
            }}
          >
            <PaddedDiv>
              <ColumnDiv>
                <FlexDiv style={{ justifyContent: 'space-between' }}>
                  <div>
                    <Typography className={classes.sideText}>Bomb Farms</Typography>
                    <Typography className={classes.subHeadingLeft}>
                      Stake your LP tokens in our farms to start earning $BSHARE
                    </Typography>
                  </div>
                  <Button
                    style={{
                      border: '1px white solid',
                      marginRight: '5%',
                      backgroundColor: 'grey',
                      paddingLeft: '5%',
                      paddingRight: '5%',
                    }}
                  >
                    <RowDiv
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography className={classes.subHeading}>Claim All</Typography>
                      <img alt="read docs" style={{ width: '20px' }} src={BombImg} />
                    </RowDiv>
                  </Button>
                </FlexDiv>

                {bombBank.map((item, index) => {
                  return (
                    <div key={index}>
                      <Bomb bank={item} />
                    </div>
                  );
                })}
              </ColumnDiv>
            </PaddedDiv>
          </div>
        </div>
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
  padding: 20px;
`;

const ColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const FlexDiv = styled.div`
  display: flex;
`;
