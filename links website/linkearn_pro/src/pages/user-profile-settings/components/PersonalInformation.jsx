import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import API_BASE_URL from 'utils/config';

const PersonalInformation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    verified: false
  });
  

  const [originalData, setOriginalData] = useState({ ...formData });

  useEffect(() => {
    if (message.text) {
      const timeout = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
  
      return () => clearTimeout(timeout);
    }
  }, [message]);
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        const token = user?.token;
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          console.error('Failed to fetch profile:', res.status);
          return;
        }

        const data = await res.json();

        const formattedData = {
          firstName: data.firstname || '',
          lastName: data.lastname || '',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || '',
          verified: data.verified || false
        };
        

        setFormData(formattedData);
        setOriginalData(formattedData);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) throw new Error("User not found in localStorage");

      const user = JSON.parse(storedUser);
      const token = user?.token;
      if (!token) throw new Error("Token not found");

      const requestBody = {
        firstname: formData.firstName,
        lastname: formData.lastName
        // phone removed
      };

      const res = await fetch(`${API_BASE_URL}/api/user/profile/personal`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      await res.json();
      setOriginalData({ ...formData });
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Failed to save:', error.message);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const hasChanges =
    formData.firstName !== originalData.firstName ||
    formData.lastName !== originalData.lastName;
    // phone removed from hasChanges

  const getInitials = () => {
    const f = formData.firstName?.[0] || '';
    const l = formData.lastName?.[0] || '';
    return (f + l).toUpperCase() || '--';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Personal Information</h2>
          <p className="text-sm text-text-secondary">Update your personal details and profile information</p>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" iconName="Edit" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconName="Save"
              onClick={handleSave}
              loading={isSaving}
              disabled={!hasChanges}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* ✅ Message */}
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


      {/* ✅ Initials Avatar */}
      <div className="mb-8">
        {/* <label className="block text-sm font-medium text-text-primary mb-3">
          Profile Initials
        </label> */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-100 text-primary rounded-full flex items-center justify-center text-xl font-semibold uppercase">
            {getInitials()}
          </div>
          <div>
            <p className="text-sm text-text-primary font-medium flex items-center space-x-2">
              <span>{formData.firstName} {formData.lastName}</span>
              {formData.role && (
                <span className="inline-flex uppercase items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary">
                  {formData.role}
                </span>
              )}
            </p>
            <p className="text-xs text-text-secondary">{formData.email}</p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="First Name *" value={formData.firstName} field="firstName" isEditing={isEditing} onChange={handleInputChange} />
          <InputField label="Last Name *" value={formData.lastName} field="lastName" isEditing={isEditing} onChange={handleInputChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Email Address *" value={formData.email} field="email" isEditing={false} onChange={handleInputChange} />
        </div>

        {/* Verified Status */}
        <div className="pt-4 border-t">
          <h3 className="text-base font-medium text-text-primary mb-4">Account Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.verified ? (
              <div className="flex items-center p-3 bg-success-50 border border-success-200 rounded-lg">
                <Icon name="CheckCircle" size={20} color="var(--color-success)" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-success-800">Email Verified</p>
                  {/* <p className="text-xs text-success-600">Verified ✔</p> */}
                </div>
              </div>
            ) : (
              <div className="flex items-center p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <Icon name="AlertCircle" size={20} color="var(--color-warning)" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-warning-800">Email Not Verified</p>
                  <p className="text-xs text-warning-600">Please verify your email</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, field, isEditing, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-text-primary mb-2">{label}</label>
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      disabled={!isEditing}
      className={!isEditing ? 'bg-gray-50' : ''}
    />
  </div>
);

export default PersonalInformation;
