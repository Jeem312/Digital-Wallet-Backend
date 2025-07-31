Here's an improved and more detailed `README.md` for your Digital Wallet API project with better organization and technical clarity:

```markdown
# 💳 Digital Wallet API

**LIVE URL:** [https://digital-wallet-backend.vercel.app/](https://digital-wallet-backend.vercel.app/)

A secure financial transaction system API supporting user wallets, agent operations, and admin management with JWT authentication.

## 🌟 Key Features

### 🔐 Authentication System
- JWT-based authentication with access/refresh tokens
- Role-based authorization (Admin, Agent, User)
- Secure password hashing with bcrypt

### 💰 Core Financial Operations
- Wallet creation for all users (initial balance: 50 units)
- Send money between users
- Cash-in (Agent adds money to user wallet)
- Cash-out (Agent withdraws from user wallet)
- Transaction history tracking

### 👔 Admin Controls
- User management (create/update/block users)
- Agent approval system (Pending → Accepted/Rejected)
- Wallet blocking functionality
- Comprehensive transaction monitoring

## 🛠 Technical Stack

| Category       | Technologies                          |
|----------------|---------------------------------------|
| Backend        | Node.js, Express, TypeScript         |
| Database       | MongoDB (Mongoose ODM)               |
| Authentication | JWT with cookie-based refresh tokens |
| Security       | Bcrypt, CORS, rate limiting          |
| Deployment     | Vercel                               |

## 📂 Enhanced Project Structure

```
src/
├── app/
│   ├── modules/
│   │   ├── auth/           # Auth routes & controllers
│   │   ├── user/           # User management
│   │   ├── wallet/         # Wallet operations
│   │   └── transaction/    # Transaction records
│   └── routes/             # Consolidated route definitions
├── config/
│   ├── envConfig.ts        # Environment variables
│   └── dbConnect.ts       # Database connection
├── middlewares/
│   ├── checkAuth.ts        # RBAC middleware
│   ├── errorHandlers.ts    # Global error management
│   └── validators/         # Request validation
├── models/
│   ├── User.model.ts       # User schema
│   ├── Wallet.model.ts     # Wallet schema
│   └── Transaction.model.ts
├── utils/
│   ├── apiFeatures.ts      # Query filtering/pagination
│   ├── jwt.ts              # Token utilities
│   └── responseHelpers.ts  # Standardized responses
└── server.ts               # Entry point
```

## 🚀 API Endpoints

### Authentication (`/api/v1/auth`)
| Method | Endpoint       | Description                | Access       |
|--------|----------------|----------------------------|--------------|
| POST   | `/login`       | User login                 | Public       |
| POST   | `/logout`      | Invalidate session         | Authenticated|

### Users (`/api/v1/users`)
| Method | Endpoint            | Description                     | Access       |
|--------|---------------------|---------------------------------|--------------|
| POST   | `/register`         | Create new user                 | Public       |
| GET    | `/`                 | List all users (paginated)      | Admin        |
| PATCH  | `/:id/role`         | Update user role                | Admin        |
| PATCH  | `/:id/status`       | Block/unblock user              | Admin        |
| PATCH  | `/agent-approval`   | Approve/reject agent applicants | Admin        |

### Wallets (`/api/v1/wallets`)
| Method | Endpoint          | Description                     | Access         |
|--------|-------------------|---------------------------------|----------------|
| POST   | `/sendMoney`      | Transfer to another user        | User, Agent    |
| POST   | `/cashIn`         | Agent adds money to user wallet | Agent          |
| POST   | `/cashOut`        | Agent withdraws from wallet     | Agent          |
| PATCH  | `/:id/block`      | Admin wallet suspension         | Admin          |

### Transactions (`/api/v1/transactions`)
| Method | Endpoint             | Description                     | Access         |
|--------|----------------------|---------------------------------|----------------|
| GET    | `/`                  | All transactions (admin view)   | Admin          |
| GET    | `/myHistory`         | User transaction history        | User, Agent    |
| GET    | `/commission/:id`    | Agent commission records        | Agent          |

## 🔧 Setup Instructions

1. **Environment Setup**
```bash
# Clone repository
git clone https://github.com/Jeem312/Digital-Wallet-Backend
cd Digital-Wallet-Backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

2. **Environment Variables**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_URL=mongodb://localhost:27017/digital-wallet

# Admin Credentials
SUPER_ADMIN_EMAIL=admin@wallet.com
SUPER_ADMIN_PASSWORD=securepassword
SUPER_ADMIN_PHONE=+8801XXXXXXXXX

# Security
JWT_SECRET=your_jwt_secret
BCRYPT_SALT_ROUNDS=12
```

3. **Running the Application**
```bash
# Development mode
npm run dev

# Production build
npm run build && npm start

# Run tests
npm test
```

## 🛡️ Security Features

- **Role Validation Middleware**
```typescript
// Example: Agent-only endpoint
router.post('/cashIn', checkAuth('agent'), walletController.cashIn);
```

- **Transaction Validation**
```typescript
// Prevents negative balances
if (userWallet.balance < amount) {
  throw new AppError(400, "Insufficient funds");
}
```

- **Rate Limiting**
```typescript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20 // Limit each IP to 20 requests per window
});

app.use('/api/v1/auth/login', authLimiter);
```

## 📊 Sample API Request

**Agent Approval:**
```http
PATCH /api/v1/users/agent-approval?id=USER_ID&status=accepted
Headers: { Authorization: Bearer <admin_token> }
```

**Successful Response:**
```json
{
  "success": true,
  "message": "Agent accepted",
  "data": {
    "id": "USER_ID",
    "role": "agent",
    "status": "active"
  }
}
```

## 🐛 Troubleshooting

**Common Issues:**
1. **Routes not working in production**
   - Ensure all TypeScript files are compiled to JS in `dist/`
   - Verify Vercel deployment is using Node.js runtime

2. **Authentication failures**
   - Check JWT token expiration
   - Verify `Authorization` header format: `Bearer <token>`

3. **Database connection issues**
   - Confirm MongoDB URI in `.env`
   - Check network access if using cloud database



## 👩‍💻 Author
**Sanjida Jahan Jeem**  
[GitHub](https://github.com/Jeem312) 
```

