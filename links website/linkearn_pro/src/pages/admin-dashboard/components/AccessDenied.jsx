import React, { useEffect } from 'react';

const AccessDenied = () => {
  useEffect(() => {
    // Vibrate device for 300ms if supported
    if (navigator.vibrate) {
      navigator.vibrate(300);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-xl p-8 text-center">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-6"
        >
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="#F44336"
            strokeWidth="8"
            fill="none"
            opacity="0.2"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="#F44336"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="314"
            strokeDashoffset="314"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="314"
              to="0"
              dur="1s"
              fill="freeze"
            />
          </circle>
          <path
            d="M40 40 L80 80"
            stroke="#F44336"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="56.57"
            strokeDashoffset="56.57"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="56.57"
              to="0"
              begin="1s"
              dur="0.3s"
              fill="freeze"
            />
          </path>
          <path
            d="M80 40 L40 80"
            stroke="#F44336"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="56.57"
            strokeDashoffset="56.57"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="56.57"
              to="0"
              begin="1.3s"
              dur="0.3s"
              fill="freeze"
            />
          </path>
        </svg>

        <h2 className="text-2xl font-bold text-text-primary mb-4">Access Denied</h2>
        <p className="text-text-secondary mb-6">You cannot access this page.</p>
      </div>
    </div>
  );
};

export default AccessDenied;
