import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import API_BASE_URL from 'utils/config';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid reset link');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/user-login');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertCircle" size={32} color="var(--color-error)" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Invalid Reset Link</h2>
          <p className="text-text-secondary mb-6">
            The password reset link is invalid or has expired.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/user-login')}
            fullWidth
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} color="var(--color-success)" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Password Reset Successfully!</h2>
          <p className="text-text-secondary mb-6">
            Your password has been updated. You will be redirected to the login page shortly.
          </p>
          <div className="animate-pulse">
            <div className="w-full bg-primary-100 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
            <Icon name="Link" size={24} color="white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary font-heading">LinkEarn Pro</h1>
            <p className="text-xs text-text-secondary">Your earnings platform</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/user-login')}
          className="text-primary"
        >
          Back to Login
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 pb-8">
        <div className="max-w-md w-full">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={32} color="var(--color-primary)" />
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-3">Reset Password</h2>
            <p className="text-text-secondary">
              Enter your new password below
            </p>
          </div>

          {/* Reset Form Card */}
          <div className="bg-surface rounded-2xl shadow-xl p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={20} color="var(--color-error)" />
                    <span className="text-error text-sm">{error}</span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  minLength={6}
                />
                <p className="text-xs text-text-secondary mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                className="mb-4"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="Shield" size={16} color="var(--color-warning)" className="mt-0.5" />
                <div>
                  <p className="text-warning text-sm font-medium mb-1">Security Notice</p>
                  <p className="text-warning text-xs">
                    Make sure to use a strong password that you haven't used elsewhere. 
                    This reset link will expire after use.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-text-secondary mt-6">
            <p>
              Remember your password?{' '}
              <button
                onClick={() => navigate('/user-login')}
                className="text-primary hover:underline font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 