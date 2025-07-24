import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import API_BASE_URL from 'utils/config';

const PaymentSettings = () => {
  const [upi, setUpi] = useState(null); // only one UPI account now
  const [isAddingUPI, setIsAddingUPI] = useState(false);
  const [newUPI, setNewUPI] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (message.text) {
      const timeout = setTimeout(() => setMessage({ type: '', text: '' }), 4000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  // Load existing UPI on component mount
  useEffect(() => {
    loadUserUPI();
  }, []);

  const loadUserUPI = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.upi) {
          setUpi({
            upiId: userData.upi,
            provider: userData.upi.split('@')[1],
            verified: true,
            addedDate: new Date().toISOString().split('T')[0],
          });
        }
      }
    } catch (error) {
      console.error('Error loading UPI:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateUPI = (upiId) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiId);
  };

  const getToken = () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser).token : null;
  };

  const sendOtpApi = async (upiId, action = 'add') => {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/api/user/profile/payment/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ upiId, action })
    });
    if (!res.ok) throw new Error('Failed to send OTP');
    return true;
  };

  const verifyOtpApi = async (upiId, otp, action = 'add') => {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/api/user/profile/payment/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ upiId, otp, action })
    });
    if (!res.ok) throw new Error('Invalid OTP');
    return true;
  };

  const deleteUpiApi = async (upiId, otp) => {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/api/user/profile/payment`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ upiId, otp })
    });
    if (!res.ok) throw new Error('Failed to delete UPI');
    return true;
  };

  const handleAddUPI = async () => {
    if (!validateUPI(newUPI)) return;
    try {
      await sendOtpApi(newUPI, 'add');
      setOtpSent(true);
      setIsAddingUPI(false);
      setUpi({
        upiId: newUPI,
        provider: newUPI.split('@')[1],
        verified: false,
        addedDate: new Date().toISOString().split('T')[0],
      });
      setNewUPI('');
      setMessage({ type: 'success', text: 'OTP sent to your email.' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to send OTP. Try again.' });
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    try {
      await verifyOtpApi(upi.upiId, otp, 'add');
      // Reload UPI data after successful verification
      await loadUserUPI();
      setOtp('');
      setOtpSent(false);
      setMessage({ type: 'success', text: 'UPI verified successfully.' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Invalid OTP.' });
    }
    setIsVerifyingOtp(false);
  };

  const handleDeleteUPI = async () => {
    try {
      await sendOtpApi(upi.upiId, 'delete');
      setIsDeleting(true);
      setOtpSent(true);
      setOtp('');
      setMessage({ type: 'success', text: 'OTP sent to your email for deletion.' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to send OTP for deletion.' });
    }
  };

  const handleVerifyDeleteOtp = async () => {
    setIsVerifyingOtp(true);
    try {
      await deleteUpiApi(upi.upiId, otp);
      setUpi(null);
      setOtpSent(false);
      setOtp('');
      setIsDeleting(false);
      setMessage({ type: 'success', text: 'UPI deleted successfully.' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Invalid OTP for deletion.' });
    }
    setIsVerifyingOtp(false);
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Payment Settings</h2>
        <p className="text-sm text-text-secondary">Manage your payment method and withdrawal preferences</p>
      </div>

      {/* Message UI */}
      {message.text && (
        <div className={`mb-4 relative text-sm px-4 py-2 rounded border 
          ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          <button
            onClick={() => setMessage({ type: '', text: '' })}
            className="absolute top-1 right-2 text-xl leading-none focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-text-primary">UPI Account</h3>
            <p className="text-sm text-text-secondary">Manage your UPI ID for withdrawals</p>
          </div>
          {!isLoading && !upi && (
            <Button variant="outline" size="sm" iconName="Plus" onClick={() => setIsAddingUPI(true)}>
              Add UPI
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="p-4 bg-surface-secondary border border-border rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-text-secondary">Loading UPI settings...</span>
            </div>
          </div>
        )}

        {isAddingUPI && (
          <div className="p-4 bg-surface-secondary border border-border rounded-lg">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                UPI ID *
              </label>
              <Input
                type="text"
                placeholder="yourname@upi"
                value={newUPI}
                onChange={e => setNewUPI(e.target.value)}
              />
              <p className="text-xs text-text-secondary mt-1">
                Enter your UPI ID (e.g., 9876543210@paytm, john@okaxis)
              </p>
              <div className="flex space-x-2 mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddUPI}
                  disabled={!validateUPI(newUPI)}
                >
                  Add UPI Account
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAddingUPI(false);
                    setNewUPI('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Show current UPI if exists */}
        {upi && (
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-text-primary">{upi.upiId}</span>
                  {upi.verified ? (
                    <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                  ) : (
                    <Icon name="AlertCircle" size={16} color="var(--color-warning)" />
                  )}
                </div>
                <p className="text-sm text-text-secondary">{upi.provider}</p>
                <p className="text-xs text-text-secondary">
                  Added on {new Date(upi.addedDate).toLocaleDateString('en-IN')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="Trash2"
                onClick={handleDeleteUPI}
                className="text-error hover:bg-error-50"
              />
            </div>
          </div>
        )}

        {/* OTP verification input */}
        {otpSent && !upi?.verified && (
          <div className="p-4 bg-surface-secondary border border-border rounded-lg mt-4">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Enter OTP sent to your email
            </label>
            <Input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              maxLength={6}
              placeholder="Enter OTP"
            />
            <div className="flex space-x-2 mt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6 || isVerifyingOtp}
              >
                {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {otpSent && isDeleting && (
          <div className="p-4 bg-surface-secondary border border-border rounded-lg mt-4">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Enter OTP sent to your email to delete UPI
            </label>
            <Input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              maxLength={6}
              placeholder="Enter OTP"
            />
            <div className="flex space-x-2 mt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleVerifyDeleteOtp}
                disabled={otp.length !== 6 || isVerifyingOtp}
              >
                {isVerifyingOtp ? 'Verifying...' : 'Verify & Delete'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setIsDeleting(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSettings;
