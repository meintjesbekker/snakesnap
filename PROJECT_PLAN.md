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
| AI identification | ⬜ Todo |
| Deployment | ⬜ Todo |

---

## Frontend (React) — Complete

The frontend lives in `frontend/`. Run with `npm start` from that folder.

- ✅ 5-step mobile `MobileStepper` form (Photo & ID → Appearance → Behaviour → Location → Notes)
- ✅ MUI components with earthy colour theme (`#f5f0e8` background, `#4a7c3f` olive green primary)
- ✅ Fields: snake name, species (South African list), photo upload, length, thickness, pattern, head shape, eye type, behaviour, condition, location type, micro-habitat, time of day, weather, confidence, number of snakes, comments, add-to-database toggle
- ✅ Custom SVG snake favicon, tab title "SnakeSnap"
- ✅ Form submits to `POST /api/sightings/` with spinner, error alert, and success screen

---

## Backend (Django) — Complete (dev)

The backend lives in `backend/`. Run with `python manage.py runserver` from that folder.

- ✅ Virtual environment, Django 6, DRF, `django-cors-headers`, Pillow installed (`requirements.txt`)
- ✅ Project: `snakesnap` — App: `sightings`
- ✅ `SnakeSighting` model — all form fields, JSON arrays for multi-selects, `ImageField` for photo
- ✅ `SnakeSightingSerializer` — full model serializer
- ✅ `GET /api/sightings/` — list all sightings
- ✅ `POST /api/sightings/` — accept multipart form (fields + image file), save to DB
- ✅ CORS configured for `http://localhost:3000`
- ✅ Media files served at `/media/`, images saved to `media/sightings/`
- ✅ Django admin registered with search, filter, and list display
- ✅ SQLite database, migrations applied

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

1. Open `http://localhost:3000` in a browser.
2. **Step 1 — Photo & ID:** Enter a snake name, select a species, and upload a photo. Tap **Next**.
3. **Step 2 — Appearance:** Move the length slider, choose thickness, pattern, head shape, eye type. Tap **Next**.
4. **Step 3 — Behaviour:** Select behaviours and condition, adjust sliders. Tap **Next**.
5. **Step 4 — Location:** Choose location type, micro-habitat, time of day, weather. Tap **Next**.
6. **Step 5 — Notes:** Add a comment, toggle "Add to database". Tap **Submit**.
7. Verify the success screen appears: *"Sighting submitted!"*

### Verify data was saved

Open `http://localhost:8000/admin/` (create a superuser first if needed):

```sh
cd backend
.\venv\Scripts\activate
python manage.py createsuperuser
```

Log in and check **Sightings → Snake sightings** — the new record should appear with all fields populated and the image saved under `media/sightings/`.

### Test the API directly (optional)

```sh
# List all sightings
curl http://localhost:8000/api/sightings/

# Submit a sighting without an image
curl -X POST http://localhost:8000/api/sightings/ \
  -F "species=Puff Adder" \
  -F "length_cm=80" \
  -F "confidence=75" \
  -F "location_type=garden" \
  -F "pattern=[\"Stripes\"]" \
  -F "behaviour=[\"Defensive\"]" \
  -F "condition=[]" \
  -F "micro_habitat=[]" \
  -F "weather=[]"
```

### What to check end-to-end

| Check | Expected |
|-------|----------|
| Submit button shows spinner | ✅ while POST is in flight |
| Success screen on 201 response | ✅ "Sighting submitted!" |
| Error alert on network failure | ✅ stop the backend and retry |
| Record visible in Django admin | ✅ all fields correct |
| Uploaded image accessible | ✅ `http://localhost:8000/media/sightings/<filename>` |
| CORS — no browser console errors | ✅ frontend on :3000, backend on :8000 |

---

## Next Steps

### Step 6 — AI identification
- Send submitted image to a remote identification service (API TBD)
- Store the result (predicted species, confidence score) against the sighting record
- Return result to frontend and display on the success screen

### Step 7 — Deployment
- Move `SECRET_KEY` and other secrets to environment variables (`.env`)
- Replace SQLite with PostgreSQL
- Configure production media storage (AWS S3 or similar)
- Deploy backend to Render / Railway / Fly.io
- Deploy frontend to Vercel / Netlify or serve via Django

---

## Optional Enhancements
- User authentication (JWT)
- Sighting history per user
- Map view of sighting locations
- Push notifications
- Admin dashboard for reviewing and curating the snake database
