# SPAcity - Manajemen SPA Multi Cabang

> Aplikasi manajemen SPA modern dengan analytics dashboard, multi-branch support, dan comprehensive export features.

![SPAcity Analytics Dashboard](https://img.shields.io/badge/SPAcity-Analytics%20%26%20Management-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-646cff?style=flat-square&logo=vite)
![Recharts](https://img.shields.io/badge/Recharts-Charts-22b5bf?style=flat-square)

## 🌟 Fitur Utama

### 📊 Analytics Dashboard
- **KPI Cards** - Total revenue, profit, inventory value dari semua cabang
- **Revenue Trend Chart** - Grafik line chart interaktif untuk tracking pendapatan harian
- **Branch Comparison** - Bar chart membandingkan performa 6 cabang
- **Top Services** - Ranking layanan terlaris
- **Inventory Status** - Real-time monitoring stok dengan alerts

### 💆 Service Management
- CRUD lengkap untuk layanan spa
- Grouping by category (Massage, Facial, Body Treatment, Therapy)
- Pricing dan duration configuration
- Modal forms dengan smooth animations

### 📅 Scheduling & Booking
- Date-based booking view
- Time slot management (9:00 AM - 8:30 PM)
- Status tracking (Confirmed → Completed)
- **🖨️ Receipt Printing** - PDF thermal printer format

### 📈 Daily Recap & Reporting
- Summary metrics (bookings, revenue, incentives, profit)
- Breakdown per layanan dan per terapis
- **📥 Export Reports** - PDF & Excel dengan customizable options

### 📦 Inventory Management
- Stock tracking dengan low stock alerts
- Category-based organization
- Quick stock adjustment (+/- buttons)
- **📥 Export Inventory** - PDF/Excel reports

### 💵 Income Breakdown
- Detailed financial analysis
- Therapist incentive calculation (hourly-based)
- **Profit Sharing** - Auto-calculation SPA:Hotel split
- Date range filtering

### 🏢 Multi-Branch Support
- 6 branches: Jakarta, Bali, Bandung, Surabaya, Yogyakarta, Lombok
- Branch-specific hotel partnerships
- Customizable profit sharing per branch (30-40%)
- Easy branch switching

## 📥 Export & Print Features

### Struk/Receipt Printing
- Professional thermal printer format (80mm)
- Customer details, service info, pricing
- Auto-generated PDF dengan branding

### Revenue Reports
- **Format**: PDF atau Excel
- **Options**: Include/exclude detail breakdowns
- **Multi-sheet Excel**: Summary, Per Layanan, Kinerja Terapis
- Date range selection

### Inventory Reports
- **Format**: PDF atau Excel
- **Filters**: Low stock only, include/exclude prices
- **Excel**: Multi-sheet per category
- Color-coded status indicators

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM
- **Styling**: Vanilla CSS (Mobile-first, Glassmorphism design)
- **State Management**: React Context API
- **Charts**: Recharts (interactive & responsive)
- **PDF Generation**: jsPDF + jspdf-autotable
- **Excel Export**: xlsx (SheetJS)
- **Date Handling**: date-fns
- **Storage**: localStorage (data persistence)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ dan npm/yarn

### Installation

```bash
# Clone repository
git clone https://github.com/logikaistudio/spacity.git
cd spacity

# Install dependencies
npm install

# Start development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📂 Project Structure

```
spacity/
├── src/
│   ├── components/
│   │   ├── Charts/          # Revenue & branch comparison charts
│   │   ├── common/          # Reusable UI components
│   │   └── Layout/          # Header, BottomNav
│   ├── context/
│   │   └── AppContext.jsx   # Global state management
│   ├── pages/
│   │   ├── Analytics.jsx    # Analytics dashboard (NEW!)
│   │   ├── Dashboard.jsx
│   │   ├── Services.jsx
│   │   ├── Scheduling.jsx
│   │   ├── DailyRecap.jsx
│   │   ├── IncomeBreakdown.jsx
│   │   └── Inventory.jsx
│   ├── utils/
│   │   ├── calculations.js  # Revenue, incentive calculations
│   │   ├── formatters.js    # Currency, date formatters
│   │   ├── exportPDF.js     # PDF generation (NEW!)
│   │   └── exportExcel.js   # Excel generation (NEW!)
│   ├── App.jsx
│   ├── index.css            # Design system
│   └── main.jsx
├── package.json
└── vite.config.js
```

## 💡 Key Features Explained

### Profit Sharing Calculation
```javascript
Net Profit = Total Revenue - Total Therapist Incentives
SPAcity Share = Net Profit × SPA Percentage (e.g., 30%)
Hotel Share = Net Profit × Hotel Percentage (e.g., 70%)
```

### Therapist Incentive Formula
```javascript
Incentive = (Service Duration in Minutes ÷ 60) × Hourly Rate
Example: (90 ÷ 60) × Rp 50,000 = Rp 75,000
```

## 🎨 Design System

- **Color Palette**: Dark theme dengan indigo/purple gradients
- **Typography**: Inter font family
- **Components**: Glassmorphism cards dengan backdrop blur
- **Animations**: Smooth fade-in, slide-up transitions
- **Mobile-First**: Responsive dari 320px+
- **Bottom Navigation**: Touch-friendly untuk mobile

## 📊 Sample Data

Aplikasi sudah include sample data untuk demo:
- 6 branches dengan hotel partnerships
- 8 pre-configured services
- 6 therapists
- Sample bookings
- Inventory items dengan various stock levels

## 🔐 Data Persistence

Semua data disimpan di browser's localStorage:
- Branches configuration
- Services & therapists
- Bookings history
- Inventory items
- Selected branch preference

**Note**: Data akan persist selama browser storage tidak di-clear.

## 📱 Responsive Design

- **Desktop**: Full-width dengan multi-column layouts
- **Tablet**: 2-column grid dengan adaptive spacing
- **Mobile**: Single column, bottom navigation untuk easy access

## 🌐 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

## 🤝 Contributing

Contributions welcome! Feel free to:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License - feel free to use for your spa business!

## 👨‍💻 Developer

Developed by **Logika Studio**
- GitHub: [@logikaistudio](https://github.com/logikaistudio)

## 🙏 Acknowledgments

- Built with ❤️ using React & Vite
- Charts powered by Recharts
- PDF generation by jsPDF
- Excel export by SheetJS

---

**SPAcity** - Modern SPA Management Made Easy 🧖‍♀️✨
