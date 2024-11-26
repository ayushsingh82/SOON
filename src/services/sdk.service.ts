import { SoonSDKConfig, BlockData, TransactionData, AccountInfo, QueryOptions } from '../types';
import axios from 'axios';

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

  private async makeRequest(method: string, params: any[] = []): Promise<any> {
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
      console.error('SDK Error:', error);
      throw error;
    }
  }

  async getLatestBlock(): Promise<BlockData> {
    const slot = await this.makeRequest('getSlot', [{ commitment: 'finalized' }]);
    return this.getBlockBySlot(slot);
  }

  async getBlockBySlot(slot: number): Promise<BlockData> {
    const block = await this.makeRequest('getBlock', [
      slot,
      { encoding: 'json', transactionDetails: 'full', maxSupportedTransactionVersion: 0 }
    ]);

    return {
      slot: block.slot,
      blockhash: block.blockhash,
      previousBlockhash: block.previousBlockhash,
      parentSlot: block.parentSlot,
      transactions: block.transactions.map(this.formatTransaction),
      blockTime: block.blockTime,
      blockHeight: block.blockHeight,
    };
  }

  async getTransaction(signature: string): Promise<TransactionData> {
    const tx = await this.makeRequest('getTransaction', [
      signature,
      { encoding: 'json', maxSupportedTransactionVersion: 0 }
    ]);

    return this.formatTransaction(tx);
  }

  async getBlocks(options: QueryOptions = {}): Promise<BlockData[]> {
    const latestSlot = await this.makeRequest('getSlot', [{ commitment: 'finalized' }]);
    const blocks: BlockData[] = [];
    
    const limit = options.limit || 10;
    const startSlot = options.fromBlock || latestSlot - limit;
    
    for (let slot = startSlot; slot < startSlot + limit; slot++) {
      try {
        const block = await this.getBlockBySlot(slot);
        blocks.push(block);
      } catch (error) {
        console.warn(`Skipping block ${slot}:`, error);
      }
    }

    return blocks;
  }

  async getAccountInfo(address: string): Promise<AccountInfo> {
    const [accountInfo, transactions] = await Promise.all([
      this.makeRequest('getAccountInfo', [address, { encoding: 'jsonParsed' }]),
      this.getAccountTransactions(address)
    ]);

    return {
      address,
      balance: accountInfo?.lamports ? accountInfo.lamports / 1e9 : 0,
      transactions
    };
  }

  private async getAccountTransactions(address: string): Promise<TransactionData[]> {
    const signatures = await this.makeRequest('getSignaturesForAddress', [
      address,
      { limit: 10 }
    ]);

    const transactions = await Promise.all(
      signatures.map((sig: any) => this.getTransaction(sig.signature))
    );

    return transactions;
  }

  private formatTransaction(tx: any): TransactionData {
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

export default SoonSDK; 