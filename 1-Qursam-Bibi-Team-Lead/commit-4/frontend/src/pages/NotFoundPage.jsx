import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="container section empty-state">
      <h1 style={{ fontSize: '4rem', marginBottom: 0 }}>404</h1>
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist or was moved.</p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </main>
  );
}
