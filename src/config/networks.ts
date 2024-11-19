export interface NetworkConfig {
  id: string;
  name: string;
  rpcUrl: string;
  bridgeUrl: string;
  explorerUrl: string;
  faucetUrl: string;
}

export const NETWORKS: { [key: string]: NetworkConfig } = {
  testnet: {
    id: 'testnet',
    name: 'Testnet',
    rpcUrl: 'https://rpc.testnet.soo.network/rpc',
    bridgeUrl: 'https://bridge.testnet.soo.network/',
    explorerUrl: 'https://explorer.testnet.soo.network/',
    faucetUrl: 'https://faucet.soo.network/',
  },
  devnet: {
    id: 'devnet',
    name: 'Devnet',
    rpcUrl: 'https://rpc.devnet.soo.network/rpc',
    bridgeUrl: 'https://bridge.devnet.soo.network/',
    explorerUrl: 'https://explorer.devnet.soo.network/',
    faucetUrl: 'https://faucet.soo.network/',
  },
};

export const DEFAULT_NETWORK = 'testnet'; 