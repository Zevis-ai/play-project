// בדיקת התחברות
window.onload = function() {
    const userData = checkLoginStatus();
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }
    loadHighScore();
};

// משתנים גלובליים
let playerScore = 0;
let computerScore = 0;
let currentHighScore = 0;
const choices = ['אבן', 'נייר', 'מספריים'];
const hebrewChoices = {
    'אבן': 'אבן',
    'נייר': 'נייר',
    'מספריים': 'מספריים'
};

// טעינת שיא
function loadHighScore() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        const gameStats = JSON.parse(localStorage.getItem(`rps_stats_${userData.username}`) || '{"highScore": 0}');
        currentHighScore = gameStats.highScore;
        document.getElementById('highScore').textContent = currentHighScore;
    }
}

// שמירת שיא חדש
function saveHighScore() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && playerScore > currentHighScore) {
        currentHighScore = playerScore;
        const gameStats = { highScore: currentHighScore };
        localStorage.setItem(`rps_stats_${userData.username}`, JSON.stringify(gameStats));
        document.getElementById('highScore').textContent = currentHighScore;
        
        // הצגת הודעת שיא חדש
        showMessage('שיא חדש! כל הכבוד! 🏆');
    }
}

// הצגת הודעה
function showMessage(message) {
    const result = document.getElementById('result');
    result.textContent = message;
}

// בחירת המחשב
function getComputerChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}

// קביעת המנצח
function getWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return 'tie';
    
    if (
        (playerChoice === 'אבן' && computerChoice === 'מספריים') ||
        (playerChoice === 'נייר' && computerChoice === 'אבן') ||
        (playerChoice === 'מספריים' && computerChoice === 'נייר')
    ) {
        return 'player';
    }
    
    return 'computer';
}

// עדכון התוצאה
function updateScore(winner) {
    if (winner === 'player') {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        saveHighScore();
    } else if (winner === 'computer') {
        computerScore++;
        document.getElementById('computerScore').textContent = computerScore;
    }
}

// הצגת התוצאה
function displayResult(winner, playerChoice, computerChoice) {
    const messages = {
        'player': `ניצחת! הבחירה שלך: ${hebrewChoices[playerChoice]} | בחירת המחשב: ${hebrewChoices[computerChoice]} 🎉`,
        'computer': `הפסדת! הבחירה שלך: ${hebrewChoices[playerChoice]} | בחירת המחשב: ${hebrewChoices[computerChoice]} 😢`,
        'tie': `תיקו! שניכם בחרתם ${hebrewChoices[playerChoice]} 🤝`
    };
    
    showMessage(messages[winner]);
}

// עדכון הבחירות
function updateHands(playerChoice, computerChoice) {
    document.querySelector('.player-hand img').src = `../images/${playerChoice}.jpeg`;
    document.querySelector('.computer-hand img').src = `../images/${computerChoice}.jpeg`;
}

// טיפול בבחירת השחקן
function handleChoice(event) {
    const playerChoice = event.currentTarget.dataset.choice;
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    
    updateHands(playerChoice, computerChoice);
    const winner = getWinner(playerChoice, computerChoice);
    updateScore(winner);
    displayResult(winner, playerChoice, computerChoice);
}

// איפוס המשחק
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('playerScore').textContent = '0';
    document.getElementById('computerScore').textContent = '0';
    document.querySelector('.player-hand img').src = '../images/אבן.jpeg';
    document.querySelector('.computer-hand img').src = '../images/אבן.jpeg';
    showMessage('בחר את המהלך שלך!');
}

// הוספת מאזיני אירועים
document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', handleChoice);
});

document.getElementById('resetGame').addEventListener('click', resetGame);
