import axios from 'axios';
import { SoonSDKConfig, BlockData, TransactionData, AccountInfo, QueryOptions } from './types';

export class SoonSDK {
  private config: SoonSDKConfig;
  private static instance: SoonSDK;

  private constructor(config: SoonSDKConfig) {
    this.config = config;
  }

  static initialize(config: SoonSDKConfig): SoonSDK {
    if (!SoonSDK.instance) {
      SoonSDK.instance = new SoonSDK(config);
    }
    return SoonSDK.instance;
  }

  static getInstance(): SoonSDK {
    if (!SoonSDK.instance) {
      throw new Error('SDK not initialized. Call initialize() first.');
    }
    return SoonSDK.instance;
  }

  private async makeRpcRequest(method: string, params: any[] = []) {
    try {
      console.log(`Making RPC request to ${this.config.rpcUrl}:`, { method, params });
      
      const response = await axios.post(this.config.rpcUrl, {
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.error) {
        throw new Error(`RPC Error: ${JSON.stringify(response.data.error)}`);
      }

      console.log(`RPC Response for ${method}:`, response.data.result);
      return response.data.result;
    } catch (error: any) {
      console.error('SDK RPC Error:', {
        method,
        params,
        error: error.message,
        response: error.response?.data
      });
      throw new Error(`Failed to make RPC request: ${error.message}`);
    }
  }

  async getLatestBlock(): Promise<BlockData> {
    try {
      const slot = await this.makeRpcRequest('getSlot', [{ commitment: 'finalized' }]);
      const block = await this.getBlockBySlot(slot);
      return block;
    } catch (error) {
      console.error('Error getting latest block:', error);
      throw error;
    }
  }

  async getBlockBySlot(slot: number): Promise<BlockData> {
    try {
      const block = await this.makeRpcRequest('getBlock', [
        slot,
        {
          encoding: 'json',
          transactionDetails: 'full',
          rewards: false,
        },
      ]);

      if (!block) {
        throw new Error(`Block not found for slot ${slot}`);
      }

      return this.formatBlockData(block);
    } catch (error) {
      console.error(`Error getting block ${slot}:`, error);
      throw error;
    }
  }

  async getTransaction(signature: string): Promise<TransactionData> {
    try {
      const tx = await this.makeRpcRequest('getTransaction', [
        signature,
        { encoding: 'json', maxSupportedTransactionVersion: 0 }
      ]);

      if (!tx) {
        throw new Error(`Transaction not found: ${signature}`);
      }

      return this.formatTransactionData(tx);
    } catch (error) {
      console.error('Error getting transaction:', error);
      throw error;
    }
  }

  async getBlocks(options: QueryOptions = {}): Promise<BlockData[]> {
    try {
      const latestSlot = await this.makeRpcRequest('getSlot', [{ commitment: 'finalized' }]);
      const blocks: BlockData[] = [];
      
      const limit = options.limit || 10;
      const startSlot = options.fromBlock || latestSlot - limit;
      
      for (let slot = startSlot; slot < startSlot + limit; slot++) {
        try {
          const block = await this.getBlockBySlot(slot);
          blocks.push(block);
        } catch (error) {
          console.warn(`Skipping block ${slot} due to error:`, error);
          continue;
        }
      }

      return blocks;
    } catch (error) {
      console.error('Error getting blocks:', error);
      throw error;
    }
  }

  async getAccountInfo(address: string): Promise<AccountInfo> {
    try {
      const [accountInfo, transactions] = await Promise.all([
        this.makeRpcRequest('getAccountInfo', [address, { encoding: 'jsonParsed' }]),
        this.getAccountTransactions(address)
      ]);

      return {
        address,
        balance: accountInfo?.lamports ? accountInfo.lamports / 1e9 : 0,
        transactions
      };
    } catch (error) {
      console.error('Error getting account info:', error);
      throw error;
    }
  }

  private async getAccountTransactions(address: string): Promise<TransactionData[]> {
    try {
      const signatures = await this.makeRpcRequest('getSignaturesForAddress', [
        address,
        { limit: 10 }
      ]);

      const transactions = await Promise.all(
        signatures.map((sig: any) => this.getTransaction(sig.signature))
      );

      return transactions;
    } catch (error) {
      console.error('Error getting account transactions:', error);
      return [];
    }
  }

  private formatBlockData(block: any): BlockData {
    return {
      slot: block.slot,
      blockhash: block.blockhash,
      previousBlockhash: block.previousBlockhash,
      parentSlot: block.parentSlot,
      transactions: block.transactions?.map(this.formatTransactionData) || [],
      blockTime: block.blockTime,
      blockHeight: block.blockHeight,
    };
  }

  private formatTransactionData(tx: any): TransactionData {
    return {
      signature: tx.transaction?.signatures?.[0] || tx.signature,
      slot: tx.slot,
      err: tx.err,
      memo: tx.memo,
      blockTime: tx.blockTime,
      confirmationStatus: tx.confirmationStatus,
      from: tx.transaction?.message?.accountKeys?.[0] || '',
      to: tx.transaction?.message?.accountKeys?.[1] || '',
      amount: tx.meta?.postBalances?.[1] - tx.meta?.preBalances?.[1] || 0,
    };
  }
} 