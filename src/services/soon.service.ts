import axios from 'axios';
import { NetworkConfig } from '../config/networks';

export interface Block {
  number: string;
  timestamp: string;
  transactions: Transaction[];
  hash: string;
  parentHash: string;
  slot: number;
  blockHeight: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  signature: string;
  slot: number;
}

export class SoonService {
  private static network: NetworkConfig;
  private static readonly REQUEST_TIMEOUT = 30000;

  static setNetwork(network: NetworkConfig) {
    this.network = network;
    console.log('Network switched to:', network.name, 'RPC URL:', network.rpcUrl);
  }

  private static async makeRequest(method: string, params: any[] = [], retries = 3) {
    if (!this.network) {
      throw new Error('Network not configured');
    }

    let lastError;
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const rpcUrl = this.network.rpcUrl;
        console.log(`[${this.network.name}] Making RPC request to ${rpcUrl}:`, { method, params, attempt });
        
        const response = await axios.post(
          rpcUrl,
          {
            jsonrpc: '2.0',
            id: Date.now(),
            method,
            params,
          },
          {
            timeout: this.REQUEST_TIMEOUT,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.error) {
          throw new Error(`RPC Error: ${JSON.stringify(response.data.error)}`);
        }

        console.log(`[${this.network.name}] Response:`, response.data);
        return response.data.result;
      } catch (error: any) {
        lastError = error;
        console.error(`[${this.network.name}] Attempt ${attempt + 1} failed:`, error);
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
      }
    }

    throw new Error(`Failed to fetch data from ${this.network.name} after ${retries} attempts: ${lastError?.message}`);
  }

  static async getLatestBlockNumber(): Promise<number> {
    try {
      // Try different methods based on network
      if (this.network.id === 'testnet') {
        // For testnet, try eth_blockNumber first
        try {
          const blockNum = await this.makeRequest('eth_blockNumber');
          return parseInt(blockNum, 16);
        } catch (error) {
          console.log('eth_blockNumber failed, trying getSlot');
          const slot = await this.makeRequest('getSlot', [{ commitment: 'finalized' }]);
          return slot;
        }
      } else {
        // For devnet, use getSlot
        const slot = await this.makeRequest('getSlot', [{ commitment: 'finalized' }]);
        return slot;
      }
    } catch (error) {
      console.error(`[${this.network.name}] Error getting latest block number:`, error);
      throw error;
    }
  }

  static async getBlock(slot: number): Promise<Block> {
    try {
      let blockInfo;
      let blockTime;

      if (this.network.id === 'testnet') {
        try {
          // Try Ethereum-style request first
          const blockHex = '0x' + slot.toString(16);
          blockInfo = await this.makeRequest('eth_getBlockByNumber', [blockHex, true]);
          blockTime = Math.floor(Date.now() / 1000); // Use current time as fallback
        } catch (error) {
          console.log('eth_getBlockByNumber failed, trying Solana method');
          [blockInfo, blockTime] = await Promise.all([
            this.makeRequest('getBlock', [slot, { encoding: 'json', transactionDetails: 'full', maxSupportedTransactionVersion: 0 }]),
            this.makeRequest('getBlockTime', [slot])
          ]);
        }
      } else {
        // Devnet uses Solana methods
        [blockInfo, blockTime] = await Promise.all([
          this.makeRequest('getBlock', [slot, { encoding: 'json', transactionDetails: 'full', maxSupportedTransactionVersion: 0 }]),
          this.makeRequest('getBlockTime', [slot])
        ]);
      }

      if (!blockInfo) {
        throw new Error(`Block not found for slot/number ${slot}`);
      }

      // Handle different response formats
      const block: Block = {
        number: (blockInfo.number || slot).toString(),
        timestamp: (blockInfo.timestamp || blockTime).toString(),
        transactions: (blockInfo.transactions || []).map((tx: any) => ({
          hash: tx.hash || tx.transaction?.signatures?.[0] || '',
          from: tx.from || tx.transaction?.message?.accountKeys?.[0] || '',
          to: tx.to || tx.transaction?.message?.accountKeys?.[1] || '',
          value: tx.value || '0',
          signature: tx.hash || tx.transaction?.signatures?.[0] || '',
          slot: slot
        })),
        hash: blockInfo.hash || blockInfo.blockhash || '',
        parentHash: blockInfo.parentHash || blockInfo.previousBlockhash || '',
        slot: slot,
        blockHeight: blockInfo.blockHeight || slot
      };

      return block;
    } catch (error) {
      console.error(`[${this.network.name}] Error getting block ${slot}:`, error);
      throw error;
    }
  }

  static async getTransaction(signature: string): Promise<Transaction> {
    try {
      const tx = await this.makeRequest('getTransaction', [signature, { encoding: 'json', maxSupportedTransactionVersion: 0 }]);
      if (!tx) {
        throw new Error(`Transaction ${signature} not found`);
      }

      return {
        hash: signature,
        from: tx.transaction.message.accountKeys[0],
        to: tx.transaction.message.accountKeys[1],
        value: '0', // Need to parse actual value from transaction
        signature: signature,
        slot: tx.slot
      };
    } catch (error) {
      console.error(`Error getting transaction ${signature}:`, error);
      throw error;
    }
  }

  static async getLatestBlocks(count: number = 10): Promise<Block[]> {
    try {
      const latestSlot = await this.getLatestBlockNumber();
      const blocks: Block[] = [];
      
      for (let i = 0; i < count; i++) {
        try {
          const block = await this.getBlock(latestSlot - i);
          blocks.push(block);
        } catch (error) {
          console.error(`Error fetching block at slot ${latestSlot - i}:`, error);
          continue;
        }
      }

      if (blocks.length === 0) {
        throw new Error('No blocks could be fetched');
      }

      return blocks;
    } catch (error) {
      console.error('Error in getLatestBlocks:', error);
      throw error;
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      await this.getLatestBlockNumber();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
} 