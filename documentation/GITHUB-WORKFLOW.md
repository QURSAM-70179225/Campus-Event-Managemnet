# GitHub Workflow

## Branches

| Branch | Owner | Purpose |
|---|---|---|
| `main` | Qursam (Team Lead) | Always stable — only updated through reviewed Pull Requests |
| `feature/database-testing` | Aqsa Maratab | Database, models, validation, tests, docs |
| `feature/backend-api` | Maria Munawer | Express server, REST API, JWT auth |
| `feature/frontend-ui` | Muzammil Hussain | Home, navbar, event list, cards, footer, CSS |
| `feature/frontend-functionality` | Fatima Umer | Details, forms, login, dashboard, search, filter, API integration |
| `feature/integration` | Qursam (Team Lead) | Admin page, protected routes, deployment |

## Labels

`Frontend` · `Backend` · `Database` · `Bug` · `Documentation` · `Testing`

## Issues

| # | Title | Assignee | Labels |
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

## Merge order

Pull Requests are merged in this order so `main` keeps working after each merge:

1. Aqsa — database + models (`feature/database-testing`, PR #1)
2. Maria — REST API (`feature/backend-api`)
3. Muzammil — UI (`feature/frontend-ui`)
4. Fatima — functionality (`feature/frontend-functionality`)
5. Aqsa — tests + documentation (`feature/database-testing`, PR #2)
6. Qursam — integration + deployment (`feature/integration`)

## Everyday commands

```bash
git switch main
git pull origin main                 # get the latest code
git switch -c feature/my-branch      # first time only (or: git checkout -b)
# ... edit files ...
git status
git add .
git commit -m "Add event registration API"
git push -u origin feature/my-branch
# → open a Pull Request on GitHub into main
```

Keep your branch up to date when `main` changes:

```bash
git switch main && git pull origin main
git switch feature/my-branch
git merge main
```

## Code review checklist (Team Lead)

- [ ] Code runs locally without errors
- [ ] Feature works as described in the issue
- [ ] Clear names, no leftover `console.log` / commented-out code
- [ ] No secrets (`.env`) or `node_modules` committed
- [ ] Input validation and error handling present
- [ ] UI is responsive
- [ ] CI checks are green
