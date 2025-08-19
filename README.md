# Aplii Landing Page

Welcome to the official landing page for **Aplii** - The First AI Operating System.

## 🚀 Overview

This is a standalone landing page designed to introduce visitors to Aplii, showcasing its key features and benefits as the world's first AI operating system. The page is built with modern web technologies and optimized for young creators and tech-savvy users.

## ✨ Features

- **Modern Design**: Clean, gradient-rich design with glassmorphism effects
- **Mobile-First**: Responsive design optimized for all devices
- **Interactive Elements**: Smooth animations, hover effects, and particle systems
- **Performance Optimized**: Built with Vite for fast loading and optimal bundle size
- **SEO Ready**: Proper meta tags, Open Graph, and Twitter Card support

## 🛠️ Technology Stack

- **Build Tool**: Vite
- **Styling**: Pure CSS with modern features (CSS Grid, Flexbox, Custom Properties)
- **JavaScript**: Vanilla JS with modern ES6+ features
- **Icons**: Custom SVG icons and gradients
- **Fonts**: Inter font family from Google Fonts

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ (recommended)
- npm (comes with Node.js)

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
aplii-landing/
├── public/
│   └── favicon.svg          # App icon
├── index.html              # Main HTML file
├── main.js                 # JavaScript functionality
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🎨 Design System

### Colors
- **Primary Gradient**: `#667eea` to `#764ba2`
- **Secondary Gradient**: `#f093fb` to `#f5576c`
- **Accent Gradient**: `#4facfe` to `#00f2fe`
- **Dark Background**: `#0a0a0f`
- **Card Background**: `rgba(255, 255, 255, 0.05)`

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900

### Components
- **Hero Section**: Eye-catching introduction with gradient text and CTAs
- **Features Grid**: Six key feature cards with icons and descriptions
- **Stats Section**: Impressive numbers with gradient highlights
- **Footer**: Links organized by category

## 🔧 Customization

### Adding New Sections
1. Add the HTML structure to `index.html`
2. Add corresponding styles in the `<style>` section
3. Add any interactive functionality to `main.js`

### Modifying Colors
Update the CSS custom properties in the `:root` selector:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
  /* ... other colors */
}
```

### Adding Analytics
Replace the placeholder `trackEvent` function in `main.js` with your analytics service:

```javascript
function trackEvent(eventName, eventData = {}) {
  // Example: Google Analytics 4
  gtag('event', eventName, eventData);
  
  // Example: Mixpanel
  mixpanel.track(eventName, eventData);
}
```

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features Used**: CSS Grid, Flexbox, CSS Custom Properties, Intersection Observer API

## 🚀 Deployment

### Static Hosting (Recommended)
1. Build the project: `npm run build`
2. Upload the `dist/` folder to your hosting service:
   - **Netlify**: Drag and drop the `dist` folder
   - **Vercel**: Connect your repository or upload the folder
   - **GitHub Pages**: Upload to your repository
   - **AWS S3**: Upload to an S3 bucket with static website hosting

### Environment Variables
No environment variables are required for the basic landing page. For analytics or form handling, you may need to add:

- `VITE_ANALYTICS_ID`: Your analytics tracking ID
- `VITE_API_URL`: Backend API for contact forms

## 🎯 Target Audience

This landing page is specifically designed for:
- **Age Group**: 13-25 years old
- **Profile**: Young creators, students, tech enthusiasts
- **Interests**: AI, creative tools, interactive apps, social platforms
- **Behavior**: Mobile-first users, social media natives, early adopters

## 📄 License

This project is part of the Aplii ecosystem and is licensed under the MIT License.

## 🤝 Contributing

This is a standalone project separate from the main Aplii platform. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers and devices
5. Submit a pull request

## 📞 Support

For questions about this landing page:
- Create an issue in the repository
- Contact the Aplii team
- Check the main Aplii documentation

---

**Built with ❤️ for the future of AI-powered creativity**

*Last updated: January 2025*
