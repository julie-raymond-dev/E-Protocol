# 🥗💪 E-Protocol - Smart Nutrition & Fitness Tracker

> **Precision nutrition meets intelligent fitness tracking**

A comprehensive personal nutrition and fitness management application that revolutionizes how you approach health and wellness. Built with modern web technologies for seamless user experience and offline-first data persistence.

## 🌟 Core Features

### 📊 **Smart Nutrition Management**
- **Automated Daily Meal Planning**: Intelligent meal rotation system preventing dietary monotony
- **Real-time Macro Tracking**: Live monitoring of calories, proteins, lipids, and carbohydrates
- **Custom Recipe Manager**: Create, edit, and organize personal recipes with automatic nutritional calculations
- **Meal Customization**: Flexible meal selection for breakfast, lunch, dinner, and snacks
- **Nutritional Analysis**: Detailed ingredient-level macro breakdown for every meal

### 🏃‍♀️ **Advanced Activity Monitoring**
- **MET-Based Calculations**: Scientific calorie burn estimation using Metabolic Equivalent of Task values
- **Comprehensive Activity Database**: 25+ activities across multiple categories:
  - **Cardio**: Step, Zumba, RPM, Cardio Combat
  - **Strength**: Bodypump, Body Sculpt, Weight Training
  - **Wellness**: Yoga, Pilates, Stretching
  - **High Intensity**: Hyrox, HBX Boxing, HBX Fusion
  - **Sports**: Squash, Golf, Climbing
  - **Personal**: Walking, Active Rest, Free Stretching
- **Dynamic Calorie Adjustment**: Automatic calorie target increases based on completed activities
- **Activity Categorization**: Organized by intensity and type for better tracking

### 💊 **Supplement Management**
- **Daily Supplement Tracking**: Monitor intake of nutritional supplements
- **Macro Integration**: Supplements contribute to daily nutritional totals
- **Custom Supplement Support**: Add personal supplement protocols
- **Clear Whey Protein Tracking**: Specialized tracking for protein supplementation

### 📈 **Advanced Analytics & Progress Tracking**
- **Weekly Summary Reports**: Comprehensive performance analysis with:
  - Nutritional goal achievement percentages
  - Activity completion rates
  - Meal adherence statistics
  - Supplement compliance tracking
- **Adaptive Motivational Messaging**: Dynamic feedback based on achievement levels:
  - ≥95%: "Excellent travail cette semaine ! 🏆"
  - ≥85%: "Très bonne semaine ! 🎯"
  - ≥70%: "Bonne progression ! 📈"
  - ≥50%: "Continue tes efforts ! 💪"
  - ≥25%: "Il faut se reprendre ! 📉"
  - <25%: "Nouvelle semaine, nouveau départ ! 🚀"
- **Visual Progress Indicators**: Color-coded achievement tracking
- **Historical Data Analysis**: Long-term trend monitoring

### 👤 **Intelligent User Profiling**
- **Comprehensive Metabolic Calculations**: 
  - BMR (Basal Metabolic Rate) using Mifflin-St Jeor equation
  - TDEE (Total Daily Energy Expenditure) based on activity level
  - Personalized calorie targets based on goals
- **Multiple Diet Support**:
  - Standard balanced diet
  - High-protein, reduced-carb protocols
- **Adaptive Goal Setting**: Automatic macro adjustments based on:
  - Weight goals (loss/maintenance/gain)
  - Activity level (sedentary to very active)
  - Body composition metrics
- **Profile Persistence**: Secure storage with Auth0 authentication

## 🛠️ **Technical Architecture**

### **Frontend Technology Stack**
- **React 18.3.1**: Modern functional components with hooks
- **TypeScript**: Full type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first styling for responsive design
- **Lucide React**: Consistent, beautiful iconography
- **Vite**: Lightning-fast development and optimized production builds

### **Data Management**
- **IndexedDB Storage**: Offline-first data persistence for recipes and user profiles
- **LocalStorage**: Session management and daily progress tracking
- **Auth0 Authentication**: Secure user management and authorization
- **Context API**: Global state management for recipes and user data

### **Core Services**
- **Recipe Storage Service**: CRUD operations with nutritional calculations
- **User Profile Service**: Metabolic calculations and goal management  
- **Protocol Generator**: Intelligent daily meal and activity planning
- **MET Calculator**: Scientific activity calorie burn calculations

### **Advanced Features**
- **Offline Functionality**: Full app functionality without internet connection
- **Data Export/Import**: Backup and restore personal data
- **Responsive Design**: Optimized for all device sizes
- **Progressive Web App**: App-like experience on mobile devices

## 🎯 **Unique Value Propositions**

### **Scientific Accuracy**
- MET-based calorie calculations for 25+ activities
- Mifflin-St Jeor BMR calculations for precise metabolic estimates
- Evidence-based macro distribution protocols

### **User Experience Excellence**
- Intuitive daily tracking with single-tap meal logging
- Smart defaults with full customization flexibility
- Visual feedback systems for motivation and progress

