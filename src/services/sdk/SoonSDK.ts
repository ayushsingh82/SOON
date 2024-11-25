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
      const response = await axios.post(this.config.rpcUrl, {
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params,
      });

      if (response.data.error) {
        throw new Error(`RPC Error: ${JSON.stringify(response.data.error)}`);
      }

      return response.data.result;
    } catch (error) {
      console.error('SDK RPC Error:', error);
      throw error;
    }
  }

  private async makeArchiveRequest(query: string, variables: any = {}) {
    try {
      const response = await axios.post(this.config.archiveUrl, {
        query,
        variables,
      });

      if (response.data.errors) {
        throw new Error(`Archive Error: ${JSON.stringify(response.data.errors)}`);
      }

      return response.data.data;
    } catch (error) {
      console.error('SDK Archive Error:', error);
      throw error;
    }
  }

  // Block Methods
  async getLatestBlock(): Promise<BlockData> {
    const slot = await this.makeRpcRequest('getSlot');
    return this.getBlockBySlot(slot);
  }

  async getBlockBySlot(slot: number): Promise<BlockData> {
    const block = await this.makeRpcRequest('getBlock', [
      slot,
      {
        encoding: 'json',
        transactionDetails: 'full',
        rewards: false,
      },
    ]);
    return this.formatBlockData(block);
  }

  async getBlocks(options: QueryOptions = {}): Promise<BlockData[]> {
    const query = `
      query GetBlocks($limit: Int, $offset: Int, $fromBlock: Int, $toBlock: Int) {
        blocks(
          limit: $limit
          offset: $offset
          filter: { 
            slot: { gte: $fromBlock, lte: $toBlock }
          }
        ) {
          slot
          blockhash
          previousBlockhash
          parentSlot
          blockTime
          blockHeight
          transactions {
            signature
            slot
            err
            memo
            blockTime
          }
        }
      }
    `;

    const variables = {
      limit: options.limit || 10,
      offset: options.offset || 0,
      fromBlock: options.fromBlock || this.config.firstBlock,
      toBlock: options.toBlock,
    };

    const data = await this.makeArchiveRequest(query, variables);
    return data.blocks.map(this.formatBlockData);
  }

  // Transaction Methods
  async getTransaction(signature: string): Promise<TransactionData> {
    const tx = await this.makeRpcRequest('getTransaction', [
      signature,
      { encoding: 'json' },
    ]);
    return this.formatTransactionData(tx);
  }

  async getTransactions(options: QueryOptions = {}): Promise<TransactionData[]> {
    const query = `
      query GetTransactions($limit: Int, $offset: Int, $startTime: Int, $endTime: Int) {
        transactions(
          limit: $limit
          offset: $offset
          filter: {
            blockTime: { gte: $startTime, lte: $endTime }
          }
        ) {
          signature
          slot
          err
          memo
          blockTime
        }
      }
    `;

    const variables = {
      limit: options.limit || 10,
      offset: options.offset || 0,
      startTime: options.startTime,
      endTime: options.endTime,
    };

    const data = await this.makeArchiveRequest(query, variables);
    return data.transactions.map(this.formatTransactionData);
  }

  // Account Methods
  async getAccountInfo(address: string): Promise<AccountInfo> {
    const [accountInfo, transactions] = await Promise.all([
      this.makeRpcRequest('getAccountInfo', [address]),
      this.getAccountTransactions(address),
    ]);

    return {
      address,
      balance: accountInfo.lamports / 1e9,
      transactions,
    };
  }

  async getAccountTransactions(
    address: string,
    options: QueryOptions = {}
  ): Promise<TransactionData[]> {
    const query = `
      query GetAccountTransactions($address: String!, $limit: Int, $offset: Int) {
        transactions(
          limit: $limit
          offset: $offset
          filter: {
            or: [
              { srcAddress: { eq: $address } }
              { dstAddress: { eq: $address } }
            ]
          }
        ) {
          signature
          slot
          err
          memo
          blockTime
        }
      }
    `;

    const variables = {
      address,
      limit: options.limit || 10,
      offset: options.offset || 0,
    };

    const data = await this.makeArchiveRequest(query, variables);
    return data.transactions.map(this.formatTransactionData);
  }

  // Helper Methods
  private formatBlockData(block: any): BlockData {
    return {
      slot: block.slot,
      blockhash: block.blockhash,
      previousBlockhash: block.previousBlockhash,
      parentSlot: block.parentSlot,
      transactions: block.transactions.map(this.formatTransactionData),
      blockTime: block.blockTime,
      blockHeight: block.blockHeight,
    };
  }

  private formatTransactionData(tx: any): TransactionData {
    return {
      signature: tx.signature,
      slot: tx.slot,
      err: tx.err,
      memo: tx.memo,
      blockTime: tx.blockTime,
      confirmationStatus: tx.confirmationStatus,
      from: tx.from,
      to: tx.to,
      amount: tx.amount,
    };
  }
} 