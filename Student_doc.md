
# SYSTEM DESCRIPTION:

The proposed system consists of a network of smart sensors deployed across parking areas in a city. Each sensor detects whether a parking area has vacant spaces and the collected data is aggregated in real-time and shared with users via a web interface optimized for mobile-use. For the realization of the project it is planned to create simulated sensors that send data to the system.

# USER STORIES:

1. As a driver, I want to sign up, so that I can use the site.
2. As a driver, I want to sign in, so that I can use the site.
3. As a driver, I want to logout, so that no one else use my account
4. As a driver, I want to see available parking spaces on an interactive map, so that I can quickly find a spot near my destination.
5. As a driver, I want to reserve a specific parking space, so that I can be sure it will be available when I arrive.
6. As a driver, I want to cancel my active reservation, so that the space is released for others to use.
7. As a driver, I want to navigate to my reserved parking space by using Google Maps link, so that I can easily reach it.
8. As a driver, I want to view my parking history, so that I can track my usage and expenses.
9. As a driver, I want to see the total price of a parking session, so that I know how much I will be charged.
10. As a driver, I want to create support tickets, so that I can get help in case of a problem.
11. As a driver, I want to edit my personal profile, so that my information is always up to date.
12. As a parking operator, I want to view real-time availability and occupancy of my lots, so that I can manage operations effectively.
13. As a parking operator, I want to sign up, so that I can use the site.
14. As a parking operator, I want to sign in, so that I can use the site.
15. As a parking operator, I want to logout, so that no one else use my account
16. As a parking operator, I want to add a new parking lot to the system, so that I can expand my managed fleet.
17. As a parking operator, I want to search and filter my parkings by name, so that I can quickly find a specific lot in my dashboard.
18. As a parking operator, I want to adjust the hourly pricing for my parking lots, so that I can implement dynamic pricing strategies.
19. As a parking operator, I want to update parking details like address, so that the information is always accurate for drivers.
20. As a parking operator, I want to remove a parking lot from the system, so that I can decommission outdated facilities.
21. As a parking operator, I want to modify the number of available spots in a lot, so that I can reflect maintenance work or capacity changes.
22. As a parking operator, I want to access a driver account view, so that I can also reserve parking spots when needed.
23. As a parking operator, I want to view my unique code, so that I can link my physical sensors to the platform for real-time data transmission.
24. As an admin, I want to sign in, so that I can use the site.
25. As an admin, I want to logout, so that no one else uses my account.
26. As an admin, I want to see all support tickets received from drivers and operators, so that I can provide timely assistance.
27. As an admin, I want to view dashboard metrics for opened tickets (total and daily), so that I can monitor them.
28. As an admin, I want to see lists of newly registered drivers and parking lots, so that I can track platform growth.
29. As an admin, I want to obtain parkings lists by operator email, so that I can efficiently address related issues.
30. As an admin, I want to edit any parking lot's details, so that I can correct errors or update information.
31. As an admin, I want to delete any parking lot from the system, so that I can manage inappropriate or decommissioned listings.
32. As the system, I want to simulate sensor data, so that I can test the platform without physical sensors.
33. As the system, I want to synchronize reservation status with sensor data, so that parking availability is always accurate.
34. As the system, I want to authenticate operators with secure unique codes, so that platform access is controlled and secure.

# CONTAINERS:

## CONTAINER_NAME: user-service

### DESCRIPTION: 
Manages all functionalities related to registration, login and logout for users, operators, and admin. Also manages user authorization based on his role and uniqueCode generation for operators.

### USER STORIES:

1. As a driver, I want to sign up, so that I can use the site.
2. As a driver, I want to sign in, so that I can use the site.
3. As a driver, I want to logout, so that no one else use my account
4. As a parking operator, I want to sign up, so that I can use the site.
5. As a parking operator, I want to sign in, so that I can use the site.
6. As a parking operator, I want to logout, so that no one else use my account
7. As an admin, I want to sign in, so that I can use the site.
8. As an admin, I want to logout, so that no one else use my account.
9. As a parking operator, I want to view my unique code, so that I can link my physical sensors to the platform for real-time data transmission.
10. As an admin, I want to see lists of newly registered drivers and parking lots, so that I can track platform growth. 

