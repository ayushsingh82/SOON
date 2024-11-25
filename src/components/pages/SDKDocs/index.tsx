import React, { useState } from 'react';
import { useNetwork } from '../../../contexts/NetworkContext';

const SDKDocs: React.FC = () => {
  const { network } = useNetwork();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
  };

  const examples = [
    {
      title: 'Installation & Setup',
      description: 'Initialize the SOON Network SDK',
      code: `import { SoonSDK } from '@soon/sdk';

const sdk = SoonSDK.initialize({
  rpcUrl: "${network.rpcUrl}",
  archiveUrl: "https://v2.archive.subsquid.io/network/soon-devnet",
  firstBlock: 2471639,
});`
    },
    {
      title: 'Fetch Latest Block',
      description: 'Get information about the most recent block',
      code: `// Get the latest block
const latestBlock = await sdk.getLatestBlock();
console.log('Latest Block:', latestBlock);`
    },
    {
      title: 'Get Multiple Blocks',
      description: 'Fetch multiple blocks with pagination',
      code: `// Get 10 blocks starting from a specific block
const blocks = await sdk.getBlocks({
  limit: 10,
  fromBlock: 2471640,
});
console.log('Blocks:', blocks);`
    },
    {
      title: 'Get Transaction Details',
      description: 'Fetch details of a specific transaction',
      code: `// Get transaction by signature
const transaction = await sdk.getTransaction('transaction_signature');
console.log('Transaction:', transaction);`
    },
    {
      title: 'Account Information',
      description: 'Get account details and transactions',
      code: `// Get account information and recent transactions
const accountInfo = await sdk.getAccountInfo('wallet_address');
console.log('Account Info:', accountInfo);`
    }
  ];

  return (
    <div className="mt-20 space-y-8 max-w-4xl mx-auto px-4">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">SOON Network SDK</h1>
        <p className="text-gray-400">
          A powerful and easy-to-use SDK for interacting with the SOON Network.
          Built for developers, by developers.
        </p>
      </div>

      {/* Installation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Getting Started</h2>
        <div className="bg-gray-800 rounded-lg p-4 relative group">
          <code className="text-sm text-red-400">npm install @soon/sdk</code>
          <button
            onClick={() => copyToClipboard('npm install @soon/sdk', -1)}
            className="absolute top-2 right-2 p-2 rounded-lg bg-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy to clipboard"
          >
            {copiedIndex === -1 ? (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-6">
        {examples.map((example, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-xl font-semibold">{example.title}</h3>
            <p className="text-gray-400">{example.description}</p>
            <div className="bg-gray-800 rounded-lg p-4 group relative">
              <pre className="text-sm overflow-x-auto">
                <code className="text-red-400">{example.code}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(example.code, index)}
                className="absolute top-2 right-2 p-2 rounded-lg bg-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Copy to clipboard"
              >
                {copiedIndex === index ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Response Types */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-semibold">Response Types</h2>
        <div className="grid gap-4">
          {[
            { name: 'BlockData', fields: ['slot', 'blockhash', 'previousBlockhash', 'transactions', 'blockTime'] },
            { name: 'TransactionData', fields: ['signature', 'slot', 'err', 'memo', 'blockTime', 'confirmationStatus'] },
            { name: 'AccountInfo', fields: ['address', 'balance', 'transactions'] }
          ].map((type, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">{type.name}</h3>
              <div className="text-sm text-gray-400">
                {type.fields.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SDKDocs; 