# Smart Link Frontend

A modern Next.js frontend for the Smart Link website directory application built according to XIHawks specifications.

## Features

- **Authentication**: User login and signup with JWT tokens
- **Site Directory**: Browse and search through categorized websites
- **Admin Panel**: Complete CRUD operations for site management
- **AI Integration**: AI-powered description generation using Google Gemini
- **Responsive Design**: Mobile-first design with Styled Components
- **Modern UI**: Clean, intuitive interface with custom styling

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Styled Components (as per requirements)
- **State Management**: Redux Toolkit (as per requirements)
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **AI Integration**: Google Gemini API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on port 3001

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── admin/
│   │   └── dashboard/     # Admin dashboard page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── layout.tsx         # Root layout with Redux provider
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Navbar.tsx         # Navigation component
│   ├── ReduxProvider.tsx  # Redux provider wrapper
│   └── AuthInitializer.tsx # Auth initialization component
├── store/                 # Redux store and slices
│   ├── index.ts          # Store configuration
│   └── slices/
│       ├── authSlice.ts   # Authentication state management
│       └── sitesSlice.ts  # Sites state management
├── styles/               # Styled Components
│   └── GlobalStyles.ts   # Global styles and components
├── hooks/               # Custom React hooks
│   └── useAuthInitialization.ts
├── lib/                 # Utility libraries
│   ├── api.ts          # API service layer
│   └── utils.ts        # Utility functions
└── types/              # TypeScript type definitions
    └── index.ts        # Shared types
```

## API Integration

The frontend communicates with the backend API through the service layer in `lib/api.ts`. The API includes:

- **Authentication**: Login and signup endpoints
- **Sites**: CRUD operations for website links
- **Image Upload**: Cloudinary integration for cover images

## Authentication

The app uses JWT tokens for authentication. Users can:

- Sign up for new accounts
- Log in with email and password
- Access admin features if they have admin role
- Automatic token refresh and logout on expiration

## Admin Features

Admin users can:

- Add new website links
- Edit existing sites
- Delete sites
- Upload cover images
- Manage categories

## Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## Deployment

The application can be deployed to:

- Vercel (recommended for Next.js)
- Netlify
- Any Node.js hosting platform

Make sure to set the `NEXT_PUBLIC_API_URL` environment variable to point to your backend API.