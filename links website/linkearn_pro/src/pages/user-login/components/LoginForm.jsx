import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onSubmit, isLoading, onForgotPassword }) => {
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const validateEmailOrMobile = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    return emailRegex.test(value) || mobileRegex.test(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'emailOrMobile') {
      // Remove spaces and special characters for mobile input
      const cleanValue = value.replace(/[^\w@.-]/g, '');
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOrMobile) {
      newErrors.emailOrMobile = 'Email or mobile number is required';
    } else if (!validateEmailOrMobile(formData.emailOrMobile)) {
      newErrors.emailOrMobile = 'Please enter a valid email address or mobile number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await onSubmit(formData);
        // Reset failed attempts on successful login
        setFailedAttempts(0);
      } catch (error) {
        // Increment failed attempts
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        // Show captcha after 3 failed attempts
        if (newFailedAttempts >= 3) {
          setShowCaptcha(true);
        }
        
        // Set error for invalid credentials
        setErrors({ general: 'Invalid email/mobile or password. Please try again.' });
      }
    }
  };

  const getInputType = (value) => {
    // Check if value looks like a mobile number (starts with 6-9 and contains only digits)
    if (/^[6-9]\d*$/.test(value)) {
      return 'tel';
    }
    return 'email';
  };

  const getInputPlaceholder = () => {
    if (formData.emailOrMobile.length === 0) {
      return 'Email or mobile number';
    }
    if (/^[6-9]/.test(formData.emailOrMobile)) {
      return 'Mobile number';
    }
    return 'Email address';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* General Error */}
      {errors.general && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-3 flex items-center space-x-2">
          <Icon name="AlertTriangle" size={16} color="var(--color-error)" />
          <p className="text-sm text-error">{errors.general}</p>
        </div>
      )}

      {/* Rate Limiting Warning */}
      {failedAttempts >= 2 && failedAttempts < 3 && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 flex items-center space-x-2">
          <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
          <p className="text-sm text-warning">
            {3 - failedAttempts} attempt{3 - failedAttempts !== 1 ? 's' : ''} remaining before security verification
          </p>
        </div>
      )}

      {/* Email or Mobile */}
      <div>
        <label htmlFor="emailOrMobile" className="block text-sm font-medium text-text-primary mb-2">
          Email or Mobile Number
        </label>
        <div className="relative">
          <Input
            type={getInputType(formData.emailOrMobile)}
            id="emailOrMobile"
            name="emailOrMobile"
            value={formData.emailOrMobile}
            onChange={handleInputChange}
            placeholder={getInputPlaceholder()}
            className={`pr-10 ${errors.emailOrMobile ? 'border-error focus:ring-error' : ''}`}
            autoComplete="username"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Icon 
              name={/^[6-9]/.test(formData.emailOrMobile) ? 'Smartphone' : 'Mail'} 
              size={16} 
              className="text-text-secondary"
            />
          </div>
        </div>
        {errors.emailOrMobile && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.emailOrMobile}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
          Password
        </label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className={`pr-10 ${errors.password ? 'border-error focus:ring-error' : ''}`}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Icon 
              name={showPassword ? 'EyeOff' : 'Eye'} 
              size={16} 
              className="text-text-secondary hover:text-text-primary"
            />
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.password}
          </p>
        )}
      </div>

      {/* CAPTCHA (shown after failed attempts) */}
      {showCaptcha && (
        <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Shield" size={16} color="var(--color-accent)" />
            <span className="text-sm font-medium text-accent">Security Verification Required</span>
          </div>
          <div className="bg-white border border-border rounded p-3 text-center">
            <div className="text-lg font-mono bg-gray-100 p-2 rounded mb-2 select-none">
              7K3M9
            </div>
            <Input
              type="text"
              placeholder="Enter the code above"
              className="text-center"
              maxLength="5"
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        className="mt-6"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;