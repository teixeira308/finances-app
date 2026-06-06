import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import DashboardScreen from './screens/DashboardScreen';
import ExtractScreen from './screens/ExtractScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SecurityScreen from './screens/SecurityScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import LoginScreen from './screens/LoginScreen';
import NewTransactionScreen from './screens/NewTransactionScreen';
import ReportsScreen from './screens/ReportsScreen';
import FullReportsScreen from './screens/FullReportsScreen';
import { MainLayout } from './shared/components/MainLayout';
import { ScrollToTop } from './shared/components/ScrollToTop';
import { useAppDispatch } from './store/hooks';
import { bootstrapTransactions } from './features/transactions/store/transactionsSlice';
import { bootstrapCategories } from './features/categories/store/categoriesSlice';
import { bootstrapRecurringTransactions } from './features/transactions/store/recurringTransactionsSlice';
import { bootstrapOnboarding } from './features/onboarding/store/onboardingSlice';
import { useAuth } from './features/auth/components/AuthProvider';
import { OnboardingGuard } from './navigation/OnboardingGuard';
import { OnboardingScreen } from './features/onboarding/screens/OnboardingScreen';

function App() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      dispatch(bootstrapTransactions());
      dispatch(bootstrapCategories());
      dispatch(bootstrapRecurringTransactions());
      dispatch(bootstrapOnboarding());
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-black">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/full-reports" element={<FullReportsScreen />} />
        <Route path="*" element={
          <OnboardingGuard>
            <MainLayout>
              <Routes>
                <Route path="/" element={<DashboardScreen />} />
                <Route path="/extrato" element={<ExtractScreen />} />
                <Route path="/new-transaction" element={<NewTransactionScreen />} />
                <Route path="/categories" element={<CategoriesScreen />} />
                <Route path="/reports" element={<ReportsScreen />} />
                <Route path="/settings" element={<SettingsScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/security" element={<SecurityScreen />} />
                <Route path="/privacy" element={<PrivacyScreen />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          </OnboardingGuard>
        } />
      </Routes>
    </Router>
  );
}

export default App;