### PORTS: 
4001:4001

### DESCRIPTION:
The user-service container handles the core functionality of user management including login, registration, and unique code generation. It serves as the central service for all user-related operations on the platform.

### PERSISTANCE EVALUATION
The user-service container requires persistent storage to manage user account data. This includes securely storing user credentials (emails and hashed passwords), assigned roles (driver, operator, admin), and the generated unique codes for parking operators. These data are essential for user authentication and authorization and must be preserved across container restarts. At the same time generated user tokens don't need persistent storage since they are sent to the user after login. All data are stored in the PostgreSQL database.

### EXTERNAL SERVICES CONNECTIONS
The user-service container does not connect to third-party external services. It connects to an internal PostgreSQL database container for data persistence.

### MICROSERVICES:

#### MICROSERVICE: user
- TYPE: backend
- DESCRIPTION: Manages the creation and verification of tokens.
- PORTS: 4001
- TECHNOLOGICAL SPECIFICATION:
The microservice is developed in Node.js and uses Express.js, a minimal and flexible web application framework. It uses the following libraries and technologies:
    - Express.js: The microservice uses Express.js server to serve the APIs.
    - JWT (jsonwebtoken): The microservice handles JSON Web Tokens (JWT), commonly used for secure token-based authentication.
    - bcrypt: The bcrypt package is used for secure encryption and cryptographic operations.
    - body-parser: The body-parser package is the Node.js body-parsing middleware, responsible for parsing the incoming request bodies and transforming data payloads that contains into a readable format.
    - cors: The cors package is a middleware that allows a server to specify which external origins (domains) are permitted to access its resources.
    - pg: Non-blocking PostgreSQL client for Node.js.
    - sequelize: Sequelize is an open-source Node.js Object-Relational Mapper (ORM) that makes it easy to work with relational databases like PostgreSQL.
 	- dotenv: Is a module that loads environment variables from a `.env` file.
- SERVICE ARCHITECTURE: 
The microservice follows a layered MVC (Model-View-Controller) pattern built on Express.js. It is structured with clear separation of concerns: **Models** (Sequelize ORM for data), **Routes** (controllers handling HTTP API logic), and **Middleware** (authentication, authorization, and utilities).

- ENDPOINTS:

		
	| HTTP METHOD | URL | Description | User Stories |
	| ----------- | --- | ----------- | ------------ |
	| **POST** | `/auth/register` | Registers a new user. Hashes password and creates a user record. Generates a unique code for operators/admins. | 1, 13 |
	| **POST** | `/auth/login` | Authenticates a user. Verifies email/password and returns a JWT token upon success. | 2, 14, 24 |
	| **POST** | `/auth/user` | **(Authenticated)** Allows a user to update their own profile information (name, surname, email, password). | 11 |
	| **GET** | `/auth/stats` | **(Admin Only)** Returns the total count of users in the system. | 28 |
	| **GET** | `/auth/list` | **(Admin Only)** Returns a list of the latest registered users, formatted with their registration date and reservation count. | 28 |
	| **GET** | `/me/uniqueCode` | **(Operator only)** Returns the unique code for the currently authenticated user. | 23 |


## CONTAINER_NAME: reservations-service

### DESCRIPTION: 
Handles all operations related to parking reservations, parking lot management, and real-time parking availability.

