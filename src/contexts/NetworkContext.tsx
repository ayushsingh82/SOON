import React, { createContext, useContext, useState, useEffect } from 'react';
import { NETWORKS, DEFAULT_NETWORK, NetworkConfig } from '../config/networks';
import { SoonService } from '../services/soon.service';

interface NetworkContextType {
  network: NetworkConfig;
  setNetworkById: (networkId: string) => void;
  availableNetworks: NetworkConfig[];
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<NetworkConfig>(NETWORKS[DEFAULT_NETWORK]);

  useEffect(() => {
    // Update SoonService with the current network
    SoonService.setNetwork(network);
  }, [network]);

  const setNetworkById = (networkId: string) => {
    if (NETWORKS[networkId]) {
      setNetwork(NETWORKS[networkId]);
    }
  };

  return (
    <NetworkContext.Provider 
      value={{
        network,
        setNetworkById,
        availableNetworks: Object.values(NETWORKS),
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}; 