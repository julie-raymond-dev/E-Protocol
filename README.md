# E-Protocol - Smart Nutrition & Fitness Tracker

[![Deploy to GitHub Pages](https://github.com/julie-raymond-dev/E-Protocol/actions/workflows/deploy.yml/badge.svg)](https://github.com/julie-raymond-dev/E-Protocol/actions/workflows/deploy.yml)
[![Security Audit](https://github.com/julie-raymond-dev/E-Protocol/actions/workflows/security.yml/badge.svg)](https://github.com/julie-raymond-dev/E-Protocol/actions/workflows/security.yml)
[![PR Validation](https://github.com/julie-raymond-dev/E-Protocol/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/julie-raymond-dev/E-Protocol/actions/workflows/pr-validation.yml)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=flat&logo=github)](https://julie-raymond-dev.github.io/E-Protocol/)

> Modern React TypeScript application for intelligent nutrition tracking and fitness management with offline-first architecture

## 🛠️ Technical Stack

### Core Technologies
- **React 18.3.1** - Functional components with hooks
- **TypeScript 5.5.3** - Full type safety and enhanced DX
- **Vite 6.3.5** - Lightning-fast build tool
- **Tailwind CSS 3.4.1** - Utility-first styling
- **Auth0** - Secure authentication & authorization

### Data & Storage
- **IndexedDB** - Offline-first data persistence for recipes
- **LocalStorage** - Session management and daily progress
- **Context API** - Global state management
- **Custom Storage Services** - Abstracted data layer

### Build & Development
- **ESLint 9.9.1** - Code quality and consistency
- **PostCSS** - CSS processing
- **GitHub Actions** - CI/CD pipeline
- **Lighthouse CI** - Performance monitoring

## 🏗️ Architecture

### Project Structure
```
src/
├── components/           # React components
│   ├── Dashboard.tsx     # Main app interface
│   ├── UserProfile.tsx   # Profile management
│   ├── MealSelector.tsx  # Meal selection modal
│   ├── RecipeManager.tsx # Recipe CRUD operations
│   └── ...
├── services/            # Business logic
│   ├── userProfileService.ts
│   ├── recipeStorage.ts
│   └── ...
├── utils/               # Utility functions
│   ├── protocolGenerator.ts
│   ├── storage.ts
│   └── ...
├── types/               # TypeScript definitions
├── data/                # Static data
└── hooks/               # Custom React hooks
```

### Key Components

#### Dashboard Component
- **Purpose**: Main application hub with daily tracking
- **Features**: Date navigation, macro visualization, progress tracking
- **State Management**: Complex state with useReducer pattern
- **Performance**: Optimized re-renders with React.memo

#### RecipeManager Component
- **CRUD Operations**: Create, read, update, delete custom recipes
- **Nutritional Calculations**: Automatic macro computation
- **Data Persistence**: IndexedDB storage with error handling
- **Form Validation**: Real-time validation with TypeScript

#### UserProfile Service
- **BMR Calculation**: Mifflin-St Jeor equation implementation
- **TDEE Computation**: Total Daily Energy Expenditure
- **Goal Setting**: Adaptive macro targets based on objectives
- **Data Encryption**: Secure profile storage

### Data Flow

1. **User Authentication** → Auth0 handles login/logout
2. **Profile Loading** → Fetch user data from secure storage
3. **Daily Protocol Generation** → Algorithm creates personalized meal plans
4. **Progress Tracking** → Real-time macro calculations
5. **Data Persistence** → Automatic saving to IndexedDB/LocalStorage

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
npm or yarn
```

### Installation
```bash
git clone https://github.com/julie-raymond-dev/E-Protocol.git
cd E-Protocol
npm install
npm run dev
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Configure Auth0 credentials
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-audience
```

### Build & Deploy
```bash
# Production build
npm run build

# Deploy to GitHub Pages
npm run deploy

# Security audit
npm audit
```

## 🔐 Security Features

### Authentication
- **Auth0 Integration** - Enterprise-grade security
- **JWT Tokens** - Secure session management
- **Role-based Access** - User permission system

### Data Protection
- **Client-side Encryption** - Sensitive data protection
- **HTTPS Enforcement** - Secure data transmission
- **Input Validation** - XSS prevention
- **CSRF Protection** - Request validation

### CI/CD Security
- **Automated Security Audits** - npm audit in pipelines
- **Dependency Scanning** - Vulnerability detection
- **Branch Protection** - Secure deployment workflow
- **Secrets Management** - Environment variable protection

## 💡 Core Features

### Intelligent Nutrition Tracking
- **Automated Meal Planning** - Date-based rotation algorithm
- **Real-time Macro Calculations** - Live nutritional tracking
- **Custom Recipe Management** - User-defined meals with auto-calculation
- **MET-based Activity Tracking** - Scientific calorie burn estimation

### Advanced Analytics
- **Weekly Performance Reports** - Comprehensive progress analysis
- **Achievement Metrics** - Goal completion tracking
- **Visual Progress Indicators** - Color-coded feedback system
- **Trend Analysis** - Long-term pattern recognition

### Offline-First Design
- **Progressive Web App** - App-like mobile experience
- **IndexedDB Storage** - Reliable offline data persistence
- **Service Worker** - Background sync capabilities
- **Responsive Design** - Cross-device compatibility

## 📊 Performance Metrics

- **Initial Load**: < 2s with caching
- **Bundle Size**: Optimized with tree-shaking
- **Lighthouse Score**: 90+ across all categories
- **Offline Functionality**: 100% feature availability
- **Cross-browser Support**: Modern browsers (ES2020+)

## 🧪 Testing & Quality

### Code Quality
- **ESLint Rules** - Strict TypeScript configuration
- **Type Coverage** - 100% TypeScript implementation
- **Performance Monitoring** - React DevTools profiling
- **Accessibility** - WCAG 2.1 compliance

### CI/CD Pipeline
- **Automated Testing** - ESLint validation
- **Security Scanning** - Vulnerability assessment
- **Performance Testing** - Lighthouse CI integration
- **Deployment Automation** - GitHub Actions workflow

## 🌐 Live Application

**[Access Application](https://julie-raymond-dev.github.io/E-Protocol/)**

### Features Available
- Complete nutrition and fitness tracking
- Real-time macro calculations
- Weekly performance analytics
- Custom recipe management
- Offline functionality
- Responsive mobile interface

## 📝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- Follow TypeScript strict mode
- Use functional components with hooks
- Implement proper error handling
- Add comprehensive type definitions
- Follow conventional commit format

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://julie-raymond-dev.github.io/E-Protocol/](https://julie-raymond-dev.github.io/E-Protocol/)
- **Repository**: [https://github.com/julie-raymond-dev/E-Protocol](https://github.com/julie-raymond-dev/E-Protocol)
- **Issues**: [https://github.com/julie-raymond-dev/E-Protocol/issues](https://github.com/julie-raymond-dev/E-Protocol/issues)

---

*Built with ❤️ for developers who care about health and code quality*
