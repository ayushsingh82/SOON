import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNetwork } from '../../contexts/NetworkContext';

const Navbar: React.FC = () => {
  const { network, setNetworkById, availableNetworks } = useNetwork();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [sdkOpen, setSDKOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const sdkExamples = [
    { title: 'Get Latest Block', code: 'const latestBlock = await sdk.getLatestBlock();' },
    { title: 'Get Multiple Blocks', code: 'const blocks = await sdk.getBlocks({ limit: 10 });' },
    { title: 'Get Transaction', code: 'const tx = await sdk.getTransaction(signature);' },
    { title: 'Get Account Info', code: 'const account = await sdk.getAccountInfo(address);' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold hover:text-red-500 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-700 rounded-lg flex items-center justify-center">
              <span className="text-white">S</span>
            </div>
            <span>SOON Explorer</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/blocks', label: 'Blocks' },
              { path: '/transactions', label: 'Transactions' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-all duration-200 relative group ${
                  isActive(item.path)
                    ? 'text-red-500 bg-red-500/10'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform origin-left transition-transform duration-300 ${
                    isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}

            {/* SDK Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setSDKOpen(!sdkOpen)}
                className="px-4 py-2 rounded-lg transition-all duration-200 text-gray-300 hover:text-white flex items-center space-x-1"
              >
                <span>SDK</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    sdkOpen ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* SDK Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-xl transition-all duration-200 ${
                  sdkOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                <div className="p-4 space-y-4">
                  {/* SDK Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-red-500">SOON Network SDK</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      A powerful SDK for interacting with the SOON Network
                    </p>
                  </div>

                  {/* Quick Examples */}
                  <div>
                    <h3 className="text-sm font-semibold text-red-500">Quick Examples</h3>
                    <div className="mt-2 space-y-2">
                      {sdkExamples.map((example, index) => (
                        <div key={index} className="p-2 rounded-lg bg-gray-900/50 hover:bg-gray-700/50 transition-colors">
                          <p className="text-xs text-gray-400">{example.title}</p>
                          <code className="block mt-1 text-xs font-mono text-red-400">
                            {example.code}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SDK Setup */}
                  <div>
                    <h3 className="text-sm font-semibold text-red-500">Setup</h3>
                    <div className="mt-2 p-2 rounded-lg bg-gray-900/50">
                      <code className="block text-xs font-mono text-red-400">
                        const sdk = SoonSDK.initialize({'{'}<br/>
                        &nbsp;&nbsp;rpcUrl: "{network.rpcUrl}",<br/>
                        &nbsp;&nbsp;archiveUrl: "https://v2.archive.subsquid.io/network/soon-devnet",<br/>
                        &nbsp;&nbsp;firstBlock: 2471639<br/>
                        {'}'});
                      </code>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="pt-2 border-t border-gray-700">
                    <a
                      href="https://github.com/your-repo/soon-sdk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      View on GitHub →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Network Selector */}
          <div className="flex items-center space-x-4">
            <select
              value={network.id}
              onChange={(e) => setNetworkById(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg cursor-pointer border border-gray-700 hover:border-red-500 transition-colors focus:outline-none focus:border-red-500"
            >
              {availableNetworks.map((net) => (
                <option key={net.id} value={net.id}>
                  {net.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 