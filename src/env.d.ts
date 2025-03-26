
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_PRIMARY_COLOR: string;
  readonly VITE_STORAGE_LIMIT_MB: string;
  readonly VITE_STORAGE_MODE: 'local' | 'cloud';
  readonly VITE_ENVIRONMENT: string;
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
