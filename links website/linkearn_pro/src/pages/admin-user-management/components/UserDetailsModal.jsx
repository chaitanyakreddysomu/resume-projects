import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserDetailsModal = ({ user, isOpen, onClose, onUserAction }) => {
  if (!isOpen || !user) return null;

  const [actionLoading, setActionLoading] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getReferrerName = (referrerId) => {
    if (!referrerId) return null;
    const referrer = users.find(user => user.id === referrerId);
    return referrer?.name || referrerId;
  };
  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  // Helper to ensure minus sign for amount
  const formatNegativeCurrency = (amount) => {
    const abs = Math.abs(amount);
    return `-₹${abs.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success-50';
      case 'suspended':
        return 'text-error bg-error-50';
      case 'pending_verification':
        return 'text-warning bg-warning-50';
      default:
        return 'text-text-secondary bg-gray-50';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'suspended':
        return 'Suspended';
      case 'pending_verification':
        return 'Pending';
      default:
        return status;
    }
  };

  // Mock additional data
  const recentActivity = [
    { action: 'Link Created', details: 'Created new shortened link', time: '2024-01-20T10:30:00Z' },
    { action: 'Earnings', details: 'Earned ₹25.50 from clicks', time: '2024-01-20T09:15:00Z' },
    { action: 'Login', details: 'Logged in from Mumbai, India', time: '2024-01-20T08:45:00Z' },
    { action: 'Profile Updated', details: 'Updated payment information', time: '2024-01-19T16:20:00Z' }
  ];

  const financialHistory = [
    { type: 'Withdrawal', amount: -500.00, status: 'completed', date: '2024-01-18' },
    { type: 'Earnings', amount: 125.50, status: 'completed', date: '2024-01-20' },
    { type: 'Earnings', amount: 89.25, status: 'completed', date: '2024-01-19' },
    { type: 'Withdrawal', amount: -300.00, status: 'pending', date: '2024-01-20' }
  ];

  // Determine the status to display (optimistic if set)
  const displayStatus = optimisticStatus || user.status;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
      <div className="bg-surface rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="User" size={24} color="var(--color-primary)" />
            </div>
            <div>
  <div className="flex items-center gap-2">
    <h2 className="text-xl font-bold text-text-primary">{user?.name}</h2>
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(displayStatus)}`}
    >
      {getStatusLabel(displayStatus)}
    </span>
  </div>
  <p className="text-text-secondary">{user?.email}</p>
</div>

          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconSize={20}
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - User Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-text-primary mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-text-secondary">User ID</label>
                    <p className="font-medium text-text-primary">{user?.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary">Phone Number</label>
                    <p className="font-medium text-text-primary">{user?.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary">Registration Date</label>
                    <p className="font-medium text-text-primary">{formatDate(user?.registrationDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary">Account Type</label>
                    <p className="font-medium text-text-primary capitalize">{user?.accountType}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary">Verification Status</label>
                    <p className="font-medium text-text-primary capitalize">{user?.verificationStatus}</p>
                  </div>
                  {/* <div>
                    
                    <label className="text-sm text-text-secondary">Referred By</label>
                    <p className="font-medium text-text-primary">
                    {user?.referredBy ? (
                    <span className="text-primary font-medium">{getReferrerName(user?.referredBy)}</span>
                  ) : (
                    <span className="text-text-secondary">No</span>
                  )}
                    </p>
                  </div> */}
                  <div>
                    <label className="text-sm text-text-secondary">Referred Users</label>
                    <p className="font-medium text-text-primary">
                      {user?.referredUsers && user.referredUsers.length > 0 ? (
                        <div>
                          <span className="text-primary">{user.referredUsers.length} users</span>
                          <div className="text-sm text-text-secondary mt-1">
                            {user.referredUsers.map((refUser, index) => (
                              <div key={refUser.id || index} className="text-xs">
                                <span className="font-semibold text-text-primary">
                                  {refUser.name}
                                </span>
                                {refUser.email && (
                                  <span className="text-text-secondary ml-1">
                                    ({refUser.email})
                                  </span>
                                )}
                                {/* <div className="text-text-secondary">
                                  ID: {refUser.id}
                                </div> */}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-text-secondary">None</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-text-primary mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {displayStatus === 'active' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName={actionLoading ? undefined : "Ban"}
                      iconSize={16}
                      disabled={actionLoading}
                      onClick={async () => {
                        setActionLoading(true);
                        setOptimisticStatus('suspended');
                        await onUserAction?.('suspend', user?.id);
                        setActionLoading(false);
                      }}
                      className="w-full text-error border-error hover:bg-red-600 hover:text-white"
                    >
                      {actionLoading ? (
                        <span className="flex items-center justify-center">
                          <span className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin mr-2"></span>
                          Suspending...
                        </span>
                      ) : (
                        'Suspend Account'
                      )}
                    </Button>
                  ) : (
                    <Button
                    variant="outline"
                    size="sm"
                    iconName={actionLoading ? undefined : "CheckCircle"}
                    iconSize={16}
                    disabled={actionLoading}
                    onClick={async () => {
                      setActionLoading(true);
                      setOptimisticStatus('active');
                      await onUserAction?.('activate', user?.id);
                      setActionLoading(false);
                    }}
                    className="w-full text-success border-success hover:bg-green-600 hover:!text-white"
                  >
                    {actionLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="w-4 h-4 border-2 border-success border-t-transparent rounded-full animate-spin mr-2"></span>
                        Activating...
                      </span>
                    ) : (
                      'Activate Account'
                    )}
                  </Button>
                  
                  )}
                  
                  {user?.verificationStatus === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Shield"
                      iconSize={16}
                      onClick={() => onUserAction?.('verify', user?.id)}
                      className="w-full text-primary border-primary hover:bg-primary-50"
                    >
                      Verify Account
                    </Button>
                  )}

                  {/* <Button
                    variant="outline"
                    size="sm"
                    iconName="Mail"
                    iconSize={16}
                    className="w-full"
                  >
                    Send Message
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    iconName="FileText"
                    iconSize={16}
                    className="w-full"
                  >
                    View Reports
                  </Button> */}
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="IndianRupee" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-primary">Total Earnings</span>
                  </div>
                  <p className="text-xl font-bold text-text-primary">{formatCurrency(user?.totalEarnings)}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
  <div className="flex items-center space-x-2 mb-2">
    <Icon name="Calendar" size={16} className="text-indigo-600" />
    <span className="text-sm font-medium text-indigo-600">Next withdraw</span>
  </div>
  <p className="text-xl font-bold text-text-primary">{formatCurrency(user?.availableForWithdraw || 0)}</p>
</div>

                <div className="bg-success-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Link" size={16} className="text-success" />
                    <span className="text-sm font-medium text-success">Total Links</span>
                  </div>
                  <p className="text-xl font-bold text-text-primary">{user?.totalLinks}</p>
                </div>
                <div className="bg-warning-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="MousePointer" size={16} className="text-warning" />
                    <span className="text-sm font-medium text-warning">Total Clicks</span>
                  </div>
                  <p className="text-xl font-bold text-text-primary">{user?.totalClicks}</p>
                </div>
              </div>

              {/* Financial History (Withdrawal History) */}
              <div className="bg-surface border border-border rounded-lg p-4">
                <h3 className="font-medium text-text-primary mb-4">Financial History</h3>
                {user?.withdrawHistory && user.withdrawHistory.length > 0 ? (
                  <div className="space-y-3">
                    {user.withdrawHistory.map((w, idx) => (
                      <div key={w.id || idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        {/* Left: Icon + WITHDRAWAL + date/time */}
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-error-100">
                            <Icon name="ArrowUpRight" size={24} color="var(--color-error)" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-black tracking-wide">WITHDRAWAL</div>
                            <div className="text-xs text-text-secondary mt-1">{formatDate(w.date)}</div>
                          </div>
                        </div>
                        {/* Right: Amount + status */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-error">{formatNegativeCurrency(w.amount)}</div>
                          <div className={`text-xs mt-1 font-medium capitalize flex items-center justify-end gap-1 ${w.status === 'completed' ? 'text-success' : w.status === 'pending' ? 'text-warning' : 'text-error'}`}>
                            {w.status === 'completed' && (
                              <Icon name="CheckCircle" size={14} className="inline-block mr-1 text-success" />
                            )}
                            {w.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-text-secondary">No withdrawal history found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;