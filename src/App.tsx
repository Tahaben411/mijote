import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';

const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const RecipePage = lazy(() => import('./pages/RecipePage'));
const ShoppingListPage = lazy(() => import('./pages/ShoppingListPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NewRecipePage = lazy(() => import('./pages/NewRecipePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/recettes/:id" element={<RecipePage />} />
          <Route path="/courses" element={<ShoppingListPage />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route
            path="/proposer"
            element={
              <ProtectedRoute>
                <NewRecipePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
