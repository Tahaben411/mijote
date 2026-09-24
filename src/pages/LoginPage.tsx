import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/api';

interface LocationState {
  from?: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from ?? '/';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login({ username, password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 400) {
        setError('Identifiants incorrects. Vérifiez vos informations puis réessayez.');
      } else {
        setError('Impossible de contacter le service de connexion. Réessayez plus tard.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="form-card narrow-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Espace membre</p>
        <h1>Connexion</h1>
        <p className="muted">Connectez-vous pour proposer une recette.</p>

        {error && <div className="inline-error" role="alert">{error}</div>}

        <label className="field stacked-field">
          <span>Nom d'utilisateur</span>
          <input autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>

        <label className="field stacked-field">
          <span>Mot de passe</span>
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        <button className="button primary full-width" type="submit" disabled={submitting}>
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>

        <p className="test-account">Compte de test : <strong>emilys</strong> / <strong>emilyspass</strong></p>
      </form>
    </section>
  );
}
