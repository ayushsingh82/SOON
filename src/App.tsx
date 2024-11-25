import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NetworkProvider } from './contexts/NetworkContext';
import Navbar from './components/Navbar';
import LandingPage from './components/pages/Landing';
import Dashboard from './components/pages/Dashboard';
import Blocks from './components/pages/Blocks';
import Transactions from './components/pages/Transactions';
import SDKDocs from './components/pages/SDKDocs';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-900 text-white">
    <Navbar />
    <main className="container mx-auto px-4 py-8">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <NetworkProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
          <Route path="/blocks" element={
            <AppLayout>
              <Blocks />
            </AppLayout>
          } />
          <Route path="/transactions" element={
            <AppLayout>
              <Transactions />
            </AppLayout>
          } />
          <Route path="/sdk" element={
            <AppLayout>
              <SDKDocs />
            </AppLayout>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </NetworkProvider>
  );
}

export default App; 