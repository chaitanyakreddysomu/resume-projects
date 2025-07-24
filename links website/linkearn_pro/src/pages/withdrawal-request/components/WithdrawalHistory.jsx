import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import API_BASE_URL from 'utils/config';

const WithdrawalHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch withdrawal history from API
  useEffect(() => {
    const fetchWithdrawalHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        
        if (!token) {
          throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}/api/withdrawal/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch withdrawal history');
        }

        const data = await response.json();
        console.log('Withdrawal history:', data);
        setWithdrawalHistory(data);
      } catch (err) {
        console.error('Error fetching withdrawal history:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawalHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'requested': return 'text-accent';
      case 'rejected': return 'text-error';
      case 'failed': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'requested': return 'Clock';
      case 'rejected': return 'XCircle';
      case 'failed': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success-50';
      case 'requested': return 'bg-accent-50';
      case 'rejected': return 'bg-error-50';
      case 'failed': return 'bg-error-50';
      default: return 'bg-gray-50';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'requested': return 'Pending';
      case 'rejected': return 'Rejected';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  const filteredHistory = withdrawalHistory.filter(item => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'pending') return item.status === 'requested';
    return item.status === selectedFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 4
    }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading withdrawal history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="AlertCircle" size={32} color="var(--color-error)" />
        </div>
        <h3 className="text-lg font-medium text-text-primary mb-2">
          Failed to load withdrawal history
        </h3>
        <p className="text-error mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Requests' },
          { key: 'pending', label: 'Pending' },
          { key: 'completed', label: 'Completed' },
          { key: 'rejected', label: 'Rejected' }
        ].map(filter => (
          <Button
            key={filter.key}
            variant={selectedFilter === filter.key ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(filter.key)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="FileText" size={32} color="var(--color-text-secondary)" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No withdrawal requests found
            </h3>
            <p className="text-text-secondary">
              {selectedFilter === 'all' ? 'You haven\'t made any withdrawal requests yet.'
                : `No ${selectedFilter} withdrawal requests found.`
              }
            </p>
          </div>
        ) : (
          filteredHistory.map(request => (
            <div key={request.id} className="bg-surface border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusBgColor(request.status)}`}>
                    <Icon 
                      name={getStatusIcon(request.status)} 
                      size={20} 
                      color={`var(--color-${request.status === 'completed' ? 'success' : request.status === 'requested' ? 'accent' : 'error'})`} 
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">
                      Request #{request.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {formatDate(request.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(request.status)} ${getStatusColor(request.status)}`}>
                    {getStatusLabel(request.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-text-secondary">Requested Amount:</span>
                    <span className="text-text-primary font-medium">
                      {formatAmount(request.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-text-secondary">UPI ID:</span>
                    <span className="text-text-primary font-mono">
                      {request.upi || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Request Date:</span>
                    <span className="text-text-primary">
                      {formatDate(request.date)}
                    </span>
                  </div>
                </div>

                <div>
                  {request.status === 'completed' && request.processed_at && (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-text-secondary">Processed Date:</span>
                        <span className="text-text-primary">
                          {formatDate(request.processed_at)}
                        </span>
                      </div>
                      {request.processed_by && (
                        <div className="flex justify-between mb-2">
                          <span className="text-text-secondary">Processed By:</span>
                          <span className="text-text-primary">
                            Admin #{request.processed_by.slice(-8).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {request.status === 'rejected' && request.rejection_reason && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Rejection Reason:</span>
                      <span className="text-error text-xs max-w-32 text-right">
                        {request.rejection_reason}
                      </span>
                    </div>
                  )}

                  {request.status === 'requested' && (
                    <div className="text-accent text-xs">
                      <Icon name="Clock" size={14} className="inline mr-1" />
                      Waiting for admin approval
                    </div>
                  )}

                  {request.status === 'completed' && (
                    <div className="text-success text-xs">
                      <Icon name="CheckCircle" size={14} className="inline mr-1" />
                      Successfully processed
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              {/* <div className="mt-3 pt-3 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-text-secondary">Withdrawal ID:</span>
                    <span className="text-text-primary font-mono ml-2">
                      {request.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-secondary">Status:</span>
                    <span className={`ml-2 font-medium ${getStatusColor(request.status)}`}>
                      {getStatusLabel(request.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-secondary">Processing Time:</span>
                    <span className="text-text-primary ml-2">
                      {request.processed_at && request.date 
                        ? `${Math.round((new Date(request.processed_at) - new Date(request.date)) / (1000 * 60 * 60))} hours`
                        : 'Pending'
                      }
                    </span>
                  </div>
                </div>
              </div> */}

              {/* Action Buttons */}
              {/* {(request.status === 'rejected' || request.status === 'completed') && (
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="flex space-x-2">
                    {request.status === 'rejected' && (
                      <Button variant="outline" size="sm" iconName="RotateCcw">
                        Retry Request
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" iconName="Download">
                      Download Receipt
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Share">
                      Share Details
                    </Button>
                  </div>
                </div>
              )} */}
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {withdrawalHistory.length > 0 && (
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="font-medium text-text-primary mb-3">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-text-primary">
                {withdrawalHistory.filter(r => r.status === 'completed').length}
              </div>
              <div className="text-text-secondary">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-accent">
                {withdrawalHistory.filter(r => r.status === 'requested').length}
              </div>
              <div className="text-text-secondary">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-success">
                {formatAmount(withdrawalHistory
                  .filter(r => r.status === 'completed')
                  .reduce((sum, r) => sum + (r.amount || 0), 0))}
              </div>
              <div className="text-text-secondary">Total Withdrawn</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-error">
                {withdrawalHistory.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-text-secondary">Rejected</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalHistory;