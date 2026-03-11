// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Admin.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
  const [emailData, setEmailData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

 useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching data from APIs...");

      const EVENTS_API =
        import.meta.env.VITE_EVENTS_API ||
        "https://micro-frontend-events.vercel.app";

      const PRICING_API =
        import.meta.env.VITE_PRICING_API ||
        "https://micro-frontend-pricing.vercel.app";

      const [emailsRes, usersRes] = await Promise.all([
        fetch(`${EVENTS_API}/api/emails`),
        fetch(`${PRICING_API}/api/userdata`)
      ]);

      console.log("Email response status:", emailsRes.status);
      console.log("User response status:", usersRes.status);

      if (!emailsRes.ok) {
        throw new Error(`Email API error: ${emailsRes.status}`);
      }

      if (!usersRes.ok) {
        throw new Error(`User API error: ${usersRes.status}`);
      }

      const emailsJson = await emailsRes.json();
      const usersJson = await usersRes.json();

      console.log("Email data received:", emailsJson);
      console.log("User data received:", usersJson);

      setEmailData(emailsJson);
      setUserData(usersJson);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  // Process email data for charts
  const getEmailStats = () => {
    if (!emailData?.data) return null;

    const emails = emailData.data;
    const totalEmails = emails.length;

    // Group by date (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const dailySignups = last7Days.map(date => {
      return emails.filter(e => e.createdTime.split('T')[0] === date).length;
    });

    return { totalEmails, dailySignups, last7Days };
  };

  // Process user data for charts
  const getUserStats = () => {
    if (!userData?.data) return null;

    const users = userData.data;
    const totalSubscriptions = users.length;

    // Plan distribution
    const planCounts = users.reduce((acc, user) => {
      acc[user.plan] = (acc[user.plan] || 0) + 1;
      return acc;
    }, {});

    // Location distribution (top 5)
    const locationCounts = users
      .filter(u => u.address)
      .reduce((acc, user) => {
        // Extract city/location (simplified)
        const location = user.address.split(',').pop().trim() || 'Unknown';
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {});

    const topLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { totalSubscriptions, planCounts, topLocations };
  };

  // Sorting function for user table
  const sortedUsers = () => {
    if (!userData?.data) return [];
    
    const sortableUsers = [...userData.data];
    sortableUsers.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableUsers;
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Loading state
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="admin-error">
        <h3>⚠️ Error Loading Data</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  // Calculate stats
  const emailStats = getEmailStats();
  const userStats = getUserStats();

  // Chart data configurations
  const pieChartData = {
    labels: userStats ? Object.keys(userStats.planCounts) : [],
    datasets: [{
      data: userStats ? Object.values(userStats.planCounts) : [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    }]
  };

  const barChartData = {
    labels: emailStats?.last7Days || [],
    datasets: [{
      label: 'Daily Email Signups',
      data: emailStats?.dailySignups || [],
      backgroundColor: '#36A2EB',
      borderRadius: 6
    }]
  };

  const locationChartData = {
    labels: userStats?.topLocations.map(l => l[0]) || [],
    datasets: [{
      label: 'Subscribers by Location',
      data: userStats?.topLocations.map(l => l[1]) || [],
      backgroundColor: '#FFCE56',
      borderRadius: 6
    }]
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">📊 Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>📧 Email Subscribers</h3>
          <p className="stat-number">{emailStats?.totalEmails || 0}</p>
          <p className="stat-label">Total signups</p>
        </div>
        <div className="stat-card">
          <h3>📋 Active Subscriptions</h3>
          <p className="stat-number">{userStats?.totalSubscriptions || 0}</p>
          <p className="stat-label">Total plans</p>
        </div>
        <div className="stat-card">
          <h3>📊 Plan Distribution</h3>
          <div className="mini-legend">
            {userStats && Object.entries(userStats.planCounts).map(([plan, count]) => (
              <div key={plan} className="legend-item">
                <span className="legend-color" style={{
                  backgroundColor: 
                    plan === 'Basic' ? '#FF6384' : 
                    plan === 'Pro' ? '#36A2EB' : 
                    plan === 'Developer' ? '#FFCE56' : '#4BC0C0'
                }}></span>
                <span>{plan}: {count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>📧 Email Signups (Last 7 Days)</h3>
          <div className="chart-container">
            <Bar 
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { 
                    backgroundColor: '#333',
                    callbacks: {
                      label: (context) => `${context.raw} signups`
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <h3>🥧 Plan Distribution</h3>
          <div className="chart-container">
            <Pie 
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <h3>📍 Top Locations</h3>
          <div className="chart-container">
            <Bar 
              data={locationChartData}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.raw} subscribers`
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="table-container">
        <h3>📋 Subscription Details</h3>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')}>
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('email')}>
                  Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('plan')}>
                  Plan {sortConfig.key === 'plan' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('address')}>
                  Location {sortConfig.key === 'address' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th>Subscribed On</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers().map((user) => (
                <tr key={user.id}>
                  <td>{user.name || '—'}</td>
                  <td>{user.email || '—'}</td>
                  <td>
                    <span className={`plan-badge ${user.plan?.toLowerCase()}`}>
                      {user.plan || '—'}
                    </span>
                  </td>
                  <td>{user.address || '—'}</td>
                  <td>{new Date(user.createdTime).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Email Subscribers */}
      <div className="table-container">
        <h3>📧 Recent Email Subscribers</h3>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed On</th>
              </tr>
            </thead>
            <tbody>
              {emailData?.data.slice(0, 10).map((email) => (
                <tr key={email.id}>
                  <td>{email.email}</td>
                  <td>{new Date(email.createdTime).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;