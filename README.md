# 🐱 Paws & Preferences - Find Your Favourite Kitty!

A beautiful, interactive web application that helps you discover your favorite cats through a Tinder-like swiping experience. Built with modern web technologies and featuring a stunning glassmorphism design.

![Paws & Preferences](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black) ![React](https://img.shields.io/badge/React-19.1.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)

## 🌟 Live Demo

🚀 **[Try it live on GitHub Pages]([https://YOUR_USERNAME.github.io/YOUR_REPO_NAME](https://anuarul-irfan.github.io/Paws-Preferences-Find-Your-Favourite-Kitty-/))**

> **Note**: Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name

## ✨ Features

### 🎨 **Beautiful UI/UX**
- **Glassmorphism Design** - Modern frosted glass effects with gradients
- **Responsive Layout** - Perfect on desktop, tablet, and mobile
- **Smooth Animations** - Fluid transitions and micro-interactions
- **Dynamic Background** - Animated gradient background that shifts colors
- **Loading States** - Elegant spinners and loading indicators

### 📱 **Interactive Experience**
- **Mobile Swipe** - Tinder-like swipe gestures for mobile users
- **Web Click** - Button-based interactions for desktop users
- **Visual Feedback** - Real-time swipe indicators and completion confirmations
- **Smart Loading** - Prevents interaction while images are loading
- **Perfect Timing** - Confirmation emojis appear after animations complete

### 🐾 **Cat Discovery**
- **Random Cat Images** - Fresh cats from the Cat as a Service API
- **Tag System** - Each cat comes with descriptive tags
- **Preference Tracking** - Remembers your liked and disliked cats
- **Smart Filtering** - Avoids showing duplicate cats
- **Variety** - Mix of tagged cats and filtered variations

### 📊 **Analytics & Summary**
- **Statistics Dashboard** - Like/dislike ratios and completion rates
- **Most Favourite Tag** - Discover your preferred cat characteristics
- **Liked Cats Gallery** - Browse through your favorite felines
- **Tag Display** - See all tags associated with each cat
- **Restart Option** - Start fresh anytime

## 🛠️ Tech Stack

### **Frontend Framework**
- **Next.js 15.1.0** - React framework with App Router
- **React 19.1.1** - Latest React with concurrent features
- **TypeScript 5.8.3** - Type-safe development

### **Styling & UI**
- **CSS3** - Custom CSS with modern features
- **CSS Grid & Flexbox** - Responsive layouts
- **CSS Animations** - Smooth transitions and keyframes
- **Glassmorphism** - Modern design aesthetic
- **Responsive Design** - Mobile-first approach

### **State Management**
- **React Hooks** - useState, useEffect, useCallback, useRef
- **Custom Hooks** - useCats, useSwipe, useLocalStorage
- **Local Storage** - Persistent user preferences

### **Build & Deployment**
- **Next.js Static Export** - Optimized for GitHub Pages
- **GitHub Actions** - Automated deployment pipeline
- **ESLint** - Code quality and consistency
- **TypeScript** - Compile-time error checking

## 🔌 API Integration

### **Cat as a Service (CATAAS)**
- **Base URL**: `https://cataas.com`
- **Image Endpoint**: `/cat/{id}`
- **Tags Endpoint**: `/api/tags`
- **Filter Endpoint**: `/cat?filter={type}&json=true`

### **API Features**
- **Random Cat Images** - High-quality cat photos
- **Tag System** - Descriptive metadata for each cat
- **Filter Options** - Monochrome, negate, square, custom filters
- **JSON Metadata** - Structured data for each image
- **Error Handling** - Graceful fallbacks for failed requests

### **Data Flow**
1. **Fetch Tags** - Get available cat tags from API
2. **Fetch Cats** - Retrieve cats with specific tags
3. **Apply Filters** - Add variety with different filter types
4. **Validate Data** - Ensure all cats have required metadata
5. **Cache Results** - Store in local state for performance

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/paws-preferences.git
   cd paws-preferences
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
   ```
   http://localhost:3000
   ```

### **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run export` - Build static export for GitHub Pages

## 📱 Usage

### **Mobile Users**
1. **Swipe Right** - Like the cat ❤️
2. **Swipe Left** - Dislike the cat ❌
3. **View Tags** - See cat characteristics
4. **Complete Session** - View your summary

### **Desktop Users**
1. **Click Heart** - Like the cat ❤️
2. **Click X** - Dislike the cat ❌
3. **Hover Effects** - Interactive button animations
4. **Keyboard Support** - Arrow keys for navigation

### **Summary Screen**
- **Statistics** - View your preference data
- **Favourite Tag** - Discover your most-liked characteristic
- **Liked Cats** - Browse your favorites with tags
- **Start Over** - Begin a new session

## 🏗️ Project Structure

```
paws-preferences/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── src/
│   ├── components/        # React components
│   │   ├── CatCard.tsx    # Main cat card component
│   │   ├── CatGrid.tsx    # Grid for liked cats
│   │   ├── CatPopup.tsx   # Cat detail popup
│   │   ├── ErrorScreen.tsx # Error handling
│   │   ├── LoadingSpinner.tsx # Loading states
│   │   ├── SummaryScreen.tsx # Results summary
│   │   └── SummaryStats.tsx  # Statistics display
│   ├── hooks/             # Custom React hooks
│   │   ├── useCats.ts     # Cat data management
│   │   ├── useLocalStorage.ts # Local storage handling
│   │   └── useSwipe.ts    # Swipe gesture handling
│   ├── services/          # API services
│   │   └── catApi.ts      # Cat API integration
│   ├── types/             # TypeScript types
│   │   └── cat.ts         # Cat and app state types
│   ├── utils/             # Utility functions
│   │   ├── constants.ts   # App constants
│   │   └── statistics.ts  # Statistics calculations
│   ├── App.css            # Main stylesheet
│   └── index.css          # Global styles
├── .github/workflows/     # GitHub Actions
│   └── deploy.yml         # Deployment workflow
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## 🎨 Design System

### **Color Palette**
- **Primary**: Gradient blues and purples
- **Accent**: Pink and green for like/dislike
- **Background**: Animated gradient with glassmorphism
- **Text**: White with subtle shadows
- **Cards**: Semi-transparent with backdrop blur

### **Typography**
- **Font**: Inter (Google Fonts)
- **Headings**: Bold with gradient text effects
- **Body**: Clean, readable sans-serif
- **Tags**: Monospace for code-like appearance

### **Animations**
- **Swipe**: Transform and rotate on drag
- **Buttons**: Shimmer and hover effects
- **Background**: Continuous gradient shift
- **Cards**: Smooth transitions and scaling
- **Loading**: Elegant spinner animations

## 🔧 Configuration

### **Environment Variables**
No environment variables required - uses public APIs

### **Customization**
- **API Endpoints**: Modify in `src/services/catApi.ts`
- **Styling**: Update `src/App.css` for design changes
- **Constants**: Adjust in `src/utils/constants.ts`
- **Animations**: Modify timing in CSS keyframes

## 🚀 Deployment

### **GitHub Pages (Recommended)**
1. Fork or clone this repository
2. Enable GitHub Pages in repository settings
3. Push to main branch
4. Automatic deployment via GitHub Actions

### **Other Platforms**
- **Vercel**: `vercel deploy`
- **Netlify**: Connect GitHub repository
- **Static Hosting**: Use `npm run export` output

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Cat as a Service API** - For providing amazing cat images
- **Next.js Team** - For the excellent React framework
- **React Team** - For the powerful UI library
- **GitHub** - For free hosting and deployment

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-username/paws-preferences/issues) page
2. Create a new issue with detailed description
3. Include browser console errors if applicable

---

**Made with ❤️ for cat lovers everywhere! 🐾**

*Discover your perfect feline companion through the power of modern web technology.*
