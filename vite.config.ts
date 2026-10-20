import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function forceDownloadPlugin() {
  const handleDownload = (req: any, res: any, next: any) => {
    try {
      const rawUrl = req.url?.split('?')[0] || '';
      const decodedUrl = decodeURIComponent(rawUrl);
      const filename = path.basename(decodedUrl);
      
      const isTargetFile = 
        decodedUrl.endsWith('.aab') || 
        decodedUrl.endsWith('.apk') || 
        decodedUrl.endsWith('.keystore') || 
        decodedUrl.endsWith('.pem') || 
        decodedUrl.endsWith('.zip') ||
        decodedUrl.startsWith('/download/');

      if (isTargetFile) {
        const actualName = decodedUrl.startsWith('/download/') ? decodedUrl.replace('/download/', '') : filename;
        const filePath = path.resolve('public', actualName);
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          res.setHeader('Content-Type', 'application/octet-stream');
          res.setHeader('Content-Disposition', `attachment; filename="${actualName}"`);
          res.setHeader('Content-Length', stat.size);
          res.setHeader('Cache-Control', 'no-cache');
          const stream = fs.createReadStream(filePath);
          return stream.pipe(res);
        }
      }
    } catch (e) {
      console.error('Error handling download stream:', e);
    }
    next();
  };

  return {
    name: 'force-download-plugin',
    configureServer(server: any) {
      server.middlewares.use(handleDownload);
    },
    configurePreviewServer(server: any) {
      server.middlewares.use(handleDownload);
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      forceDownloadPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          id: '/',
          name: 'Pavilion QR Pro',
          short_name: 'Pavilion QR',
          description: '极速二维码与条形码识别扫描、相册读取、高清矢量码制作与凭据导出工具。',
          theme_color: '#0f172a',
          background_color: '#020617',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
