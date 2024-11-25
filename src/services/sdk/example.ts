// Initialize SDK
const sdk = SoonSDK.initialize({
  rpcUrl: 'https://rpc.devnet.soo.network/rpc',
  archiveUrl: 'https://v2.archive.subsquid.io/network/soon-devnet',
  firstBlock: 2471639,
});

// Example usage
async function example() {
  // Get latest block
  const latestBlock = await sdk.getLatestBlock();

  // Get multiple blocks
  const blocks = await sdk.getBlocks({
    limit: 10,
    fromBlock: 2471640,
  });

  // Get transaction
  const tx = await sdk.getTransaction('signature...');

  // Get account info and transactions
  const accountInfo = await sdk.getAccountInfo('address...');
} 