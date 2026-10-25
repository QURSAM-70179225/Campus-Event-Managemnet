import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../config.js';
import { api } from '../services/api.js';
import { formatDate, formatTime } from '../utils/format.js';
import { hasErrors, validateEventForm } from '../utils/validation.js';
import '../styles/forms.css';
import '../styles/dashboard.css';
import '../styles/admin.css';

const EMPTY_FORM = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  category: '',
  capacity: '',
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const loadEvents = () =>
    api
      .getEvents()
      .then(setEvents)
      .catch((err) => setMessage({ type: 'error', text: err.message }))
      .finally(() => setLoading(false));

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  function startEdit(event) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      capacity: String(event.capacity),
    });
    setErrors({});
    setMessage({ type: '', text: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateEventForm(form);
    setErrors(found);
    if (hasErrors(found)) return;

    const payload = { ...form, capacity: Number(form.capacity) };
    setSaving(true);
    try {
      if (editingId) {
        await api.updateEvent(editingId, payload);
        setMessage({ type: 'success', text: 'Event updated successfully.' });
      } else {
        await api.createEvent(payload);
        setMessage({ type: 'success', text: 'Event created successfully.' });
      }
      resetForm();
      await loadEvents();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(event) {
    const ok = window.confirm(
      `Delete "${event.title}"?\nThis also removes its ${event.registered} registration(s).`
    );
    if (!ok) return;
    try {
      await api.deleteEvent(event.id);
      setMessage({ type: 'success', text: 'Event deleted.' });
      if (editingId === event.id) resetForm();
      await loadEvents();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  }

  const fieldClass = (name) => `form-group ${errors[name] ? 'has-error' : ''}`;
  const fieldError = (name) => errors[name] && <span className="field-error">{errors[name]}</span>;

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1>Manage Events</h1>
          <p>Create, update and delete campus events.</p>
        </div>
      </section>

      <section className="container section admin-layout">
        <div className="admin-form-card">
          <h2>{editingId ? 'Edit event' : 'Create a new event'}</h2>

          {message.text && (
            <div className={`alert alert-${message.type === 'error' ? 'error' : 'success'}`}>{message.text}</div>
          )}

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className={fieldClass('title')}>
              <label htmlFor="title">Title</label>
              <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. AI Workshop" />
              {fieldError('title')}
            </div>

            <div className={fieldClass('description')}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What will happen at this event?"
              />
              {fieldError('description')}
            </div>

            <div className="form-row">
              <div className={fieldClass('date')}>
                <label htmlFor="date">Date</label>
                <input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
                {fieldError('date')}
              </div>
              <div className={fieldClass('time')}>
                <label htmlFor="time">Time</label>
                <input id="time" name="time" type="time" value={form.time} onChange={handleChange} />
                {fieldError('time')}
              </div>
            </div>

            <div className={fieldClass('location')}>
              <label htmlFor="location">Location</label>
              <input id="location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Main Auditorium" />
              {fieldError('location')}
            </div>

            <div className="form-row">
              <div className={fieldClass('category')}>
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {fieldError('category')}
              </div>
              <div className={fieldClass('capacity')}>
                <label htmlFor="capacity">Capacity</label>
                <input id="capacity" name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} />
                {fieldError('capacity')}
              </div>
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Update event' : 'Create event'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="dash-panel">
          <h2>All events ({events.length})</h2>
          {loading ? (
            <div className="spinner" />
          ) : events.length === 0 ? (
            <p className="empty-state">No events yet. Create the first one!</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Seats</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.id} className={editingId === ev.id ? 'is-editing' : ''}>
                      <td data-label="Event">
                        <Link to={`/events/${ev.id}`} className="table-title">
                          {ev.title}
                        </Link>
                        <span className={`badge badge-${ev.category.toLowerCase()}`}>{ev.category}</span>
                        <small className="muted-block">{ev.location}</small>
                      </td>
                      <td data-label="Date">
                        {formatDate(ev.date)}
                        <small className="muted-block">{formatTime(ev.time)}</small>
                      </td>
                      <td data-label="Seats">
                        {ev.registered}/{ev.capacity}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-outline btn-sm" onClick={() => startEdit(ev)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ev)}>
                            Delete
                          </button>
                        </div>
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
