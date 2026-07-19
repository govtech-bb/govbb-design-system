import type { APIRoute } from 'astro';
import faviconIco from '@govtech-bb/frontend/assets/images/favicon.ico?url';
import faviconSvg from '@govtech-bb/frontend/assets/images/favicon.svg?url';
import icon180 from '@govtech-bb/frontend/assets/images/govbb-icon-180.png?url';
import icon192 from '@govtech-bb/frontend/assets/images/govbb-icon-192.png?url';
import icon512 from '@govtech-bb/frontend/assets/images/govbb-icon-512.png?url';

export const GET: APIRoute = () =>
  Response.json({
    icons: [
      { src: faviconIco, type: 'image/x-icon', sizes: '48x48' },
      {
        src: faviconSvg,
        type: 'image/svg+xml',
        sizes: '150x150',
        purpose: 'any',
      },
      {
        src: icon180,
        type: 'image/png',
        sizes: '180x180',
        purpose: 'maskable',
      },
      {
        src: icon192,
        type: 'image/png',
        sizes: '192x192',
        purpose: 'maskable',
      },
      {
        src: icon512,
        type: 'image/png',
        sizes: '512x512',
        purpose: 'maskable',
      },
    ],
  });
