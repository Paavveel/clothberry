/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_CTP_PROJECT_KEY: string;
  readonly VITE_CTP_PROJECT_KEY: string;
  readonly VITE_CTP_CLIENT_SECRET: string;
  readonly VITE_CTP_CLIENT_ID: string;
  readonly VITE_CTP_AUTH_URL: string;
  readonly VITE_CTP_API_URL: string;
  readonly VITE_CTP_SCOPES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
