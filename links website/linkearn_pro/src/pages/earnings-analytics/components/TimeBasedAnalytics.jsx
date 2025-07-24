import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import withdrawalAPI from '../../../utils/api';

const TimeBasedAnalytics = () => {
  const [viewType, setViewType] = useState('hours');
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState({});
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    fetchTimeBasedAnalytics();
  }, []);

  const fetchTimeBasedAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await withdrawalAPI.get('/user/time-based-analytics');
      const { hourlyData, dailyData, currentWeek, currentDay } = response.data;
      
      setHourlyData(hourlyData);
      setDailyData(dailyData);
      setCurrentWeek(currentWeek);
      setCurrentDay(currentDay);
    } catch (err) {
      console.error('Error fetching time-based analytics:', err);
      setError('Failed to load analytics data');
      
      // Set default empty data
      setHourlyData(Array.from({ length: 24 }, (_, i) => ({
        time: `${i.toString().padStart(2, '0')}:00`,
        clicks: 0,
        earnings: 0
      })));
      setDailyData(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
        day,
        clicks: 0,
        earnings: 0
      })));
    } finally {
      setLoading(false);
    }
  };

  const currentData = viewType === 'hours' ? hourlyData : dailyData;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-text-secondary">{entry.dataKey}:</span>
              <span className="text-sm font-medium text-text-primary">
                {entry.dataKey === 'earnings' ? formatCurrency(entry.value) : formatNumber(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getPeakHours = () => {
    const sortedHours = [...hourlyData].sort((a, b) => b.clicks - a.clicks);
    return sortedHours.slice(0, 3);
  };

  const getPeakDays = () => {
    const sortedDays = [...dailyData].sort((a, b) => b.clicks - a.clicks);
    return sortedDays.slice(0, 3);
  };

  const getTimeIcon = (time) => {
    if (viewType === 'hours') {
      const hour = parseInt(time.split(':')[0]);
      if (hour >= 6 && hour < 12) return 'Sunrise';
      if (hour >= 12 && hour < 18) return 'Sun';
      if (hour >= 18 && hour < 22) return 'Sunset';
      return 'Moon';
    }
    return 'Calendar';
  };

  // Helper to get peak and low time/day
  const getPeakLabel = () => {
    if (viewType === 'hours') {
      const peak = hourlyData.reduce((max, item) => item.clicks > max.clicks ? item : max, hourlyData[0]);
      return peak.time;
    } else {
      const peak = dailyData.reduce((max, item) => item.clicks > max.clicks ? item : max, dailyData[0]);
      return peak.day;
    }
  };

  const getLowLabel = () => {
    if (viewType === 'hours') {
      const low = hourlyData.reduce((min, item) => item.clicks < min.clicks ? item : min, hourlyData[0]);
      return low.time;
    } else {
      const low = dailyData.reduce((min, item) => item.clicks < min.clicks ? item : min, dailyData[0]);
      return low.day;
    }
  };

  const avgClicks = currentData.length > 0 ? currentData.reduce((sum, item) => sum + item.clicks, 0) / currentData.length : 0;
  const peakClicks = currentData.length > 0 ? Math.max(...currentData.map(item => item.clicks)) : 0;
  const efficiency = avgClicks > 0 ? Math.min(100, Math.round((peakClicks / avgClicks) * 100)) : 0;

  if (loading) {
    return (
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-text-secondary">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Time-Based Analytics</h2>
          <p className="text-sm text-text-secondary">
            {viewType === 'hours' 
              ? `Today's hourly performance (${currentDay})`
              : `This week's daily performance (${currentWeek.start} to ${currentWeek.end})`
            }
          </p>
        </div>
        
        <div className="flex bg-surface-secondary rounded-lg p-1">
          <button
            onClick={() => setViewType('hours')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              viewType === 'hours' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            Hourly
          </button>
          <button
            onClick={() => setViewType('days')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              viewType === 'days' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            Daily
          </button>
        </div>
      </div>

      <div className="h-64 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey={viewType === 'hours' ? 'time' : 'day'}
              stroke="var(--color-text-secondary)"
              fontSize={12}
              angle={viewType === 'hours' ? -45 : 0}
              textAnchor={viewType === 'hours' ? 'end' : 'middle'}
              height={viewType === 'hours' ? 60 : 30}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="clicks" 
              fill="var(--color-primary)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Peak Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Times */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-text-primary">
            Peak {viewType === 'hours' ? 'Hours' : 'Days'}
          </h3>
          <div className="space-y-3">
            {(viewType === 'hours' ? getPeakHours() : getPeakDays()).map((item, index) => (
              <div key={item.time || item.day} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Icon 
                      name={getTimeIcon(item.time || item.day)} 
                      size={16} 
                      color="var(--color-primary)" 
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {item.time || item.day}
                    </p>
                    <p className="text-xs text-text-secondary">
                      Rank #{index + 1}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-text-primary">
                    {formatNumber(item.clicks)} clicks
                  </p>
                  <p className="text-xs text-success">
                    {formatCurrency(item.earnings)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-text-primary">Performance Insights</h3>
          <div className="space-y-3">
            <div className="p-3 bg-success-50 rounded-lg border border-success-100">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="TrendingUp" size={16} color="var(--color-success)" />
                <span className="text-sm font-medium text-success">Best Performance</span>
              </div>
              <p className="text-xs text-text-secondary">
                {viewType === 'hours' 
                  ? 'Peak traffic during business hours (9 AM - 5 PM)'
                  : 'Highest engagement on weekdays (Monday - Friday)'
                }
              </p>
            </div>
            
            <div className="p-3 bg-warning-50 rounded-lg border border-warning-100">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Clock" size={16} color="var(--color-warning)" />
                <span className="text-sm font-medium text-warning">Optimization Tip</span>
              </div>
              <p className="text-xs text-text-secondary">
                {viewType === 'hours' 
                  ? 'Schedule content sharing during peak hours for maximum reach'
                  : 'Focus marketing efforts on weekdays for higher conversion rates'
                }
              </p>
            </div>
            
            <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Target" size={16} color="var(--color-primary)" />
                <span className="text-sm font-medium text-primary">Opportunity</span>
              </div>
              <p className="text-xs text-text-secondary">
                {viewType === 'hours' 
                  ? 'Low traffic during late night - potential for different time zones'
                  : 'Weekend traffic is lower - opportunity for leisure content'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-sm text-text-secondary">Avg. {viewType === 'hours' ? 'Hourly' : 'Daily'}</p>
          <p className="text-lg font-semibold text-text-primary">
            {formatNumber(Math.round(avgClicks))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Peak Time</p>
          <p className="text-lg font-semibold text-primary">
            {getPeakLabel()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Low Time</p>
          <p className="text-lg font-semibold text-text-secondary">
            {getLowLabel()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Efficiency</p>
          <p className="text-lg font-semibold text-accent">
            {efficiency}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimeBasedAnalytics;