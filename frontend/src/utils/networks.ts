import { hexValue } from 'ethers/lib/utils';
import zipObject from 'lodash/zipObject';

export interface EthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

export const RINKEBY = {
  chainId: hexValue(4),
  chainName: 'Rinkeby Test Network',
  rpcUrls: ['https://rinkeby.etherscan.io'],
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://rinkeby.etherscan.io'],
};

export const MAINNET = {
    chainId: hexValue(1),
    chainName: 'Ethereum Mainnet',
    rpcUrls: ['https://etherscan.io'],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://etherscan.io'],
  };


export const networks = [RINKEBY, MAINNET];

export const CHAIN_ID_TO_NETWORK = zipObject(
  networks.map(n => n.chainId),
  networks
);

export const getNetworkDetails = (chainId: string | number): EthereumChainParameter => {
  if (typeof chainId === 'string') {
    return CHAIN_ID_TO_NETWORK[chainId];
  } else {
    return CHAIN_ID_TO_NETWORK[hexValue(chainId)];
  }
};

export const getBlockExploreTxLink = (tx: any, networkId?: number | string) => {
  if (!networkId) return '';

  if (networkId === 1 || networkId === hexValue(1)) {
    return `https://etherscan.io/tx/${tx && tx.hash ? tx.hash : tx}`;
  }

  const networkDetails = getNetworkDetails(networkId);
  if (!networkDetails.blockExplorerUrls || networkDetails.blockExplorerUrls.length === 0) {
    return '';
  }

  return `${networkDetails.blockExplorerUrls[0]}/tx/${tx && tx.hash ? tx.hash : tx}`;
};
