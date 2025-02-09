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
let score = 0;
let currentHighScore = 0;
let currentSequence = [];
let currentResult = 0;
let isGameRunning = false;

// טעינת שיא
function loadHighScore() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        const gameStats = JSON.parse(localStorage.getItem(`math_sequence_stats_${userData.username}`) || '{"highScore": 0}');
        currentHighScore = gameStats.highScore;
        document.getElementById('highScore').textContent = currentHighScore;
    }
}

// שמירת שיא חדש
function saveHighScore() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && score > currentHighScore) {
        currentHighScore = score;
        const gameStats = { highScore: currentHighScore };
        localStorage.setItem(`math_sequence_stats_${userData.username}`, JSON.stringify(gameStats));
        document.getElementById('highScore').textContent = currentHighScore;
        showMessage('שיא חדש! כל הכבוד! 🏆', 'correct');
    }
}

// יצירת מספר רנדומלי
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// יצירת פעולה רנדומלית
function generateOperation() {
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const number = getRandomNumber(1, 10);
    return { operation, number };
}

// יצירת סדרה חדשה
function generateSequence() {
    const sequenceLength = getRandomNumber(3, 5); // מספר פעולות רנדומלי בין 3 ל-5
    const sequence = [];
    currentResult = getRandomNumber(1, 20); // מספר התחלתי
    
    for (let i = 0; i < sequenceLength; i++) {
        const operation = generateOperation();
        sequence.push(operation);
        if (operation.operation === '+') {
            currentResult += operation.number;
        } else {
            currentResult -= operation.number;
        }
    }
    
    return sequence;
}

// הצגת המספר הנוכחי והפעולה
function displayNumberAndOperation(number, operation = '') {
    document.getElementById('current-number').textContent = number;
    document.getElementById('operation').textContent = operation;
}

// הצגת הודעה
function showMessage(message, type = '') {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = 'message ' + type;
}

// התחלת המשחק
async function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    document.getElementById('start-game').disabled = true;
    document.getElementById('input-area').classList.add('hidden');
    showMessage('');
    
    currentSequence = generateSequence();
    let currentNumber = currentResult - calculateSequenceResult(currentSequence); // המספר ההתחלתי
    
    // הצגת המספר ההתחלתי
    displayNumberAndOperation(currentNumber);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // הצגת כל פעולה בסדרה
    for (const operation of currentSequence) {
        const operationText = `${operation.operation}${operation.number}`;
        displayNumberAndOperation('', operationText);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // הצגת שדה הקלט
    displayNumberAndOperation('?');
    document.getElementById('input-area').classList.remove('hidden');
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
    document.getElementById('start-game').disabled = false;
}

// חישוב תוצאת הסדרה
function calculateSequenceResult(sequence) {
    return sequence.reduce((result, operation) => {
        return operation.operation === '+' ? result + operation.number : result - operation.number;
    }, 0);
}

// בדיקת תשובה
function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('answer-input').value);
    if (isNaN(userAnswer)) {
        showMessage('אנא הכנס מספר תקין', 'incorrect');
        return;
    }
    
    if (userAnswer === currentResult) {
        score += 10;
        document.getElementById('score').textContent = score;
        showMessage('כל הכבוד! תשובה נכונה! 🎉', 'correct');
        saveHighScore();
    } else {
        showMessage(`טעות! התשובה הנכונה היא ${currentResult} 😢`, 'incorrect');
    }
    
    document.getElementById('input-area').classList.add('hidden');
    isGameRunning = false;
}

// איפוס משחק
function resetGame() {
    score = 0;
    document.getElementById('score').textContent = '0';
    document.getElementById('input-area').classList.add('hidden');
    displayNumberAndOperation('0');
    showMessage('המשחק אופס. לחץ על "התחל משחק" כדי להתחיל!');
    isGameRunning = false;
}

// הוספת מאזיני אירועים
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('reset-game').addEventListener('click', resetGame);
document.getElementById('submit-answer').addEventListener('click', checkAnswer);
document.getElementById('answer-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});
