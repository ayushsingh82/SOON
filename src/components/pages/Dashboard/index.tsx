import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SoonService, Block } from '../../../services/soon.service';
import { useNetwork } from '../../../contexts/NetworkContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <div className="text-center space-y-2">
      <h3 className="text-xl font-semibold text-primary">Fetching Network Data</h3>
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
        setBlocks(latestBlocks);
      } catch (error: any) {
        console.error('Error fetching blocks:', error);
        setError(error.message || 'Failed to fetch network data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [network]);

  const chartData = React.useMemo(() => {
    if (!blocks.length) return [];
    return blocks
      .map(block => ({
        number: parseInt(block.number, 16),
        transactions: block.transactions.length,
        timestamp: parseInt(block.timestamp, 16) * 1000,
      }))
      .reverse();
  }, [blocks]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] space-y-4">
        <div className="text-red-500 text-6xl">⚠️</div>
        <h3 className="text-xl font-semibold text-red-500">Error Loading Data</h3>
        <p className="text-gray-400 text-center max-w-sm">{error}</p>
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
    <div className="space-y-8 mt-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Network Overview</h1>
        <div className="text-sm text-gray-400">
          Network: <span className="text-primary">{network.name}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800 transition-all duration-300">
          <h3 className="text-gray-400 mb-2">Latest Block</h3>
          <p className="text-2xl font-semibold">
            {blocks[0] ? parseInt(blocks[0].number, 16).toLocaleString() : 'N/A'}
          </p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800 transition-all duration-300">
          <h3 className="text-gray-400 mb-2">Average Block Time</h3>
          <p className="text-2xl font-semibold">
            {blocks.length > 1
              ? ((parseInt(blocks[0].timestamp, 16) - parseInt(blocks[blocks.length - 1].timestamp, 16)) /
                  blocks.length).toFixed(2) + 's'
              : 'N/A'}
          </p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800 transition-all duration-300">
          <h3 className="text-gray-400 mb-2">Total Transactions</h3>
          <p className="text-2xl font-semibold">
            {blocks.reduce((acc, block) => acc + block.transactions.length, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Transaction Chart */}
      <div className="bg-gray-800/50 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-6">Transaction History</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="number"
                stroke="#9CA3AF"
                tickFormatter={(value) => value.toLocaleString()}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="#DC2626"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/blocks"
          className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800 transition-all duration-300 group"
        >
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary">Latest Blocks</h3>
          <p className="text-gray-400">View detailed information about recent blocks</p>
        </Link>
        <Link
          to="/transactions"
          className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800 transition-all duration-300 group"
        >
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary">Recent Transactions</h3>
          <p className="text-gray-400">Explore the latest network transactions</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 