### USER STORIES:
1. As a driver, I want to see available parking spaces on an interactive map, so that I can quickly find a spot near my destination.
2. As a driver, I want to reserve a specific parking space, so that I can be sure it will be available when I arrive.
3. As a driver, I want to cancel my active reservation, so that the space is released for others to use.
4. As a driver, I want to view my parking history, so that I can track my usage and expenses.
5. As a parking operator, I want to view real-time availability and occupancy of my lots, so that I can manage operations effectively.
6. As a parking operator, I want to add a new parking lot to the system, so that I can expand my managed fleet.
7. As a parking operator, I want to search and filter my parkings by name, so that I can quickly find a specific lot in my dashboard.
8. As a parking operator, I want to adjust the hourly pricing for my parking lots, so that I can implement dynamic pricing strategies.
9. As a parking operator, I want to update parking details like address, so that the information is always accurate for drivers.
10. As a parking operator, I want to remove a parking lot from the system, so that I can decommission outdated facilities.
11. As a parking operator, I want to modify the number of available spots in a lot, so that I can reflect maintenance work or capacity changes.
12. As an admin, I want to see lists of newly registered drivers and parking lots, so that I can track platform growth.
13. As an admin, I want to obtain parkings lists by operator email, so that I can efficiently address related issues.
14. As an admin, I want to edit any parking lot's details, so that I can correct errors or update information.
15. As an admin, I want to delete any parking lot from the system, so that I can manage inappropriate or decommissioned listings.

### PORTS:
4002:4002

### DESCRIPTION:
The reservations-service container handles the core functionality of parking management including reservation creation, parking lot operations, and real-time availability tracking. It serves as the central service for all parking and reservations related operations on the platform.

### PERSISTANCE EVALUATION
The reservations-service requires persistent storage to maintain reservation records, parking lot information, and historical data. This includes storing reservation details (start/end times, pricing, status) and parking lot specifications (coordinates, capacity, pricing). All data are stored in the PostgreSQL database.

### EXTERNAL SERVICES CONNECTIONS
The reservations-service container does not connect to third-party external services. It connects to an internal PostgreSQL database container for data persistence. The reservations-service connects to the ingestion-service for real-time sensor data updates regarding reservation status changes.

### MICROSERVICES:

#### MICROSERVICE: reservation
- TYPE: backend
- DESCRIPTION: Handles all reservation operations including creation, cancellation, and management. Provides parking lot management capabilities for operators and administrators.
- PORTS: 4002
- TECHNOLOGICAL SPECIFICATION:
The microservice is developed in Node.js and uses Express.js, a minimal and flexible web application framework. It uses the following libraries and technologies:
    - Express.js: The microservice uses Express.js server to serve the APIs.
    - body-parser: The body-parser package is the Node.js body-parsing middleware, responsible for parsing the incoming request bodies and transforming data payloads that contains into a readable format.
    - cors: The cors package is a middleware that allows a server to specify which external origins (domains) are permitted to access its resources.
    - pg: Non-blocking PostgreSQL client for Node.js.
    - sequelize: Sequelize is an open-source Node.js Object-Relational Mapper (ORM) that makes it easy to work with relational databases like PostgreSQL.
	- Axios: For making HTTP requests to external services
	- dotenv: Is a module that loads environment variables from a `.env` file.
- SERVICE ARCHITECTURE:
The microservice follows a layered MVC (Model-View-Controller) pattern built on Express.js. It is structured with clear separation of concerns: **Models** (Sequelize ORM for data), **Routes** (controllers handling HTTP API logic), and **Middleware** (authentication, authorization, and utilities).

- ENDPOINTS:

    | HTTP METHOD | URL | Description | User Stories |
	| ----------- | --- | ----------- | ------------ |
	| **POST** | `/reservations` | Creates a new reservation for the authenticated user. Calculates price based on parking hourly rate and duration. | 5 |
	| **POST** | `/reservations/:id/cancel` | Cancels a specific reservation. The user must be the owner of the reservation. | 6 |
	| **GET** | `/reservations` | Retrieves all reservations for the currently authenticated user. Includes parking details. | 8 |
	| **GET** | `/reservations/active/:parkingId` | Gets all active reservations for a specific parking lot. | 12 |
	| **POST** | `/parkings` | **(Operator Only)** Creates a new parking lot. The logged-in operator is set as the owner. | 16 |
	| **GET** | `/parkings/list` | **(Operator Only)** Lists all parking lots owned by the logged-in operator. | 17 |
	| **GET** | `/reservations/stats/today` | **(Admin Only)** Gets the count of reservations made today. | 28 |
	| **GET** | `/parkings/list/admin` | **(Admin Only)** Lists the latest parking lots. | 28 |
	| **GET** | `/parkings/list/admin/search` | **(Admin Only)** Searches for parking lots by operator email. | 29 |
	| **POST** | `/parkings/:id` | **(Operator/Admin)** Edits a parking lot. Operators can only edit their own parkings. | 18, 19, 21, 30  |
	| **DELETE** | `/parkings/:id` | **(Operator/Admin)** Soft-deletes a parking lot and cancels all its active reservations. Operators can only delete their own. | 20, 31 |
	| **GET** | `/parkings/:id/stats` | **(Operator/Admin)** Gets detailed statistics (occupancy, reservations) for a specific parking lot. | 12 |
	| **GET** | `/parkings/nearby` | Finds parking lots within a specified radius (default 2km) of given coordinates. | 4 |

