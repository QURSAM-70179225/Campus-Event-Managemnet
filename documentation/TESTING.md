# Testing Report

## 1. Automated back-end tests

Run from `backend/`:

```bash
npm test
```

32 tests run against an **in-memory** database, so real data is never touched.

| File | What it covers |
|---|---|
| `tests/database.test.js` | INSERT, SELECT, UPDATE, DELETE on users, events, registrations · UNIQUE email · CHECK category · UNIQUE registration · CASCADE delete |
| `tests/api.test.js` | Every endpoint: success cases, 400 validation, 401 no token, 403 not admin, 404 missing, 409 duplicates, full events, capacity rules |

Result: **32 passed, 0 failed**.

## 2. Postman (manual API testing)

1. Start the backend: `cd backend && npm run dev`
2. Postman → **Import** → `documentation/postman/Campus-Event-Management.postman_collection.json`
3. Click the collection → **Run** (Collection Runner)

The collection logs in as admin and student automatically and stores the tokens.

| Method | Requests tested |
|---|---|
| GET | health, all events, search, filter, event by id, 404, registrations (student + admin), me |
| POST | signup, login (valid/invalid), create event (admin / student 403 / invalid 400), register, register again 409 |
| PUT | update event |
| DELETE | cancel registration, delete event |

## 3. Database verification

| Operation | How it was verified |
|---|---|
| Insert | Signup, create event, register → rows appear (DB Browser for SQLite + `database.test.js`) |
| Select | `GET /api/events`, `GET /api/registrations` |
| Update | `PUT /api/events/:id` → new values returned |
| Delete | `DELETE /api/events/:id` → event and its registrations removed (cascade) |

## 4. Front-end testing checklist

| Area | Test | Result |
|---|---|---|
| Navigation | All navbar + footer links open the right page; active link highlighted | ✅ |
| Buttons | Browse, Login, Register, View details, Register now, Cancel, Logout | ✅ |
| Forms | Login: empty fields + wrong password show errors | ✅ |
| Forms | Signup: short name, bad email, short password, mismatched passwords | ✅ |
| Forms | Registration: must tick "I confirm I will attend" | ✅ |
| Forms | Admin event form: all 7 fields validated | ✅ |
| Search | "AI Workshop" returns the AI workshop; URL updates to `?search=` | ✅ |
| Filters | Sports chip shows only sports events; footer category links pre-filter | ✅ |
| Registration | Seats decrease after registering; duplicate registration blocked | ✅ |
| Access control | `/dashboard` redirects guests to login; students blocked from `/admin` | ✅ |
| Admin | Create → edit → delete event | ✅ |
| Responsive | 390 px phone: hamburger menu, single-column cards, tables become cards, no sideways scroll | ✅ |
| 404 | Unknown URL shows "Page not found" | ✅ |
