import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import './index.css';
import { AuthProvider } from './features/auth/components/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <main className="dark text-foreground bg-background min-h-screen">
          <App />
        </main>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
