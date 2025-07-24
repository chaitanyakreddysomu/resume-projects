import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import RegistrationForm from './components/RegistrationForm';
import SocialRegistration from './components/SocialRegistration';
import API_BASE_URL from 'utils/config';

const UserRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStep, setRegistrationStep] = useState('form'); // 'form', 'verification', 'success'
  const [referralCode, setReferralCode] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ Redirect logged-in users based on role
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (parsedUser?.token && parsedUser?.role) {
        if (parsedUser.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }
    } catch (error) {
      console.error('Error checking login state:', error);
    }
  }, [navigate]);

  // Extract referral code if present
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
    }
  }, [searchParams]);

  const handleRegistrationSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.mobile,
        password: formData.password
      };

      if (formData.referralCode || referralCode) {
        payload.referralCode = formData.referralCode || referralCode;
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setRegistrationStep('verification');
      } else {
        alert(data.error || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegistration = async (provider) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Social registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Verification step UI
  if (registrationStep === 'verification') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="Mail" size={32} color="var(--color-accent)" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Check Your Email</h2>
          <p className="text-text-secondary mb-6">
            We've sent a verification link to your email address. Please click the link to verify your account.
          </p>
          <div className="flex items-center justify-center space-x-2 text-accent">
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Success step UI (not used currently, but in case needed later)
  if (registrationStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success-50 to-accent-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="CheckCircle" size={32} color="var(--color-success)" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Welcome to LinkEarn Pro! 🎉</h2>
          <p className="text-text-secondary mb-6">
            Your account has been successfully created and verified. You'll be redirected to your dashboard shortly.
          </p>
          <div className="w-full bg-success-100 rounded-full h-2 mb-4">
            <div className="bg-success h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
          <p className="text-sm text-text-secondary">Redirecting...</p>
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
            <p className="text-xs text-text-secondary">Earn through smart link sharing</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/user-login')}
          className="text-primary"
        >
          Sign In
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 pb-8">
        <div className="max-w-md w-full">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-3">Create Account</h2>
            <p className="text-text-secondary">
              Join thousands of creators earning through link sharing
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-surface rounded-2xl shadow-xl p-6 md:p-8 mb-6">
            <RegistrationForm
              onSubmit={handleRegistrationSubmit}
              isLoading={isLoading}
              initialReferralCode={referralCode}
            />

            {/* Optional Social Registration */}
            {/* 
            <div className="mt-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-surface text-text-secondary">Or continue with</span>
                </div>
              </div>
              <SocialRegistration
                onSocialRegister={handleSocialRegistration}
                isLoading={isLoading}
              />
            </div> 
            */}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-text-secondary">
            <p>
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
