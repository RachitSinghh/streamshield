# StreamShield Backend

Express.js API server for StreamShield video moderation platform.

## Features

- JWT-based authentication
- Role-based access control (Viewer, Editor, Admin)
- Multi-tenant data isolation
- Video upload with validation
- Real-time processing updates via Socket.io
- HTTP Range-based video streaming
- User management (Admin)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Real-time**: Socket.io
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Start production server**
   ```bash
   npm start
   ```

## Environment Variables

| Variable             | Description               | Default                       |
| -------------------- | ------------------------- | ----------------------------- |
| `PORT`               | Server port               | 5000                          |
| `NODE_ENV`           | Environment               | development                   |
| `MONGODB_URI`        | MongoDB connection string | -                             |
| `JWT_SECRET`         | Secret key for JWT        | -                             |
| `JWT_EXPIRE`         | JWT expiration time       | 7d                            |
| `MAX_FILE_SIZE`      | Max upload size in bytes  | 104857600 (100MB)             |
| `ALLOWED_FILE_TYPES` | Allowed video MIME types  | video/mp4,video/quicktime,... |
| `FRONTEND_URL`       | Frontend URL for CORS     | http://localhost:3000         |

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Videos

- `POST /api/videos/upload` - Upload video (Editor, Admin)
- `GET /api/videos` - Get all videos (filtered by tenant)
- `GET /api/videos/:id` - Get video by ID
- `GET /api/videos/:id/stream` - Stream video
- `PATCH /api/videos/:id` - Update video (Owner, Admin)
- `DELETE /api/videos/:id` - Delete video (Owner, Admin)

### Users (Admin only)

- `GET /api/users` - Get all users in tenant
- `PATCH /api/users/:id/role` - Update user role

## Folder Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── sockets/         # Socket.io handlers
│   ├── utils/           # Utility functions
│   ├── uploads/         # Uploaded video files
│   ├── app.js           # Express app configuration
│   └── server.js        # Server entry point
├── tests/               # Test files
└── package.json
```

## Testing

```bash
npm test
```

## License

MIT