- DB STRUCTURE: 
	**_Reservation_** : | **_id_** | userId | parkingId | carPlate | startTime | endTime | status | price | createdAt | updatedAt |
	**_Parking_** : | **_id_** | name | latitude | longitude | city | address | totalSpots | occupiedSpots | hourlyPrice | type | operatorId | deleted | createdAt | updatedAt |

## CONTAINER_NAME: tickets-service

### DESCRIPTION: 
Handles customer support ticket management, allowing users to submit assistance requests and administrators to view support tickets.

### USER STORIES:
1. As a driver, I want to create support tickets, so that I can get help in case of a problem.
2. As an admin, I want to see all support tickets received from drivers and operators, so that I can provide timely assistance.
3. As an admin, I want to view dashboard metrics for opened tickets (total and daily), so that I can monitor them.

### PORTS:
4003:4003

### DESCRIPTION:
The tickets-service manages customer support functionality for the parking platform. It provides endpoints for users to submit assistance requests and for administrators to monitor support tickets with statistics.

### PERSISTANCE EVALUATION
The service requires persistent storage to maintain ticket data including user contact information, messages, and timestamps. All ticket submissions and their data are stored in the PostgreSQL database.

### EXTERNAL SERVICES CONNECTIONS
The reservations-service container does not connect to third-party external services. It connects to an internal PostgreSQL database container for data persistence.

### MICROSERVICES:

#### MICROSERVICE: ticket
- TYPE: backend
- DESCRIPTION: Manages customer support ticket operations including submission, retrieval, and giving statistical informations for administrative purposes.
- PORTS: 4003
- TECHNOLOGICAL SPECIFICATION:
The microservice is developed in Node.js and uses Express.js, a minimal and flexible web application framework. It uses the following libraries and technologies:
    - Express.js: The microservice uses Express.js server to serve the APIs.
    - body-parser: The body-parser package is the Node.js body-parsing middleware, responsible for parsing the incoming request bodies and transforming data payloads that contains into a readable format.
    - cors: The cors package is a middleware that allows a server to specify which external origins (domains) are permitted to access its resources.
    - pg: Non-blocking PostgreSQL client for Node.js.
    - sequelize: Sequelize is an open-source Node.js Object-Relational Mapper (ORM) that makes it easy to work with relational databases like PostgreSQL.
	- dotenv: Is a module that loads environment variables from a `.env` file.
- SERVICE ARCHITECTURE:
The microservice follows a layered MVC (Model-View-Controller) pattern built on Express.js. It is structured with clear separation of concerns: **Models** (Sequelize ORM for data), **Routes** (controllers handling HTTP API logic), and **Middleware** (authentication, authorization, and utilities).

- ENDPOINTS:

    | HTTP METHOD | URL | Description | User Stories |
	| ----------- | --- | ----------- | ------------ |
	| **POST** | `/tickets` | Submits a new support ticket from a user | 10 |
	| **GET** | `/tickets` | **(Admin Only)** Retrieves the latest support tickets | 26 |
	| **GET** | `/tickets/stats` | **(Admin Only)** Gets ticket statistics including total and daily counts | 27 |

- DB STRUCTURE: 
	**_Ticket_** : | **_id_** | name | email | message | createdAt | updatedAt |

## CONTAINER_NAME: ingestion-service

### DESCRIPTION: 
Handles real-time data ingestion from parking sensors and manages reservation status updates. Processes sensor events (enter/exit) and reservation lifecycle events (created/cancelled/expired) through RabbitMQ message queues.

