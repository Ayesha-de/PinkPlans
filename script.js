// Enhanced JavaScript with all requested features

// Motivational Quotes
const motivationalQuotes = [
    "The secret of getting ahead is getting started.",
    "Don't watch the clock; do what it does. Keep going.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "It always seems impossible until it's done.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "The future depends on what you do today.",
    "You are never too old to set another goal or to dream a new dream.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Dream bigger. Do bigger."
];

// Puzzle words
const puzzleWords = ["DREAM", "SUCCESS", "MOTIVATE", "PLAN", "GOAL", "FOCUS", "HAPPY", "CREATE"];

// Emoji descriptions
const emojiDescriptions = {
    "😡": "You had a tough day today",
    "😔": "You felt a bit down today",
    "😐": "It was an okay day, nothing special",
    "😊": "You had a good day today",
    "🤩": "You had an amazing day today!"
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set up date and time
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Set up motivational quote
    updateMotivationalQuote();
    
    // Set up task list
    setupTaskList();
    
    // Set up discipline rating
    updateDisciplineRating();
    
    // Set up event listeners
    setupEventListeners();
    
    // Add sparkle effect
    setupSparkleEffect();
    
    // Check for saved user email
    const savedEmail = localStorage.getItem('pinkPlansUserEmail');
    if (savedEmail) {
        document.getElementById('userAccount').textContent = savedEmail;
    }
    
    // Start background music
    const music = document.getElementById('backgroundMusic');
    music.volume = 0.3;
    music.play().catch(e => console.log("Auto-play prevented:", e));
});

// Update date and time display
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };
    document.getElementById('dateTime').textContent = now.toLocaleDateString(undefined, options);
}

// Update motivational quote
function updateMotivationalQuote() {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const quoteElement = document.getElementById('quoteText');
    quoteElement.textContent = motivationalQuotes[randomIndex];
    
    // Create moving effect
    quoteElement.classList.add('moving-quote');
}

// Enhanced Task List Functionality
function setupTaskList() {
    const tasks = JSON.parse(localStorage.getItem('pinkPlansTasks')) || [];
    renderTaskList(tasks);
}

function renderTaskList(tasks) {
    const taskListElement = document.getElementById('taskList');
    taskListElement.innerHTML = '';
    
    if (tasks.length === 0) {
        taskListElement.innerHTML = '<div class="no-tasks">No tasks added yet</div>';
        return;
    }
    
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        
        taskElement.innerHTML = `
            <span class="task-complete-btn" data-index="${index}">${task.completed ? '✓' : '○'}</span>
            <div class="task-text" style="${task.completed ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${task.text}</div>
            <span class="task-delete-btn" data-index="${index}">✕</span>
        `;
        
        taskListElement.appendChild(taskElement);
    });
    
    // Add event listeners
    document.querySelectorAll('.task-complete-btn').forEach(btn => {
        btn.addEventListener('click', toggleTaskCompletion);
    });
    
    document.querySelectorAll('.task-delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTask);
    });
    
    updateDisciplineRating();
}

function toggleTaskCompletion(e) {
    const index = e.target.getAttribute('data-index');
    const tasks = JSON.parse(localStorage.getItem('pinkPlansTasks')) || [];
    
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('pinkPlansTasks', JSON.stringify(tasks));
    
    renderTaskList(tasks);
    
    if (tasks[index].completed) {
        createCelebrationEffect(e.target);
    }
}

function deleteTask(e) {
    const index = e.target.getAttribute('data-index');
    const tasks = JSON.parse(localStorage.getItem('pinkPlansTasks')) || [];
    
    tasks.splice(index, 1);
    localStorage.setItem('pinkPlansTasks', JSON.stringify(tasks));
    
    renderTaskList(tasks);
}

