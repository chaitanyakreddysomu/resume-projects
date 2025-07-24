import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ onSubmit, isLoading, initialReferralCode = '' }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: initialReferralCode
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 1) return 'bg-error';
    if (strength <= 2) return 'bg-warning';
    if (strength <= 3) return 'bg-accent';
    return 'bg-success';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength <= 1) return 'Weak';
    if (strength <= 2) return 'Fair';
    if (strength <= 3) return 'Good';
    return 'Strong';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }
    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* First Name */}
      <div>
        <label htmlFor="firstname" className="block text-sm font-medium text-text-primary mb-2">
          First Name
        </label>
        <Input
          type="text"
          id="firstname"
          name="firstname"
          value={formData.firstname}
          onChange={handleInputChange}
          placeholder="Enter your first name"
          className={errors.firstname ? 'border-error focus:ring-error' : ''}
        />
        {errors.firstname && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.firstname}
          </p>
        )}
      </div>
      {/* Last Name */}
      <div>
        <label htmlFor="lastname" className="block text-sm font-medium text-text-primary mb-2">
          Last Name
        </label>
        <Input
          type="text"
          id="lastname"
          name="lastname"
          value={formData.lastname}
          onChange={handleInputChange}
          placeholder="Enter your last name"
          className={errors.lastname ? 'border-error focus:ring-error' : ''}
        />
        {errors.lastname && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.lastname}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Email Address
        </label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email address"
          className={errors.email ? 'border-error focus:ring-error' : ''}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.email}
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
            placeholder="Create a strong password"
            className={`pr-10 ${errors.password ? 'border-error focus:ring-error' : ''}`}
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
        
        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-border rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              <span className={`text-xs font-medium ${getPasswordStrengthColor(passwordStrength).replace('bg-', 'text-')}`}>
                {getPasswordStrengthText(passwordStrength)}
              </span>
            </div>
          </div>
        )}
        
        {errors.password && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            className={`pr-10 ${errors.confirmPassword ? 'border-error focus:ring-error' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Icon 
              name={showConfirmPassword ? 'EyeOff' : 'Eye'} 
              size={16} 
              className="text-text-secondary hover:text-text-primary"
            />
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Referral Code (Optional) */}
      <div>
        <label htmlFor="referralCode" className="block text-sm font-medium text-text-primary mb-2">
          Referral Code <span className="text-text-secondary">(Optional)</span>
        </label>
        <Input
          type="text"
          id="referralCode"
          name="referralCode"
          value={formData.referralCode}
          onChange={handleInputChange}
          placeholder="Enter referral code if you have one"
          className={errors.referralCode ? 'border-error focus:ring-error' : ''}
        />
        {errors.referralCode && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.referralCode}
          </p>
        )}
        <p className="mt-1 text-xs text-text-secondary">
          Get a referral code from a friend to earn 5% of their earnings!
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        className="mt-6"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegistrationForm;