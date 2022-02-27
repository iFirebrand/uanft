import React from 'react';
import { toast } from 'react-toastify';
import { getBlockExploreTxLink } from './networks';
import { ContractTransaction } from '@ethersproject/contracts';
import { Box } from '@mui/system';

interface NumberMap {
  [key: number]: number;
}

const CONFIRMATIONS: NumberMap = {
  4: 1,
  137: 3,
  8001: 3,
};

const displayError = (customError: string, error: string) => {
    return (
        <>
            <Box mb={2}>{customError}</Box>
            <Box fontSize="12px">{error}</Box>
        </>
    )
}
  

const displayMessage = (message: string, txLink: string) =>  (
  <>
    <Box mb={2}>{message}</Box>
    <Box fontSize="12px" textAlign="right">
      <a
        href={txLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'white', textDecoration: 'underline' }}
      >
        View in explorer
      </a>
    </Box>
  </>
);

const formatError = (err: any) => {
  if (typeof err === 'string') {
    return err;
  }
  if (err.message && typeof err.message === 'string') {
    return err.message;
  }
  return 'Unexpected error';
};

interface NotificationParams {
  pending?: string;
  submitted?: string;
  success?: string;
  error?: string;
  method: () => Promise<ContractTransaction>;
  chainId: number;
  onSubmitted?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

export const notifyTx = async ({
  pending = 'Waiting for your confirmation',
  submitted = 'Your transaction was submitted',
  success = 'Transaction succeeded',
  error = 'Your transaction failed',
  method,
  chainId,
  onSubmitted,
  onSuccess,
  onError,
}: NotificationParams) => {
  const toastId = toast.loading(pending);
  const confirmations = CONFIRMATIONS[chainId] || 1;
  try {
    const res = await method();
    const txLink = getBlockExploreTxLink(res.hash, chainId);
    toast.update(toastId, {
      render: displayMessage(submitted, txLink),
      type: toast.TYPE.INFO,
    });
    onSubmitted && onSubmitted();
    const receipt = await res.wait(confirmations);
    if (receipt.status === 1) {
      toast.update(toastId, {
        render: displayMessage(success, txLink),
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        closeButton: true,
      });
      onSuccess && onSuccess();
    } else {
      throw new Error();
    }
  } catch (err) {
    toast.update(toastId, {
      render: displayError(error, formatError(err)),
      type: toast.TYPE.ERROR,
      isLoading: false,
      closeButton: true,
    });
    onError && onError();
  }
};
