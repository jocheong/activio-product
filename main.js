const appContainer = document.getElementById('app-container');
const profilesBtn = document.getElementById('profiles-btn');
const homeBtn = document.querySelector('h1');
const navButtons = document.querySelectorAll('nav .button'); // Assuming nav buttons are within <nav>

// --- Utility Functions ---
function showMessage(message, type = 'success') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    appContainer.prepend(messageEl); // Display at the top

    setTimeout(() => {
        messageEl.classList.add('hide');
        messageEl.addEventListener('transitionend', () => messageEl.remove());
    }, 3000);
}

// --- Data Management ---
function getProfiles() {
    const profiles = localStorage.getItem('activio-profiles');
    return profiles ? JSON.parse(profiles) : [];
}

function saveProfiles(profiles) {
    localStorage.setItem('activio-profiles', JSON.stringify(profiles));
}

function getActivities() {
    const activities = localStorage.getItem('activio-activities');
    return activities ? JSON.parse(activities) : [];
}

function saveActivities(activities) {
    localStorage.setItem('activio-activities', JSON.stringify(activities));
}

// --- Navigation & Routing ---
function highlightActiveNav(activeScreen) {
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    if (activeScreen === 'profiles') {
        profilesBtn.classList.add('active');
    }
}

function router(screen) {
    appContainer.innerHTML = ''; // Clear existing content
    highlightActiveNav(screen);

    switch (screen) {
        case 'welcome':
            renderWelcomeScreen();
            break;
        case 'profiles':
            renderProfilesScreen();
            break;
        case 'add-activity':
            renderAddActivityForm();
            break;
        case 'calendar':
            renderCalendarScreen();
            break;
        default:
            renderWelcomeScreen();
    }
}

// --- Render Functions ---
function renderWelcomeScreen() {
    appContainer.innerHTML = `
        <h1>Welcome to Activio</h1>
        <p>How's your day? What would you like to do?</p>
        <div class="button-group">
            <button class="button" id="view-calendar-btn">View Calendar</button>
            <button class="button secondary" id="add-activity-btn">Add Activity</button>
        </div>
    `;

    document.getElementById('view-calendar-btn').addEventListener('click', () => router('calendar'));
    document.getElementById('add-activity-btn').addEventListener('click', () => router('add-activity'));
}

function renderProfilesScreen() {
    const profiles = getProfiles();
    appContainer.innerHTML = `
        <h2>Child Profiles</h2>
        <div class="profile-form">
            <input type="text" id="child-name-input" placeholder="Enter child's name">
            <button class="button" id="add-child-btn">Add Child</button>
        </div>
        <div class="profile-list">
            ${profiles.map(profile => `<div class="profile-item">${profile.name}</div>`).join('')}
        </div>
    `;

    document.getElementById('add-child-btn').addEventListener('click', () => {
        const input = document.getElementById('child-name-input');
        const newName = input.value.trim();
        if (newName) {
            const profiles = getProfiles();
            profiles.push({ name: newName });
            saveProfiles(profiles);
            showMessage(`Profile for ${newName} added successfully!`);
            router('profiles'); // Re-render to show new profile
        } else {
            showMessage('Child name cannot be empty.', 'error');
        }
    });
}

function renderAddActivityForm() {
    const profiles = getProfiles();
    appContainer.innerHTML = `
        <h2>Add New Activity</h2>
        <form class="activity-form">
            <select id="child-select" required>
                <option value="">Select Child</option>
                ${profiles.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
            </select>
            <input type="text" id="activity-name" placeholder="Activity Name" required>
            <input type="date" id="activity-date" required>
            <input type="time" id="activity-time" required>
            <input type="text" id="activity-duration" placeholder="Duration (e.g., 1 hour)">
            <input type="text" id="activity-location" placeholder="Location">
            <button type="submit" class="button">Save Activity</button>
        </form>
    `;

    const form = document.querySelector('.activity-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newActivity = {
            child: document.getElementById('child-select').value,
            activity: document.getElementById('activity-name').value,
            date: document.getElementById('activity-date').value,
            time: document.getElementById('activity-time').value,
            duration: document.getElementById('activity-duration').value,
            location: document.getElementById('activity-location').value,
        };

        if (!newActivity.child || !newActivity.activity || !newActivity.date || !newActivity.time) {
            showMessage('Please fill in all required fields (Child, Activity Name, Date, Time).', 'error');
            return;
        }

        const activities = getActivities();
        activities.push(newActivity);
        saveActivities(activities);
        showMessage(`Activity "${newActivity.activity}" for ${newActivity.child} added successfully!`);
        router('calendar'); // Go to calendar after saving
    });
}

