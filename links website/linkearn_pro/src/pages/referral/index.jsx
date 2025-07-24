import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import API_BASE_URL from 'utils/config';

const ReferralPage = () => {
  const { referralCode } = useParams();
  const navigate = useNavigate();
  const [referrerInfo, setReferrerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReferrerInfo();
  }, [referralCode]);

  const fetchReferrerInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/referral/${referralCode}`);
      
      if (response.ok) {
        const data = await response.json();
        setReferrerInfo(data);
      } else {
        setError('Invalid referral code');
      }
    } catch (error) {
      console.error('Error fetching referrer info:', error);
      setError('Failed to load referral information');
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    navigate(`/user-registration?ref=${referralCode}`);
  };

  const handleLogin = () => {
    navigate('/user-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading referral information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-error-50 to-accent-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="AlertCircle" size={32} color="var(--color-error)" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Invalid Referral Link</h2>
          <p className="text-text-secondary mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/user-registration')}
            >
              Create Account
            </Button>
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onClick={() => navigate('/user-login')}
            >
              Sign In
            </Button>
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
            <p className="text-xs text-text-secondary">Earn through smart link sharing</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 pb-8">
        <div className="max-w-md w-full">
          {/* Referral Welcome Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Gift" size={32} color="white" />
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              You've been invited! 🎉
            </h2>
            <p className="text-text-secondary mb-4">
              <strong>{referrerInfo?.name}</strong> has invited you to join LinkEarn Pro
            </p>
            <div className="bg-surface-secondary rounded-lg p-4 mb-6">
              <p className="text-sm text-text-secondary">
                Join using this referral link and both you and {referrerInfo?.name} will benefit!
              </p>
            </div>
          </div>

          {/* Benefits Card */}
          <div className="bg-surface rounded-2xl shadow-xl p-6 md:p-8 mb-6">
            <h3 className="text-xl font-bold text-text-primary mb-4 text-center">
              What you'll get:
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center mt-0.5">
                  <Icon name="Zap" size={14} color="var(--color-success)" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Instant Earnings</p>
                  <p className="text-sm text-text-secondary">Start earning money from day one</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center mt-0.5">
                  <Icon name="Users" size={14} color="var(--color-accent)" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Referral Bonus</p>
                  <p className="text-sm text-text-secondary">Earn 5% from users you refer</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                  <Icon name="BarChart3" size={14} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Analytics Dashboard</p>
                  <p className="text-sm text-text-secondary">Track your earnings and performance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleGetStarted}
              className="text-lg py-4"
            >
              Get Started with Referral
            </Button>
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onClick={handleLogin}
            >
              Already have an account? Sign In
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-text-secondary mt-6">
            <p>
              By joining, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage; 