function addNewTask(taskText) {
    if (!taskText.trim()) return;
    
    const tasks = JSON.parse(localStorage.getItem('pinkPlansTasks')) || [];
    tasks.push({
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('pinkPlansTasks', JSON.stringify(tasks));
    renderTaskList(tasks);
    document.getElementById('taskInput').value = '';
}

// Enhanced Diary Functionality
function setupDiary() {
    const today = new Date().toLocaleDateString();
    document.getElementById('diaryDate').textContent = today;
    
    // Load today's entry if exists
    const diaryEntries = JSON.parse(localStorage.getItem('pinkPlansDiaryEntries')) || {};
    document.getElementById('diaryEntry').value = diaryEntries[today] || '';
    
    // Load diary history
    loadDiaryHistory();
}

function loadDiaryHistory() {
    const diaryEntries = JSON.parse(localStorage.getItem('pinkPlansDiaryEntries')) || {};
    const historyContainer = document.getElementById('diaryEntries');
    historyContainer.innerHTML = '';
    
    const sortedDates = Object.keys(diaryEntries).sort((a, b) => new Date(b) - new Date(a));
    
    sortedDates.slice(0, 5).forEach(date => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'diary-entry';
        entryDiv.innerHTML = `
            <div class="diary-entry-date">${date}</div>
            <div class="diary-entry-content">${diaryEntries[date].substring(0, 100)}${diaryEntries[date].length > 100 ? '...' : ''}</div>
        `;
        historyContainer.appendChild(entryDiv);
    });
}

function saveDiaryEntry() {
    const content = document.getElementById('diaryEntry').value;
    const today = new Date().toLocaleDateString();
    
    const diaryEntries = JSON.parse(localStorage.getItem('pinkPlansDiaryEntries')) || {};
    diaryEntries[today] = content;
    localStorage.setItem('pinkPlansDiaryEntries', JSON.stringify(diaryEntries));
    
    loadDiaryHistory();
    createCelebrationEffect(document.getElementById('saveDiary'));
}

// Enhanced Puzzle Game
let puzzleTimer;
let puzzleSeconds = 0;
let puzzleMoves = 0;

function setupPuzzleGame() {
    clearInterval(puzzleTimer);
    puzzleSeconds = 0;
    puzzleMoves = 0;
    updatePuzzleStats();
    
    const puzzleContainer = document.getElementById('puzzleContainer');
    const puzzleMessage = document.getElementById('puzzleMessage');
    
    const word = puzzleWords[Math.floor(Math.random() * puzzleWords.length)];
    const shuffledWord = shuffleWord(word);
    
    puzzleContainer.innerHTML = '';
    puzzleMessage.textContent = 'Arrange the letters to form a motivational word!';
    
    shuffledWord.split('').forEach((letter, index) => {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile';
        tile.textContent = letter;
        tile.dataset.index = index;
        tile.addEventListener('click', () => selectPuzzleTile(tile));
        puzzleContainer.appendChild(tile);
    });
    
    puzzleContainer.dataset.correctWord = word;
    puzzleContainer.dataset.selectedTile = null;
    
    // Start timer
    puzzleTimer = setInterval(() => {
        puzzleSeconds++;
        updatePuzzleStats();
    }, 1000);
}

function updatePuzzleStats() {
    const minutes = Math.floor(puzzleSeconds / 60).toString().padStart(2, '0');
    const seconds = (puzzleSeconds % 60).toString().padStart(2, '0');
    document.getElementById('puzzleTime').textContent = `${minutes}:${seconds}`;
    document.getElementById('puzzleMoves').textContent = puzzleMoves;
}

function selectPuzzleTile(tile) {
    const puzzleContainer = document.getElementById('puzzleContainer');
    const selectedIndex = puzzleContainer.dataset.selectedTile;
    
    if (selectedIndex === null) {
        puzzleContainer.dataset.selectedTile = tile.dataset.index;
        tile.style.backgroundColor = 'var(--rosy-pink)';
        tile.style.color = 'white';
    } else if (selectedIndex === tile.dataset.index) {
        puzzleContainer.dataset.selectedTile = null;
        tile.style.backgroundColor = 'var(--light-pink)';
        tile.style.color = 'inherit';
    } else {
        puzzleMoves++;
        updatePuzzleStats();
        
        const tiles = Array.from(puzzleContainer.children);
        const firstTile = tiles[selectedIndex];
        const secondTile = tile;
        
        const temp = firstTile.textContent;
        firstTile.textContent = secondTile.textContent;
        secondTile.textContent = temp;
        
        firstTile.style.backgroundColor = 'var(--light-pink)';
        firstTile.style.color = 'inherit';
        secondTile.style.backgroundColor = 'var(--light-pink)';
        secondTile.style.color = 'inherit';
        
        const currentWord = tiles.map(t => t.textContent).join('');
        if (currentWord === puzzleContainer.dataset.correctWord) {
            clearInterval(puzzleTimer);
            document.getElementById('puzzleMessage').textContent = `Solved in ${puzzleMoves} moves and ${puzzleSeconds} seconds!`;
            createCelebrationEffect(puzzleContainer);
            
            // Save puzzle stats
            const puzzleStats = JSON.parse(localStorage.getItem('pinkPlansPuzzleStats')) || [];
            puzzleStats.push({
                word: puzzleContainer.dataset.correctWord,
                moves: puzzleMoves,
                time: puzzleSeconds,
                date: new Date().toLocaleDateString()
            });
            localStorage.setItem('pinkPlansPuzzleStats', JSON.stringify(puzzleStats));
        }
        
        puzzleContainer.dataset.selectedTile = null;
    }
}

function shuffleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

// Enhanced Emoji Rating
function setupEmojiRating() {
    const today = new Date().toLocaleDateString();
    document.getElementById('emojiDate').textContent = today;
    
    // Load today's emoji if exists
    const emojiRatings = JSON.parse(localStorage.getItem('pinkPlansEmojiRatings')) || {};
    if (emojiRatings[today]) {
        document.getElementById('selectedEmoji').textContent = emojiRatings[today].emoji;
        document.getElementById('emojiDescription').textContent = emojiDescriptions[emojiRatings[today].emoji];
    }
    
    // Set up emoji options
    document.querySelectorAll('.emoji-option').forEach(option => {
        option.addEventListener('click', function() {
            const emoji = this.dataset.emoji;
            const value = this.dataset.value;
            
            document.getElementById('selectedEmoji').textContent = emoji;
            document.getElementById('emojiDescription').textContent = emojiDescriptions[emoji];
            
            // Save rating
            emojiRatings[today] = { emoji, value, date: today };
            localStorage.setItem('pinkPlansEmojiRatings', JSON.stringify(emojiRatings));
            
            // Update history chart
            updateEmojiHistoryChart();
        });
    });
    
    // Load history chart
    updateEmojiHistoryChart();
}

function updateEmojiHistoryChart() {
    const emojiRatings = JSON.parse(localStorage.getItem('pinkPlansEmojiRatings')) || {};
    const chartContainer = document.getElementById('emojiHistoryChart');
    chartContainer.innerHTML = '';
    
    // Get last 7 days
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString());
    }
    
    // Find max value for scaling
    const values = dates.map(date => emojiRatings[date]?.value || 0);
    const maxValue = Math.max(...values, 5);
    
    // Create bars
    dates.forEach(date => {
        const rating = emojiRatings[date];
        const barValue = rating ? rating.value : 0;
        const barHeight = (barValue / maxValue) * 100;
        
        const barContainer = document.createElement('div');
        barContainer.style.flex = '1';
        barContainer.style.display = 'flex';
        barContainer.style.flexDirection = 'column';
        barContainer.style.alignItems = 'center';
        
        const bar = document.createElement('div');
        bar.className = 'emoji-bar';
        bar.style.height = `${barHeight}%`;
        bar.style.width = '80%';
        bar.style.backgroundColor = rating ? getEmojiColor(rating.emoji) : 'var(--light-pink)';
        
        const label = document.createElement('div');
        label.className = 'emoji-bar-label';
        label.textContent = new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        
        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        chartContainer.appendChild(barContainer);
    });
}