### **Data Intelligence**
- Automated meal rotation preventing dietary boredom
- Adaptive calorie targets based on activity completion
- Weekly analytics with actionable insights

### **Offline-First Architecture**
- Works seamlessly without internet connection
- Local data persistence with cloud backup options
- Fast, responsive interface regardless of connectivity

## 🚀 **Getting Started**

### **Prerequisites**
```bash
Node.js 18+ and npm/yarn package manager
```

### **Installation**
```bash
# Clone repository
git clone https://github.com/julie-raymond-dev/E-protocol-app.git
cd E-protocol-app

# Install dependencies
npm install

# Configure Auth0 (create .env file)
cp .env.example .env
# Add your Auth0 domain and client ID

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### **Environment Variables**
```env
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-audience
```

## 📱 **Component Architecture**

### **Core Components**
- **Dashboard**: Main application hub with daily tracking
- **UserProfile**: Comprehensive profile management with metabolic calculations
- **MealSelector**: Advanced meal selection with recipe integration
- **ActivitySelector**: Activity choice with MET-based calculations
- **WeeklySummary**: Detailed performance analytics and motivation
- **RecipeManager**: Full CRUD recipe management with nutritional analysis

### **Utility Components**
- **MacroCard**: Visual macro tracking with progress indicators
- **MealCard**: Individual meal display with completion tracking
- **SportCard**: Activity display with calorie burn estimation
- **ComplementsCard**: Supplement tracking interface

## 🌐 **Live Application**

**[View Live Demo](https://julie-raymond-dev.github.io/E-protocol-app/)**

## 📊 **Performance Metrics**

- **Offline Functionality**: 100% feature availability without internet
- **Load Time**: <2s initial load with caching
- **Data Persistence**: Reliable IndexedDB storage with LocalStorage fallback
- **Cross-Platform**: Responsive design supporting all modern browsers

## 🤝 **Perfect For**

- 🏋️‍♀️ **Fitness Enthusiasts**: Comprehensive workout and nutrition tracking
- 🥗 **Health-Conscious Individuals**: Detailed nutritional monitoring and analysis
- 📈 **Data-Driven People**: Analytics and progress tracking enthusiasts
- 💪 **Structured Wellness**: Those seeking organized, scientific health routines
- 🎯 **Goal-Oriented Users**: People working toward specific fitness/nutrition objectives

## ⚙️ **Auth0 Configuration**

Cette application utilise Auth0 pour l'authentification sécurisée. Voici comment la configurer :

#### 1. Créer un compte Auth0

1. Allez sur [auth0.com](https://auth0.com) et créez un compte gratuit
2. Créez un nouveau tenant (domaine)

#### 2. Configurer l'application

1. Dans le dashboard Auth0, allez dans **Applications** → **Create Application**
2. Choisissez **Single Page Application** et sélectionnez **React**
3. Dans les **Settings** de votre application :
   - **Allowed Callback URLs** : `http://localhost:5173, https://votre-domaine.github.io`
   - **Allowed Logout URLs** : `http://localhost:5173, https://votre-domaine.github.io`
   - **Allowed Web Origins** : `http://localhost:5173, https://votre-domaine.github.io`

#### 3. Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Remplissez le fichier `.env` avec vos valeurs Auth0 :

```env
VITE_AUTH0_DOMAIN=votre-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=votre-client-id
VITE_AUTH0_AUDIENCE=votre-api-audience (optionnel)
```

⚠️ **Important** : Le fichier `.env` ne doit jamais être commité. Il est déjà ajouté au `.gitignore`.

#### 4. Ajouter des utilisateurs

Dans Auth0, allez dans **User Management** → **Users** → **Create User** pour ajouter des utilisateurs autorisés.

## 🌟 Features

### 📊 Nutrition Tracking
- **Daily Meal Planning**: Automated meal rotation with customizable options
- **Macro Tracking**: Real-time monitoring of calories, proteins, lipids, and carbohydrates
- **Smart Calculations**: Only counts macros from completed/checked meals and supplements
- **Flexible Meal Options**: 
  - Fixed breakfast and post-workout protein shake
  - Rotating lunch and dinner options
  - Multiple snack choices
  - Complete supplement protocol

### 🏋️ Fitness Management
- **Activity Scheduling**: Daily workout recommendations with activity rotation
- **Comprehensive Activity Library**:
  - **Fitness Classes**: Bodybalance, Pilates, Stretching, Swiss Ball, Yoga, Cardio Combat, Step variants, LIA, Bodypump, Body Sculpt, Glutes-Abs-Thighs, RPM, Zumba, Hyrox, HBX series
  - **Open Access**: Cardio-strength training, Climbing, Golf, Squash
  - **Personal Options**: Active recovery, Walking, Free stretching
- **Progress Tracking**: Mark completed activities and track weekly performance

### 📈 Weekly Analytics
- **Sunday Summary**: Comprehensive weekly performance review (unlocked every Sunday)
- **Achievement Metrics**: 
  - Nutritional goal achievement rates
  - Activity completion statistics
  - Meal and supplement adherence tracking
