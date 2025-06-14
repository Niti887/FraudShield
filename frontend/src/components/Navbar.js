import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, ChartBarIcon, BellIcon } from '@heroicons/react/24/outline';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FraudShield</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <ChartBarIcon className="h-5 w-5 mr-1" />
                Dashboard
              </Link>
              <Link
                to="/check-transaction"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Check Transaction
              </Link>
              <Link
                to="/alerts"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <BellIcon className="h-5 w-5 mr-1" />
                Alerts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 