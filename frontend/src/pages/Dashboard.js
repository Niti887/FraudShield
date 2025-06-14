import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

function Dashboard() {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    fraudCount: 0,
    legitimateCount: 0,
    averageRiskScore: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Replace with actual API endpoint
      const response = await axios.get('http://localhost:8000/api/dashboard-stats');
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const pieChartData = {
    labels: ['Legitimate', 'Fraudulent'],
    datasets: [
      {
        data: [stats.legitimateCount, stats.fraudCount],
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#059669', '#DC2626'],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Fraud Cases',
        data: [12, 19, 15, 17, 22, 25, 18],
        borderColor: '#EF4444',
        tension: 0.4,
      },
    ],
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
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalTransactions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Fraudulent Transactions</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">{stats.fraudCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Legitimate Transactions</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">{stats.legitimateCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Average Risk Score</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.averageRiskScore.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Distribution</h3>
          <div className="h-64">
            <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Fraud Trends</h3>
          <div className="h-64">
            <Line
              data={lineChartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 