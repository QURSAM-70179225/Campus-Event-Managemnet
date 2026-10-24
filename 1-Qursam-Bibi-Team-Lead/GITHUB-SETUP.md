# GitHub Setup — Labels, Issues and Reviews

## Labels

GitHub repo → **Issues → Labels → New label**. Create:

| Label | Colour |
|---|---|
| Frontend | `#1d76db` |
| Backend | `#5319e7` |
| Database | `#0e8a16` |
| Bug | `#d73a4a` (already exists) |
| Documentation | `#0075ca` (already exists) |
| Testing | `#fbca04` |

## Issues to create (before development starts)

**Issues → New issue** → pick "Task" → fill title, description, **Assignee**, **Label**.

| # | Title | Assignee | Label(s) |
|---|---|---|---|
| 1 | Create database schema, connection and seed data | Aqsa | Database |
| 2 | Create models with CRUD operations and validation | Aqsa | Database, Backend |
| 3 | Develop Event REST API | Maria | Backend |
| 4 | Implement signup/login with JWT and registration API | Maria | Backend |
| 5 | Create navigation bar, footer and layout | Muzammil | Frontend |
| 6 | Create Home page and event listing with event cards | Muzammil | Frontend |
| 7 | Create Login and Signup pages with validation | Fatima | Frontend |
| 8 | Create Event Details page with registration form | Fatima | Frontend |
| 9 | Add search and category filter | Fatima | Frontend |
| 10 | Create student dashboard | Fatima | Frontend |
| 11 | Write automated API tests and Postman collection | Aqsa | Testing |
| 12 | Write API and database documentation | Aqsa | Documentation |
| 13 | Integrate front end and back end, admin event management | Qursam | Frontend, Backend |
| 14 | Deployment and final README | Qursam | Documentation |

Create them **in this order** so the numbers match the "Closes #N" lines in everyone's PR descriptions. When a PR with "Closes #3" is merged, issue #3 closes automatically.

### Optional: create all issues with the GitHub CLI

Install [GitHub CLI](https://cli.github.com/), run `gh auth login`, then from inside the repo folder (Git Bash):

```bash
gh label create Frontend --color 1d76db
gh label create Backend --color 5319e7
gh label create Database --color 0e8a16
gh label create Testing --color fbca04

gh issue create -t "Create database schema, connection and seed data" -b "Users, events, registrations tables + seed data" -l Database
gh issue create -t "Create models with CRUD operations and validation" -b "Models for all tables, validation + error handling middleware" -l Database -l Backend
gh issue create -t "Develop Event REST API" -b "GET/POST/PUT/DELETE /api/events" -l Backend
gh issue create -t "Implement signup/login with JWT and registration API" -b "POST /api/signup, /api/login, /api/register, GET /api/registrations" -l Backend
gh issue create -t "Create navigation bar, footer and layout" -b "Responsive navbar + footer" -l Frontend
gh issue create -t "Create Home page and event listing with event cards" -b "Home page, events page, event cards" -l Frontend
gh issue create -t "Create Login and Signup pages with validation" -b "Forms with client-side validation" -l Frontend
gh issue create -t "Create Event Details page with registration form" -b "Details + student registration" -l Frontend
gh issue create -t "Add search and category filter" -b "Search box + category chips" -l Frontend
gh issue create -t "Create student dashboard" -b "My registrations / admin view" -l Frontend
gh issue create -t "Write automated API tests and Postman collection" -b "node:test + supertest, Postman" -l Testing
gh issue create -t "Write API and database documentation" -b "API.md, DATABASE.md, TESTING.md" -l Documentation
gh issue create -t "Integrate front end and back end, admin event management" -b "Protected routes, admin page" -l Frontend -l Backend
gh issue create -t "Deployment and final README" -b "Render + Vercel, README, screenshots" -l Documentation
```
Then assign each issue to the right person on GitHub (they must have accepted the invite first).

## Optional: GitHub Project board

**Projects → New project → Board** → add all issues → columns *Todo / In Progress / Done*. Move cards as work progresses — nice to show in the demo.

## Review checklist (copy into your review comments)

- [ ] Code runs locally without errors
- [ ] Feature matches the issue
- [ ] Clear names, no leftover `console.log` / commented-out code
- [ ] No `.env`, `node_modules` or `.db` files committed
- [ ] Input validation and error handling
- [ ] UI responsive (for frontend PRs)
- [ ] CI checks are green ✅
