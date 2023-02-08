import React from 'react';

import { Button, Typography } from '@material-ui/core';

import useBombFinance from '../../../../hooks/useBombFinance';
import useModal from '../../../../hooks/useModal';
import ExchangeModal from '../../../Bond/components/ExchangeModal';
import ERC20 from '../../../../bomb-finance/ERC20';
import useTokenBalance from '../../../../hooks/useTokenBalance';
import useApprove, { ApprovalState } from '../../../../hooks/useApprove';
import useCatchError from '../../../../hooks/useCatchError';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../../../components/UnlockWallet';

import ShoppingCart from '../../../../assets/img/shopping-cart.svg';
import DownArrow from '../../../../assets/img/arrow-down-circle.svg';

interface ExchangeCardProps {
  action: string;
  fromToken: ERC20;
  fromTokenName: string;
  toToken: ERC20;
  toTokenName: string;
  priceDesc: string;
  onExchange: (amount: string) => void;
  disabled?: boolean;
  disabledDescription?: string;
}

const Exchange: React.FC<ExchangeCardProps> = ({
  action,
  fromToken,
  fromTokenName,
  priceDesc,
  onExchange,
  disabled = false,
  disabledDescription,
}) => {
  const catchError = useCatchError();
  const {
    contracts: { Treasury },
  } = useBombFinance();
  const [approveStatus, approve] = useApprove(fromToken, Treasury.address);

  const { account } = useWallet();
  const balance = useTokenBalance(fromToken);
  const [onPresent, onDismiss] = useModal(
    <ExchangeModal
      title={action}
      description={priceDesc}
      max={balance}
      onConfirm={(value) => {
        onExchange(value);
        onDismiss();
      }}
      action={action}
      tokenName={fromTokenName}
    />,
  );
  return (
    <div>
      {!!account ? (
        <>
          {approveStatus !== ApprovalState.APPROVED && disabled ? (
            <Button
              disabled={approveStatus === ApprovalState.PENDING || approveStatus === ApprovalState.UNKNOWN}
              onClick={() => catchError(approve(), `Unable to approve ${fromTokenName}`)}
              style={{
                width: '100%',
                textTransform: 'none',
                border: '1px white solid',
                marginLeft: '10px',
              }}
            >
              {`Approve ${fromTokenName}`}
            </Button>
          ) : (
            <Button
              onClick={onPresent}
              disabled={disabled}
              style={
                disabled
                  ? {
                      width: '100%',
                      textTransform: 'none',
                      background: 'grey',
                      border: '1px white solid',
                      marginLeft: '10px',
                    }
                  : {
                      width: '100%',
                      textTransform: 'none',
                      border: '1px white solid',
                      marginLeft: '10px',
                    }
              }
            >
              <div style={{ display: 'flex' }}>
                <Typography style={{ color: 'white', fontSize: '16px', textTransform: 'none' }}>
                  {disabledDescription || action}
                </Typography>
                <img alt="bomb logo" style={{ width: '20px' }} src={action === 'Purchase' ? ShoppingCart : DownArrow} />
              </div>
            </Button>
          )}
        </>
      ) : (
        <UnlockWallet />
      )}
    </div>
  );
};

export default Exchange;
