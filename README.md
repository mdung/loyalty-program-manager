# Loyalty Program Manager

A complete full-stack web application for managing customer loyalty programs with points earning, redemption, tier management, and multi-branch support.

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- PostgreSQL
- Flyway for database migrations
- Maven

### Frontend
- React 18
- TypeScript
- Material UI
- Vite
- React Router
- Axios

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm/yarn
- PostgreSQL 12+
- Git

## Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE loyalty_db;
CREATE USER loyalty_user WITH PASSWORD 'loyalty_pass';
GRANT ALL PRIVILEGES ON DATABASE loyalty_db TO loyalty_user;
```

2. Update database credentials in `backend/src/main/resources/application.yml` if needed.

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will start on `http://localhost:3000`

## Default Admin Account

- **Username:** `admin`
- **Password:** `admin123`

**Note:** Change the default password after first login in production!

## Docker Setup (Optional)

A `docker-compose.yml` file is provided for easy deployment:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 8080
- Frontend on port 3000

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (for initial admin)

### Customers
- `GET /api/customers` - List customers (with pagination and filters)
- `GET /api/customers/{id}` - Get customer details
- `GET /api/customers/{id}/summary` - Get customer summary
- `GET /api/customers/{id}/transactions` - Get customer transactions
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer

### Tiers
- `GET /api/tiers` - List all tiers
- `POST /api/tiers` - Create tier
- `PUT /api/tiers/{id}` - Update tier
- `DELETE /api/tiers/{id}` - Delete tier

### Stores
- `GET /api/stores` - List all stores
- `POST /api/stores` - Create store
- `PUT /api/stores/{id}` - Update store
- `DELETE /api/stores/{id}` - Delete store

### Transactions
- `GET /api/transactions` - List transactions (with filters)
- `POST /api/transactions/earn` - Earn points
- `POST /api/transactions/redeem` - Redeem points
- `POST /api/transactions/adjust` - Adjust points (Admin/Manager only)

### Rewards
- `GET /api/rewards` - List all rewards
- `POST /api/rewards` - Create reward
- `PUT /api/rewards/{id}` - Update reward
- `DELETE /api/rewards/{id}` - Delete reward
- `GET /api/rewards/redemptions` - List redemptions
- `PUT /api/rewards/redemptions/{id}/approve` - Approve redemption
- `PUT /api/rewards/redemptions/{id}/reject` - Reject redemption
- `PUT /api/rewards/redemptions/{id}/complete` - Complete redemption

### Campaigns
- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/{id}` - Update campaign
- `DELETE /api/campaigns/{id}` - Delete campaign

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/top-customers` - Get top customers

### Users (Admin only)
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Features

- **Customer Management**: Register and manage customer profiles with membership codes
- **Points System**: Earn points from purchases, redeem for rewards
- **Tier Management**: Define and manage customer tiers (Bronze, Silver, Gold, Platinum)
- **Multi-Branch Support**: Manage multiple stores/branches
- **Rewards Management**: Create and manage rewards (vouchers, discounts, gifts)
- **Campaigns**: Create promotional campaigns with earning multipliers
- **Transaction History**: Track all points movements
- **Dashboard**: View key metrics and statistics
- **Role-Based Access**: Admin, Manager, and Staff roles with different permissions

## Project Structure

```
loyalty-program-manager/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/company/loyalty/
│   │   │   │   ├── auth/          # Authentication
│   │   │   │   ├── customer/       # Customer management
│   │   │   │   ├── tier/          # Tier management
│   │   │   │   ├── store/         # Store management
│   │   │   │   ├── transaction/   # Transaction management
│   │   │   │   ├── reward/        # Reward management
│   │   │   │   ├── campaign/      # Campaign management
│   │   │   │   ├── dashboard/     # Dashboard
│   │   │   │   ├── user/          # User management
│   │   │   │   └── common/        # Common utilities
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── db/migration/   # Flyway migrations
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/           # API clients
│   │   ├── components/   # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Routing
│   │   ├── context/       # React context
│   │   └── utils/         # Utilities
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Development

### Running Tests

Backend:
```bash
cd backend
mvn test
```

### Building for Production

Backend:
```bash
cd backend
mvn clean package
java -jar target/loyalty-program-manager-1.0.0.jar
```

Frontend:
```bash
cd frontend
npm run build
# or
yarn build
```

## License

This project is proprietary software.

## Support

For issues and questions, please contact the development team.

