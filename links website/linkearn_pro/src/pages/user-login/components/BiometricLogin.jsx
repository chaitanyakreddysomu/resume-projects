import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BiometricLogin = ({ onBiometricLogin, isLoading, PublicKeyCredential }) => {
  const [biometricSupport, setBiometricSupport] = useState({
    fingerprint: false,
    faceId: false
  });
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    // Check for biometric support
    const checkBiometricSupport = () => {
      // Check if device supports biometric authentication
      if (navigator.credentials && PublicKeyCredential) {
        // Check for fingerprint support
        if (navigator.userAgent.includes('Mobile') || navigator.userAgent.includes('Android')) {
          setBiometricSupport((prev) => ({ ...prev, fingerprint: true }));
        }

        // Check for Face ID support (mainly iOS)
        if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
          setBiometricSupport((prev) => ({ ...prev, faceId: true }));
        }
      }

      // Check if user has previously logged in (simulate returning user)
      const hasLoggedInBefore = localStorage.getItem('linkern_has_logged_in');
      setIsReturningUser(!!hasLoggedInBefore);
    };

    checkBiometricSupport();
  }, []);

  const handleBiometricAuth = async (type) => {
    try {
      // Simulate biometric authentication
      if (navigator.credentials && PublicKeyCredential) {
        // In a real implementation, you would use WebAuthn API
        await new Promise((resolve) => setTimeout(resolve, 500));
        onBiometricLogin(type);
      } else {
        // Fallback for non-supported devices
        onBiometricLogin(type);
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
    }
  };

  // Don't show biometric options if not supported or not a returning user
  if (!isReturningUser || !biometricSupport.fingerprint && !biometricSupport.faceId) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="text-center mb-4">
        <p className="text-sm text-text-secondary">Quick Access</p>
      </div>
      
      <div className="flex justify-center space-x-4 mb-6">
        {biometricSupport.fingerprint &&
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleBiometricAuth('fingerprint')}
          disabled={isLoading}
          className="flex-1 max-w-[120px] h-16 border-2 border-dashed border-accent-200 hover:border-accent-300 hover:bg-accent-50 transition-all duration-200">

            <div className="flex flex-col items-center space-y-1">
              <Icon name="Fingerprint" size={24} color="var(--color-accent)" />
              <span className="text-xs text-accent font-medium">Touch ID</span>
            </div>
          </Button>
        }

        {biometricSupport.faceId &&
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleBiometricAuth('faceId')}
          disabled={isLoading}
          className="flex-1 max-w-[120px] h-16 border-2 border-dashed border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">

            <div className="flex flex-col items-center space-y-1">
              <Icon name="ScanFace" size={24} color="var(--color-primary)" />
              <span className="text-xs text-primary font-medium">Face ID</span>
            </div>
          </Button>
        }
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-surface text-text-secondary">Or sign in with password</span>
        </div>
      </div>
    </div>);

};

export default BiometricLogin;