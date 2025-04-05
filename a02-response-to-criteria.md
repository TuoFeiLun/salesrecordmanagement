# IFN666_25se1 Assessment 02 Submission

**Student name:**  Jimmy Li

**Student ID:** n11673524

# Response to marking criteria

## (API) Core: Application architecture (1 mark)

- **One line description:** Implemented a structured MVC architecture using Express.js with clear separation of concerns through modular components for models, views (API responses), controllers, and middleware.
- **Relevant files**
   - src/server.js
   - src/routes/index.js
   - src/models/
   - src/controllers/

## (API) Core: Endpoints (2 marks)

- **One line description:** Designed and implemented RESTful API endpoints with consistent naming conventions and HTTP methods (GET, POST, PUT, DELETE) for all resources to support complete CRUD functionality.
- **Relevant files**
   - src/routes/car.js
   - src/routes/customer.js
   - src/routes/salesrecord.js
   - src/routes/auth.js
   - src/routes/index.js

## (API) Core: Data model (3 marks)

- **One line description:** Created comprehensive MongoDB data models using Mongoose with proper schema validation, relationships between entities, and structured field definitions reflecting real business requirements.
- **Relevant files**
   - src/models/car.js
   - src/models/customer.js
   - src/models/salesrecord.js
   - src/models/user.js

## (API) Core: Data interface (3 marks)

- **One line description:** Developed controller modules with structured error handling, transaction support, and optimized database operations for efficient data manipulation across all entity types.
- **Relevant files**
   - src/controllers/carController.js
   - src/controllers/customerController.js
   - src/controllers/salesrecordController.js
   - src/controllers/auth.js

## (API) Core: Deployment to web server (3 marks)

- **One line description:** Successfully deployed the API with environment-specific configuration, production-ready logging using Morgan, and appropriate error handling for a robust server environment.
- **Relevant files**
   - server.js
   - .env
   - package.json

## (API) Core: API testing with Hoppscotch (3 marks)

- **One line description:** Created comprehensive API test collections with Hoppscotch covering all endpoints, documented with example requests and responses, and organized by resource type.
- **Relevant files**
   - API-collection.json
   - README.md

## (API) Additional: Authentication (3 marks)

- **One line description:** Implemented secure JWT-based authentication with proper token validation, secure password storage with bcrypt, and middleware for protecting sensitive routes.
- **Relevant files**
   - src/controllers/auth.js
   - src/models/user.js
   - src/middleware/authenticateWithJwt.js
   - src/routes/auth.js

## (API) Additional: Input validation (3 marks)

- **One line description:** Created robust input validation middleware using express-validator with custom validators for specialized fields and consistent error reporting across all API endpoints.
- **Relevant files**
   - src/middleware/validateCarParameters.js
   - src/middleware/validateCustomerParameters.js
   - src/middleware/validateSalesRecordParameters.js
   - src/middleware/validateMongoId.js

## (API) Additional: Rate limiting (3 marks)

- **One line description:** Implemented tiered rate limiting with express-rate-limit providing different thresholds for authentication, general API usage, and resource creation to protect against abuse.
- **Relevant files**
   - src/middleware/rateLimiter.js
   - server.js

## (API) Additional: Query filtering (3 marks)

- **One line description:** Created a flexible query builder middleware that supports complex filtering operations with parameter validation, allowing dynamic queries across multiple fields and value types.
- **Relevant files**
   - src/middleware/queryBuilder.js
   - src/controllers/salesrecordController.js

## (API) Additional: Pagination (3 marks)

- **One line description:** Implemented HATEOAS-compliant pagination with dynamic link generation, customizable page sizes, and metadata that follows REST API best practices.
- **Relevant files**
   - src/utils/generatePaginationLinks.js
   - src/middleware/validatePaginateQueryParams.js
   - src/controllers/customerController.js
   - src/controllers/salesrecordController.js

## (API) Additional: Use of third-party APIs (3 marks)

- **One line description:** Integrated the CarQuery external API with proper error handling, response transformation, and caching strategies to enhance the application's car data capabilities.
- **Relevant files**
   - src/controllers/carInfoSearchController.js
   - src/routes/car.js

## (API) Additional: Role-based Access Control (3 marks)

- **One line description:** Implemented a role-based access control system that enforces different permissions for administrators and regular users, with proper authorization checks in controllers.
- **Relevant files**
   - src/models/user.js
   - src/controllers/auth.js
   - src/controllers/carController.js
   - src/controllers/customerController.js
   - src/controllers/salesrecordController.js




 