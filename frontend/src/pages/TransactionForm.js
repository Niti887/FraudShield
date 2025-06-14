import React, { useState } from 'react';
import axios from 'axios';

function TransactionForm() {
  const [formData, setFormData] = useState({
    amount: '',
    timestamp: new Date().toISOString().slice(0, 16),
    merchant_id: '',
    card_number: '',
    transaction_type: 'purchase',
    location: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post('http://localhost:8000/api/check-transaction', formData);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while checking the transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Check Transaction</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Timestamp</label>
            <input
              type="datetime-local"
              name="timestamp"
              value={formData.timestamp}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Merchant ID</label>
            <input
              type="text"
              name="merchant_id"
              value={formData.merchant_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              name="card_number"
              value={formData.card_number}
              onChange={handleChange}
              required
              pattern="[0-9]{16}"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
            <select
              name="transaction_type"
              value={formData.transaction_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="purchase">Purchase</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location (Optional)</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Transaction'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {prediction && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Prediction Result</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Fraud Probability:</span>{' '}
                {(prediction.fraud_probability * 100).toFixed(2)}%
              </p>
              <p className="text-sm">
                <span className="font-medium">Risk Score:</span>{' '}
                {prediction.risk_score.toFixed(2)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span>{' '}
                <span className={prediction.is_fraud ? 'text-red-600' : 'text-green-600'}>
                  {prediction.is_fraud ? 'Fraudulent' : 'Legitimate'}
                </span>
              </p>
              <div className="mt-2">
                <p className="text-sm font-medium">Explanation:</p>
                <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                  {prediction.explanation.map((exp, index) => (
                    <li key={index}>{exp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionForm; 