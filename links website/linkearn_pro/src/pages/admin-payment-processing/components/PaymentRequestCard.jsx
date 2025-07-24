import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentRequestCard = ({ request, onApprove, onReject, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      // case 'pending': return 'text-warning bg-warning-50 border-warning';
      case 'requested': return 'text-warning bg-warning-50 border-warning';
      case 'approved': return 'text-success bg-success-50 border-success';
      case 'processing': return 'text-primary bg-primary-50 border-primary';
      case 'completed': return 'text-success bg-success-50 border-success';
      case 'failed': return 'text-error bg-error-50 border-error';
      case 'rejected': return 'text-error bg-error-50 border-error';
      default: return 'text-text-secondary bg-surface-secondary border-border';
    }
  };

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

  return (
    <div className="bg-surface rounded-lg border border-border p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-text-primary">{request.userName}</h3>
          <p className="text-sm text-text-secondary">{request.userEmail}</p>
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={14} />
            <span className="text-xs text-text-secondary">{formatDate(request.requestDate)}</span>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </div>
      </div>

      {/* Amount and UPI */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Amount:</span>
          <span className="text-lg font-bold text-text-primary">{formatAmount(request.amount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">UPI ID:</span>
          <span className="text-sm font-medium text-text-primary font-data">{request.upiId}</span>
        </div>
      </div>

      {/* Risk Assessment */}
      {request.riskLevel && (
        <div className="flex items-center space-x-2 p-2 bg-surface-secondary rounded-md">
          <Icon 
            name={request.riskLevel === 'high' ? 'AlertTriangle' : request.riskLevel === 'medium' ? 'AlertCircle' : 'CheckCircle'} 
            size={16} 
            color={request.riskLevel === 'high' ? 'var(--color-error)' : request.riskLevel === 'medium' ? 'var(--color-warning)' : 'var(--color-success)'} 
          />
          <span className="text-xs text-text-secondary">
            Risk Level: <span className="font-medium">{request.riskLevel}</span>
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col space-y-2">
        <Button
          variant="ghost"
          size="sm"
          iconName="Eye"
          iconPosition="left"
          onClick={() => onViewDetails(request)}
          className="w-full justify-start"
        >
          View Details
        </Button>
        
        {request.status === 'requested' && (
          <div className="flex space-x-2">
            <Button
              variant="success"
              size="sm"
              iconName="Check"
              onClick={() => onApprove(request.id)}
              className="flex-1"
            >
              Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              iconName="X"
              onClick={() => onReject(request)}
              className="flex-1"
            >
              Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentRequestCard;