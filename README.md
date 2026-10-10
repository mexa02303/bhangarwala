# 🌿 EcoRetrieve — E-Waste Intelligence & Circular Recovery Platform

A production-minded, full-stack MERN application for e-waste submission, AI-assisted visual assessment, certified field agent inspection, and circular recycling workflow management.

---

## 🚀 1. Required Technology Stack

### **Frontend**
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (Deep forest green, muted emerald, off-white, and dark charcoal theme)
- **Routing**: React Router v6
- **HTTP Client**: Axios with HttpOnly cookie support and Authorization token fallback
- **Icons**: Lucide React
- **Analytics Charts**: Recharts

### **Backend**
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas via Mongoose (Decoupled behind a Repository Pattern)
- **Authentication**: JWT & HttpOnly cookies + bcrypt password hashing
- **Upload Middleware**: Multer with file type, MIME magic bytes, and 10MB size validation
- **Validation**: Zod schema validation
- **Security**: Helmet headers, CORS origin protection, express-rate-limit

### **AI & Image Processing**
- **Assessment Module**: Provider-independent architecture (`AssessmentService`).
- **Initial Model**: Transparent heuristic matrix evaluating category life expectancy, physical condition, age decay, and component harvestability.
- **Honest Disclosures**: Explicitly labeled as `"Preliminary Rule-Based Assessment (Demo Mode)"` to avoid false AI claims when no neural network is active.

---

## 📁 2. Exact Project Structure

```
ewaste-platform/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/          # Axios instance & interceptors
│   │   ├── assets/       # Static branding & illustrations
│   │   ├── components/   # Reusable components (EcoGuide Chatbot, etc.)
│   │   ├── context/      # AuthContext provider
│   │   ├── layouts/      # PublicLayout, UserLayout, AdminLayout, AgentLayout
│   │   ├── pages/        # Public, User, Admin, and Agent views
│   │   ├── routes/       # ProtectedRoute guard
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/       # MongoDB connection config
│   │   ├── controllers/  # Auth, Case, Admin, Chat controllers
│   │   ├── middleware/   # JWT auth, role authorization, Multer upload
│   │   ├── models/       # User, EWasteCase, Assessment, StatusHistory, AuditLog, ChatMessage
│   │   ├── repositories/ # Repository pattern & MongoDB adapters
│   │   ├── routes/       # Express REST API routes
│   │   ├── services/     # Assessment engine, Storage adapter, Workflow state machine, Chatbot
│   │   ├── validators/   # Zod request validators
│   │   ├── utils/        # Seed script
│   │   ├── app.js        # Express app config
│   │   └── server.js     # Server entry point
│   ├── tests/            # Automated workflow & scoring tests
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚡ 3. Local Development Setup

### **Prerequisites**
- Node.js (v18+)
- MongoDB Atlas URI or local MongoDB instance (`mongodb://127.0.0.1:27017/ewaste_platform`)

### **Step 1: Install Dependencies**
```bash
# Terminal 1 — Backend
cd ewaste-platform/backend
npm install

# Terminal 2 — Frontend
cd ewaste-platform/frontend
npm install
```

### **Step 2: Environment Configuration**
Copy the `.env.example` files to `.env`:

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_PROVIDER=mongodb
MONGODB_URI=mongodb://127.0.0.1:27017/ewaste_platform
STORAGE_PROVIDER=local
JWT_SECRET=super-secret-jwt-key-ewaste-intelligence-2026
```

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### **Step 3: Seed Database (Admin, Agents & Sample Cases)**
```bash
cd ewaste-platform/backend
npm run seed
```

**Seeded Test Credentials:**
- **Super Admin**: `admin@ewaste.org` | Password: `AdminPass123!`
- **Field Agent**: `agent.sarah@ewaste.org` | Password: `AgentPass123!`
- **Demo Customer**: `user@ewaste.org` | Password: `UserPass123!`

### **Step 4: Run Application Terminals**
```bash
# Terminal 1 — Backend Server
cd ewaste-platform/backend
npm run dev

# Terminal 2 — Frontend Vite Server
cd ewaste-platform/frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔄 4. Case Status Workflow State Machine

Valid server-side state transitions enforced in `workflowService.js`:

```
Submitted
   │
   ▼
Under Review ──► Rejected / Needs More Information
   │
   ▼
Agent Assigned
   │
   ▼
Assessment Confirmed
   │
   ▼
Awaiting Collection
   │
   ▼
Collected
   │
   ▼
Repair / Refurbishment / Recycling
   │
   ▼
Completed
```

Every status transition is logged with timestamp, user ID, role, and audit notes in `StatusHistory` and `AuditLog`.

---

## 🏗️ 5. Database Architecture & Future DynamoDB Adapter Guide

Controllers do **not** invoke direct Mongoose queries. All database operations pass through `RepositoryFactory`.

### **Data Access Contracts Implemented:**
1. `IUserRepository`: `findById`, `findByEmail`, `create`, `update`, `findAllUsers`
2. `ICaseRepository`: `findById`, `findByReference`, `create`, `update`, `findByUser`, `findAll`
3. `IAssessmentRepository`: `findByCaseId`, `create`, `update`
4. `IStatusHistoryRepository`: `create`, `findByCaseId`

### **Future Amazon DynamoDB Single-Table Migration:**
To switch to DynamoDB:
1. Set `DATABASE_PROVIDER=dynamodb` in `.env`.
2. Implement `DynamoUserRepository`, `DynamoCaseRepository`, etc. under `src/repositories/dynamo/` using AWS SDK v3 `@aws-sdk/client-dynamodb`.
3. Register the DynamoDB repository classes in `repositoryFactory.js`.
4. Zero controller code or frontend code will require modification.

---

## ☁️ 6. AWS Deployment Readiness

- **Frontend**: Deployable to **AWS Amplify** (`npm run build`).
- **Backend**: Deployable to **AWS Elastic Beanstalk** (Node.js environment).
- **Storage**: Amazon S3 compatible via `S3StorageAdapter` using AWS SDK v3 `@aws-sdk/client-s3`.
- **Health Check**: Endpoint available at `GET /health`.

---

## 🧪 7. Verification & Automated Tests

Run backend automated tests for authentication, authorization, state machine transitions, and transparent scoring:
```bash
cd ewaste-platform/backend
npm test
```
