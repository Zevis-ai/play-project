
const login =(event)=> {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    
    if (!username || !password) {
        alert('נא למלא את כל השדות');
        return;
    }

    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        alert('שם משתמש או סיסמה שגויים');
        return;
    }

    
    const userData = {
        username,
        email: user.email,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    alert('התחברת בהצלחה!');
    window.location.href = 'index.html';
}


const signUp = (event) => {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
        alert('נא למלא את כל השדות');
        return;
    }

    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.username === username)) {
        alert('שם המשתמש כבר תפוס');
        return;
    }

    if (users.some(user => user.email === email)) {
        alert('כתובת האימייל כבר רשומה במערכת');
        return;
    }

    
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    
    const userData = {
        username,
        email,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    alert('נרשמת בהצלחה!');
    window.location.href = 'index.html';
}


const logout =()=> {
    localStorage.removeItem('userData');
    window.location.href = 'login.html';
}


const checkLoginStatus =()=> {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.isLoggedIn) {
        window.location.href = 'login.html';
        return null;
    }
    return userData;
}
