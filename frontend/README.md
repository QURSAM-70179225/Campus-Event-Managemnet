# Frontend — Campus Event Management

React 18 + Vite single-page app. All event data comes from the backend REST API.

## Run locally

Start the backend first (see `../backend/README.md`), then:

```bash
cd frontend
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev               # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |

## Environment

| Variable | Example | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000` | Backend URL (no trailing slash) |

## Pages

| URL | Page | Access |
|---|---|---|
| `/` | Home — hero, categories, featured events | Public |
| `/events` | Event list with search + category filter | Public |
| `/events/:id` | Event details + registration form | Public (register needs login) |
| `/login`, `/signup` | Authentication | Public |
| `/dashboard` | My registrations / all registrations (admin) | Logged in |
| `/admin` | Create, update, delete events | Admin |

## Structure

```
src/
├── components/   Navbar, Footer, EventCard, SearchFilter, ProtectedRoute
├── pages/        one file per page
├── services/     api.js — every fetch() to the backend
├── context/      AuthContext — logged-in user + token
├── styles/       CSS split by feature (navbar, home, events, forms, ...)
├── utils/        validation.js, format.js
├── config.js     API URL, university name, categories
├── App.jsx       routes
└── main.jsx      entry point
```

## Responsive design

Breakpoints at **1000px**, **860px** (hamburger menu), **640px** and **520px**. Grids collapse to one column and data tables turn into cards on phones.
