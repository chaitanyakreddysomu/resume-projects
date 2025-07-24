import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialRegistration = ({ onSocialRegister, isLoading }) => {
  const socialProviders = [
    {
      name: 'Google',
      icon: 'Chrome',
      color: '#4285f4',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      color: '#1877f2',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      textColor: 'text-blue-600'
    }
  ];

  return (
    <div className="space-y-3">
      {socialProviders.map((provider) => (
        <Button
          key={provider.name}
          variant="outline"
          size="md"
          fullWidth
          onClick={() => onSocialRegister(provider.name.toLowerCase())}
          disabled={isLoading}
          className={`${provider.bgColor} ${provider.textColor} border-border hover:border-gray-300 transition-all duration-200`}
        >
          <div className="flex items-center justify-center space-x-3">
            <Icon 
              name={provider.icon} 
              size={18} 
              color={provider.color}
            />
            <span className="font-medium">Continue with {provider.name}</span>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default SocialRegistration;