import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import API_BASE_URL from 'utils/config';

const TransactionHistory = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc'); // Add sort direction
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ total: 0, totalWithdrawn: 0, pendingWithdrawals: 0 });

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) throw new Error('User not authenticated');
        // Fetch withdrawals
        const response = await fetch(`${API_BASE_URL}/api/withdrawal/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        const mapped = data.map((item) => ({
          id: item.id,
          type: 'withdrawal',
          amount: item.amount,
          status: item.status,
          date: item.date || '', // Keep original date for sorting
          time: item.date ? (item.date.split('T')[1] ? item.date.split('T')[1].slice(0,5) : '') : '',
          upiId: item.upi,
          utrNumber: item.utr_number || null,
          // description: item.description || '',
          processingTime: item.processing_time || null
        }));
        setTransactions(mapped);
        // Fetch summary
        const summaryRes = await fetch(`${API_BASE_URL}/api/user/earnings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          setSummary({
            total: summaryData.total || 0,
            totalWithdrawn: summaryData.totalWithdrawn || 0,
            pendingWithdrawals: summaryData.pendingWithdrawals || 0
          });
        }
      } catch (err) {
        setError(err.message);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'completed') return transaction.status === 'completed';
    if (filter === 'rejected') return transaction.status === 'rejected';
    return false;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        // Use the original date string for better sorting
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        comparison = dateA - dateB;
        break;
      case 'amount':
        // Handle null/undefined amounts
        const amountA = parseFloat(a.amount) || 0;
        const amountB = parseFloat(b.amount) || 0;
        comparison = amountA - amountB;
        break;
      case 'status':
        // Case-insensitive status comparison
        const statusA = (a.status || '').toLowerCase();
        const statusB = (b.status || '').toLowerCase();
        comparison = statusA.localeCompare(statusB);
        break;
      default:
        // Default to date sorting
        const defaultDateA = new Date(a.date || 0);
        const defaultDateB = new Date(b.date || 0);
        comparison = defaultDateA - defaultDateB;
    }
    
    // Apply sort direction
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  // Debug logging for sorting and filtering
  console.log('Transaction Debug:', {
    filter,
    sortBy,
    sortDirection,
    totalTransactions: transactions.length,
    filteredCount: filteredTransactions.length,
    sortedCount: sortedTransactions.length,
    statusCounts: {
      all: transactions.length,
      completed: transactions.filter(t => t.status === 'completed').length,
      rejected: transactions.filter(t => t.status === 'rejected').length,
      pending: transactions.filter(t => t.status === 'pending').length,
      failed: transactions.filter(t => t.status === 'failed').length
    },
    sampleData: sortedTransactions.slice(0, 2).map(t => ({
      id: t.id,
      date: t.date,
      amount: t.amount,
      status: t.status
    }))
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper to convert UTC date+time to IST and return formatted time string
  const getISTTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60; // in minutes
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (istOffset * 60000));
    return istTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success-50 text-success border-success-100';
      case 'pending':
        return 'bg-warning-50 text-warning border-warning-100';
      case 'rejected':
        return 'bg-error-50 text-error border-error-100';
      case 'failed':
        return 'bg-error-50 text-error border-error-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'rejected':
        return 'XCircle';
      case 'failed':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'withdrawal':
        return 'ArrowUpRight';
      case 'earnings':
        return 'ArrowDownLeft';
      default:
        return 'Circle';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'withdrawal':
        return 'text-error';
      case 'earnings':
        return 'text-success';
      default:
        return 'text-text-secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading transactions...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon name="AlertTriangle" size={32} color="var(--color-error)" className="mx-auto mb-4" />
          <p className="text-error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Transaction History</h2>
          <p className="text-sm text-text-secondary">Your payment and earnings history</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 bg-surface border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 bg-surface border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
            </select>
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-1 bg-surface border border-border rounded-md hover:bg-surface-secondary transition-colors"
              title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <Icon 
                name={sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
                size={16} 
                className="text-text-secondary"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden space-y-4">
        {sortedTransactions.map((transaction) => (
          <div key={transaction.id} className="bg-surface-secondary rounded-lg p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  transaction.type === 'withdrawal' ? 'bg-error-50' : 'bg-success-50'
                }`}>
                  <Icon 
                    name={getTypeIcon(transaction.type)} 
                    size={20} 
                    className={getTypeColor(transaction.type)}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary capitalize">
                    {transaction.type}
                  </p>
                  <p className="text-xs text-text-secondary">{transaction.id}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-lg font-bold ${getTypeColor(transaction.type)}`}>
                  {transaction.type === 'withdrawal' ? '-' : '+'}{formatCurrency(transaction.amount)}
                </p>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(transaction.status)}`}>
                  <Icon name={getStatusIcon(transaction.status)} size={12} />
                  <span className="capitalize">{transaction.status}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{formatDate(transaction.date)} at {getISTTime(transaction.date)}</span>
              </div>
              {transaction.upiId && (
                <div className="flex justify-between">
                  <span>UPI ID:</span>
                  <span className="font-data">{transaction.upiId}</span>
                </div>
              )}
              {transaction.utrNumber && (
                <div className="flex justify-between">
                  <span>UTR:</span>
                  <span className="font-data">{transaction.utrNumber}</span>
                </div>
              )}
              {transaction.processingTime && (
                <div className="flex justify-between">
                  <span>Processing:</span>
                  <span>{transaction.processingTime}</span>
                </div>
              )}
            </div>
            
            {/* <p className="text-xs text-text-secondary mt-2 italic">
              {transaction.description}
            </p> */}
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Date & Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">UPI/UTR</th>
                {/* <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Description</th> */}
                {/* <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-border hover:bg-surface-secondary transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        transaction.type === 'withdrawal' ? 'bg-error-50' : 'bg-success-50'
                      }`}>
                        <Icon 
                          name={getTypeIcon(transaction.type)} 
                          size={16} 
                          className={getTypeColor(transaction.type)}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary capitalize">
                          {transaction.type}
                        </p>
                        <p className="text-xs text-text-secondary font-data">{transaction.id}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <p className={`text-sm font-semibold ${getTypeColor(transaction.type)}`}>
                      {transaction.type === 'withdrawal' ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </p>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(transaction.status)}`}>
                      <Icon name={getStatusIcon(transaction.status)} size={12} />
                      <span className="capitalize">{transaction.status}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-text-primary">{formatDate(transaction.date)}</p>
                      <p className="text-xs text-text-secondary">{getISTTime(transaction.date)}</p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      {transaction.upiId && (
                        <p className="text-xs text-text-secondary font-data">{transaction.upiId}</p>
                      )}
                      {transaction.utrNumber && (
                        <p className="text-xs text-primary font-data">{transaction.utrNumber}</p>
                      )}
                      {!transaction.upiId && !transaction.utrNumber && (
                        <p className="text-xs text-text-muted">-</p>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    {/* <p className="text-sm text-text-secondary max-w-xs truncate">
                      {transaction.description}
                    </p> */}
                    {transaction.processingTime && (
                      <p className="text-xs text-text-muted">
                        Processed in {transaction.processingTime}
                      </p>
                    )}
                  </td>
                  
                  {/* <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="xs" iconName="Eye" iconSize={14} />
                      {transaction.utrNumber && (
                        <Button variant="ghost" size="xs" iconName="Copy" iconSize={14} />
                      )}
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedTransactions.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Receipt" size={48} color="var(--color-text-secondary)" className="mx-auto mb-4" />
          <p className="text-text-secondary">No transactions found for the selected filter</p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-sm text-text-secondary">Total Withdrawn</p>
          <p className="text-lg font-semibold text-error">
            {formatCurrency(summary.totalWithdrawn)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Total Earned</p>
          <p className="text-lg font-semibold text-success">
            {formatCurrency(summary.total)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Pending</p>
          <p className="text-lg font-semibold text-warning">
            {formatCurrency(summary.pendingWithdrawals)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Success Rate</p>
          <p className="text-lg font-semibold text-primary">
            {transactions.length > 0 ? Math.round((transactions.filter(t => t.status === 'completed').length / transactions.length) * 100) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;