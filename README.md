# GearShift

GearShift is a peer-to-peer car rental marketplace. Vehicle owners list cars for rent, clients browse and book them (self-drive or with a chauffeur), and admins moderate listings, users, and driver applications. Built as a Module 5 capstone project.

## Tech stack

**Backend:** Python, Flask, Flask-SQLAlchemy, Flask-Bcrypt, Flask-CORS, Flask-Migrate, Flask-Marshmallow, PyJWT. SQLite locally, PostgreSQL in production (Render + Neon).

**Frontend:** React 19, Vite, React Router, Tailwind CSS, Axios.

## Features

- Email/password authentication with JWT, bcrypt-hashed passwords, and role-based access (client, admin, driver)
- Vehicle listing, browsing, filtering, and comparison
- Self-drive and chauffeur-driven bookings, including event bookings (weddings, funerals, safaris) and convoy discounts
- Driver applications with CV upload, admin review, and a separate driver login/portal
- Admin dashboard for managing users, vehicles, bookings, and contact messages
- Contact form with admin-side message management

## Project structure

```
server/     Flask API (models, routes, schemas, migrations)
client/     React frontend (Vite)
```

## Quick start

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for full step-by-step setup instructions, including migrations, seeding, and troubleshooting.

```
cd server && pipenv install && pipenv run flask db upgrade && pipenv run python seed.py && pipenv run flask run
cd client && npm install && npm run dev
```

Then open http://127.0.0.1:5173

## Demo logins

After running `seed.py`, these accounts are available:

| Role | Email | Password | Notes |
|---|---|---|---|
| Admin | admin@gearshift.com | admin123 | Full admin dashboard access |
| Owner | owner@gearshift.com | owner123 | Lists vehicles (rental_intent: owner) |
| Client | client1@gearshift.com | client123 | Verified renter |
| Client | client2@gearshift.com | client123 | Unverified renter |
| Client | client3@gearshift.com | client123 | Verified renter |
| Driver | driver1@gearshift.com ... driver8@gearshift.com | driver123 | Same password for all 8, log in via the driver portal |

Seed data also includes 10 vehicle features and 50 vehicles across multiple categories.

## License

MIT — see [LICENSE](./LICENSE).
