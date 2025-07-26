// Game state with local storage persistence
let scores = loadScores();
let gameHistory = loadHistory();
let isHistoryVisible = false;

// Choice mappings
const choices = {
    rock: { emoji: '⚡', name: 'Rock' },
    paper: { emoji: '📋', name: 'Paper' },
    scissors: { emoji: '⚔️', name: 'Scissors' }
};

// Local storage functions
function saveScores() {
    const gameData = {
        scores: scores,
        history: gameHistory
    };
    try {
        localStorage.setItem('rockPaperScissorsGame', JSON.stringify(gameData));
    } catch (error) {
        console.log('Storage not available');
    }
}

function loadScores() {
    try {
        const saved = localStorage.getItem('rockPaperScissorsGame');
        if (saved) {
            const gameData = JSON.parse(saved);
            return gameData.scores || { player: 0, computer: 0, ties: 0 };
        }
    } catch (error) {
        console.log('No saved data found');
    }
    return { player: 0, computer: 0, ties: 0 };
}

function loadHistory() {
    try {
        const saved = localStorage.getItem('rockPaperScissorsGame');
        if (saved) {
            const gameData = JSON.parse(saved);
            return gameData.history || [];
        }
    } catch (error) {
        console.log('No saved history found');
    }
    return [];
}

// Game logic
function getComputerChoice() {
    const choiceArray = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choiceArray[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    }

    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };

    return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
}

function updateScores(result) {
    if (result === 'win') {
        scores.player++;
    } else if (result === 'lose') {
        scores.computer++;
    } else {
        scores.ties++;
    }

    // Update display
    document.getElementById('playerScore').textContent = scores.player;
    document.getElementById('computerScore').textContent = scores.computer;
    document.getElementById('tieScore').textContent = scores.ties;
    
    // Save to storage
    saveScores();
}

function displayResult(playerChoice, computerChoice, result) {
    // Show choices
    const choicesDisplay = document.getElementById('choicesDisplay');
    const playerChoiceEl = document.getElementById('playerChoice');
    const computerChoiceEl = document.getElementById('computerChoice');
    const resultMessage = document.getElementById('resultMessage');

    choicesDisplay.style.display = 'flex';
    playerChoiceEl.textContent = choices[playerChoice].emoji;
    computerChoiceEl.textContent = choices[computerChoice].emoji;

    // Show result message
    let message = '';
    let className = '';

    switch (result) {
        case 'win':
            message = `🎉 You Win! ${choices[playerChoice].name} beats ${choices[computerChoice].name}!`;
            className = 'result-win';
            break;
        case 'lose':
            message = `😔 You Lose! ${choices[computerChoice].name} beats ${choices[playerChoice].name}!`;
            className = 'result-lose';
            break;
        case 'tie':
            message = `🤝 It's a Tie! Both chose ${choices[playerChoice].name}!`;
            className = 'result-tie';
            break;
    }

    resultMessage.textContent = message;
    resultMessage.className = `result-message ${className}`;
}

function addToHistory(playerChoice, computerChoice, result) {
    const historyItem = {
        player: choices[playerChoice].name,
        computer: choices[computerChoice].name,
        result: result,
        timestamp: new Date().toLocaleTimeString()
    };

    gameHistory.unshift(historyItem);
    
    // Keep only last 10 games
    if (gameHistory.length > 10) {
        gameHistory.pop();
    }

    updateHistoryDisplay();
    saveScores(); // Save after updating history
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    if (gameHistory.length === 0) {
        historyList.innerHTML = '<div class="history-item">No games played yet</div>';
        return;
    }

    gameHistory.forEach(game => {
        const resultText = game.result === 'win' ? 'Won' : 
                         game.result === 'lose' ? 'Lost' : 'Tied';
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <strong>${game.timestamp}</strong> - 
            You: ${game.player} vs Computer: ${game.computer} - 
            <strong>${resultText}</strong>
        `;
        historyList.appendChild(historyItem);
    });
}

// Main game function
function playGame(playerChoice) {
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);

    updateScores(result);
    displayResult(playerChoice, computerChoice, result);
    addToHistory(playerChoice, computerChoice, result);
}

// Control functions
function resetScores() {
    scores = { player: 0, computer: 0, ties: 0 };
    gameHistory = [];
    
    document.getElementById('playerScore').textContent = '0';
    document.getElementById('computerScore').textContent = '0';
    document.getElementById('tieScore').textContent = '0';
    document.getElementById('choicesDisplay').style.display = 'none';
    document.getElementById('resultMessage').textContent = 'Scores reset! Make your choice to start playing!';
    document.getElementById('resultMessage').className = 'result-message';
    
    updateHistoryDisplay();
    saveScores(); // Save the reset state
}

function toggleHistory() {
    const historyEl = document.getElementById('gameHistory');
    isHistoryVisible = !isHistoryVisible;
    historyEl.style.display = isHistoryVisible ? 'block' : 'none';
}

// Initialize the game
function initializeGame() {
    // Display loaded scores
    document.getElementById('playerScore').textContent = scores.player;
    document.getElementById('computerScore').textContent = scores.computer;
    document.getElementById('tieScore').textContent = scores.ties;
    
    updateHistoryDisplay();
    
    // Show welcome message if no games played yet
    if (scores.player === 0 && scores.computer === 0 && scores.ties === 0) {
        document.getElementById('resultMessage').textContent = 'Welcome! Make your choice to start playing!';
    } else {
        document.getElementById('resultMessage').textContent = 'Welcome back! Your progress has been restored.';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeGame);