import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentSummaryCards = ({ summaryData }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 4
    }).format(amount);
  };

  const cards = [
    {
      title: 'Pending Requests',
      value: summaryData.pendingCount,
      amount: summaryData.pendingAmount,
      icon: 'Clock',
      color: 'warning',
      bgColor: 'bg-warning-50',
      iconColor: 'var(--color-warning)'
    },
    {
      title: 'Processed Today',
      value: summaryData.processedTodayCount,
      amount: summaryData.processedTodayAmount,
      icon: 'CheckCircle',
      color: 'success',
      bgColor: 'bg-success-50',
      iconColor: 'var(--color-success)'
    },
    {
      title: 'Failed Transactions',
      value: summaryData.failedCount,
      amount: summaryData.failedAmount,
      icon: 'XCircle',
      color: 'error',
      bgColor: 'bg-error-50',
      iconColor: 'var(--color-error)'
    },
    {
      title: 'Platform Fees',
      value: summaryData.platformFeeCount,
      amount: summaryData.platformFeeAmount,
      icon: 'TrendingUp',
      color: 'primary',
      bgColor: 'bg-primary-50',
      iconColor: 'var(--color-primary)'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-surface rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 ${card.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={card.icon} size={20} color={card.iconColor} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-text-primary">{card.value}</div>
              <div className="text-xs text-text-secondary">requests</div>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-text-primary">{card.title}</h3>
            <div className="text-lg font-semibold text-text-primary">
              {formatAmount(card.amount)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentSummaryCards;