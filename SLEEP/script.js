// Constants for sleep calculations
const SLEEP_CYCLE_MINUTES = 90;
const FALLING_ASLEEP_BUFFER = 15;
const CYCLES_TO_SHOW = 6;

// Helper function to format time
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Helper function to add minutes to a date
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

// Helper function to subtract minutes from a date
function subtractMinutes(date, minutes) {
    return new Date(date.getTime() - minutes * 60000);
}

// Convert time input string to Date object
function timeStringToDate(timeString) {
    const today = new Date();
    const [hours, minutes] = timeString.split(':');
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
}

// Create time slot element
function createTimeSlot(time, cycleNumber) {
    const slot = document.createElement('div');
    slot.className = 'time-slot';
    slot.style.animationDelay = `${cycleNumber * 0.1}s`;
    slot.innerHTML = `
        <strong>${formatTime(time)}</strong>
        <br>
        <small>${cycleNumber} cycles</small>
    `;
    return slot;
}

// Add stars dynamically
const starsContainer = document.querySelector('.stars');
for (let i = 0; i < 50; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    starsContainer.appendChild(star);
}

// Sleep cycle calculation functions
function calculateSleepCycles(baseTime, isForward = true) {
    const cycleLength = 90; // minutes
    const cycles = [5, 6, 7]; // recommended sleep cycles
    let times = [];
    
    cycles.forEach(cycle => {
        const totalMinutes = cycle * cycleLength;
        const date = new Date(baseTime);
        
        if (isForward) {
            date.setMinutes(date.getMinutes() + totalMinutes + 15); // 15 min to fall asleep
        } else {
            date.setMinutes(date.getMinutes() - totalMinutes - 15); // 15 min to fall asleep
        }
        
        times.push(date);
    });
    
    // Sort times in chronological order
    if (!isForward) {
        times.sort((a, b) => b - a); // Latest to earliest for bedtime
    } else {
        times.sort((a, b) => a - b); // Earliest to latest for wake time
    }
    
    return times;
}

// View management
function showResults(type) {
    const calculatorView = document.getElementById('calculator-view');
    const resultsView = document.getElementById('results-view');
    const resultsText = document.getElementById('results-text');
    
    let times = [];
    const now = new Date();
    
    switch(type) {
        case 'wake':
            const wakeTime = document.getElementById('wake-time').value;
            const [wakeHours, wakeMinutes] = wakeTime.split(':').map(Number);
            const wakeDate = new Date(now);
            wakeDate.setHours(wakeHours, wakeMinutes, 0, 0);
            times = calculateSleepCycles(wakeDate, false);
            resultsText.innerHTML = `
                <div class="result-header">
                    🎯 Your Target Wake Time: ${formatTime(wakeTime)} ⏰<br>
                    To feel refreshed, try going to bed at:
                </div>
                <div class="time-recommendations">
                    ${times.map((time, index) => `
                        <div class="time-option">
                            🌙 ${formatTime(time.toTimeString().slice(0, 5))}
                            <span class="cycle-info">
                                💤 ${7 - index} sleep cycles (${Math.round(((7 - index) * 90) / 60)}h ${((7 - index) * 90) % 60}m)
                            </span>
                        </div>
                    `).join('')}
                </div>`;
            break;
            
        case 'bed':
            const bedTime = document.getElementById('bed-time').value;
            const [bedHours, bedMinutes] = bedTime.split(':').map(Number);
            const bedDate = new Date(now);
            bedDate.setHours(bedHours, bedMinutes, 0, 0);
            times = calculateSleepCycles(bedDate, true);
            resultsText.innerHTML = `
                <div class="result-header">
                    🛏️ Your Bedtime: ${formatTime(bedTime)} 🌙<br>
                    For optimal rest, try waking up at:
                </div>
                <div class="time-recommendations">
                    ${times.map((time, index) => `
                        <div class="time-option">
                            ⏰ ${formatTime(time.toTimeString().slice(0, 5))}
                            <span class="cycle-info">
                                💤 ${index + 5} sleep cycles (${Math.round(((index + 5) * 90) / 60)}h ${((index + 5) * 90) % 60}m)
                            </span>
                        </div>
                    `).join('')}
                </div>`;
            break;
            
        case 'now':
            times = calculateSleepCycles(now, true);
            resultsText.innerHTML = `
                <div class="result-header">
                    🌟 Going to sleep now: ${formatTime(now.toTimeString().slice(0, 5))} 🌙<br>
                    For the best rest, wake up at:
                </div>
                <div class="time-recommendations">
                    ${times.map((time, index) => `
                        <div class="time-option">
                            ⏰ ${formatTime(time.toTimeString().slice(0, 5))}
                            <span class="cycle-info">
                                💤 ${index + 5} sleep cycles (${Math.round(((index + 5) * 90) / 60)}h ${((index + 5) * 90) % 60}m)
                            </span>
                        </div>
                    `).join('')}
                </div>`;
            break;
    }

    // Update the explanation text
    document.querySelector('.results-explanation').innerHTML = `
        🎯 These times are calculated based on 90-minute sleep cycles<br>
        😴 It takes about 15 minutes to fall asleep<br>
        ⭐ Waking up between cycles helps you feel more refreshed!<br>
        🌿 For better sleep quality, maintain a consistent schedule
    `;

    // Add fade out animation to calculator view
    calculatorView.style.opacity = '0';
    calculatorView.style.transform = 'scale(0.95)';
    
    // After fade out, hide calculator and show results
    setTimeout(() => {
        calculatorView.style.display = 'none';
        resultsView.style.display = 'block';
        
        // Trigger reflow
        resultsView.offsetHeight;
        
        // Add fade in animation to results view
        resultsView.style.opacity = '1';
        resultsView.style.transform = 'scale(1)';
    }, 300);
}

