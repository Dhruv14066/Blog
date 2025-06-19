# Blog Application

A full-stack blog application with user authentication, built with Node.js, Express, MongoDB, and modern frontend technologies.

## Features

- ✅ User Registration with Avatar Upload
- ✅ User Login/Logout with JWT Authentication
- ✅ Modern Responsive UI
- ✅ File Upload with Cloudinary
- ✅ Secure Password Hashing
- ✅ Cookie-based Authentication
- ✅ Dashboard for Logged-in Users

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage
- **Cookie-parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern design
- **JavaScript (ES6+)** - Client-side functionality
- **Font Awesome** - Icons

## Project Structure

```
blog/
├── frontend/                    # Frontend application
│   ├── src/
│   │   ├── assets/
│   │   │   ├── css/
│   │   │   │   ├── auth.css
│   │   │   │   └── dashboard.css
│   │   │   └── js/
│   │   │       ├── auth.js
│   │   │       └── dashboard.js
│   │   └── pages/
│   │       ├── index.html
│   │       └── dashboard.html
│   ├── package.json
│   └── README.md
├── src/                        # Backend application
│   ├── controllers/
│   │   └── user.controller.js
│   ├── db/
│   │   └── index.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── multer.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   └── user.route.js
│   ├── utils/
│   │   ├── apierror.js
│   │   ├── ApiResponse.js
│   │   ├── asynchandler.js
│   │   └── cloudinary.js
│   ├── app.js
│   ├── constants.js
│   └── index.js
├── public/                     # Static files (temp uploads)
│   └── temp/
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies (optional)**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Server Configuration
   PORT=8000
   CORS_ORIGIN=http://localhost:8000

   # Database Configuration
   DB_URL=mongodb://localhost:27017

   # JWT Configuration
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   REFRESH_TOKEN_EXPIRY=10d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open your browser and go to `http://localhost:8000`
   - You'll see the login/register page

## Running Frontend and Backend Separately

### Backend Only
```bash
# From root directory
npm run dev
# Backend will run on http://localhost:8000
```

### Frontend Only (for development)
```bash
# From frontend directory
cd frontend
npm run dev
# Frontend will run on http://localhost:3000
```

## API Endpoints

### Authentication Routes
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user (requires authentication)

### Request/Response Examples

#### Register User
```javascript
// Request
POST /api/v1/users/register
Content-Type: multipart/form-data

{
  "fullname": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "avatar": [file]
}

// Response
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullname": "john doe",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "cloudinary_url",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User registered successfully",
  "success": true
}
```

#### Login User
```javascript
// Request
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

// Response
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "user_id",
      "fullname": "john doe",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": "cloudinary_url"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  },
  "message": "User logged in successfully",
  "success": true
}
```

## Features Implemented

### Backend
- ✅ User model with password hashing
- ✅ JWT token generation and verification
- ✅ File upload middleware with Multer
- ✅ Cloudinary integration for image storage
- ✅ Error handling middleware
- ✅ Authentication middleware
- ✅ User registration with avatar
- ✅ User login with token generation
- ✅ User logout with token clearing

### Frontend
- ✅ Modern responsive design
- ✅ Form validation
- ✅ File upload with preview
- ✅ Loading states
- ✅ Error/success message handling
- ✅ User dashboard
- ✅ Authentication state management
- ✅ Logout functionality
- ✅ Separated frontend and backend structure

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookies for token storage
- CORS configuration
- Input validation and sanitization
- Secure file upload handling

## Development Workflow

### Backend Development
- All backend code is in the `src/` directory
- API routes are prefixed with `/api/v1/`
- Static files are served from the frontend directory

### Frontend Development
- All frontend code is in the `frontend/` directory
- CSS and JS files are organized in `src/assets/`
- HTML pages are in `src/pages/`
- Can be developed independently with live-server

## Future Enhancements

- [ ] Blog post creation and management
- [ ] User profile editing
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Social media authentication
- [ ] Blog post comments and likes
- [ ] Search functionality
- [ ] Admin panel
- [ ] API rate limiting
- [ ] Image optimization
- [ ] Frontend build process
- [ ] Unit and integration tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
