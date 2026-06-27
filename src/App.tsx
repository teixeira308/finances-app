import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { MainLayout } from './shared/components/MainLayout';
import { ScrollToTop } from './shared/components/ScrollToTop';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { bootstrapTransactions } from './features/transactions/store/transactionsSlice';
import { bootstrapCategories } from './features/categories/store/categoriesSlice';
import { bootstrapRecurringTransactions } from './features/transactions/store/recurringTransactionsSlice';
import { bootstrapGoals } from './features/settings/store/goalsSlice';
import { bootstrapOnboarding, bootstrapTransactionGuide } from './features/onboarding/store/onboardingSlice';
import { bootstrapTerms } from './features/terms/store/termsSlice';
import { TermsGuard } from './navigation/TermsGuard';
import { useAuth } from './features/auth/components/AuthProvider';
import { OnboardingGuard } from './navigation/OnboardingGuard';
import { WorkspaceGuard } from './navigation/WorkspaceGuard';
import { selectActiveWorkspaceId } from './features/workspaces/store/workspaceSlice';

const DashboardScreen = lazy(() => import('./screens/DashboardScreen'));
const ExtractScreen = lazy(() => import('./screens/ExtractScreen'));
const CategoriesScreen = lazy(() => import('./screens/CategoriesScreen'));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const SecurityScreen = lazy(() => import('./screens/SecurityScreen'));
const PrivacyScreen = lazy(() => import('./screens/PrivacyScreen'));
const TermsOfUseScreen = lazy(() => import('./screens/TermsOfUseScreen'));
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const NewTransactionScreen = lazy(() => import('./screens/NewTransactionScreen'));
const ReportsScreen = lazy(() => import('./screens/ReportsScreen'));
const FullReportsScreen = lazy(() => import('./screens/FullReportsScreen'));
const OnboardingScreen = lazy(() => import('./features/onboarding/screens/OnboardingScreen').then(m => ({ default: m.OnboardingScreen })));
const WorkspaceSelectionScreen = lazy(() => import('./features/workspaces/screens/WorkspaceSelectionScreen').then(m => ({ default: m.WorkspaceSelectionScreen })));
const EditWorkspaceScreen = lazy(() => import('./features/workspaces/screens/EditWorkspaceScreen').then(m => ({ default: m.EditWorkspaceScreen })));
const InvoicesScreen = lazy(() => import('./features/workspaces/screens/InvoicesScreen').then(m => ({ default: m.InvoicesScreen })));
const InstallmentsScreen = lazy(() => import('./features/workspaces/screens/InstallmentsScreen').then(m => ({ default: m.InstallmentsScreen })));

function PageLoader() {
  return (
    <div className="d-flex align-items-center justify-content-center bg-black" style={{ minHeight: '100dvh', height: '100%' }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );
}

function App() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAuth();
  const activeWorkspaceId = useAppSelector(selectActiveWorkspaceId);

  useEffect(() => {
    if (user && activeWorkspaceId) {
      dispatch(bootstrapTransactions(activeWorkspaceId));
      dispatch(bootstrapCategories(activeWorkspaceId));
      dispatch(bootstrapRecurringTransactions(activeWorkspaceId));
      dispatch(bootstrapGoals(activeWorkspaceId));
    }
  }, [dispatch, user, activeWorkspaceId]);

  useEffect(() => {
    if (user) {
      dispatch(bootstrapOnboarding());
      dispatch(bootstrapTransactionGuide());
      dispatch(bootstrapTerms());
    }
  }, [dispatch, user]);

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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/termos" element={<TermsOfUseScreen />} />
          <Route path="/workspaces" element={<WorkspaceSelectionScreen />} />
          <Route path="/workspaces/:id/edit" element={<EditWorkspaceScreen />} />
          <Route path="*" element={
            <OnboardingGuard>
              <TermsGuard>
              <WorkspaceGuard>
                <MainLayout>
                  <Suspense fallback={<PageLoader />}>
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
                  </Suspense>
                </MainLayout>
              </WorkspaceGuard>
              </TermsGuard>
            </OnboardingGuard>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