### USER STORIES:
1. As a parking operator, I want to view real-time availability and occupancy of my lots, so that I can manage operations effectively.
2. As the system, I want to synchronize reservation status with sensor data, so that parking availability is always accurate.
3. As the system, I want to authenticate operators with secure unique codes, so that platform access is controlled and secure.

### PORTS:
3000:3000

### DESCRIPTION:
The ingestion-service acts as the central nervous system for real-time data processing. It consumes sensor events from physical parking sensors via RabbitMQ, validates operator authentication through unique codes, updates parking occupancy in real-time, and manages reservation expiration through automated cron jobs.

### PERSISTANCE EVALUATION
The service requires persistent storage to maintain parking occupancy data and reservation statuses. All data are stored in the PostgreSQL database.

### EXTERNAL SERVICES CONNECTIONS
The reservations-service container does not connect to third-party external services. It connects to an internal PostgreSQL database container for data persistence and to RabbitMQ message broker for real-time event processing and reservations-service for reservation status updates.

### MICROSERVICES:

#### MICROSERVICE: ingestion
- TYPE: backend
- DESCRIPTION: Real-time event processor that handles sensor data ingestion, reservation status management, and parking occupancy updates through message queues.
- PORTS: 3000
- TECHNOLOGICAL SPECIFICATION:
The microservice is developed in Node.js and uses RabbitMQ message queue. It uses the following libraries and technologies:
    - Express.js: The microservice uses Express.js server to serve the APIs.
    - body-parser: The body-parser package is the Node.js body-parsing middleware, responsible for parsing the incoming request bodies and transforming data payloads that contains into a readable format.
    - pg: Non-blocking PostgreSQL client for Node.js.
    - sequelize: Sequelize is an open-source Node.js Object-Relational Mapper (ORM) that makes it easy to work with relational databases like PostgreSQL.
    - bcrypt: The bcrypt package is used for cryptographic operations.
	- AMQPLib: For RabbitMQ message queue integration.
	- node-cron: For scheduled reservation expiration checks.
- SERVICE ARCHITECTURE:
The service follows an event-driven architecture with RabbitMQ Message Queue Consumer for listen to sensor events. In addition it uses REST endpoints for reservation event publishing to reservations service.

- ENDPOINTS:

    | HTTP METHOD | URL | Description | User Stories |
	| ----------- | --- | ----------- | ------------ |
	| **POST** | `/reservation` | Publishes reservation events (created/cancelled/expired) to RabbitMQ for processing | 33 |

- DB STRUCTURE: 
	**_Parking_** : | **_id_** | name | latitude | longitude | city | address | totalSpots | occupiedSpots | hourlyPrice | type | operatorId | deleted | createdAt | updatedAt |
	**_Reservation_** : | **_id_** | userId | parkingId | carPlate | startTime | endTime | status | price | createdAt | updatedAt |

## CONTAINER_NAME: sensorsimulator-service

### DESCRIPTION: 
Simulates physical parking sensors by generating realistic entry/exit events and consuming reservation updates. Provides sample simulated parking lots with configurable capacity and real-time occupancy tracking. Multiple images of this service can be created at the same time.

### USER_STORIES:
1. As the system, I want to simulate sensor data, so that I can test the platform without physical sensors.
2. As the system, I want to synchronize reservation status with sensor data, so that parking availability is always accurate.

### PORTS: 
N/A (Message-based service)

### DESCRIPTION:
The sensorsimulator-service acts like the behavior of physical parking sensors by generating random entry and exit events through RabbitMQ. It consumes reservation events to maintain accurate occupancy counts.

### PERSISTANCE EVALUATION
The service is stateless and does not require persistent storage. All occupancy state is maintained in memory during runtime and is synchronized through message consumption.

### EXTERNAL SERVICES CONNECTIONS
The sensorsimulator-service container does not connect to external services. It connects to RabbitMQ message broker for publishing sensor events and consuming reservation updates.

### MICROSERVICES:

