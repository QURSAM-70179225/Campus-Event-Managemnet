# Backend — Campus Event Management API

Node.js + Express REST API with an SQLite database and JWT authentication.

## Run locally

```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev               # http://localhost:5000
```

On the first start the database file `database/campus_events.db` is created and filled with sample data.

| Login | Email | Password |
|---|---|---|
| Admin | admin@uol.edu.pk | admin123 |
| Student | student@uol.edu.pk | student123 |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start with auto-restart on file changes |
| `npm start` | Start normally (used in production) |
| `npm run seed` | Add sample data if the database is empty |
| `npm run seed -- --reset` | Delete all data and seed again |
| `npm test` | Run the automated API + database tests |

## Folder structure

```
backend/
├── server.js            # starts the server
├── app.js               # Express app: middleware + routes
├── routes/              # URL → controller mapping
├── controllers/         # request handling logic
├── models/              # SQL queries (users, events, registrations)
├── middleware/          # auth (JWT), validation, error handling
├── database/            # db connection, schema.sql, seed.js
└── tests/               # automated tests (node:test + supertest)
```

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `PORT` | `5000` | Server port |
| `JWT_SECRET` | dev secret | Secret used to sign login tokens — **set this in production** |
| `DB_PATH` | `database/campus_events.db` | SQLite file location |
| `CLIENT_URL` | `*` | Allowed front-end origin(s) for CORS, comma separated |

## Documentation

- Full endpoint reference: [`../documentation/API.md`](../documentation/API.md)
- Database design: [`../documentation/DATABASE.md`](../documentation/DATABASE.md)
- Postman collection: [`../documentation/postman/`](../documentation/postman/)
