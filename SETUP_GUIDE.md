# Setup Guide

Full local setup instructions for GearShift. Follow the backend section first, then the frontend section.

## Prerequisites

- Python 3.10+ and `pipenv` (`pip install pipenv --break-system-packages` if you don't have it)
- Node.js 18+ and `npm`
- Git

## 1. Clone the repo

```
git clone https://github.com/SamuelMutiso/CAR-RENTAL-PROJECT-M5-.git
cd CAR-RENTAL-PROJECT-M5-
```

## 2. Backend setup

```
cd server
pipenv install
```

Copy `.env.example` to `.env`:

```
cp .env.example .env
```

You can leave `DATABASE_URL` blank in `.env` — this makes the app use a local SQLite file automatically (`server/instance/gearshift.db`). No Postgres setup needed for local development.

Create the database tables:

```
pipenv run flask db upgrade
```

Seed demo data (5 users, 10 features, 8 drivers, 50 vehicles):

```
pipenv run python seed.py
```

Start the API:

```
pipenv run flask run
```

The API is now running at `http://127.0.0.1:5000`. Leave this terminal open.

## 3. Frontend setup

Open a **new** terminal tab/window:

```
cd client
npm install
```

Copy `.env.example` to `.env`:

```
cp .env.example .env
```

Start the dev server:

```
npm run dev
```

The frontend is now running at `http://127.0.0.1:5173`. Open that URL in your browser — **use `127.0.0.1`, not `localhost`** (see troubleshooting below for why).

## 4. Try it out

Log in with any account from the demo logins table in [README.md](./README.md), e.g. `admin@gearshift.com` / `admin123`, or register a brand new account and book a vehicle.

## Regenerating migrations (only if you change a model)

If you add or edit a field on a SQLAlchemy model, regenerate the migration instead of editing the database by hand:

```
cd server
pipenv run flask db migrate -m "describe your change"
pipenv run flask db upgrade
```

Commit the new file generated inside `server/migrations/versions/`.

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Frontend shows "Access to localhost was denied" or a blank network error | macOS Screen Time's content filter blocks the hostname `localhost` for some users but doesn't block raw IPs | Open the app at `http://127.0.0.1:5173` instead of `http://localhost:5173`, and make sure `client/.env` uses `VITE_API_URL=http://127.0.0.1:5000` |
| `ModuleNotFoundError: No module named 'tomli'` when running `flask db migrate` | `flask-migrate`'s alembic dependency needs `tomli` on Python versions below 3.11 | Already fixed in the Pipfile — just re-run `pipenv install` |
| `pipenv lock` fails trying to build `psycopg2-binary` from source | No prebuilt wheel for your exact Python version | Already pinned to a version with wide wheel support in the Pipfile — re-run `pipenv install` |
| CORS errors in the browser console | Frontend origin doesn't match `CORS_ORIGINS` in `server/.env` | Make sure `CORS_ORIGINS=http://127.0.0.1:5173` in `server/.env` matches the URL you're opening the frontend at |
| `ImportError` on backend startup | A route, model, or schema file is empty or missing | Pull the latest `main` — this happens if a local copy is out of sync with GitHub |

## Deployment

Backend deploys to Render (needs `gunicorn` and `psycopg2-binary`, both already in the Pipfile, plus a Postgres `DATABASE_URL` from Render or Neon set as an environment variable). Frontend deploys to Vercel, with `VITE_API_URL` set to the live Render URL in the Vercel project's environment variable settings, not in a committed file.
