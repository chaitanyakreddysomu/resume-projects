import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const WithdrawalForm = ({ userBalance, isWithdrawalWindow }) => {
  const [formData, setFormData] = useState({
    upiId: '',
    amount: '',
    confirmAmount: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [upiValidated, setUpiValidated] = useState(false);

  // Quick amount presets
  const quickAmounts = [100, 500, 1000];

  const validateUPI = (upiId) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiId);
  };

  const calculateFinalAmount = (amount) => {
    const fee = (amount * userBalance.processingFee) / 100;
    return amount - fee;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Validate UPI on change
    if (field === 'upiId') {
      setUpiValidated(validateUPI(value));
    }
  };

  const handleQuickAmount = (amount) => {
    setFormData(prev => ({ ...prev, amount: amount.toString(), confirmAmount: amount.toString() }));
  };

  const handleAllAmount = () => {
    const allAmount = userBalance.availableBalance;
    setFormData(prev => ({ 
      ...prev, 
      amount: allAmount.toString(), 
      confirmAmount: allAmount.toString() 
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.upiId) {
      newErrors.upiId = 'UPI ID is required';
    } else if (!validateUPI(formData.upiId)) {
      newErrors.upiId = 'Invalid UPI ID format';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Invalid amount';
      } else if (amount < userBalance.minimumWithdrawal) {
        newErrors.amount = `Minimum withdrawal amount is ₹${userBalance.minimumWithdrawal}`;
      } else if (amount > userBalance.availableBalance) {
        newErrors.amount = 'Amount exceeds available balance';
      }
    }

    if (!formData.confirmAmount) {
      newErrors.confirmAmount = 'Please confirm the amount';
    } else if (formData.amount !== formData.confirmAmount) {
      newErrors.confirmAmount = 'Amounts do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isWithdrawalWindow) {
      alert('Withdrawal window is currently closed');
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowConfirmation(true);
    } catch (error) {
      console.error('Withdrawal request failed:', error);
      alert('Failed to submit withdrawal request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} color="var(--color-success)" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Withdrawal Request Submitted
        </h3>
        <p className="text-text-secondary mb-4">
          Your withdrawal request of ₹{parseFloat(formData.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} has been submitted successfully.
        </p>
        <div className="p-4 bg-primary-50 rounded-lg mb-4">
          <p className="text-sm text-primary font-medium">
            Tracking Reference: #WD{Date.now().toString().slice(-6)}
          </p>
        </div>
        <p className="text-sm text-text-secondary mb-6">
          You will receive the funds in your UPI account within 24-48 hours on working days.
        </p>
        <Button
          variant="primary"
          onClick={() => {
            setShowConfirmation(false);
            setFormData({ upiId: '', amount: '', confirmAmount: '' });
          }}
        >
          Create New Request
        </Button>
      </div>
    );
  }

  if (!isWithdrawalWindow) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Clock" size={32} color="var(--color-warning)" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Withdrawal Window Closed
          </h3>
          <p className="text-text-secondary">
            Withdrawal requests are only available during the last 3 days of each month.
            Check the timer above for the next available window.
          </p>
        </div>
      </div>
    );
  }

  const withdrawalAmount = formData.amount ? parseFloat(formData.amount) : 0;
  const processingFee = withdrawalAmount * (userBalance.processingFee / 100);
  const finalAmount = withdrawalAmount - processingFee;

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* UPI ID Section */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            UPI ID *
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="yourname@upi"
              value={formData.upiId}
              onChange={(e) => handleInputChange('upiId', e.target.value)}
              className={`pr-10 ${errors.upiId ? 'border-error' : upiValidated && formData.upiId ? 'border-success' : ''}`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {formData.upiId && (
                upiValidated ? (
                  <Icon name="CheckCircle" size={20} color="var(--color-success)" />
                ) : (
                  <Icon name="XCircle" size={20} color="var(--color-error)" />
                )
              )}
            </div>
          </div>
          {errors.upiId && (
            <p className="text-sm text-error mt-1">{errors.upiId}</p>
          )}
          <p className="text-xs text-text-secondary mt-1">
            Enter your UPI ID (e.g., 9876543210@paytm, john@okaxis)
          </p>
        </div>

        {/* Amount Section */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Withdrawal Amount *
          </label>
          
          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            {quickAmounts.map(amount => (
              <Button
                key={amount}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(amount)}
                className="text-xs"
              >
                ₹{amount}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAllAmount}
              className="text-xs"
            >
              All (₹{userBalance.availableBalance.toLocaleString('en-IN')})
            </Button>
          </div>

          <Input
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className={errors.amount ? 'border-error' : ''}
            min={userBalance.minimumWithdrawal}
            max={userBalance.availableBalance}
          />
          {errors.amount && (
            <p className="text-sm text-error mt-1">{errors.amount}</p>
          )}
          <p className="text-xs text-text-secondary mt-1">
            Minimum: ₹{userBalance.minimumWithdrawal} | Available: ₹{userBalance.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Confirm Amount */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Confirm Amount *
          </label>
          <Input
            type="number"
            placeholder="Re-enter amount"
            value={formData.confirmAmount}
            onChange={(e) => handleInputChange('confirmAmount', e.target.value)}
            className={errors.confirmAmount ? 'border-error' : ''}
          />
          {errors.confirmAmount && (
            <p className="text-sm text-error mt-1">{errors.confirmAmount}</p>
          )}
        </div>

        {/* Amount Breakdown */}
        {withdrawalAmount > 0 && (
          <div className="bg-primary-50 rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-3">Amount Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Withdrawal Amount:</span>
                <span className="text-text-primary">₹{withdrawalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Processing Fee ({userBalance.processingFee}%):</span>
                <span className="text-error">-₹{processingFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between font-medium">
                  <span className="text-text-primary">Final Amount:</span>
                  <span className="text-success">₹{finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={!formData.upiId || !formData.amount || !formData.confirmAmount || !upiValidated}
          iconName="Download"
          iconPosition="left"
        >
          {isSubmitting ? 'Submitting Request...' : 'Submit Withdrawal Request'}
        </Button>

        {/* Security Notice */}
        <div className="p-3 bg-info-50 border border-info-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Shield" size={16} color="var(--color-info)" />
            <div className="text-xs text-info-700">
              <p className="font-medium mb-1">Security Notice</p>
              <p>Large withdrawals may require OTP verification for your security.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WithdrawalForm;