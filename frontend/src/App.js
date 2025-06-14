import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TransactionForm from './pages/TransactionForm';
import Alerts from './pages/Alerts';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/check-transaction" element={<TransactionForm />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 