# SnakeSnap Project Plan

Snake identification app — Django backend, React (MUI) frontend, targeted at mobile.

---

## Status

| Area | Status |
|------|--------|
| Frontend scaffolding | ✅ Done |
| Frontend UI (multi-step form) | ✅ Done |
| Frontend theming (earthy palette, MUI) | ✅ Done |
| Backend scaffolding | ✅ Done |
| Backend API (sighting submission) | ✅ Done |
| Frontend → Backend integration | ✅ Done |
| Image storage | ✅ Done (local dev) |
| iNaturalist AI identification | ✅ Done |
| User authentication (JWT) | ✅ Done |
| Deployment | ⬜ Todo |

---

## Frontend (React) — Complete

The frontend lives in `frontend/`. Run with `npm start` from that folder.

- ✅ 5-step mobile `MobileStepper` form (Photo & ID → Appearance → Behaviour → Location → Notes)
- ✅ MUI components with earthy colour theme (`#f5f0e8` background, `#4a7c3f` olive green primary)
- ✅ Fields: snake name, species (South African list), photo upload, length, thickness, pattern, head shape, eye type, behaviour, condition, location type, micro-habitat, time of day, weather, confidence, number of snakes, comments, add-to-database toggle
- ✅ Custom SVG snake favicon, tab title "SnakeSnap"
- ✅ Form submits to `POST /api/sightings/` with spinner, error alert, and success screen
- ✅ Success screen shows iNaturalist species ID, confidence score, reference photo, and previous sightings of that species
- ✅ Login / Register screen (`AuthScreen.tsx`) with email + password tabs
- ✅ JWT stored in `localStorage`, sent as `Authorization: Bearer` header on every request
- ✅ Hamburger menu (☰) with: **iNaturalist Token**, **About**, **Logout**
- ✅ iNaturalist API token entered in-app and stored in `localStorage`; sent as `X-Inat-Token` header
- ✅ 401 response clears tokens and returns user to login screen automatically

---

## Backend (Django) — Complete (dev)

The backend lives in `backend/`. Run with `python manage.py runserver` from that folder.

- ✅ Virtual environment, Django 6, DRF, `django-cors-headers`, Pillow, `requests`, `python-dotenv`, `djangorestframework-simplejwt` (`requirements.txt`)
- ✅ Project: `snakesnap` — App: `sightings`
- ✅ `SnakeSighting` model — all form fields, JSON arrays for multi-selects, `ImageField`, `user` FK, iNat result fields
- ✅ `GET /api/sightings/` — list sightings for the authenticated user
- ✅ `POST /api/sightings/` — save sighting, run iNat identification, return result + previous sightings
- ✅ `POST /api/auth/token/` — login, returns JWT access + refresh tokens
- ✅ `POST /api/auth/token/refresh/` — refresh access token
- ✅ `POST /api/auth/register/` — create account (email + password, min 8 chars)
- ✅ All sighting endpoints require `IsAuthenticated` (JWT)
- ✅ iNaturalist CV API integration (`sightings/inat_service.py`) — token read from `X-Inat-Token` header, falls back to `backend/.env`
- ✅ Previous sightings matched by stable `inat_taxon_id`
- ✅ CORS configured for `http://localhost:3000`
- ✅ Media files served at `/media/`, images saved to `media/sightings/`
- ✅ Django admin registered with search, filter, and list display
- ✅ SQLite database, migrations applied (3 migrations)

---

## Running Locally

### Terminal 1 — Backend

```sh
cd backend
.\venv\Scripts\activate        # Windows
# source venv/bin/activate     # Mac/Linux
python manage.py runserver
# → http://localhost:8000
```

> First time only: `pip install -r requirements.txt` then `python manage.py migrate`

### Terminal 2 — Frontend

```sh
cd frontend
npm start
# → http://localhost:3000
```

> First time only: `npm install`

---

## End-to-End Testing

Both servers must be running (`localhost:8000` and `localhost:3000`).

### Manual happy path

1. Open `http://localhost:3000` — the login screen appears.
2. Tap **Register**, enter an email + password (8+ chars), tap **Create Account** — auto-login on success.
3. **Step 1 — Photo & ID:** Enter a snake name, select a species, upload a photo. Tap **Next**.
4. **Step 2 — Appearance:** Adjust length, thickness, pattern, head shape, eye type. Tap **Next**.
5. **Step 3 — Behaviour:** Select behaviours and condition, adjust sliders. Tap **Next**.
6. **Step 4 — Location:** Choose location type, micro-habitat, time of day, weather. Tap **Next**.
7. **Step 5 — Notes:** Add a comment, toggle "Add to database". Tap **Submit**.
8. Verify the success screen shows the iNaturalist identification (species, confidence, photo) and any previous sightings.
9. Tap **☰ → Logout** — returns to the login screen.

### iNaturalist identification

1. Get a token from `https://www.inaturalist.org/users/api_token` (must be logged in).
2. In the app tap **☰ → iNaturalist Token**, paste the token, tap **Save**.
3. Submit a sighting with a photo — the success screen should show the identified species.

### Verify data in Django admin

```sh
cd backend
.\venv\Scripts\activate
python manage.py createsuperuser
```

Open `http://localhost:8000/admin/` → **Sightings → Snake sightings** — records appear with all fields, iNat results, and the linked user.

### Test the API directly

```sh
# 1. Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 2. Login — copy the access token from the response
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"password123"}'

# 3. Submit a sighting (replace TOKEN)
curl -X POST http://localhost:8000/api/sightings/ \
  -H "Authorization: Bearer TOKEN" \
  -F "species=Puff Adder" \
  -F "length_cm=80" \
  -F "confidence=75" \
  -F "location_type=garden" \
  -F "pattern=[\"Stripes\"]" \
  -F "behaviour=[\"Defensive\"]" \
  -F "condition=[]" \
  -F "micro_habitat=[]" \
  -F "weather=[]"

# 4. List your sightings
curl http://localhost:8000/api/sightings/ \
  -H "Authorization: Bearer TOKEN"
```

### What to check end-to-end

| Check | Expected |
|-------|----------|
| Register creates account | ✅ auto-login after success |
| Login with wrong password | ✅ "Invalid email or password" error |
| Submit without login | ✅ 401 → redirected to login screen |
| Submit button shows spinner | ✅ while POST is in flight |
| Success screen — iNat result | ✅ species, confidence, reference photo |
| Success screen — previous sightings | ✅ dated list if species seen before |
| Logout clears session | ✅ login screen shown, token gone from localStorage |
| Uploaded image accessible | ✅ `http://localhost:8000/media/sightings/<filename>` |
| CORS — no browser console errors | ✅ frontend on :3000, backend on :8000 |

---

## Next Steps

### Deployment
- Move `SECRET_KEY` and `INATURALIST_API_TOKEN` to server environment variables
- Replace SQLite with PostgreSQL
- Configure production media storage (AWS S3 or similar)
- Deploy backend to Render / Railway / Fly.io
- Deploy frontend to Vercel / Netlify or serve via Django
- Set `DEBUG=False`, configure `ALLOWED_HOSTS`

---

## Optional Enhancements
- JWT refresh token rotation (auto-renew sessions without re-login)
- Sighting history / my sightings screen
- Map view of sighting locations (GPS coordinates on submission)
- Admin dashboard for curating the snake database
- Push notifications
- Password reset via email
