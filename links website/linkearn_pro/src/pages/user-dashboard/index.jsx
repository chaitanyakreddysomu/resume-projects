import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import GlobalHeader from '../../components/ui/GlobalHeader';
import UserBottomTabs from '../../components/ui/UserBottomTabs';
import WithdrawalTimer from '../../components/ui/WithdrawalTimer';
import MetricsCard from './components/MetricsCard';
import EarningsChart from './components/EarningsChart';
import QuickActions from './components/QuickActions';
import RecentLinks from './components/RecentLinks';
import ActivityFeed from './components/ActivityFeed';
import ReferralSection from './components/ReferralSection';
import Button from '../../components/ui/Button';
import API_BASE_URL from 'utils/config';

const UserDashboard = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate
  const [userMetrics, setUserMetrics] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    availableBalance: 0,
    totalClicks: 0,
    activeLinks: 0,
    monthlyGrowth: 0,
    clickGrowth: 0,
    referralEarnings: 0,
    referredUsersCount: 0
  });
  const [userName, setUserName] = useState('User');
  const [isLoading, setIsLoading] = useState(true);
  const [userLinks, setUserLinks] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key to trigger re-renders
  

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser).token : null;
    if (!token) {
      navigate('/user-login'); // Redirect to login if no token
    }
  }, [navigate]);
  // Add periodic refresh of admin settings
  useEffect(() => {
    const refreshAdminSettings = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) return;

        // Fetch admin settings to trigger refresh in child components
        await fetch(`${API_BASE_URL}/api/user/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Increment refresh key to trigger re-renders
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Error refreshing admin settings:', error);
      }
    };

    // Refresh every 30 seconds
    const interval = setInterval(refreshAdminSettings, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      
      if (!token) {
        console.error('No authentication token found');
        setIsLoading(false);
        return;
      }

      // Fetch user profile for name
      const profileResponse = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const fullName = [profileData.firstname, profileData.lastname].filter(Boolean).join(' ');
        setUserName(fullName || 'User');
      }

      // Fetch earnings data (includes proper withdrawal calculations)
      const earningsResponse = await fetch(`${API_BASE_URL}/api/user/earnings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (earningsResponse.ok) {
        const earningsData = await earningsResponse.json();
        console.log('Earnings data:', earningsData);
        
        // Use earnings data from API (properly calculated with withdrawals)
        setUserMetrics(prev => ({
          ...prev,
          totalEarnings: earningsData.total || 0,
          monthlyEarnings: earningsData.currentMonth || 0,
          availableBalance: earningsData.availableBalance || 0,
          totalClicks: 0, // Will be updated from links
          activeLinks: 0, // Will be updated from links
          monthlyGrowth: 12.5, // Mock growth
          clickGrowth: 8.3 // Mock growth
        }));
      }

      // Fetch dashboard data (includes referral information)
      const dashboardResponse = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        console.log('Dashboard data:', dashboardData);
        
        setUserMetrics(prev => ({
          ...prev,
          referralEarnings: dashboardData.referralEarnings || 0,
          referredUsersCount: dashboardData.referredUsersCount || 0
        }));
      }

      // Fetch links to calculate clicks and active links
      const linksResponse = await fetch(`${API_BASE_URL}/api/links`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (linksResponse.ok) {
        const linksData = await linksResponse.json();
        
        // Calculate clicks and active links from links data
        const totalClicks = linksData.reduce((sum, link) => sum + (link.clicks || 0), 0);
        const activeLinks = linksData.filter(link => link.status === 'active').length;
        
        setUserMetrics(prev => ({
          ...prev,
          totalClicks,
          activeLinks
        }));
        setUserLinks(linksData);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Keep default values if API fails
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <main className="pt-16 pb-20 md:pt-30 md:pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-text-secondary">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </main>
        <UserBottomTabs />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      {/* Main Content */}
      <main className="pt-16 pb-20 md:pt-30 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-text-secondary">
                Here's what's happening with your links today.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              onClick={() => setRefreshKey(prev => prev + 1)}
              title="Refresh settings"
            />
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricsCard
              title="Total Earnings"
              value={`₹${userMetrics.totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 4 })}`}
              icon="IndianRupee"
              trend="up"
              trendValue={`+${userMetrics.monthlyGrowth}%`}
              color="success"
            />
            <MetricsCard
              title="Available Balance"
              value={`₹${userMetrics.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 4 })}`}
              icon="Wallet"
              trend="up"
              trendValue="Ready"
              color="primary"
            />
            <MetricsCard
              title="Referral Earnings"
              value={`₹${userMetrics.referralEarnings.toLocaleString('en-IN', { minimumFractionDigits: 4 })}`}
              icon="Users"
              trend="up"
              trendValue={`${userMetrics.referredUsersCount} users`}
              color="accent"
            />
            <MetricsCard
              title="Active Links"
              value={userMetrics.activeLinks.toString()}
              icon="Link"
              color="warning"
            />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts and Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Earnings Chart */}
              <EarningsChart links={userLinks} totalEarnings={userMetrics.totalEarnings} totalClicks={userMetrics.totalClicks} />

              {/* Quick Actions and Withdrawal Timer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickActions 
                  availableBalance={userMetrics.availableBalance} 
                  onDataRefresh={fetchDashboardData}
                />
                <WithdrawalTimer />
              </div>

              {/* Referral Section */}
              <ReferralSection />

              {/* Recent Links - Mobile */}
              {/* Removed duplicate: <div className="lg:hidden"><RecentLinks key={refreshKey} /></div> */}
            </div>

            {/* Right Column - Recent Activity and Links */}
            <div className="space-y-6">
              {/* Recent Links - Desktop */}
              <div className="hidden lg:block">
                <RecentLinks key={refreshKey} />
              </div>

              {/* Activity Feed */}
              {/* <ActivityFeed /> */}
            </div>
          </div>

          {/* Mobile Recent Links */}
          <div className="mt-6 lg:hidden">
            <RecentLinks key={refreshKey} />
          </div>
        </div>
      </main>

      <UserBottomTabs />
    </div>
  );
};

export default UserDashboard;