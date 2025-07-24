import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'sky':
        return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'violet':
        return 'bg-violet-50 text-violet-700 border-violet-100';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'cyan':
        return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
    
    
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-text-secondary';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
          <Icon name={icon} size={24} />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon 
              name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
              size={16} 
            />
            <span className="text-sm font-medium">{change}</span>
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