// DOM Elements
const dongleGrid = document.getElementById('dongleGrid');
const dongleSelect = document.getElementById('dongleSelect');
const checkoutForm = document.getElementById('checkoutForm');
const checkinForm = document.getElementById('checkinForm');
const userSelect = document.getElementById('userSelect');
const userNameInput = document.getElementById('userName');
const userLocationInput = document.getElementById('userLocation');
const customUserGroup = document.getElementById('customUserGroup');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkinBtn = document.getElementById('checkinBtn');
const refreshBtn = document.getElementById('refreshBtn');
const viewStatusBtn = document.getElementById('viewStatusBtn');
const viewHistoryBtn = document.getElementById('viewHistoryBtn');
const statusModal = document.getElementById('statusModal');
const statusData = document.getElementById('statusData');
const historyModal = document.getElementById('historyModal');
const historyContent = document.getElementById('historyContent');
const historyFilter = document.getElementById('historyFilter');
const notification = document.getElementById('notification');

// State
let dongles = {};
let selectedDongle = null;

// API Base URL
const API_BASE = '/api';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Dongle Tracker...');
    setupEventListeners();
    loadDongles();
    
    // Auto-refresh every 30 seconds
    setInterval(loadDongles, 30000);
    console.log('✅ Auto-refresh set up (every 30 seconds)');
});

// Setup event listeners
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Check if elements exist before adding listeners
    if (dongleSelect) {
        dongleSelect.addEventListener('change', handleDongleSelection);
        console.log('✅ Dongle select listener added');
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔒 Checkout button clicked');
            handleCheckout();
        });
        console.log('✅ Checkout button listener added');
    }
    
    if (checkinBtn) {
        checkinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔓 Checkin button clicked');
            handleCheckin();
        });
        console.log('✅ Checkin button listener added');
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Refresh button clicked');
            loadDongles();
        });
        console.log('✅ Refresh button listener added');
    }
    
    if (viewStatusBtn) {
        viewStatusBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📊 View status button clicked');
            showSystemStatus();
        });
        console.log('✅ View status button listener added');
    }
    
    if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📜 View history button clicked');
            showHistory();
        });
        console.log('✅ View history button listener added');
    }
    
    // User selection dropdown handler
    if (userSelect) {
        userSelect.addEventListener('change', function(e) {
            console.log('👤 User selection changed to:', e.target.value);
            const selectedOption = e.target.options[e.target.selectedIndex];
            
            if (e.target.value === 'Other') {
                customUserGroup.style.display = 'block';
                userNameInput.required = true;
                // Clear the desk location for custom users
                if (userLocationInput) userLocationInput.value = '';
            } else if (e.target.value) {
                customUserGroup.style.display = 'none';
                userNameInput.required = false;
                userNameInput.value = '';
                
                // Auto-fill desk location from data-desk attribute
                const deskLocation = selectedOption.getAttribute('data-desk');
                if (deskLocation && userLocationInput) {
                    userLocationInput.value = deskLocation;
                    console.log('🏢 Auto-filled desk location:', deskLocation);
                }
            } else {
                customUserGroup.style.display = 'none';
                userNameInput.required = false;
                userNameInput.value = '';
                // Clear desk location when no user selected
                if (userLocationInput) userLocationInput.value = '';
            }
            
            // Trigger form validation
            validateForm();
        });
        console.log('✅ User select listener added');
    }
    
    // Modal close functionality
    const closeModals = document.querySelectorAll('.close');
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            statusModal.style.display = 'none';
            historyModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === statusModal) {
            statusModal.style.display = 'none';
        }
        if (event.target === historyModal) {
            historyModal.style.display = 'none';
        }
    });
    
    // History filter listener
    if (historyFilter) {
        historyFilter.addEventListener('change', function(e) {
            console.log('🔍 History filter changed to:', e.target.value);
            loadHistory(e.target.value);
        });
        console.log('✅ History filter listener added');
    }
    
    // Form validation
    if (userSelect) {
        userSelect.addEventListener('change', validateForm);
    }
    if (userNameInput) {
        userNameInput.addEventListener('input', validateForm);
    }
    if (userLocationInput) {
        userLocationInput.addEventListener('input', validateForm);
    }
    
    console.log('✅ All event listeners set up');
}

