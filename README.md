# E-Protocol 🥗💪

A comprehensive personal nutrition and fitness tracking application built with React, TypeScript, and Tailwind CSS. E-Protocol helps you manage your daily meal plans, track macronutrients, monitor supplement intake, and schedule physical activities with precision.

## ⚙️ Configuration

### Variables d'environnement

Pour que l'authentification fonctionne, vous devez créer un fichier `.env` à la racine du projet :

1. Copiez le fichier `.env.example` :
   ```bash
   cp .env.example .env
   ```

2. Modifiez le fichier `.env` avec vos identifiants :
   ```env
   VITE_AUTH_USERNAME=votre_nom_utilisateur
   VITE_AUTH_PASSWORD=votre_mot_de_passe
   ```

⚠️ **Important** : Le fichier `.env` contient vos identifiants personnels et ne doit jamais être commité. Il est déjà ajouté au `.gitignore`.

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

### 💊 Supplement Protocol
- **Complete Supplement Tracking**: 
  - Clear Whey Protein (25g): 120 kcal, 25g protein
  - Creatine Creapure (5g): 0 kcal
  - Fat Burner (4 caps): 8 kcal, 0.4g protein, 0.1g fat, 0.7g carbs
  - Multivitamins (3 caps): 7 kcal, 0.3g protein, 0.2g fat, 0.5g carbs
  - Omega-3 (2 caps): 18 kcal, 2g fat
  - Magnesium (2 caps): 4 kcal, 0.1g protein, 0.9g carbs

### 🎯 Daily Objectives
- **Calories**: 1,770 kcal
- **Proteins**: 102g
- **Lipids**: 49g
- **Carbohydrates**: 230g

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 10.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E-Protocol/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5174` (or the port shown in your terminal)

### Login Credentials
- **Username**: `julieraymond`
- **Password**: `Ap7ktxr7leo@`

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
