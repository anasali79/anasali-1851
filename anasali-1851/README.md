# NestJS Auth API

A production-ready NestJS backend with authentication, role-based access control, and Postgres integration.

## Base URL
`http://localhost:3000/api/v1`

## Features
- **JWT Authentication**: Secure login and signup with JWT.
- **Cookie Support**: Tokens are automatically stored in an `accessToken` cookie.
- **Role-Based Access Control**: `ADMIN` and `BRAND` roles.
- **Brand Management**: Complete CRUD for brands (Admin only).
- **Audit Tracking**: Automatic tracking of `createdBy` and `updatedBy` for brands.
- **Database Migrations**: Version-controlled schema updates using TypeORM.
- **Auto-Seeding**: Automatic admin creation on startup.

---

## API Documentation

### 1. Authentication

#### **Register New User**
- **URL**: `/auth/signup`
- **Method**: `POST`
- **Access**: Public
- **Body**:
```json
{
  "name": "Anas Ali",
  "email": "anas@example.com",
  "password": "Password123"
}
```
- **Description**: Registers a new user with the `BRAND` role and sets an `accessToken` cookie.

#### **Login**
- **URL**: `/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Body**:
```json
{
  "email": "anas@example.com",
  "password": "Password123"
}
```
- **Description**: Authenticates user and returns JWT. Sets `accessToken` cookie.

#### **Get Profile**
- **URL**: `/auth/profile`
- **Method**: `GET`
- **Access**: Protected (Requires JWT)
- **Headers**: `Authorization: Bearer <token>` (or via cookie)
- **Description**: Returns details of the currently logged-in user.

---

### 2. User Management (Admin Only)

#### **Create Managed User**
- **URL**: `/users`
- **Method**: `POST`
- **Access**: Admin Only
- **Body**:
```json
{
  "name": "New Manager",
  "email": "manager@test.com",
  "password": "Password123",
  "role": "BRAND"
}
```
- **Description**: Allows an admin to create new users with specific roles.

#### **List All Users**
- **URL**: `/users`
- **Method**: `GET`
- **Access**: Admin Only
- **Description**: Returns a list of all users in the system.

---

### 3. Brand Management (Admin Only)

#### **Create Brand**
- **URL**: `/brands`
- **Method**: `POST`
- **Access**: Admin Only
- **Body**:
```json
{
  "name": "Brand Name",
  "description": "Optional description",
  "logoUrl": "https://example.com/logo.png"
}
```
- **Description**: Creates a new brand and links the current admin as the creator.

#### **List Brands**
- **URL**: `/brands?page=1&limit=10`
- **Method**: `GET`
- **Access**: Admin Only
- **Query Params**:
  - `page`: default `1`
  - `limit`: default `10`
- **Description**: Returns a paginated list of all brands.

#### **Get Brand Detail**
- **URL**: `/brands/:id`
- **Method**: `GET`
- **Access**: Admin Only
- **Description**: Returns details of a specific brand by its ID.

#### **Update Brand**
- **URL**: `/brands/:id`
- **Method**: `PATCH`
- **Access**: Admin Only
- **Body**:
```json
{
  "name": "Updated Brand Name",
  "description": "Updated description"
}
```
- **Description**: Updates brand details and links the current admin as the last updater.

#### **Delete Brand**
- **URL**: `/brands/:id`
- **Method**: `DELETE`
- **Access**: Admin Only
- **Description**: Permanently deletes a brand from the system.

---

## Setup & Run

### 1. Environment Variables
Create a `.env` file based on `.env.example`:

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=1d

# Admin Seed
ADMIN_EMAIL=admin@email.com
ADMIN_PASSWORD=admin
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the App
```bash
# development
npm run start:dev

# production
npm run start:prod
```

## License
MIT
