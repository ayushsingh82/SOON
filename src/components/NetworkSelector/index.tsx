import React from 'react';
import { useNetwork } from '../../contexts/NetworkContext';

const NetworkSelector: React.FC = () => {
  const { network, setNetworkById, availableNetworks } = useNetwork();

  return (
    <div className="relative">
      <select
        className="bg-gray-800 text-white px-4 py-2 rounded-lg appearance-none cursor-pointer"
        value={network.id}
        onChange={(e) => setNetworkById(e.target.value)}
      >
        {availableNetworks.map((net) => (
          <option key={net.id} value={net.id}>
            {net.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NetworkSelector; 