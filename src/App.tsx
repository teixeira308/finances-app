import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardScreen from './screens/DashboardScreen';
import ExtractScreen from './screens/ExtractScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import Navigation from './navigation';
import { useAuth } from './features/auth/components/AuthProvider';
import { useAppDispatch } from './store/hooks';
import { bootstrapTransactions } from './features/transactions/store/transactionsSlice';
import { bootstrapCategories } from './features/categories/store/categoriesSlice';

function App() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  // Carrega os dados apenas quando o usuário está autenticado
  useEffect(() => {
    if (user) {
      dispatch(bootstrapTransactions());
      dispatch(bootstrapCategories());
    }
  }, [user, dispatch]);

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <Router>
      <div className="pb-20">
        <Routes> 
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/extrato" element={<ExtractScreen />} />
          <Route path="/categories" element={<CategoriesScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
