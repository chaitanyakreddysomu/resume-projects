import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import API_BASE_URL from 'utils/config';

const QuickActions = ({ availableBalance = 0, onDataRefresh }) => {
  const [isWithdrawalEnabled, setIsWithdrawalEnabled] = useState(false);
  const [daysUntilWithdrawal, setDaysUntilWithdrawal] = useState(0);
  const [hasWithdrawalRequest, setHasWithdrawalRequest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'info' });

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpPopup, setOtpPopup] = useState({ amount: 0, email: '', token: null, upi: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const checkWithdrawalWindow = () => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const currentDate = now.getDate();

      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const withdrawalStartDate = lastDayOfMonth - 2;

      const isInWindow = currentDate >= withdrawalStartDate;
      setIsWithdrawalEnabled(isInWindow);

      if (!isInWindow) {
        const daysLeft = withdrawalStartDate - currentDate;
        setDaysUntilWithdrawal(daysLeft);
      }
    };

    const checkExistingWithdrawals = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/withdrawal/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const withdrawals = await response.json();
          const hasPendingRequest = withdrawals.some(w => w.status === 'requested');
          setHasWithdrawalRequest(hasPendingRequest);
        }
      } catch (error) {
        console.error('Error checking existing withdrawals:', error);
      }
    };

    checkWithdrawalWindow();
    checkExistingWithdrawals();
    const interval = setInterval(checkWithdrawalWindow, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: 'info' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  

  useEffect(() => {
    const refreshWithdrawalStatus = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/withdrawal/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const withdrawals = await response.json();
          const hasPendingRequest = withdrawals.some(w => w.status === 'requested');
          setHasWithdrawalRequest(hasPendingRequest);
          if (onDataRefresh) onDataRefresh();
        }
      } catch (error) {
        console.error('Error refreshing withdrawal status:', error);
      }
    };

    refreshWithdrawalStatus();

    const handleFocus = () => {
      refreshWithdrawalStatus();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleCreateLink = () => {
    navigate('/link-creation');
  };

  const handleWithdrawal = async () => {
    if (!isWithdrawalEnabled) return;

    if (hasWithdrawalRequest) {
      navigate('/withdrawal-request');
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: 'info' });

    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) throw new Error('User not authenticated');

      const profileResponse = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!profileResponse.ok) throw new Error('Failed to fetch user profile');

      const profileData = await profileResponse.json();

      if (!profileData.upi) {
        setMessage({
          text: 'Please set up your UPI ID in your profile settings before requesting a withdrawal.',
          type: 'error',
        });
        setTimeout(() => navigate('/profile'), 2000);
        return;
      }

      const amount = Math.floor(availableBalance);
      if (amount < 400) {
        setMessage({
          text: 'Minimum withdrawal amount is ₹400. Please accumulate at least ₹400 before requesting a withdrawal.',
          type: 'error',
        });
        return;
      }

      const otpResponse = await fetch(`${API_BASE_URL}/api/user/profile/payment/send-withdrawal-otp`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!otpResponse.ok) {
        const errorData = await otpResponse.json();
        throw new Error(errorData.error || 'Failed to send OTP');
      }

      setShowOtpInput(true);
      setOtpPopup({
        amount,
        email: profileData.email,
        token,
        upi: profileData.upi,
      });
    } catch (error) {
      console.error('Error creating withdrawal request:', error);
      setMessage({ text: `Failed to create withdrawal request: ${error.message}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) {
      setMessage({ text: 'Please enter a valid 6-digit OTP.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: 'info' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/withdrawal/request`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${otpPopup.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: otpPopup.amount,
          upi: otpPopup.upi,
          emailOtp: otp,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create withdrawal request');
      }

      setMessage({
        text: `Withdrawal request of ₹${otpPopup.amount} submitted successfully!`,
        type: 'success',
      });
      setShowOtpInput(false);
      setOtp('');
      await refreshWithdrawalStatus();
    } catch (error) {
      console.error('OTP submission error:', error);
      setMessage({ text: `Withdrawal failed: ${error.message}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshWithdrawalStatus = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/withdrawal/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const withdrawals = await response.json();
        const hasPendingRequest = withdrawals.some(w => w.status === 'requested');
        setHasWithdrawalRequest(hasPendingRequest);
        if (onDataRefresh) onDataRefresh();
      }
    } catch (error) {
      console.error('Error refreshing withdrawal status:', error);
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Zap" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
      </div>

      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          iconName="Plus"
          iconPosition="left"
          onClick={handleCreateLink}
          className="w-full"
        >
          Create New Link
        </Button>

        <div className="relative">
          <Button
            variant={hasWithdrawalRequest ? "outline" : (isWithdrawalEnabled ? "success" : "outline")}
            size="lg"
            iconName={hasWithdrawalRequest ? "Eye" : "Download"}
            iconPosition="left"
            onClick={handleWithdrawal}
            disabled={!isWithdrawalEnabled || isSubmitting}
            loading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Processing...' :
              hasWithdrawalRequest ? 'View Request' :
                isWithdrawalEnabled ? 'Request Withdrawal' : 'Withdrawal Unavailable'}
          </Button>

          {!isWithdrawalEnabled && (
            <div className="mt-2 p-2 bg-warning-50 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={14} color="var(--color-warning)" />
                <span className="text-xs text-warning">
                  Available in {daysUntilWithdrawal} days (last 3 days of month)
                </span>
              </div>
            </div>
          )}

          {hasWithdrawalRequest && (
            <div className="mt-2 p-2 bg-success-50 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={14} color="var(--color-success)" />
                <span className="text-xs text-success">
                  Withdrawal request submitted successfully
                </span>
              </div>
            </div>
          )}
        </div>

        {message.text && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            message.type === 'success' ? 'bg-success-50 text-success' :
              message.type === 'error' ? 'bg-error-50 text-error' :
                'bg-info-50 text-info'
          }`}>
            {message.text}
          </div>
        )}

        {showOtpInput && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-text-secondary">
              An OTP has been sent to your email ({otpPopup.email}). Please enter the 6-digit code to confirm your withdrawal of ₹{otpPopup.amount}.
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring focus:ring-primary"
            />
            <div className="flex gap-2">
              <Button onClick={handleOtpSubmit} disabled={isSubmitting} loading={isSubmitting}>
                Submit
              </Button>
              <Button variant="outline" onClick={() => setShowOtpInput(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="BarChart3"
            iconPosition="left"
            onClick={() => navigate('/earnings-analytics')}
            className="text-left justify-start"
          >
            Analytics
          </Button>

          <Button
            variant="ghost"
            size="sm"
            iconName="Link"
            iconPosition="left"
            onClick={() => navigate('/link-management')}
            className="text-left justify-start"
          >
            Manage Links
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
