import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import UserDashboard from "pages/user-dashboard";
import LinkCreation from "pages/link-creation";
import AdminDashboard from "pages/admin-dashboard";
import AdminPaymentProcessing from "pages/admin-payment-processing";
import AdminUserManagement from "pages/admin-user-management";
import LinkRedirectSequence from "pages/link-redirect-sequence";
import LinkManagement from "pages/link-management";
import EarningsAnalytics from "pages/earnings-analytics";
import UserRegistration from "pages/user-registration";
import UserLogin from "pages/user-login";
import ResetPassword from "pages/reset-password";
import WithdrawalRequest from "pages/withdrawal-request";
import UserProfileSettings from "pages/user-profile-settings";
import NotFound from "pages/NotFound";
import Verify from "pages/user-verification/Verify";
import AdminLinksManagement from "pages/admin-links-management";
import AdminSettings from "pages/admin-settings";
import ReferralPage from "pages/referral";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<UserDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/withdrawal-request" element={<WithdrawalRequest />} />
        <Route path="/profile" element={<UserProfileSettings />} />
        <Route path="/link-creation" element={<LinkCreation />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-payment-processing" element={<AdminPaymentProcessing />} />
        <Route path="/admin-user-management" element={<AdminUserManagement />} />
        <Route path="/link-redirect-sequence" element={<LinkRedirectSequence />} />
        <Route path="/link-management" element={<LinkManagement />} />
        <Route path="/earnings-analytics" element={<EarningsAnalytics />} />
        <Route path="/verify-email" element={<Verify />} />
        <Route path="/admin-links-management" element={<AdminLinksManagement />} />
        <Route path="/admin-settings" element={<AdminSettings />} />
        <Route path="/refer/:referralCode" element={<ReferralPage />} />
        
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;