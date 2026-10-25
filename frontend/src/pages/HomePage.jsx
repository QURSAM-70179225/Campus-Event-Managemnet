import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard.jsx';
import { API_URL, CATEGORIES, UNIVERSITY_NAME } from '../config.js';
import '../styles/home.css';
import '../styles/events.css';

const CATEGORY_INFO = {
  Seminar: { icon: '🎤', text: 'Talks by experts and alumni' },
  Workshop: { icon: '🛠️', text: 'Hands-on skill building' },
  Sports: { icon: '🏏', text: 'Tournaments and matches' },
  Competition: { icon: '🏆', text: 'Contests with prizes' },
  Conference: { icon: '🎓', text: 'Research and innovation' },
  Society: { icon: '🎭', text: 'Student society activities' },
};

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Events come from the backend API, not hard-coded
    fetch(`${API_URL}/api/events`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load events');
        return res.json();
      })
      .then(setEvents)
      .catch(() => setError('Could not load events. Make sure the backend server is running.'))
      .finally(() => setLoading(false));
  }, []);

  const featured = events.slice(0, 3);
  const totalSeats = events.reduce((sum, e) => sum + (e.seats_available ?? 0), 0);

  return (
    <main>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-eyebrow">{UNIVERSITY_NAME}</span>
            <h1>
              Never miss what&apos;s happening <span className="highlight">on campus</span>
            </h1>
            <p>
              Discover seminars, workshops, sports, competitions, conferences and society events —
              and reserve your seat in a few clicks.
            </p>
            <div className="hero-actions">
              <Link to="/events" className="btn btn-primary">
                Browse events
              </Link>
              <Link to="/login" className="btn btn-outline hero-btn-light">
                Login
              </Link>
              <Link to="/signup" className="btn btn-outline hero-btn-light">
                Register
              </Link>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <strong>{loading ? '—' : events.length}</strong>
              <span>Upcoming events</span>
            </div>
            <div className="stat">
              <strong>{CATEGORIES.length}</strong>
              <span>Categories</span>
            </div>
            <div className="stat">
              <strong>{loading ? '—' : totalSeats}</strong>
              <span>Seats available</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Explore by category</h2>
            <p>Pick what interests you</p>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/events?category=${cat}`}
                className={`category-tile tile-${cat.toLowerCase()}`}
              >
                <span className="category-icon" aria-hidden="true">
                  {CATEGORY_INFO[cat].icon}
                </span>
                <strong>{cat}</strong>
                <small>{CATEGORY_INFO[cat].text}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Featured events ---------- */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head section-head-row">
            <div>
              <h2>Featured events</h2>
              <p>Coming up soon — register before seats run out</p>
            </div>
            <Link to="/events" className="btn btn-outline">
              View all events →
            </Link>
          </div>

          {loading && <div className="spinner" aria-label="Loading" />}
          {error && <div className="alert alert-error">{error}</div>}
          {!loading && !error && featured.length === 0 && (
            <p className="empty-state">No upcoming events yet.</p>
          )}

          <div className="events-grid">
            {featured.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>How it works</h2>
          </div>
          <ol className="steps">
            <li>
              <span className="step-num">1</span>
              <h3>Create your account</h3>
              <p>Sign up with your name and university email.</p>
            </li>
            <li>
              <span className="step-num">2</span>
              <h3>Find an event</h3>
              <p>Search by name or filter by category.</p>
            </li>
            <li>
              <span className="step-num">3</span>
              <h3>Reserve your seat</h3>
              <p>Register in one click and track it on your dashboard.</p>
            </li>
          </ol>
        </div>
      </section>
    </main>
  );
}
