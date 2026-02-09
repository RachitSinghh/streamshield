# StreamShield Frontend

Next.js application for StreamShield video moderation platform.

## Features

- Modern glassmorphism UI design
- Real-time video processing updates
- Drag & drop video upload
- HTML5 video player with seek support
- Role-based UI (Viewer, Editor, Admin)
- Admin panel for user management
- Responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your backend URL
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

| Variable                 | Description          | Default                   |
| ------------------------ | -------------------- | ------------------------- |
| `NEXT_PUBLIC_API_URL`    | Backend API URL      | http://localhost:5000/api |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io server URL | http://localhost:5000     |

## Folder Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API route handlers
│   └── layout.tsx         # Root layout
├── src/
│   ├── api/               # API client functions
│   ├── components/        # React components
│   │   ├── common/        # Reusable components
│   │   ├── upload/        # Upload-related components
│   │   ├── video/         # Video-related components
│   │   └── admin/         # Admin components
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom React hooks
│   └── styles/            # Global styles
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Design System

The application uses a glassmorphism design with:

- Frosted glass effects (`backdrop-blur`)
- Semi-transparent backgrounds
- Smooth animations and transitions
- Modern color palette
- Responsive layouts

## License

MIT
