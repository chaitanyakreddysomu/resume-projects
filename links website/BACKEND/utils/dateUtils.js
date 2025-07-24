/**
 * Date utilities for IST timezone handling
 */

// Convert current time to IST
const getISTTime = () => {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istTime = new Date(utc + 5.5 * 60 * 60 * 1000);
  return istTime;
};

// Get current IST time as ISO string
const getISTISOString = (offsetMs = 0) => {
  const now = new Date();
  // Convert to IST (UTC+5:30) and add offset
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istTime = new Date(utc + 5.5 * 60 * 60 * 1000 + offsetMs);
  return istTime.toISOString();
};

// Get current IST date as YYYY-MM-DD string
const getISTDateString = () => {
  return getISTTime().toISOString().split('T')[0];
};

// Convert any date to IST
const convertToIST = (date) => {
  if (!date) return null;
  const dateObj = new Date(date);
  const utc = dateObj.getTime() + dateObj.getTimezoneOffset() * 60000;
  const istTime = new Date(utc + 5.5 * 60 * 60 * 1000);
  return istTime;
};

// Format date for display in IST
const formatISTDate = (date, options = {}) => {
  const istDate = convertToIST(date);
  if (!istDate) return 'Invalid Date';
  
  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  };
  
  return istDate.toLocaleDateString('en-IN', { ...defaultOptions, ...options });
};

module.exports = {
  getISTTime,
  getISTISOString,
  getISTDateString,
  convertToIST,
  formatISTDate
}; 