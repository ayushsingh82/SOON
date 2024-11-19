export interface NetworkConfig {
  id: string;
  name: string;
  rpcUrl: string;
  bridgeUrl: string;
  explorerUrl: string;
  faucetUrl: string;
  chainId: string;
}

export const NETWORKS: { [key: string]: NetworkConfig } = {
  testnet: {
    id: 'testnet',
    name: 'Testnet',
    rpcUrl: 'https://rpc.testnet.soo.network/rpc',
    bridgeUrl: 'https://bridge.testnet.soo.network/',
    explorerUrl: 'https://explorer.testnet.soo.network/',
    faucetUrl: 'https://faucet.soo.network/',
    chainId: '0x1',
  },
  devnet: {
    id: 'devnet',
    name: 'Devnet',
    rpcUrl: 'https://rpc.devnet.soo.network/rpc',
    bridgeUrl: 'https://bridge.devnet.soo.network/',
    explorerUrl: 'https://explorer.devnet.soo.network/',
    faucetUrl: 'https://faucet.soo.network/',
    chainId: '0x2',
  },
};

export const DEFAULT_NETWORK = 'testnet'; 