# Simple Login App — for Selenium + API testing practice

A minimal login/signup app. No database setup needed — runs fully in memory.

## Run it

From the `new-one-main` directory, run:

```bash
npm ci
npm start
```

The server entry point is `server.js`. The Express app is built in `src/app.js`,
API endpoints are grouped under `src/routes/`, and user/session state is
encapsulated by `src/repositories/memoryStore.js`. This keeps the API contract
the same while making the app easier to extend or replace the in-memory store.

Then open http://localhost:3000 in a browser.

For local development, a ready-to-use account is seeded automatically:
- Email: `test@example.com`
- Password: `Test@1234`

The demo account is not created when `NODE_ENV=production`.

## Pages (for manual / Selenium testing)

| Page | URL | Key element IDs |
|---|---|---|
| Login | `/index.html` | `#email`, `#password`, `#loginBtn`, `#message` |
| Sign up | `/signup.html` | `#name`, `#email`, `#password`, `#signupBtn`, `#message` |
| Home / shop | `/home.html` | `#welcomeMsg`, `#productGrid`, `#cartItems`, `#logoutBtn` |

All element IDs are stable (no generated class names), so Selenium locators like
`driver.find_element(By.ID, "loginBtn")` will work reliably.

## API endpoints (for API testing — Postman, curl, requests, etc.)

Base URL: `http://localhost:3000`

- `POST /api/signup` — body `{ "name", "email", "password" }`
- `POST /api/login` — body `{ "email", "password" }` → returns `{ ok, token, name }`
- `GET /api/me` — header `Authorization: Bearer <token>` → returns `{ ok, email, name }`
- `POST /api/logout` — header `Authorization: Bearer <token>`
- `GET /api/health` — basic health check, no auth needed

After signing in, the home page shows a small product list and a cart. Cart items
and quantities are saved in the current browser's local storage; no payment or
order is submitted.

Example with curl:

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@1234"}'
```

The UI calls these exact same endpoints, so testing the API and testing the UI
exercise identical backend logic — useful for comparing manual/Selenium results
against direct API results.

## Notes
- Data is in-memory only — restarting the local development server reseeds the demo account, while production restarts clear all accounts and sessions.
- Sign-up passwords must be between 8 and 200 characters.
- No `.env` or external service needed to get started.

## Deploy to Render

This project is a Node.js/Express web service that also serves its frontend, so
deploy it as a Render **Web Service**. The root `render.yaml` sets the build
command (`npm ci`), start command (`npm start`), production mode, and HTTP health
check (`/api/health`). No separate frontend service, database, CORS setting, or
secret environment variable is required for the current features.

User accounts and login sessions are stored in memory. They reset whenever the
service restarts or redeploys, and multiple instances would not share them. The
cart is stored in each user's browser. Use a persistent database before relying
on signup accounts as durable production data.
