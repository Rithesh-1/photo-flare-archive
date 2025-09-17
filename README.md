
# PhotoFlow - Modern Web Photo Gallery

PhotoFlow is a responsive web application for organizing, viewing, and managing your photo collection with intelligent classification features.

## Features

- **Modern UI**: Clean, responsive interface for all devices
- **Fullscreen Viewing**: View your photos in fullscreen mode with left/right navigation
- **Multiple View Modes**: Grid view and date-based organization
- **Image Classification**: AI-powered photo tagging and quality assessment
- **Albums**: Create albums to organize your photo collection
- **Favorites**: Mark and filter your favorite photos
- **Offline Support**: Works even when offline with local storage
- **Cloud Sync**: Synchronize your photos with cloud storage

## Deployment Instructions

### Option 1: Deploy to Vercel

The easiest way to deploy PhotoFlow is using Vercel:

1. **Create a Vercel Account** at [https://vercel.com/signup](https://vercel.com/signup)

2. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

3. **Deploy the Application**

   **With GitHub Integration:**
   - Push your code to a GitHub repository
   - Import the project in Vercel dashboard
   - Follow the prompts to configure your project

   **Using Vercel CLI:**
   ```bash
   # Login to Vercel
   vercel login

   # Deploy from your project directory
   cd photoflow
   vercel
   ```

4. **Configure Environment Variables**
   - Go to your project in the Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add the following variables:
     ```
     VITE_STORAGE_MODE=cloud
     VITE_API_KEY=your_api_key_here
     VITE_IMAGE_OPTIMIZER_URL=https://your-image-optimizer-url.com
     ```

### Option 2: Deploy to Netlify

1. **Create a Netlify Account** at [https://app.netlify.com/signup](https://app.netlify.com/signup)

2. **Deploy the Application**

   **With GitHub Integration:**
   - Push your code to a GitHub repository
   - In Netlify dashboard, click "New site from Git"
   - Select your repository and follow the setup process
   
   **Manual Deployment:**
   - Build your project locally:
     ```bash
     npm run build
     ```
   - Drag and drop the `dist` folder to Netlify

3. **Configure Environment Variables**
   - Go to Site settings → Environment variables
   - Add the required environment variables (same as Vercel)

### Option 3: Traditional Hosting

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Create Environment File**
   Create a `.env.production` file in your project root with:
   ```
   VITE_STORAGE_MODE=cloud
   VITE_API_KEY=your_api_key_here
   VITE_IMAGE_OPTIMIZER_URL=https://your-image-optimizer-url.com
   ```

3. **Upload to Your Web Server**
   - Upload the contents of the `dist` directory to your web server
   - Ensure your server is configured for single-page applications
   - For Apache, create a `.htaccess` file in your root directory:
     ```
     <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
     </IfModule>
     ```
   - For Nginx, update your server configuration:
     ```
     location / {
       try_files $uri $uri/ /index.html;
     }
     ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_STORAGE_MODE | Storage mode: "local" or "cloud" | Yes |
| VITE_API_KEY | API key for cloud services | Only for cloud mode |
| VITE_IMAGE_OPTIMIZER_URL | URL for the image optimization service | No |
| VITE_ENABLE_ANALYTICS | Enable analytics tracking | No |

## Troubleshooting

### Images Not Loading

If images are not loading:

1. Check your console for CORS errors
2. Ensure your image optimizer service is running
3. Verify the correct image paths in your database

### Offline Mode Issues

If offline mode is not working:

1. Make sure your browser supports IndexedDB
2. Clear site data and reload the application
3. Check browser console for any storage-related errors

### Cloud Sync Problems

If cloud sync is failing:

1. Verify your API key is correct
2. Check your network connection
3. Ensure the cloud service is operational

## License

This project is licensed under the MIT License - see the LICENSE file for details.
