import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import API_BASE_URL from 'utils/config';

const EarningsOverviewCards = () => {
  const [earnings, setEarnings] = useState({
    total: 0,
    currentMonth: 0,
    pendingWithdrawals: 0,
    availableBalance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) throw new Error('User not authenticated');
        const response = await fetch(`${API_BASE_URL}/api/user/earnings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch earnings');
        const data = await response.json();
        setEarnings({
          total: data.total || 0,
          currentMonth: data.currentMonth || 0,
          pendingWithdrawals: data.pendingWithdrawals || 0,
          availableBalance: data.availableBalance || 0
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-surface rounded-lg border border-border p-4 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error-50 border border-error-200 rounded-lg text-error">
        <Icon name="AlertCircle" size={18} color="var(--color-error)" className="inline mr-2" />
        {error}
      </div>
    );
  }

  const earningsData = [
    {
      id: 'total-balance',
      title: 'Total Balance',
      amount: earnings.total,
      icon: 'Wallet',
      iconColor: 'var(--color-primary)',
      bgColor: 'bg-primary-50',
      change: '',
      changeType: 'neutral'
    },
    {
      id: 'current-month',
      title: 'Current Month',
      amount: earnings.currentMonth,
      icon: 'Calendar',
      iconColor: 'var(--color-accent)',
      bgColor: 'bg-accent-50',
      change: '',
      changeType: 'neutral'
    },
    {
      id: 'pending-withdrawals',
      title: 'Pending Withdrawals',
      amount: earnings.pendingWithdrawals,
      icon: 'Clock',
      iconColor: 'var(--color-warning)',
      bgColor: 'bg-warning-50',
      change: '',
      changeType: 'neutral'
    },
    {
      id: 'available-balance',
      title: 'Available Balance',
      amount: earnings.availableBalance,
      icon: 'Download',
      iconColor: 'var(--color-success)',
      bgColor: 'bg-success-50',
      change: '',
      changeType: 'neutral'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {earningsData.map((item) => (
        <div key={item.id} className="bg-surface rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={item.icon} size={20} color={item.iconColor} />
            </div>
            {item.change && (
              <div className={`text-xs px-2 py-1 rounded-full bg-gray-50 text-text-secondary`}>
                {item.change}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-text-secondary">{item.title}</h3>
            <p className="text-xl font-bold text-text-primary font-data">
              {formatCurrency(item.amount)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EarningsOverviewCards;