import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentRequestTable = ({
  requests,
  onApprove,
  onReject,
  onViewDetails,
  onBulkAction,
  selectedRequests,
  onSelectRequest,
  onSelectAll,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-warning bg-warning-50 border-warning';
      case 'approved':
        return 'text-success bg-success-50 border-success';
      case 'processing':
        return 'text-primary bg-primary-50 border-primary';
      case 'completed':
        return 'text-success bg-success-50 border-success';
      case 'failed':
        return 'text-error bg-error-50 border-error';
      case 'rejected':
        return 'text-error bg-error-50 border-error';
      default:
        return 'text-text-secondary bg-surface-secondary border-border';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 4,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === requests.length) {
      onSelectAll([]);
    } else {
      onSelectAll(requests.map((req) => req.id));
    }
  };

  const isAllSelected =
    selectedRequests.length === requests.length && requests.length > 0;
  const isPartiallySelected =
    selectedRequests.length > 0 && selectedRequests.length < requests.length;

  // Reduce padding from p-4 to p-2 and space-x-2 to space-x-1 for less col spacing
  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      {/* Bulk Actions Header */}
      {selectedRequests.length > 0 && (
        <div className="bg-primary-50 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">
              {selectedRequests.length} request(s) selected
            </span>
            <div className="flex space-x-1">
              <Button
                variant="success"
                size="sm"
                iconName="Check"
                onClick={() => onBulkAction('approve', selectedRequests)}
              >
                Bulk Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                iconName="X"
                onClick={() => onBulkAction('reject', selectedRequests)}
              >
                Bulk Reject
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-secondary border-b border-border">
            <tr>
              <th className="text-left p-2">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isPartiallySelected;
                  }}
                  onChange={handleSelectAll}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </th>
              <th className="text-left p-2 text-sm font-medium text-text-primary">
                User
              </th>
              <th className="text-left p-2 text-sm font-medium text-text-primary">
                Amount
              </th>
              <th className="text-left p-2 text-sm font-medium text-text-primary">
                UPI ID
              </th>
              <th className="text-left p-2 text-sm font-medium text-text-primary">
                Request Date
              </th>
              <th className="text-left p-2 text-sm font-medium text-text-primary">
                Status
              </th>
              <th className="text-left p-2 text-sm font-medium text-text-primary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.map((request) => (
              <tr
                key={request.id}
                className="hover:bg-surface-secondary transition-colors"
              >
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedRequests.includes(request.id)}
                    onChange={() => onSelectRequest(request.id)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                </td>
                <td className="p-2">
                  <div className="space-y-0.5">
                    <div className="font-medium text-text-primary">
                      {request.userName}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {request.userEmail}
                    </div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="font-semibold text-text-primary">
                    {formatAmount(request.amount)}
                  </div>
                </td>
                <td className="p-2">
                  <div className="font-data text-sm text-text-primary">
                    {request.upiId}
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-sm text-text-secondary">
                    {formatDate(request.requestDate)}
                  </div>
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onViewDetails(request)}
                    />
                    {request.status === 'requested' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          iconName="Check"
                          onClick={() => onApprove(request.id)}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          iconName="X"
                          onClick={() => onReject(request)}
                        />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {requests.length === 0 && (
        <div className="p-8 text-center">
          <Icon
            name="FileX"
            size={48}
            className="mx-auto text-text-secondary mb-4"
          />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No Payment Requests
          </h3>
          <p className="text-text-secondary">
            No payment requests match your current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentRequestTable;