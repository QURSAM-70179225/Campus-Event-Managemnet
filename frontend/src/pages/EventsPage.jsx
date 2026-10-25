import { useEffect, useState } from 'react';
import EventCard from '../components/EventCard.jsx';
import { API_URL } from '../config.js';
import '../styles/events.css';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load all events from the backend API
    fetch(`${API_URL}/api/events`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load events');
        return res.json();
      })
      .then(setEvents)
      .catch(() => setError('Could not load events. Make sure the backend server is running.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1>Upcoming Events</h1>
          <p>Find something you love and reserve your seat.</p>
        </div>
      </section>

      <section className="container section">
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="spinner" aria-label="Loading events" />
        ) : (
          <>
            <p className="results-count">Showing {events.length} events</p>
            <div className="events-grid">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
