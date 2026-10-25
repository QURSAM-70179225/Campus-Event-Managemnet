/**
 * Server entry point: seeds sample data on first run and starts listening.
 */
require('dotenv').config();
const app = require('./app');
const { seedDatabase } = require('./database/seed');

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set. Using an insecure development secret.');
}

seedDatabase({ silent: false });

app.listen(PORT, () => {
  console.log(`Campus Event API running on http://localhost:${PORT}`);
});
