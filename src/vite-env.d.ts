/// <reference types="vite/client" />

// explicit shape for your env-vars (add more keys as needed)
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // add other VITE_... keys here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}