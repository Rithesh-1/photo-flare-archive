
# PhotoFlare: React Photo Management Application

PhotoFlare is a modern photo management web application built with React, TypeScript, Vite, and TailwindCSS. It features offline support, cloud syncing capabilities, and a responsive design.

![PhotoFlare Screenshot](https://via.placeholder.com/800x400?text=PhotoFlare+Screenshot)

## Features

- ✅ Photo gallery with grid and detail views
- ✅ Organized view with date-based grouping
- ✅ Offline-first architecture with local storage
- ✅ Cloud sync when online
- ✅ Customizable UI with theming options
- ✅ Responsive design for all devices
- ✅ Dark and light mode
- ✅ Image classification capabilities
- ✅ Favorites and albums organization

## Prerequisites

Before you begin, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm or [yarn](https://yarnpkg.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd photoflare
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your specific configuration.

## Environment Configuration

PhotoFlare uses environment variables for configuration. Here's what each variable does:

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_APP_NAME | Application name | PhotoFlare |
| VITE_PRIMARY_COLOR | Primary color (hex) | #3b82f6 |
| VITE_STORAGE_LIMIT_MB | Local storage limit in MB | 100 |
| VITE_STORAGE_MODE | Default storage mode (local/cloud) | cloud |
| VITE_ENVIRONMENT | Environment (development/production) | development |

## Running the App Locally

### Development Mode

```bash
npm run dev
# or
yarn dev
```
The app will be available at http://localhost:5173

### Building for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## Deployment Guide

### Option 1: Deploy to Vercel (Recommended)

1. Create a [Vercel account](https://vercel.com/signup) if you don't have one
2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Log in to Vercel:
   ```bash
   vercel login
   ```
4. Deploy the application:
   ```bash
   vercel
   ```
5. For production deployment:
   ```bash
   vercel --prod
   ```

#### Environment Variables on Vercel

1. Go to your project on the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add all the variables from your `.env.local` file

### Option 2: Deploy to Netlify

1. Create a [Netlify account](https://app.netlify.com/signup) if you don't have one
2. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
3. Log in to Netlify:
   ```bash
   netlify login
   ```
4. Initialize Netlify in your project:
   ```bash
   netlify init
   ```
5. Create a `netlify.toml` file in your project root:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
     
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
6. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

#### Environment Variables on Netlify

1. Go to your site settings on Netlify dashboard
2. Navigate to Build & deploy > Environment
3. Add all variables from your `.env.local` file

### Option 3: Traditional Web Hosting

1. Build the application:
   ```bash
   npm run build
   ```
2. The built files will be in the `dist` directory
3. Upload the contents of the `dist` directory to your web server
4. Configure your web server to serve the application:

#### Apache Configuration (.htaccess)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx Configuration

```nginx
server {
  listen 80;
  server_name yourdomain.com;
  root /path/to/dist;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Environment Variables with Traditional Hosting

With traditional hosting, you'll need to build the application with environment variables set:

1. Create a `.env.production` file with your production values
2. Build the application:
   ```bash
   npm run build
   ```
3. The environment variables will be baked into the build

## Post-Deployment Verification

After deploying, verify that:

1. The application loads correctly
2. Images can be uploaded and viewed
3. Albums can be created and managed
4. The organization view works as expected
5. Offline mode functions properly

## Common Deployment Issues

### 404 Errors on Page Refresh

If you encounter 404 errors when refreshing the page or accessing a route directly, it means your server isn't configured to serve the `index.html` file for all routes. Review the server configuration examples above.

### CORS Issues

If you're using a separate API backend, you might encounter CORS issues. Make sure your API server allows requests from your frontend domain.

### Environment Variable Problems

If features aren't working as expected, check that all environment variables are properly set in your deployment environment.

## Architecture

PhotoFlare is built with a modern React architecture:

- **React + TypeScript**: For type-safe component development
- **Vite**: For fast development and optimized builds
- **TailwindCSS**: For utility-first styling
- **shadcn/ui**: For beautiful, accessible UI components
- **React Router**: For client-side routing
- **Context API**: For state management
- **React Query**: For data fetching and caching
- **Sonner**: For toast notifications

## Storage Modes

PhotoFlare supports two storage modes:

1. **Local Storage Mode**: All photos are stored in the browser's localStorage
2. **Cloud Mode**: Photos sync to cloud storage when online (simulated in this version)

You can switch between modes in the application settings.

## Offline Support

PhotoFlare is designed to work offline by default:
- Automatically detects network status
- Stores changes locally when offline
- Syncs changes when back online
- Provides visual indicators for sync status

## Development

### Project Structure

```
photoflare/
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Helper utilities
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Application entry point
├── .env.example        # Example environment variables
├── index.html          # HTML template
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

### Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lovable](https://lovable.dev/)
