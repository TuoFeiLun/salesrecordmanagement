# IFN666_25se1 Assessment 02 Submission

**Student name:** Jimmy Li

**Student ID:** n11673524

# Response to marking criteria

## (API) Core: Application architecture (1 mark)

- **One line description:** Implemented a structured MVC architecture using Express.js with clear separation of concerns through modular components for models, views (API responses), controllers, and middleware.
- **Video timestamp:** 8:20
- **Relevant files**
  - src/server.js
  - src/routes/index.js
  - src/models/
  - src/controllers/

## (API) Core: Endpoints (2 marks)

- **One line description:** Designed and implemented RESTful API endpoints with consistent naming conventions and HTTP methods (GET, POST, PUT, DELETE) for all resources to support complete CRUD functionality.
- **Video timestamp:** 8:30
- **Relevant files**
  - src/routes/car.js
  - src/routes/customer.js
  - src/routes/salesrecord.js
  - src/routes/auth.js
  - src/routes/index.js

## (API) Core: Data model (3 marks)

- **One line description:** Created comprehensive MongoDB data models using Mongoose with proper schema validation, relationships between entities, and structured field definitions reflecting real business requirements.
- **Video timestamp:** 8:35
- **Relevant files**
  - src/models/car.js
  - src/models/customer.js
  - src/models/salesrecord.js
  - src/models/user.js

## (API) Core: Data interface (3 marks)

- **One line description:** Developed controller modules with structured error handling, transaction support, and optimized database operations for efficient data manipulation across all entity types.
- **Video timestamp:** 8:44
- **Relevant files**
  - src/controllers/carController.js
  - src/controllers/customerController.js
  - src/controllers/salesrecordController.js
  - src/controllers/auth.js

## (API) Core: Deployment to web server (3 marks)

- **One line description:** Successfully deployed the API with environment-specific configuration, production-ready logging using Morgan, and appropriate error handling for a robust server environment.
- **Video timestamp:** 2:20
- **Relevant files**
  - server.js
  - .env
  - package.json

## (API) Core: API testing with Hoppscotch (3 marks)

- **One line description:** Created comprehensive API test collections with Hoppscotch covering all endpoints, documented with example requests and responses, and organized by resource type.
- **Video timestamp:** 7:10
- **Relevant files**
  - API-collection.json
  - README.md

## (API) Additional: Authentication (3 marks)

- **One line description:** Implemented secure JWT-based authentication with proper token validation, secure password storage with bcrypt, and middleware for protecting sensitive routes.
- **Video timestamp:** 2:06
- **Relevant files**
  - src/controllers/auth.js
  - src/models/user.js
  - src/middleware/authenticateWithJwt.js
  - src/routes/auth.js

## (API) Additional: Input validation (3 marks)

- **One line description:** Created robust input validation middleware using express-validator with custom validators for specialized fields and consistent error reporting across all API endpoints.
- **Video timestamp:** 7:50
- **Relevant files**
  - src/middleware/validateCarParameters.js
  - src/middleware/validateCustomerParameters.js
  - src/middleware/validateSalesRecordParameters.js
  - src/middleware/validateMongoId.js

## (API) Additional: Rate limiting (3 marks)

- **One line description:** Implemented tiered rate limiting with express-rate-limit providing different thresholds for authentication, general API usage, and resource creation to protect against abuse.
- **Video timestamp:** 8:50
- **Relevant files**
  - src/middleware/rateLimiter.js
  - server.js

## (API) Additional: Query filtering (3 marks)

- **One line description:** Created a flexible query builder middleware that supports complex filtering operations with parameter validation, allowing dynamic queries across multiple fields and value types.
- **Video timestamp:** 5:50
- **Relevant files**
  - src/middleware/queryBuilder.js
  - src/controllers/salesrecordController.js

## (API) Additional: Pagination (3 marks)

- **One line description:** Implemented standardized pagination across API endpoints with request validation, customizable page sizes, and consistent metadata in response bodies for efficient client-side rendering.
- **Video timestamp:** 6:00
- **Relevant files**
  - src/middleware/validatePaginateQueryParams.js
  - src/controllers/customerController.js
  - src/controllers/salesrecordController.js

## (API) Additional: Use of third-party APIs (3 marks)

- **One line description:** Integrated the CarQuery external API with proper error handling, response transformation, and caching strategies to enhance the application's car data capabilities.
- **Video timestamp:** 3:22
- **Relevant files**
  - src/controllers/carInfoSearchController.js
  - src/routes/car.js

