import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HeroUIProvider } from '@heroui/react';
import App from './App';
import { store } from './store';
import './index.css';
import { AuthProvider } from './features/auth/components/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HeroUIProvider>
        <AuthProvider>
          <main className="dark text-foreground bg-background min-h-screen">
            <App />
          </main>
        </AuthProvider>
      </HeroUIProvider>
    </Provider>
  </React.StrictMode>
);
