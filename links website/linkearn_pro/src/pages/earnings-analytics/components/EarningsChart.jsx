import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';


const EarningsChart = ({ links = [], totalEarnings = 0, totalClicks = 0 }) => {
  const [viewType, setViewType] = useState('monthly');
  const [chartType, setChartType] = useState('line');

  // Prepare monthly data (group by month, sum earnings/clicks)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyData = months.map((m, i) => {
    const monthLinks = links.filter(l => {
      const d = new Date(l.date || l.createdat || l.period || l.dateStr || l.date);
      return d.getMonth() === i;
    });
    return {
      period: m,
      earnings: monthLinks.reduce((sum, l) => sum + (l.earnings || 0), 0),
      clicks: monthLinks.reduce((sum, l) => sum + (l.clicks || 0), 0)
    };
  });

  // Prepare yearly data (group by year, sum earnings/clicks)
  const years = Array.from(new Set(links.map(l => {
    const d = new Date(l.date || l.createdat || l.period || l.dateStr || l.date);
    return d.getFullYear();
  }))).sort();
  const yearlyData = years.map((y) => {
    const yearLinks = links.filter(l => {
      const d = new Date(l.date || l.createdat || l.period || l.dateStr || l.date);
      return d.getFullYear() === y;
    });
    return {
      period: y.toString(),
      earnings: yearLinks.reduce((sum, l) => sum + (l.earnings || 0), 0),
      clicks: yearLinks.reduce((sum, l) => sum + (l.clicks || 0), 0)
    };
  });

  const currentData = viewType === 'monthly' ? monthlyData : yearlyData;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-IN').format(value);
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

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Earnings Trend</h2>
          <p className="text-sm text-text-secondary">Track your earnings performance over time</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Type Toggle */}
          <div className="flex bg-surface-secondary rounded-lg p-1">
            <button
              onClick={() => setViewType('monthly')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewType === 'monthly' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setViewType('yearly')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewType === 'yearly' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              Yearly
            </button>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex bg-surface-secondary rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'line' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="TrendingUp" size={16} />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'bar' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="BarChart3" size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="period" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="earnings" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
                connectNulls={true}
              />
            </LineChart>
          ) : (
            <BarChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="period" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="earnings" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-sm text-text-secondary">Avg. {viewType === 'monthly' ? 'Monthly' : 'Yearly'}</p>
          <p className="text-lg font-semibold text-text-primary">
            {formatCurrency(currentData.length > 0 ? currentData.reduce((sum, d) => sum + d.earnings, 0) / currentData.length : 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Best {viewType === 'monthly' ? 'Month' : 'Year'}</p>
          <p className="text-lg font-semibold text-success">
            {formatCurrency(currentData.length > 0 ? Math.max(...currentData.map(d => d.earnings)) : 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Growth Rate</p>
          <p className="text-lg font-semibold text-primary">
            {currentData.length > 1 ? ((
              (currentData[currentData.length - 1].earnings - currentData[0].earnings) /
              (currentData[0].earnings || 1)
            ) * 100).toFixed(1) + '%' : '0%'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Total Clicks</p>
          <p className="text-lg font-semibold text-text-primary">{formatNumber(totalClicks)}</p>
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;