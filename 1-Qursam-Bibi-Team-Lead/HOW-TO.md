# Qursam Bibi — Team Lead / Project Manager

**Branches:** `main` (setup) and `feature/integration` · **Pull Requests:** 1 own + review/merge 5 · **Commits:** 7

You create and manage the repository, review and merge everyone's Pull Requests, integrate everything, add the **admin event management page + protected routes**, deploy, and present the architecture.

**Also read `GITHUB-SETUP.md` in this folder** — it has the issues, labels and review steps.

## 0. One-time setup

```bash
git config --global user.name "Qursam Bibi"
git config --global user.email "70179225@student.uol.edu.pk"   # must match your GitHub email
```

## Timeline (merge order matters!)

| Day | You | Team |
|---|---|---|
| 1 | Commits 1–3 on `main`, create repo, invite collaborators, labels, issues | Aqsa starts database · Muzammil starts UI |
| 2 | Review + merge **Aqsa PR #1** | Maria starts API (after Aqsa's merge) |
| 3 | Review + merge **Maria**, then **Muzammil** | Fatima starts (after Muzammil's merge) |
| 4–5 | Review + merge **Fatima** | Aqsa writes tests + docs |
| 6 | Merge **Aqsa PR #2**, then your commits 4–7 on `feature/integration` | Everyone tests |
| 7 | Merge your PR, deploy, rehearse demo | Everyone |

Each PR only touches its own files, so merging in this order gives **no merge conflicts** and `main` always works.

## 1. Create the repository (Day 1)

> You already have a solo repo called `campus-event-management`. Rename the old one first (GitHub → repo → Settings → Repository name → `campus-event-management-solo`), so the team repo can use the name. The teacher wants **team** history, so start fresh.

1. GitHub → **New repository** → name `campus-event-management`, **Public**, **do not** add README/.gitignore/license (we have our own) → Create.
2. On your computer, make an empty folder and add your first commit:

```bash
mkdir campus-event-management
cd campus-event-management
git init
```

**How to copy a commit folder into the project** (do this from inside your `campus-event-management` folder):

- **Windows (File Explorer):** open `commit-N`, select everything (Ctrl+A), copy, go to your `campus-event-management` folder, paste, and choose **Replace** if asked. Folders like `frontend` are merged automatically.
- **Windows (PowerShell):**
  ```powershell
  Copy-Item -Path "C:\path\to\YOUR-FOLDER\commit-N\*" -Destination . -Recurse -Force
  ```
- **Mac / Linux / Git Bash:**
  ```bash
  cp -r /path/to/YOUR-FOLDER/commit-N/. .
  ```

> ⚠️ Read every file before committing — you must be able to explain your own code in the demo.

### Commit 1 — Initial project setup with frontend and backend folder structure

Copy **`commit-1/`** into the folder, then:
```bash
git add .
git commit -m "Initial project setup with frontend and backend folder structure"
git branch -M main
git remote add origin https://github.com/QURSAM-70179225/campus-event-management.git
git push -u origin main
```

### Commit 2 — Add GitHub workflow guide, pull request and issue templates

Copy **`commit-2/`**, then:
```bash
git add .
git commit -m "Add GitHub workflow guide, pull request and issue templates"
git push
```

### Commit 3 — Add GitHub Actions CI for backend tests and frontend build

Copy **`commit-3/`**, then:
```bash
git add .
git commit -m "Add GitHub Actions CI for backend tests and frontend build"
git push
```

3. **Settings → Collaborators → Add people**: invite Muzammil, Fatima, Maria and Aqsa (by GitHub username or email).
4. Create **labels** and **issues** → see `GITHUB-SETUP.md`.
5. (Recommended) **Settings → Branches → Add rule** for `main`: ✅ Require a pull request before merging, ✅ Require approvals (1). This proves no one pushes directly to `main`. *Add this rule after your own commits 1–3.*

## 2. Reviewing and merging Pull Requests (Days 2–6)

For each PR, in this order: **Aqsa #1 → Maria → Muzammil → Fatima → Aqsa #2**

1. Open the PR → **Files changed** → leave at least one comment on a line (click the **+** next to a line). Good real comments: naming, a missing check, a question about how something works.
2. Test it locally:
   ```bash
   git fetch origin
   git switch <their-branch>          # e.g. git switch feature/backend-api
   git pull
   # run the app (see README) and check the feature
   git switch main
   ```
3. **Review changes** → choose **Request changes** (if something must be fixed) or **Approve**.
   - Tip: for your demo it looks good if at least one PR had "Request changes" → student fixed it → "Approve".
4. **Merge pull request** → **Create a merge commit** → Confirm.
5. Locally update `main`:
   ```bash
   git switch main
   git pull origin main
   ```
6. Tell the next person they can start / update their branch.
7. **Don't delete `feature/database-testing` after Aqsa's first PR** — she uses it again for PR #2. Other branches can be deleted at the end (`git branch -d <branch>` locally and the **Delete branch** button on GitHub).

## 3. Your integration work (Day 6, after Aqsa's 2nd PR is merged)

```bash
git switch main
git pull origin main
git switch -c feature/integration
```

### Commit 4 — Add protected routes and 404 page
Copy **`commit-4/`** → test →
```bash
git add .
git commit -m "Add protected routes and 404 page"
git push -u origin feature/integration
```

### Commit 5 — Add admin event management page with create, edit and delete
Copy **`commit-5/`** → test (log in as admin → **Manage Events** → create, edit, delete) →
```bash
git add .
git commit -m "Add admin event management page with create, edit and delete"
git push
```

### Commit 6 — Add deployment config for Render and Vercel
Copy **`commit-6/`** →
```bash
git add .
git commit -m "Add deployment config for Render and Vercel"
git push
```

### Commit 7 — Complete README with architecture, setup guide and screenshots
Copy **`commit-7/`** (final README + architecture doc + screenshots). You can delete the placeholder `screenshots/.gitkeep`. Ideally retake the screenshots from your own running app (same file names). Then:
```bash
git add .
git commit -m "Complete README with architecture, setup guide and screenshots"
git push
```

Open a PR **feature/integration → main**, title `Integration: protected routes, admin page, deployment and final README`, description:
```markdown
## What was implemented
- ProtectedRoute: dashboard needs login, /admin needs admin role
- Admin "Manage Events" page: create, update, delete events with validation
- 404 page, scroll-to-top on navigation
- Render + Vercel deployment config
- Final README, architecture documentation, screenshots

Closes #13, Closes #14

## Testing performed
Full flow tested as guest, student and admin; CI checks green.
```
Ask one teammate (e.g. Maria) to review and approve it, then merge.

## 4. Deployment (Day 7)

Same as your solo version (Render + Vercel):
1. **Render** → New → **Blueprint** → select the repo (uses `render.yaml`) → Deploy. Copy the URL, e.g. `https://campus-event-api.onrender.com`. Open `/api/health` to check.
2. **Vercel** → Add New Project → import repo → **Root Directory: `frontend`** → Environment Variable `VITE_API_URL` = the Render URL → Deploy.
3. Render → your service → Environment → set `CLIENT_URL` to the Vercel URL → Save.
4. Put both links at the top of the README (Live demo).

> Render free plan: the SQLite file resets when the service restarts (sample data comes back automatically). Mention this as a known limitation, or reuse your Turso setup from the solo version.

## 5. Final checklist (assignment section 20)

- [ ] Source code: frontend + backend + database
- [ ] README.md, .gitignore, LICENSE
- [ ] 14 GitHub Issues, labelled, assigned, closed by PRs
- [ ] Branches: main + 5 feature branches
- [ ] 6 Pull Requests with reviews (at least one "Request changes")
- [ ] Meaningful commits from all 5 members (Insights → Contributors)
- [ ] Screenshots, API documentation, installation instructions
- [ ] GitHub Actions CI green ✅ (extra marks)
- [ ] Live deployment links (extra marks)

## 6. What to explain in the final demo

- **Architecture:** React → REST API (JSON + JWT) → Express → SQLite (`documentation/ARCHITECTURE.md`)
- **Repository:** folder structure, README, Issues board, labels
- **Branch strategy:** `main` is always stable; one feature branch per member; merge order
- **Pull Requests + code review:** show a PR with comments, a "Request changes" and the fix
- **Team coordination:** issues assigned per member, `Insights → Contributors` graph, `Insights → Network` graph
- **Your code:** `ProtectedRoute` (role-based access), `AdminEventsPage` (create/update/delete), CI workflow

## Git commands to demonstrate (Team Lead extras)

```bash
git fetch origin                  # download new branches/commits without merging
git pull origin main              # fetch + merge main
git merge feature/backend-api     # merge a branch locally (normally done via the PR button)
git branch -d feature/frontend-ui # delete a merged branch locally
git push origin --delete feature/frontend-ui   # delete it on GitHub
git log --oneline --graph --all   # show the whole branch history
```

Plus all the basic commands: clone, status, add, commit, push, pull, branch, checkout, switch, merge, log, remote.

### Resolving a merge conflict (if it ever happens)
```bash
git switch feature/some-branch
git merge main                    # CONFLICT in some file
# open the file in VS Code → choose "Accept Current / Incoming / Both" → save
git add <file>
git commit -m "Resolve merge conflict with main"
git push
```
