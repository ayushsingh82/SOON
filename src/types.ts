export interface SoonSDKConfig {
  rpcUrl: string;
  archiveUrl: string;
  firstBlock: number;
}

export interface BlockData {
  slot: number;
  blockhash: string;
  previousBlockhash: string;
  parentSlot: number;
  transactions: TransactionData[];
  blockTime: number;
  blockHeight: number;
}

export interface TransactionData {
  signature: string;
  slot: number;
  err: any;
  memo: string | null;
  blockTime: number;
  confirmationStatus: string;
  from: string;
  to: string;
  amount: number;
}

export interface AccountInfo {
  address: string;
  balance: number;
  transactions: TransactionData[];
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  fromBlock?: number;
  toBlock?: number;
  startTime?: number;
  endTime?: number;
} 