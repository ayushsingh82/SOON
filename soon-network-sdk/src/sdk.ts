import { SoonSDKConfig, BlockData, TransactionData, AccountInfo, QueryOptions } from './types';
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

  // Add SDK methods here
}

export default SoonSDK; 