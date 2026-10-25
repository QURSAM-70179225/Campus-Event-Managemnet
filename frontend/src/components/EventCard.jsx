import { Link } from 'react-router-dom';
import { dayAndMonth, formatTime } from '../utils/format.js';

/**
 * Card used in the event list and on the home page.
 * Props: event = { id, title, description, date, time, location, category, capacity, seats_available }
 */
export default function EventCard({ event }) {
  const { day, month } = dayAndMonth(event.date);
  const seats = event.seats_available ?? event.capacity;
  const full = seats <= 0;
  const fewLeft = !full && seats <= Math.max(5, Math.round(event.capacity * 0.1));

  return (
    <article className="event-card">
      <div className={`event-card-top cat-${event.category.toLowerCase()}`}>
        <div className="event-date-chip">
          <span className="event-date-day">{day}</span>
          <span className="event-date-month">{month}</span>
        </div>
        <span className={`badge badge-${event.category.toLowerCase()}`}>{event.category}</span>
      </div>

      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-desc">{event.description}</p>

        <ul className="event-meta">
          <li>
            <span aria-hidden="true">🕒</span> {formatTime(event.time)}
          </li>
          <li>
            <span aria-hidden="true">📍</span> {event.location}
          </li>
        </ul>
      </div>

      <div className="event-card-footer">
        <span className={`seats ${full ? 'seats-full' : fewLeft ? 'seats-low' : ''}`}>
          {full ? 'Fully booked' : `${seats} of ${event.capacity} seats left`}
        </span>
        <Link to={`/events/${event.id}`} className="btn btn-dark btn-sm">
          View details
        </Link>
      </div>
    </article>
  );
}
