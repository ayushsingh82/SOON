import { SoonSDK } from './SoonSDK';

// Initialize SDK
const sdk = SoonSDK.initialize({
  rpcUrl: 'https://rpc.devnet.soo.network/rpc',
  archiveUrl: 'https://v2.archive.subsquid.io/network/soon-devnet',
  firstBlock: 2471639,
});

// Example usage
export const sdkExamples = {
  getLatestBlock: async () => {
    try {
      const latestBlock = await sdk.getLatestBlock();
      console.log('Latest Block:', latestBlock);
      return latestBlock;
    } catch (error) {
      console.error('Error fetching latest block:', error);
      throw error;
    }
  },

  getBlocks: async () => {
    try {
      const blocks = await sdk.getBlocks({
        limit: 10,
        fromBlock: 2471640,
      });
      console.log('Blocks:', blocks);
      return blocks;
    } catch (error) {
      console.error('Error fetching blocks:', error);
      throw error;
    }
  },

  getTransaction: async (signature: string) => {
    try {
      const tx = await sdk.getTransaction(signature);
      console.log('Transaction:', tx);
      return tx;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  getAccountInfo: async (address: string) => {
    try {
      const accountInfo = await sdk.getAccountInfo(address);
      console.log('Account Info:', accountInfo);
      return accountInfo;
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }
}; 