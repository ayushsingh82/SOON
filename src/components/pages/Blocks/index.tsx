import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SoonService, Block } from '../../../services/soon.service';
import { useNetwork } from '../../../contexts/NetworkContext';

const BlocksPage: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { network } = useNetwork();

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true);
        setError(null);
        const latestBlocks = await SoonService.getLatestBlocks(25);
        setBlocks(latestBlocks);
      } catch (error: any) {
        console.error('Error fetching blocks:', error);
        setError(error.message || 'Failed to fetch blocks');
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
    const interval = setInterval(fetchBlocks, 10000);
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
        <h1 className="text-3xl font-bold">Latest Blocks</h1>
        <div className="text-sm text-gray-400">
          Network: {network.name}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="p-4">Block Number</th>
              <th className="p-4">Age</th>
              <th className="p-4">Transactions</th>
              <th className="p-4">Gas Used</th>
              <th className="p-4">Gas Limit</th>
              <th className="p-4">Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {blocks.map((block) => (
              <tr key={block.hash} className="hover:bg-gray-700">
                <td className="p-4">
                  <span className="text-primary">
                    {parseInt(block.number, 16).toLocaleString()}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(parseInt(block.timestamp, 16) * 1000).toLocaleString()}
                </td>
                <td className="p-4">
                  <Link 
                    to={`/blocks/${block.number}/transactions`}
                    className="text-primary hover:underline"
                  >
                    {block.transactions.length} txns
                  </Link>
                </td>
                <td className="p-4">
                  {parseInt(block.gasUsed, 16).toLocaleString()}
                </td>
                <td className="p-4">
                  {parseInt(block.gasLimit, 16).toLocaleString()}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="truncate w-32">{block.hash}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(block.hash)}
                      className="text-gray-400 hover:text-white"
                    >
                      📋
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlocksPage; 