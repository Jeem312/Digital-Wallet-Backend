# 💳 Digital Wallet API

A secure and modular backend API for a **digital wallet system** (similar to bKash or Nagad) built using **Express.js**, **TypeScript**, and **MongoDB (Mongoose)**.  
This system supports **JWT authentication**, **role-based authorization**, and core financial operations like **add money**, **withdraw**, and **send money**.

---

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based login and role management (`admin`, `agent`, `user`).
  - Secure password hashing using **bcrypt**.
  - Role-based access control (RBAC) middleware.

- **Wallet Management**
  - Automatic wallet creation for all users upon registration.
  - Wallet balance management with validation (e.g., insufficient funds).

- **Transactions**
  - Add money (top-up).
  - Withdraw money.
  - Send money to another user.
  - Transaction history tracking.

- **Agent Features**
  - Cash-in (add money to user wallets).
  - Cash-out (withdraw money from user wallets).
  - (Optional) Agent commission tracking.

- **Admin Features**
  - View all users, agents, wallets, and transactions.
  - Block/unblock wallets.
  - Approve/suspend agents.
  - (Optional) Set system parameters like fees.

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (Access & Refresh Tokens)
- **Password Hashing:** bcrypt.js
- **Environment Variables:** dotenv
- **Validation & Error Handling:** Custom AppError class and middlewares

---

## 📁 Project Structure

src/
├── app/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── wallet/
│   │   └── transaction/
├── middlewares/
│   ├── globalErrorHandler.ts
│   ├── checkAuth.ts
│   └── notFound.ts
├── config/
│   └── envConfig.ts
├── helpers/
│   └── AppError.ts
├── utils/
│   ├── catchAsync.ts
│   ├── queryBuilder.ts
│   ├── seedSuperAdmin.ts
│   ├── userToken.ts
│   ├── sendResponse.ts
│   ├── jwt.ts
│   └── setCookie.ts
├── server.ts
└── app.ts

---

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone (https://github.com/Jeem312/Digital-Wallet-Backend)
   cd digital-wallet-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   DB_URL=<your-mongodb-url>
   NODE_ENV=development

   # SUPER ADMIN
   SUPER_ADMIN_EMAIL=superadmin@example.com
   SUPER_ADMIN_PASSWORD=superadminpassword
   SUPER_ADMIN_PHONE=1234567890

   # BCRYPT
   BCRYPT_SALT_ROUND=10

   # JWT
   JWT_ACCESS_SECRET=yourSecret
   JWT_REFRESH_SECRET=yourRefreshSecret
   JWT_ACCESS_EXPIRES=1d
   JWT_REFRESH_SECRET_EXPIRED=7d
   ```

4. **Run the server**
   ```bash
   npm run dev
   ```

---

## 🔐 Authentication & Roles

- **Admin:** Has full access to all endpoints.
- **Agent:** Can perform cash-in/cash-out operations.
- **User:** Can add money, withdraw, send money, and view history.

---

## 📜 API Endpoints

### **Auth Routes**
| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| POST   | `/api/v1/auth/login`  | Login and receive tokens |
| POST   | `/api/v1/auth/logout` | Logout user            |

### **User Routes**
| Method | Endpoint               | Description         |
|--------|------------------------|---------------------|
| GET    | `/api/v1/users/me`     | Get user profile    |
| POST   | `/api/v1/users`        | Create new user     |

### **Wallet Routes**
| Method | Endpoint                | Description         |
|--------|-------------------------|---------------------|
| POST   | `/api/v1/wallets/deposit`  | Add money          |
| POST   | `/api/v1/wallets/withdraw` | Withdraw money     |
| POST   | `/api/v1/wallets/transfer` | Send money         |
| GET    | `/api/v1/wallets/history`  | Get transaction history |

---

## 🧪 API Testing

Use **Postman** or any API client:

1. Import your API endpoints.
2. Login using:
   ```json
   {
     "email": "superadmin@example.com",
     "password": "superadminpassword"
   }
   ```
3. Use the returned **accessToken** for subsequent requests (set in Authorization header as `Bearer <token>`).

---

## 📝 Scripts

- **Start server:**  
  `npm start`

- **Run in dev mode (with nodemon):**  
  `npm run dev`

- **Build (TypeScript → JS):**  
  `npm run build`

---





## 👨‍💻 Author

**Sanjida Jahan Jeem**  


---
