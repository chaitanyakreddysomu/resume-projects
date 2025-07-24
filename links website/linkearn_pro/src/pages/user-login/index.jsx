import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import LoginForm from './components/LoginForm';
import SocialLogin from './components/SocialLogin';
import BiometricLogin from './components/BiometricLogin';
import API_BASE_URL from 'utils/config';

const UserLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
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
    } catch (err) {
      console.error('Error checking login state:', err);
    }
  }, [navigate]);

  const clearMessage = () => setMessage(null);

  const handleLoginSubmit = async (formData) => {
    clearMessage();
    setIsLoading(true);
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegex = /^[6-9]\d{9}$/;
      let payload = { password: formData.password };

      if (emailRegex.test(formData.emailOrMobile)) {
        payload.email = formData.emailOrMobile;
      } else if (mobileRegex.test(formData.emailOrMobile)) {
        payload.phone = formData.emailOrMobile;
      } else {
        throw new Error('Invalid email or mobile number');
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify({
          token: data.token,
          name: data.name,
          email: data.email,
          role: data.role
        }));

        if (data.role === 'user') {
          navigate('/user-dashboard');
        } else {
          navigate('/admin-dashboard');
        }
      } else {
        setMessage(data.error || 'Login failed.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    clearMessage();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Social login failed:', error);
      setMessage('Social login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async (type) => {
    clearMessage();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Biometric login failed:', error);
      setMessage('Biometric login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email) => {
    clearMessage();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setShowForgotPassword(false);
      } else {
        setMessage(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      setMessage('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Key" size={32} color="var(--color-primary)" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Reset Password</h2>
            <p className="text-text-secondary">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {message && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-800 text-center">{message}</div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            const email = new FormData(e.target).get('email');
            handleForgotPassword(email);
          }}>
            <div className="mb-6">
              <label htmlFor="resetEmail" className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <Input
                type="email"
                id="resetEmail"
                name="email"
                placeholder="Enter your email address"
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
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => {
                setShowForgotPassword(false);
                clearMessage();
              }}
            >
              Back to Sign In
            </Button>
          </form>
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
          onClick={() => navigate('/user-registration')}
          className="text-primary"
        >
          Create Account
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 pb-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-3">Welcome Back! 👋</h2>
            <p className="text-text-secondary">
              Sign in to access your dashboard and continue earning
            </p>
          </div>

          {message && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-800 text-center">{message}</div>
          )}

          <div className="bg-surface rounded-2xl shadow-xl p-6 md:p-8 mb-6">
            <BiometricLogin
              onBiometricLogin={handleBiometricLogin}
              isLoading={isLoading}
            />

            <LoginForm
              onSubmit={handleLoginSubmit}
              isLoading={isLoading}
              onForgotPassword={() => {
                clearMessage();
                setShowForgotPassword(true);
              }}
            />

            <div className="flex items-center justify-between mb-4 mt-3">
              <button
                type="button"
                onClick={() => {
                  clearMessage();
                  setShowForgotPassword(true);
                }}
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Uncomment if you want social login */}
            {/* <div className="mt-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-surface text-text-secondary">Or continue with</span>
                </div>
              </div>
              <SocialLogin onSocialLogin={handleSocialLogin} isLoading={isLoading} />
            </div> */}
          </div>

          <div className="text-center text-sm text-text-secondary">
            <p>
              Don't have an account?{' '}
              <Link to="/user-registration" className="text-primary hover:underline font-medium">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
