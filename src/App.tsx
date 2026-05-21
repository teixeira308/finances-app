import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import DashboardScreen from './screens/DashboardScreen';
import ExtractScreen from './screens/ExtractScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import NewTransactionScreen from './screens/NewTransactionScreen';
import ReportsScreen from './screens/ReportsScreen';
import Navigation from './navigation';
import { ScrollToTop } from './shared/components/ScrollToTop';
import { useAppDispatch } from './store/hooks';
import { bootstrapTransactions } from './features/transactions/store/transactionsSlice';
import { bootstrapCategories } from './features/categories/store/categoriesSlice';
import { useAuth } from './features/auth/components/AuthProvider';

function App() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      dispatch(bootstrapTransactions());
      dispatch(bootstrapCategories());
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
      <div className="min-vh-100 bg-black text-white" style={{ paddingBottom: '100px' }}>
        <Routes>
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/extrato" element={<ExtractScreen />} />
          <Route path="/new-transaction" element={<NewTransactionScreen />} />
          <Route path="/categories" element={<CategoriesScreen />} />
          <Route path="/reports" element={<ReportsScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