// Load dongle data from API
async function loadDongles() {
    console.log('📡 Loading dongles from API...');
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/dongles`);
        
        console.log('📡 API Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        dongles = await response.json();
        console.log('📊 Dongles loaded:', dongles);
        
        renderDongles();
        updateFormState();
        
        showNotification('Dongle status refreshed', 'success');
        
    } catch (error) {
        console.error('❌ Error loading dongles:', error);
        showNotification('Failed to load dongle data. Please check if the server is running.', 'error');
        
        // Show fallback data if API fails
        dongles = {
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
        };
        renderDongles();
    } finally {
        showLoading(false);
    }
}

// Render dongle cards in the dashboard
function renderDongles() {
    console.log('🎨 Rendering dongle cards...');
    
    if (!dongleGrid) {
        console.error('❌ Dongle grid element not found');
        return;
    }
    
    dongleGrid.innerHTML = '';
    
    Object.entries(dongles).forEach(([id, dongle]) => {
        const card = createDongleCard(id, dongle);
        dongleGrid.appendChild(card);
    });
    
    console.log('✅ Dongle cards rendered');
}

// Create a dongle card element
function createDongleCard(id, dongle) {
    const card = document.createElement('div');
    card.className = `dongle-card ${dongle.isCheckedOut ? 'checked-out' : 'available'}`;
    
    // Make card clickable
    card.style.cursor = 'pointer';
    card.addEventListener('click', function(event) {
        handleCardClick(id, dongle, event);
    });
    
    const statusIcon = dongle.isCheckedOut ? 
        '<i class="fas fa-lock status-icon status-checked-out"></i>' : 
        '<i class="fas fa-unlock status-icon status-available"></i>';
    
    const statusText = dongle.isCheckedOut ? 'Checked Out' : 'Available - Click to Check Out';
    
    let detailsHtml = '';
    if (dongle.isCheckedOut) {
        const checkoutDate = new Date(dongle.checkedOutAt);
        const timeAgo = getTimeAgo(checkoutDate);
        
        detailsHtml = `
            <div class="dongle-details">
                <p><strong>User:</strong> ${dongle.checkedOutBy}</p>
                <p><strong>Location:</strong> ${dongle.location}</p>
                <p><strong>Since:</strong> ${timeAgo}</p>
                <p class="click-hint"><i class="fas fa-hand-pointer"></i> Click to Check In</p>
            </div>
        `;
    } else {
        detailsHtml = `
            <div class="dongle-details available-hint">
                <p class="click-hint"><i class="fas fa-hand-pointer"></i> Click to Check Out</p>
            </div>
        `;
    }
    
    card.innerHTML = `
        <div class="dongle-name">${dongle.name}</div>
        <div class="dongle-status">
            ${statusIcon}
            <span>${statusText}</span>
        </div>
        ${detailsHtml}
    `;
    
    return card;
}

// Handle dongle selection in the dropdown
function handleDongleSelection() {
    selectedDongle = dongleSelect.value;
    console.log('🎯 Selected dongle:', selectedDongle);
    updateFormState();
}

// Handle dongle card click
function handleCardClick(dongleId, dongle, event) {
    console.log('🖱️ Card clicked:', dongleId, dongle.name);
    
    // Set the selected dongle
    selectedDongle = dongleId;
    
    // Update the dropdown to reflect the selection
    if (dongleSelect) {
        dongleSelect.value = dongleId;
    }
    
    // Update form state
    updateFormState();
    
    // Scroll to the form section
    const formSection = document.querySelector('.form-section');
    if (formSection) {
        formSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
    
    // Show notification
    if (dongle.isCheckedOut) {
        showNotification(`${dongle.name} is ready to check in`, 'info');
    } else {
        showNotification(`${dongle.name} selected for checkout`, 'info');
    }
    
    // Add visual feedback - temporarily highlight the card
    const allCards = document.querySelectorAll('.dongle-card');
    allCards.forEach(card => card.classList.remove('card-selected'));
    
    const clickedCard = event.target.closest('.dongle-card');
    if (clickedCard) {
        clickedCard.classList.add('card-selected');
        setTimeout(() => {
            clickedCard.classList.remove('card-selected');
        }, 3000);
    }
}

// Update form state based on selected dongle
function updateFormState() {
    if (!selectedDongle || !dongles[selectedDongle]) {
        if (checkoutForm) checkoutForm.style.display = 'none';
        if (checkinForm) checkinForm.style.display = 'none';
        return;
    }
    
    const dongle = dongles[selectedDongle];
    console.log('📝 Updating form state for:', dongle.name, 'Checked out:', dongle.isCheckedOut);
    
    if (dongle.isCheckedOut) {
        // Show check-in form
        if (checkoutForm) checkoutForm.style.display = 'none';
        if (checkinForm) checkinForm.style.display = 'block';
        
        // Update current user info
        const currentUser = document.getElementById('currentUser');
        const currentLocation = document.getElementById('currentLocation');
        const checkoutTime = document.getElementById('checkoutTime');
        
        if (currentUser) currentUser.textContent = dongle.checkedOutBy;
        if (currentLocation) currentLocation.textContent = dongle.location;
        if (checkoutTime) checkoutTime.textContent = getTimeAgo(new Date(dongle.checkedOutAt));
    } else {
        // Show check-out form
        if (checkoutForm) checkoutForm.style.display = 'block';
        if (checkinForm) checkinForm.style.display = 'none';
    }
    
    validateForm();
}

// Handle checkout
async function handleCheckout() {
    console.log('🔒 Starting checkout process...');
    
    if (!validateForm()) {
        console.log('❌ Form validation failed');
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }
    
    // Get user name from dropdown or custom input
    let userName;
    if (userSelect.value === 'Other') {
        userName = userNameInput.value.trim();
    } else if (userSelect.value) {
        userName = userSelect.value;
    } else {
        showNotification('Please select a user', 'error');
        return;
    }
    
    const userLocation = userLocationInput.value.trim();
    
    console.log('📝 Checkout details:', { userName, userLocation, selectedDongle });
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE}/dongles/${selectedDongle}/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: userName,
                location: userLocation
            })
        });
        
        const result = await response.json();
        console.log('📡 Checkout response:', result);
        
        if (response.ok) {
            showNotification(`${result.dongle.name} checked out successfully!`, 'success');
            clearForm();
            loadDongles();
        } else {
            showNotification(result.error || 'Failed to check out dongle', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error checking out dongle:', error);
        showNotification('Network error. Please make sure the server is running.', 'error');
    } finally {
        showLoading(false);
    }
}

// Handle checkin
async function handleCheckin() {
    console.log('🔓 Starting checkin process...');
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE}/dongles/${selectedDongle}/checkin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        console.log('📡 Checkin response:', result);
        
        if (response.ok) {
            showNotification(`${result.dongle.name} checked in successfully!`, 'success');
            clearForm();
            loadDongles();
        } else {
            showNotification(result.error || 'Failed to check in dongle', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error checking in dongle:', error);
        showNotification('Network error. Please make sure the server is running.', 'error');
    } finally {
        showLoading(false);
    }
}

// Show system status modal
async function showSystemStatus() {
    console.log('📊 Loading system status...');
    
    try {
        const response = await fetch(`${API_BASE}/status`);
        const status = await response.json();
        
        console.log('📊 System status:', status);
        
        if (statusData) {
            statusData.textContent = JSON.stringify(status, null, 2);
        }
        if (statusModal) {
            statusModal.style.display = 'block';
        }
        
    } catch (error) {
        console.error('❌ Error loading system status:', error);
        showNotification('Failed to load system status. Server may not be running.', 'error');
    }
}

// Form validation
function validateForm() {
    if (!selectedDongle) {
        if (checkoutBtn) checkoutBtn.disabled = true;
        return false;
    }
    
    const dongle = dongles[selectedDongle];
    if (!dongle) {
        if (checkoutBtn) checkoutBtn.disabled = true;
        return false;
    }
    
    if (dongle.isCheckedOut) {
        // For check-in, no additional validation needed
        if (checkinBtn) checkinBtn.disabled = false;
        return true;
    } else {
        // For check-out, validate user input
        let userName = '';
        if (userSelect && userSelect.value) {
            if (userSelect.value === 'Other') {
                userName = userNameInput ? userNameInput.value.trim() : '';
            } else {
                userName = userSelect.value;
            }
        }
        
        const userLocation = userLocationInput ? userLocationInput.value.trim() : '';
        
        const isValid = userName.length >= 2 && userLocation.length >= 3;
        if (checkoutBtn) checkoutBtn.disabled = !isValid;
        return isValid;
    }
}

// Clear form inputs
function clearForm() {
    if (userSelect) userSelect.value = '';
    if (userNameInput) userNameInput.value = '';
    if (userLocationInput) userLocationInput.value = '';
    if (customUserGroup) customUserGroup.style.display = 'none';
    if (userNameInput) userNameInput.required = false;
    if (dongleSelect) dongleSelect.value = '';
    selectedDongle = null;
    updateFormState();
}

// Show notification
function showNotification(message, type = 'info') {
    console.log(`📢 Notification (${type}):`, message);
    
    if (!notification) {
        console.error('❌ Notification element not found');
        return;
    }
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Show/hide loading state
function showLoading(isLoading) {
    const buttons = [checkoutBtn, checkinBtn, refreshBtn, viewStatusBtn];
    buttons.forEach(btn => {
        if (btn) {
            btn.disabled = isLoading;
            if (isLoading) {
                btn.classList.add('loading');
            } else {
                btn.classList.remove('loading');
            }
        }
    });
}

// Utility function to get time ago string
function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) {
        return 'Just now';
    } else if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + R for refresh
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        loadDongles();
    }
    
    // Escape to close modal
    if (event.key === 'Escape' && statusModal) {
        statusModal.style.display = 'none';
    }
});

// Handle online/offline status
window.addEventListener('online', function() {
    showNotification('Connection restored. Refreshing data...', 'success');
    loadDongles();
});

window.addEventListener('offline', function() {
    showNotification('No internet connection. Data may be outdated.', 'error');
});

// Debug function to check if server is running
async function checkServerHealth() {
    try {
        const response = await fetch(`${API_BASE}/status`);
        if (response.ok) {
            console.log('✅ Server is running properly');
            return true;
        }
    } catch (error) {
        console.error('❌ Server health check failed:', error);
        return false;
    }
    return false;
}

// History Functions
async function showHistory() {
    console.log('📜 Opening history modal...');
    historyModal.style.display = 'block';
    await loadHistory();
}

async function loadHistory(filterDongleId = '') {
    console.log('📊 Loading history data...', filterDongleId ? `Filtered by: ${filterDongleId}` : 'All dongles');
    
    try {
        const url = filterDongleId ? `${API_BASE}/history?dongleId=${filterDongleId}` : `${API_BASE}/history`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch history: ${response.status}`);
        }
        
        const history = await response.json();
        console.log('📋 History data loaded:', history.length, 'entries');
        
        displayHistory(history);
    } catch (error) {
        console.error('❌ Error loading history:', error);
        historyContent.innerHTML = `
            <div class="no-history">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading history: ${error.message}</p>
            </div>
        `;
    }
}

