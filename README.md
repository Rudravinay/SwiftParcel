# SwiftParcel — Courier & Parcel Tracking System
### Full Stack MERN | React + Node + Express + MongoDB (Local) + JWT

---

## 🚀 Quick Start — 3 Terminal Windows

### Terminal 1 — Start MongoDB
```bash
# Windows
net start MongoDB

# OR if using mongod directly
mongod --dbpath "C:\data\db"
```
Then open **MongoDB Compass** → connect to:
```
mongodb://localhost:27017
```
You will see the `swiftparcel` database appear automatically after the backend starts.

---

### Terminal 2 — Backend
```bash
cd swiftparcel/backend
npm install
npm run dev
```
Expected output:
```
🚀 SwiftParcel server running on http://localhost:5000
✅ MongoDB Connected: localhost
```

**Seed demo users — run this ONCE** (open in browser or Postman):
```
POST http://localhost:5000/api/auth/seed
```
Or use curl:
```bash
curl -X POST http://localhost:5000/api/auth/seed
```
This creates:
- 👤 `user@swiftparcel.com` / `password123`  (User)
- ⚙️  `admin@swiftparcel.com` / `password123` (Admin)

---

### Terminal 3 — Frontend
```bash
cd swiftparcel/frontend
npm install
npm run dev
```
Open → **http://localhost:5173**

---

## 📦 .env File (already configured for local MongoDB)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/swiftparcel
JWT_SECRET=swiftparcel_super_secret_jwt_key_2026
JWT_EXPIRE=7d
NODE_ENV=development
```
No changes needed — just run it!

---

## 🧭 MongoDB Compass — View Your Data

1. Open **MongoDB Compass**
2. Connect to: `mongodb://localhost:27017`
3. You'll see database: **swiftparcel**
4. Collections created automatically:
   - `users` — registered users (passwords hashed with bcrypt)
   - `parcels` — all booked parcels with tracking updates
   - `reports` — generated analytics reports

---

## 🐚 MongoDB Shell — Useful Commands

Open **mongosh** in terminal:
```bash
mongosh
```

```js
// Switch to swiftparcel db
use swiftparcel

// See all users
db.users.find().pretty()

// See all parcels
db.parcels.find().pretty()

// Count parcels by status
db.parcels.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// Find parcel by tracking ID
db.parcels.findOne({ trackingId: "SP-20260409-001" })

// Delete all parcels (reset)
db.parcels.deleteMany({})

// Make a user admin manually
db.users.updateOne(
  { email: "user@swiftparcel.com" },
  { $set: { role: "admin" } }
)
```

---

## 📁 Full Project Structure
```
swiftparcel/
├── frontend/                    ← React + Vite + Tailwind (Dark UI)
│   └── src/
│       ├── pages/
│       │   ├── LoginPage.jsx         ← Split-screen dark login
│       │   ├── RegisterPage.jsx      ← Registration with Formik/Yup
│       │   ├── DashboardPage.jsx     ← Stats + Area + Pie charts
│       │   ├── BookParcelPage.jsx    ← Full booking form
│       │   ├── TrackPage.jsx         ← Progress bar + timeline
│       │   ├── HistoryPage.jsx       ← Filterable shipment history
│       │   ├── ManagePage.jsx        ← Admin CRUD + edit modal
│       │   ├── UpdateStatusPage.jsx  ← Admin status updater
│       │   └── ReportsPage.jsx       ← Charts + report table
│       ├── components/
│       │   ├── common/Layout.jsx     ← Sidebar + Topbar
│       │   ├── common/Sidebar.jsx    ← Dark nav, role-based links
│       │   └── ui/index.jsx          ← StatusBadge, Spinner, Modal
│       ├── context/AuthContext.jsx   ← JWT auth state
│       ├── services/api.js           ← Axios instance + all APIs
│       └── routes/ProtectedRoute.jsx ← JWT + adminOnly guard
│
└── backend/                     ← Node + Express + MongoDB
    ├── models/
    │   ├── User.js               ← Customer entity (ER) + bcrypt hash
    │   ├── Parcel.js             ← Parcel + TrackingUpdate + History
    │   └── Report.js             ← Report entity (ER)
    ├── controllers/
    │   ├── authController.js     ← register, login, me, seed
    │   ├── parcelController.js   ← Full CRUD + track + updateStatus
    │   └── reportController.js   ← summary, monthly, generate, list
    ├── routes/
    │   ├── auth.js               ← /api/auth/*
    │   ├── parcels.js            ← /api/parcels/*
    │   └── reports.js            ← /api/reports/*
    ├── middleware/
    │   ├── auth.js               ← protect, adminOnly, signToken
    │   └── error.js              ← Global error handler
    ├── config/db.js              ← MongoDB connection
    ├── server.js                 ← Express entry point
    └── .env                      ← mongodb://localhost:27017/swiftparcel
```

---

## 🔗 All API Endpoints

### Auth — `/api/auth`
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login + get JWT token | Public |
| GET  | `/me` | Get logged-in user info | Private |
| POST | `/seed` | Create demo users | Dev only |

### Parcels — `/api/parcels`
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST   | `/` | Book new parcel | Private |
| GET    | `/my` | Get my parcels | Private |
| GET    | `/track/:trackingId` | Track by ID | Public |
| GET    | `/:id` | Get parcel by ID | Private |
| GET    | `/` | Get ALL parcels | Admin |
| PUT    | `/:id` | Update parcel details | Admin |
| PATCH  | `/:id/status` | Update delivery status | Admin |
| DELETE | `/:id` | Delete parcel | Admin |

### Reports — `/api/reports`
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET  | `/summary` | Stats summary (counts) | Private |
| GET  | `/monthly` | Monthly chart data | Private |
| GET  | `/` | List all saved reports | Admin |
| POST | `/generate` | Generate & save report | Admin |

---

## 🗂️ ER Diagram → Code Mapping

| ER Entity | Model | Fields |
|-----------|-------|--------|
| Customer | `User.js` | name, email, phone, address |
| Parcel | `Parcel.js` | trackingId, senderName, receiverName, receiverAddress, weight, contents, status |
| Admin | `User.js` (role:'admin') | adminOnly middleware |
| Tracking Update | `Parcel.js → trackingUpdates[]` | status, location, updatedBy, timestamp |
| Shipment History | `Parcel.js → statusHistory[]` | status, timestamp, location (auto-pushed) |
| Portfolio / Reports | `Report.js` | totalParcels, deliveredParcels, pendingParcels, generatedAt |

---

## 🎨 UI Highlights
- **Dark theme** — `#0a0f1e` background with teal `#14b8a6` glow
- **Fonts** — Syne (headings) · Outfit (body) · Space Mono (tracking IDs)
- **Animations** — fadeUp, pulseGlow, shimmer skeleton, stagger delays
- **Charts** — Recharts: AreaChart, BarChart, PieChart
- **Demo mode** — works offline with mock data if backend is off

---

## 👤 User Flow (from PDF)
```
Login/Register → Dashboard → Book Parcel → Tracking ID Generated
→ Admin Updates Status → Track Parcel → View History
→ Reports & Analytics → Logout
```
