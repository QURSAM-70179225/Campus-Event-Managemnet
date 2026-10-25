import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { formatDate, formatTime } from '../utils/format.js';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!user) return;
    api
      .getRegistrations()
      .then(setRegistrations)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <Navigate to="/login" replace state={{ from: '/dashboard' }} />;

  async function cancel(reg) {
    if (!window.confirm(`Cancel registration for "${reg.event_title}"?`)) return;
    try {
      await api.cancelRegistration(reg.id);
      setRegistrations((list) => list.filter((r) => r.id !== reg.id));
      setMessage('Registration cancelled.');
    } catch (err) {
      setError(err.message);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = registrations.filter((r) => r.event_date >= today).length;
  const students = new Set(registrations.map((r) => r.user_id)).size;

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1>{isAdmin ? 'Admin Dashboard' : 'My Dashboard'}</h1>
          <p>
            Signed in as <strong>{user.name}</strong> ({user.email}) · {isAdmin ? 'Administrator' : 'Student'}
          </p>
        </div>
      </section>

      <section className="container section dashboard">
        <div className="dash-stats">
          <div className="dash-stat">
            <span>{isAdmin ? 'Total registrations' : 'My registrations'}</span>
            <strong>{loading ? '—' : registrations.length}</strong>
          </div>
          <div className="dash-stat">
            <span>Upcoming</span>
            <strong>{loading ? '—' : upcoming}</strong>
          </div>
          {isAdmin ? (
            <div className="dash-stat">
              <span>Students registered</span>
              <strong>{loading ? '—' : students}</strong>
            </div>
          ) : (
            <Link to="/events" className="dash-stat dash-stat-link">
              <span>Find more</span>
              <strong>Browse events →</strong>
            </Link>
          )}
        </div>


        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="dash-panel">
          <h2>{isAdmin ? 'All student registrations' : 'My registered events'}</h2>

          {loading ? (
            <div className="spinner" />
          ) : registrations.length === 0 ? (
            <div className="empty-state">
              <p>{isAdmin ? 'No registrations yet.' : "You haven't registered for any events yet."}</p>
              {!isAdmin && (
                <Link to="/events" className="btn btn-primary">
                  Explore events
                </Link>
              )}
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Event</th>
                    {isAdmin && <th>Student</th>}
                    <th>Date &amp; time</th>
                    <th>Location</th>
                    <th>Registered on</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r) => (
                    <tr key={r.id}>
                      <td data-label="Event">
                        <Link to={`/events/${r.event_id}`} className="table-title">
                          {r.event_title}
                        </Link>
                        <span className={`badge badge-${r.event_category.toLowerCase()}`}>{r.event_category}</span>
                      </td>
                      {isAdmin && (
                        <td data-label="Student">
                          {r.student_name}
                          <small className="muted-block">{r.student_email}</small>
                        </td>
                      )}
                      <td data-label="Date & time">
                        {formatDate(r.event_date)}
                        <small className="muted-block">{formatTime(r.event_time)}</small>
                      </td>
                      <td data-label="Location">{r.event_location}</td>
                      <td data-label="Registered on">{formatDate(r.registration_date.slice(0, 10))}</td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => cancel(r)}>
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
