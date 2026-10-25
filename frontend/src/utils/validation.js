/**
 * Client-side form validation.
 * Each function returns an object of { fieldName: 'error message' } — empty means valid.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  return errors;
}

export function validateSignup({ name, email, password, confirmPassword }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Full name is required';
  else if (name.trim().length < 3) errors.name = 'Name must be at least 3 characters';

  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address';

  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';

  if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';
  return errors;
}

export function validateEventForm(form) {
  const errors = {};
  if (!form.title.trim() || form.title.trim().length < 3) errors.title = 'Title must be at least 3 characters';
  if (!form.description.trim()) errors.description = 'Description is required';
  if (!form.date) errors.date = 'Date is required';
  if (!form.time) errors.time = 'Time is required';
  if (!form.location.trim()) errors.location = 'Location is required';
  if (!form.category) errors.category = 'Choose a category';
  const cap = Number(form.capacity);
  if (!Number.isInteger(cap) || cap < 1) errors.capacity = 'Capacity must be a whole number above 0';
  return errors;
}

export const hasErrors = (errors) => Object.keys(errors).length > 0;