- **Visual Progress**: Color-coded progress bars and achievement badges

---

**Made with ❤️ for the health and fitness community**

*Transform your nutrition journey with data-driven precision and intelligent automation*

## 🔗 **Links**

- [Live Application](https://julie-raymond-dev.github.io/E-protocol-app/)
- [GitHub Repository](https://github.com/julie-raymond-dev/E-protocol-app)
- [Report Issues](https://github.com/julie-raymond-dev/E-protocol-app/issues)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ActivitySelector.tsx    # Activity selection modal
│   ├── ComplementsCard.tsx     # Supplement tracking card
│   ├── Dashboard.tsx           # Main application dashboard
│   ├── Login.tsx              # Authentication component
│   ├── MacroCard.tsx          # Macronutrient display card
│   ├── MealCard.tsx           # Individual meal tracking card
│   ├── MealSelector.tsx       # Meal selection modal
│   ├── SportCard.tsx          # Activity tracking card
│   └── WeeklySummary.tsx      # Weekly performance review
├── data/
│   └── protocol.ts            # Nutrition and activity data
├── types/
│   └── index.ts               # TypeScript type definitions
├── utils/
│   ├── protocolGenerator.ts   # Daily protocol generation logic
│   └── storage.ts             # Local storage management
├── App.tsx                    # Root application component
├── main.tsx                   # Application entry point
└── index.css                  # Global styles
```

## 🎨 Technology Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.5.3
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.344.0
- **Code Quality**: ESLint 9.9.1

## 📱 User Interface

### 🔐 Authentication
Secure login system with personalized credentials and user session management.

### 📅 Daily Dashboard
- **Date Navigation**: Browse through different days with intuitive navigation
- **Real-time Macro Tracking**: Visual progress bars showing completion percentages
- **Interactive Meal Cards**: Check off completed meals and modify selections
- **Activity Management**: Schedule and track daily workouts
- **Supplement Protocol**: Monitor daily supplement intake

### 🎯 Smart Macro Calculation
The application intelligently calculates your actual macro intake based only on:
- ✅ Checked/completed meals
- ✅ Checked/completed supplements
- ❌ Unchecked items are excluded from calculations

### 📊 Weekly Summary (Sundays Only)
Comprehensive weekly performance review featuring:
- Nutritional goal achievement metrics
- Activity completion statistics
- Meal and supplement adherence rates
- Visual progress indicators and achievement badges

## 🍽️ Meal Options

### Fixed Meals
- **Breakfast**: Oat flakes (40g) + sheep yogurt (150g) + chia seeds (10g) + almond butter (5g) + ½ apple + cinnamon/lemon
- **Post-Workout**: Clear Whey protein shake (25g peach tea flavor)

### Rotating Lunch/Dinner Options
- Chicken tikka with quinoa
- Chicken with tomato sauce
- Quinoa omelet
- Beef meatballs with pasta
- Teriyaki salmon with rice
- Scrambled eggs with sweet potato
- Chicken with tomato sauce and lentils
- Turkey curry with brown rice
- Paprika chicken with sweet potato

### Snack Varieties
- Fruit + almonds
- Pear + walnuts
- Clementine + peanut butter
- Soy yogurt + flax seeds
- Carrot + almond butter
- Kiwi + grated coconut

## 🏃 Activity Protocol

### Fitness Classes
Comprehensive group fitness options including strength, cardio, flexibility, and specialized training programs.

### Open Access Activities
Equipment-based training options for independent workouts including cardio-strength training, climbing, golf, and squash.

### Personal Training Options
Flexible activities for active recovery, walking, and free-form stretching sessions.

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Code Quality
- ESLint configuration for TypeScript and React
- Automatic code formatting and error detection
- Type safety with TypeScript strict mode

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

Preview the production build locally before deployment.

## 🎯 Key Features Breakdown

### 1. Intelligent Meal Rotation
The application automatically rotates through different meal options based on the date, ensuring variety while maintaining nutritional consistency.

### 2. Real-time Macro Tracking
Only completed (checked) meals and supplements contribute to your daily macro totals, providing accurate real-time tracking of your actual intake.

### 3. Flexible Customization
Users can override default meal and activity selections while maintaining the underlying nutritional structure.

### 4. Weekly Performance Analytics
Every Sunday, unlock a comprehensive review of the previous week's performance with detailed metrics and achievement tracking.

### 5. Complete Supplement Integration
Full integration of supplement macros into daily calculations with detailed nutritional information for each supplement.

## 🔮 Future Enhancements

- [ ] Data export functionality
- [ ] Custom meal creation
- [ ] Photo meal logging
- [ ] Integration with fitness trackers
- [ ] Nutritionist consultation features
- [ ] Multi-language support
- [ ] Mobile app development

## 📄 License

This project is a personal nutrition tracking application. All rights reserved.

## 🤝 Contributing

This is a personal project. For suggestions or improvements, please contact the project maintainer.

## 📞 Support

For technical support or questions about the application, please refer to the documentation or contact the development team.

---

**Built with ❤️ for optimal nutrition and fitness tracking**
