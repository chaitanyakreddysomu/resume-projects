import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import UserBottomTabs from '../../components/ui/UserBottomTabs';
import WithdrawalTimer from '../../components/ui/WithdrawalTimer';
import EarningsOverviewCards from './components/EarningsOverviewCards';
import EarningsChart from './components/EarningsChart';
import TopPerformingLinks from './components/TopPerformingLinks';
import GeographicAnalytics from './components/GeographicAnalytics';
import TimeBasedAnalytics from './components/TimeBasedAnalytics';
import TransactionHistory from './components/TransactionHistory';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import API_BASE_URL from 'utils/config';
// import MetricsCard from '../user-dashboard/components/MetricsCard';

const EarningsAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key
  const [shortLinkDomain, setShortLinkDomain] = useState('linkearn.pro');

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) throw new Error('User not authenticated');
      const response = await fetch(`${API_BASE_URL}/api/user/earnings/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setAnalytics(null);
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const fetchShortLinkDomain = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/user/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setShortLinkDomain(data.generalSettings?.shortLinkDomain);
        }
      } catch (error) {
        console.error('Error fetching short link domain:', error);
      }
    };

    fetchShortLinkDomain();
  }, []);

  useEffect(() => {
    const refreshUserSettings = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) return;

        // Fetch user settings to trigger refresh
        await fetch(`${API_BASE_URL}/api/user/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Increment refresh key to trigger re-renders
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Error refreshing user settings:', error);
      }
    };

    // Refresh every 30 seconds
    const interval = setInterval(refreshUserSettings, 30000);
    
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const fetchLinks = async () => {
      setLinksLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/links`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          // Format links to match the expected structure for both TimeBasedAnalytics and TopPerformingLinks
          const formattedLinks = data.map(link => ({
            id: link.id,
            createdat: link.createdat || link.createdAt || new Date().toISOString(),
            clicks: link.clicks || 0,
            earnings: link.earnings || 0,
            originalurl: link.originalurl || link.originalUrl || '',
            url: link.url || '',
            status: link.status || 'active',
            // Additional properties for TopPerformingLinks
            title: link.url || 'Untitled Link',
            shortUrl: link.url,
            originalUrl: link.originalurl || link.originalUrl || '',
            createdAt: link.createdat || link.createdAt || new Date().toISOString(),
            category: link.category || null,
            cpm: link.cpm || null,
            pages: link.pages || null
          }));
          setLinks(formattedLinks);
        }
      } catch (error) {
        console.error('Error fetching links for analytics:', error);
      } finally {
        setLinksLoading(false);
      }
    };
    fetchLinks();
  }, [refreshKey, shortLinkDomain]); // 👈 watch for refreshKey and domain changes

  const handleExportData = () => {
    // Export functionality
    console.log('Exporting earnings data...');
  };

  const handleRefreshData = () => {
    fetchAnalytics();
    // Also refresh links data
    const fetchLinks = async () => {
      setLinksLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/links`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          const formattedLinks = data.map(link => ({
            id: link.id,
            createdat: link.createdat || link.createdAt || new Date().toISOString(),
            clicks: link.clicks || 0,
            earnings: link.earnings || 0,
            originalurl: link.originalurl || link.originalUrl || '',
            url: link.url || '',
            status: link.status || 'active',
            // Additional properties for TopPerformingLinks
            title: link.url || 'Untitled Link',
            shortUrl: link.url,
            originalUrl: link.originalurl || link.originalUrl || '',
            createdAt: link.createdat || link.createdAt || new Date().toISOString(),
            category: link.category || null,
            cpm: link.cpm || null,
            pages: link.pages || null
          }));
          setLinks(formattedLinks);
        }
      } catch (error) {
        console.error('Error refreshing links for analytics:', error);
      } finally {
        setLinksLoading(false);
      }
    };
    fetchLinks();
  };

  // Loading state
  if (isLoading || !analytics) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <main className="pt-16 md:pt-30 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading analytics...</p>
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
      <main className="pt-16 md:pt-30 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Earnings & Analytics</h1>
              <p className="text-text-secondary">
                Comprehensive insights into your link performance and earnings
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={handleRefreshData}
              >
                Refresh
              </Button>
              {/* <Button
                variant="primary"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={handleExportData}
              >
                Export Data
              </Button> */}
            </div>
          </div>

          {/* Metrics Cards - Same as Dashboard */}
          {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricsCard
              title="Total Earnings"
              value={`₹${analytics.totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 4 })}`}
              icon="IndianRupee"
              trend="up"
              trendValue={analytics.last30DaysEarnings ? `+${((analytics.last30DaysEarnings / (analytics.totalEarnings || 1)) * 100).toFixed(1)}%` : '+0%'}
              color="success"
            />
            <MetricsCard
              title="Available Balance"
              value={`₹${(analytics.totalEarnings).toLocaleString('en-IN', { minimumFractionDigits: 4 })}`}
              icon="Wallet"
              trend="up"
              trendValue="Ready"
              color="primary"
            />
            <MetricsCard
              title="Total Clicks"
              value={analytics.totalClicks.toLocaleString('en-IN')}
              icon="MousePointer"
              trend="up"
              trendValue={analytics.last30DaysEarnings && analytics.totalClicks ? `+${((analytics.last30DaysEarnings / analytics.totalClicks) * 100).toFixed(1)}%` : '+0%'}
              color="accent"
            />
            <MetricsCard
              title="Active Links"
              value={analytics.activeLinks.toString()}
              icon="Link"
              color="warning"
            />
          </div> */}

          {/* Earnings Overview Cards */}
          <EarningsOverviewCards
            totalEarnings={analytics.totalEarnings}
            totalClicks={analytics.totalClicks}
            activeLinks={analytics.activeLinks}
            last30DaysEarnings={analytics.last30DaysEarnings}
            last7DaysEarnings={analytics.last7DaysEarnings}
            last24HoursEarnings={analytics.last24HoursEarnings}
          />

          {/* Withdrawal Timer */}
          <WithdrawalTimer />

          {/* Earnings Chart */}
          <EarningsChart
            links={analytics.earningsTrend}
            totalEarnings={analytics.totalEarnings}
            totalClicks={analytics.totalClicks}
          />

          {/* Two Column Layout for Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Links */}
            <div className="lg:col-span-2">
              <TopPerformingLinks links={links} shortLinkDomain={shortLinkDomain} />
            </div>
            {/* Geographic Analytics */}
            {/* <GeographicAnalytics /> */}
          </div>

          {/* Time-Based Analytics - Full Width */}
          <TimeBasedAnalytics />

          {/* Transaction History */}
          <TransactionHistory />

          {/* Quick Actions */}
          

          {/* Performance Summary */}
       
        </div>
      </main>
      <UserBottomTabs />
    </div>
  );
};

export default EarningsAnalytics;