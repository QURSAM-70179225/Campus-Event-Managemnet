import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { formatDate, formatTime } from '../utils/format.js';
import '../styles/details.css';
import '../styles/forms.css';

export default function EventDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [registration, setRegistration] = useState(null); // existing registration of this user
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const loadEvent = () =>
    api
      .getEvent(id)
      .then(setEvent)
      .catch((err) => setError(err.status === 404 ? 'This event does not exist.' : err.message));

  useEffect(() => {
    setLoading(true);
    loadEvent().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Check if the logged-in student already registered for this event
  useEffect(() => {
    if (!user) return setRegistration(null);
    api
      .getRegistrations()
      .then((list) => setRegistration(list.find((r) => r.event_id === Number(id) && r.user_id === user.id) || null))
      .catch(() => setRegistration(null));
  }, [user, id]);

  async function handleRegister(e) {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (!agree) {
      setFormError('Please confirm that you will attend the event.');
      return;
    }

    setSubmitting(true);
    try {
      const { registration } = await api.registerForEvent(Number(id));
      setRegistration(registration);
      setSuccess('You are registered! See all your events on the dashboard.');
      await loadEvent(); // refresh available seats
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel() {
    setSubmitting(true);
    setFormError('');
    try {
      await api.cancelRegistration(registration.id);
      setRegistration(null);
      setSuccess('Your registration was cancelled.');
      setAgree(false);
      await loadEvent();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="spinner" aria-label="Loading event" />;

  if (error) {
    return (
      <main className="container section">
        <div className="alert alert-error">{error}</div>
        <Link to="/events" className="btn btn-outline">
          ← Back to events
        </Link>
      </main>
    );
  }

  const full = event.seats_available <= 0;
  const percent = Math.min(100, Math.round((event.registered / event.capacity) * 100));

  return (
    <main>
      <section className={`details-hero cat-${event.category.toLowerCase()}`}>
        <div className="container">
          <Link to="/events" className="back-link">
            ← All events
          </Link>
          <span className="badge details-badge">{event.category}</span>
          <h1>{event.title}</h1>
          <ul className="details-meta">
            <li>📅 {formatDate(event.date)}</li>
            <li>🕒 {formatTime(event.time)}</li>
            <li>📍 {event.location}</li>
          </ul>
        </div>
      </section>

      <section className="container details-layout">
        <article className="details-main">
          <h2>About this event</h2>
          <p className="details-description">{event.description}</p>

          <div className="details-facts">
            <div>
              <span>Date</span>
              <strong>{formatDate(event.date)}</strong>
            </div>
            <div>
              <span>Time</span>
              <strong>{formatTime(event.time)}</strong>
            </div>
            <div>
              <span>Location</span>
              <strong>{event.location}</strong>
            </div>
            <div>
              <span>Category</span>
              <strong>{event.category}</strong>
            </div>
          </div>
        </article>

        <aside className="register-card">
          <div className="seat-info">
            <div className="seat-numbers">
              <strong className={full ? 'seats-full' : ''}>{Math.max(0, event.seats_available)}</strong>
              <span>of {event.capacity} seats available</span>
            </div>
            <div className="progress" aria-label={`${percent}% booked`}>
              <div className="progress-bar" style={{ width: `${percent}%` }} />
            </div>
          </div>

          {success && <div className="alert alert-success">{success}</div>}
          {formError && <div className="alert alert-error">{formError}</div>}

          {!user ? (
            <div className="register-login">
              <p>Log in as a student to register for this event.</p>
              <Link to="/login" state={{ from: location.pathname }} className="btn btn-primary btn-block">
                Login to register
              </Link>
              <Link to="/signup" state={{ from: location.pathname }} className="btn btn-outline btn-block">
                Create an account
              </Link>
            </div>
          ) : registration ? (
            <div className="registered-box">
              <p className="registered-label">✅ You are registered for this event</p>
              <button className="btn btn-outline btn-block" onClick={handleCancel} disabled={submitting}>
                {submitting ? 'Cancelling…' : 'Cancel registration'}
              </button>
              <Link to="/dashboard" className="btn btn-dark btn-block">
                Go to dashboard
              </Link>
            </div>
          ) : (
            <form className="form" onSubmit={handleRegister} noValidate>
              <h3>Student registration</h3>
              <div className="form-group">
                <label htmlFor="reg-name">Name</label>
                <input id="reg-name" value={user.name} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="reg-email">Email</label>
                <input id="reg-email" value={user.email} readOnly />
              </div>
              <label className="checkbox">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                I confirm I will attend this event
              </label>
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting || full}>
                {full ? 'Event is full' : submitting ? 'Registering…' : 'Register now'}
              </button>
            </form>
          )}
        </aside>
      </section>
    </main>
  );
}