function displayHistory(history) {
    if (!history || history.length === 0) {
        historyContent.innerHTML = `
            <div class="no-history">
                <i class="fas fa-history"></i>
                <p>No history available yet.</p>
                <p>Dongle activities will appear here once you start checking out dongles.</p>
            </div>
        `;
        return;
    }
    
    const historyHTML = history.map(entry => {
        const actionIcon = entry.action === 'checkout' ? 'fas fa-sign-out-alt' : 'fas fa-sign-in-alt';
        const actionText = entry.action === 'checkout' ? 'Checked Out' : 'Checked In';
        
        return `
            <div class="history-entry ${entry.action}">
                <div class="history-header">
                    <div class="history-action ${entry.action}">
                        <i class="${actionIcon}"></i>
                        ${actionText}
                        <span class="history-dongle">${entry.dongleName}</span>
                    </div>
                    <div class="history-timestamp">
                        ${entry.date} at ${entry.time}
                    </div>
                </div>
                <div class="history-details">
                    <div class="history-detail">
                        <strong>User:</strong> ${entry.userName}
                    </div>
                    ${entry.location ? `
                        <div class="history-detail">
                            <strong>Location:</strong> ${entry.location}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    historyContent.innerHTML = historyHTML;
}

// Run health check on load
window.addEventListener('load', function() {
    setTimeout(() => {
        checkServerHealth().then(isHealthy => {
            if (!isHealthy) {
                showNotification('Server is not responding. Please start the server with "npm start"', 'error');
            }
        });
    }, 1000);
});