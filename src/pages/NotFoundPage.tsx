import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="error-code">404</p>
      <h1>Cette page n'existe pas</h1>
      <p>Le lien demandé est introuvable ou a peut-être été déplacé.</p>
      <Link className="button primary" to="/">Retour au catalogue</Link>
    </section>
  );
}
