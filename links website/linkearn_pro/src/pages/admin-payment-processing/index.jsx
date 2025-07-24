import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import AdminSidebar from '../../components/ui/AdminSidebar';
import PaymentSummaryCards from './components/PaymentSummaryCards';
import PaymentFilters from './components/PaymentFilters';
import PaymentRequestTable from './components/PaymentRequestTable';
import PaymentRequestCard from './components/PaymentRequestCard';
import PaymentDetailsModal from './components/PaymentDetailsModal';
import RejectionModal from './components/RejectionModal';
import BankHolidayAlert from './components/BankHolidayAlert';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import API_BASE_URL from 'utils/config';

const AdminPaymentProcessing = () => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [requestToReject, setRequestToReject] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState({
    pendingCount: 0,
    pendingAmount: 0,
    processedTodayCount: 0,
    processedTodayAmount: 0,
    failedCount: 0,
    failedAmount: 0,
    platformFeeCount: 0,
    platformFeeAmount: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    amountRange: 'all',
    startDate: '',
    endDate: ''
  });

  const getAuthToken = () => {
    // Try multiple possible token storage locations
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('accessToken') ||
                  sessionStorage.getItem('token') ||
                  sessionStorage.getItem('authToken') ||
                  sessionStorage.getItem('accessToken');
    
    console.log('Available tokens:', {
      localStorage: {
        token: localStorage.getItem('token'),
        authToken: localStorage.getItem('authToken'),
        accessToken: localStorage.getItem('accessToken')
      },
      sessionStorage: {
        token: sessionStorage.getItem('token'),
        authToken: sessionStorage.getItem('authToken'),
        accessToken: sessionStorage.getItem('accessToken')
      }
    });
    
    return token;
  };

  const transformWithdrawalData = (withdrawals) => {
    return withdrawals.map(withdrawal => ({
      id: withdrawal.id,
      userId: withdrawal.user?.id || withdrawal.user_id,
      userName: withdrawal.user?.name || 'Unknown User',
      userEmail: withdrawal.user?.email || 'unknown@email.com',
      userCreatedAt: withdrawal.date,
      amount: withdrawal.amount,
      upiId: withdrawal.upi,
      requestDate: withdrawal.date,
      status: withdrawal.status,
      riskLevel: calculateRiskLevel(withdrawal),
      riskFactors: calculateRiskFactors(withdrawal),
      totalEarnings: 0,
      totalWithdrawn: 0,
      availableBalance: 0,
      recentActivity: [
        { action: `Withdrawal ${withdrawal.status}`, date: withdrawal.date },
        { action: 'Withdrawal request submitted', date: withdrawal.date }
      ]
    }));
  };

  const calculateRiskLevel = (withdrawal) => {
    const amount = parseFloat(withdrawal.amount) || 0;
    if (amount > 5000) return 'high';
    if (amount > 2000) return 'medium';
    return 'low';
  };

  const calculateRiskFactors = (withdrawal) => {
    const factors = [];
    const amount = parseFloat(withdrawal.amount) || 0;
    if (amount > 5000) factors.push('High withdrawal amount');
    if (amount > 2000) factors.push('Medium withdrawal amount');
    if (withdrawal.status === 'requested') factors.push('Pending approval');
    if (withdrawal.status === 'completed') factors.push('Already processed');
    if (withdrawal.status === 'rejected') factors.push('Previously rejected');
    return factors;
  };

  const calculateSummaryData = (withdrawals) => {
    const today = new Date().toDateString();

    const pending = withdrawals.filter(w => w.status === 'requested');
    const completed = withdrawals.filter(w => w.status === 'completed');
    const failed = withdrawals.filter(w => w.status === 'failed' || w.status === 'rejected');
    const processedToday = withdrawals.filter(w =>
      w.status === 'completed' && w.processed_at && new Date(w.processed_at).toDateString() === today
    );

    return {
      pendingCount: pending.length,
      pendingAmount: pending.reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0),
      processedTodayCount: processedToday.length,
      processedTodayAmount: processedToday.reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0),
      failedCount: failed.length,
      failedAmount: failed.reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0),
      platformFeeCount: withdrawals.length,
      platformFeeAmount: withdrawals.reduce((sum, w) => sum + ((parseFloat(w.amount) || 0) * 0.05), 0)
    };
  };

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     // const token = getAuthToken();
  //     console.log('Token used:', token);

  //     // if (!token) {
  //     //   console.error('No authentication token found');
  //     //   throw new Error('Authentication token not found. Please log in again.');
  //     // }
  //     const storedUser = localStorage.getItem('user');
  //     const token = storedUser ? JSON.parse(storedUser).token : null;
  //     if (!token) throw new Error('User not authenticated');

  //     const response = await fetch('http://localhost:5000/api/admin/withdraw', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (!response.ok) {
  //       const message = await response.text();
  //       console.error('API Response:', response.status, message);
  //       throw new Error(`API error ${response.status}: ${message}`);
  //     }

  //     const withdrawalsData = await response.json();
  //     const transformed = transformWithdrawalData(withdrawalsData);
  //     const summary = calculateSummaryData(withdrawalsData);

  //     setPaymentRequests(transformed);
  //     setFilteredRequests(transformed);
  //     setSummaryData(summary);
  //   } catch (err) {
  //     console.error('Fetch error:', err);
  //     setError(err.message.includes('401') ? 'Authentication failed. Please log in again.' : err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);


  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) throw new Error('User not authenticated');

      const res = await fetch(`${API_BASE_URL}/api/admin/withdraw`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch withdrawals');
      const data = await res.json();

      const mapped = data.map(entry => ({
        id: entry.id,
        userId: entry.user?.id,
        userName: entry.user?.name || 'Unknown User',
        userEmail: entry.user?.email || 'unknown@email.com',
        userCreatedAt: entry.date,
        amount: entry.amount,
        upiId: entry.upi,
        requestDate: entry.date,
        status: entry.status,
        riskLevel: calculateRiskLevel(entry),
        riskFactors: calculateRiskFactors(entry),
        totalEarnings: 0,
        totalWithdrawn: 0,
        availableBalance: 0,
        rejectionReason: entry.rejection_reason,
        recentActivity: [
          { action: `Withdrawal ${entry.status}`, date: entry.date },
          { action: 'Withdrawal request submitted', date: entry.date }
        ]
      }));

      const summary = calculateSummaryData(data);
      setPaymentRequests(mapped);
      setFilteredRequests(mapped);
      setSummaryData(summary);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message.includes('401') ? 'Authentication failed. Please log in again.' : err.message);
      setPaymentRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  

  useEffect(() => {
    applyFilters();
  }, [filters, paymentRequests]);

  const applyFilters = () => {
    let filtered = [...paymentRequests];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(req =>
        req.userName.toLowerCase().includes(searchTerm) ||
        req.userEmail.toLowerCase().includes(searchTerm) ||
        req.upiId.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(req => req.status === filters.status);
    }

    if (filters.amountRange !== 'all') {
      filtered = filtered.filter(req => {
        const amount = parseFloat(req.amount) || 0;
        switch (filters.amountRange) {
          case '0-500': return amount >= 0 && amount <= 500;
          case '500-1000': return amount > 500 && amount <= 1000;
          case '1000-5000': return amount > 1000 && amount <= 5000;
          case '5000+': return amount > 5000;
          default: return true;
        }
      });
    }

    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter(req => {
        const date = new Date(req.requestDate);
        const start = filters.startDate ? new Date(filters.startDate) : null;
        const end = filters.endDate ? new Date(filters.endDate) : null;
        return (!start || date >= start) && (!end || date <= end);
      });
    }

    setFilteredRequests(filtered);
  };

  const handleFilterChange = newFilters => setFilters(newFilters);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      amountRange: 'all',
      startDate: '',
      endDate: ''
    });
  };

  const handleApprove = async (requestId) => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${API_BASE_URL}/api/admin/withdraw/${requestId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to approve withdrawal');
      
      // Refresh data after successful action
      await fetchData();
      setSelectedRequests(prev => prev.filter(id => id !== requestId));
    } catch (err) {
      console.error('Error approving withdrawal:', err);
      setError(err.message);
    }
  };

  const handleReject = async (requestId, reason) => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${API_BASE_URL}/api/admin/withdraw/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) throw new Error('Failed to reject withdrawal');
      
      // Refresh data after successful action
      await fetchData();
      setSelectedRequests(prev => prev.filter(id => id !== requestId));
    } catch (err) {
      console.error('Error rejecting withdrawal:', err);
      setError(err.message);
      throw err; // Re-throw so the modal can handle it
    }
  };

  const handleBulkAction = async (action, requestIds) => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) throw new Error('User not authenticated');

      // Process each request
      const promises = requestIds.map(requestId => {
        if (action === 'approve') {
          return fetch(`${API_BASE_URL}/api/admin/withdraw/${requestId}/complete`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } else {
          // For bulk reject, use a default reason
            return fetch(`${API_BASE_URL}/api/admin/withdraw/${requestId}/reject`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason: 'Bulk rejected by admin' })
          });
        }
      });

      await Promise.all(promises);
      
      // Refresh data after successful action
      await fetchData();
      setSelectedRequests([]);
    } catch (err) {
      console.error('Error performing bulk action:', err);
      setError(err.message);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleRejectClick = (request) => {
    setRequestToReject(request);
    setIsRejectionModalOpen(true);
  };

  const handleSelectRequest = (requestId) => {
    setSelectedRequests(prev =>
      prev.includes(requestId) ? prev.filter(id => id !== requestId) : [...prev, requestId]
    );
  };

  const handleSelectAll = (requestIds) => {
    setSelectedRequests(requestIds);
  };

  // --- Export Data Functionality ---
  const handleExportData = () => {
    // Export filteredRequests as CSV
    if (!filteredRequests.length) {
      alert('No data to export.');
      return;
    }

    // Define the columns to export and their headers
    const columns = [
      { key: 'id', label: 'Request ID' },
      { key: 'userId', label: 'User ID' },
      { key: 'userName', label: 'User Name' },
      { key: 'userEmail', label: 'User Email' },
      { key: 'amount', label: 'Amount' },
      { key: 'upiId', label: 'UPI ID' },
      { key: 'requestDate', label: 'Request Date' },
      { key: 'status', label: 'Status' },
      { key: 'riskLevel', label: 'Risk Level' },
      { key: 'rejectionReason', label: 'Rejection Reason' }
    ];

    // Create CSV header
    const header = columns.map(col => `"${col.label}"`).join(',');

    // Create CSV rows
    const rows = filteredRequests.map(req =>
      columns.map(col => {
        let value = req[col.key];
        if (value === undefined || value === null) value = '';
        // Escape quotes
        if (typeof value === 'string') value = value.replace(/"/g, '""');
        return `"${value}"`;
      }).join(',')
    );

    const csvContent = [header, ...rows].join('\r\n');

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and click it
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payment_requests_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <AdminSidebar />

      <main className="lg:ml-64 pt-16">
        <div className="p-4 lg:p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">Payment Processing</h1>
              <p className="text-text-secondary mt-1">Manage withdrawal requests and UPI transactions</p>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" iconName="RotateCcw" onClick={fetchData} disabled={loading}>Refresh</Button>
              <div className="flex items-center bg-surface-secondary rounded-lg p-1">
                <Button variant={viewMode === 'table' ? 'primary' : 'ghost'} size="sm" iconName="Table" onClick={() => setViewMode('table')}>Table</Button>
                <Button variant={viewMode === 'cards' ? 'primary' : 'ghost'} size="sm" iconName="Grid3X3" onClick={() => setViewMode('cards')}>Cards</Button>
              </div>
              <Button
                variant="primary"
                iconName="Download"
                iconPosition="left"
                onClick={handleExportData}
                disabled={loading || filteredRequests.length === 0}
              >
                Export Data
              </Button>
            </div>
          </div>

          <BankHolidayAlert />

          {error && (
            <div className="bg-error-50 border border-error rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={20} color="var(--color-error)" />
                <span className="text-error font-medium">Error: {error}</span>
              </div>
              <Button variant="primary" size="sm" onClick={fetchData} className="mt-2">Retry</Button>
            </div>
          )}

          {loading ? (
            <div className="space-y-6">Loading payment requests...</div>
          ) : (
            <>
              <PaymentSummaryCards summaryData={summaryData} />
              <PaymentFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
                              {viewMode === 'table' ? (
                  <PaymentRequestTable
                    requests={filteredRequests}
                    onApprove={handleApprove}
                    onReject={handleRejectClick}
                    onViewDetails={handleViewDetails}
                    onBulkAction={handleBulkAction}
                    selectedRequests={selectedRequests}
                    onSelectRequest={handleSelectRequest}
                    onSelectAll={handleSelectAll}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRequests.map((request) => (
                      <PaymentRequestCard
                        key={request.id}
                        request={request}
                        onApprove={handleApprove}
                        onReject={handleRejectClick}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}

              {filteredRequests.length === 0 && !loading && (
                <div className="bg-surface rounded-lg border border-border p-8 text-center">
                  <Icon name="FileX" size={48} className="mx-auto text-text-secondary mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No Payment Requests Found</h3>
                  <p className="text-text-secondary mb-4">No payment requests match your current filters.</p>
                  <Button variant="primary" iconName="RotateCcw" onClick={handleClearFilters}>Clear Filters</Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

                      <PaymentDetailsModal
          request={selectedRequest}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApprove={handleApprove}
          onReject={handleRejectClick}
        />

        {/* Rejection Modal */}
        <RejectionModal
          isOpen={isRejectionModalOpen}
          onClose={() => {
            setIsRejectionModalOpen(false);
            setRequestToReject(null);
          }}
          onReject={handleReject}
          request={requestToReject}
        />
      </div>
    );
  };

export default AdminPaymentProcessing;
