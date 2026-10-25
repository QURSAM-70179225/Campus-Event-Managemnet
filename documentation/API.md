# API Documentation

Base URL (local): `http://localhost:5000`

All request and response bodies are JSON. Protected routes need a header:

```
Authorization: Bearer <token>
```

You get the token from `POST /api/login` or `POST /api/signup`.

## Summary

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Server health check |
| POST | `/api/signup` | Public | Create a student account |
| POST | `/api/login` | Public | Log in and receive a JWT token |
| GET | `/api/me` | Logged in | Current user's profile |
| GET | `/api/events` | Public | List events (supports `search` and `category`) |
| GET | `/api/events/:id` | Public | One event with available seats |
| POST | `/api/events` | Admin | Create an event |
| PUT | `/api/events/:id` | Admin | Update an event |
| DELETE | `/api/events/:id` | Admin | Delete an event (and its registrations) |
| POST | `/api/register` | Logged in | Register the current user for an event |
| GET | `/api/registrations` | Logged in | Admin: all registrations · Student: own registrations |
| DELETE | `/api/registrations/:id` | Owner / Admin | Cancel a registration |

## Authentication

### POST /api/signup

```json
{ "name": "Ali Khan", "email": "ali@uol.edu.pk", "password": "secret123" }
```

**201 Created**

```json
{
  "message": "Account created successfully",
  "token": "eyJhbGciOi...",
  "user": { "id": 3, "name": "Ali Khan", "email": "ali@uol.edu.pk", "role": "student", "created_at": "..." }
}
```

Errors: `400` validation failed · `409` email already exists

### POST /api/login

```json
{ "email": "admin@uol.edu.pk", "password": "admin123" }
```

**200 OK** → same shape as signup (`token` + `user`). Errors: `400` missing fields · `401` invalid email or password

## Events

### GET /api/events

Query parameters (both optional):

| Param | Example | Meaning |
|---|---|---|
| `search` | `AI Workshop` | Matches title, description or location |
| `category` | `Workshop` | One of `Seminar`, `Workshop`, `Sports`, `Competition`, `Conference`, `Society` |

**200 OK**

```json
[
  {
    "id": 1,
    "title": "AI Workshop: Building Apps with Large Language Models",
    "description": "Hands-on workshop ...",
    "date": "2026-10-29",
    "time": "10:00",
    "location": "CS Lab 3, Main Campus",
    "category": "Workshop",
    "capacity": 40,
    "created_by": 1,
    "created_at": "2026-10-24 10:00:00",
    "registered": 12,
    "seats_available": 28
  }
]
```

### GET /api/events/:id

**200 OK** → one event object (same fields as above). Errors: `400` invalid id · `404` not found

### POST /api/events (admin)

```json
{
  "title": "Postman Testing Workshop",
  "description": "Learn how to test REST APIs",
  "date": "2030-03-10",
  "time": "15:00",
  "location": "CS Lab 4",
  "category": "Workshop",
  "capacity": 30
}
```

Rules: title ≥ 3 characters · date `YYYY-MM-DD` · time `HH:MM` (24-hour) · valid category · capacity integer > 0.

**201 Created** → the new event. Errors: `400` validation · `401` not logged in · `403` not admin

### PUT /api/events/:id (admin)

Same body as POST. Capacity cannot be lower than the number of students already registered.
**200 OK** → updated event. Errors: `400` · `401` · `403` · `404`

### DELETE /api/events/:id (admin)

**200 OK** `{ "message": "Event deleted successfully" }` — related registrations are deleted automatically (`ON DELETE CASCADE`).

## Registrations

### POST /api/register

```json
{ "event_id": 1 }
```

**201 Created**

```json
{
  "message": "Registered successfully",
  "registration": {
    "id": 5, "user_id": 3, "event_id": 1, "registration_date": "...",
    "student_name": "Ali Khan", "student_email": "ali@uol.edu.pk",
    "event_title": "AI Workshop ...", "event_date": "2026-10-29", "event_time": "10:00",
    "event_location": "CS Lab 3", "event_category": "Workshop"
  }
}
```

Errors: `400` event is full / invalid id · `401` not logged in · `404` event not found · `409` already registered

### GET /api/registrations

- **Admin**: every registration; optional `?event_id=1` to filter by event
- **Student**: only their own registrations

### DELETE /api/registrations/:id

Students can cancel their own registration; admins can cancel any. **200 OK** `{ "message": "Registration cancelled" }`

## Error format

Every error uses the same shape:

```json
{ "error": "Validation failed", "details": ["Capacity must be a whole number greater than 0"] }
```

`details` is only present for validation errors.

| Code | Meaning |
|---|---|
| 400 | Bad request / validation failed |
| 401 | Not logged in or invalid token |
| 403 | Logged in but not allowed (e.g. student calling an admin route) |
| 404 | Resource or route not found |
| 409 | Duplicate (email already used, already registered) |
| 500 | Unexpected server error |

## Testing with Postman

Import `documentation/postman/Campus-Event-Management.postman_collection.json` into Postman, start the backend, then run the collection with the **Collection Runner**. The login requests save the tokens into collection variables automatically, so the protected requests work without copying tokens by hand.
