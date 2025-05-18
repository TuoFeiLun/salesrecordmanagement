# Car Sales Management API

A RESTful API for managing car information, customers, 
and sales records. This system allows you to track car ownership through customer management and monitor car usage via sales records. 
It functions as a car exchange platform for a car club.  

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

## Features

- User authentication with JWT tokens and role-based permissions
- CRUD operations for cars, customers, and sales records
- Admin-restricted functions for sensitive operations
- Query filtering and sorting for all resource endpoints
- Pagination support for data retrieval
- Rate limiting to prevent API abuse
- Detailed error handling with appropriate HTTP status codes
- Logging of API requests

## Architecture

The application follows a classic MVC (Model-View-Controller) architecture:

- **Models** (`src/models/`): Mongoose schemas that define the data structure
  - User: Authentication details and user roles
  - Car: Vehicle information including brand, type, price, and production area
  - Customer: Client details including name and owned cars
  - SalesRecord: Transaction details between customers and cars

- **Controllers** (`src/controllers/`): Business logic that handles requests and responses
  - Separate controllers for each resource type
  - Authentication controllers for user management

- **Routes** (`src/routes/`): Express routes that map API endpoints to controller functions
  - Clean separation of concerns with dedicated routers for each resource

- **Middleware** (`src/middleware/`):
  - JWT authentication
  - Request validation
  - Rate limiting
  - Query parameter processing

## API Endpoints Summary

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate and receive JWT token

### Cars
- `GET /api/cars`: List all cars (with optional filters)
- `GET /api/cars/:id`: Get a specific car
- `POST /api/cars`: Create a new car
- `PUT /api/cars/:id`: Update a car
- `DELETE /api/cars/:id`: Delete a car

### Customers
- `GET /api/customer`: List all customers (with pagination)
- `GET /api/customer/:id`: Get a specific customer
- `POST /api/customer`: Create a new customer
- `PUT /api/customer/:id`: Update a customer
- `DELETE /api/customer/:id`: Delete a customer

### Sales Records
- `GET /api/salesrecord`: List all sales records (with optional filters)
- `GET /api/salesrecord/:id`: Get a specific sales record
- `POST /api/salesrecord`: Create a new sales record
- `PUT /api/salesrecord/:id`: Update a sales record
- `DELETE /api/salesrecord/:id`: Delete a sales record

## Dependencies

The application relies on the following main dependencies:

- **Express**: Web framework for building the API
- **Mongoose**: MongoDB object modeling tool
- **JWT**: Authentication using JSON Web Tokens
- **bcrypt**: Password hashing
- **express-validator**: Request validation
- **express-rate-limit**: API rate limiting
- **mongoose-paginate-v2**: Pagination support
- **morgan**: HTTP request logger

### Installing Dependencies

All dependencies can be installed with npm:

```
npm install
```

This will install all dependencies listed in the package.json file.

## Contributing

We welcome contributions to improve the Car Sales Management API. Here's how you can contribute:

1. **Fork the repository**
2. **Create a feature branch**
   ```
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**
   ```
   git commit -m "Add your meaningful commit message"
   ```
4. **Push to your branch**
   ```
   git push origin feature/your-feature-name
   ```
5. **Create a Pull Request**

### Contribution Guidelines
- Follow the existing code style and patterns
- Add tests for new features
- Update documentation for any changes
- Make sure all tests pass before submitting a PR

## Reporting Issues

If you encounter any bugs or have feature requests, please report them through the following channels:

1. **GitHub Issues**: Create a new issue with a descriptive title and clear description
2. Include steps to reproduce the issue
3. Specify your environment details (Node.js version, MongoDB version, etc.)
4. If possible, include screenshots or code examples

For security vulnerabilities, please contact the repository owner directly rather than creating a public issue.