function getEmojiColor(emoji) {
    const colors = {
        "😡": "var(--watermelon)",
        "😔": "var(--blush)",
        "😐": "var(--light-pink)",
        "😊": "var(--rosy-pink)",
        "🤩": "var(--fuscia)"
    };
    return colors[emoji] || "var(--light-pink)";
}

// Update discipline rating based on completed tasks
function updateDisciplineRating() {
    const tasks = JSON.parse(localStorage.getItem('pinkPlansTasks')) || [];
    if (tasks.length === 0) {
        document.getElementById('ratingFill').style.width = '0%';
        document.getElementById('ratingPercent').textContent = '0%';
        return;
    }
    
    const completedCount = tasks.filter(task => task.completed).length;
    const percentage = Math.round((completedCount / tasks.length) * 100);
    
    document.getElementById('ratingFill').style.width = `${percentage}%`;
    document.getElementById('ratingPercent').textContent = `${percentage}%`;
}

// Set up event listeners
function setupEventListeners() {
    // Add task button
    document.getElementById('addTaskBtn').addEventListener('click', function() {
        const taskInput = document.getElementById('taskInput');
        addNewTask(taskInput.value);
    });
    
    // Enter key in task input
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNewTask(this.value);
        }
    });
    
    // User account click
    document.getElementById('userAccount').addEventListener('click', function() {
        document.getElementById('loginModal').style.display = 'flex';
    });
    
    // Diary button
    document.getElementById('diaryBtn').addEventListener('click', function() {
        document.getElementById('diaryModal').style.display = 'flex';
        setupDiary();
    });
    
    // Puzzle button
    document.getElementById('puzzleBtn').addEventListener('click', function() {
        document.getElementById('puzzleModal').style.display = 'flex';
        setupPuzzleGame();
    });
    
    // New puzzle button
    document.getElementById('newPuzzleBtn').addEventListener('click', setupPuzzleGame);
    
    // Emoji button
    document.getElementById('emojiBtn').addEventListener('click', function() {
        document.getElementById('emojiModal').style.display = 'flex';
        setupEmojiRating();
    });
    
    // Feedback button
    document.getElementById('feedbackBtn').addEventListener('click', function() {
        alert('Feedback feature would be connected to a server in a full implementation.');
    });
    
    // Close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
            clearInterval(puzzleTimer);
        });
    });
    
    // Save diary
    document.getElementById('saveDiary').addEventListener('click', saveDiaryEntry);
    
    // Login submit
    document.getElementById('loginSubmit').addEventListener('click', function() {
        const email = document.getElementById('loginEmail').value;
        if (email) {
            localStorage.setItem('pinkPlansUserEmail', email);
            document.getElementById('userAccount').textContent = email;
            document.getElementById('loginModal').style.display = 'none';
            createCelebrationEffect(this);
        }
    });
    
    // Pro promo
    document.querySelector('.pro-promo').addEventListener('click', function() {
        alert('This would upgrade to premium in a full implementation.');
    });
}

// Sparkle effect
function setupSparkleEffect() {
    document.addEventListener('mousemove', function(e) {
        if (Math.random() > 0.7) {
            createSparkle(e.clientX, e.clientY);
        }
    });
}

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${x - 10}px`;
    sparkle.style.top = `${y - 10}px`;
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Celebration effect when task is completed
function createCelebrationEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            createSparkle(x, y);
        }, i * 100);
    }
}