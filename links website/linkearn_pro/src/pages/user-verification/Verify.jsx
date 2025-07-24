import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from 'utils/config';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/verify/${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          setTimeout(() => navigate('/user-login'), 2000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('An error occurred.');
        console.error('Verification error:', err);
      }
    };
    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === 'verifying' && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying your email...</h2>
            <p className="text-gray-600">{message || 'Please wait while we confirm your account.'}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6">
              {/* Updated Animated Tick SVG */}
              <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="50"
                        stroke="#4CAF50" strokeWidth="8"
                        fill="none" opacity="0.2"/>
                <circle cx="60" cy="60" r="50"
                        stroke="#4CAF50" strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="314"
                        strokeDashoffset="314">
                  <animate attributeName="stroke-dashoffset"
                           from="314" to="0"
                           dur="1s" fill="freeze" />
                </circle>
                <path d="M43 65 L55 77"
                      stroke="#4CAF50" strokeWidth="8"
                      fill="none" strokeLinecap="round"
                      strokeDasharray="20" strokeDashoffset="20">
                  <animate attributeName="stroke-dashoffset"
                           from="20" to="0"
                           begin="1s" dur="0.25s" fill="freeze" />
                </path>
                <path d="M55 77 L80 45"
                      stroke="#4CAF50" strokeWidth="8"
                      fill="none" strokeLinecap="round"
                      strokeDasharray="44" strokeDashoffset="44">
                  <animate attributeName="stroke-dashoffset"
                           from="44" to="0"
                           begin="1.25s" dur="0.35s" fill="freeze" />
                </path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">{message}</h2>
            <p className="text-gray-600">Redirecting to login...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-6">
              {/* Animated Red Cross SVG */}
              <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="50"
                        stroke="#F44336" strokeWidth="8"
                        fill="none" opacity="0.2"/>
                <circle cx="60" cy="60" r="50"
                        stroke="#F44336" strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="314"
                        strokeDashoffset="314">
                  <animate attributeName="stroke-dashoffset"
                           from="314" to="0"
                           dur="1s" fill="freeze" />
                </circle>
                <path d="M40 40 L80 80"
                      stroke="#F44336" strokeWidth="8"
                      fill="none" strokeLinecap="round"
                      strokeDasharray="56.57" strokeDashoffset="56.57">
                  <animate attributeName="stroke-dashoffset"
                           from="56.57" to="0"
                           begin="1s" dur="0.3s" fill="freeze" />
                </path>
                <path d="M80 40 L40 80"
                      stroke="#F44336" strokeWidth="8"
                      fill="none" strokeLinecap="round"
                      strokeDasharray="56.57" strokeDashoffset="56.57">
                  <animate attributeName="stroke-dashoffset"
                           from="56.57" to="0"
                           begin="1.3s" dur="0.3s" fill="freeze" />
                </path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">{message}</h2>
            <p className="text-gray-600">Please try verifying again later.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;
