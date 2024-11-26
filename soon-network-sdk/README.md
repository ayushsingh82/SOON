# SOON Network SDK

A powerful and easy-to-use SDK for interacting with the SOON Network. Built for developers, by developers.

---

## Getting Started

Install the SOON Network SDK using npm:

```bash

npm install @soon-network/sdk


#Installation & Setup
Initialize the SOON Network SDK with the required configuration:

``
import { SoonSDK } from '@soon-network/sdk';

const sdk = SoonSDK.initialize({
  rpcUrl: "https://rpc.testnet.soo.network/rpc",
  archiveUrl: "https://v2.archive.subsquid.io/network/soon-devnet",
  firstBlock: 2471639,
});
```

##Features

###Fetch Latest Block
Retrieve information about the most recent block:

```
const latestBlock = await sdk.getLatestBlock();
console.log('Latest Block:', latestBlock);

```

###Get Multiple Blocks
Fetch multiple blocks with pagination:

```
const blocks = await sdk.getBlocks({
  limit: 10,
  fromBlock: 2471640,
});
console.log('Blocks:', blocks);
```

###Get Transaction Details
Fetch details of a specific transaction using its signature:

```
const transaction = await sdk.getTransaction('transaction_signature');
console.log('Transaction:', transaction);
```

###Account Information
Retrieve account details along with recent transactions:

```
const accountInfo = await sdk.getAccountInfo('wallet_address');
console.log('Account Info:', accountInfo);
```

###Full Example
Here's an example combining all features:

```
import { SoonSDK } from '@soon-network/sdk';

// Initialize the SDK
const sdk = SoonSDK.initialize({
  rpcUrl: "https://rpc.testnet.soo.network/rpc",
  archiveUrl: "https://v2.archive.subsquid.io/network/soon-devnet",
  firstBlock: 2471639,
});

(async () => {
  try {
    // Fetch the latest block
    const latestBlock = await sdk.getLatestBlock();
    console.log('Latest Block:', latestBlock);

    // Fetch 10 blocks starting from a specific block
    const blocks = await sdk.getBlocks({
      limit: 10,
      fromBlock: 2471640,
    });
    console.log('Blocks:', blocks);

    // Fetch details of a specific transaction by signature
    const transaction = await sdk.getTransaction('transaction_signature');
    console.log('Transaction:', transaction);

    // Fetch account information and recent transactions
    const accountInfo = await sdk.getAccountInfo('wallet_address');
    console.log('Account Info:', accountInfo);
  } catch (error) {
    console.error('Error using SOON Network SDK:', error);
  }
})();
```

##Contributing
Contributions are welcome! Please open an issue or submit a pull request with your improvements or bug fixes.