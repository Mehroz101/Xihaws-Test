# Smart Link Website - Backend

A Node.js/Express backend for the Smart Link Website that allows admins to manage website links with AI-generated descriptions and image uploads.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Site Management**: CRUD operations for website links
- **AI Integration**: Google Gemini AI for automatic description generation
- **Image Upload**: Cloudinary integration for cover image management
- **Database**: PostgreSQL for data persistence

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **AI**: Google Gemini AI
- **Image Storage**: Cloudinary
- **Language**: TypeScript

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Cloudinary account
- Google Gemini API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/smart_links_db
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Google Gemini AI Configuration
   GEMINI_API_KEY=your_gemini_api_key
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   ```

4. **Set up the database**
   ```sql
   CREATE DATABASE smart_links_db;
   
   -- Users table
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(50) UNIQUE NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   -- Sites table
   CREATE TABLE sites (
     id SERIAL PRIMARY KEY,
     site_url VARCHAR(500) NOT NULL,
     title VARCHAR(200) NOT NULL,
     cover_image VARCHAR(500),
     description TEXT NOT NULL,
     category VARCHAR(50) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## API Documentation

The API includes comprehensive Swagger documentation that provides interactive testing capabilities.

### Accessing Swagger UI

Once the server is running, you can access the Swagger documentation at:

- **Swagger UI**: `http://localhost:3001/api-docs`
- **Swagger JSON**: `http://localhost:3001/api-docs.json`

### Features

- **Interactive Testing**: Test all API endpoints directly from the browser
- **Authentication**: Built-in JWT token authentication testing
- **Request/Response Examples**: See example requests and responses for each endpoint
- **Schema Validation**: View detailed data models and validation rules
- **Error Handling**: Comprehensive error response documentation

### Using Swagger UI

1. **Authentication**: 
   - First, use the `/api/auth/login` endpoint to get a JWT token
   - Click the "Authorize" button in Swagger UI
   - Enter your token in the format: `Bearer <your-jwt-token>`

2. **Testing Endpoints**:
   - Expand any endpoint to see its details
   - Click "Try it out" to test the endpoint
   - Fill in the required parameters and request body
   - Click "Execute" to send the request

3. **File Uploads**:
   - For image upload endpoints, use the file upload feature in Swagger UI
   - Select your image file and execute the request

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - User login

### Site Management (Admin only)
- `GET /api/sites` - Get all sites
- `GET /api/sites/:id` - Get site by ID
- `POST /api/sites` - Create new site
- `POST /api/sites/with-image` - Create site with image upload
- `PUT /api/sites/:id` - Update site
- `PUT /api/sites/:id/with-image` - Update site with image upload
- `DELETE /api/sites/:id` - Delete site

### Image Upload (Admin only)
- `POST /api/sites/upload-image` - Upload image only

### AI Description Generation (Admin only)
- `POST /api/ai/generate-description` - Generate description using AI

## Request/Response Examples

### Create Site
```bash
POST /api/sites
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Google",
  "siteUrl": "https://google.com",
  "category": "Technology",
  "coverImage": "https://example.com/image.jpg"
}
```

### Generate AI Description
```bash
POST /api/ai/generate-description
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Google",
  "category": "Technology"
}
```

### Upload Image
```bash
POST /api/sites/upload-image
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

image: <file>
```

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `password`: Hashed password
- `role`: User role ('admin' or 'user')
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Sites Table
- `id`: Primary key
- `site_url`: Website URL
- `title`: Site title
- `cover_image`: Cover image URL (optional)
- `description`: AI-generated description
- `category`: Site category
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- File upload security (type and size validation)

## Error Handling

The API includes comprehensive error handling for:
- Authentication failures
- Validation errors
- Database errors
- File upload errors
- AI service errors

## Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### API Documentation
- Access Swagger UI at `http://localhost:3001/api-docs` when the server is running
- Interactive API testing and documentation available

### Testing
```bash
# Test Cloudinary connection
node test-cloudinary.js
```

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   - Update database URL for production
   - Set secure JWT secret
   - Configure production Cloudinary settings
   - Set production Gemini API key

3. **Start the production server**
   ```bash
   npm start
   ```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `PORT` | Server port (default: 3001) | No |
| `NODE_ENV` | Environment (development/production) | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
