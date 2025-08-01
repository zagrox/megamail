import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        proxy: {
          // Proxy requests from /api/directus to the Directus server
          '/api/directus': {
            target: 'https://user.advering.ltd:8055',
            changeOrigin: true, // Needed for virtual hosted sites
            secure: false, // Often needed for self-signed certificates in local dev
            rewrite: (path) => path.replace(/^\/api\/directus/, ''),
          },
        },
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('.', import.meta.url))
        }
      }
    };
});