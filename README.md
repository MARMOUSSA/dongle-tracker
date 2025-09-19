# 🔑 DaVinci Dongle Tracker

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)
![Platform](https://img.shields.io/badge/platform-cross--platform-lightgrey.svg)

**A modern web application to track DaVinci license dongles for the ARTHIN-KRK team**

[Live Demo](#) • [Features](#features) • [Installation](#installation) • [Deployment](#deployment)

</div>

---

## 🌟 Overview

The DaVinci Dongle Tracker is a sleek, modern web application designed to help teams manage and track the usage of DaVinci license dongles. Built with a beautiful glassmorphism UI and comprehensive functionality, it ensures accountability and prevents conflicts when multiple team members need access to 6 different license dongles with unique serial numbers.

## ✨ Features

### 🔐 **Security & Access Control**
- **Password Protection**: Secure access with 4-digit authentication code
- **Session Management**: 24-hour secure sessions with automatic expiry
- **Protected API**: All endpoints require authentication
- **Secure Logout**: Safe session termination with confirmation
- **Professional Login**: Beautiful, responsive login interface

### 🎯 **Dongle Management**
- **6 Dongle Types**: Track 3 DaVinci Developer dongles + 3 Configurator dongles
- **Serial Number Tracking**: Unique identification with A-series and PGM-series numbers
- **Real-time Status**: Instant visibility of availability and current users
- **One-click Actions**: Quick checkout/checkin with visual feedback
- **Smart Validation**: Prevents double-booking and invalid operations

### 👥 **User Management**
- **38 Predefined Users**: Complete ARTHIN-KRK team directory + LAB (D.7.29 - D.7.69 + Room 7.4)
- **Auto-fill Locations**: Desk locations automatically populated
- **Custom Users**: Support for temporary users or visitors
- **User Validation**: Ensures proper identification for accountability

### 📊 **Activity Tracking**
- **Complete History**: Every checkout/checkin action logged with timestamps
- **Filter by Dongle**: View activity history for specific dongles
- **Detailed Records**: User names, desk locations, and precise timing
- **Clear History**: Admin option to reset history with confirmation
- **Export Ready**: JSON-based storage for easy data export

### 🎨 **Modern Interface**
- **Glassmorphism Design**: Beautiful, modern UI with translucent effects
- **Responsive Layout**: Perfect experience on desktop, tablet, and mobile
- **Animated Elements**: Smooth transitions and hover effects
- **Dark/Light Compatible**: Adapts to system preferences
- **Touch-Friendly**: Optimized for mobile interaction
- **Secure Login**: Professional authentication interface with modern design

### 🚀 **Technical Excellence**
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Offline Resilience**: Graceful handling of network issues
- **Session Security**: Express-session based authentication
- **Fast Performance**: Lightweight and optimized for speed
- **Error Handling**: Comprehensive error management and user feedback
- **Production Ready**: Environment variable support and deployment configs

## 📱 Screenshots

*Coming soon - Add screenshots of your deployed application*

## 🛠️ Installation

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **Git** (for cloning)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/MARMOUSSA/dongle-tracker.git
cd dongle-tracker

# 2. Install dependencies
npm install

# 3. Start the development server
npm start

# 4. Open in browser and authenticate
# Navigate to http://localhost:3000
# Enter the 4-digit access code (contact admin for credentials)
```

### Environment Variables

```bash
# Optional: Create .env file for custom configuration
PORT=3000                    # Server port (default: 3000)
NODE_ENV=production         # Environment mode
ACCESS_CODE=XXXX            # 4-digit authentication code (optional override)
SESSION_SECRET=your-secret  # Session encryption key (auto-generated if not set)
```

## 🚀 Deployment

### Free Deployment Options

| Platform | Free Tier | Best For | Setup Time |
|----------|-----------|----------|------------|
| **Render** ⭐ | 750 hrs/month | Node.js apps | 3 minutes |
| **Railway** | $5 credit/month | Zero-config | 2 minutes |
| **Vercel** | Unlimited | Static + serverless | 1 minute |
| **Heroku** | Limited hours | Traditional hosting | 5 minutes |

### 🎯 Recommended: Deploy to Render

1. **Push to GitHub** (already done ✅)
2. **Go to [render.com](https://render.com)**
3. **Sign up/Login** with GitHub
4. **Click "New Web Service"**
5. **Connect repository**: Select `MARMOUSSA/dongle-tracker`
6. **Configure**:
   ```
   Name: dongle-tracker
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```
7. **Deploy** and get your live URL!

### 🚀 Alternative: One-Click Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### ⚡ Quick Vercel Deploy

```bash
npx vercel
```

## 🏗️ Project Structure

```
dongle-tracker/
├── 📄 server.js              # Express.js backend server with authentication
├── 📦 package.json           # Dependencies and scripts
├── 🐳 render.yaml            # Render deployment config
├── 📖 README.md              # This documentation
├── 📝 DEPLOYMENT.md          # Detailed deployment guide
├── 🚫 .gitignore             # Git ignore rules
├── 📂 public/                # Frontend assets
│   ├── 🌐 index.html        # Main HTML interface (protected)
│   ├── 🔐 login.html         # Secure login page
│   ├── 🎨 styles.css        # Modern CSS with animations
│   └── ⚡ script.js         # Interactive JavaScript
└── 💾 data/                 # Data storage
    ├── 📄 dongles.json      # Dongle status & history
    └── 📌 .gitkeep          # Keeps directory in git
```

## 🔌 API Documentation

### Endpoints

| Method | Endpoint | Description | Auth Required | Response |
|--------|----------|-------------|---------------|----------|
| `POST` | `/api/login` | Authenticate with access code | ❌ | `{success, message}` |
| `GET` | `/api/check-auth` | Check authentication status | ❌ | `{authenticated}` |
| `POST` | `/api/logout` | End session securely | ✅ | `{message}` |
| `GET` | `/api/dongles` | Get current dongle status | ✅ | `{dongles}` |
| `POST` | `/api/dongles/:id/checkout` | Check out a dongle | ✅ | `{message, dongle}` |
| `POST` | `/api/dongles/:id/checkin` | Check in a dongle | ✅ | `{message, dongle}` |
| `GET` | `/api/history` | Get activity history | ✅ | `[{history}]` |
| `GET` | `/api/history?dongleId=X` | Get filtered history | ✅ | `[{history}]` |
| `DELETE` | `/api/history` | Clear all history ⚠️ | ✅ | `{message}` |
| `GET` | `/api/status` | Get system status | ✅ | `{status}` |

### Example Requests

```javascript
// Authenticate (login)
POST /api/login
{
  "password": "XXXX"  // 4-digit access code
}

// Check out a dongle (requires authentication)
POST /api/dongles/davinci-developer-a12809/checkout
Headers: { Cookie: "session=..." }  // Session from login
{
  "userName": "Marwan Salah",
  "location": "D.7.61"
}

// Get history for specific dongle (requires authentication)
GET /api/history?dongleId=davinci-developer-a12809
Headers: { Cookie: "session=..." }

// Logout securely
POST /api/logout
Headers: { Cookie: "session=..." }
// Returns: {"message": "Logged out successfully"}

// Clear all history (requires confirmation in UI + authentication)
DELETE /api/history
Headers: { Cookie: "session=..." }
// Returns: {"message": "History cleared successfully", "clearedAt": "2025-09-18T..."}
```

## 👥 Team Directory

The app includes 38 predefined users from the ARTHIN-KRK team:

| Range | Users | Desks |
|-------|-------|-------|
| **D.7.29-D.7.39** | Tomasz B., Krzysztof N., Michal W., + 8 more | D.7.29-D.7.39 |
| **D.7.40-D.7.49** | Marcin P., Wojciech B., Richa S., + 7 more | D.7.40-D.7.49 |
| **D.7.50-D.7.59** | Przemek P., Jacek W., Marcin K., + 7 more | D.7.50-D.7.59 |
| **D.7.60-D.7.69** | Pawel K., Marwan S., Tomasz S., + 7 more | D.7.60-D.7.69 |
| **Special Locations** | LAB | Room 7.4 |

*Full list available in the application dropdown*

## 🛡️ Security & Privacy

- **Access Control**: Password-protected system with secure authentication
- **Session Security**: 24-hour sessions with automatic expiry and secure cookies
- **API Protection**: All endpoints require valid authentication
- **No Sensitive Data**: Only stores dongle usage information (no personal data)
- **Local Storage**: Data stored locally in JSON format
- **HTTPS Ready**: SSL certificates provided by hosting platforms
- **Input Validation**: All inputs validated and sanitized
- **CORS Configured**: Secure cross-origin requests
- **Secure Logout**: Safe session termination with confirmation
- **No External Dependencies**: Minimal attack surface

### 🔐 Authentication Details

- **Login System**: Professional 4-digit access code interface
- **Session Management**: Express-session with secure configuration
- **Auto-Logout**: Sessions expire after 24 hours for security
- **Route Protection**: All API endpoints and pages require authentication
- **Secure Cookies**: HttpOnly and secure session cookies (in production)

## 🔧 Development

### Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Access Management

**For Administrators:**
- The default access code is set in the source code
- Can be overridden with `ACCESS_CODE` environment variable
- Sessions automatically expire after 24 hours
- All API access requires authentication

**For Users:**
- Contact your system administrator for the access code
- Login once every 24 hours
- Use the logout button to end sessions securely

### Adding New Dongles

1. **Update server.js**: Add new dongle to `initialData` with unique ID and serial number
2. **Update index.html**: Add option to both dongle select dropdowns (main form and history filter)
3. **Test thoroughly**: Verify checkout/checkin and history tracking work correctly

**Current Dongles:**
- 3x DaVinci Developer: #A-12809, #A-12843, #A-12878  
- 3x DaVinci Configurator: #A-12824, #A-2036, #PGM-6803

### Customization

- **Colors**: Modify CSS custom properties in `styles.css`
- **Users**: Update user list in `index.html` 
- **Branding**: Change company name from ARTHIN-KRK
- **Features**: Add new endpoints in `server.js`

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Access denied / Login required** | Contact admin for the 4-digit access code |
| **Session expired** | Re-login with the access code (sessions last 24 hours) |
| **Port already in use** | Change PORT in environment or kill existing process |
| **Data not persisting** | Check file permissions in `data/` directory |
| **UI not loading** | Verify all files in `public/` directory |
| **History not showing** | Check browser console for JavaScript errors |
| **Login page not loading** | Verify `login.html` exists in `public/` directory |

### Debug Mode

```bash
# Enable detailed logging
NODE_ENV=development npm start
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📈 Roadmap

- [x] **User Authentication**: ✅ Secure login system with session management
- [ ] **Role-Based Access**: Admin and user roles with different permissions
- [ ] **Email Notifications**: Automated reminders for overdue dongles
- [ ] **Usage Analytics**: Charts and statistics dashboard
- [ ] **Mobile App**: Native iOS/Android application
- [ ] **Integration**: LDAP/Active Directory user sync
- [ ] **Backup**: Automated data backup to cloud storage
- [ ] **Audit Logs**: Enhanced security logging and monitoring

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ARTHIN-KRK Team** - For requirements and testing
- **Font Awesome** - For beautiful icons
- **Express.js** - For the robust backend framework
- **Modern CSS** - For glassmorphism design inspiration

---

<div align="center">

**Made with ❤️ for the ARTHIN-KRK team**

[⭐ Star this repo](https://github.com/MARMOUSSA/dongle-tracker) • [🐛 Report Bug](https://github.com/MARMOUSSA/dongle-tracker/issues) • [💡 Request Feature](https://github.com/MARMOUSSA/dongle-tracker/issues)

</div>