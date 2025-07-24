import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import GlobalHeader from '../../components/ui/GlobalHeader';
import AdminSidebar from '../../components/ui/AdminSidebar';
import MetricsCard from './components/MetricsCard';
import ActivityFeed from './components/ActivityFeed';
import UserGrowthChart from './components/UserGrowthChart';
import EarningsDistribution from './components/EarningsDistribution';
import CriticalAlerts from './components/CriticalAlerts';
import QuickActions from './components/QuickActions';
import TopPerformers from './components/TopPerformers';
import AccessDenied from './components/AccessDenied';
import API_BASE_URL from 'utils/config';

const AdminDashboard = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const refreshBtnRef = useRef(null);
  const [usersData, setUsersData] = useState([]);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // Check if user role is admin
  if (!user || user.role !== 'admin') {

    return <AccessDenied />;
  }

  // Helper to get current IST time as string in 12-hour format, no IST text
  const getISTString = () => {
    const now = new Date();
    // Convert to IST (UTC+5:30)
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const istTime = new Date(utc + 5.5 * 60 * 60 * 1000);
    // Format: 02 Jun 2024, 03:45:12 PM
    return istTime.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) throw new Error('User not authenticated');

      const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      const data = await res.json();
      setDashboardData(data);
      setLastUpdated(getISTString());
    } catch (err) {
      console.error('Fetch error:', err);
      setFetchError(
        err.message.includes('401')
          ? 'Authentication failed. Please log in again.'
          : err.message || 'Error loading dashboard'
      );
      setDashboardData(null);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users for earnings metrics
  const fetchAllUsers = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) throw new Error('User not authenticated');

      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch users data');
      const data = await res.json();
      setUsersData(data);
    } catch (err) {
      setUsersData([]);
    }
  };

  // On mount, fetch data
  useEffect(() => {
    fetchDashboardData();
    fetchAllUsers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser).token : null;
    if (!token) {
      navigate('/user-login'); // Redirect to login if no token
    }
  }, [navigate]);

  // Calculate totals
  const totalEarnedAllUsers = usersData.reduce(
    (sum, user) => sum + parseFloat(user.totalEarned || 0),
    0
  );
  const availableForWithdrawAllUsers = usersData.reduce(
    (sum, user) => sum + parseFloat(user.availableForWithdraw || 0),
    0
  );
  // NEW: Calculate total clicks/views for all users
  const totalClicksAllUsers = usersData.reduce(
    (sum, user) => sum + parseInt(user.totalClicks || 0, 10),
    0
  );

  // Prepare metricsData from API response
  const metricsData = dashboardData
    ? [
        {
          title: 'Total Users',
          value:
            dashboardData.totalUsers !== undefined && dashboardData.totalUsers !== null
              ? Number(dashboardData.totalUsers).toLocaleString('en-IN')
              : '-',
          change: '',
          changeType: 'neutral',
          icon: 'Users',
          color: 'sky',
        },
        {
          title: 'Total Earned (All Users)',
          value: `₹${totalEarnedAllUsers.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          change: '',
          changeType: 'neutral',
          icon: 'TrendingUp',
          // icon: 'BadgeDollarSign',
          color: 'violet',
        },
        {
          title: 'Total Clicks (All Users)',
          value: totalClicksAllUsers.toLocaleString('en-IN'),
          change: '',
          changeType: 'neutral',
          icon: 'MousePointerClick', // or 'BarChart' or any suitable icon
          color: 'fuchsia',
          // <MousePointerClick />
        },
        {
          title: 'Active Links',
          value:
            dashboardData.activeLinks !== undefined && dashboardData.activeLinks !== null
              ? Number(dashboardData.activeLinks).toLocaleString('en-IN')
              : '-',
          change: '',
          changeType: 'neutral',
          icon: 'Link',
          color: 'indigo',
        },
        {
          title: 'Total Amount Withdrawn',
          value:
            dashboardData.revenue !== undefined && dashboardData.revenue !== null
              ? `₹${Number(dashboardData.revenue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
              : '-',
          change: '',
          changeType: 'neutral',
          icon: 'Banknote',
          color: 'emerald',
        },
        {
          title: 'Available for Withdraw (All Users)',
          value: `₹${availableForWithdrawAllUsers.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          change: '',
          changeType: 'neutral',
          icon: 'Wallet',
          color: 'cyan',
        },
        {
          title: 'Pending Withdrawals',
          value:
            dashboardData.pendingWithdrawals !== undefined && dashboardData.pendingWithdrawals !== null
              ? Number(dashboardData.pendingWithdrawals).toLocaleString('en-IN')
              : '-',
          change: '',
          changeType: 'neutral',
          icon: 'Hourglass',
          // icon: 'Download',
          color: 'amber',
        },
        
        {
          title: 'Amount Requested to Withdraw',
          value:
            dashboardData.amountToBeWithdrawn !== undefined && dashboardData.amountToBeWithdrawn !== null
              ? `₹${Number(dashboardData.amountToBeWithdrawn).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
              : '-',
          change: '',
          changeType: 'neutral',
          icon: 'FileClock',
          color: 'rose',
        },
     
       
       
      ]
    : [];

  // Prepare user growth trends for chart
  const userGrowthTrends = dashboardData?.userGrowthTrends || [];

  // Prepare earnings distribution data for chart
  // (Assuming you want to pass revenue and amountToBeWithdrawn for now)
  const earningsDistributionData = dashboardData
    ? {
        revenue: Number(dashboardData.revenue) || 0,
        amountToBeWithdrawn: Number(dashboardData.amountToBeWithdrawn) || 0,
      }
    : { revenue: 0, amountToBeWithdrawn: 0 };

  // Prepare top performers data
  const topUsers = dashboardData?.topUsers || [];
  const topLinks = dashboardData?.topLinks || [];

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <AdminSidebar />

      <main className="lg:ml-64 pt-16">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
              <p className="text-text-secondary">
                Platform overview and management console
              </p>
            </div>
            <div className="flex items-center space-x-3">
              
              <span className="text-sm text-text-secondary whitespace-nowrap">
                Last updated:{' '}
                {lastUpdated
                  ? lastUpdated
                  : '—'}
              </span>
              <button
                ref={refreshBtnRef}
                onClick={fetchDashboardData}
                className="inline-flex items-center px-3 py-1.5 border border-border rounded-md text-sm font-medium bg-surface hover:bg-surface-secondary transition-colors text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                disabled={loading}
                title="Refresh dashboard"
                style={{ minWidth: 90 }}
              >
                <svg
                  className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582M20 20v-5h-.581m-1.418 2A7.978 7.978 0 0112 20a8 8 0 01-7.938-7M4.062 9A8 8 0 0120 12"
                  />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Loading/Error State */}
          {loading && (
            <div className="text-center text-text-secondary py-12">Loading dashboard...</div>
          )}
          {fetchError && (
            <div className="text-center text-error py-12">Error: {fetchError}</div>
          )}

          {/* Metrics Cards */}
          {!loading && !fetchError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {metricsData.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  changeType={metric.changeType}
                  icon={metric.icon}
                  color={metric.color}
                />
              ))}
            </div>
          )}

          {/* Charts Section */}
          {!loading && !fetchError && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <UserGrowthChart userGrowthTrends={userGrowthTrends} />
              </div>
              {/* <div className="xl:col-span-1">
                <EarningsDistribution data={earningsDistributionData} />
              </div> */}
            </div>
          )}

          {/* Management Section */}
          {!loading && !fetchError && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <CriticalAlerts />
                <QuickActions />
              </div>
              <div className="space-y-6">
                <ActivityFeed recentActivity={dashboardData?.recentActivity || []} />
                <TopPerformers topUsers={topUsers} topLinks={topLinks} />
              </div>
            </div>
          )}

          {/* System Status Footer */}
          {!loading && !fetchError && (
            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm text-text-secondary">
                      System Status: Operational
                    </span>
                  </div>
                  <div className="text-sm text-text-secondary">
                    Uptime: 99.9%
                  </div>
                </div>
                <div className="text-sm text-text-secondary">
                  Server Load:{' '}
                  {dashboardData?.serverLoad
                    ? dashboardData.serverLoad.charAt(0).toUpperCase() +
                      dashboardData.serverLoad.slice(1)
                    : 'Unknown'}{' '}
                  • Response Time: 120ms
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