## (API) Additional: Role-based Access Control (3 marks)

- **One line description:** Implemented a role-based access control system that enforces different permissions for administrators and regular users, with proper authorization checks in controllers.
- **Video timestamp:** 6:30
- **Relevant files**
  - src/models/user.js
  - src/controllers/auth.js
  - src/controllers/carController.js
  - src/controllers/customerController.js
  - src/controllers/salesrecordController.js

## web client side

## (Client) Core: Application architecture (3 marks)

- **One line description:** The application follows a structured React architecture with modular components, context-based state management, and route protection for authenticated resources.
- **Video timestamp:** 9:00
- **Relevant files**
  - src/App.jsx
  - src/components/ProtectedRoute.jsx
  - src/contexts/AuthContext.jsx
  - src/utils/api.js

## (Client) Core: User interface design (3 marks)

- **One line description:** The application features a responsive and intuitive Mantine-based user interface with navigation sidebar, data tables, forms, and modals providing a consistent user experience.
- **Video timestamp:** 9:10
- **Relevant files**
  - src/components/AppNavigation.jsx
  - src/components/AppNavigation.module.css
  - src/pages/Cars.jsx
  - src/pages/Customers.jsx
  - src/pages/SalesRecords.jsx

## (Client) Core: React components (3 marks)

- **One line description:** The application utilizes reusable and functional React components with proper props handling, hooks for state management, and separation of concerns for different functionality areas.
- **Video timestamp:** 9:15
- **Relevant files**
  - src/components/ProtectedRoute.jsx
  - src/pages/Dashboard.jsx
  - src/pages/Login.jsx
  - src/pages/Register.jsx
  - src/pages/SalesRecords.jsx

## (Client) Core: State management (3 marks)

- **One line description:** The application implements context-based state management for authentication and local state for component-specific data, ensuring efficient data flow throughout the application.
- **Video timestamp:** 10:01
- **Relevant files**
  - src/contexts/AuthContext.jsx
  - src/pages/Cars.jsx
  - src/pages/SalesRecords.jsx
  - src/pages/Login.jsx
  - src/pages/Register.jsx

## (Client) Core: API integration (3 marks)

- **One line description:** The application effectively integrates with backend APIs through Axios, handling authentication tokens, request/response interceptors, and organizing API calls by resource type.
- **Video timestamp:** 10:20
- **Relevant files**
  - src/utils/api.js
  - src/pages/Cars.jsx
  - src/pages/Customers.jsx
  - src/pages/SalesRecords.jsx
  - .env

## (Client) Additional: Authentication (3 marks)

- **One line description:** The application implements a comprehensive authentication system with login, registration, token storage, automatic login after registration, and protected routes.
- **Video timestamp:** : 02:12
- **Relevant files**
  - src/contexts/AuthContext.jsx
  - src/components/ProtectedRoute.jsx
  - src/pages/Login.jsx
  - src/pages/Register.jsx
  - src/utils/api.js

## (Client) Additional: Input validation (3 marks)

- **One line description:** The application includes client-side validation for form inputs, ensuring data integrity with appropriate error messages and visual feedback.
- **Video timestamp:** 4:10
- **Relevant files**
  - src/pages/Login.jsx
  - src/pages/Register.jsx
  - src/pages/Cars.jsx
  - src/pages/Customers.jsx
  - src/pages/SalesRecords.jsx

## (Client) Additional: Search and Sort (3 marks)

- **One line description:** The application implements comprehensive search and sort functionality for data tables, with parameterized queries and UI controls for intuitive user interaction.
- **Video timestamp:** 05:41
- **Relevant files**
  - src/pages/Cars.jsx
  - src/pages/Customers.jsx
  - src/pages/SalesRecords.jsx

## (Client) Additional: Pagination (3 marks)

- **One line description:** The application incorporates pagination for large datasets, maintaining UI performance while allowing users to navigate through data pages efficiently.
- **Video timestamp:** 05:34
- **Relevant files**
  - src/pages/SalesRecords.jsx
  - src/utils/api.js

## (Client) Additional: Accessibility (3 marks)

- **One line description:** The application ensures basic accessibility with semantic HTML, proper labeling, keyboard navigation support, and appropriate ARIA attributes for interactive elements.
- **Video timestamp:** 02:15
- **Relevant files**
  - src/components/AppNavigation.jsx
  - src/pages/Login.jsx
  - src/pages/Register.jsx
  - src/pages/Cars.jsx
  - src/pages/SalesRecords.jsx
