import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SoonService, Block } from '../../../services/soon.service';
import { useNetwork } from '../../../contexts/NetworkContext';

const Dashboard: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { network } = useNetwork();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const latestBlocks = await SoonService.getLatestBlocks(20);
        if (latestBlocks && Array.isArray(latestBlocks)) {
          setBlocks(latestBlocks);
        } else {
          setError('Invalid data received from the blockchain');
        }
      } catch (error) {
        console.error('Error fetching blocks:', error);
        setError('Failed to fetch blockchain data. Please check your network connection.');
        setBlocks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [network]);

  const chartData = React.useMemo(() => {
    if (!blocks || !blocks.length) return [];
    
    return blocks
      .filter(block => block && block.number && block.timestamp)
      .map(block => ({
        number: parseInt(block.number, 16),
        transactions: Array.isArray(block.transactions) ? block.transactions.length : 0,
        timestamp: parseInt(block.timestamp, 16) * 1000,
      }))
      .reverse();
  }, [blocks]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-500 space-y-4">
        <p>{error}</p>
        <p className="text-sm">Current Network: {network.name}</p>
      </div>
    );
  }

  if (!blocks || !blocks.length) {
    return (
      <div className="flex justify-center items-center h-64">
        No blocks found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Network Overview</h1>
        <div className="text-sm text-gray-400">
          Network: {network.name}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Latest Block</h3>
          <p className="text-2xl">
            {blocks[0] && blocks[0].number 
              ? parseInt(blocks[0].number, 16).toLocaleString() 
              : 'N/A'}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Average Block Time</h3>
          <p className="text-2xl">
            {blocks.length > 1 && blocks[0]?.timestamp && blocks[blocks.length - 1]?.timestamp
              ? ((parseInt(blocks[0].timestamp, 16) - parseInt(blocks[blocks.length - 1].timestamp, 16)) /
                  blocks.length).toFixed(2) + 's'
              : 'N/A'}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total Transactions</h3>
          <p className="text-2xl">
            {blocks.reduce((acc, block) => 
              acc + (Array.isArray(block?.transactions) ? block.transactions.length : 0), 
              0
            ).toLocaleString()}
          </p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Transaction History</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="number" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 