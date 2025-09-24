# StockWeb - React Stock Dashboard Demo

A modern, responsive stock dashboard built with React, TypeScript, Tailwind CSS, shadcn/ui, and Recharts. This project demonstrates a scalable architecture for financial applications with real-time data visualization capabilities.

![StockWeb Demo](https://github.com/user-attachments/assets/8cd0afb6-0ba3-4638-88c5-e3801069fa50)

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript, Vite for fast development
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: shadcn/ui for consistent, accessible UI components
- **Data Visualization**: Interactive charts with Recharts
- **Mock Data**: Simulated stock data with realistic market scenarios
- **Extensible Architecture**: Modular structure for easy maintenance and scaling

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## 📦 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components (Button, Card, etc.)
│   ├── Dashboard.tsx   # Main dashboard component
│   ├── Header.tsx      # Navigation header
│   ├── StockCard.tsx   # Individual stock display card
│   └── StockChart.tsx  # Chart visualization component
├── hooks/              # Custom React hooks (for future use)
├── lib/                # Utility libraries
│   └── utils.ts        # Common utility functions
├── types/              # TypeScript type definitions
│   └── stock.ts        # Stock-related types
├── utils/              # Helper functions
│   └── mockData.ts     # Mock data generation and formatting
├── App.tsx             # Root application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock_web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## 🏗️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Components

1. Create component in appropriate directory under `src/components/`
2. Export from component file
3. Import and use in parent components
4. Follow existing patterns for TypeScript interfaces

### Extending the Data Model

1. Update types in `src/types/stock.ts`
2. Modify mock data in `src/utils/mockData.ts`
3. Update components to handle new data fields

## 🎨 Customization

### Theming

The project uses CSS custom properties for theming. Modify colors in `src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --background: 0 0% 100%;
  /* ... other theme variables */
}
```

### Adding New Charts

1. Import required chart type from Recharts
2. Create new chart component following `StockChart.tsx` pattern
3. Add to dashboard or create new page

### Responsive Breakpoints

Tailwind CSS breakpoints used:
- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration with path aliases
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration

## 🚀 Deployment

### Netlify/Vercel
1. Connect repository to platform
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Manual Deployment
1. Run `npm run build`
2. Upload `dist/` folder to web server

## 🔮 Future Enhancements

### Immediate Improvements
- [ ] Add real-time data integration (WebSocket/API)
- [ ] Implement dark/light theme toggle
- [ ] Add more chart types (candlestick, volume bars)
- [ ] Create watchlist functionality
- [ ] Add portfolio management features

### Advanced Features
- [ ] User authentication and personalization
- [ ] Real financial API integration (Alpha Vantage, IEX Cloud)
- [ ] Advanced technical indicators
- [ ] News feed integration
- [ ] Mobile app using React Native
- [ ] PWA capabilities

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library 
- [Recharts](https://recharts.org/) for powerful charting capabilities
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide](https://lucide.dev/) for modern icons

---

**Note**: This is a demonstration project with simulated data. For production use, integrate with real financial data APIs and implement proper security measures.