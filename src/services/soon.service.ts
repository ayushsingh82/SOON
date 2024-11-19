import axios from 'axios';
import { NetworkConfig } from '../config/networks';

export interface Block {
  number: string;
  timestamp: string;
  transactions: Transaction[];
  hash: string;
  parentHash: string;
  nonce: string;
  difficulty: string;
  gasLimit: string;
  gasUsed: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  nonce: string;
}

export class SoonService {
  private static network: NetworkConfig;

  static setNetwork(network: NetworkConfig) {
    this.network = network;
  }

  private static async makeRequest(method: string, params: any[] = []) {
    if (!this.network) {
      throw new Error('Network not configured');
    }

    try {
      const response = await axios.post(this.network.rpcUrl, {
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      });
      return response.data.result;
    } catch (error) {
      console.error('RPC Error:', error);
      throw error;
    }
  }

  static async getLatestBlockNumber(): Promise<string> {
    return this.makeRequest('eth_blockNumber');
  }

  static async getBlock(blockNumber: string, fullTransactions = true): Promise<Block> {
    return this.makeRequest('eth_getBlockByNumber', [blockNumber, fullTransactions]);
  }

  static async getTransaction(txHash: string): Promise<Transaction> {
    return this.makeRequest('eth_getTransactionByHash', [txHash]);
  }

  static async getLatestBlocks(count: number = 10): Promise<Block[]> {
    const latestBlock = await this.getLatestBlockNumber();
    const blockNumber = parseInt(latestBlock, 16);
    
    const blocks: Block[] = [];
    for (let i = 0; i < count; i++) {
      const block = await this.getBlock('0x' + (blockNumber - i).toString(16));
      blocks.push(block);
    }
    return blocks;
  }
} 