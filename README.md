# QR Scanner - Pavilion Venture

Fast, lightweight QR code scanner for events and check-ins.

**Live:** https://qr.pavilionventure.com

### Features
- Fast QR scan via camera
- Works on mobile & desktop
- Instant redirect & validation
- No app install needed

### Tech Stack
- Next.js / React
- Vercel Hosting
- Cloudflare DNS

### Deployment
This project is connected to Vercel. Any push to `main` branch will auto-deploy to production.

1.  `git push origin main`
2.  Vercel will build and deploy to `qr.pavilionventure.com`

### Domain Setup
- `qr.pavilionventure.com` -> CNAME `cname.vercel-dns.com` (DNS Only)
- `pavilionventure.com` -> 307 Redirect to `qr.pavilionventure.com`

### Local Dev
```bash
npm install
npm run dev
