
# PhotoFlare: React Photo Management Application

PhotoFlare is a modern photo management web application built with React, TypeScript, Vite, and TailwindCSS. It features offline support, cloud syncing capabilities, and a responsive design.

![PhotoFlare Screenshot](https://via.placeholder.com/800x400?text=PhotoFlare+Screenshot)

## Features

- ✅ Photo gallery with grid and detail views
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

## Running the App

### Development Mode

```bash
npm run dev
# or
yarn dev
```
The app will be available at http://localhost:8080

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

## Deployment

You can deploy PhotoFlare to any static hosting service like Netlify, Vercel, or GitHub Pages.

To deploy with environment variables, configure them in your hosting provider's dashboard.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lovable](https://lovable.dev/)
