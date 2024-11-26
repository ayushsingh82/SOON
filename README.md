# SOON Network Explorer & SDK

A comprehensive blockchain explorer and SDK for the SOON Network. Built for developers, by developers.

## 🚀 Features

- Real-time blockchain data exploration
- Transaction tracking and analysis
- Block inspection with detailed views
- Account monitoring and balance tracking
- Comprehensive SDK for developers
- Support for both Testnet and Devnet

## 🛠 Quick Start

### Explorer Installation

```bash
# Clone the repository
https://github.com/ayushsingh82/SOON

# Install dependencies
npm install

# Start development server
npm run dev
```

### SDK Installation

```bash
npm install soon-blockchain-sdk
```

## 📦 SOON Network SDK

Our official SDK is available as an npm package: [soon-blockchain-sdk](https://www.npmjs.com/package/soon-blockchain-sdk)

### SDK Usage Example

```javascript
import { SoonSDK } from 'soon-blockchain-sdk';

// Initialize SDK
const sdk = SoonSDK.initialize({
  rpcUrl: "https://rpc.testnet.soo.network/rpc",
  archiveUrl: "https://v2.archive.subsquid.io/network/soon-devnet",
  firstBlock: 2471639,
});

// Get latest block
const latestBlock = await sdk.getLatestBlock();
```

## 🌐 Network Support

### Testnet
- RPC Node: https://rpc.testnet.soo.network/rpc
- Bridge: https://bridge.testnet.soo.network/
- Explorer: https://explorer.testnet.soo.network/

### Devnet
- RPC Node: https://rpc.devnet.soo.network/rpc
- Bridge: https://bridge.devnet.soo.network/
- Explorer: https://explorer.devnet.soo.network/

## 🔧 Explorer Features

- **Dashboard**: Real-time network overview with key metrics
- **Block Explorer**: Detailed view of blocks and their contents
- **Transaction Viewer**: Track and analyze transactions
- **Account Explorer**: Monitor account balances and activities
- **Network Stats**: Comprehensive network statistics

## 💻 Technology Stack

- React + Vite
- TypeScript
- Tailwind CSS
- Axios for API calls
- Recharts for data visualization

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [SDK Package](https://www.npmjs.com/package/soon-blockchain-sdk)
- [SOON Network Website](https://soo.network/)
- [Documentation](https://docs.sqd.dev/solana-indexing/)
- [Testnet Explorer](https://explorer.testnet.soo.network/)

## 🤔 Support

For support and questions:
- Open an issue in the GitHub repository
- Join our community channels
- Check our documentation

## ✨ Acknowledgments

- SOON Network team
- All contributors
- Community members

