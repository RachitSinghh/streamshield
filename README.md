# StreamShield

A full-stack video moderation and streaming platform with multi-tenant architecture, role-based access control, and real-time processing updates.

## 🚀 Features

- **Secure Video Upload**: Upload and validate video files with size and type restrictions
- **Real-time Processing**: Live progress updates via Socket.io during video processing
- **Sensitivity Classification**: Automated content moderation (Safe/Flagged)
- **HTTP Range Streaming**: Efficient video streaming with seek support
- **Multi-tenant Architecture**: Complete data isolation between organizations
- **Role-Based Access Control**: Viewer, Editor, and Admin roles with granular permissions
- **Admin Panel**: User and role management interface

## 🛠️ Tech Stack

### Backend

- Node.js + Express.js
- MongoDB + Mongoose
- Socket.io (real-time updates)
- JWT Authentication
- Multer (file uploads)

### Frontend

- Next.js 14 (App Router)
- React
- Tailwind CSS (Glassmorphism design)
- Axios
- Socket.io-client

### Infrastructure

- MongoDB Atlas
- Render/Railway (Backend)
- Vercel (Frontend)

## 📁 Project Structure

```
streamshield/
├── backend/          # Express.js API server
├── frontend/         # Next.js application
├── prd.md           # Product Requirements Document
├── design.md        # Design specifications
├── folderstructure.md
└── TODO.md          # Implementation checklist
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ LTS
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd streamshield
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

## 📚 Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [API Documentation](./docs/API.md) _(Coming soon)_

## 🎯 Development Status

This project is currently under active development. See [TODO.md](./TODO.md) for implementation progress.

## 📄 License

MIT

## 👥 Contributors

Built as a demonstration of production-level full-stack development practices.