#### MICROSERVICE: sensorsimulator
- TYPE: simulator
- DESCRIPTION: Python-based simulator that generates realistic parking sensor events and maintains real-time occupancy state by consuming reservation updates from the message queue.
- PORTS: N/A
- TECHNOLOGICAL SPECIFICATION:
The microservice is developed in Python using RabbitMQ. It uses the following libraries and technologies:
	- Pika: RabbitMQ client library for message queue operations
	- Threading: For concurrent message consumption and event generation
	- Random: For generating realistic event timing and patterns
	- OS: For environment variable configuration
- SERVICE ARCHITECTURE:
	The service follows an event-driven architecture with:
	- Publisher Thread: Generates and sends sensor events (enter/exit)
	- Consumer Thread: Listens for reservation events and updates occupancy
	- State Management: Maintains real-time parking occupancy in memory
	- Configuration: Environment-based parking lot configuration.

- ENDPOINTS:
	*This service does not expose HTTP endpoints. It communicates exclusively through RabbitMQ messages.*

| MESSAGE TYPE | EXCHANGE | Description |
 | ------------ | -------- | ----------- | 
 | PUBLISH | `sensor_exchange` | Sends sensor events (enter/exit) with parking ID and unique code |
| CONSUME | `reservation_exchange` | Receives reservation events (created/cancelled/expired) |

## CONTAINER_NAME: frontend

### DESCRIPTION:
Provides the main user interface for the ParkingSpotter platform, including parking search, reservation management, user authentication, and administrative features. Serves as the single-page application for all user roles.

### USER STORIES:
1. As a driver, I want to sign up, so that I can use the site.
2. As a driver, I want to sign in, so that I can use the site.
3. As a driver, I want to logout, so that no one else use my account.
4. As a driver, I want to see available parking spaces on an interactive map, so that I can quickly find a spot near my destination.
5. As a driver, I want to reserve a specific parking space, so that I can be sure it will be available when I arrive.
6. As a driver, I want to cancel my active reservation, so that the space is released for others to use.
7. As a driver, I want to navigate to my reserved parking space by using Google Maps link, so that I can easily reach it.
8. As a driver, I want to view my parking history, so that I can track my usage and expenses.
9. As a driver, I want to see the total price of a parking session, so that I know how much I will be charged.
10. As a driver, I want to create support tickets, so that I can get help in case of a problem.
11. As a driver, I want to edit my personal profile, so that my information is always up to date.
12. As a parking operator, I want to view real-time availability and occupancy of my lots, so that I can manage operations effectively.
13. As a parking operator, I want to sign up, so that I can use the site.
14. As a parking operator, I want to sign in, so that I can use the site.
15. As a parking operator, I want to logout, so that no one else use my account.
16. As a parking operator, I want to add a new parking lot to the system, so that I can expand my managed fleet.
17. As a parking operator, I want to search and filter my parkings by name, so that I can quickly find a specific lot in my dashboard.
18. As a parking operator, I want to adjust the hourly pricing for my parking lots, so that I can implement dynamic pricing strategies.
19. As a parking operator, I want to update parking details like address, so that the information is always accurate for drivers.
20. As a parking operator, I want to remove a parking lot from the system, so that I can decommission outdated facilities.
21. As a parking operator, I want to modify the number of available spots in a lot, so that I can reflect maintenance work or capacity changes.
22. As a parking operator, I want to access a driver account view, so that I can also reserve parking spots when needed.
23. As a parking operator, I want to view my unique code, so that I can link my physical sensors to the platform for real-time data transmission.
24. As an admin, I want to sign in, so that I can use the site.
25. As an admin, I want to logout, so that no one else uses my account.
26. As an admin, I want to see all support tickets received from drivers and operators, so that I can provide timely assistance.
27. As an admin, I want to view dashboard metrics for opened tickets (total and daily), so that I can monitor them.
28. As an admin, I want to see lists of newly registered drivers and parking lots, so that I can track platform growth.
29. As an admin, I want to obtain parkings lists by operator email, so that I can efficiently address related issues.
30. As an admin, I want to edit any parking lot's details, so that I can correct errors or update information.
31. As an admin, I want to delete any parking lot from the system, so that I can manage inappropriate or decommissioned listings.

### PORTS: 
5173:5173

### DESCRIPTION:
The frontend-app container serves as the comprehensive user interface for the ParkingSpotter platform. It provides responsive React-based components for parking search, reservation management, user authentication, and role-based access to operator and admin features. The application uses modern web technologies including React, GSAP animations, and Leaflet maps.

### PERSISTANCE EVALUATION
The frontend container does not include a database. All persistent data is stored in the browser's localStorage for authentication tokens.

### EXTERNAL SERVICES SERVICES CONNECTIONS
The frontend container connects to the following external services:
- Google Maps API: For location services and directions.
- OpenStreetMap API: For geocoding and reverse geocoding.
It also connects to the following internal services:
- User-Service API: For authentication and user management.
- Reservations-Service API: For parking and reservation operations.
- Tickets-Service API: For support ticket management.

### MICROSERVICES:

#### MICROSERVICE: frontend
- TYPE: frontend
- DESCRIPTION: Main React application serving all user interfaces including parking search, reservation system, user profiles, and administrative dashboards.
- PORTS: 5173
- PAGES:

	| Name | Description | Related Microservice | User Stories |
	| ---- | ----------- | -------------------- | ------------ |
	| Home.jsx | Main landing page | - | - |
	| Login.jsx | User authentication and login form | user-service | 2, 14, 24 |
	| SignUp.jsx | User registration form with role selection | user-service | 1, 13 |
	| Profile.jsx | User profile management and reservation history | user-service, reservations-service | 6, 7, 8, 11, 23 |
	| Reservation.jsx | Parking reservation creation and management | reservations-service | 4, 5 |
	| About.jsx | Platform information and company details | - | - |
	| Contact.jsx | Contact form and support information | tickets-service | 10 |
	| ManageSpots.jsx | Parking spot management for operators | reservations-service | 17, 18, 19, 20, 21 |
	| AddSpot.jsx | Add new parking spots form for operators | reservations-service | 16 |
	| Admin.jsx | Administrative dashboard and platform analytics | user-service, reservations-service, tickets-service | 24, 25, 27, 28, 29, 30, 31 |
	| Tickets.jsx | Support ticket management for admins | tickets-service | 26, 27 |
	| Unauthorized.jsx | Access denied page for unauthorized users | - | - |

## CONTAINER_NAME: postgres

### DESCRIPTION: 
Central PostgreSQL database service providing persistent data storage for all microservices.

### USER STORIES:
*N/A*

### PORTS:
5432:5432

### DESCRIPTION:
The postgres-db container is the primary relational database for the ParkingSpotter platform. It ensures data consistency and relationships across all microservices.

### PERSISTENCE EVALUATION
This container is the core of the system's persistence layer. It requires persistent volume storage to maintain all application data across container restarts and deployments.

### EXTERNAL SERVICES CONNECTIONS
The database does not initiate external connections.

### MICROSERVICES:

#### MICROSERVICE: postgresql
- TYPE: database
- DESCRIPTION: PostgreSQL relational database.
- PORTS: 5432

## CONTAINER_NAME: pgadmin

### DESCRIPTION: 
Web-based administration and management platform for PostgreSQL databases. Provides a graphical interface for database querying, management, and monitoring.

### USER STORIES:
*N/A*

### PORTS:
8080:80

### DESCRIPTION:
The pgAdmin container provides a comprehensive web-based GUI for managing PostgreSQL databases. It allows authorized users to connect to the postgres-db container, browse database schemas, execute SQL queries, view data in tables, manage user permissions, and monitor database performance through an intuitive interface.

### PERSISTENCE EVALUATION
The pgAdmin container uses persistent storage to save user session data, server connection details, and user preferences for convenience across container restarts.

### EXTERNAL SERVICES CONNECTIONS
The pgadmin container does not initiate external connections but connects to the internal postgres-db container.

### MICROSERVICES:

#### MICROSERVICE: pgadmin
- TYPE: debug-tool
- DESCRIPTION: Web-based administration tool for PostgreSQL databases. Provides visual management of database objects, query tools, and performance dashboards.
- PORTS: 80