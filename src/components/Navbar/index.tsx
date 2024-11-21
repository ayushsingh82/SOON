import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNetwork } from '../../contexts/NetworkContext';

const Navbar: React.FC = () => {
  const { network, setNetworkById, availableNetworks } = useNetwork();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

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

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Show/Hide based on menu state */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {[
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/blocks', label: 'Blocks' },
              { path: '/transactions', label: 'Transactions' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-red-500 bg-red-500/10'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 