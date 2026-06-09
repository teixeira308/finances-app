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
import { useAppDispatch, useAppSelector } from './store/hooks';
import { bootstrapTransactions } from './features/transactions/store/transactionsSlice';
import { bootstrapCategories } from './features/categories/store/categoriesSlice';
import { bootstrapRecurringTransactions } from './features/transactions/store/recurringTransactionsSlice';
import { bootstrapOnboarding } from './features/onboarding/store/onboardingSlice';
import { useAuth } from './features/auth/components/AuthProvider';
import { OnboardingGuard } from './navigation/OnboardingGuard';
import { OnboardingScreen } from './features/onboarding/screens/OnboardingScreen';
import { WorkspaceGuard } from './navigation/WorkspaceGuard';
import { WorkspaceSelectionScreen } from './features/workspaces/screens/WorkspaceSelectionScreen';
import { EditWorkspaceScreen } from './features/workspaces/screens/EditWorkspaceScreen';
import { selectActiveWorkspaceId } from './features/workspaces/store/workspaceSlice';
import { InvoicesScreen } from './features/workspaces/screens/InvoicesScreen';
import { InstallmentsScreen } from './features/workspaces/screens/InstallmentsScreen';

function App() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAuth();
  const activeWorkspaceId = useAppSelector(selectActiveWorkspaceId);

  useEffect(() => {
    if (user && activeWorkspaceId) {
      dispatch(bootstrapTransactions(activeWorkspaceId));
      dispatch(bootstrapCategories(activeWorkspaceId));
      dispatch(bootstrapRecurringTransactions(activeWorkspaceId));
      dispatch(bootstrapOnboarding());
    }
  }, [dispatch, user, activeWorkspaceId]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center bg-black" style={{ minHeight: '100dvh', height: '100%' }}>
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
        <Route path="/workspaces" element={<WorkspaceSelectionScreen />} />
        <Route path="/workspaces/:id/edit" element={<EditWorkspaceScreen />} />
        <Route path="*" element={
          <OnboardingGuard>
            <WorkspaceGuard>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<DashboardScreen />} />
                  <Route path="/extrato" element={<ExtractScreen />} />
                  <Route path="/new-transaction" element={<NewTransactionScreen />} />
                  <Route path="/categories" element={<CategoriesScreen />} />
                  <Route path="/reports" element={<ReportsScreen />} />
                  <Route path="/faturas" element={<InvoicesScreen />} />
                  <Route path="/parcelamentos" element={<InstallmentsScreen />} />
                  <Route path="/settings" element={<SettingsScreen />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/security" element={<SecurityScreen />} />
                  <Route path="/privacy" element={<PrivacyScreen />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            </WorkspaceGuard>
          </OnboardingGuard>
        } />
      </Routes>
    </Router>
  );
}

export default App;
