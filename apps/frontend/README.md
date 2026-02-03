# Tstai Frontend - React.js Application

This is the frontend for the Tstai API testing platform, built with **React.js** and **Vite**.

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **Google Fonts** (Inter & JetBrains Mono) - Typography

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CodeBlock.tsx   # Code display with copy functionality
│   ├── FeatureCard.tsx # Feature display card
│   ├── Layout.tsx      # Main layout wrapper with auth
│   └── Navbar.tsx      # Navigation bar
├── pages/              # Page components (routes)
│   ├── DocsPage.tsx    # Documentation page
│   ├── HomePage.tsx    # Main dashboard
│   ├── LoginPage.tsx   # Login page
│   ├── ProjectsPage.tsx # API key management
│   ├── RegisterPage.tsx # Registration page
│   └── RootPage.tsx    # Root redirect page
├── services/           # API and business logic
│   └── authService.ts  # Authentication service
├── styles/             # Global styles
│   └── globals.css     # Tailwind + custom CSS
├── App.tsx            # Root component with routes
├── main.tsx           # Application entry point
└── vite-env.d.ts      # TypeScript env declarations
```

## Getting Started

### Prerequisites

- Node.js 18+ (currently using Node 25)
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local and set your API URL
# VITE_API_URL=http://localhost:3006/v1
```

### Development

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# The dev server includes hot module replacement (HMR)
# Changes will be reflected immediately without page reload
```

### Build for Production

```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Environment Variables

Create a `.env.local` file (ignored by git) with:

```bash
VITE_API_URL=http://localhost:3006/v1
```

For production, set `VITE_API_URL` to your production API URL.

**Note:** Vite only exposes environment variables prefixed with `VITE_` to the client code.

## Routing

The application uses React Router v6 for client-side routing:

- `/` - Root page (redirects to login or home)
- `/login` - Login page
- `/register` - Registration page
- `/home` - Main dashboard (protected)
- `/projects` - API key management (protected)
- `/docs` - Documentation (protected)

Protected routes require authentication and will redirect to `/login` if not authenticated.

## Authentication

Authentication is handled via:
1. Login/Register forms that call the backend API
2. JWT tokens stored in `localStorage`
3. `Layout` component checks auth status on protected pages
4. `authService.ts` manages all auth operations

## Code Style

- **Beginner-friendly**: Code includes comprehensive comments explaining concepts
- **Modular**: Reusable components and services
- **TypeScript**: Type safety throughout
- **Clean imports**: Using path aliases (`@components`, `@pages`, etc.)

## Key Differences from Next.js

This app was converted from Next.js to React.js:

| Feature | Next.js | React.js + Vite |
|---------|---------|-----------------|
| Routing | File-based (App Router) | React Router v6 |
| Navigation | `useRouter()` from `next/navigation` | `useNavigate()` from `react-router-dom` |
| Links | `<Link>` from `next/link` | `<Link>` from `react-router-dom` |
| Env Vars | `process.env.NEXT_PUBLIC_*` | `import.meta.env.VITE_*` |
| Client Directive | `'use client'` required | Not needed (all client-side) |
| Rendering | SSR/SSG by default | Client-side only (SPA) |

## Development Tips

1. **Hot Reload**: Vite's HMR is fast - changes appear instantly
2. **Path Aliases**: Use `@components/*`, `@pages/*`, etc. for cleaner imports
3. **Type Checking**: Run `npm run build` to catch TypeScript errors
4. **Browser DevTools**: React DevTools extension is helpful for debugging
5. **Console Logs**: Check browser console for any runtime errors

## Deployment

1. Build the production bundle: `npm run build`
2. The `dist/` folder contains the static files
3. Deploy to any static hosting (Vercel, Netlify, Cloudflare Pages, etc.)
4. Make sure to set the `VITE_API_URL` environment variable in your hosting platform

### Example: Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard:
# VITE_API_URL = https://your-api.com/v1
```

## Troubleshooting

### Build Errors

If you see TypeScript errors during build:
```bash
# Check types without building
npx tsc --noEmit
```

### Development Server Won't Start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json dist
npm install
```

### Environment Variables Not Working

- Make sure variable names start with `VITE_`
- Restart dev server after changing .env files
- Check `import.meta.env.VITE_API_URL` is used in code

## Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Support

For questions about the Tstai platform, visit the documentation page or contact support.
