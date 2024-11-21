import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NetworkProvider } from './contexts/NetworkContext';
import Navbar from './components/Navbar';
import LandingPage from './components/pages/Landing';
import Dashboard from './components/pages/Dashboard';
import Blocks from './components/pages/Blocks';
import Transactions from './components/pages/Transactions';

function App() {
  return (
    <NetworkProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-900 text-white">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="blocks" element={<Blocks />} />
                    <Route path="transactions" element={<Transactions />} />
                  </Routes>
                </main>
              </div>
            }
          />
        </Routes>
      </Router>
    </NetworkProvider>
  );
}

export default App; 