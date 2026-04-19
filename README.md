<div align="center">

# 🚀 SwiftParcel
### Courier & Parcel Tracking System

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

A full-stack MERN web application for booking, tracking, and managing courier shipments in real time.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Docs](#-api-endpoints) • [Screenshots](#-project-structure)

</div>

---

## ✨ Features

### 👤 User
- Register & Login with JWT Authentication
- Book a parcel with sender & receiver details
- Auto-generated unique Tracking ID on every booking
- Real-time parcel tracking with 4-stage delivery timeline
- View complete shipment history with status filters

### ⚙️ Admin
- Full CRUD — manage all parcels
- Update parcel delivery status at each stage
- View tracking updates with location & timestamp
- Generate reports and analytics
- Role-based access control

### 🎨 UI/UX
- Dark theme with teal glow effects
- Smooth animations and stagger transitions
- Recharts — Area, Bar, Pie charts
- Fully responsive layout
- Demo mode — works with mock data even without backend

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Forms | Formik, Yup |
| Charts | Recharts |
| HTTP | Axios |
| Fonts | Syne, Outfit, Space Mono |

---

## 📦 Delivery Stages

```
Picked Up  →  In Transit  →  Out for Delivery  →  Delivered
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas (cloud)
- Git

### Step 1 — Clone the repository
```bash
git clone https://github.com/Rudravinay/SwiftParcel.git
cd SwiftParcel
```

### Step 2 — Start MongoDB (local)
```bash
# Windows
net start MongoDB
```

### Step 3 — Setup Backend
```bash
cd backend
npm install
npm run dev
```

Expected output:
```
🚀 SwiftParcel server running on http://localhost:5000
✅ MongoDB Connected: localhost
```

### Step 4 — Seed Demo Users (run once)
```bash
curl -X POST http://localhost:5000/api/auth/seed
```

Creates:
| Role | Email | Password |
|------|-------|----------|
| 👤 User | user@swiftparcel.com | password123 |
| ⚙️ Admin | admin@swiftparcel.com | password123 |

### Step 5 — Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Open → **http://localhost:5173**

---

## ⚙️ Environment Variables

Create `backend/.env` (already included):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/swiftparcel
JWT_SECRET=swiftparcel_super_secret_jwt_key_2026
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 🔗 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login & get JWT | Public |
| GET | `/me` | Get current user | Private |
| POST | `/seed` | Seed demo users | Dev |

### Parcels — `/api/parcels`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Book new parcel | Private |
| GET | `/my` | Get my parcels | Private |
| GET | `/track/:trackingId` | Track by tracking ID | Public |
| GET | `/:id` | Get parcel by ID | Private |
| GET | `/` | Get all parcels | Admin |
| PUT | `/:id` | Update parcel | Admin |
| PATCH | `/:id/status` | Update delivery status | Admin |
| DELETE | `/:id` | Delete parcel | Admin |

### Reports — `/api/reports`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/summary` | Stats summary | Private |
| GET | `/monthly` | Monthly chart data | Private |
| GET | `/` | List all reports | Admin |
| POST | `/generate` | Generate report | Admin |

---

## 🗂️ Project Structure

```
SwiftParcel/
├── frontend/                    ← React + Vite + Tailwind
│   └── src/
│       ├── pages/
│       │   ├── LoginPage.jsx         ← JWT login
│       │   ├── RegisterPage.jsx      ← User registration
│       │   ├── DashboardPage.jsx     ← Stats + Charts
│       │   ├── BookParcelPage.jsx    ← Book shipment
│       │   ├── TrackPage.jsx         ← Real-time tracking
│       │   ├── HistoryPage.jsx       ← Shipment history
│       │   ├── ManagePage.jsx        ← Admin CRUD
│       │   ├── UpdateStatusPage.jsx  ← Admin status update
│       │   └── ReportsPage.jsx       ← Analytics
│       ├── components/
│       │   ├── common/Layout.jsx
│       │   ├── common/Sidebar.jsx
│       │   └── ui/index.jsx
│       ├── context/AuthContext.jsx
│       ├── services/api.js
│       └── routes/ProtectedRoute.jsx
│
└── backend/                     ← Node + Express + MongoDB
    ├── models/
    │   ├── User.js               ← Customer entity (ER)
    │   ├── Parcel.js             ← Parcel + Tracking + History
    │   └── Report.js             ← Reports entity (ER)
    ├── controllers/
    │   ├── authController.js
    │   ├── parcelController.js
    │   └── reportController.js
    ├── routes/
    │   ├── auth.js
    │   ├── parcels.js
    │   └── reports.js
    ├── middleware/
    │   ├── auth.js               ← JWT protect + adminOnly
    │   └── error.js
    ├── config/db.js
    └── server.js
```

---

## 🗺️ ER Diagram → Code Mapping

| ER Entity | Code Location | Key Fields |
|-----------|--------------|------------|
| Customer | `User.js` | name, email, phone, address |
| Parcel | `Parcel.js` | trackingId, senderName, receiverName, receiverAddress, weight, contents, status |
| Admin | `User.js` role:'admin' | adminOnly middleware |
| Tracking Update | `Parcel.js → trackingUpdates[]` | status, location, updatedBy, timestamp |
| Shipment History | `Parcel.js → statusHistory[]` | status, timestamp, location |
| Reports | `Report.js` | totalParcels, deliveredParcels, pendingParcels, generatedAt |

---

## 👤 User Flow

```
Register / Login
      ↓
  Dashboard
      ↓
Book Parcel → Tracking ID Auto-Generated
      ↓
Admin Updates Status (Picked Up → In Transit → Out for Delivery → Delivered)
      ↓
Track Parcel (real-time timeline)
      ↓
View Shipment History
      ↓
Reports & Analytics
      ↓
   Logout
```

---

## 🔐 Security

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- JWT tokens with 7-day expiry
- Protected routes using middleware
- Admin-only routes with role check
- `.env` file excluded from Git

---

<div align="center">

Made with ❤️ using the MERN Stack

</div>
