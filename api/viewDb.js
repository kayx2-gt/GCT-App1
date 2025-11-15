// node viewDB.js
const sqlite3 = require('sqlite3').verbose();

// Open the database
const db = new sqlite3.Database('ngilo.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to ngilo.db');
    }
});

// Show all tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Tables in database:', tables.map(t => t.name));
    }
});

// Show all users
db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Users:');
        console.table(rows);
    }
});

// Show all messages
db.all("SELECT * FROM messages", [], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Messages:');
        console.table(rows);
    }
});

