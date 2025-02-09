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
const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

// טעינת שיא
function loadHighScore() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        const gameStats = JSON.parse(localStorage.getItem(`dice_game_stats_${userData.username}`) || '{"highScore": 0}');
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
        localStorage.setItem(`dice_game_stats_${userData.username}`, JSON.stringify(gameStats));
        document.getElementById('highScore').textContent = currentHighScore;
        showMessage('שיא חדש! כל הכבוד! 🏆', 'win');
    }
}

// הטלת קובייה
function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

// הצגת קובייה
function displayDie(value, elementId) {
    const diceElement = document.getElementById(elementId);
    diceElement.textContent = diceSymbols[value - 1];
    diceElement.classList.add('rolling');
    setTimeout(() => diceElement.classList.remove('rolling'), 500);
}

// הצגת הודעה
function showMessage(message, type = '') {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = 'message ' + type;
}

// הטלת קוביות
async function rollDice() {
    // נטרול כפתורים בזמן ההטלה
    document.getElementById('rollDice').disabled = true;
    document.getElementById('playComputer').disabled = true;
    
    // הטלת הקוביות
    const dice1 = rollDie();
    const dice2 = rollDie();
    const sum = dice1 + dice2;
    
    // הצגת האנימציה והתוצאות
    displayDie(dice1, 'dice1');
    displayDie(dice2, 'dice2');
    
    // עדכון התוצאה לאחר האנימציה
    setTimeout(() => {
        document.getElementById('diceSum').textContent = sum;
        
        // עדכון הניקוד
        if (dice1 === dice2) {
            score += sum * 2; // בונוס לזוג
            showMessage('זוג! קיבלת בונוס כפול! 🎯', 'win');
        } else {
            score += sum;
            showMessage('הטלת את הקוביות! 🎲');
        }
        
        document.getElementById('score').textContent = score;
        saveHighScore();
        
        // שחרור הכפתורים
        document.getElementById('rollDice').disabled = false;
        document.getElementById('playComputer').disabled = false;
    }, 500);
}

// משחק נגד המחשב
async function playAgainstComputer() {
    // נטרול כפתורים
    document.getElementById('rollDice').disabled = true;
    document.getElementById('playComputer').disabled = true;
    
    // הצגת אזור המחשב
    document.getElementById('computerSection').classList.remove('hidden');
    
    // הטלת הקוביות של השחקן
    const playerDice1 = rollDie();
    const playerDice2 = rollDie();
    const playerSum = playerDice1 + playerDice2;
    
    // הצגת קוביות השחקן
    displayDie(playerDice1, 'dice1');
    displayDie(playerDice2, 'dice2');
    document.getElementById('diceSum').textContent = playerSum;
    
    // המתנה קצרה לפני הטלת הקוביות של המחשב
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // הטלת הקוביות של המחשב
    const computerDice1 = rollDie();
    const computerDice2 = rollDie();
    const computerSum = computerDice1 + computerDice2;
    
    // הצגת קוביות המחשב
    displayDie(computerDice1, 'computerDice1');
    displayDie(computerDice2, 'computerDice2');
    document.getElementById('computerSum').textContent = computerSum;
    
    // קביעת המנצח
    setTimeout(() => {
        if (playerSum > computerSum) {
            score += 10;
            showMessage('ניצחת את המחשב! 🎉', 'win');
        } else if (playerSum < computerSum) {
            showMessage('המחשב ניצח! 😢', 'lose');
        } else {
            score += 5;
            showMessage('תיקו! 🤝', 'tie');
        }
        
        document.getElementById('score').textContent = score;
        saveHighScore();
        
        // שחרור הכפתורים
        document.getElementById('rollDice').disabled = false;
        document.getElementById('playComputer').disabled = false;
    }, 500);
}

// איפוס משחק
function resetGame() {
    score = 0;
    document.getElementById('score').textContent = '0';
    document.getElementById('diceSum').textContent = '0';
    document.getElementById('computerSum').textContent = '0';
    document.getElementById('dice1').textContent = '⚀';
    document.getElementById('dice2').textContent = '⚀';
    document.getElementById('computerDice1').textContent = '⚀';
    document.getElementById('computerDice2').textContent = '⚀';
    document.getElementById('computerSection').classList.add('hidden');
    showMessage('המשחק אופס. בהצלחה! 🎲');
}

// הוספת מאזיני אירועים
document.getElementById('rollDice').addEventListener('click', rollDice);
document.getElementById('playComputer').addEventListener('click', playAgainstComputer);
document.getElementById('resetGame').addEventListener('click', resetGame);