function renderCalendarScreen() {
    const activities = getActivities();
    const events = activities.map(a => ({
        title: `${a.activity} (${a.child})`,
        start: `${a.date}T${a.time}`,
        description: `Duration: ${a.duration}, Location: ${a.location}`,
    }));

    appContainer.innerHTML = `
        <div class="calendar-container">
             <div id="calendar"></div>
             <div id="summary-view-controls">
                <button class="button active" id="summary-day-btn">Day</button>
                <button class="button" id="summary-week-btn">Week</button>
                <button class="button" id="summary-month-btn">Month</button>
             </div>
             <div id="summary-container"></div>
        </div>
    `;

    const calendar = new VanillaCalendar('#calendar', {
        actions: {
            clickDay(e, dates) {
                const clickedDate = dates[0];
                renderSummary(clickedDate, 'day');
                highlightActiveSummaryView('day');
            },
        },
        settings: {
            specialDays: activities.map(a => ({
                date: a.date,
                className: ['has-activity'],
            })),
        },
        popups: events.reduce((acc, event) => {
            const date = event.start.split('T')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push({
                modifier: 'bg-blue-400',
                html: `
                    <div class="event-popup">
                        <h4>${event.title}</h4>
                        <p>${event.description}</p>
                    </div>
                `,
            });
            return acc;
        }),
    });
    calendar.init();

    document.getElementById('summary-day-btn').addEventListener('click', () => {
        renderSummary(new Date().toISOString().slice(0, 10), 'day');
        highlightActiveSummaryView('day');
    });
    document.getElementById('summary-week-btn').addEventListener('click', () => {
        renderSummary(new Date().toISOString().slice(0, 10), 'week');
        highlightActiveSummaryView('week');
    });
    document.getElementById('summary-month-btn').addEventListener('click', () => {
        renderSummary(new Date().toISOString().slice(0, 10), 'month');
        highlightActiveSummaryView('month');
    });

    renderSummary(new Date().toISOString().slice(0, 10), 'month');
}

function highlightActiveSummaryView(view) {
    document.querySelectorAll('#summary-view-controls .button').forEach(button => {
        button.classList.remove('active');
    });
    const targetButton = document.getElementById(`summary-${view}-btn`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
}

function renderSummary(selectedDate, view) {
    const activities = getActivities();
    const summaryContainer = document.getElementById('summary-container');
    let summaryHtml = '';
    let filteredActivities = [];

    const currentYear = new Date(selectedDate).getFullYear();
    const currentMonth = new Date(selectedDate).getMonth();
    const currentDate = new Date(selectedDate).getDate();

    if (view === 'day') {
        filteredActivities = activities.filter(a => a.date === selectedDate);
        summaryHtml = `<h3>Daily Summary for ${selectedDate}</h3>`;
    } else if (view === 'week') {
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(currentDate - startOfWeek.getDay()); // Sunday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

        filteredActivities = activities.filter(a => {
            const activityDate = new Date(a.date);
            // Normalize activityDate to start of day for comparison
            activityDate.setHours(0, 0, 0, 0);
            startOfWeek.setHours(0, 0, 0, 0);
            endOfWeek.setHours(0, 0, 0, 0);
            return activityDate >= startOfWeek && activityDate <= endOfWeek;
        });
        summaryHtml = `<h3>Weekly Summary (${startOfWeek.toDateString()} - ${endOfWeek.toDateString()})</h3>`;
    } else if (view === 'month') {
        filteredActivities = activities.filter(a => {
            const activityDate = new Date(a.date);
            return activityDate.getFullYear() === currentYear && activityDate.getMonth() === currentMonth;
        });
        summaryHtml = `<h3>Monthly Summary for ${new Date(selectedDate).toLocaleString('default', { month: 'long' })} ${currentYear}</h3>`;
    }

    if(filteredActivities.length === 0){
        summaryHtml += '<p>No activities planned.</p>';
    } else {
        summaryHtml += '<ul>';
        filteredActivities.forEach(a => { // FIX: Use filteredActivities here
            summaryHtml += `<li><b>${a.activity}</b> for ${a.child} on ${a.date} at ${a.time}</li>`;
        });
        summaryHtml += '</ul>';
    }
    summaryContainer.innerHTML = summaryHtml;
}

// --- Event Listeners for Navigation ---
profilesBtn.addEventListener('click', () => router('profiles'));
homeBtn.addEventListener('click', () => router('welcome')); // Home button is the h1 'Activio'

// --- Initial Render ---
router('welcome');