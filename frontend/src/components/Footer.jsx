import { Link } from 'react-router-dom';
import { CATEGORIES, UNIVERSITY_NAME } from '../config.js';
import '../styles/footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3 className="footer-title">Campus Events</h3>
          <p className="footer-text">
            One place to discover seminars, workshops, sports, competitions, conferences and
            society activities at {UNIVERSITY_NAME}.
          </p>
        </div>

        <div>
          <h4 className="footer-heading">Quick links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">All events</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Create account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Categories</h4>
          <ul className="footer-links">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link to={`/events?category=${c}`}>{c}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Contact</h4>
          <ul className="footer-links footer-contact">
            <li>1-KM Defence Road, Lahore</li>
            <li>Student Affairs Office</li>
            <li>Mon – Fri, 9:00 AM – 5:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          © {year} Campus Event Management System · Built by Team Campus Events, {UNIVERSITY_NAME}
        </div>
      </div>
    </footer>
  );
}
