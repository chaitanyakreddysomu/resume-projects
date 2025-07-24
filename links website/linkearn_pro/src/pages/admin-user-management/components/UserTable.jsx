import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserTable = ({
  users = [],
  selectedUsers = [],
  onUserSelect,
  onSelectAll,
  onUserAction,
  isLoading = false
}) => {
  const handleSelectAll = (e) => {
    onSelectAll?.(e.target.checked);
  };

  const handleUserSelect = (userId, e) => {
    onUserSelect?.(userId, e.target.checked);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    })}`;
  };

  const getReferrerName = (referrerId) => {
    if (!referrerId) return null;
    const referrer = users.find(user => user.id === referrerId);
    return referrer?.name || referrerId;
  };

  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg border border-border">
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading users...</p>
        </div>
      </div>
    );
  }

  if (!users?.length) {
    return (
      <div className="bg-surface rounded-lg border border-border">
        <div className="p-8 text-center">
          <Icon name="Users" size={48} className="mx-auto mb-4 text-text-secondary" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No users found</h3>
          <p className="text-text-secondary">Try adjusting your filters to see more results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedUsers?.length === users?.length && users?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Registered</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Referred By</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Total Earned</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Available to Withdraw</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Links</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user?.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user?.id)}
                    onChange={(e) => handleUserSelect(user?.id, e)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="var(--color-primary)" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-text-primary">{user?.name}</span>
                        {user?.role === 'admin' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary border border-primary-200">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-text-secondary">{user?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-text-secondary">
                  {formatDate(user?.registrationDate || user?.createdat)}
                </td>
                <td className="px-4 py-4 text-text-secondary">
                  {user?.referredBy ? (
                    <span className="text-primary font-medium">{getReferrerName(user?.referredBy)}</span>
                  ) : (
                    <span className="text-text-secondary">No</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-text-primary">
                    {formatCurrency(user?.totalEarned !== undefined ? user.totalEarned : user.totalEarnings)}
                  </div>
                  <div className="text-xs text-text-secondary">Lifetime earnings</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-text-primary">
                    {formatCurrency(user?.availableForWithdraw ?? 0)}
                  </div>
                  <div className="text-xs text-text-secondary">Withdrawable</div>
                </td>
                <td className="px-4 py-4 text-text-primary font-medium">
                  {user?.totalLinks}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      user?.status
                    )}`}
                  >
                    {getStatusLabel(user?.status)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      iconSize={16}
                      onClick={() => onUserAction?.('view', user?.id)}
                      className="text-primary hover:bg-primary-100 hover:!text-black"
                    />
                    {user?.status === 'active' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Ban"
                        iconSize={16}
                        onClick={() => onUserAction?.('suspend', user?.id)}
                        className="text-error hover:bg-red-600 hover:text-white"
                      />
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="CheckCircle"
                        iconSize={16}
                        onClick={() => onUserAction?.('activate', user?.id)}
                        className="text-success hover:bg-success hover:text-white"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {users.map((user) => (
          <div key={user?.id} className="bg-surface rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user?.id)}
                  onChange={(e) => handleUserSelect(user?.id, e)}
                  className="rounded border-border"
                />
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="var(--color-primary)" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-text-primary">{user?.name}</span>
                    {user?.role === 'admin' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary border border-primary-200">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-text-secondary">{user?.email}</div>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  user?.status
                )}`}
              >
                {getStatusLabel(user?.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-text-secondary">Registered</div>
                <div className="text-sm font-medium">{formatDate(user?.registrationDate || user?.createdat)}</div>
              </div>
              <div>
                <div className="text-xs text-text-secondary">Referred By</div>
                <div className="text-sm font-medium">
                  {user?.referredBy ? (
                    <span className="text-primary">{getReferrerName(user?.referredBy)}</span>
                  ) : (
                    <span className="text-text-secondary">No</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-text-secondary">Total Earned</div>
                <div className="text-sm font-medium text-text-primary">
                  {formatCurrency(user?.totalEarned !== undefined ? user.totalEarned : user.totalEarnings)}
                </div>
              </div>
              <div>
                <div className="text-xs text-text-secondary">Available to Withdraw</div>
                <div className="text-sm font-medium text-text-primary">
                  {formatCurrency(user?.availableForWithdraw ?? 0)}
                </div>
              </div>
              <div>
                <div className="text-xs text-text-secondary">Links</div>
                <div className="text-sm font-medium">{user?.totalLinks}</div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="Eye"
                iconSize={16}
                onClick={() => onUserAction?.('view', user?.id)}
                className="text-primary hover:bg-primary-100 hover:!text-black"
              />
              {user?.status === 'active' ? (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Ban"
                  iconSize={16}
                  onClick={() => onUserAction?.('suspend', user?.id)}
                  className="text-error hover:bg-red-600 hover:text-white"
                />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="CheckCircle"
                  iconSize={16}
                  onClick={() => onUserAction?.('activate', user?.id)}
                  className="text-success hover:bg-success hover:text-white"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
