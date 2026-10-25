/**
 * Central error handling.
 * - notFound: unknown routes -> 404 JSON
 * - errorHandler: any thrown error -> JSON with a sensible status code
 */

function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Invalid JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }

  // SQLite constraint errors
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
    return res.status(409).json({ error: 'This record already exists' });
  }
  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    return res.status(400).json({ error: 'Related record does not exist' });
  }
  if (err.code && String(err.code).startsWith('SQLITE_CONSTRAINT')) {
    return res.status(400).json({ error: 'Data violates a database rule' });
  }

  const status = err.status || 500;
  if (status >= 500 && process.env.NODE_ENV !== 'test') {
    console.error(err);
  }
  res.status(status).json({ error: status >= 500 ? 'Internal server error' : err.message });
}

/** Helper to create errors with an HTTP status: throw httpError(404, 'Event not found') */
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

module.exports = { notFound, errorHandler, httpError };
