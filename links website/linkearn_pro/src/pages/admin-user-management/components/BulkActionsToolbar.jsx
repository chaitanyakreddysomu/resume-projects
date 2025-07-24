import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsToolbar = ({ selectedCount = 0, onBulkAction }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const bulkActions = [
    {
      id: 'activate',
      label: 'Activate Selected',
      icon: 'CheckCircle',
      color: 'success',
      description: 'Activate all selected user accounts'
    },
    {
      id: 'suspend',
      label: 'Suspend Selected',
      icon: 'Ban',
      color: 'error',
      description: 'Suspend all selected user accounts',
      requiresConfirmation: true
    },
    {
      id: 'verify',
      label: 'Verify Selected',
      icon: 'Shield',
      color: 'primary',
      description: 'Mark all selected accounts as verified'
    },
    {
      id: 'message',
      label: 'Send Message',
      icon: 'Mail',
      color: 'accent',
      description: 'Send message to all selected users'
    }
  ];

  const handleActionClick = (action) => {
    if (action?.requiresConfirmation) {
      setPendingAction(action);
      setShowConfirmDialog(true);
    } else {
      onBulkAction?.(action?.id);
    }
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      onBulkAction?.(pendingAction?.id);
      setShowConfirmDialog(false);
      setPendingAction(null);
    }
  };

  const handleCancelAction = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  const getButtonClasses = (color) => {
    switch (color) {
      case 'success':
        return 'text-success border-success hover:bg-success-50';
      case 'error':
        return 'text-error border-error hover:bg-error-50';
      case 'primary':
        return 'text-primary border-primary hover:bg-primary-50';
      case 'accent':
        return 'text-purple-600 border-purple-600 hover:bg-purple-50';
      default:
        return 'text-text-secondary border-border hover:bg-gray-50';
    }
  };

  return (
    <>
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="Users" size={16} color="var(--color-primary)" />
            </div>
            <div>
              <h3 className="font-medium text-text-primary">
                {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
              </h3>
              <p className="text-sm text-text-secondary">
                Choose an action to apply to all selected users
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {bulkActions?.map((action) => (
              <Button
                key={action?.id}
                variant="outline"
                size="sm"
                iconName={action?.icon}
                iconSize={16}
                onClick={() => handleActionClick(action)}
                className={`${getButtonClasses(action?.color)} flex-shrink-0`}
                title={action?.description}
              >
                <span className="hidden sm:inline">{action?.label}</span>
                <span className="sm:hidden">{action?.icon}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && pendingAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
          <div className="bg-surface rounded-lg border border-border w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-text-primary">Confirm Action</h3>
                  <p className="text-sm text-text-secondary">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-text-primary mb-2">
                  Are you sure you want to <strong>{pendingAction?.label?.toLowerCase()}</strong>?
                </p>
                <p className="text-sm text-text-secondary">
                  This will affect <strong>{selectedCount} user{selectedCount !== 1 ? 's' : ''}</strong>.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelAction}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  size="sm"
                  onClick={handleConfirmAction}
                  className="flex-1 bg-error text-white hover:bg-error/90"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsToolbar;