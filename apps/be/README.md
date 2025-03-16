# Contest Tracker Setup Instructions

## Prerequisites
- Node.js installed (v16 or newer recommended)
- Bun runtime installed
- MongoDB account and database set up
- YouTube API key (for video integration)

## Layered architecture
- Routes: Define the API endpoints and map them to controllers.

- Controllers: Handle incoming requests, validate input, and send responses.

- Services: Contain the business logic and interact with the database or external APIs.

- Database: Stores and retrieves data (e.g., MongoDB, PostgreSQL, etc.).

## Testing the API Endpoints

Once the server is running, you can test the API using tools like Postman or curl:

### Authentication Endpoints
- **Register a new user**: `POST /api/users/signup`
- **Login**: `POST /api/users/login`
- **Get user profile**: `GET /api/users/profile` (requires JWT token)

### Contest Endpoints
- **Get upcoming contests**: `GET /api/contests/upcoming`
- **Get past contests**: `GET /api/contests/past`
- **Toggle bookmark**: `POST /api/contests/bookmark` (requires JWT token)
- **Get bookmarked contests**: `GET /api/contests/bookmarked` (requires JWT token)

### PCD Endpoints
- **Get PCDs for a contest**: `GET /api/pcd/contest/:contestId`
- **Add a PCD manually**: `POST /api/pcd` (requires admin JWT token)
- **Delete a PCD**: `DELETE /api/pcd/:pcdId` (requires admin JWT token)

### Admin Endpoints
- **Get all users**: `GET /api/admin/users` (requires admin JWT token)
- **Update user role**: `PUT /api/admin/users/role` (requires admin JWT token)
- **Trigger contest update**: `POST /api/admin/update-contests` (requires admin JWT token)