import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">SOON Explorer</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-primary">Dashboard</Link>
          <Link to="/blocks" className="hover:text-primary">Blocks</Link>
          <Link to="/transactions" className="hover:text-primary">Transactions</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 