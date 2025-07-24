import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary border-primary-100',
    success: 'bg-success-50 text-success border-success-100',
    warning: 'bg-warning-50 text-warning border-warning-100',
    accent: 'bg-accent-50 text-accent border-accent-100'
  };

  const iconColorMap = {
    primary: 'var(--color-primary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    accent: 'var(--color-accent)'
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4 hover:shadow-md transition-shadow duration-fast">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon name={icon} size={20} color={iconColorMap[color]} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-success' : 'text-error'}`}>
            <Icon name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={14} />
            <span className="text-xs font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-text-primary font-data">{value}</h3>
        <p className="text-sm text-text-secondary">{title}</p>
      </div>
    </div>
  );
};

export default MetricsCard;