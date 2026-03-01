// Import sqlite3
const sqlite3 = require('sqlite3').verbose();

// Create database called university.db
const db = new sqlite3.Database('./university.db', (err) => {
    if (err) {
        console.error('Error creating database:', err.message);
    } else {
        console.log('Connected to university.db');
    }
});

// Define courses table using CREATE TABLE
const createCoursesTable = `
CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    description TEXT NOT NULL,
    semester TEXT NOT NULL
);
`;

// Table creation
db.run(createCoursesTable, (err) => {
    if (err) {
        console.error('Error creating courses table:', err.message);
    } else {
        console.log('Courses table created successfully.');
    }
});

// Close database connection
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});