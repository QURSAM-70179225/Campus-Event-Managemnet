import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { hasErrors, validateSignup } from '../utils/validation.js';
import '../styles/forms.css';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/events';

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    const found = validateSignup(form);
    setErrors(found);
    if (hasErrors(found)) return;

    setSubmitting(true);
    try {
      await signup(form.name.trim(), form.email.trim(), form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const field = (name, label, type = 'text', props = {}) => (
    <div className={`form-group ${errors[name] ? 'has-error' : ''}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={form[name]} onChange={handleChange} {...props} />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="auth-subtitle">Student registration — takes less than a minute.</p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form className="form" onSubmit={handleSubmit} noValidate>
          {field('name', 'Full name', 'text', { placeholder: 'e.g. Ayesha Khan', autoComplete: 'name' })}
          {field('email', 'University email', 'email', { placeholder: 'you@uol.edu.pk', autoComplete: 'email' })}
          {field('password', 'Password', 'password', { placeholder: 'At least 6 characters', autoComplete: 'new-password' })}
          {field('confirmPassword', 'Confirm password', 'password', { placeholder: 'Type it again', autoComplete: 'new-password' })}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login" state={location.state}>Login</Link>
        </p>
      </div>
    </main>
  );
}
