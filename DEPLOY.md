# 🚀 Deploy SPAcity ke Vercel

## Quick Deploy (5 menit)

### 1. Login ke Vercel
- Kunjungi [vercel.com](https://vercel.com)
- Login dengan GitHub account Anda

### 2. Import Project
1. Klik **"Add New Project"**
2. Cari repository **"logikaistudio/spacity"**
3. Klik **"Import"**

### 3. Configure (Auto-Detected)
```
Framework Preset: Vite ✅
Build Command: npm run build ✅
Output Directory: dist ✅
Install Command: npm install ✅
```

### 4. Deploy
- Klik **"Deploy"** button
- Wait ~1-2 menit
- ✅ **DONE!** App live di `https://spacity-xxx.vercel.app`

---

## 📋 File yang Sudah Disiapkan

✅ `vercel.json` - SPA routing configuration  
✅ `package.json` - Build scripts & dependencies  
✅ Production build tested (433KB gzipped)  
✅ `.gitignore` - Exclude node_modules & dist  

---

## 🔄 Auto-Deployment

Setelah setup:
- Push ke `main` → Auto deploy ke production
- Push ke branch lain → Preview deployment
- Pull Request → Preview URL in comments

---

## 📊 Build Info

```
Build Time: ~20 seconds
Bundle Size: 433KB gzipped
Framework: React 18 + Vite
Node Version: 18.x (auto)
```

---

## 🐛 Troubleshooting

**Build gagal?**
```bash
# Test build locally
npm run build
```

**404 on page refresh?**
- ✅ vercel.json sudah configured dengan rewrites

---

## 📖 Full Guide

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk:
- Vercel CLI deployment
- Custom domain setup  
- Environment variables
- Performance optimization
- Monitoring & analytics

---

**Siap deploy!** 🎉
