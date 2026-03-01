const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Connect to database
const db = new sqlite3.Database('./university.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to university.db');
    }
});


// GET all
app.get('/api/courses', (req, res) => {
    const sql = 'SELECT * FROM courses';

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


// GET by ID
app.get('/api/courses/:id', (req, res) => {
    const sql = 'SELECT * FROM courses WHERE id = ?';
    const id = req.params.id;

    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(row);
    });
});


// POST request
app.post('/api/courses', (req, res) => {
    const { course_code, course_name, credits, description, semester } = req.body;

    const sql = `
        INSERT INTO courses (course_code, course_name, credits, description, semester)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [course_code, course_name, credits, description, semester], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: 'Course created successfully',
            id: this.lastID
        });
    });
});


// PUT request
app.put('/api/courses/:id', (req, res) => {
    const { course_code, course_name, credits, description, semester } = req.body;
    const id = req.params.id;

    const sql = `
        UPDATE courses
        SET course_code = ?,
            course_name = ?,
            credits = ?,
            description = ?,
            semester = ?
        WHERE id = ?
    `;

    db.run(sql, [course_code, course_name, credits, description, semester, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({ message: 'Course updated successfully' });
    });
});


// DEL request
app.delete('/api/courses/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM courses WHERE id = ?';

    db.run(sql, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({ message: 'Course deleted successfully' });
    });
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});