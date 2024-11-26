export const config = {
  networks: {
    testnet: {
      rpcUrl: 'https://rpc.testnet.soo.network/rpc',
      archiveUrl: 'https://v2.archive.subsquid.io/network/soon-devnet',
      firstBlock: 2471639,
    },
    devnet: {
      rpcUrl: 'https://rpc.devnet.soo.network/rpc',
      archiveUrl: 'https://v2.archive.subsquid.io/network/soon-devnet',
      firstBlock: 2471639,
    }
  },
  defaultNetwork: 'testnet' as const,
}; 