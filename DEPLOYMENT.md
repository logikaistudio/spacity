# Deployment Guide - Vercel

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Login ke Vercel**
   - Kunjungi [vercel.com](https://vercel.com)
   - Login dengan GitHub account

2. **Import Project**
   - Klik "Add New Project"
   - Pilih "Import Git Repository"
   - Cari dan pilih repository `logikaistudio/spacity`
   - Klik "Import"

3. **Configure Project**
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Deploy**
   - Klik "Deploy"
   - Wait 1-2 menit untuk build selesai
   - ✅ Done! Aplikasi akan live di `https://spacity-xxx.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login ke Vercel
vercel login

# Deploy dari project directory
cd /Users/hoeltz/Documents/GitHub/Spacity
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Choose your account
# - Link to existing project? No
# - Project name? spacity
# - Directory? ./
# - Auto-detected settings? Yes

# Deploy to production
vercel --prod
```

## 📋 Pre-Deployment Checklist

- ✅ `vercel.json` created (configure SPA routing)
- ✅ `package.json` updated dengan metadata
- ✅ `.gitignore` includes `node_modules`, `dist`, `.env*`
- ✅ Build script configured: `npm run build`
- ✅ All dependencies in `package.json`
- ✅ No hardcoded secrets atau API keys

## 🔧 Vercel Configuration

File `vercel.json` sudah include:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Rewrites Configuration** penting untuk:
- ✅ React Router berfungsi dengan benar
- ✅ Direct URL navigation works
- ✅ Page refresh tidak 404

## 🌍 Environment Variables (Optional)

Jika nantinya ada environment variables:

1. Di Vercel Dashboard → Project Settings → Environment Variables
2. Add variables:
   - Name: `VITE_API_URL`
   - Value: `https://api.yourdomain.com`
   - Environment: Production

3. Di local development, buat `.env.local`:
```env
VITE_API_URL=http://localhost:3000
```

## 📦 Build Process

Vercel akan automatically:
1. Detect Vite framework
2. Run `npm install`
3. Run `npm run build`
4. Deploy `dist` folder
5. Configure CDN caching

**Build Output:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── vite.svg
```

## 🔄 Auto-Deployment

Setelah setup initial, setiap push ke GitHub akan auto-deploy:

1. **Push ke `main` branch** → Production deployment
2. **Push ke branch lain** → Preview deployment
3. **Pull Request** → Preview URL di PR comments

## 🌐 Custom Domain (Optional)

1. Di Vercel Dashboard → Project Settings → Domains
2. Add custom domain: `spacity.yourdomain.com`
3. Configure DNS:
   - Type: `CNAME`
   - Name: `spacity`
   - Value: `cname.vercel-dns.com`
4. SSL otomatis configured oleh Vercel

## 📊 Performance Optimization

SPAcity sudah optimized dengan:
- ✅ **Code Splitting** - Vite automatic chunking
- ✅ **Tree Shaking** - Unused code removed
- ✅ **Minification** - JS & CSS minified
- ✅ **Compression** - Gzip/Brotli otomatis
- ✅ **CDN** - Vercel Edge Network
- ✅ **Lazy Loading** - React lazy imports ready

## 🐛 Troubleshooting

### Build Fails
```bash
# Test build locally first
npm run build
npm run preview
```

### 404 on Direct URL Navigation
- ✅ Check `vercel.json` rewrites configured
- ✅ Ensure output directory is `dist`

### Dependencies Issue
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Vercel CLI Issues
```bash
# Re-login ke Vercel
vercel logout
vercel login
```

## 📈 Monitoring & Analytics

Di Vercel Dashboard, monitor:
- **Deployments** - Build history & logs
- **Analytics** - Page views, performance
- **Logs** - Runtime errors (if SSR)
- **Bandwidth** - Usage statistics

## 🎯 Post-Deployment Testing

After deploy, test:
1. ✅ Homepage loads (`/analytics`)
2. ✅ Navigation between pages
3. ✅ Direct URL access (`/services`, `/scheduling`)
4. ✅ Charts render correctly
5. ✅ Export PDF/Excel functionality
6. ✅ Receipt printing
7. ✅ localStorage persistence
8. ✅ Mobile responsive design

## 🔗 Useful Links

- **Vercel Docs**: https://vercel.com/docs
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html
- **Project Dashboard**: https://vercel.com/dashboard

---

## 🎉 Expected Result

After successful deployment:

```
✅ Deployed to Production
🌍 https://spacity.vercel.app
⚡ Build Time: ~45 seconds
📦 Bundle Size: ~500KB gzipped
🚀 Performance Score: 95+
```

**Next Steps:**
1. Test semua fitur di production URL
2. Share URL dengan team
3. Setup custom domain (optional)
4. Monitor analytics
5. Iterate & improve!

---

**Happy Deploying! 🚀**
