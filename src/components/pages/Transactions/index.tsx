import React, { useEffect, useState } from 'react';
import { SoonService, Transaction, Block } from '../../../services/soon.service';
import { useNetwork } from '../../../contexts/NetworkContext';

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
        
        // Fetch latest blocks and extract transactions
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
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, [network]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="p-4">Transaction Hash</th>
              <th className="p-4">From</th>
              <th className="p-4">To</th>
              <th className="p-4">Value</th>
              <th className="p-4">Gas Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {transactions.map((tx) => (
              <tr key={tx.hash} className="hover:bg-gray-700">
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="truncate w-32 text-primary">{tx.hash}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(tx.hash)}
                      className="text-gray-400 hover:text-white"
                    >
                      📋
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="truncate w-32">{tx.from}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(tx.from)}
                      className="text-gray-400 hover:text-white"
                    >
                      📋
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="truncate w-32">{tx.to}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(tx.to)}
                      className="text-gray-400 hover:text-white"
                    >
                      📋
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  {parseInt(tx.value, 16) / 1e18} SOON
                </td>
                <td className="p-4">
                  {parseInt(tx.gasPrice, 16).toString()} Wei
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage; 