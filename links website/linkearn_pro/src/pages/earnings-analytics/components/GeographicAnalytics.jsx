import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const GeographicAnalytics = () => {
  const [viewType, setViewType] = useState('states');

  const statesData = [
    { name: 'Maharashtra', clicks: 8450, earnings: 422.50, percentage: 28.5 },
    { name: 'Karnataka', clicks: 6200, earnings: 310.00, percentage: 20.9 },
    { name: 'Delhi', clicks: 4800, earnings: 240.00, percentage: 16.2 },
    { name: 'Tamil Nadu', clicks: 3900, earnings: 195.00, percentage: 13.2 },
    { name: 'Gujarat', clicks: 2850, earnings: 142.50, percentage: 9.6 },
    { name: 'West Bengal', clicks: 2100, earnings: 105.00, percentage: 7.1 },
    { name: 'Others', clicks: 1300, earnings: 65.00, percentage: 4.4 }
  ];

  const citiesData = [
    { name: 'Mumbai', clicks: 4200, earnings: 210.00, percentage: 14.2 },
    { name: 'Bangalore', clicks: 3800, earnings: 190.00, percentage: 12.8 },
    { name: 'Delhi', clicks: 3500, earnings: 175.00, percentage: 11.8 },
    { name: 'Pune', clicks: 2900, earnings: 145.00, percentage: 9.8 },
    { name: 'Chennai', clicks: 2600, earnings: 130.00, percentage: 8.8 },
    { name: 'Hyderabad', clicks: 2400, earnings: 120.00, percentage: 8.1 },
    { name: 'Kolkata', clicks: 1850, earnings: 92.50, percentage: 6.2 },
    { name: 'Ahmedabad', clicks: 1650, earnings: 82.50, percentage: 5.6 },
    { name: 'Others', clicks: 6700, earnings: 335.00, percentage: 22.6 }
  ];

  const currentData = viewType === 'states' ? statesData : citiesData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getBarWidth = (percentage) => {
    return Math.max(percentage, 2); // Minimum 2% for visibility
  };

  const getLocationIcon = (index) => {
    if (index === 0) return 'Crown';
    if (index === 1) return 'Medal';
    if (index === 2) return 'Award';
    return 'MapPin';
  };

  const getLocationColor = (index) => {
    if (index === 0) return 'text-yellow-500';
    if (index === 1) return 'text-gray-400';
    if (index === 2) return 'text-orange-500';
    return 'text-text-secondary';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Geographic Analytics</h2>
          <p className="text-sm text-text-secondary">Click distribution across India</p>
        </div>
        
        <div className="flex bg-surface-secondary rounded-lg p-1">
          <button
            onClick={() => setViewType('states')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              viewType === 'states' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            States
          </button>
          <button
            onClick={() => setViewType('cities')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              viewType === 'cities' ?'bg-surface text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            Cities
          </button>
        </div>
      </div>

      {/* Mobile View - Simplified List */}
      <div className="block lg:hidden space-y-3">
        {currentData.slice(0, 5).map((location, index) => (
          <div key={location.name} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name={getLocationIcon(index)} 
                size={16} 
                className={getLocationColor(index)}
              />
              <div>
                <p className="text-sm font-medium text-text-primary">{location.name}</p>
                <p className="text-xs text-text-secondary">{formatNumber(location.clicks)} clicks</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-success">{formatCurrency(location.earnings)}</p>
              <p className="text-xs text-text-secondary">{location.percentage}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Detailed Chart */}
      <div className="hidden lg:block">
        <div className="space-y-4">
          {currentData.map((location, index) => (
            <div key={location.name} className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 w-32">
                <Icon 
                  name={getLocationIcon(index)} 
                  size={16} 
                  className={getLocationColor(index)}
                />
                <span className="text-sm font-medium text-text-primary truncate">
                  {location.name}
                </span>
              </div>
              
              <div className="flex-1 flex items-center space-x-3">
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${getBarWidth(location.percentage)}%` }}
                  />
                </div>
                <span className="text-xs text-text-secondary w-12 text-right">
                  {location.percentage}%
                </span>
              </div>
              
              <div className="flex items-center space-x-6 w-48">
                <div className="text-right">
                  <p className="text-sm font-medium text-text-primary">{formatNumber(location.clicks)}</p>
                  <p className="text-xs text-text-secondary">clicks</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-success">{formatCurrency(location.earnings)}</p>
                  <p className="text-xs text-text-secondary">earnings</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-sm text-text-secondary">Top Location</p>
          <p className="text-lg font-semibold text-text-primary">{currentData[0]?.name}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Coverage</p>
          <p className="text-lg font-semibold text-primary">{currentData.length - 1}+ {viewType}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Avg. Earnings</p>
          <p className="text-lg font-semibold text-accent">
            {formatCurrency(currentData.reduce((sum, item) => sum + item.earnings, 0) / currentData.length)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Total Clicks</p>
          <p className="text-lg font-semibold text-text-primary">
            {formatNumber(currentData.reduce((sum, item) => sum + item.clicks, 0))}
          </p>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mt-6 p-4 bg-surface-secondary rounded-lg border-2 border-dashed border-border">
        <div className="text-center">
          <Icon name="Map" size={48} color="var(--color-text-secondary)" className="mx-auto mb-2" />
          <p className="text-sm text-text-secondary">Interactive map visualization</p>
          <p className="text-xs text-text-muted">Coming soon - Visual representation of click distribution</p>
        </div>
      </div>
    </div>
  );
};

export default GeographicAnalytics;