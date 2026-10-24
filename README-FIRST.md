# Campus Event Management — Team Pack

Five folders, one per team member. Each folder contains:

- **`HOW-TO.md`** — step-by-step guide: setup, every commit (with the exact commit message), Pull Request text, how to test, and what to explain in the demo
- **`commit-1/`, `commit-2/`, …** — the files for each commit, already placed at their correct paths. Copy a folder's contents into the project, test, commit, push.

| Folder | Member | Role | Branch | Commits |
|---|---|---|---|---|
| `1-Qursam-Bibi-Team-Lead` | Qursam Bibi | Team Lead | `main`, `feature/integration` | 7 |
| `2-Muzammil-Hussain-Frontend-UI` | Muzammil Hussain | Front-End 1 | `feature/frontend-ui` | 4 |
| `3-Fatima-Umer-Frontend-Functionality` | Fatima Umer | Front-End 2 | `feature/frontend-functionality` | 5 |
| `4-Maria-Munawer-Backend-API` | Maria Munawer | Back-End 1 | `feature/backend-api` | 4 |
| `5-Aqsa-Maratab-Database-Testing` | Aqsa Maratab | Back-End 2 / DB & Testing | `feature/database-testing` | 7 |
| `0-Complete-Project-Reference` | — | The finished project (for checking, not for committing) | — | — |

## Order of work

```
Day 1  Qursam: repo setup (commits 1–3), invites, labels, issues
       Aqsa:   database commits 1–4  → PR #1      Muzammil: starts UI
Day 2  Qursam merges Aqsa PR #1
       Maria:  API commits 1–4 → PR               Muzammil: commits 2–4 → PR
Day 3  Qursam merges Maria, then Muzammil
       Fatima: commits 1–5 → PR
Day 5  Qursam merges Fatima.   Aqsa: commits 5–7 → PR #2
Day 6  Qursam merges Aqsa PR #2, then integration commits 4–7 → PR → merge
Day 7  Deploy, test everything, rehearse the demo
```

Every PR only touches its own files, so following this order gives **zero merge conflicts**, and `main` works after every merge. (This exact history was replayed and checked: the app builds and all 32 tests pass at every step.)

## Rules for everyone

1. Never work on `main` — always on your own branch.
2. Set `git config --global user.email` to **your GitHub email**, or your commits won't be counted for you.
3. Commit **one `commit-N` folder at a time** with the given message. Don't squash everything into one commit.
4. Read and understand every file you commit — each member presents their own part in the demo.
5. Never commit `.env`, `node_modules/` or `*.db` (the `.gitignore` already blocks them).

## Running the finished app

```bash
cd backend && npm install && copy .env.example .env && npm run dev     # http://localhost:5000
cd frontend && npm install && copy .env.example .env && npm run dev    # http://localhost:5173
```
(On Mac/Linux use `cp` instead of `copy`.) Logins: admin@uol.edu.pk / admin123 · student@uol.edu.pk / student123
