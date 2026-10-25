import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark" aria-hidden="true">UOL</span>
          <span className="brand-text">
            Campus Events
            <small>The University of Lahore</small>
          </span>
        </Link>

        <button
          className={`nav-toggle ${open ? 'is-open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-menu ${open ? 'is-open' : ''}`}>
          <NavLink to="/" end onClick={close}>
            Home
          </NavLink>
          <NavLink to="/events" onClick={close}>
            Events
          </NavLink>
          {user && (
            <NavLink to="/dashboard" onClick={close}>
              Dashboard
            </NavLink>
          )}

          <div className="nav-actions">
            {user ? (
              <>
                <span className="nav-user" title={user.email}>
                  Hi, {user.name.split(' ')[0]}
                </span>
                <button className="btn btn-outline btn-sm nav-btn-light" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm nav-btn-light" onClick={close}>
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm" onClick={close}>
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
