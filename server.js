const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'dongles.json');

// Authentication settings
const ACCESS_PASSWORD = '7250';

// Middleware
app.use(cors());
app.use(express.json());

// Session configuration
app.use(session({
    secret: 'dongle-tracker-secret-key-7250',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    } else {
        return res.status(401).json({ error: 'Authentication required' });
    }
}

// Serve static files with authentication check for main app
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/styles.css', express.static(path.join(__dirname, 'public', 'styles.css')));
app.use('/script.js', requireAuth, express.static(path.join(__dirname, 'public', 'script.js')));

// Serve login page for unauthenticated users
app.get('/', (req, res) => {
    if (req.session && req.session.authenticated) {
        // User is authenticated, serve main app
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        // User not authenticated, serve login page
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
});

// Authentication endpoints
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    
    if (password === ACCESS_PASSWORD) {
        req.session.authenticated = true;
        res.json({ 
            success: true, 
            message: 'Authentication successful' 
        });
    } else {
        res.status(401).json({ 
            error: 'Invalid access code' 
        });
    }
});

app.get('/api/check-auth', (req, res) => {
    if (req.session && req.session.authenticated) {
        res.json({ authenticated: true });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to logout' });
        } else {
            res.json({ message: 'Logged out successfully' });
        }
    });
});

// Initialize data file if it doesn't exist
function initializeDataFile() {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            dongles: {
                "davinci-configurator-1": {
                    name: "DaVinci Configurator #1",
                    isCheckedOut: false,
                    checkedOutBy: null,
                    location: null,
                    checkedOutAt: null
                },
                "davinci-configurator-2": {
                    name: "DaVinci Configurator #2",
                    isCheckedOut: false,
                    checkedOutBy: null,
                    location: null,
                    checkedOutAt: null
                },
                "davinci-developer": {
                    name: "DaVinci Developer",
                    isCheckedOut: false,
                    checkedOutBy: null,
                    location: null,
                    checkedOutAt: null
                }
            },
            history: []
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
}

// Read data from file
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data file:', error);
        return { dongles: {} };
    }
}

// Write data to file
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data file:', error);
        return false;
    }
}

// Add history entry
function addHistoryEntry(data, dongleId, action, userName, location = null) {
    if (!data.history) {
        data.history = [];
    }
    
    // Use Poland timezone (Europe/Warsaw)
    const polandTime = new Date().toLocaleString("en-US", {timeZone: "Europe/Warsaw"});
    const polandDate = new Date().toLocaleDateString("en-US", {timeZone: "Europe/Warsaw"});
    const polandTimeOnly = new Date().toLocaleTimeString("en-US", {timeZone: "Europe/Warsaw"});
    
    const historyEntry = {
        id: Date.now().toString(),
        dongleId: dongleId,
        dongleName: data.dongles[dongleId]?.name || 'Unknown Dongle',
        action: action, // 'checkout' or 'checkin'
        userName: userName,
        location: location,
        timestamp: new Date().toISOString(),
        date: polandDate,
        time: polandTimeOnly
    };
    
    data.history.unshift(historyEntry); // Add to beginning for newest first
    
    // Keep only last 100 entries to prevent file from growing too large
    if (data.history.length > 100) {
        data.history = data.history.slice(0, 100);
    }
    
    return historyEntry;
}

// Routes - All API routes require authentication

// Get current dongle status
app.get('/api/dongles', requireAuth, (req, res) => {
    const data = readData();
    res.json(data.dongles);
});

// Check out a dongle
app.post('/api/dongles/:dongleId/checkout', requireAuth, (req, res) => {
    const { dongleId } = req.params;
    const { userName, location } = req.body;

    if (!userName || !location) {
        return res.status(400).json({ 
            error: 'User name and desk location are required' 
        });
    }

    const data = readData();
    const dongle = data.dongles[dongleId];

    if (!dongle) {
        return res.status(404).json({ 
            error: 'Dongle not found' 
        });
    }

    if (dongle.isCheckedOut) {
        return res.status(400).json({ 
            error: `Dongle is already checked out by ${dongle.checkedOutBy}` 
        });
    }

    // Check out the dongle
    dongle.isCheckedOut = true;
    dongle.checkedOutBy = userName;
    dongle.location = location;
    dongle.checkedOutAt = new Date().toLocaleString("en-US", {timeZone: "Europe/Warsaw"});

    // Add history entry
    const historyEntry = addHistoryEntry(data, dongleId, 'checkout', userName, location);

    if (writeData(data)) {
        res.json({ 
            message: `${dongle.name} checked out successfully`,
            dongle: dongle,
            historyEntry: historyEntry
        });
    } else {
        res.status(500).json({ 
            error: 'Failed to save data' 
        });
    }
});

// Check in a dongle
app.post('/api/dongles/:dongleId/checkin', requireAuth, (req, res) => {
    const { dongleId } = req.params;
    const data = readData();
    const dongle = data.dongles[dongleId];

    if (!dongle) {
        return res.status(404).json({ 
            error: 'Dongle not found' 
        });
    }

    if (!dongle.isCheckedOut) {
        return res.status(400).json({ 
            error: 'Dongle is not currently checked out' 
        });
    }

    // Store user info before checking in for history
    const previousUser = dongle.checkedOutBy;
    const previousLocation = dongle.location;

    // Check in the dongle
    dongle.isCheckedOut = false;
    dongle.checkedOutBy = null;
    dongle.location = null;
    dongle.checkedOutAt = null;

    // Add history entry
    const historyEntry = addHistoryEntry(data, dongleId, 'checkin', previousUser, previousLocation);

    if (writeData(data)) {
        res.json({ 
            message: `${dongle.name} checked in successfully`,
            dongle: dongle,
            historyEntry: historyEntry
        });
    } else {
        res.status(500).json({ 
            error: 'Failed to save data' 
        });
    }
});

// Get dongle history
app.get('/api/history', requireAuth, (req, res) => {
    const data = readData();
    const history = data.history || [];
    
    // Optional filtering by dongle
    const { dongleId } = req.query;
    if (dongleId) {
        const filteredHistory = history.filter(entry => entry.dongleId === dongleId);
        res.json(filteredHistory);
    } else {
        res.json(history);
    }
});

// Clear dongle history
app.delete('/api/history', requireAuth, (req, res) => {
    const data = readData();
    
    // Keep dongles data but clear history
    data.history = [];
    
    if (writeData(data)) {
        res.json({ 
            message: 'History cleared successfully',
            clearedAt: new Date().toLocaleString("en-US", {timeZone: "Europe/Warsaw"})
        });
    } else {
        res.status(500).json({ 
            error: 'Failed to clear history' 
        });
    }
});

// Get dongle history/status for debugging
app.get('/api/status', requireAuth, (req, res) => {
    const data = readData();
    const status = {
        timestamp: new Date().toLocaleString("en-US", {timeZone: "Europe/Warsaw"}),
        dongles: data.dongles,
        totalDongles: Object.keys(data.dongles).length,
        checkedOut: Object.values(data.dongles).filter(d => d.isCheckedOut).length
    };
    res.json(status);
});

// Initialize data file and start server
initializeDataFile();

app.listen(PORT, () => {
    console.log(`🔑 Dongle Tracker Server running on http://localhost:${PORT}`);
    console.log(`📊 Data stored in: ${DATA_FILE}`);
});