import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import API_BASE_URL from 'utils/config';

const WithdrawalTimer = ({ className = '', onDataRefresh }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isWithdrawalWindow, setIsWithdrawalWindow] = useState(false);
  const [nextWithdrawalDate, setNextWithdrawalDate] = useState(null);
  const [withdrawalEndTime, setWithdrawalEndTime] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'info' });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpDetails, setOtpDetails] = useState({ amount: 0, email: '', token: null, upi: '' });

  useEffect(() => {
    const calculateWithdrawalWindow = () => {
      const now = new Date();
      const currentMonth = now.getMonth()-1;
      const currentYear = now.getFullYear();
      const currentDate = now.getDate();

      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const withdrawalStartDate = lastDayOfMonth - 2;
      const withdrawalEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

      setWithdrawalEndTime(withdrawalEnd);

      const isInWindow = currentDate >= withdrawalStartDate;
      setIsWithdrawalWindow(isInWindow);

      if (isInWindow) {
        const timeDiff = withdrawalEnd.getTime() - now.getTime();
        setTimeRemaining(timeDiff > 0 ? timeDiff : 0);
        setNextWithdrawalDate(null);
      } else {
        let nextMonth = currentMonth + 1;
        let nextYear = currentYear;
        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear += 1;
        }
        const nextLastDay = new Date(nextYear, nextMonth + 1, 0).getDate();
        const nextStart = new Date(nextYear, nextMonth, nextLastDay - 2, 0, 0, 0);
        setNextWithdrawalDate(nextStart);
        const timeDiff = nextStart.getTime() - now.getTime();
        setTimeRemaining(timeDiff > 0 ? timeDiff : 0);
      }
    };

    calculateWithdrawalWindow();
    const interval = setInterval(calculateWithdrawalWindow, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeRemaining = (ms) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return [
      { label: 'days', value: days },
      { label: 'hours', value: hours },
      { label: 'minutes', value: minutes },
      { label: 'seconds', value: seconds },
    ];
  };

  const formatIST = (date) =>
    date.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const getMonthName = (date) =>
    date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'long' });

  const handleWithdrawalRequest = async () => {
    setIsSubmitting(true);
    setMessage({ text: '', type: 'info' });

    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) throw new Error('User not authenticated');

      const profileRes = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!profileRes.ok) throw new Error('Failed to fetch user profile');

      const profile = await profileRes.json();

      if (!profile.upi) {
        setMessage({
          text: 'Please set your UPI ID in profile settings before requesting withdrawal.',
          type: 'error',
        });
        return;
      }

      const amount = Math.floor(profile.wallet || 0);
      if (amount <= 0) throw new Error('No available balance to withdraw.');

      const otpRes = await fetch(`${API_BASE_URL}/api/user/profile/payment/send-withdrawal-otp`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!otpRes.ok) {
        const err = await otpRes.json();
        throw new Error(err.error || 'OTP sending failed');
      }

      setShowOtpInput(true);
      setOtpDetails({
        amount,
        email: profile.email,
        token,
        upi: profile.upi,
      });
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) {
      setMessage({ text: 'Enter a valid 6-digit OTP.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: 'info' });

    try {
      const res = await fetch(`${API_BASE_URL}/api/withdrawal/request`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${otpDetails.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: otpDetails.amount,
          upi: otpDetails.upi,
          emailOtp: otp,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Withdrawal failed');
      }

      setMessage({ text: `₹${otpDetails.amount} withdrawal request submitted.`, type: 'success' });
      setShowOtpInput(false);
      setOtp('');
      if (onDataRefresh) onDataRefresh();
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (timeRemaining === null) return null;

  const time = formatTimeRemaining(timeRemaining);

  return (
    <div className={`bg-surface rounded-lg border border-border p-4 ${className}`}>
      {isWithdrawalWindow ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-success">
              Withdrawal Window Active ({getMonthName(new Date())})
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-text-secondary">Request withdrawals before the window closes:</p>
            <div className="flex items-center space-x-4">
              {time.map((item, i) => (
                <div key={i} className="flex items-center space-x-1">
                  <span className="text-lg font-bold text-text-primary font-data">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-text-secondary">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-text-secondary mt-1">
              Withdrawals close on {withdrawalEndTime ? formatIST(withdrawalEndTime) : ''}
            </div>
          </div>

          {/* <Button
            variant="success"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={handleWithdrawalRequest}
            className="w-full"
            disabled={isSubmitting }
            loading={isSubmitting}
          >
            Request Withdrawal
          </Button> */}

          {showOtpInput && (
            <div className="space-y-2 mt-2">
              <p className="text-sm text-text-secondary">
                OTP sent to your email ({otpDetails.email}). Enter it below to confirm withdrawal.
              </p>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none"
              />
              <div className="flex gap-2">
                <Button onClick={handleOtpSubmit} disabled={isSubmitting} loading={isSubmitting}>
                  Submit OTP
                </Button>
                <Button variant="outline" onClick={() => setShowOtpInput(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {message.text && (
            <div
              className={`mt-3 p-3 rounded-md text-sm ${
                message.type === 'success'
                  ? 'bg-success-50 text-success'
                  : message.type === 'error'
                  ? 'bg-error-50 text-error'
                  : 'bg-info-50 text-info'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
            <span className="text-sm font-medium text-warning">
              Next Withdrawal Window{nextWithdrawalDate ? ` (${getMonthName(nextWithdrawalDate)})` : ''}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-text-secondary">
              {nextWithdrawalDate && <>Opens on {formatIST(nextWithdrawalDate)}</>}
            </p>
            <div className="flex items-center space-x-4">
              {time.map((item, i) => (
                <div key={i} className="flex items-center space-x-1">
                  <span className="text-lg font-bold text-text-primary font-data">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-text-secondary">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-warning-50 rounded-md">
            <Icon name="Clock" size={16} color="var(--color-warning)" />
            <span className="text-xs text-warning">
              Withdrawals available last 3 days of each month (IST)
            </span>
          </div>
          {message.text && (
            <div
              className={`mt-3 p-3 rounded-md text-sm ${
                message.type === 'success'
                  ? 'bg-success-50 text-success'
                  : message.type === 'error'
                  ? 'bg-error-50 text-error'
                  : 'bg-info-50 text-info'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WithdrawalTimer;
