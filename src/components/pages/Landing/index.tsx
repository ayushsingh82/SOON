import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNetwork } from '../../../contexts/NetworkContext';

const LandingPage: React.FC = () => {
  const { network } = useNetwork();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated Background with floating particles */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_50%)]"></div>
        {/* Animated dots */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-500/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-32 pb-40" ref={heroRef}>
          <div className="text-center space-y-8 animate-on-scroll opacity-0">
            <div className="inline-block animate-bounce-slow">
              <span className="inline-block text-red-500 text-xl font-medium px-4 py-2 border border-red-500/20 rounded-full mb-6">
                Explore the Future of Blockchain
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-600 to-red-700 animate-pulse-slow">
                SOON Network
              </span>
              <br />
              <span className="text-4xl md:text-6xl text-white mt-4 block">
                Blockchain Explorer
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
              Dive into the decentralized world of SOON Network. Monitor transactions, explore blocks, 
              and analyze network activity in real-time with our advanced blockchain explorer.
            </p>
            <div className="flex justify-center gap-6 pt-8">
              <Link
                to="/dashboard"
                className="group relative px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 overflow-hidden transform hover:scale-105"
              >
                <span className="relative z-10">Launch Explorer</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent animate-shimmer"></div>
                </div>
              </Link>
              <a
                href={network.bridgeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 relative overflow-hidden"
              >
                <span className="relative z-10">Bridge Assets</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent animate-shimmer"></div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-black/50 py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 animate-on-scroll opacity-0">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
                Powerful Features
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "⚡",
                  title: "Lightning Fast",
                  description: "Experience blazing-fast block confirmations and real-time transaction processing with SOON Network's advanced infrastructure."
                },
                {
                  icon: "🔍",
                  title: "Advanced Analytics",
                  description: "Dive deep into network metrics, analyze transaction patterns, and monitor blockchain health with our comprehensive tools."
                },
                {
                  icon: "🌉",
                  title: "Seamless Bridge",
                  description: "Transfer assets effortlessly between SOON Network and other blockchains with our secure cross-chain bridge technology."
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-gray-900/30 p-8 rounded-xl hover:bg-gray-800/40 transition-all duration-500 transform hover:-translate-y-2 animate-on-scroll opacity-0 hover:shadow-2xl hover:shadow-red-900/20"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-red-500 group-hover:text-red-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Network Stats with animated counters */}
        <div className="container mx-auto px-4 py-32">
          <div className="bg-gradient-to-br from-gray-900/90 to-black rounded-2xl p-12 animate-on-scroll opacity-0 shadow-xl shadow-red-900/10">
            <h2 className="text-3xl font-bold mb-12 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
                Network Resources
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'RPC Node', url: network.rpcUrl, desc: 'Connect directly to the SOON Network' },
                { title: 'Bridge', url: network.bridgeUrl, desc: 'Transfer assets securely cross-chain' },
                { title: 'Explorer', url: network.explorerUrl, desc: 'Track transactions in real-time' },
                { title: 'Faucet', url: network.faucetUrl, desc: 'Get testnet tokens instantly' }
              ].map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 bg-black/50 rounded-xl hover:bg-gray-800/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-red-900/20"
                >
                  <h3 className="font-medium mb-2 text-red-500 group-hover:text-red-400">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300">{resource.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800/50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400">
                Powered by SOON Network
              </div>
              <div className="flex space-x-6">
                <a
                  href="https://soo.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Website
                </a>
                <a
                  href={network.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Explorer
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage; 