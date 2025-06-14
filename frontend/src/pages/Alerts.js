import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get('http://localhost:8000/api/alerts');
      setAlerts(response.data);
    } catch (err) {
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Fraud Alerts</h1>
        <button
          onClick={fetchAlerts}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {alerts.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No alerts found
            </li>
          ) : (
            alerts.map((alert) => (
              <li key={alert.id} className="px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {alert.is_fraud ? (
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Transaction ID: {alert.transaction_id}
                    </p>
                    <p className="text-sm text-gray-500">
                      Amount: ${alert.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Risk Score: {alert.risk_score.toFixed(2)}
                    </p>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          alert.is_fraud
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {alert.is_fraud ? 'Fraudulent' : 'Legitimate'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
                {alert.explanation && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p className="font-medium">Explanation:</p>
                    <ul className="mt-1 list-disc list-inside">
                      {alert.explanation.map((exp, index) => (
                        <li key={index}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Alerts; 