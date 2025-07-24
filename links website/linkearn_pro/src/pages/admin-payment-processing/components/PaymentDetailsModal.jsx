import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentDetailsModal = ({ request, isOpen, onClose, onApprove, onReject }) => {
  if (!isOpen || !request) return null;

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 4
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-warning bg-warning-50 border-warning';
      case 'approved': return 'text-success bg-success-50 border-success';
      case 'processing': return 'text-primary bg-primary-50 border-primary';
      case 'completed': return 'text-success bg-success-50 border-success';
      case 'failed': return 'text-error bg-error-50 border-error';
      case 'rejected': return 'text-error bg-error-50 border-error';
      default: return 'text-text-secondary bg-surface-secondary border-border';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
      <div className="bg-surface rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Payment Request Details</h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary">User Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Name</label>
                <div className="text-text-primary">{request.userName}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Email</label>
                <div className="text-text-primary">{request.userEmail}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">User ID</label>
                <div className="text-text-primary font-data">{request.userId}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Account Created</label>
                <div className="text-text-primary">{formatDate(request.userCreatedAt)}</div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Request Amount</label>
                <div className="text-2xl font-bold text-text-primary">
                  {Number(request.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">UPI ID</label>
                <div className="text-text-primary font-data">{request.upiId}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Request Date</label>
                <div className="text-text-primary">{formatDate(request.requestDate)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary flex">Status</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
              {/* Show rejection reason if present */}
              {(request.status === 'rejected' || request.status === 'failed') && (request.rejection_reason || request.rejectionReason) && (
                
                <div className="space-y-2">
                <label className="text-sm font-medium mb-2 text-text-secondary flex">Rejection Reason</label>
                <span className="text-red-500 whitespace-pre-line">
                  {/* {request.status.charAt(0).toUpperCase() + request.status.slice(1)} */}
                  {request.rejection_reason || request.rejectionReason}

                </span>
              </div>
              )}
            </div>
          </div>

          {/* Financial History */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary">Financial Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface-secondary rounded-lg p-4">
                <div className="text-sm text-text-secondary">Total Earnings</div>
                <div className="text-lg font-semibold text-text-primary">{formatAmount(request.totalEarnings)}</div>
              </div>
              <div className="bg-surface-secondary rounded-lg p-4">
                <div className="text-sm text-text-secondary">Previous Withdrawals</div>
                <div className="text-lg font-semibold text-text-primary">{formatAmount(request.totalWithdrawn)}</div>
              </div>
              <div className="bg-surface-secondary rounded-lg p-4">
                <div className="text-sm text-text-secondary">Available Balance</div>
                <div className="text-lg font-semibold text-text-primary">{formatAmount(request.availableBalance)}</div>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary">Risk Assessment</h3>
            <div className="bg-surface-secondary rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={request.riskLevel === 'high' ? 'AlertTriangle' : request.riskLevel === 'medium' ? 'AlertCircle' : 'CheckCircle'} 
                  size={20} 
                  color={request.riskLevel === 'high' ? 'var(--color-error)' : request.riskLevel === 'medium' ? 'var(--color-warning)' : 'var(--color-success)'} 
                />
                <span className="font-medium text-text-primary">Risk Level: {request.riskLevel}</span>
              </div>
              <div className="space-y-2">
                {request.riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Icon name="Minus" size={12} />
                    <span className="text-text-secondary">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

         
        </div>

        {/* Actions */}
        {request.status === 'requested' && (
          <div className="flex justify-end space-x-3 p-6 border-t border-border">
            <Button
              variant="danger"
              iconName="X"
              iconPosition="left"
              onClick={() => {
                onReject(request);
                onClose();
              }}
            >
              Reject Request
            </Button>
            <Button
              variant="success"
              iconName="Check"
              iconPosition="left"
              onClick={() => {
                onApprove(request.id);
                onClose();
              }}
            >
              Approve Request
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetailsModal;