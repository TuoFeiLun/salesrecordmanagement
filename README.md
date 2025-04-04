# Car Sales Management API

A RESTful API for managing car sales, customers, and inventory.

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start MongoDB:
   ```
   brew services start mongodb-community
   ```
4. Start the server:
   ```
   node server.js
   ```
   
The server will start on port 4008 by default: http://localhost:4008

## API Documentation

All API endpoints are prefixed with `/api`. Authentication is required for most endpoints except for login, registration, and public listings.

### Authentication

#### Register a new user
```
POST /api/auth/register
```
Body:
```json
{
  "username": "string",
  "password": "string",
  "is_admin": boolean (optional)
}
```

#### Login
```
POST /api/auth/login
```
Body:
```json
{
  "username": "string",
  "password": "string"
}
```
Response:
```json
{
  "token": "JWT_TOKEN",
  "user_id": "string",
  "is_admin": boolean,
  "username": "string"
}
```

### Cars

#### Get all cars
```
GET /api/cars
```
Query parameters (optional):
- brandname
- cartype
- productionarea
- price

#### Get a specific car
```
GET /api/cars/:id
```

#### Create a new car (requires authentication)
```
POST /api/cars
```
Body:
```json
{
  "brandname": "string",
  "cartype": "string",
  "price": number,
  "productionarea": "string"
}
```

#### Update a car (requires authentication, admin or creator only)
```
PUT /api/cars/:id
```
Body: Same as create

#### Delete a car (requires authentication, admin only)
```
DELETE /api/cars/:id
```

### Customers

All customer endpoints require authentication.

#### Get all customers
```
GET /api/customer
```
Query parameters (for pagination):
- page
- limit

Note: Non-admin users can only view customers they created.

#### Get a specific customer
```
GET /api/customer/:id
```
Note: Non-admin users can only view customers they created.

#### Create a new customer
```
POST /api/customer
```
Body:
```json
{
  "firstname": "string",
  "lastname": "string",
  "cars": ["car_id1", "car_id2"] (optional)
}
```

#### Update a customer (admin or creator only)
```
PUT /api/customer/:id
```
Body: Same as create

#### Delete a customer (admin or creator only)
```
DELETE /api/customer/:id
```

### Sales Records

#### Get all sales records
```
GET /api/salesrecord
```
Query parameters (optional):
- buyerName
- carBrand
- purchasedate
- transactionprice

#### Get a specific sales record
```
GET /api/salesrecord/:id
```

#### Create a new sales record (requires authentication, admin only)
```
POST /api/salesrecord
```
Body:
```json
{
  "buyer": "customer_id",
  "car": "car_id",
  "purchasedate": "date",
  "transactionprice": number
}
```

#### Update a sales record (requires authentication, admin only)
```
PUT /api/salesrecord/:id
```
Body: Same as create

#### Delete a sales record (requires authentication, admin only)
```
DELETE /api/salesrecord/:id
```

## Error Handling

The API returns appropriate HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Error responses include an error message and details when applicable.

## Rate Limiting

The API implements rate limiting to prevent abuse:
- Auth endpoints: 10 requests per hour
- General API: 150 requests per 15 minutes
- Create operations: 60 requests per hour

## Authentication

This API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header for protected routes:

```
Authorization: Bearer YOUR_JWT_TOKEN
```