function showCalculator() {
    const calculatorView = document.getElementById('calculator-view');
    const resultsView = document.getElementById('results-view');
    
    // Add fade out animation to results view
    resultsView.style.opacity = '0';
    resultsView.style.transform = 'scale(0.95)';
    
    // After fade out, hide results and show calculator
    setTimeout(() => {
        resultsView.style.display = 'none';
        calculatorView.style.display = 'block';
        
        // Trigger reflow
        calculatorView.offsetHeight;
        
        // Add fade in animation to calculator view
        calculatorView.style.opacity = '1';
        calculatorView.style.transform = 'scale(1)';
    }, 300);
}

// Format time from 24h to 12h with AM/PM
function formatTime(time24h) {
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set default times
    const now = new Date();
    document.getElementById('wake-time').value = '07:00';
    document.getElementById('bed-time').value = '22:00';
});

// Setup cycling for info sections
document.addEventListener('DOMContentLoaded', function() {
    function setupCycling(buttonId, containerId) {
        const cycleButton = document.getElementById(buttonId);
        const container = document.getElementById(containerId);
        const cardSets = container.querySelectorAll('.info-card-set');
        let currentSet = 1;
        const totalSets = cardSets.length;

        cycleButton.addEventListener('click', function() {
            // Hide current set
            container.querySelector(`.info-card-set[data-set="${currentSet}"]`).classList.remove('active-set');
            
            // Move to next set
            currentSet = currentSet % totalSets + 1;
            
            // Show new set
            container.querySelector(`.info-card-set[data-set="${currentSet}"]`).classList.add('active-set');
            
            // Update button text
            cycleButton.textContent = `Show Next Info Set 🔄 (${currentSet}/${totalSets})`;
        });

        // Initialize button text
        cycleButton.textContent = `Show Next Info Set 🔄 (1/${totalSets})`;
    }

    // Setup cycling for all sections
    setupCycling('cycle-info-1', 'info-grid-container-1');
    setupCycling('cycle-info-2', 'info-grid-container-2');
    setupCycling('cycle-info-3', 'info-grid-container-3');
    setupCycling('cycle-info-4', 'info-grid-container-4');
    setupCycling('cycle-info-5', 'info-grid-container-5');
});

// Add input event listeners for real-time updates
document.getElementById('wake-time').addEventListener('input', calculateSleepCycles);
document.getElementById('bed-time').addEventListener('input', calculateSleepCycles);

// Common Sleep Myths Debunked Section Functionality
const cycleButton5 = document.getElementById('cycle-info-5');
const infoContainer5 = document.getElementById('info-grid-container-5');

