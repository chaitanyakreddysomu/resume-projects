import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const RejectionModal = ({ isOpen, onClose, onReject, request }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please enter a rejection reason');
      return;
    }

    setLoading(true);
    try {
      await onReject(request.id, reason.trim());
      setReason('');
      onClose();
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg border border-border p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Reject Withdrawal</h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={handleCancel}
          />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="bg-surface-secondary rounded-lg p-3">
            <div className="text-sm text-text-secondary mb-1">Withdrawal Details:</div>
            <div className="text-sm font-medium text-text-primary">{request?.userName}</div>
            <div className="text-xs text-text-secondary">{request?.userEmail}</div>
            <div className="text-xs text-text-secondary">
              UPI ID: <span className="font-data text-text-primary">{request?.upiId}</span>
            </div>
            <div className="text-sm font-medium text-text-primary mt-1">
              Amount: ₹{Number(request?.amount).toLocaleString('en-IN', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="rejection-reason" className="block text-sm font-medium text-text-primary mb-2">
                Rejection Reason *
              </label>
              <textarea
                id="rejection-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter the reason for rejecting this withdrawal request..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={4}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                iconName="X"
                className="flex-1"
                disabled={loading || !reason.trim()}
              >
                {loading ? 'Rejecting...' : 'Reject'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal; 