# ChocE Moments Backend API

Express.js backend server for ChocE Moments application.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your MongoDB connection string and JWT secret

3. **Start the server:**
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000` (or the port specified in `.env`)

## Environment Variables

Create a `.env` file with the following:

```env
DATABASE_URL=mongodb://localhost:27017/choce_moments
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

## API Endpoints

### Users
- `POST /api/users` - Create new user
- `POST /api/users/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:productId` - Get product by ID
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:productId` - Update product (auth required)
- `DELETE /api/products/:productId` - Delete product (auth required)

### Orders
- `GET /api/orders` - Get all orders (auth required)
- `POST /api/orders` - Create order (auth required)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

