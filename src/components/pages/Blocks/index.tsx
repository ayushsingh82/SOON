import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SoonService, Block } from '../../../services/soon.service';
import { useNetwork } from '../../../contexts/NetworkContext';
import { formatDistanceToNow } from 'date-fns';

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
        const latestBlocks = await SoonService.getLatestBlocks(10);
        setBlocks(latestBlocks);
      } catch (error: any) {
        console.error('Error fetching blocks:', error);
        setError(error.message || 'Failed to fetch blocks');
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
    const interval = setInterval(fetchBlocks, 15000);
    return () => clearInterval(interval);
  }, [network]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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

      <div className="grid gap-4">
        {blocks.map((block) => (
          <div key={block.hash} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Block</span>
                  <span className="text-primary font-medium">
                    {parseInt(block.number, 16).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(parseInt(block.timestamp, 16) * 1000), { addSuffix: true })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm">
                  <span className="text-gray-400">Transactions:</span>
                  <Link 
                    to={`/blocks/${block.number}/transactions`}
                    className="ml-2 text-primary hover:underline"
                  >
                    {block.transactions.length} txns
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Hash:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono">{formatAddress(block.hash)}</span>
                  <button 
                    onClick={() => copyToClipboard(block.hash)}
                    className="p-1 hover:bg-gray-600 rounded"
                    title="Copy hash"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Parent Hash:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono">{formatAddress(block.parentHash)}</span>
                  <button 
                    onClick={() => copyToClipboard(block.parentHash)}
                    className="p-1 hover:bg-gray-600 rounded"
                    title="Copy parent hash"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Slot:</span>
                <span>{block.slot.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blocks.length === 0 && !loading && !error && (
        <div className="text-center text-gray-400 py-8">
          No blocks found
        </div>
      )}
    </div>
  );
};

export default BlocksPage; 