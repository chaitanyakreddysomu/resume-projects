import React from 'react';
import Icon from '../../../components/AppIcon';

const UserAnalytics = ({ users = [] }) => {
  const calculateMetrics = () => {
    const totalUsers = users?.length || 0;
    const activeUsers = users?.filter(user => user?.status === 'active')?.length || 0;
    const suspendedUsers = users?.filter(user => user?.status === 'suspended')?.length || 0;
    const pendingUsers = users?.filter(user => user?.status === 'pending_verification')?.length || 0;
    const totalEarnings = users?.reduce((sum, user) => sum + (user?.totalEarnings || 0), 0);
    const avgEarnings = totalUsers > 0 ? totalEarnings / totalUsers : 0;
    
    // Growth calculations (mock data)
    const userGrowth = 12.5;
    const earningsGrowth = 18.3;
    const activeGrowth = 8.7;

    return {
      totalUsers,
      activeUsers,
      suspendedUsers,
      pendingUsers,
      totalEarnings,
      avgEarnings,
      userGrowth,
      earningsGrowth,
      activeGrowth
    };
  };

  const metrics = calculateMetrics();

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const metricCards = [
    {
      title: 'Total Users',
      value: metrics?.totalUsers?.toLocaleString('en-IN'),
      change: `+${metrics?.userGrowth}%`,
      changeType: 'positive',
      icon: 'Users',
      color: 'primary'
    },
    {
      title: 'Active Users',
      value: metrics?.activeUsers?.toLocaleString('en-IN'),
      change: `+${metrics?.activeGrowth}%`,
      changeType: 'positive',
      icon: 'UserCheck',
      color: 'success'
    },
    {
      title: 'Total Earnings',
      value: formatCurrency(metrics?.totalEarnings),
      change: `+${metrics?.earningsGrowth}%`,
      changeType: 'positive',
      icon: 'IndianRupee',
      color: 'warning'
    },
    {
      title: 'Average Earnings',
      value: formatCurrency(metrics?.avgEarnings),
      change: `+${metrics?.earningsGrowth}%`,
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'accent'
    }
  ];

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getCardColor = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-50 border-primary-200';
      case 'success':
        return 'bg-success-50 border-success-200';
      case 'warning':
        return 'bg-warning-50 border-warning-200';
      case 'accent':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getIconColor = (color) => {
    switch (color) {
      case 'primary':
        return 'var(--color-primary)';
      case 'success':
        return 'var(--color-success)';
      case 'warning':
        return 'var(--color-warning)';
      case 'accent':
        return '#8b5cf6';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {metricCards?.map((metric, index) => (
        <div
          key={index}
          className={`rounded-lg border p-4 lg:p-6 transition-all duration-fast hover:shadow-md ${getCardColor(metric?.color)}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              metric?.color === 'primary' ? 'bg-primary-100' :
              metric?.color === 'success' ? 'bg-success-100' :
              metric?.color === 'warning' ? 'bg-warning-100' :
              metric?.color === 'accent' ? 'bg-purple-100' : 'bg-gray-100'
            }`}>
              <Icon 
                name={metric?.icon} 
                size={20} 
                color={getIconColor(metric?.color)}
              />
            </div>
            <span className={`text-sm font-medium ${getChangeColor(metric?.changeType)}`}>
              {metric?.change}
            </span>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-1">
              {metric?.title}
            </h3>
            <p className="text-2xl font-bold text-text-primary">
              {metric?.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserAnalytics;