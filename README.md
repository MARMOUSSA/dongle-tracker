# DaVinci Dongle Tracker

A web application to track who has the DaVinci license dongles in the ARTHIN-KRK team.

## Features

- 🔑 Track 3 DaVinci dongles (2 Configurator + 1 Developer)
- 👥 Predefined user list with auto-filled desk locations
- 📱 Mobile-friendly responsive design
- 📊 Complete history tracking of all activities
- 🎨 Modern glassmorphism UI with animations
- ⚡ Real-time status updates
- 🔍 Filter history by dongle

## Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd dongle-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

4. **Open in browser**
```
http://localhost:3000
```

## Deployment

### Deploy to Render (Free)

1. **Push to GitHub/GitLab**
2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Sign up/login with GitHub
   - Click "New Web Service"
   - Connect your repository
3. **Configure**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node.js
4. **Deploy**: Click "Create Web Service"

### Deploy to Railway (Free)

1. **Push to GitHub**
2. **Deploy**:
   - Go to [railway.app](https://railway.app)
   - Login with GitHub
   - Click "Deploy from GitHub repo"
   - Select your repository
3. **Auto-deployment**: Railway will automatically detect Node.js and deploy

### Deploy to Vercel (Free)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Follow prompts** for automatic deployment

## Project Structure

```
dongle-tracker/
├── server.js              # Express server
├── package.json           # Dependencies
├── render.yaml            # Render deployment config
├── public/                # Frontend files
│   ├── index.html        # Main HTML
│   ├── styles.css        # CSS styling
│   └── script.js         # JavaScript logic
└── data/                 # Data storage
    └── dongles.json      # Dongle status & history
```

## API Endpoints

- `GET /api/dongles` - Get current dongle status
- `POST /api/dongles/:id/checkout` - Check out a dongle
- `POST /api/dongles/:id/checkin` - Check in a dongle
- `GET /api/history` - Get activity history
- `GET /api/history?dongleId=X` - Get filtered history

## Users

The app includes 37 predefined users from the ARTHIN-KRK team with their desk locations (D.7.29 - D.7.69).

## Technology Stack

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Data**: JSON file storage
- **Styling**: Modern CSS with animations and glassmorphism
- **Icons**: Font Awesome

## License

MIT License - Feel free to use and modify!