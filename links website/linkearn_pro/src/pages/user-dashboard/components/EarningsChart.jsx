import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EarningsChart = ({ links = [], totalEarnings = 0, totalClicks = 0 }) => {
  const [viewType, setViewType] = useState('monthly');

  const generateChartData = useMemo(() => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const currentYear = new Date().getFullYear();

    if (!links || links.length === 0) {
      if (viewType === 'monthly') {
        return monthNames.map((month) => ({
          name: month,
          earnings: totalEarnings > 0 ? (totalEarnings / 12) * (0.5 + Math.random()) : 0,
          clicks: totalClicks > 0 ? Math.floor((totalClicks / 12) * (0.5 + Math.random())) : 0
        }));
      } else {
        const yearlyData = [];
        const now = new Date();
        for (let i = 4; i >= 0; i--) {
          const year = now.getFullYear() - i;
          const yearEarnings = totalEarnings > 0 ? (totalEarnings / 5) * (0.3 + (i * 0.2)) : 0;
          const yearClicks = totalClicks > 0 ? Math.floor((totalClicks / 5) * (0.3 + (i * 0.2))) : 0;
          yearlyData.push({
            name: year.toString(),
            earnings: yearEarnings,
            clicks: yearClicks
          });
        }
        return yearlyData;
      }
    }

    if (viewType === 'monthly') {
      return monthNames.map((monthName, index) => {
        const monthLinks = links.filter(link => {
          if (!link.createdat) return false;
          const linkDate = new Date(link.createdat);
          return (
            linkDate.getFullYear() === currentYear &&
            linkDate.getMonth() === index
          );
        });

        const monthEarnings = monthLinks.reduce((sum, link) => sum + (link.earnings || 0), 0);
        const monthClicks = monthLinks.reduce((sum, link) => sum + (link.clicks || 0), 0);

        return {
          name: monthName,
          earnings: monthEarnings,
          clicks: monthClicks
        };
      });
    } else {
      const yearlyData = [];
      const now = new Date();
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const yearLinks = links.filter(link => {
          if (!link.createdat) return false;
          const linkDate = new Date(link.createdat);
          return linkDate.getFullYear() === year;
        });

        const yearEarnings = yearLinks.reduce((sum, link) => sum + (link.earnings || 0), 0);
        const yearClicks = yearLinks.reduce((sum, link) => sum + (link.clicks || 0), 0);

        yearlyData.push({
          name: year.toString(),
          earnings: yearEarnings,
          clicks: yearClicks
        });
      }
      return yearlyData;
    }
  }, [links, viewType, totalEarnings, totalClicks]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !Array.isArray(payload) || payload.length === 0) {
      return null;
    }

    try {
      const earningsPayload = payload.find(p => p?.dataKey === 'earnings');
      const clicksPayload = payload.find(p => p?.dataKey === 'clicks');

      const earningsValue = earningsPayload?.value || 0;
      const clicksValue = clicksPayload?.value || 0;

      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary mb-2">{label || 'Unknown'}</p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-text-secondary">Earnings:</span>
              <span className="text-sm font-medium text-text-primary">₹{earningsValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-sm text-text-secondary">Clicks:</span>
              <span className="text-sm font-medium text-text-primary">{clicksValue.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error in CustomTooltip:', error);
      return null;
    }
  };

  if (!generateChartData || generateChartData.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-border p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">Earnings Overview</h3>
        </div>
        <div className="flex items-center justify-center h-64 text-text-secondary">
          <p>No earnings data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">Earnings Overview</h3>
        </div>

        <div className="flex items-center space-x-1 bg-surface-secondary rounded-lg p-1">
          <Button
            variant={viewType === 'monthly' ? 'primary' : 'ghost'}
            size="xs"
            onClick={() => setViewType('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={viewType === 'yearly' ? 'primary' : 'ghost'}
            size="xs"
            onClick={() => setViewType('yearly')}
          >
            Yearly
          </Button>
        </div>
      </div>

      <div className="w-full h-64" aria-label="Earnings Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={generateChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="name"
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickFormatter={(value) => {
                if (typeof value !== 'number') return '₹0';
                return `₹${(value / 1000).toFixed(0)}K`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="earnings"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
              name="Earnings"
            />
            <Bar
              dataKey="clicks"
              fill="var(--color-accent)"
              radius={[4, 4, 0, 0]}
              name="Clicks"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-sm text-text-secondary">Earnings (₹)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <span className="text-sm text-text-secondary">Clicks</span>
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;
