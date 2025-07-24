import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import axios from 'axios';
import API_BASE_URL from 'utils/config';

const AccountSecurity = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords must match and cannot be empty' });
    }

    if (currentPassword === newPassword) {
      return setMessage({ type: 'error', text: 'New password cannot be the same as the current password' });
    }

    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) throw new Error('User not authenticated');

      const url = `${API_BASE_URL}/api/user/profile/security`;
      await axios.put(
        url,
        {
          oldPassword: currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage({ type: 'success', text: 'Password updated successfully' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      const errorText = err.response?.data?.error || 'Failed to update password';
      setMessage({ type: 'error', text: errorText });
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Account Security</h2>
        <p className="text-sm text-text-secondary">Manage your account security settings</p>
      </div>

      {/* Notification */}
      {message && (
        <div
          className={`flex items-center justify-between p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-4 text-xl font-bold leading-none">
            &times;
          </button>
        </div>
      )}

      {/* Password Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-text-primary">Password</h3>
            <p className="text-sm text-text-secondary">Update your password</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Key"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            Change Password
          </Button>
        </div>

        {showPasswordForm && (
          <div className="p-4 bg-surface-secondary border border-border rounded-lg">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showPasswords.currentPassword ? 'text' : 'password'}
                  label="Current Password *"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('currentPassword')}
                  className="absolute top-2 right-3 text-gray-600"
                  aria-label="Toggle current password visibility"
                >
                  <Icon name={showPasswords.currentPassword ? 'EyeOff' : 'Eye'} />
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showPasswords.newPassword ? 'text' : 'password'}
                  label="New Password *"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('newPassword')}
                  className="absolute top-2 right-3 text-gray-600"
                  aria-label="Toggle new password visibility"
                >
                  <Icon name={showPasswords.newPassword ? 'EyeOff' : 'Eye'} />
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showPasswords.confirmPassword ? 'text' : 'password'}
                  label="Confirm New Password *"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="absolute top-2 right-3 text-gray-600"
                  aria-label="Toggle confirm password visibility"
                >
                  <Icon name={showPasswords.confirmPassword ? 'EyeOff' : 'Eye'} />
                </button>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePasswordChange}
                  disabled={
                    !passwordForm.currentPassword ||
                    !passwordForm.newPassword ||
                    passwordForm.newPassword !== passwordForm.confirmPassword
                  }
                >
                  Update Password
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSecurity;
