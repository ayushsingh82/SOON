import React, { useEffect, useState } from 'react';
import { SoonService, Transaction } from '../../../services/soon.service';
import { useNetwork } from '../../../contexts/NetworkContext';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
    <div className="relative">
      {/* Outer ring */}
      <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse"></div>
      {/* Inner spinner */}
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <div className="text-center space-y-2">
      <h3 className="text-xl font-semibold text-primary">Fetching Transactions</h3>
      <p className="text-gray-400 max-w-sm text-sm">
        Please wait while we sync with the {' '}
        <span className="text-primary font-medium">SOON Network</span>
      </p>
      <div className="flex justify-center gap-1.5 pt-2">
        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
      </div>
    </div>
  </div>
);

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { network } = useNetwork();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const blocks = await SoonService.getLatestBlocks(5);
        const allTransactions = blocks.flatMap(block => block.transactions);
        setTransactions(allTransactions);
      } catch (error: any) {
        console.error('Error fetching transactions:', error);
        setError(error.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 15000);
    return () => clearInterval(interval);
  }, [network]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatValue = (value: string) => {
    try {
      const valueInSoon = parseInt(value, 16) / 1e18;
      return `${valueInSoon.toFixed(6)} SOON`;
    } catch {
      return '0 SOON';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] space-y-4">
        <div className="text-red-500 text-6xl">⚠️</div>
        <h3 className="text-xl font-semibold text-red-500">Error Loading Transactions</h3>
        <p className="text-gray-400 text-center max-w-sm">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Latest Transactions</h1>
        <div className="text-sm text-gray-400">
          Network: {network.name}
        </div>
      </div>

      <div className="grid gap-4">
        {transactions.map((tx) => (
          <div key={tx.hash} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
            <div className="flex flex-col space-y-3">
              {/* Transaction Hash */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tx Hash:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-primary">{formatAddress(tx.hash)}</span>
                  <button 
                    onClick={() => copyToClipboard(tx.hash)}
                    className="p-1 hover:bg-gray-600 rounded"
                    title="Copy transaction hash"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* From Address */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">From:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono">{formatAddress(tx.from)}</span>
                  <button 
                    onClick={() => copyToClipboard(tx.from)}
                    className="p-1 hover:bg-gray-600 rounded"
                    title="Copy sender address"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* To Address */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">To:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono">{formatAddress(tx.to)}</span>
                  <button 
                    onClick={() => copyToClipboard(tx.to)}
                    className="p-1 hover:bg-gray-600 rounded"
                    title="Copy recipient address"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Value and Slot */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-400">Value:</span>
                  <span className="ml-2">{formatValue(tx.value)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Slot:</span>
                  <span className="ml-2">{tx.slot.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && !loading && !error && (
        <div className="text-center text-gray-400 py-8">
          No transactions found
        </div>
      )}
    </div>
  );
};

export default TransactionsPage; 