if (cycleButton5 && infoContainer5) {
    let currentSet5 = 1;
    const totalSets5 = 5;

    cycleButton5.addEventListener('click', () => {
        // Hide current set
        const currentCards = infoContainer5.querySelector(`[data-set="${currentSet5}"]`);
        currentCards.classList.remove('active-set');
        
        // Move to next set
        currentSet5 = (currentSet5 % totalSets5) + 1;
        
        // Show new set
        const newCards = infoContainer5.querySelector(`[data-set="${currentSet5}"]`);
        newCards.classList.add('active-set');
        
        // Update button text
        cycleButton5.textContent = `Show Next Info Set 🔄 (${currentSet5}/${totalSets5})`;
    });
}

// Time picker functionality
function initializeTimePicker() {
    const timeDisplays = document.querySelectorAll('.time-display');
    const timePickers = document.querySelectorAll('.time-picker');
    
    // Initialize hours
    const hoursPickers = document.querySelectorAll('.hours-picker .picker-values');
    hoursPickers.forEach(picker => {
        for (let i = 1; i <= 12; i++) {
            const value = document.createElement('div');
            value.className = 'picker-value';
            value.textContent = i.toString().padStart(2, '0');
            value.onclick = () => {
                updateTime(picker.closest('.time-selector'), 'hours', value.textContent);
                // Close picker after selection
                picker.closest('.time-picker').classList.remove('active');
            };
            picker.appendChild(value);
        }
    });
    
    // Initialize minutes
    const minutesPickers = document.querySelectorAll('.minutes-picker .picker-values');
    minutesPickers.forEach(picker => {
        for (let i = 0; i < 60; i += 5) { // Changed back to 5-minute intervals
            const value = document.createElement('div');
            value.className = 'picker-value';
            value.textContent = i.toString().padStart(2, '0');
            value.onclick = () => {
                updateTime(picker.closest('.time-selector'), 'minutes', value.textContent);
                // Close picker after selection
                picker.closest('.time-picker').classList.remove('active');
            };
            picker.appendChild(value);
        }
    });
    
    // Handle time display clicks
    timeDisplays.forEach((display, index) => {
        display.onclick = () => {
            // Close all other pickers first
            timePickers.forEach(p => p.classList.remove('active'));
            // Open the clicked one
            timePickers[index].classList.add('active');
        };
    });
    
    // Handle period buttons
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.onclick = () => {
            const selector = btn.closest('.time-selector');
            const btns = selector.querySelectorAll('.period-btn');
            btns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            updateTime(selector, 'period', btn.textContent);
            // Close picker after selection
            btn.closest('.time-picker').classList.remove('active');
        };
    });
    
    // Handle arrows
    const arrows = document.querySelectorAll('.picker-arrow');
    arrows.forEach(arrow => {
        arrow.onclick = () => {
            const values = arrow.closest('.picker-section').querySelector('.picker-values');
            const scrollAmount = arrow.classList.contains('up') ? -40 : 40;
            values.scrollBy(0, scrollAmount);
        };
    });
    
    // Close pickers when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.time-selector')) {
            timePickers.forEach(picker => picker.classList.remove('active'));
        }
    });

    // Set initial selected states for period buttons
    document.querySelectorAll('.time-selector').forEach(selector => {
        const period = selector.querySelector('.period').textContent;
        const periodBtn = Array.from(selector.querySelectorAll('.period-btn'))
            .find(btn => btn.textContent === period);
        if (periodBtn) {
            periodBtn.classList.add('selected');
        }
    });
}

function updateTime(selector, type, value) {
    const display = selector.querySelector('.time-display');
    const hours = display.querySelector('.hours');
    const minutes = display.querySelector('.minutes');
    const period = display.querySelector('.period');
    
    switch (type) {
        case 'hours':
            hours.textContent = value;
            break;
        case 'minutes':
            minutes.textContent = value;
            break;
        case 'period':
            period.textContent = value;
            break;
    }
    
    // Update hidden input for form submission
    const timeString = `${hours.textContent}:${minutes.textContent} ${period.textContent}`;
    const time24h = convertTo24Hour(timeString);
    
    if (selector.closest('.calculator-container').querySelector('h1').textContent.includes('wake')) {
        document.getElementById('wake-time').value = time24h;
    } else {
        document.getElementById('bed-time').value = time24h;
    }
}

function convertTo24Hour(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
        hours = '00';
    }
    
    if (modifier === 'PM' && hours !== '00') {
        hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

// Initialize time picker on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTimePicker();
}); 