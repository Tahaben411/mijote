import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import { ShoppingListProvider } from './context/ShoppingListContext';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ShoppingListProvider>
          <App />
        </ShoppingListProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
